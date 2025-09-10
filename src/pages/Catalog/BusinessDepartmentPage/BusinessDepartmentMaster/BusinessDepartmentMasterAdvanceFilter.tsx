/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { BusinessDepartmentFilter } from "models/BusinessDepartment";
import { useCallback, useContext, useEffect } from "react";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
  MultipleSelect,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  BusinessDepartmentMasterContext,
  BusinessDepartmentMasterContextModel,
} from "./BusinessDepartmentMasterHook";

// import { DATE_FORMAT_ARRAY } from "core/config/consts";
import { BusinessUnit, BusinessUnitFilter } from "models/BusinessUnit";

import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { businessDepartmentRepository } from "../BusinessDepartmentRepository";
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

interface BusinessDepartmentMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BusinessDepartmentMasterAdvanceFilter = ({
  setVisible,
}: BusinessDepartmentMasterAdvanceFilterProps) => {
  const businessDepartmentMaster =
    useContext<BusinessDepartmentMasterContextModel>(
      BusinessDepartmentMasterContext
    );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
    handleResetList,
  } = businessDepartmentMaster;

  const [translate] = useTranslation();

  const { handleResetFilter, modelFilter, dispatchFilter, handleClickOutside } =
    filterAdvanceService.useFilterAdvance({
      ModelFilterClass: BusinessDepartmentFilter,
      filter,
      updateFilter,
      handleCloseFilter: () => setVisible(false),
      handleLoadList,
    });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeDateFilter,
    handleChangeMultipleSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  const handleSaveModelFilter = useCallback(() => {
    updateFilter({
      type: FilterActionEnum.SET,
      payload: modelFilter,
    });

    setVisible(false);
    handleLoadList(modelFilter);
  }, [handleLoadList, modelFilter, setVisible, updateFilter]);

  const handleClearModelFilter = useCallback(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...new BusinessDepartmentFilter(),
        subSystemId: filter.subSystemId,
      },
    });

    setVisible(false);
    handleResetList();
  }, [dispatchFilter, filter.subSystemId, handleResetList, setVisible]);

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
      handleApplyFilter={handleSaveModelFilter}
      handleResetFilter={handleResetFilter}
      handleClearModelFilter={handleClearModelFilter}
      modelFilter={modelFilter}
      handleClickOutside={handleClickOutside}
      handleToggleFilter={setVisible}
      exceptNodeIds={values(datePickerPopupClassName)}
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
              label={translate("businessDepartments.code")}
              placeHolder={translate("businessDepartments.placeholder.code")}
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
              label={translate("businessDepartments.name")}
              placeHolder={translate("businessDepartments.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={24} className="m-b--md">
            <MultipleSelect
              label={translate("businessDepartments.businessUnit")}
              placeHolder={translate(
                "businessDepartments.placeholder.businessUnit"
              )}
              getList={businessDepartmentRepository.getDropdownBusinessUnit}
              classFilter={BusinessUnitFilter}
              onChange={(selectedList?: BusinessUnit[]) => {
                handleChangeMultipleSelectFilter({
                  fieldName: "businessUnit",
                })(selectedList);
              }}
              values={modelFilter?.businessUnitValue || []}
              isEnumerable={false}
              render={(unit) => {
                return unit?.id ? `${unit?.code} - ${unit?.name}` : null;
              }}
              searchProperty="search"
              searchType={null}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <DateRangePicker
              label={translate("businessBranchs.startDate")}
              placeholder={[
                translate("businessBranchs.placeholder.startDate"),
                translate("businessBranchs.placeholder.startDate"),
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
          <Col lg={12} className="m-b--md">
            <DateRangePicker
              label={translate("businessBranchs.endDate")}
              placeholder={[
                translate("businessBranchs.placeholder.endDate"),
                translate("businessBranchs.placeholder.endDate"),
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
          {/* <Col lg={12} className="m-b--md">
            <DateRangePicker
              label={translate("businessDepartments.startDate")}
              className="form-item"
              onChange={handleChangeDateRangeAdvanceFilter({
                fieldType: ["startDateFrom", "startDateEnd"],
              })}
              value={[modelFilter?.startDateFrom, modelFilter?.startDateEnd]}
              placeholder={[
                translate("CM.placeholder_date_from"),
                translate("CM.placeholder_date__to"),
              ]}
              dateFormat={DATE_FORMAT_ARRAY}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <DateRangePicker
              label={translate("businessDepartments.endDate")}
              className="form-item"
              onChange={handleChangeDateRangeAdvanceFilter({
                fieldType: ["endDateFrom", "endDateEnd"],
              })}
              value={[modelFilter?.endDateFrom, modelFilter?.endDateEnd]}
              placeholder={[
                translate("CM.placeholder_date_from"),
                translate("CM.placeholder_date__to"),
              ]}
              dateFormat={DATE_FORMAT_ARRAY}
            />
          </Col> */}
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
