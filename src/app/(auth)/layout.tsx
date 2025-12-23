"use client"

import Image from "next/image";
import { isValidElement } from "react";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative h-[100vh] w-full">
            <Image
                src="/BG.png"
                alt="background"
                className="object-cover absolute -z-10"
                fill
            />
            <div className="h-full grid place-items-center">
                {isValidElement(children) ? children : null}
            </div>
        </div>
    )
};