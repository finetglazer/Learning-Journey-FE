import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { listStatus } from "config/const";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { SupplierFilter } from "models/Supplier/SupplierFilter";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  SupplierContext,
  SupplierContextType,
} from "pages/Catalog/Supplier/context";
import supplierRepository from "pages/Catalog/Supplier/SupplierRepository";

interface SupplierAdvanceFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const SupplierAdvanceFilter = ({
  setVisible,
}: SupplierAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<SupplierContextType>(SupplierContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: SupplierFilter,
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
    >
      {/* Checkbox status */}
      <FilterPanel.Left lg={6}>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listStatus}
          values={modelFilter?.statusId || []}
          onChange={handleChangeCheckboxFilter({
            fieldName: "status",
          })}
        />
      </FilterPanel.Left>
      {/* More fields */}
      <FilterPanel.Right lg={18}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("SL.txt_code")}
              placeHolder={translate("SL.placeholder_code_search")}
              value={modelFilter?.code}
              onChange={(value) => {
                const trimmedText = (value || "").trim();
                handleChangeInputFilter({
                  fieldName: "code",
                })(trimmedText);
              }}
            />
          </Col>

          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("SL.txt_name")}
              placeHolder={translate("SL.placeholder_name_search")}
              value={modelFilter?.name}
              onChange={(value) => {
                const trimmedText = (value || "").trim();
                handleChangeInputFilter({
                  fieldName: "name",
                })(trimmedText);
              }}
            />
          </Col>
          {/* Start date */}
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              label={translate("SL.txt_city")}
              placeHolder={translate("SL.placeholder_city_search")}
              values={modelFilter?.provincesValue || []}
              classFilter={CommonFilter}
              getList={supplierRepository.getDropdownProvince}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "provinces",
              })}
              isUsingSearch
              searchProperty="search"
              searchType={null}
            />
          </Col>
          {/* End date */}
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              label={translate("SL.txt_nation")}
              placeHolder={translate("SL.placeholder_nation_search")}
              values={modelFilter?.nationsValue || []}
              classFilter={CommonFilter}
              getList={supplierRepository.getDropdownNation}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "nations",
              })}
              isUsingSearch
              searchProperty="search"
              searchType={null}
            />
          </Col>
          {/* Type */}
          <Col lg={24} className="m-b--md">
            <MultipleSelect
              label={translate("SL.txt_type")}
              placeHolder={translate("SL.placeholder_type_search")}
              classFilter={CommonFilter}
              values={modelFilter.supplierTypesValue || []}
              onChange={(values) =>
                handleChangeMultipleSelectFilter({
                  fieldName: "supplierTypes",
                })(values)
              }
              getList={supplierRepository.getDropdownSupplierType}
              isUsingSearch
              searchProperty="search"
              searchType={null}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
