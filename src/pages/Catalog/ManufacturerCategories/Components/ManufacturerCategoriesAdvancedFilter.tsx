import { Col, Row } from "antd";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { IdFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";

import { ManufacturerCategoriesFilter } from "models/ManufacturerCategories";
import {
  ManufacturerCategoriesContext,
  ManufacturerCategoriesContextProps,
} from "../ManufacturerCategoriesMaster/ManufacturerCategoriesMasterHook";
import manufacturerCategoriesRepository from "../ManufacturerCategoriesRepository";

import FilterPanel from "components/FilterPanel/FilterPanel";
import { listStatus } from "../constants";

import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import CommonFilter from "models/CommonFilter";
import styles from "./ManufacturerCategoriesAdvancedFilter.module.scss";

interface ManufacturerCategoriesAdvancedFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const ManufacturerCategoriesAdvancedFilter = ({
  setVisible,
}: ManufacturerCategoriesAdvancedFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<ManufacturerCategoriesContextProps>(
    ManufacturerCategoriesContext
  );
  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ManufacturerCategoriesFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeMultipleSelectFilter,
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
      className={styles["manufacturer-filter-panel"]}
    >
      {/* Checkbox status */}
      <FilterPanel.Left lg={5}>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listStatus}
          values={modelFilter?.statusId || []}
          onChange={handleChangeCheckboxFilter({
            fieldName: "status",
          })}
        />
      </FilterPanel.Left>

      <FilterPanel.Right lg={19}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.codesValue || []}
              label={translate("MC.txt_manufacturer_categories_code")}
              placeHolder={translate(
                "MC.placeholder_manufacturer_categories_code"
              )}
              getList={manufacturerCategoriesRepository.getListCode}
              classFilter={CommonFilter}
              isSmall={false}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "codes",
                classFilter: IdFilter,
              })}
            />
          </Col>

          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("MC.txt_manufacturer_categories_name")}
              placeHolder={translate(
                "MC.placeholder_manufacturer_categories_name"
              )}
              value={modelFilter?.name}
              isSmall={false}
              onChange={handleChangeInputFilter({
                fieldName: "name",
              })}
            />
          </Col>

          {/* Description */}
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("MC.txt_manufacturer_categories_description")}
              placeHolder={translate(
                "MC.placeholder_manufacturer_categories_description"
              )}
              value={modelFilter?.description}
              onChange={handleChangeInputFilter({
                fieldName: "description",
              })}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
