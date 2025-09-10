import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { CurrencyFilter } from "models/Currency";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import { CheckboxGroup, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CurrencyMasterContext,
  CurrencyMasterContextModel,
} from "./CurrencyMasterHook";

import "./CurrencyAdvanceFilter.scss";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface CurrencyMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CurrencyMasterAdvanceFilter = ({
  setVisible,
}: CurrencyMasterAdvanceFilterProps) => {
  const currencyMaster = useContext<CurrencyMasterContextModel>(
    CurrencyMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = currencyMaster;

  const [translate] = useTranslation();

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
              label={translate("currencies.code")}
              placeHolder={translate("currencies.placeholder.code")}
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
              label={translate("currencies.name")}
              placeHolder={translate("currencies.placeholder.name")}
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
