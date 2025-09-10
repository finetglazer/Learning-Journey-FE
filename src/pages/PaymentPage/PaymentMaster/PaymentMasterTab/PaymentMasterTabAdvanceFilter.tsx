import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import {
  listPaymentMethodEnum,
  listPaymentStatusEnum,
  listPaymentStatusErpEnum,
  listPurposeShoppingEnum,
} from "config/const";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { PaymentFilter } from "models/Payment";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import React, { useContext, useEffect } from "react";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
  MultipleSelect,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import { PaymentMaster, PaymentMasterContext } from "../PaymentMasterHook";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { paymentAdvancedFilters } from "pages/PurchasePage/constants";

interface PaymentMasterAdvanceFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

export class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const listPaymentMethod = () => {
  return of(listPaymentMethodEnum);
};

const listPurposeShopping = () => {
  return of(listPurposeShoppingEnum);
};

const PaymentMasterAdvanceFilter = ({
  setVisible,
}: PaymentMasterAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<PaymentMaster>(PaymentMasterContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: PaymentFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeDateFilter,
    handleChangeSelectFilter,
    handleChangeMultipleSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  const listType = () => {
    return of(modelFilter?.costTypeIdValue?.costGroups);
  };

  return (
    <FilterPanel
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.btn_apply")}
      modelFilter={modelFilter}
      handleClickOutside={handleClickOutside}
      className="custom-filter_panel"
    >
      <div className="d-flex">
        <div className="custom-filter_panel__left">
          <FilterPanel.Left lg={24}>
            <Col lg={24} className="m-b--lg">
              <CheckboxGroup
                label={translate("CM.txt_status_approval")}
                dataOptions={listPaymentStatusEnum}
                values={modelFilter?.statusesId?.in}
                onChange={handleChangeCheckboxFilter({
                  fieldName: "statuses",
                  fieldType: "in",
                  classFilter: IdFilter,
                })}
              />
            </Col>
            <CheckboxGroup
              label={translate("CM.txt_status_erp")}
              dataOptions={listPaymentStatusErpEnum}
              values={modelFilter?.erpStatusesId?.in}
              onChange={handleChangeCheckboxFilter({
                fieldName: "erpStatuses",
                fieldType: "in",
                classFilter: IdFilter,
              })}
            />
            <Col lg={24} className="m-b--lg" style={{ marginTop: 24 }}>
              <CheckboxGroup
                label={translate("CM.txt_advanced_filters")}
                dataOptions={paymentAdvancedFilters}
                values={modelFilter?.advancedFiltersId || []}
                onChange={handleChangeCheckboxFilter({
                  fieldName: "advancedFilters",
                })}
              />
            </Col>
          </FilterPanel.Left>
        </div>
        <div>
          <FilterPanel.Right lg={24}>
            <Row gutter={16}>
              <Col lg={8} className="m-b--sm">
                <InputText
                  value={modelFilter?.code?.contain}
                  label={translate("PM.label_ticket_code")}
                  placeHolder={translate("PM.plh_ticket_code")}
                  onChange={handleChangeInputFilter({
                    fieldName: "code",
                    fieldType: "contain",
                    classFilter: StringFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <InputText
                  value={modelFilter?.description?.contain}
                  label={translate("PM.label_interpretation_proposal")}
                  placeHolder={translate("PM.plh_interpretation_proposal")}
                  onChange={handleChangeInputFilter({
                    fieldName: "description",
                    fieldType: "contain",
                    classFilter: StringFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <MultipleSelect
                  values={modelFilter?.requesterValue || []}
                  label={translate("PM.label_proponent")}
                  placeHolder={translate("PM.plh_proponent")}
                  render={(item) => item?.email}
                  getList={budgetRepository.listMasterUser}
                  classFilter={DemoFilter}
                  onChange={handleChangeMultipleSelectFilter({
                    fieldName: "requester",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <Select
                  value={modelFilter?.paymentRequestTypeIdValue}
                  label={translate("PM.label_type_request")}
                  placeHolder={translate("PM.plh_type_request")}
                  getList={paymentRepository.listRequestType}
                  appendToBody
                  classFilter={DemoFilter}
                  onChange={handleChangeSelectFilter({
                    fieldName: "paymentRequestTypeId",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <MultipleSelect
                  values={modelFilter?.currencyIdValue || []}
                  label={translate("PM.label_type_money")}
                  placeHolder={translate("PM.plh_type_money")}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  getList={paymentRepository.listPaymentCurrency}
                  classFilter={DemoFilter}
                  onChange={handleChangeMultipleSelectFilter({
                    fieldName: "currencyId",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <Select
                  value={modelFilter?.paymentMethodValue}
                  label={translate("PM.label_method_payment")}
                  placeHolder={translate("PM.plh_method_payment")}
                  getList={listPaymentMethod}
                  classFilter={DemoFilter}
                  onChange={handleChangeSelectFilter({
                    fieldName: "paymentMethod",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <Select
                  isSearch
                  searchProperty="name"
                  isEnumerable={false}
                  value={modelFilter?.costTypeIdValue}
                  label={translate("PM.label_type_cost")}
                  placeHolder={translate("PM.plh_type_cost")}
                  appendToBody
                  getList={paymentRepository.listCostType}
                  classFilter={DemoFilter}
                  onChange={handleChangeSelectFilter({
                    fieldName: "costTypeId",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                  render={(costType) => {
                    return costType?.id
                      ? `${costType?.code} - ${costType?.name}`
                      : null;
                  }}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <Select
                  isSearch
                  isEnumerable={false}
                  searchProperty="name"
                  value={modelFilter?.costGroupIdValue}
                  label={translate("PM.label_cost_item")}
                  placeHolder={translate("PM.plh_cost_item")}
                  appendToBody
                  getList={listType}
                  disabled={!modelFilter?.costTypeIdValue}
                  classFilter={DemoFilter}
                  onChange={handleChangeSelectFilter({
                    fieldName: "costGroupId",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <DateRangePicker
                  label={translate("PM.label_date_creadted")}
                  onChange={handleChangeDateFilter({
                    fieldName: "createDate",
                    fieldType: ["greaterEqual", "lessEqual"],
                  })}
                  value={[
                    modelFilter?.createDate?.greaterEqual,
                    modelFilter?.createDate?.lessEqual,
                  ]}
                  placeholder={[
                    translate("PM.plh_date_from"),
                    translate("PM.plh_date__to"),
                  ]}
                  bgColor="white"
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <Select
                  isSearch
                  searchProperty="name"
                  isEnumerable={false}
                  value={modelFilter?.businessBranchIdValue}
                  label={translate("PM.label_cn_pgd_proposal")}
                  placeHolder={translate("PM.plh_cn_pgd_proposal")}
                  appendToBody
                  getList={paymentRepository.listBusinessBranch}
                  classFilter={DemoFilter}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  onChange={handleChangeSelectFilter({
                    fieldName: "businessBranchId",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <Select
                  isSearch
                  searchProperty="name"
                  isEnumerable={false}
                  value={modelFilter?.businessUnitIdValue}
                  label={translate("PM.label_nhcd_proposal")}
                  placeHolder={translate("PM.plh_nhcd_proposal")}
                  appendToBody
                  getList={paymentRepository.listBusinessUnit}
                  classFilter={DemoFilter}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  onChange={handleChangeSelectFilter({
                    fieldName: "businessUnitId",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <Select
                  isSearch
                  searchProperty="name"
                  isEnumerable={false}
                  valueFilter={{
                    name: modelFilter?.businessDepartmentId,
                    businessUnitId: modelFilter?.businessUnitIdValue?.id,
                  }}
                  value={modelFilter?.businessDepartmentIdValue}
                  label={translate("PM.label_tt_pb_proposal")}
                  placeHolder={translate("PM.plh_tt_pb_proposal")}
                  getList={budgetRepository.listBusinessDepartment}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  classFilter={DemoFilter}
                  disabled={!modelFilter?.businessUnitIdValue}
                  appendToBody
                  onChange={handleChangeSelectFilter({
                    fieldName: "businessDepartmentId",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <Select
                  value={modelFilter?.purposeTypeValue}
                  label={translate("PM.label_purpose_shopping")}
                  placeHolder={translate("PM.plh_purpose_shopping")}
                  appendToBody
                  getList={listPurposeShopping}
                  classFilter={DemoFilter}
                  onChange={handleChangeSelectFilter({
                    fieldName: "purposeType",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                />
              </Col>

              <Col lg={8} className="m-b--sm">
                <Select
                  isSearch
                  searchProperty="name"
                  isEnumerable={false}
                  value={modelFilter?.supplierIdValue}
                  appendToBody
                  label={translate("PM.label_supplier")}
                  placeHolder={translate("PM.plh_supplier")}
                  getList={paymentRepository.listSupplier}
                  render={(t) => (t ? `${t?.taxCode} - ${t?.name}` : "")}
                  classFilter={DemoFilter}
                  onChange={handleChangeSelectFilter({
                    fieldName: "supplierId",
                    fieldType: "in",
                    classFilter: IdFilter,
                  })}
                  isSmall={false}
                />
              </Col>
            </Row>
          </FilterPanel.Right>
        </div>
      </div>
    </FilterPanel>
  );
};

export default PaymentMasterAdvanceFilter;
