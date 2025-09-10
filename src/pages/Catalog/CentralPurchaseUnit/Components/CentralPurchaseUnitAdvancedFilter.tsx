import { Col, Row } from "antd";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { CheckboxGroup, MultipleSelect } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";

import { CentralPurchaseUnitFilter, Contact } from "models/CentralPurchaseUnit";
import CommonFilter from "models/CommonFilter";
import {
  CentralPurchaseUnitContext,
  CentralPurchaseUnitContextProps,
} from "../CentralPurchaseUnitMaster/CentralPurchaseUnitMasterHook";
import centralPurchaseUnitRepository from "../CentralPurchaseUnitRepository";

import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { listStatus } from "../constants";
import styles from "./CentralPurchaseUnitAdvancedFilter.module.scss";
import { ModelFilter } from "react-3layer-common";

interface CentralPurchaseUnitAdvancedFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const CentralPurchaseUnitAdvancedFilter = ({
  setVisible,
}: CentralPurchaseUnitAdvancedFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<CentralPurchaseUnitContextProps>(CentralPurchaseUnitContext);
  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: CentralPurchaseUnitFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const { handleChangeCheckboxFilter, handleChangeMultipleSelectFilter } =
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
      modelFilter={modelFilter}
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      handleClickOutside={handleClickOutside}
      className={styles["central-purchase-unit-filter-panel"]}
    >
      {/* Checkbox status */}
      <FilterPanel.Left lg={6}>
        <CheckboxGroup
          label={translate("CPU.txt_central_purchase_unit")}
          dataOptions={listStatus}
          values={modelFilter?.statusId || []}
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
              label={translate("CPU.txt_central_purchase_unit_code")}
              placeHolder={translate(
                "CPU.placeholder_central_purchase_unit_code"
              )}
              getList={(filter) =>
                centralPurchaseUnitRepository.getListFilter(filter, "code")
              }
              classFilter={CommonFilter}
              searchProperty="code"
              isSmall={false}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "codes",
              })}
            />
          </Col>

          {/* Name */}
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.namesValue || []}
              label={translate("CPU.txt_central_purchase_unit_name")}
              placeHolder={translate(
                "CPU.placeholder_central_purchase_unit_name"
              )}
              getList={(filter) =>
                centralPurchaseUnitRepository.getListFilter(filter, "name")
              }
              classFilter={CommonFilter}
              searchProperty="name"
              isSmall={false}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "names",
              })}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              label={translate("CPU.informationReceiversHD")}
              placeHolder={translate("CPU.placeholder.informationReceiversHD")}
              getList={centralPurchaseUnitRepository.getDropdownContact}
              classFilter={ModelFilter}
              onChange={(selectedList?: Contact[]) => {
                handleChangeMultipleSelectFilter({
                  fieldName: "informationReceiverHD",
                })(selectedList);
              }}
              values={modelFilter?.informationReceiverHDValue || []}
              isEnumerable={false}
              isSmall={false}
              searchProperty="search"
              searchType={null}
            />
          </Col>
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              label={translate("CPU.informationReceiversPAMS")}
              placeHolder={translate(
                "CPU.placeholder.informationReceiversPAMS"
              )}
              getList={centralPurchaseUnitRepository.getDropdownContact}
              classFilter={ModelFilter}
              onChange={(selectedList?: Contact[]) => {
                handleChangeMultipleSelectFilter({
                  fieldName: "informationReceiverPAMS",
                })(selectedList);
              }}
              values={modelFilter?.informationReceiverPAMSValue || []}
              isEnumerable={false}
              isSmall={false}
              searchProperty="search"
              searchType={null}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
