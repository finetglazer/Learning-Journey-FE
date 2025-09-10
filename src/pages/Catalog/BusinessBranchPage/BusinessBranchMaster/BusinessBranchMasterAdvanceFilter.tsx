import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { BusinessBranchFilter } from "models/BusinessBranch";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  BusinessBranchMasterContext,
  BusinessBranchMasterContextModel,
} from "./BusinessBranchMasterHook";
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

interface BusinessBranchMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BusinessBranchMasterAdvanceFilter = ({
  setVisible,
}: BusinessBranchMasterAdvanceFilterProps) => {
  const businessBranchMaster = useContext<BusinessBranchMasterContextModel>(
    BusinessBranchMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = businessBranchMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: BusinessBranchFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
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
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      modelFilter={modelFilter}
      handleToggleFilter={setVisible}
      handleClickOutside={handleClickOutside}
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
              label={translate("businessBranchs.code")}
              placeHolder={translate("businessBranchs.placeholder.code")}
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
              label={translate("businessBranchs.name")}
              placeHolder={translate("businessBranchs.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
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
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
