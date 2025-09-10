/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { GoodsServicesFilter } from "models/GoodsServices";
import React, { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  GoodsServicesMasterContext,
  GoodsServicesMasterContextModel,
} from "./GoodsServicesMasterHook";
import { GoodServiceTypeFilter } from "models/GoodServiceType";
import { goodsServicesRepository } from "../GoodsServicesRepository";
import { GoodsServicesCategoryFilter } from "models/GoodsServicesCategory";
export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface GoodsServicesMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GoodsServicesMasterAdvanceFilter = ({
  setVisible,
}: GoodsServicesMasterAdvanceFilterProps) => {
  const goodsServicesMaster = useContext<GoodsServicesMasterContextModel>(
    GoodsServicesMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = goodsServicesMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: GoodsServicesFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });
  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeAllFilter,
    handleChangeMultipleSelectFilter,
    // handleChangeSelectFilter,
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
              label={translate("goodsServices.code")}
              placeHolder={translate("goodsServices.placeholder.code")}
              value={modelFilter?.code}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("goodsServices.name")}
              placeHolder={translate("goodsServices.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              values={modelFilter.goodsServicesCategoryValue || []}
              label={translate("goodsServices.goodsServiceCategory")}
              placeHolder={translate(
                "goodsServices.placeholder.goodsServiceCategory"
              )}
              getList={goodsServicesRepository.getDropdownGoodsServicesCategory}
              classFilter={GoodsServicesCategoryFilter}
              valueFilter={{
                ...new GoodsServicesCategoryFilter(),
                isLeafNode: true,
              }}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "goodsServicesCategory",
              })}
              isSmall={true}
              searchProperty="search"
              searchType={null}
              isEnumerable={false}
              appendToBody
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.goodsServicesTypeValue || []}
              label={translate("goodsServices.goodsServicesType")}
              placeHolder={translate(
                "goodsServices.placeholder.goodsServicesType"
              )}
              getList={goodsServicesRepository.getDropdownGoodServiceType}
              classFilter={GoodServiceTypeFilter}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "goodsServicesType",
              })}
              isSmall={true}
              searchProperty="search"
              searchType={null}
              isEnumerable={false}
              appendToBody
            />
          </Col>

          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("goodsServices.description")}
              placeHolder={translate("goodsServices.placeholder.description")}
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
