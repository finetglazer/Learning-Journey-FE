import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { UnitOfMeasure, UnitOfMeasureFilter } from "models/UnitOfMeasure";
import { UnitOfMeasureGroupFilter } from "models/UnitOfMeasureGroup";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { unitOfMeasureGroupRepository } from "../UnitOfMeasureGroupRepository";
import {
  UnitOfMeasureGroupMasterContext,
  UnitOfMeasureGroupMasterContextModel,
} from "./UnitOfMeasureGroupMasterHook";
import styles from "./UnitOfMeasureAdvancedFilter.module.scss";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface UnitOfMeasureGroupMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UnitOfMeasureGroupMasterAdvanceFilter = ({
  setVisible,
}: UnitOfMeasureGroupMasterAdvanceFilterProps) => {
  const unitOfMeasureGroupMaster =
    useContext<UnitOfMeasureGroupMasterContextModel>(
      UnitOfMeasureGroupMasterContext
    );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = unitOfMeasureGroupMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: UnitOfMeasureGroupFilter,
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
      className={styles["unit-of-measure-group-filter-panel"]}
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
              label={translate("unitOfMeasureGroups.code")}
              placeHolder={translate("unitOfMeasureGroups.placeholder.code")}
              value={modelFilter?.code}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("unitOfMeasureGroups.name")}
              placeHolder={translate("unitOfMeasureGroups.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={24} className="m-b--md">
            <MultipleSelect
              label={translate("unitOfMeasureGroups.unitOfMeasure")}
              placeHolder={translate(
                "unitOfMeasureGroups.placeholder.unitOfMeasure"
              )}
              getList={unitOfMeasureGroupRepository.getDropdownUnitOfMeasure}
              classFilter={UnitOfMeasureFilter}
              onChange={(selectedList?: UnitOfMeasure[], ids?: []) => {
                handleChangeAllFilter({
                  ...modelFilter,
                  unitOfMeasureIds: ids,
                  unitOfMeasureIdsValue: selectedList,
                });
              }}
              values={modelFilter?.unitOfMeasureIdsValue || []}
              isEnumerable={false}
              searchProperty="search"
              searchType={null}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
