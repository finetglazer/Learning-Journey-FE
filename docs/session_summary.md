# Session Summary: API Optimization and Architecture Refactor

## Overview
In this session, we addressed several critical performance issues related to redundant API calls, unnecessary component re-rendering, and improper state management during authentication flows.

## 1. Centralized Data Fetching
**Problem:**
Critical application data (User Profile, Daily Limits, Sleep Hours, Calendars, Projects) was being fetched redundantly in every main page component (`page.tsx`, `calendar/page.tsx`, etc.). This caused multiple identical network requests on every navigation.

**Solution:**
- **Refactored `src/hooks/app-context.ts`**:
    - Created a centralized fetching mechanism that loads all initial data once when the `userId` becomes available.
    - Added `teamProjects` state and `getProjects` function to the global context.
- **Cleaned Up Pages**:
    - Removed local data fetching logic and redundant state from:
        - `src/app/page.tsx`
        - `src/app/(main)/calendar/page.tsx`
        - `src/app/(main)/projects/[projectId]/page.tsx`
        - `src/app/(main)/calendar/planning/page.tsx`

## 2. Implemented Persistent Main Layout
**Problem:**
Navigating between sidebar items (e.g., from Calendar to Projects) caused the entire `HeaderBar` and `Sidebar` to unmount and remount. This triggered their internal API calls (notifications, project lists) repeatedly and reset UI states (like collapsed sections).

**Solution:**
- **Created `src/components/layout/main-layout.tsx`**: A persistent layout component housing the Header, Sidebar, and shared Context Providers.
- **Created `src/components/layout/main-layout-context.tsx`**: To share layout-specific state (modals, selected project) across the app.
- **Created `src/app/(main)/layout.tsx`**: To wrap all routes in the `(main)` group with this persistent layout.
- **Refactored Pages**: Stripped the shell UI (header/sidebar) from individual page files, leaving only the content.

## 3. Fixed Unwanted API Calls on Sign-In
**Problem:**
API calls were triggering on the Sign-In page because the `userId` cookie persisted after logout, and `AppContext` blindly initiated fetches based on seeing a `userId`.

**Solution:**
- **Updated `handleLogOut`**: In `MainLayout`, explicitly calls `setUserId(null)` to clear the session state immediately.
- **Enhanced `AppContext`**: Added a check for `accessToken` in `localStorage`. Data fetching is now strictly prevented if no valid token is present, even if a `userId` cookie exists.

## 4. Fixed Duplicate Notification Calls
**Problem:**
The Notification API was being called twice (e.g., for `ALL` and `UNREAD` filters). This was due to `React.StrictMode` mounting the `HeaderBar` twice without cleaning up the previous RxJS subscription.

**Solution:**
- **Updated `src/components/core/header-bar/header-bar.tsx`**: Modified the `useEffect` to properly return a cleanup function that cancels the previous subscription when the component unmounts or re-runs.

---
## Key Files Modified
1.  `src/hooks/app-context.ts`
2.  `src/components/layout/main-layout.tsx` (New)
3.  `src/components/layout/main-layout-context.tsx` (New)
4.  `src/app/(main)/layout.tsx` (New)
5.  `src/components/core/header-bar/header-bar.tsx`
6.  `src/app/(main)/calendar/page.tsx`
7.  `src/app/(main)/calendar/planning/page.tsx`
8.  `src/app/(main)/projects/[projectId]/page.tsx`
9.  `src/app/(main)/settings/page.tsx`
