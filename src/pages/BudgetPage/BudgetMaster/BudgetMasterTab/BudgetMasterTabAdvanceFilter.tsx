import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { listStatusEnum, listTypeEnumFilter } from "config/const";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { BudgetFilter } from "models/Budget";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import React, { useContext } from "react";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
  MultipleSelect,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import { BudgetMaster, BudgetMasterContext } from "../BudgetMasterHook";

interface BudgetMasterAdvanceFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

const listType = () => {
  return of(listTypeEnumFilter);
};

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const BudgetMasterAdvanceFilter = (props: BudgetMasterAdvanceFilterProps) => {
  const appUserMaster = useContext<BudgetMaster>(BudgetMasterContext);
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = appUserMaster;

  const { setVisible } = props;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: BudgetFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeDateFilter,
    handleChangeSelectFilter,
    handleChangeMultipleSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  React.useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <FilterPanel
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.btn_apply")}
      modelFilter={modelFilter}
      handleClickOutside={handleClickOutside}
    >
      <FilterPanel.Left>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listStatusEnum}
          values={modelFilter?.statusesId?.in}
          onChange={handleChangeCheckboxFilter({
            fieldName: "statuses",
            fieldType: "in",
            classFilter: IdFilter,
          })}
        />
      </FilterPanel.Left>
      <FilterPanel.Right>
        <Row gutter={16}>
          <Col lg={12} className="m-b--sm">
            <InputText
              value={modelFilter?.code?.contain}
              label={translate("BG.label_ticket_code")}
              placeHolder={translate("BG.plh_ticket_code")}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                fieldType: "contain",
                classFilter: StringFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--sm">
            <InputText
              value={modelFilter?.name?.contain}
              label={translate("BG.label_interpretation")}
              placeHolder={translate("BG.plh_interpretation")}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                fieldType: "contain",
                classFilter: StringFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--sm">
            <MultipleSelect
              values={modelFilter?.requesterValue || []}
              label={translate("BG.label_proponent")}
              placeHolder={translate("BG.plh_proponent")}
              render={(item) => item?.email}
              getList={budgetRepository.listMasterUser}
              classFilter={DemoFilter}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "requester",
                fieldType: "in",
                classFilter: IdFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.businessUnitIdValue || []}
              label={translate("BG.label_applicant_unit")}
              placeHolder={translate("BG.plh_applicant_unit")}
              getList={budgetRepository.listBusinessDepartment}
              classFilter={DemoFilter}
              render={(item) => `${item?.code} - ${item?.name}`}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "businessUnitId",
                fieldType: "in",
                classFilter: IdFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--sm">
            <Select
              value={modelFilter?.typeValue}
              label={translate("BG.label_type_request")}
              placeHolder={translate("BG.plh_type_request")}
              getList={listType}
              classFilter={DemoFilter}
              onChange={handleChangeSelectFilter({
                fieldName: "type",
                fieldType: "in",
                classFilter: IdFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--sm">
            <DateRangePicker
              label={translate("BG.label_date_creadted")}
              onChange={handleChangeDateFilter({
                fieldName: "createDate",
                fieldType: ["greaterEqual", "lessEqual"],
              })}
              value={[
                modelFilter?.createDate?.greaterEqual,
                modelFilter?.createDate?.lessEqual,
              ]}
              placeholder={[
                translate("BG.plh_date_from"),
                translate("BG.plh_date__to"),
              ]}
              bgColor="white"
              isSmall
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};

export default BudgetMasterAdvanceFilter;
