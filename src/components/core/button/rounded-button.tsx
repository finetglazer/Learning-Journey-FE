import { cn } from "@/lib/utils";
import { IntegratedButton, IntegratedButtonProps } from "./integrated-button";

export interface RoundedButtonProps extends IntegratedButtonProps {};

export const RoundedButton = (props: RoundedButtonProps) => {
    const {
        wrapperClassName,
        buttonClassName,
        labelClassName,
    } = props;

    const cloneIntegratedButtonProps = {
        ...props,
        wrapperClassName: cn("w-auto m-0", wrapperClassName),
        buttonClassName: cn(
            "font-bold text-xl rounded-full py-3 px-8",
            "bg-emerald-400 text-indigo-900",
            "border-4 border-white",

            "transition-all duration-200 ease-in-out",
            "active:scale-95",

            "disabled:opacity-60 disabled:bg-gray-500 disabled:text-white disabled:cursor-not-allowed",

            buttonClassName
        ),
        labelClassName: cn("font-bold", labelClassName),
    } 

    return (
        <IntegratedButton  { ...cloneIntegratedButtonProps } />
    );
};