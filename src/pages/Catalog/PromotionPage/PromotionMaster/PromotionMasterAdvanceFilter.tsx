import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { PromotionFilter } from "models/Promotion";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  DateRangePicker,
  EnumSelect,
  InputNumber,
  InputText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  PromotionMasterContext,
  PromotionMasterContextModel,
} from "./PromotionMasterHook";
import { getListPromotionType, listPromotionType } from "../PromotionConstant";
import { NUMBER_MAX_13 } from "config/const";
import { datePickerPopupClassName } from "core/config/consts";
import { values } from "lodash";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface PromotionMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PromotionMasterAdvanceFilter = ({
  setVisible,
}: PromotionMasterAdvanceFilterProps) => {
  const promotionMaster = useContext<PromotionMasterContextModel>(
    PromotionMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = promotionMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: PromotionFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });
  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeDateRangeFilter,
    handleChangeAllFilter,
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
      exceptNodeIds={values(datePickerPopupClassName)}
      handleToggleFilter={setVisible}
      width={1000}
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
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("promotions.code")}
              placeHolder={translate("promotions.placeholder.code")}
              value={modelFilter?.code}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                classFilter: StringFilter,
              })}
            />
          </Col>
          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("promotions.name")}
              placeHolder={translate("promotions.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--xs">
            <EnumSelect
              label={translate("promotions.promotionType")}
              placeHolder={translate("promotions.placeholder.promotionType")}
              type={1}
              getList={getListPromotionType}
              value={
                modelFilter?.promotionType !== undefined &&
                modelFilter?.promotionType !== null
                  ? {
                      id: Number(modelFilter?.promotionType),
                      name: listPromotionType[
                        Number(modelFilter?.promotionType)
                      ]?.name,
                    }
                  : null
              }
              onChange={(id: number) => {
                handleChangeInputFilter({ fieldName: "promotionType" })(
                  id.toString()
                );
              }}
            />
          </Col>
          <Col lg={12} className="m-b--xs">
            <div className="form-item d-flex align-items-end gap-1">
              <InputNumber
                label={translate("promotions.budget")}
                placeHolder={translate("CM.placeholder_from")}
                value={modelFilter?.budgetAmount?.greaterEqual}
                onChange={(value) => {
                  handleChangeAllFilter({
                    ...modelFilter,
                    budgetAmount: {
                      ...modelFilter?.budgetAmount,
                      greaterEqual: value !== undefined ? value : undefined,
                    },
                  });
                }}
                className="form-item form-item--half"
                numberType="DECIMAL"
                max={NUMBER_MAX_13}
              />
              <span className="form-item__connect">-</span>
              <InputNumber
                placeHolder={translate("CM.placeholder_to")}
                value={modelFilter?.budgetAmount?.lessEqual}
                onChange={(value) => {
                  handleChangeAllFilter({
                    ...modelFilter,
                    budgetAmount: {
                      ...modelFilter?.budgetAmount,
                      lessEqual: value !== undefined ? value : undefined,
                    },
                  });
                }}
                className="form-item form-item--half"
                numberType="DECIMAL"
                max={NUMBER_MAX_13}
              />
            </div>
          </Col>
          <Col lg={12} className="m-b--md">
            <DateRangePicker
              label={translate("promotions.startDate")}
              className="form-item"
              onChange={handleChangeDateRangeFilter({
                fieldName: "startDate",
                fieldType: ["greaterEqual", "lessEqual"],
              })}
              value={[
                modelFilter?.startDate.greaterEqual,
                modelFilter?.startDate.lessEqual,
              ]}
              placeholder={[translate("CM.from_date"), translate("CM.to_date")]}
              popupClassName={datePickerPopupClassName.first}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <DateRangePicker
              label={translate("promotions.endDate")}
              className="form-item"
              onChange={handleChangeDateRangeFilter({
                fieldName: "endDate",
                fieldType: ["greaterEqual", "lessEqual"],
              })}
              value={[
                modelFilter?.endDate.greaterEqual,
                modelFilter?.endDate.lessEqual,
              ]}
              placeholder={[translate("CM.from_date"), translate("CM.to_date")]}
              id={"endDate"}
              popupClassName={datePickerPopupClassName.second}
            />
          </Col>
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("promotions.description")}
              placeHolder={translate("promotions.placeholder.description")}
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
