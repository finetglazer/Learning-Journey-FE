import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { SupplierCategoryConfigFilter } from "models/SupplierCategoryConfig";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import { InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  SupplierCategoryConfigMasterContext,
  SupplierCategoryConfigMasterContextModel,
} from "./SupplierCategoryConfigMasterHook";
// import { supplierCategoryConfigRepository } from "core/repositories/SupplierCategoryConfigRepository";
// import { SupplierCategoryConfigMasterContext, SupplierCategoryConfigMasterContextModel } from "./SupplierCategoryConfigMasterHook";
import styles from "./SupplierCategoryConfigAdvancedFilter.module.scss";
export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface SupplierCategoryConfigMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SupplierCategoryConfigMasterAdvanceFilter = ({
  setVisible,
}: SupplierCategoryConfigMasterAdvanceFilterProps) => {
  const supplierCategoryConfigMaster =
    useContext<SupplierCategoryConfigMasterContextModel>(
      SupplierCategoryConfigMasterContext
    );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = supplierCategoryConfigMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: SupplierCategoryConfigFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const { handleChangeInputFilter } = filterService.useFilter(
    modelFilter,
    dispatchFilter
  );

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
      <FilterPanel.Right lg={24}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("supplierCategoryConfigs.code")}
              placeHolder={translate(
                "supplierCategoryConfigs.placeholder.code"
              )}
              value={modelFilter?.code}
              onChange={(value) => {
                const trimmedText = (value || "").trim();
                handleChangeInputFilter({
                  fieldName: "code",
                  classFilter: StringFilter,
                })(trimmedText);
              }}
              className="form-item"
              isSmall={false}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("supplierCategoryConfigs.name")}
              placeHolder={translate(
                "supplierCategoryConfigs.placeholder.name"
              )}
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
              label={translate("supplierCategoryConfigs.description")}
              placeHolder={translate(
                "supplierCategoryConfigs.placeholder.description"
              )}
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
