import { Checkbox, Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { BankFilter } from "models/Bank";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import { CheckboxGroup, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { BankMasterContext, BankMasterContextModel } from "./BankMasterHook";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

export const listBoolean = () => [
  { value: true, label: t("banks.isInternal") },
  { value: false, label: t("banks.isNotInternal") },
];

interface BankMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BankMasterAdvanceFilter = ({
  setVisible,
}: BankMasterAdvanceFilterProps) => {
  const bankMaster = useContext<BankMasterContextModel>(BankMasterContext);
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = bankMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: BankFilter,
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
      handleResetFilter={handleResetFilter}
      handleClearModelFilter={handleClearFilter}
      modelFilter={modelFilter}
      handleToggleFilter={setVisible}
      handleClickOutside={handleClickOutside}
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
              label={translate("banks.code")}
              placeHolder={translate("banks.placeholder.code")}
              value={modelFilter?.code}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={12} className="m-b--md m-t--xl">
            <Checkbox.Group
              options={listBoolean()}
              value={modelFilter?.isInternals}
              onChange={(checkedValue: boolean[]) => {
                handleChangeAllFilter({
                  ...modelFilter,
                  isInternals: checkedValue,
                });
              }}
            ></Checkbox.Group>
          </Col>
          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("banks.name")}
              placeHolder={translate("banks.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("banks.description")}
              placeHolder={translate("banks.placeholder.description")}
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
