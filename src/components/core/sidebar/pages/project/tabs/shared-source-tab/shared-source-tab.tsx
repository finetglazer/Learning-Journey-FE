"use client";

import { SharedSourceContext, useSharedSourceHook } from "./shared-source-context";
import { SharedSourceTabContent } from "./shared-source-tab-content";

export function SharedSourceTab() {
    return (
        <SharedSourceContext.Provider value={useSharedSourceHook()}>
            <SharedSourceTabContent />
        </SharedSourceContext.Provider>
    );
};