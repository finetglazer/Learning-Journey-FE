/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { SupplierEvaluationConfigFilter } from "models/SupplierEvaluationConfig";
import React, { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import { CheckboxGroup, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  SupplierEvaluationConfigMasterContext,
  SupplierEvaluationConfigMasterContextModel,
} from "./SupplierEvaluationConfigMasterHook";
export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface SupplierEvaluationConfigMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SupplierEvaluationConfigMasterAdvanceFilter = ({
  setVisible,
}: SupplierEvaluationConfigMasterAdvanceFilterProps) => {
  const supplierEvaluationConfigMaster =
    useContext<SupplierEvaluationConfigMasterContextModel>(
      SupplierEvaluationConfigMasterContext
    );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = supplierEvaluationConfigMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: SupplierEvaluationConfigFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });
  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
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
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("supplierEvaluationConfigs.code")}
              placeHolder={translate(
                "supplierEvaluationConfigs.placeholder.code"
              )}
              value={modelFilter?.code}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("supplierEvaluationConfigs.name")}
              placeHolder={translate(
                "supplierEvaluationConfigs.placeholder.name"
              )}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("supplierEvaluationConfigs.description")}
              placeHolder={translate(
                "supplierEvaluationConfigs.placeholder.description"
              )}
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
