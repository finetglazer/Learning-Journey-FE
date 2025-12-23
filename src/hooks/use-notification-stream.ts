import { useEffect, useRef } from "react";
import { fetchEventSource, EventSourceMessage } from "@microsoft/fetch-event-source";
import { isNil } from "lodash";
import { toast } from "sonner";
import { Notification } from "@/model/notification";

interface UseNotificationStreamProps {
    userId: number | null;
    onNewNotification: (notification: Notification) => void;
}

export const useNotificationStream = ({ userId, onNewNotification }: UseNotificationStreamProps) => {
    // We use a ref to prevent 'onNewNotification' from triggering re-connections if it changes
    // (though ideally it should be stable).
    const onNewNotificationRef = useRef(onNewNotification);
    onNewNotificationRef.current = onNewNotification;

    useEffect(() => {
        if (isNil(userId)) return;

        const controller = new AbortController();
        const { signal } = controller;

        const connectSSE = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            try {
                await fetchEventSource(`${process.env.NEXT_PUBLIC_API_URL}/notifications/stream/${userId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-User-Id": String(userId),
                    },
                    signal: signal,

                    onmessage(event: EventSourceMessage) {
                        try {
                            // 1. Handle Heartbeat
                            if (event.event === 'ping') {
                                // console.log("Heartbeat received");
                                return;
                            }

                            // 2. Handle Graceful Shutdown
                            if (event.event === 'SHUTDOWN') {
                                console.log("Server shutting down, closing connection.");
                                controller.abort(); // Stop connection
                                return;
                            }

                            // 3. Handle Notification
                            // Default event or named event
                            if (event.event === 'NEW_NOTIFICATION' || !event.event) {
                                const newNotification = JSON.parse(event.data);
                                onNewNotificationRef.current(newNotification);
                            }

                        } catch (error) {
                            console.error("Error processing SSE event", error);
                        }
                    },

                    async onopen(response) {
                        // Reset backoff if connection succeeds
                        if (response.ok && response.status === 200) {
                            console.log("SSE Connected");
                            return;
                        }

                        // If we get here, it means non-200 status but not an error thrown yet.
                        // usually fetchEventSource throws for non-200 unless we handle it here?
                        // Actually, fetchEventSource default behavior handles 200 OK.
                        // If 401/403, we should probably throw a fatal error.
                        if (response.status === 401 || response.status === 403) {
                            throw new Error("UNAUTHORIZED"); // Trigger onError
                        }
                    },

                    onerror(err) {
                        // logic for health probe will happen via the retry strategy which fetch-event-source supports?
                        // fetch-event-source has built-in retry. But we want custom Health Probe logic.

                        // If it's a manual abort, don't retry.
                        if (signal.aborted) {
                            throw err; // Stop retrying
                        }

                        // Case 5: User Logged Out (Hard Stop)
                        if (err.message === "UNAUTHORIZED") {
                            console.log("Unauthorized, stopping SSE.");
                            throw err; // Stop retrying
                        }

                        console.error("SSE Connection Error:", err);

                        // We throw an error to trigger the Health Probe logic explicitly?
                        // Or we can just let it retry?
                        // The Requirement: "Implement the fetch('/health-check') probe logic before allowing a reconnection."
                        // This means we shouldn't just let fetchEventSource retry blindly.
                        // We should throw to stop it, and then manage our own reconnection loop externally?
                        // Or rely on onclose?

                        // fetchEventSource doesn't have an easy "pause and probe" built-in callback that waits asynchronously 
                        // effectively before deciding to retry the main stream.

                        // The library allows 'onerror' to return a number (milliseconds) to wait before retrying.
                        // If we return nothing/undefined, it retries immediately (or default).
                        // If we throw, it stops.

                        // STRATEGY: 
                        // We cannot easily inject an async probe inside 'onerror' (it expects sync return or throw).
                        // So we will throw to "break" the current fetchEventSource loop.
                        // Then, we'll have a separate logic (maybe inside this useEffect) that catches the break,
                        // enters a "Health Probe" mode, and once healthy, restarts connectSSE.

                        throw err; // Force close so we can switch to Probe mode.
                    }
                });
            } catch (err: any) {
                if (signal.aborted) return;

                // If 401, stop forever.
                if (err.message === "UNAUTHORIZED") return;

                // Case 3 & 4: Service Downtime / Network Glitch -> Health Probe Mode
                console.log("Connection lost. Starting Health Probe...");
                await runHealthProbeStragegy(signal);

                // Once Probe succeeds, we loop back since this is inside... wait.
                // We need a loop structure to restart connectSSE() *after* probe returns.
                // Recursion is easiest here.
                if (!signal.aborted) {
                    connectSSE();
                }
            }
        };

        // Recursive Health Probe Strategy
        const runHealthProbeStragegy = async (signal: AbortSignal) => {
            let retryCount = 0;
            const backoffDelays = [2000, 5000, 10000, 30000]; // 2s, 5s, 10s, 30s

            // Loop until healthy or aborted
            while (!signal.aborted) {
                try {
                    const healthRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/health-check`, {
                        signal // allows cancelling probe if component unmounts
                    });

                    if (healthRes.ok) {
                        console.log("Health Probe: System is UP. Reconnecting stream...");
                        return; // Exit probe mode, caller will reconnect stream
                    }

                    // If 503, user requested "Sleep (Wait 2 mins)"
                    if (healthRes.status === 503) {
                        console.log("Health Probe: 503 Service Unavailable. Sleeping for 2 mins...");
                        await new Promise(r => setTimeout(r, 120000)); // 2 minutes
                        // after sleep, assume we retry probe immediately or reset backoff?
                        // Let's just loop again.
                        continue;
                    }

                } catch (e: any) {
                    // Network error (fetch failed completely)
                    console.log("Health Probe: Network/Server unreachable.");
                }

                // Calculate delay
                // If we had a 503 above, we already waited 2 mins.
                // If we are here, it's either a failed status (non-503, non-200) or network error.
                // Use exponential backoff.
                const delay = backoffDelays[Math.min(retryCount, backoffDelays.length - 1)];
                console.log(`Health Probe: Retrying in ${delay}ms...`);

                await new Promise(r => setTimeout(r, delay));
                retryCount++;
            }
        };

        connectSSE();

        return () => {
            controller.abort();
        };
    }, [userId]);
};
