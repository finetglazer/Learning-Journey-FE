import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { GLAccountFilter } from "models/GLAccount";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  GLAccountMasterContext,
  GLAccountMasterContextModel,
} from "./GLAccountMasterHook";
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

interface GLAccountMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GLAccountMasterAdvanceFilter = ({
  setVisible,
}: GLAccountMasterAdvanceFilterProps) => {
  const glAccountMaster = useContext<GLAccountMasterContextModel>(
    GLAccountMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = glAccountMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: GLAccountFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeDateRangeFilter,
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
      exceptNodeIds={values(datePickerPopupClassName)}
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
              label={translate("glAccounts.code")}
              placeHolder={translate("glAccounts.placeholder.code")}
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
              label={translate("glAccounts.name")}
              placeHolder={translate("glAccounts.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <DateRangePicker
              label={translate("glAccounts.startDate")}
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
              label={translate("glAccounts.endDate")}
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
              popupClassName={datePickerPopupClassName.second}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
