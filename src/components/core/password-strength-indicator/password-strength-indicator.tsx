"use client"

import { cn, getNumberOfSatisfiedCategories } from "@/lib/utils";
import { useMemo } from "react";

export interface PasswordStrenghtIndicatorProps {
    currentPassword: string | null;
    minimumSatisfiedCategories: number;
    categoryNumber: number;
    wrapperClassName?: string;
    textIndicatorClassName?: string;
}

export const PasswordStrengthIndicator = (props: PasswordStrenghtIndicatorProps) => {
    const {
        currentPassword,
        minimumSatisfiedCategories,
        categoryNumber,
        wrapperClassName,
        textIndicatorClassName
    } = props;

    const currentSatisfiedCategoriesNumber = useMemo(() => {
        return getNumberOfSatisfiedCategories(currentPassword);
    }, [currentPassword]);

    return (
        <div className={cn("-mt-1", wrapperClassName)}>
            <span className={cn(`${currentSatisfiedCategoriesNumber < minimumSatisfiedCategories ? "text-red-600" : "text-green-600"} text-[0.7rem]`, textIndicatorClassName)}>
                {currentSatisfiedCategoriesNumber < minimumSatisfiedCategories ? "Weak" : "Strong"}
            </span>
            <div className="flex mt-1">
                <div className={`${currentSatisfiedCategoriesNumber >= 1 ? "bg-green-600" : "bg-red-600"} mr-[4px] h-1 w-8`} />
                <div className={`${currentSatisfiedCategoriesNumber >= minimumSatisfiedCategories ? "bg-green-600" : "bg-red-600"} mr-[4px] h-1 w-8`} />
                <div className={`${currentSatisfiedCategoriesNumber === categoryNumber ? "bg-green-600" : "bg-red-600"} mr-[4px] h-1 w-8`} />
            </div>
        </div>
    );
};