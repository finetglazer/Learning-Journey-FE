import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { isString } from "lodash";
import CommonFilter from "models/CommonFilter";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { IdFilter } from "react-3layer-advance-filters";
import { Model } from "react-3layer-common";
import {
  DateRangePicker,
  FormItem,
  MultipleSelect,
  Select,
  STANDARD_DATE_FORMAT_INVERSE,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { reportTransactionDailyRepository } from "core/repositories/ReportTransactionDailyRepository";

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
  handleChangeMultipleSelectFilter,
  handleChangeSelectFilter,
  handleChangeDateRangeFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  const createdDateRangeFrom = modelFilter?.createdDateRange?.from;
  const createdDateRangeTo = modelFilter?.createdDateRange?.to;

  const handleTransactionTypeChange = (idValue: number, value: Model) => {
    handleChangeSelectFilter({
      fieldName: "transactionType",
    })(idValue, value);

    handleChangeMultipleSelectFilter({
      fieldName: "statuses",
    })([]);
  };

  const disableFilter =
    !modelFilter?.createdDateRange?.from ||
    !modelFilter?.createdDateRange?.to ||
    !modelFilter?.transactionTypeValue;

  return (
    <FilterReport {...filterReportProps} isDisabled={disableFilter}>
      <div className="form-item-4">
        <FormItem
          validateObject={utilService.getValidateObj(
            createdDateRangeFrom && createdDateRangeTo ? undefined : error,
            "createdDateRange"
          )}
        >
          <DateRangePicker
            label={translate("report.purchase.filter.txt_creation_date")}
            placeholder={[
              translate("CM.from_date"),
              translate("CM.plh_to_date"),
            ]}
            onChange={handleChangeDateRangeFilter({
              fieldName: "createdDateRange",
              fieldType: ["from", "to"],
            })}
            dateFormat={DATE_FORMAT}
            value={[
              isString(createdDateRangeFrom)
                ? dayjs(createdDateRangeFrom)
                : createdDateRangeFrom,
              isString(createdDateRangeTo)
                ? dayjs(createdDateRangeTo)
                : createdDateRangeTo,
            ]}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
      <div className="form-item-4">
        <FormItem
          validateObject={utilService.getValidateObj(
            modelFilter?.transactionType ? undefined : error?.transactionType,
            "transactionType"
          )}
        >
          <Select
            value={modelFilter?.transactionTypeValue}
            label={translate(
              "report.purchase.transaction_daily.filter.transactionType.label"
            )}
            placeHolder={translate(
              "report.purchase.transaction_daily.filter.transactionType.placeholder"
            )}
            getList={
              reportTransactionDailyRepository.getDropdownTransactionType
            }
            classFilter={CommonFilter}
            onChange={handleTransactionTypeChange}
            searchProperty="name"
            isEnumerable={false}
            isSmall={false}
            isSearch={false}
            appendToBody
            isRequired
          />
        </FormItem>
      </div>
      <div className="form-item-4">
        <MultipleSelect
          appendToBody
          values={modelFilter?.statusesValue || []}
          label={translate("report.purchase.filter.txt_status")}
          placeHolder={translate("report.purchase.filter.plh_status")}
          render={(t) => `${t?.id} - ${t?.name}`}
          getList={(filter) =>
            reportTransactionDailyRepository.getDropdownTransactionStatus({
              ...filter,
              enumStatus: modelFilter?.transactionTypeValue?.enumStatus,
            })
          }
          classFilter={CommonFilter}
          searchProperty="name"
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "statuses",
          })}
          isUsingSearch={false}
        />
      </div>
      <div className="form-item-4">
        <MultipleSelect
          appendToBody
          label={translate("report.purchase.filter.txt_branch_created")}
          placeHolder={translate("report.purchase.filter.plh_branch_created")}
          values={modelFilter?.businessBranchsValue || []}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "businessBranchs",
            classFilter: IdFilter,
          })}
          getList={reportTransactionDailyRepository.listBusinessBranch}
          render={(t) => `${t?.code} - ${t?.name}`}
          classFilter={DemoFilter}
          isSmall={false}
          isEnumerable={false}
          searchProperty="name"
        />
      </div>
    </FilterReport>
  );
}
