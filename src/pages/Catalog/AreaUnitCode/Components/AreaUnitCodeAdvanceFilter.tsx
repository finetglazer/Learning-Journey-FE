import FilterPanel from "components/FilterPanel/FilterPanel";
import { NUMBER_MAX_13 } from "config/const";
import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { AreaUnitCodeFilter } from "models/AreaUnitCode/AreaUnitCodeFilter";
import CommonFilter from "models/CommonFilter";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { NumberFilter } from "react-3layer-advance-filters";
import {
  DateRangePicker,
  InputNumber,
  InputText,
  MultipleSelect,
  STANDARD_DATE_FORMAT_INVERSE,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { AreaUnitCodeMasterContext } from "../AreaUnitCodeMasterHooks";

interface AreaUnitCodeAdvanceFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const DATE_FORMAT = [
  STANDARD_DATE_FORMAT_SLASH,
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_INVERSE,
];

export const AreaUnitCodeAdvanceFilter = ({
  setVisible,
}: AreaUnitCodeAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext(AreaUnitCodeMasterContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: AreaUnitCodeFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeDateRangeFilter,
    handleChangeMultipleSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <FilterPanel
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.btn_apply")}
      modelFilter={modelFilter}
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      handleClickOutside={handleClickOutside}
      className="area-unit-code-advance-filter__container"
    >
      <div className="area-unit-code-advance-filter">
        <MultipleSelect
          values={modelFilter?.branchCostCenterValue || []}
          label={translate("AUC.txt_cost_center_cnpgd_code")}
          placeHolder={translate(
            "AUC.placeholder_select_cost_center_cnpgd_code"
          )}
          render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
          getList={paymentRepository.listBusinessBranch}
          classFilter={CommonFilter}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "branchCostCenter",
          })}
          className="form-item"
          isSmall={false}
          searchProperty="name"
          isEnumerable={false}
          appendToBody
        />
        <MultipleSelect
          values={modelFilter?.businessUnitCostCenterValue || []}
          label={translate("AUC.txt_cost_center_nhcd_code")}
          placeHolder={translate(
            "AUC.placeholder_select_cost_center_nhcd_code"
          )}
          render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
          getList={budgetRepository.costOwnerList}
          classFilter={undefined}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "businessUnitCostCenter",
          })}
          searchType=""
          type={1}
          valueFilter={{
            name: "",
          }}
          className="form-item"
          searchProperty="name"
          isSmall={false}
          isEnumerable={false}
          appendToBody
        />
        <MultipleSelect
          values={modelFilter?.departmentCostCenterValue || []}
          label={translate("AUC.txt_cost_center_tt_pb_code")}
          placeHolder={translate(
            "AUC.placeholder_select_cost_center_tt_pb_code"
          )}
          getList={budgetRepository.listBusinessDepartment}
          classFilter={CommonFilter}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "departmentCostCenter",
          })}
          className="form-item"
          isSmall={false}
          searchProperty="name"
          isEnumerable={false}
          appendToBody
          render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
        />
        <InputText
          label={translate("AUC.txt_cost_center_cnpgd_name")}
          placeHolder={translate(
            "AUC.placeholder_enter_cost_center_cnpgd_name"
          )}
          value={modelFilter?.branchCostCenterName}
          onChange={handleChangeInputFilter({
            fieldName: "branchCostCenterName",
          })}
          className="form-item"
          isSmall={false}
        />
        <InputText
          label={translate("AUC.txt_cost_center_nhcd_name")}
          placeHolder={translate("AUC.placeholder_enter_cost_center_nhcd_name")}
          value={modelFilter?.businessUnitCostCenterName}
          onChange={handleChangeInputFilter({
            fieldName: "businessUnitCostCenterName",
          })}
          className="form-item"
          isSmall={false}
        />
        <InputText
          label={translate("AUC.txt_cost_center_tt_pb_name")}
          placeHolder={translate(
            "AUC.placeholder_enter_cost_center_tt_pb_name"
          )}
          value={modelFilter?.departmentCostCenterName}
          onChange={handleChangeInputFilter({
            fieldName: "departmentCostCenterName",
          })}
          className="form-item"
          isSmall={false}
        />
        <div className="form-item d-flex align-items-end gap-1">
          <InputNumber
            label={translate("AUC.txt_area_m2")}
            placeHolder={translate("AUC.placeholder_from_area")}
            value={modelFilter?.fromArea?.equal}
            onChange={handleChangeInputFilter({
              fieldName: "fromArea",
              fieldType: "equal",
              classFilter: NumberFilter,
            })}
            className="form-item form-item--half"
            numberType="DECIMAL"
            max={NUMBER_MAX_13}
            isSmall={false}
          />
          <span className="form-item__connect">-</span>
          <InputNumber
            placeHolder={translate("AUC.placeholder_to_area")}
            value={modelFilter?.toArea?.equal}
            onChange={handleChangeInputFilter({
              fieldName: "toArea",
              fieldType: "equal",
              classFilter: NumberFilter,
            })}
            className="form-item form-item--half"
            numberType="DECIMAL"
            max={NUMBER_MAX_13}
            isSmall={false}
          />
        </div>
        <InputText
          label={translate("AUC.txt_contract_code")}
          placeHolder={translate("AUC.placeholder_search_by_contract_code")}
          value={modelFilter?.contractCode}
          onChange={handleChangeInputFilter({
            fieldName: "contractCode",
          })}
          className="form-item"
          isSmall={false}
        />
        <DateRangePicker
          label={translate("AUC.txt_contract_date")}
          className="form-item"
          onChange={handleChangeDateRangeFilter({
            fieldName: "contractValidityPeriod",
            fieldType: ["greaterEqual", "lessEqual"],
            useTime: true,
          })}
          value={[
            modelFilter?.contractValidityPeriod?.greaterEqual,
            modelFilter?.contractValidityPeriod?.lessEqual,
          ]}
          placeholder={[
            translate("BG.plh_date_from"),
            translate("BG.plh_date__to"),
          ]}
          dateFormat={DATE_FORMAT}
          isSmall={false}
        />
      </div>
    </FilterPanel>
  );
};
