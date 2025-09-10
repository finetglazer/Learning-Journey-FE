import React, { useContext, useEffect } from "react";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { CheckboxGroup, InputText } from "react-components-design-system";
import { Col, Row } from "antd";
import { StringFilter } from "react-3layer-advance-filters";
import { listStatus } from "pages/Catalog/CurrencyPage/CurrencyMaster/CurrencyAdvanceFilter";
import { useTranslation } from "react-i18next";
import { FilterActionEnum } from "core/services/service-types";
import {
  ReportTemplateManagementContext,
  ReportTemplateManagementContextProps,
} from "pages/SystemAdministration/ReportTemplate/ReportTemplateManagementHook";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { CurrencyFilter } from "models/Currency";
import { filterService } from "core/services/page-services/filter-service";

interface ReportTemplateAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReportTemplateAdvanceFilter: React.FC<
  ReportTemplateAdvanceFilterProps
> = ({ setVisible }) => {
  const [translate] = useTranslation();
  const reportTemplate = useContext<ReportTemplateManagementContextProps>(
    ReportTemplateManagementContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = reportTemplate;

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: CurrencyFilter,
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
      className="currency__advance-filter"
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
              label={translate("reportTemplates.code")}
              placeHolder={translate("reportTemplates.placeholder.code")}
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
              label={translate("reportTemplates.name")}
              placeHolder={translate("reportTemplates.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
