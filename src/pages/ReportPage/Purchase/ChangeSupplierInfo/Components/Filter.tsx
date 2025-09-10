import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { isString } from "lodash";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import {
  DateRangePicker,
  FormItem,
  STANDARD_DATE_FORMAT_INVERSE,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
      | "handleChangeMultipleSelectFilter"
      | "handleChangeDateRangeFilter"
      | "handleChangeSelectFilter"
      | "modelFilter"
      | "error"
    > {}

const DATE_FORMAT = [
  STANDARD_DATE_FORMAT_SLASH,
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_INVERSE,
];

export default function Filter({
  modelFilter,
  error,
  onFilter,
  onReset,
  handleChangeDateRangeFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  const changedDateRangeFrom = modelFilter?.changedDateRange?.from;
  const changedDateRangeTo = modelFilter?.changedDateRange?.to;

  const disableFilter =
    !modelFilter?.changedDateRange?.from || !modelFilter?.changedDateRange?.to;

  return (
    <FilterReport {...filterReportProps} isDisabled={disableFilter}>
      <div className="form-item--full">
        <FormItem
          validateObject={utilService.getValidateObj(
            changedDateRangeFrom && changedDateRangeTo ? undefined : error,
            "changedDateRange"
          )}
        >
          <DateRangePicker
            label={translate(
              "report.purchase.change_supplier_info.filter.creation_date"
            )}
            placeholder={[
              translate("CM.from_date"),
              translate("CM.plh_to_date"),
            ]}
            onChange={handleChangeDateRangeFilter({
              fieldName: "changedDateRange",
              fieldType: ["from", "to"],
            })}
            dateFormat={DATE_FORMAT}
            value={[
              isString(changedDateRangeFrom)
                ? dayjs(changedDateRangeFrom)
                : changedDateRangeFrom,
              isString(changedDateRangeTo)
                ? dayjs(changedDateRangeTo)
                : changedDateRangeTo,
            ]}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
    </FilterReport>
  );
}
