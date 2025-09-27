"use client"

import React, { isValidElement } from "react";

export interface SettingLayoutProps {
    title?: string;
    children?: React.ReactNode;
};

export const SettingLayout = (props: SettingLayoutProps) => {
    const {
        title,
        children,
    } = props;

    return (
        <div className="h-full">
            <p className="mt-18 ml-12 font-bold text-5xl">{title}</p>
            <div className="mt-20 h-full flex justify-center">
                {isValidElement(children) ? children : null}
            </div>
        </div>
    );
};