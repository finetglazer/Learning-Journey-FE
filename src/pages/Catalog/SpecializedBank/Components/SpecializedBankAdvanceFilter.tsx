import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { SpecializedBankFilter } from "models/SpecializedBank/SpecializedBankFilter";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  SpecializedBankContext,
  SpecializedBankHooks,
} from "../SpecializedBankMasterHooks";
import { listStatus, listType } from "../constants";
import { datePickerPopupClassName } from "core/config/consts";
import { values } from "lodash";

interface SpecializedBankAdvanceFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const SpecializedBankAdvanceFilter = ({
  setVisible,
}: SpecializedBankAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<SpecializedBankHooks>(SpecializedBankContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: SpecializedBankFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeMultipleSelectFilter,
    handleChangeDateFilter,
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
      modelFilter={modelFilter}
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      handleClickOutside={handleClickOutside}
      exceptNodeIds={values(datePickerPopupClassName)}
      width={1000}
    >
      {/* Checkbox status */}
      <FilterPanel.Left lg={8}>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listStatus()}
          values={modelFilter?.statusId || []}
          onChange={handleChangeCheckboxFilter({
            fieldName: "status",
          })}
        />
      </FilterPanel.Left>
      {/* More fields */}
      <FilterPanel.Right lg={16}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("SB.txt_specialized_bank_code")}
              placeHolder={translate("SB.placeholder_specialized_bank_code")}
              value={modelFilter?.code?.contain}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                fieldType: "contain",
              })}
            />
          </Col>

          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("SB.txt_specialized_bank_name")}
              placeHolder={translate("SB.placeholder_specialized_bank_name")}
              value={modelFilter?.name?.contain}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                fieldType: "contain",
              })}
            />
          </Col>
          {/* Type */}
          <Col lg={24} className="m-b--md">
            <MultipleSelect
              label={translate("SB.txt_specialized_bank_type")}
              placeHolder={translate("SB.placeholder_specialized_bank_type")}
              classFilter={CommonFilter}
              getList={listType}
              values={modelFilter.typeValue || []}
              onChange={(values) =>
                handleChangeMultipleSelectFilter({
                  fieldName: "type",
                })(values)
              }
            />
          </Col>
          {/* Start date */}
          <Col lg={12} className="m-b--md">
            <DateRangePicker
              label={translate("CM.txt_start_date")}
              placeholder={[
                translate("SB.placeholder_from_date"),
                translate("SB.placeholder_to_date"),
              ]}
              value={[
                modelFilter?.startDate?.greaterEqual,
                modelFilter?.startDate?.lessEqual,
              ]}
              onChange={handleChangeDateFilter({
                fieldName: "startDate",
                fieldType: ["greaterEqual", "lessEqual"],
              })}
              popupClassName={datePickerPopupClassName.first}
            />
          </Col>
          {/* End date */}
          <Col lg={12} className="m-b--md">
            <DateRangePicker
              label={translate("CM.txt_end_date")}
              placeholder={[
                translate("SB.placeholder_from_date"),
                translate("SB.placeholder_to_date"),
              ]}
              value={[
                modelFilter?.endDate?.greaterEqual,
                modelFilter?.endDate?.lessEqual,
              ]}
              onChange={handleChangeDateFilter({
                fieldName: "endDate",
                fieldType: ["greaterEqual", "lessEqual"],
              })}
              popupClassName={datePickerPopupClassName.second}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
