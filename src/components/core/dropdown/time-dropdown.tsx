"use client"

import { convertTimeIdToTime, generateTimeSlots } from "@/lib/utils";
import { Button, Dropdown, Input, Menu } from 'antd';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Icon } from '../icon/icon';

export interface TimeDropdownProps {
    selectedTimeId: string | null;
    setSelectedTimeId: Dispatch<SetStateAction<string | null>>;
};

export const TimeDropdown = (props: TimeDropdownProps) => {
    const {
        selectedTimeId,
        setSelectedTimeId,
    } = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [timeStr, setTimeStr] = useState<string>("");

    const timeSlots = useMemo(() => generateTimeSlots(timeStr), [timeStr]);

    const handleMenuClick = (e: any) => {
        setSelectedTimeId(e.key);
        setIsOpen(false);
    };

    const chevronClassName = "h-4.5 w-4.5";

    return (
        <Dropdown
            trigger={['click']}
            open={isOpen}
            onOpenChange={setIsOpen}
            popupRender={() => (
                <div style={{ backgroundColor: 'transparent', border: '1px solid #888', borderRadius: '8px' }}>
                    <Input
                        placeholder="Enter time"
                        style={{ margin: '8px', width: 'calc(100% - 16px)', color: "#7D8FB3" }}
                        onChange={(e) => {
                            setTimeStr(e.target.value);
                        }}
                        value={timeStr}
                    />
                    <Menu
                        onClick={handleMenuClick}
                        style={{
                            backgroundColor: 'transparent',
                            maxHeight: 240,
                            overflow: 'auto'
                        }}
                        selectedKeys={selectedTimeId ? [selectedTimeId] : []}
                    >
                        {timeSlots.map((time) => (
                            <Menu.Item
                                key={time.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    color: selectedTimeId === time.id ? '#91EEFF' : '#A0A0A0',
                                    backgroundColor: selectedTimeId === time.id ? '#4A6DE4' : 'transparent',
                                }}
                            >
                                {selectedTimeId === time.id && <Icon name="SuccessIcon" className="text-[#91EEFF] h-4 w-4 mr-2" />}
                                <span>{time.display}</span>
                            </Menu.Item>
                        ))}
                    </Menu>
                </div>
            )}
        >
            <Button
                style={{
                    border: '2px solid #91EEFF',
                    backgroundColor: 'transparent',
                    color: '#7D8FB3',
                    width: 224,
                    fontSize: '0.9rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <span style={{ flexGrow: 1, textAlign: 'left', color: "#7D8FB3" }}>{convertTimeIdToTime(selectedTimeId || "")}</span>
                {isOpen ? <ChevronUp className={chevronClassName} /> : <ChevronDown className={chevronClassName} />}
            </Button>
        </Dropdown>
    );
};