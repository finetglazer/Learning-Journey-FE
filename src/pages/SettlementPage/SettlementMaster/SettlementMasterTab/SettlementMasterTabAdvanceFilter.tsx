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
import { useTranslation } from "react-i18next";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
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
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { gt, values } from "lodash";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import {
  SettlementMaster,
  SettlementMasterContext,
} from "../SettlementMasterHook";
import { purchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import CommonFilter from "models/CommonFilter";
import { SettlementFilter } from "models/Settlement/SettlementFilter";
import { datePickerPopupClassName } from "core/config/consts";
import { contractPrincipleRepository } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleRepository";

interface TemporaryImportAssetMasterAdvanceFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const SettlementMasterTabAdvanceFilter = (
  props: TemporaryImportAssetMasterAdvanceFilterProps
) => {
  const appUserMaster = useContext<SettlementMaster>(SettlementMasterContext);
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
    ModelFilterClass: SettlementFilter,
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
    <div className="settlement_contract-filter">
      <FilterPanel
        handleApplyFilter={handleSaveModelFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        listIgnoreCountField={["orderBy", "orderType", "search", "tab"]}
        handleClickOutside={handleClickOutside}
        modelFilter={modelFilter}
        exceptNodeIds={values(datePickerPopupClassName)}
      >
        <FilterPanel.Left>
          <CheckboxGroup
            label={translate("settlement.txt_status_approval")}
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
                label={translate("settlement.filter_code")}
                placeHolder={translate("settlement.plh_code")}
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
                label={translate("settlement.filter_description")}
                placeHolder={translate("settlement.plh_description")}
                value={modelFilter?.description}
                onChange={handleChangeInputFilter({
                  fieldName: "description",
                  classFilter: StringFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <DateRangePicker
                className="form-picker"
                label={translate("settlement.filter_effective_date")}
                onChange={handleChangeDateFilter({
                  fieldName: "effectiveDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                value={[
                  modelFilter?.effectiveDate?.greaterEqual,
                  modelFilter?.effectiveDate?.lessEqual,
                ]}
                placeholder={[
                  translate("settlement.plh_form_day"),
                  translate("settlement.plh_to_day"),
                ]}
                bgColor="white"
                isSmall={false}
                popupClassName={datePickerPopupClassName.first}
              />
            </Col>
            <Col lg={16}>
              <div className="settlement_contract-advance-filter__form-around">
                <InputNumber
                  className="form-item"
                  label={translate("settlement.filter_value_settlement")}
                  placeHolder={translate("settlement.form")}
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
                  placeHolder={translate("settlement.to")}
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
                values={modelFilter?.supplierIdsValue || []}
                label={translate("settlement.filter_supplier")}
                placeHolder={translate("settlement.plh_supplier")}
                getList={contractPrincipleRepository.getListSupplier}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "supplierIds",
                })}
                render={(item) => item?.taxCode + " - " + item?.name}
                classFilter={DemoFilter}
                isSmall={false}
                isEnumerable={false}
              />
            </Col>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("settlement.filter_code_contract")}
                placeHolder={translate("settlement.plh_code_contract")}
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
                label={translate("settlement.filter_number_contract")}
                placeHolder={translate("settlement.plh_number_contract")}
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
                label={translate("settlement.filter_name_contract")}
                placeHolder={translate("settlement.plh_name_contract")}
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
                values={modelFilter?.costGroupValue || []}
                label={translate("settlement.filter_cost_groups")}
                placeHolder={translate("settlement.plh_cost_groups")}
                getList={purchasingPlanRepository.getListCostGroup}
                classFilter={CommonFilter}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "costGroup",
                })}
                render={(item) =>
                  item?.id ? `${item?.code} - ${item?.name}` : null
                }
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.goodsIdsValue || []}
                isSmall={false}
                label={translate("settlement.filter_goods_services")}
                placeHolder={translate("settlement.plh_goods_services")}
                getList={(filter: ModelFilter) =>
                  purchaseRequestRepository
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
                  classFilter: IdFilter,
                })}
              />
            </Col>
            <Col lg={8}>
              <DateRangePicker
                className="form-picker"
                label={translate("settlement.filter_date_creation")}
                onChange={handleChangeDateFilter({
                  fieldName: "createDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                value={[
                  modelFilter?.createDate?.greaterEqual,
                  modelFilter?.createDate?.lessEqual,
                ]}
                placeholder={[
                  translate("settlement.plh_form_day"),
                  translate("settlement.plh_to_day"),
                ]}
                bgColor="white"
                isSmall={false}
                popupClassName={datePickerPopupClassName.second}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                className="form-item mb-4"
                values={modelFilter?.createUserValue || []}
                label={translate("settlement.filter_creator")}
                placeHolder={translate("settlement.plh_creator")}
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
                values={modelFilter?.organizationIdValue || []}
                label={translate("settlement.filter_creation_unit")}
                placeHolder={translate("settlement.plh_creation_unit")}
                getList={contractRepository.getListOrganization}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                classFilter={DemoFilter}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "organizationId",
                })}
                isSmall={false}
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};

export default SettlementMasterTabAdvanceFilter;
