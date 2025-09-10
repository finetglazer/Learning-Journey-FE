import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import { useContext } from "react";
import {
  DateRangePicker,
  Select,
  MultipleSelect,
  FormItem,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { filterService } from "core/services/page-services/filter-service";
import { IdFilter } from "react-3layer-advance-filters";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { PromotionContext } from "../PromotionHook";
import { utilService } from "core/services/common-services/util-service";
import { isEqual, isString } from "lodash";
import dayjs from "dayjs";
import { Model } from "react-3layer-common";

interface FilterProps extends Pick<FilterReportProps, "onFilter" | "onReset"> {
  handleOnChange?: () => void; //Todo
}

export default function FilterPromotion({ onFilter, onReset }: FilterProps) {
  const { modelFilter, error, dispatchFilter, isHaveDate, isReset } =
    useContext(PromotionContext);
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  const {
    handleChangeDateFilter,
    handleChangeMultipleSelectFilter,
    handleChangeSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  const handleSelectBusinessUnit = (idValue: number, value: Model) => {
    if (!isEqual(value?.id, modelFilter?.businessUnitIdId)) {
      handleChangeSelectFilter({
        fieldName: "businessDepartmentId",
      })(undefined, undefined);
    }
    handleChangeSelectFilter({
      fieldName: "businessUnitId",
    })(idValue, value);
  };

  return (
    <FilterReport {...filterReportProps}>
      <div className="form-item">
        <FormItem
          validateObject={utilService.getValidateObj(
            isHaveDate || isReset ? undefined : error,
            "createdDateRange"
          )}
        >
          <DateRangePicker
            isRequired
            className="form-picker"
            label={translate(
              "report.payment.cost_items.filter.txt_creation_date"
            )}
            onChange={handleChangeDateFilter({
              fieldName: "createDate",
              fieldType: ["greaterEqual", "lessEqual"],
            })}
            value={[
              isString(modelFilter?.createDate?.greaterEqual)
                ? dayjs(modelFilter?.createDate?.greaterEqual)
                : modelFilter?.createDate?.greaterEqual,
              isString(modelFilter?.createDate?.lessEqual)
                ? dayjs(modelFilter?.createDate?.lessEqual)
                : modelFilter?.createDate?.lessEqual,
            ]}
            placeholder={[
              translate("BG.plh_date_from"),
              translate("BG.plh_date__to"),
            ]}
            bgColor="white"
            isSmall={false}
          />
        </FormItem>
      </div>
      <div className="form-item">
        <MultipleSelect
          label={translate("report.txt_promotion")}
          placeHolder={translate("report.plh_choose_promotion")}
          values={modelFilter?.costGroupIdsValue || []}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "costGroupIds",
            classFilter: IdFilter,
          })}
          getList={contractRepository.getListPromotion}
          render={(item) => item.name}
          classFilter={DemoFilter}
          isSmall={false}
          isEnumerable={false}
          searchProperty="name"
        />
      </div>
      <div className="form-item" />
      <div className="form-item">
        <Select
          label={translate("report.payment.cost_items.filter.txt_branch")}
          placeHolder={translate(
            "report.payment.cost_items.filter.plh_choose_branch"
          )}
          value={modelFilter?.businessBranchIdValue || undefined}
          onChange={handleChangeSelectFilter({
            fieldName: "businessBranchId",
            classFilter: IdFilter,
          })}
          getList={paymentRepository.listBusinessBranch}
          render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
          classFilter={DemoFilter}
          isSmall={false}
          isSearch={true}
          isEnumerable={false}
          searchProperty="name"
        />
      </div>
      <div className="form-item">
        <Select
          label={translate("report.payment.cost_items.filter.txt_bank_block")}
          placeHolder={translate(
            "report.payment.cost_items.filter.plh_choose_bank_block"
          )}
          value={modelFilter?.businessUnitIdValue || undefined}
          onChange={handleSelectBusinessUnit}
          getList={paymentRepository.listBusinessUnit}
          render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
          classFilter={DemoFilter}
          isSmall={false}
          isSearch={true}
          isEnumerable={false}
          searchProperty="name"
        />
      </div>
      <div className="form-item">
        <Select
          disabled={!modelFilter?.businessUnitIdId}
          label={translate("report.payment.cost_items.filter.txt_department")}
          placeHolder={translate(
            "report.payment.cost_items.filter.plh_choose_department"
          )}
          value={modelFilter?.businessDepartmentIdValue || undefined}
          onChange={handleChangeSelectFilter({
            fieldName: "businessDepartmentId",
            classFilter: IdFilter,
          })}
          getList={(filter) => {
            return budgetRepository.listBusinessDepartment({
              ...filter,
              name: {
                contain: filter?.name,
              },
            });
          }}
          render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
          classFilter={DemoFilter}
          isSmall={false}
          isSearch
          isEnumerable={false}
          valueFilter={{
            businessUnitId: modelFilter?.businessUnitIdId,
          }}
          searchType=""
        />
      </div>
    </FilterReport>
  );
}
