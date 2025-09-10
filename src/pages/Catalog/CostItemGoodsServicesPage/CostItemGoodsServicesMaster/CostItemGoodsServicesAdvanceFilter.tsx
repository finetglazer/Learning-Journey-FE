import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { CostItemGoodsServicesFilter } from "models/CostItemGoodsServices";
import React, { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import {
  CostItemGoodsServicesMasterContext,
  CostItemGoodsServicesMasterContextModel,
} from "./CostItemGoodsServicesMasterHook";
import { costItemGoodsServicesRepository } from "../CostItemGoodsServicesRepository";
import { CostItem, CostItemFilter } from "models/CostItem";
import { GoodServiceFilter } from "models/Proposal/GoodService";
import { GoodsServices } from "models/GoodsServices";
export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface CostItemGoodsServicesMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CostItemGoodsServicesMasterAdvanceFilter = ({
  setVisible,
}: CostItemGoodsServicesMasterAdvanceFilterProps) => {
  const costItemGoodsServicesMaster =
    useContext<CostItemGoodsServicesMasterContextModel>(
      CostItemGoodsServicesMasterContext
    );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = costItemGoodsServicesMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: CostItemGoodsServicesFilter,
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
      handleToggleFilter={setVisible}
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
          <Col lg={12} className="m-b--xs">
            <MultipleSelect
              label={translate("costItemGoodsServices.costItemCode")}
              placeHolder={translate(
                "costItemGoodsServices.placeholder.costItemCode"
              )}
              getList={costItemGoodsServicesRepository.getDropdownCostItem}
              classFilter={CostItemFilter}
              onChange={(selectedList?: CostItem[]) => {
                handleChangeMultipleSelectFilter({
                  fieldName: "costItem",
                })(selectedList);
              }}
              values={modelFilter?.costItemValue || []}
              isEnumerable={false}
              render={(costItem) => {
                return costItem?.id ? `${costItem?.code} ` : null;
              }}
              searchProperty="search"
              searchType={null}
            />
          </Col>

          {/* Name */}
          <Col lg={12} className="m-b--xs">
            <InputText
              label={translate("costItemGoodsServices.costItemName")}
              placeHolder={translate(
                "costItemGoodsServices.placeholder.costItemName"
              )}
              value={modelFilter?.costItemName}
              onChange={handleChangeInputFilter({
                fieldName: "costItemName",
                classFilter: StringFilter,
              })}
            />
          </Col>
          <Col lg={24} className="m-b--md">
            <MultipleSelect
              label={translate("costItemGoodsServices.goodServices")}
              placeHolder={translate(
                "costItemGoodsServices.placeholder.goodServices"
              )}
              getList={costItemGoodsServicesRepository.getDropdownGoodsServices}
              classFilter={GoodServiceFilter}
              onChange={(selectedList?: GoodsServices[]) => {
                handleChangeMultipleSelectFilter({
                  fieldName: "goodService",
                })(selectedList);
              }}
              values={modelFilter?.goodServiceValue || []}
              isEnumerable={false}
              render={(goodService) => {
                return goodService?.id
                  ? `${goodService?.code} - ${goodService?.name}`
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
