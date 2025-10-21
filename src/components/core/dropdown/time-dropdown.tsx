"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn, generateTimeSlots, uuid4 } from "@/lib/utils";
import { Dropdown, Input, Menu, Tooltip } from 'antd';
import { isNil } from "lodash";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Icon } from '../icon/icon';
import { DropdownProps } from "./type";

export interface TimeDropdownProps extends DropdownProps {
};

export const TimeDropdown = (props: TimeDropdownProps) => {
    const {
        selectedItem: selectedTime,
        setSelectedItem: setSelectedTime,
        trigger,
        label,
        labelClassName,
        open,
        onOpenChange,
        useSearch,
        searchPlaceholder,
        searchStyle,
        menuStyle,
        popupStyle,
        menuItemStyle,
        chevronClassName,
        buttonClassName,
        buttonLabelClassName,
    } = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [timeStr, setTimeStr] = useState<string>("");

    const timeSlots = useMemo(() => generateTimeSlots(timeStr), [timeStr]);

    const handleMenuClick = (e: any) => {
        setSelectedTime(timeSlots.find(time => time.id === e.key) || null);
        setIsOpen(false);
    };

    const chevronClass = cn("h-4.5 w-4.5", chevronClassName);

    const handleOpenChange = () => {
        if (typeof onOpenChange === "function") {
            onOpenChange();
        }
        setIsOpen(!(isNil(open) ? isOpen : open));
    };

    const dropdownId = "time-dropdown-";

    return (
        <>
            <Label
                htmlFor={dropdownId}
                className={cn("font-semibold mb-1.5 text-[1.05rem]", labelClassName)}
            >
                {label}
            </Label>
            <div id={dropdownId}>
                <Dropdown
                    trigger={[trigger || "click"]}
                    open={isNil(open) ? isOpen : open}
                    onOpenChange={handleOpenChange}
                    popupRender={() => (
                        <div style={{
                            ...{ backgroundColor: 'transparent', border: '1px solid #888', borderRadius: '8px' },
                            ...popupStyle
                        }}>
                            {useSearch && (
                                <Input
                                    placeholder={searchPlaceholder}
                                    style={{
                                        ...{ margin: '8px', width: 'calc(100% - 16px)', color: "#7D8FB3" },
                                        ...searchStyle
                                    }}
                                    onChange={(e) => {
                                        setTimeStr(e.target.value);
                                    }}
                                    value={timeStr}
                                />
                            )}
                            <Menu
                                onClick={handleMenuClick}
                                style={{
                                    ...{
                                        backgroundColor: 'transparent',
                                        maxHeight: 240,
                                        overflow: 'auto'
                                    },
                                    ...menuStyle
                                }}
                                selectedKeys={selectedTime ? [selectedTime?.id] : []}
                            >
                                {timeSlots.map((item) => (
                                    <Menu.Item
                                        key={item.id}
                                        style={{
                                            ...{
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                color: selectedTime?.id === item.id ? '#91EEFF' : '#A0A0A0',
                                                backgroundColor: selectedTime?.id === item.id ? '#4A6DE4' : 'transparent',
                                            },
                                            ...menuItemStyle
                                        }}
                                    >
                                        {selectedTime?.id === item.id && <Icon name="SuccessIcon" className="text-[#91EEFF] h-4 w-4 mr-2" />}
                                        <span>{item?.content || ""}</span>
                                    </Menu.Item>
                                ))}
                            </Menu>
                        </div >
                    )}
                >
                    <Button
                        className={cn(
                            `
                    border-3
                    border-[#91EEFF]
                    bg-transparent
                    text-[#7D8FB3] 
                    w-56
                    text-[0.9rem]
                    flex justify-between items-center
                    hover:bg-transparent
                    hover:border-[#91EEFF]
                    hover:text-[#7D8FB3]
                    `,
                            buttonClassName)}
                    >
                        <Tooltip
                            title={selectedTime?.content || ""}
                            placement="top"
                        >
                            <span className={cn("flex-grow text-left text-[#7D8FB3] truncate", buttonLabelClassName)}>{selectedTime?.content || ""}</span>
                        </Tooltip>
                        {isOpen ? <ChevronUp className={chevronClass} /> : <ChevronDown className={chevronClass} />}
                    </Button>
                </Dropdown>
            </div>
        </>
    );
};