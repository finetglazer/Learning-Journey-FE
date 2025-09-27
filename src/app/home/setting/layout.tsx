"use client"

import { SettingLayout } from "@/layout/setting-page-layout";
import { SettingLayoutContext, useSettingLayoutHook } from "./setting-layout-context";

export default function SettingPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const {
        ...contextValues
    } = useSettingLayoutHook();

    return (
        <SettingLayoutContext.Provider value={contextValues}>
            <SettingLayout
                title={contextValues?.title}
                children={children}
            />
        </SettingLayoutContext.Provider>
    );
};