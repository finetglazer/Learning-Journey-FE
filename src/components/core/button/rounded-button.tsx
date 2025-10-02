import { cn } from "@/lib/utils";
import { IntegratedButton, IntegratedButtonProps } from "./integrated-button";

export interface RoundedButtonProps extends IntegratedButtonProps { };

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
            "font-semibold text-base rounded-full py-2 px-5",
            "bg-white text-slate-700",
            "border border-gray-200 shadow-sm",
            "transition-all duration-200 ease-in-out",
            "active:scale-95",
            "disabled:opacity-60 disabled:bg-gray-500 disabled:cursor-not-allowed",
            "w-25",
            buttonClassName
        ),
        labelClassName: cn("font-semibold", labelClassName),
    }

    return (
        <IntegratedButton  {...cloneIntegratedButtonProps} />
    );
};