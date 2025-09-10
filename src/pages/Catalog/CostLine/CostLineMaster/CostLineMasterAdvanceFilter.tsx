import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { costLineRepository } from "core/repositories/CostLineRepository";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { CostLineFilter } from "models/CostLine";
import { useContext, useEffect } from "react";
import {
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { CostLineMaster, CostLineMasterContext } from "./CostLineMasterHook";
import {
  budgetCalculationMethodList,
  budgetPeriodList,
  listStatus,
  stateList,
} from "./constants";

interface CostLineMasterAdvanceFilterProps {
  setVisible: () => void;
}

export class CostLineModelFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

export const CostLineMasterAdvanceFilter = ({
  setVisible,
}: CostLineMasterAdvanceFilterProps) => {
  const costLineMaster = useContext<CostLineMaster>(CostLineMasterContext);
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = costLineMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: CostLineFilter,
    filter,
    updateFilter,
    handleCloseFilter: setVisible,
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeSelectFilter,
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
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
      handleClearModelFilter={handleClearFilter}
      modelFilter={modelFilter}
      handleClickOutside={handleClickOutside}
      handleToggleFilter={setVisible}
    >
      <FilterPanel.Left lg={6}>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listStatus()}
          values={modelFilter?.isActiveId?.in}
          onChange={handleChangeCheckboxFilter({
            fieldName: "isActive",
            fieldType: "in",
            classFilter: IdFilter,
          })}
        />
      </FilterPanel.Left>
      <FilterPanel.Right lg={18}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("CL.code_line_code_txt")}
              placeHolder={translate("CL.code_search_placeholder")}
              value={modelFilter?.code?.contain}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                fieldType: "contain",
                classFilter: StringFilter,
              })}
            />
          </Col>
          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              maxLength={500}
              label={translate("CL.code_line_name_txt")}
              placeHolder={translate("CL.name_search_placeholder")}
              value={modelFilter?.name?.contain}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                fieldType: "contain",
                classFilter: StringFilter,
              })}
            />
          </Col>
          {/* Parent */}
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.parentIdValue || []}
              label={translate("CL.code_line_parent_txt")}
              placeHolder={translate("CL.parent_search_placeholder")}
              getList={costLineRepository.parent}
              classFilter={CostLineModelFilter}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "parentId",
                fieldType: "in",
                classFilter: IdFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <Select
              label={translate("CL.budget_calculation_method_txt")}
              placeHolder={translate("CL.budget_period_search_placeholder")}
              getList={budgetCalculationMethodList}
              value={modelFilter?.budgetCalculationMethodValue}
              classFilter={CostLineModelFilter}
              onChange={handleChangeSelectFilter({
                fieldName: "budgetCalculationMethod",
                fieldType: "in",
                classFilter: IdFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <Select
              label={translate("CL.budget_period_txt")}
              placeHolder={translate("CL.budget_period_search_placeholder")}
              getList={budgetPeriodList}
              value={modelFilter?.budgetPeriodValue}
              classFilter={CostLineModelFilter}
              onChange={handleChangeSelectFilter({
                fieldName: "budgetPeriod",
                fieldType: "in",
                classFilter: IdFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <Select
              value={modelFilter?.defaultCostDriverValue}
              label={translate("CL.driver_default_txt")}
              placeHolder={translate("CL.driver_default_search_placeholder")}
              getList={costLineRepository.costDriver}
              classFilter={CostLineModelFilter}
              onChange={handleChangeSelectFilter({
                fieldName: "defaultCostDriver",
                fieldType: "in",
                classFilter: IdFilter,
              })}
              isEnumerable={false}
              isSearch
              searchProperty="name"
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <Select
              label={translate("CL.allow_budget_transfer_txt")}
              placeHolder={translate("CL.allow_transfer_search_placeholder")}
              getList={stateList}
              value={modelFilter?.isTransferValue}
              classFilter={CostLineModelFilter}
              onChange={handleChangeSelectFilter({
                fieldName: "isTransfer",
                fieldType: "in",
                classFilter: NumberFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <Select
              label={translate("CL.allow_budget_exceed_txt")}
              placeHolder={translate(
                "CL.allow_budget_exceed_search_placeholder"
              )}
              getList={stateList}
              value={modelFilter?.isBudgetOverrunsValue}
              classFilter={CostLineModelFilter}
              onChange={handleChangeSelectFilter({
                fieldName: "isBudgetOverruns",
                fieldType: "in",
                classFilter: NumberFilter,
              })}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
