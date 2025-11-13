import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { Fragment, useEffect, useRef } from 'react';

export interface DayMonthPickerProps {
    value: string; // e.g., "25/12"
    onChange: (value: string) => void;
}

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

interface SelectListboxProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    widthClass: string;
}

const SelectListbox = ({ value, onChange, options, widthClass }: SelectListboxProps) => {
    const listRef = useRef<HTMLUListElement>(null);

    // This effect scrolls the dropdown to the selected value when it opens
    useEffect(() => {
        if (value && listRef.current) {
            const index = options.indexOf(value);
            if (index > -1) {
                const optionEl = listRef.current.querySelector(`[id$="-option-${index}"]`);
                if (optionEl) {
                    optionEl.scrollIntoView({ block: 'nearest' });
                }
            }
        }
    }, [value, options]); // Re-run if value or options change

    return (
        <Listbox value={value} onChange={onChange}>
            <div className={`relative ${widthClass}`}>
                {/* 1. The Trigger Button (styled like an input) */}
                <Listbox.Button
                    className="relative w-full cursor-default rounded-md border border-gray-300 bg-white
                               py-2 pl-3 pr-10 text-left text-sm shadow-sm
                               focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                    <span className="block truncate">{value}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>

                {/* 2. The Dropdown Options */}
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options
                        ref={listRef} // Set the ref for scrolling
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md
                                   bg-white py-1 text-base shadow-lg ring-1
                                   ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                        {options.map((option, index) => (
                            <Listbox.Option
                                key={option}
                                value={option}
                                className={({ active, selected }) =>
                                    `relative cursor-default select-none py-2 pl-7 pr-4 ${selected
                                        ? 'bg-blue-600 text-white'
                                        : active
                                            ? 'bg-blue-100 text-blue-900'
                                            : 'text-gray-900'
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {option}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-white">
                                                <Check className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

export const DayMonthPicker = ({ value, onChange }: DayMonthPickerProps) => {
    // Ensure value is always in "DD/MM" format, even on first load
    const [day = "01", month = "01"] = (value || "01/01").split('/');

    const handleDayChange = (newDay: string) => {
        onChange(`${newDay}/${month}`);
    };

    const handleMonthChange = (newMonth: string) => {
        onChange(`${day}/${newMonth}`);
    };

    return (
        <div className="flex space-x-1">
            <SelectListbox
                value={day}
                onChange={handleDayChange}
                options={DAYS}
                widthClass="w-20"
            />
            <SelectListbox
                value={month}
                onChange={handleMonthChange}
                options={MONTHS}
                widthClass="w-20"
            />
        </div>
    );
};