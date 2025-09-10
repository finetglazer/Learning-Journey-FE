import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import React, { useCallback, useContext } from "react";
import {
  CheckboxGroup,
  DateRangePicker,
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import {
  TemporaryImportAssetMaster,
  TemporaryImportAssetMasterContext,
} from "../TemporaryImportAssetMasterHook";
import { useTranslation } from "react-i18next";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { TemporaryImportAssetFilter } from "models/TemporaryImportAsset/TemporaryImportAssetFilter";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { FilterActionEnum } from "core/services/service-types";
import { filterService } from "core/services/page-services/filter-service";
import {
  listTemporaryImportAssetStatusEnum,
  MAX_DIGITAL_NUMBER_4_DIGITS,
  NUMBER_MAX_13,
} from "config/const";
import { map, of } from "rxjs";
import { temporaryImportAssetRepository } from "../../TemporaryImportAssetRepository";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { gt } from "lodash";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";

interface TemporaryImportAssetMasterAdvanceFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const TemporaryImportAssetMasterTabAdvanceFilter = (
  props: TemporaryImportAssetMasterAdvanceFilterProps
) => {
  const appUserMaster = useContext<TemporaryImportAssetMaster>(
    TemporaryImportAssetMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
    notifyToast,
  } = appUserMaster;

  const { setVisible } = props;
  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: TemporaryImportAssetFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeNumberRangeFilter,
    handleChangeDateFilter,
    handleChangeMultipleSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  const handleSaveModelFilter = useCallback(() => {
    if (
      gt(
        modelFilter?.totalRangeFrom?.lessEqual,
        modelFilter?.totalRangeTo?.greaterEqual
      )
    ) {
      notifyToast({
        type: "error",
        message: translate("PL.warning_total_range_filter_message"),
      });
      return;
    }

    handleApplyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelFilter?.totalRange, translate, handleApplyFilter, notifyToast]);

  React.useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <div className="temporary_import_asset-filter">
      <FilterPanel
        handleApplyFilter={handleSaveModelFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        listIgnoreCountField={["orderBy", "orderType", "search", "tab"]}
        handleClickOutside={handleClickOutside}
        modelFilter={modelFilter}
      >
        <FilterPanel.Left>
          <CheckboxGroup
            label={translate("CM.txt_status")}
            dataOptions={listTemporaryImportAssetStatusEnum}
            values={modelFilter?.statusId}
            onChange={handleChangeCheckboxFilter({
              fieldName: "status",
              classFilter: IdFilter,
            })}
          />
        </FilterPanel.Left>
        <FilterPanel.Right hasLeft lg={20}>
          <Row gutter={[16, 16]}>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("TIA.label_temporary_code")}
                placeHolder={translate("TIA.plh_temporary_code")}
                value={modelFilter?.code}
                onChange={handleChangeInputFilter({
                  fieldName: "code",
                  classFilter: StringFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("TIA.label_temporary_description")}
                placeHolder={translate("TIA.plh_temporary_description")}
                value={modelFilter?.note}
                onChange={handleChangeInputFilter({
                  fieldName: "note",
                  classFilter: StringFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("TIA.label_temporary_asset_code")}
                placeHolder={translate("TIA.plh_temporary_asset_code")}
                value={modelFilter?.assetCode}
                onChange={handleChangeInputFilter({
                  fieldName: "assetCode",
                  classFilter: StringFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={16}>
              <div className="purchase_plan-advance-filter__form-around">
                <InputNumber
                  className="form-item"
                  label={translate("TIA.label_temporary_values")}
                  placeHolder={translate("TIA.plh_from")}
                  value={modelFilter?.totalRangeFrom?.lessEqual}
                  onChange={(lessEqual: number) =>
                    handleChangeNumberRangeFilter({
                      fieldName: "totalRangeFrom",
                    })([modelFilter?.totalRangeTo?.greaterEqual, lessEqual])
                  }
                  decimalDigit={MAX_DIGITAL_NUMBER_4_DIGITS}
                  numberType="DECIMAL"
                  max={NUMBER_MAX_13}
                  isSmall={false}
                />
                <span className="form-item__connect">-</span>
                <InputNumber
                  className="form-item"
                  label={undefined}
                  placeHolder={translate("TIA.plh_to")}
                  value={modelFilter?.totalRangeTo?.greaterEqual}
                  onChange={(greaterEqual: number) =>
                    handleChangeNumberRangeFilter({
                      fieldName: "totalRangeTo",
                    })([greaterEqual, modelFilter?.totalRangeFrom?.lessEqual])
                  }
                  decimalDigit={MAX_DIGITAL_NUMBER_4_DIGITS}
                  numberType="DECIMAL"
                  max={NUMBER_MAX_13}
                  isSmall={false}
                />
              </div>
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.goodsIdsValue || []}
                isSmall={false}
                label={translate("TIA.label_goods_service")}
                placeHolder={translate("TIA.plh_goods_service")}
                getList={(filter: ModelFilter) =>
                  temporaryImportAssetRepository
                    .getGoodServicesList({
                      ...filter,
                      search: filter?.name?.contain,
                    })
                    .pipe(
                      map((response) =>
                        Array.isArray(response?.data?.items)
                          ? response?.data?.items
                          : []
                      )
                    )
                }
                render={(item) => item.code + " - " + item.name}
                classFilter={DemoFilter}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "goodsIds",
                })}
              />
            </Col>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("TIA.label_contract_code")}
                placeHolder={translate("TIA.plh_search_contract_code")}
                value={modelFilter?.contractCode}
                onChange={handleChangeInputFilter({
                  fieldName: "contractCode",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("TIA.label_contract_number")}
                placeHolder={translate("TIA.plh_contract_number")}
                value={modelFilter?.contractNumber}
                onChange={handleChangeInputFilter({
                  fieldName: "contractNumber",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("TIA.label_contract_name")}
                placeHolder={translate("TIA.plh_contract_name")}
                value={modelFilter?.contractName}
                onChange={handleChangeInputFilter({
                  fieldName: "contractName",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.supplierIdsValue || []}
                label={translate("TIA.label_provider")}
                placeHolder={translate("TIA.plh_provider")}
                getList={purchasingPlanRepository.getDropdownSupplier}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "supplierIds",
                })}
                render={(item) => item.name}
                classFilter={DemoFilter}
                isSmall={false}
                isEnumerable={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                className="form-item"
                values={modelFilter?.createUserValue || []}
                label={translate("TIA.label_creator")}
                placeHolder={translate("TIA.plh_creator")}
                render={(item) => item?.email + " - " + item?.name}
                getList={budgetRepository.listMasterUser}
                classFilter={DemoFilter}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "createUser",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                className="form-item"
                values={modelFilter?.businessUnitIdValue || []}
                label={translate("TIA.label_unit_creator")}
                placeHolder={translate("TIA.plh_unit_creator")}
                getList={contractRepository.getListOrganization}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                classFilter={DemoFilter}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "businessUnitId",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <DateRangePicker
                className="form-picker mb-3"
                label={translate("TIA.label_creation_time")}
                onChange={handleChangeDateFilter({
                  fieldName: "createDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                value={[
                  modelFilter?.createDate?.greaterEqual,
                  modelFilter?.createDate?.lessEqual,
                ]}
                placeholder={[
                  translate("TIA.plh_creation_time_from"),
                  translate("TIA.plh_creation_time_to"),
                ]}
                bgColor="white"
                isSmall={false}
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};

export default TemporaryImportAssetMasterTabAdvanceFilter;
