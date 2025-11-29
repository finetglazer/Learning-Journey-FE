import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getRiskLevelLabel } from "@/model/project-management";
import { ChevronDown } from "lucide-react";

export const RiskLevelDropdown = ({
    value,
    onChange,
}: {
    value: number | undefined;
    onChange: (val: number) => void;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-[140px] justify-between font-normal text-muted-foreground bg-transparent border-slate-200 h-8 text-xs"
                >
                    {getRiskLevelLabel(value)}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[140px]"
                align="start"
            >
                {[5, 4, 3, 2, 1].map((num) => {
                    const level = num;
                    return (
                        <DropdownMenuItem
                            key={num}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(level);
                            }}
                            className="text-xs flex items-center gap-2 cursor-pointer"
                        >
                            <div
                                className={`h-4 w-4 rounded-full border flex items-center justify-center ${value === level ? "border-blue-500 bg-blue-50" : "border-slate-300"
                                    }`}
                            >
                                {value === level && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                            </div>
                            {getRiskLevelLabel(level)}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
