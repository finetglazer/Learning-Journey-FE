
// Auth routes
export const SIGN_IN_ROUTE = "/sign-in";
export const SIGN_UP_ROUTE = "/sign-up";
export const VERIFY_EMAIL_ROUTE = "/verify-email";
export const FORGOT_PASSWORD_ROUTE = "/forgot-password";
export const RESET_PASSWORD_ROUTE = "/reset-password";
export const LOGIN_SUCCESS_ROUTE = "/login-success";
export const GOOGLE_OAUTH2_ROUTE = "http://localhost:8080/oauth2/authorization/google";

// Home page routes
export const ROOT_ROUTE = "/";
export const HOME_BASE_ROUTE = "/home";

// Scheduling routes
export const CALENDAR_ROUTE = "/calendar";
export const CALENDAR_PLANNING_ROUTE = "/calendar/planning";

// Project routes
export const PROJECT_ROUTE = "/projects";
export const getProjectDetailRoute = (projectId: number, tab?: string, taskId?: number) => {
    let url = `/projects/${projectId}`;
    const params = new URLSearchParams();
    if (tab) params.set("tab", tab);
    if (taskId) params.set("taskId", String(taskId));
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
};

// Community route
export const COMMUNITY_ROUTE = "/posts";

// Settings routes
export const SETTINGS_ROUTE = "/settings";
export const getSettingsRoute = (tab: string) => `/settings?tab=${tab}`;
