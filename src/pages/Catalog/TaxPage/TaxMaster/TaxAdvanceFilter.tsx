import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import CommonFilter from "models/CommonFilter";
import { TaxFilter } from "models/Tax";
import { useContext, useEffect } from "react";
import { NumberFilter, StringFilter } from "react-3layer-advance-filters";
import { Model } from "react-3layer-common";
import {
  CheckboxGroup,
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { getListTaxType } from "../TaxConstant";
import { TaxMasterContext, TaxMasterContextModel } from "./TaxMasterHook";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface TaxMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TaxMasterAdvanceFilter = ({
  setVisible,
}: TaxMasterAdvanceFilterProps) => {
  const taxMaster = useContext<TaxMasterContextModel>(TaxMasterContext);
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = taxMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: TaxFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const { handleChangeInputFilter, handleChangeCheckboxFilter } =
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
              label={translate("taxs.code")}
              placeHolder={translate("taxs.placeholder.code")}
              value={modelFilter?.code}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <MultipleSelect
              label={translate("taxs.taxType")}
              placeHolder={translate("taxs.placeholder.taxType")}
              getList={getListTaxType}
              classFilter={CommonFilter}
              onChange={(selectedList?: Model[], ids?: []) => {
                handleChangeCheckboxFilter({
                  fieldName: "taxType",
                })(ids, selectedList);
              }}
              values={modelFilter?.taxTypeValue || []}
              isEnumerable={false}
            />
          </Col>
          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("taxs.name")}
              placeHolder={translate("taxs.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <InputNumber
              max={100}
              label={translate("taxs.rate")}
              placeHolder={translate("taxs.placeholder.rate")}
              value={modelFilter?.rateFilter?.equal}
              onChange={(value) => {
                handleChangeInputFilter({
                  fieldName: "rateFilter",
                  fieldType: "equal",
                  classFilter: NumberFilter,
                })(value);
              }}
            />
          </Col>
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("taxs.description")}
              placeHolder={translate("taxs.placeholder.description")}
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
