import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { isString } from "lodash";
import CommonFilter from "models/CommonFilter";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import {
  DateRangePicker,
  FormItem,
  MultipleSelect,
  STANDARD_DATE_FORMAT_INVERSE,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
      | "handleChangeMultipleSelectFilter"
      | "handleChangeDateRangeFilter"
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
  handleChangeMultipleSelectFilter,
  handleChangeDateRangeFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  const createDateRangeFrom = modelFilter?.createDateRange?.from;
  const createDateRangeTo = modelFilter?.createDateRange?.to;
  const approvalDateFrom = modelFilter?.approvalDate?.from;
  const approvalDateTo = modelFilter?.approvalDate?.to;

  return (
    <FilterReport {...filterReportProps}>
      <div className="form-item">
        <FormItem
          validateObject={utilService.getValidateObj(
            createDateRangeFrom && createDateRangeTo ? undefined : error,
            "createdDateRange"
          )}
        >
          <DateRangePicker
            label={translate("report.payment.filter.txt_creation_date")}
            placeholder={[
              translate("CM.from_date"),
              translate("settlement.plh_to_day"),
            ]}
            onChange={handleChangeDateRangeFilter({
              fieldName: "createDateRange",
              fieldType: ["from", "to"],
            })}
            dateFormat={DATE_FORMAT}
            value={[
              isString(createDateRangeFrom)
                ? dayjs(createDateRangeFrom)
                : createDateRangeFrom,
              isString(createDateRangeTo)
                ? dayjs(createDateRangeTo)
                : createDateRangeTo,
            ]}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
      <div className="form-item">
        <DateRangePicker
          label={translate("report.payment.filter.txt_approval_date")}
          placeholder={[
            translate("CM.from_date"),
            translate("settlement.plh_to_day"),
          ]}
          onChange={handleChangeDateRangeFilter({
            fieldName: "approvalDate",
            fieldType: ["from", "to"],
          })}
          dateFormat={DATE_FORMAT}
          value={[
            isString(approvalDateFrom)
              ? dayjs(approvalDateFrom)
              : approvalDateFrom,
            isString(approvalDateTo) ? dayjs(approvalDateTo) : approvalDateTo,
          ]}
          isSmall={false}
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          label={translate("report.payment.filter.txt_approver")}
          placeHolder={translate("PL.plh_select_approver")}
          values={modelFilter?.approversValue || []}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "approvers",
          })}
          render={(option) => `${option?.email} - ${option.name}`}
          getList={contractRepository.getListUser}
          classFilter={CommonFilter}
          isSmall={false}
        />
      </div>
    </FilterReport>
  );
}
