import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { CostLineCostItemFilter } from "models/CostLineCostItem";
import React, { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import {
  CostLineCostItemMasterContext,
  CostLineCostItemMasterContextModel,
} from "./CostLineCostItemMasterHook";
import { costLineCostItemRepository } from "../CostLineCostItemRepository";
import { CostItem, CostItemFilter } from "models/CostItem";
export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface CostLineCostItemMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CostLineCostItemMasterAdvanceFilter = ({
  setVisible,
}: CostLineCostItemMasterAdvanceFilterProps) => {
  const costLineCostItemMaster = useContext<CostLineCostItemMasterContextModel>(
    CostLineCostItemMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = costLineCostItemMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: CostLineCostItemFilter,
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
    >
      <FilterPanel.Left lg={6}>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listStatus()}
          values={modelFilter?.statusId}
          onChange={handleChangeCheckboxFilter({
            fieldName: "status",
          })}
        />
      </FilterPanel.Left>
      <FilterPanel.Right lg={18}>
        <Row gutter={16}>
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("costLineCostItems.costLineCode")}
              placeHolder={translate(
                "costLineCostItems.placeholder.costLineCode"
              )}
              value={modelFilter?.costLineCode}
              onChange={handleChangeInputFilter({
                fieldName: "costLineCode",
                classFilter: StringFilter,
              })}
            />
          </Col>

          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("costLineCostItems.costLineName")}
              placeHolder={translate(
                "costLineCostItems.placeholder.costLineName"
              )}
              value={modelFilter?.costLineName}
              onChange={handleChangeInputFilter({
                fieldName: "costLineName",
                classFilter: StringFilter,
              })}
            />
          </Col>
          <Col lg={24} className="m-b--md">
            <MultipleSelect
              label={translate("costLineCostItems.costItem")}
              placeHolder={translate("costLineCostItems.placeholder.costItem")}
              getList={costLineCostItemRepository.getDropdownCostItem}
              classFilter={CostItemFilter}
              onChange={(selectedList?: CostItem[]) => {
                handleChangeMultipleSelectFilter({
                  fieldName: "costItem",
                })(selectedList);
              }}
              values={modelFilter?.costItemValue || []}
              isEnumerable={false}
              render={(costItem) => {
                return costItem?.id
                  ? `${costItem?.code} - ${costItem?.name}`
                  : null;
              }}
              searchProperty="search"
              searchType={null}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
