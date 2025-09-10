/* eslint-disable no-console */
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import ConfigStore from "core/config/ConfigStore";

export const API_SIGNALR_ROUTE = `${ConfigStore.getInstance().get(
  "realtimeApiUrl"
)}/share/chathub`;

export enum SignalRMethodName {
  ReceiveMessageComment = "ReceiveMessageComment",
  ReceiveNotification = "ReceiveNotification",
}

export class SignalRService {
  private rConnection: HubConnection;

  constructor() {
    this.rConnection = new HubConnectionBuilder()
      .withUrl(API_SIGNALR_ROUTE, {
        headers: {
          // "Access-Control-Allow-Origin": "*",
        },
        withCredentials: false,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.startConnection();

    this.rConnection.onreconnecting((error) => {
      console.log("SignalR reconnecting...", error);
    });

    this.rConnection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
    });

    this.rConnection.onclose((error) => {
      console.log("SignalR disconnected", error);
    });
  }

  private startConnection = async () => {
    try {
      await this.rConnection.start();
      console.log("SignalR connection started");
    } catch (error: unknown) {
      console.error("SignalR connection error: ", error);
      // Reconnect after 5 seconds
      // const RECONNECT_TIMEOUT = 5000;
      // setTimeout(this.startConnection, RECONNECT_TIMEOUT);
    }
  };

  public registerChannel<T>(
    channel: SignalRMethodName,
    callback: (data: T) => void
  ) {
    this.rConnection.on(channel.toString(), (data: T) => {
      if (typeof callback === "function") {
        callback(data);
      }
    });
  }

  public offChanel = (channel: SignalRMethodName) => {
    this.rConnection.off(channel.toString());
  };

  public stopConnection = () => {
    this.rConnection.stop().then(() => {
      console.log("SignalR disconnected");
    });
  };
}

const signalRService = new SignalRService();
export default signalRService;
