import {
  listPurchasingPlanStatusEnum,
  listPurchasingPlanType,
} from "config/const";
import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { isString } from "lodash";
import CommonFilter from "models/CommonFilter";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { IdFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import {
  DateRangePicker,
  FormItem,
  MultipleSelect,
  STANDARD_DATE_FORMAT_INVERSE,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";

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
  handleChangeDateRangeFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  const createDateRangeFrom = modelFilter?.createDateRange?.from;
  const createDateRangeTo = modelFilter?.createDateRange?.to;

  const getListPurchasingPlan = (filter: ModelFilter) => {
    const filterString = filter?.name?.contain;
    return of(
      listPurchasingPlanType
        ?.filter((item) =>
          filterString
            ? item?.name?.toLowerCase()?.includes(filterString?.toLowerCase())
            : true
        )
        .map((item) => ({
          ...item,
          id: item?.id,
          name: item?.name,
        }))
    );
  };

  const getListStatus = (filter: ModelFilter) => {
    const filterString = filter?.name?.contain;
    return of(
      listPurchasingPlanStatusEnum
        ?.filter((item) =>
          filterString
            ? item?.name?.toLowerCase()?.includes(filterString?.toLowerCase())
            : true
        )
        .map((item) => ({
          ...item,
          id: item?.id,
          name: item?.name,
        }))
    );
  };

  const defaultStatusValue = listPurchasingPlanStatusEnum?.filter(
    (item) => ![0, 3, 11]?.includes(item?.id)
  );

  const disableFilter =
    !modelFilter?.createDateRange?.from || !modelFilter?.createDateRange?.to;

  return (
    <FilterReport {...filterReportProps} isDisabled={disableFilter}>
      <div className="form-item">
        <FormItem
          validateObject={utilService.getValidateObj(
            createDateRangeFrom && createDateRangeTo ? undefined : error,
            "createDateRange"
          )}
        >
          <DateRangePicker
            label={translate("report.purchase.filter.txt_creation_date")}
            placeholder={[
              translate("CM.from_date"),
              translate("CM.plh_to_date"),
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
        <MultipleSelect
          appendToBody
          values={modelFilter?.purchasePlanTypesValue || []}
          label={translate("report.purchase.filter.txt_purchase_method")}
          placeHolder={translate("report.purchase.filter.plh_purchase_method")}
          render={(item) => item.name}
          getList={getListPurchasingPlan}
          classFilter={DemoFilter}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "purchasePlanTypes",
            classFilter: IdFilter,
          })}
          isSmall={false}
          isUsingSearch={false}
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          label={translate("report.purchase.filter.txt_cost_group")}
          placeHolder={translate("report.purchase.filter.plh_cost_group")}
          values={modelFilter?.costGroupIdsValue || []}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "costGroupIds",
            classFilter: IdFilter,
          })}
          getList={purchasingPlanRepository.getListCostGroup}
          render={(item) => (item?.id ? `${item?.code} - ${item?.name}` : null)}
          classFilter={DemoFilter}
          isSmall={false}
          isEnumerable={false}
          searchProperty="name"
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          values={modelFilter?.organizationIdValue || []}
          label={translate("report.purchase.filter.txt_unit_created")}
          placeHolder={translate("report.purchase.filter.plh_unit_created")}
          getList={purchasingPlanRepository.getListOrganization}
          classFilter={DemoFilter}
          render={(item) => `${item?.code} - ${item?.name}`}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "organizationId",
            classFilter: IdFilter,
          })}
          isSmall={false}
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          label={translate("report.purchase.filter.txt_branch_created")}
          placeHolder={translate("report.purchase.filter.plh_branch_created")}
          values={modelFilter?.businessBranchIdValue || []}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "businessBranchId",
            classFilter: IdFilter,
          })}
          getList={paymentRepository.listBusinessBranch}
          render={(t) => `${t?.code} - ${t?.name}`}
          classFilter={DemoFilter}
          isSmall={false}
          isEnumerable={false}
          searchProperty="name"
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          values={modelFilter?.suppliersValue || []}
          label={translate("report.purchase.filter.txt_supplier")}
          placeHolder={translate("report.purchase.filter.plh_supplier")}
          render={(item) => item?.code + " - " + item?.name}
          getList={contractRepository.getListSupplier}
          classFilter={CommonFilter}
          searchProperty="name"
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "suppliers",
          })}
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          values={modelFilter?.statusValue || defaultStatusValue}
          label={translate("report.purchase.filter.txt_status")}
          placeHolder={translate("report.purchase.filter.plh_status")}
          render={(item) => item?.name}
          getList={getListStatus}
          classFilter={CommonFilter}
          searchProperty="name"
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "status",
          })}
          isUsingSearch={false}
        />
      </div>
    </FilterReport>
  );
}
