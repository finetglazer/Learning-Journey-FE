import { Checkbox, Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { UnitOfMeasureFilter } from "models/UnitOfMeasure";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import { CheckboxGroup, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  UnitOfMeasureMasterContext,
  UnitOfMeasureMasterContextModel,
} from "./UnitOfMeasureMasterHook";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

export const listBoolean = () => [
  { value: true, label: t("unitOfMeasures.isDecimal") },
  { value: false, label: t("unitOfMeasures.isNotDecimal") },
];

interface UnitOfMeasureMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UnitOfMeasureMasterAdvanceFilter = ({
  setVisible,
}: UnitOfMeasureMasterAdvanceFilterProps) => {
  const unitOfMeasureMaster = useContext<UnitOfMeasureMasterContextModel>(
    UnitOfMeasureMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = unitOfMeasureMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: UnitOfMeasureFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
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
      handleToggleFilter={setVisible}
    >
      <FilterPanel.Left lg={6}>
        <>
          <CheckboxGroup
            label={translate("CM.txt_status")}
            dataOptions={listStatus()}
            values={modelFilter?.statusId}
            onChange={handleChangeCheckboxFilter({
              fieldName: "status",
            })}
          />
        </>
      </FilterPanel.Left>
      <FilterPanel.Right lg={18}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("unitOfMeasures.code")}
              placeHolder={translate("unitOfMeasures.placeholder.code")}
              value={modelFilter?.code}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("unitOfMeasures.name")}
              placeHolder={translate("unitOfMeasures.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={12} className="m-b--md m-t--xs">
            <Checkbox.Group
              options={listBoolean()}
              value={modelFilter?.isDecimals}
              onChange={(checkedValue: boolean[]) => {
                handleChangeAllFilter({
                  ...modelFilter,
                  isDecimals: checkedValue,
                });
              }}
            ></Checkbox.Group>
          </Col>

          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("unitOfMeasures.description")}
              placeHolder={translate("unitOfMeasures.placeholder.description")}
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
