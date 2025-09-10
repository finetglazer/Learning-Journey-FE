import FilterPanel from "components/FilterPanel/FilterPanel";
import { numberConstants } from "core/config/consts";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { PersonnelByUnitFilter } from "models/PersonnelByUnit/PersonnelByUnitFilter";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { NumberFilter } from "react-3layer-advance-filters";
import {
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PersonnelByUnitMasterContext } from "../PersonnelByUnitMasterHooks";

interface PersonnelByUnitAdvanceFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const PersonnelByUnitAdvanceFilter = ({
  setVisible,
}: PersonnelByUnitAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext(PersonnelByUnitMasterContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: PersonnelByUnitFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const { handleChangeInputFilter, handleChangeMultipleSelectFilter } =
    filterService.useFilter(modelFilter, dispatchFilter);

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
    >
      <div className="personnel-by-unit-advance-filter">
        <MultipleSelect
          values={modelFilter?.businessUnitCostCenterValue || []}
          label={translate("PBU.txt_cost_center_nhcd_code")}
          placeHolder={translate(
            "PBU.placeholder_select_cost_center_nhcd_code"
          )}
          render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
          getList={budgetRepository.costOwnerList}
          classFilter={undefined}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "businessUnitCostCenter",
          })}
          searchType=""
          type={numberConstants.ONE}
          valueFilter={{
            name: "",
          }}
          className="form-item"
          searchProperty="name"
          isSmall={false}
          isEnumerable={false}
          appendToBody
        />
        <InputText
          label={translate("PBU.txt_cost_center_nhcd_name")}
          placeHolder={translate("PBU.placeholder_enter_cost_center_nhcd_name")}
          value={modelFilter?.businessUnitCostCenterName}
          onChange={handleChangeInputFilter({
            fieldName: "businessUnitCostCenterName",
          })}
          className="form-item"
          isSmall={false}
        />
        <MultipleSelect
          values={modelFilter?.departmentCostCenterValue || []}
          label={translate("PBU.txt_cost_center_tt_pb_code")}
          placeHolder={translate(
            "PBU.placeholder_select_cost_center_tt_pb_code"
          )}
          getList={budgetRepository.listBusinessDepartment}
          render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
          classFilter={CommonFilter}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "departmentCostCenter",
          })}
          className="form-item"
          isSmall={false}
          searchProperty="name"
          isEnumerable={false}
          appendToBody
        />
        <InputText
          label={translate("PBU.txt_cost_center_tt_pb_name")}
          placeHolder={translate(
            "PBU.placeholder_enter_cost_center_tt_pb_name"
          )}
          value={modelFilter?.departmentCostCenterName}
          onChange={handleChangeInputFilter({
            fieldName: "departmentCostCenterName",
          })}
          className="form-item"
          isSmall={false}
        />
        <MultipleSelect
          values={modelFilter?.branchCostCenterValue || []}
          label={translate("PBU.txt_cost_center_cnpgd_code")}
          placeHolder={translate(
            "PBU.placeholder_select_cost_center_cnpgd_code"
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
        <InputText
          label={translate("PBU.txt_cost_center_cnpgd_name")}
          placeHolder={translate(
            "PBU.placeholder_enter_cost_center_cnpgd_name"
          )}
          value={modelFilter?.branchCostCenterName}
          onChange={handleChangeInputFilter({
            fieldName: "branchCostCenterName",
          })}
          className="form-item"
          isSmall={false}
        />
        <InputNumber
          label={translate("PBU.txt_number_of_employees")}
          placeHolder={translate("PBU.placeholder_enter_number_of_employees")}
          value={modelFilter?.employeeCount?.equal}
          onChange={handleChangeInputFilter({
            fieldName: "employeeCount",
            fieldType: "equal",
            classFilter: NumberFilter,
          })}
          className="form-item form-item--full"
          isSmall={false}
          type="number"
        />
      </div>
    </FilterPanel>
  );
};
