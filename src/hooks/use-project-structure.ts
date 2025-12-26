import { useQuery } from '@tanstack/react-query';
import { AppContext, AppContextProps } from './app-context';
import { useContext } from 'react';
import { PM_Deliverable } from '@/model/project-management';

/**
 * Response type for project skeleton endpoint
 */
type ProjectSkeletonResponse = {
    data?: PM_Deliverable[];
} & PM_Deliverable[];

/**
 * Hook for fetching lightweight project skeleton
 * Returns deliverables and phases with task counts, but NO task details
 * Used for initial page load before lazy-loading tasks
 */
export function useProjectSkeleton(projectId: string | undefined) {
    const { projectRepository } = useContext<AppContextProps>(AppContext);

    return useQuery<{ data: PM_Deliverable[] }>({
        queryKey: ['project-skeleton', projectId],
        queryFn: async () => {
            if (!projectRepository || !projectId) {
                throw new Error('Project repository or projectId not available');
            }

            return new Promise<{ data: PM_Deliverable[] }>((resolve, reject) => {
                projectRepository.getProjectSkeleton({ projectId }).subscribe({
                    next: (res) => {
                        if (res?.status) {
                            // Return the full response with data property
                            resolve({ data: res.data.data });
                        } else {
                            reject(new Error(res?.message || 'Failed to fetch project skeleton'));
                        }
                    },
                    error: (err) => reject(err),
                });
            });
        },
        enabled: !!projectId && !!projectRepository,
        staleTime: 60 * 1000, // 1 minute - fresher data for team collaboration
        gcTime: 10 * 60 * 1000, // 10 minutes - keep cache warm
        refetchOnWindowFocus: true, // Auto-refresh when returning from other apps/tabs
        refetchOnMount: true, // Auto-refresh stale data when navigating between pages
    });
}

/**
 * Hook for lazy loading tasks when a phase is expanded
 * Returns full task list for a specific phase
 * Only fetches when enabled (phase is expanded)
 */
export function usePhaseTasksQuery(
    projectId: string | undefined,
    phaseId: number | undefined,
    enabled: boolean
) {
    const { projectRepository } = useContext<AppContextProps>(AppContext);

    return useQuery({
        queryKey: ['phase-tasks', projectId, phaseId],
        queryFn: async () => {
            if (!projectRepository || !projectId || !phaseId) {
                throw new Error('Repository, projectId, or phaseId not available');
            }

            return new Promise((resolve, reject) => {
                projectRepository.getTasksByPhase({ projectId, phaseId }).subscribe({
                    next: (res) => {
                        if (res?.status) {
                            resolve(res.data); // Backend now returns data directly, not nested
                        } else {
                            reject(new Error(res?.message || 'Failed to fetch phase tasks'));
                        }
                    },
                    error: (err) => reject(err),
                });
            });
        },
        enabled: enabled && !!projectId && !!phaseId && !!projectRepository,
        staleTime: 60 * 1000, // 1 minute - fresher data for team collaboration
        gcTime: 10 * 60 * 1000, // 10 minutes - keep cache warm
        refetchOnWindowFocus: true, // Auto-refresh when returning from other apps/tabs
    });
}
