import React from "react";
import { Select } from "antd";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { DateRange } from "../types";
import { useTranslation } from "react-i18next";

dayjs.extend(quarterOfYear);

const { Option } = Select;

interface TimeRangeSelectorProps {
  setDateRange: (range: DateRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  setDateRange,
}) => {
  const [translate] = useTranslation();
  const handleChange = (value: string) => {
    const now = dayjs();
    let from: string;
    let to: string;

    switch (value) {
      case "month-current":
        from = now.startOf("month").format("YYYY-MM-DD");
        to = now.endOf("month").format("YYYY-MM-DD");
        break;
      case "month-previous":
        from = now.subtract(1, "month").startOf("month").format("YYYY-MM-DD");
        to = now.subtract(1, "month").endOf("month").format("YYYY-MM-DD");
        break;
      case "quarter-current":
        from = now.startOf("quarter").format("YYYY-MM-DD");
        to = now.endOf("quarter").format("YYYY-MM-DD");
        break;
      case "quarter-previous":
        // eslint-disable-next-line no-case-declarations
        const previousQuarter = now.subtract(1, "quarter");
        from = previousQuarter.startOf("quarter").format("YYYY-MM-DD");
        to = previousQuarter.endOf("quarter").format("YYYY-MM-DD");
        break;
      case "year-current":
        from = now.startOf("year").format("YYYY-MM-DD");
        to = now.endOf("year").format("YYYY-MM-DD");
        break;
      case "year-previous":
        // eslint-disable-next-line no-case-declarations
        const previousYear = now.subtract(1, "year");
        from = previousYear.startOf("year").format("YYYY-MM-DD");
        to = previousYear.endOf("year").format("YYYY-MM-DD");
        break;
      default:
        from = now.startOf("month").format("YYYY-MM-DD");
        to = now.endOf("month").format("YYYY-MM-DD");
    }

    setDateRange({ from, to });
  };

  return (
    <Select
      defaultValue="month-current"
      onChange={handleChange}
      style={{ width: 200 }}
    >
      <Option value="month-current">
        {translate("dashboards.timeRangeSelector.monthCurrent")}
      </Option>
      <Option value="month-previous">
        {translate("dashboards.timeRangeSelector.monthPrevious")}
      </Option>
      <Option value="quarter-current">
        {translate("dashboards.timeRangeSelector.quarterCurrent")}
      </Option>
      <Option value="quarter-previous">
        {translate("dashboards.timeRangeSelector.quarterPrevious")}
      </Option>
      <Option value="year-current">
        {translate("dashboards.timeRangeSelector.yearCurrent")}
      </Option>
      <Option value="year-previous">
        {translate("dashboards.timeRangeSelector.yearPrevious")}
      </Option>
    </Select>
  );
};

export default TimeRangeSelector;
