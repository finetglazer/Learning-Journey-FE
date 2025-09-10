import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import CommonFilter from "models/CommonFilter";
import { SupplierTypeFilter } from "models/SupplierType";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { supplierTypeRepository } from "../SupplierTypeRepository";
import {
  SupplierTypeMasterContext,
  SupplierTypeMasterContextModel,
} from "./SupplierTypeMasterHook";
// import { supplierTypeRepository } from "core/repositories/SupplierTypeRepository";
// import { SupplierTypeMasterContext, SupplierTypeMasterContextModel } from "./SupplierTypeMasterHook";
import styles from "./SupplierTypeAdvancedFilter.module.scss";
export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface SupplierTypeMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SupplierTypeMasterAdvanceFilter = ({
  setVisible,
}: SupplierTypeMasterAdvanceFilterProps) => {
  const supplierTypeMaster = useContext<SupplierTypeMasterContextModel>(
    SupplierTypeMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = supplierTypeMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: SupplierTypeFilter,
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
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      handleClickOutside={handleClickOutside}
      modelFilter={modelFilter}
      handleToggleFilter={setVisible}
      className={styles["supplier-type-filter-panel"]}
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
            <MultipleSelect
              values={modelFilter?.codesValue || []}
              label={translate("supplierType.code")}
              placeHolder={translate("supplierType.placeholder.code")}
              getList={supplierTypeRepository.getListCode}
              classFilter={CommonFilter}
              isSmall={false}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "codes",
              })}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("supplierType.name")}
              placeHolder={translate("supplierType.placeholder.name")}
              value={modelFilter?.name}
              onChange={(value) => {
                const trimmedText = (value || "").trim();
                handleChangeInputFilter({
                  fieldName: "name",
                  classFilter: StringFilter,
                })(trimmedText);
              }}
              className="form-item"
              isSmall={false}
            />
          </Col>
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("supplierType.description")}
              placeHolder={translate("supplierType.placeholder.description")}
              value={modelFilter?.description}
              onChange={(value) => {
                const trimmedText = (value || "").trim();
                handleChangeInputFilter({
                  fieldName: "description",
                  classFilter: StringFilter,
                })(trimmedText);
              }}
              isSmall={false}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
