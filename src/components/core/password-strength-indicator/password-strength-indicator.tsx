"use client"

import { cn } from "@/lib/utils";

export interface PasswordStrenghtIndicatorProps {
    currentSatisfiedCategoriesNumber: number;
    minimumSatisfiedCategories: number;
    categoryNumber: number;
    wrapperClassName?: string;
    textIndicatorClassName?: string;
}

export const PasswordStrengthIndicator = (props: PasswordStrenghtIndicatorProps) => {
    const {
        currentSatisfiedCategoriesNumber,
        minimumSatisfiedCategories,
        categoryNumber,
        wrapperClassName,
        textIndicatorClassName
    } = props;

    return (
        <div className={cn("-mt-1", wrapperClassName)}>
            <span className={cn(`text-${currentSatisfiedCategoriesNumber < minimumSatisfiedCategories ? "red" : "green"}-600 text-[0.7rem]`, textIndicatorClassName)}>
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