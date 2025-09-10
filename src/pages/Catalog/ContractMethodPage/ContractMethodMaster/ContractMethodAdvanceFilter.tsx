import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { ContractMethodFilter } from "models/ContractMethod";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  ContractMethodMasterContext,
  ContractMethodMasterContextModel,
} from "./ContractMethodMasterHook";
import CommonFilter from "models/CommonFilter";
import { contractMethodRepository } from "../ContractMethodRepository";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface ContractMethodMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContractMethodMasterAdvanceFilter = ({
  setVisible,
}: ContractMethodMasterAdvanceFilterProps) => {
  const contractMethodMaster = useContext<ContractMethodMasterContextModel>(
    ContractMethodMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = contractMethodMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ContractMethodFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });
  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
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
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      handleClickOutside={handleClickOutside}
      modelFilter={modelFilter}
      handleToggleFilter={setVisible}
    >
      <FilterPanel.Left lg={6}>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listStatus()}
          values={modelFilter?.statusId || []}
          onChange={handleChangeCheckboxFilter({
            fieldName: "status",
          })}
        />
      </FilterPanel.Left>
      <FilterPanel.Right lg={18}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.codeValue || []}
              label={translate("contractMethods.code")}
              placeHolder={translate("contractMethods.placeholder.codeSelect")}
              render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
              getList={contractMethodRepository.getDropdown}
              classFilter={CommonFilter}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "code",
              })}
              className="form-item"
              searchProperty="search"
              searchType={null}
              isEnumerable={false}
              appendToBody
            />
          </Col>

          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("contractMethods.name")}
              placeHolder={translate("contractMethods.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("contractMethods.description")}
              placeHolder={translate("contractMethods.placeholder.description")}
              value={modelFilter?.description}
              onChange={handleChangeInputFilter({
                fieldName: "description",
                classFilter: StringFilter,
              })}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
