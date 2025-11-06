
export interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
    format?: string;
};

export const TimePicker = ({ value, onChange, format = "HH:mm" }: TimePickerProps) => {
    const displayValue = value && value.match(/^\d{2}:\d{2}$/) ? value : "00:00";

    return (
        <input
            type="time"
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-40 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm"
        />
    );
};