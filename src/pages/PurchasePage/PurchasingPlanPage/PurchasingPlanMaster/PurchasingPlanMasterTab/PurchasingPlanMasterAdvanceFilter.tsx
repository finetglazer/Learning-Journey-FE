import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import {
  listPurchasingPlanStatusEnum,
  listPurchasingPlanType,
  MAX_DIGITAL_NUMBER_4_DIGITS,
  NUMBER_MAX_13,
} from "config/const";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { gt } from "lodash";
import CommonFilter from "models/CommonFilter";
import { PurchasingPlanFilter } from "models/PurchasingPlan/PurchasingPlanFilter";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { purchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import React, { useCallback, useContext, useEffect } from "react";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import {
  CheckboxGroup,
  DateRangePicker,
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { map, of } from "rxjs";
import { purchasingPlanRepository } from "../../PurchasingPlanRepository";
import {
  PurchasingPlanMaster,
  PurchasingPlanMasterContext,
} from "../PurchasingPlanMasterHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";

interface BudgetMasterAdvanceFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const getListPurchasingPlan = (filter: ModelFilter) => {
  const filterString = filter?.name?.contain;
  return of(
    listPurchasingPlanType
      .filter((item) =>
        filterString
          ? item.name.toLowerCase().includes(filterString.toLowerCase())
          : true
      )
      .map((item) => ({
        ...item,
        id: item.id,
        name: item.name,
      }))
  );
};

const PurchasingPlanMasterAdvanceFilter = (
  props: BudgetMasterAdvanceFilterProps
) => {
  const appUserMaster = useContext<PurchasingPlanMaster>(
    PurchasingPlanMasterContext
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
    ModelFilterClass: PurchasingPlanFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeCheckboxFilter,
    handleChangeInputFilter,
    handleChangeMultipleSelectFilter,
    handleChangeDateFilter,
    handleChangeNumberRangeFilter,
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
  }, [
    modelFilter?.totalRangeFrom?.lessEqual,
    modelFilter?.totalRangeTo?.greaterEqual,
    handleApplyFilter,
    notifyToast,
    translate,
  ]);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <div className="purchase_plan-filter">
      <FilterPanel
        handleApplyFilter={handleSaveModelFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        listIgnoreCountField={[
          "orderBy",
          "orderType",
          "tabKey",
          "search",
          "tab",
        ]}
        handleClickOutside={handleClickOutside}
        modelFilter={modelFilter}
      >
        <FilterPanel.Left>
          <div className="d-flex flex-column gap-y--md">
            <CheckboxGroup
              label={translate("CM.txt_status")}
              dataOptions={listPurchasingPlanStatusEnum}
              values={modelFilter?.statusesId}
              onChange={handleChangeCheckboxFilter({
                fieldName: "statuses",
                classFilter: IdFilter,
              })}
            />
          </div>
        </FilterPanel.Left>
        <FilterPanel.Right hasLeft lg={20}>
          <Row gutter={[16, 16]}>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("PL.filter_purchase_plan_code")}
                placeHolder={translate("PL.plh_filter_purchase_plan_code")}
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
                label={translate("PL.filter_purchase_plan_name")}
                placeHolder={translate("PL.plh_filter_purchase_plan_name")}
                value={modelFilter?.name}
                onChange={handleChangeInputFilter({
                  fieldName: "name",
                  classFilter: StringFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("PL.filter_purchase_plan_description")}
                placeHolder={translate("PL.plh_purchase_plan_description")}
                value={modelFilter?.note}
                onChange={handleChangeInputFilter({
                  fieldName: "note",
                  classFilter: StringFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.purchasePlanTypesValue || []}
                label={translate("PL.filter_purchase_plan_formality")}
                placeHolder={translate("PL.plh_purchase_plan_formality")}
                render={(item) => item.name}
                getList={getListPurchasingPlan}
                classFilter={DemoFilter}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "purchasePlanTypes",
                  classFilter: IdFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.costGroupValue || []}
                label={translate("PL.filter_purchase_plan_cost_group")}
                placeHolder={translate("PL.plh_purchase_plan_cost_group")}
                render={(item) =>
                  item?.id ? `${item?.code} - ${item?.name}` : null
                }
                getList={purchasingPlanRepository.getListCostGroup}
                classFilter={CommonFilter}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "costGroup",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.goodsIdsValue || []}
                isSmall={false}
                label={translate("PL.filter_service_goods")}
                placeHolder={translate("PL.plh_filter_service_goods")}
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
              <MultipleSelect
                appendToBody
                values={modelFilter?.listApprovedValue || []}
                label={translate("PL.filter_supplier_approved")}
                placeHolder={translate("PL.plh_filter_supplier_approved")}
                getList={purchasingPlanRepository.getDropdownSupplier}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "listApproved",
                  classFilter: IdFilter,
                })}
                render={(item) => item.name}
                classFilter={DemoFilter}
                isSmall={false}
                isEnumerable={false}
              />
            </Col>
            <Col lg={16}>
              <div className="purchase_plan-advance-filter__form-around">
                <InputNumber
                  className="form-item"
                  label={translate("PL.filter_around_value")}
                  placeHolder={translate("PL.plh_form")}
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
                  placeHolder={translate("PL.plh_to")}
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
                className="form-item"
                values={modelFilter?.originPurchaseRequestIdsValue || []}
                label={translate("PL.filter_purchase_request")}
                placeHolder={translate("PL.plh_filter_purchase_request")}
                getList={purchasingPlanRepository.getRequestPurchasing}
                classFilter={DemoFilter}
                render={(item) => item.code}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "originPurchaseRequestIds",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <DateRangePicker
                className="form-picker"
                label={translate("PR.filter_label_time_created")}
                onChange={handleChangeDateFilter({
                  fieldName: "createDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                value={[
                  modelFilter?.createDate?.greaterEqual,
                  modelFilter?.createDate?.lessEqual,
                ]}
                placeholder={[
                  translate("BG.plh_date_from"),
                  translate("BG.plh_date__to"),
                ]}
                bgColor="white"
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                className="form-item"
                values={modelFilter?.createUserValue || []}
                label={translate("PL.filter_creator")}
                placeHolder={translate("PL.plh_filter_creator")}
                render={(item) => item?.email + " - " + item?.name}
                searchProperty="name"
                valueFilter={{
                  name: "",
                  isActive: true,
                }}
                searchType=""
                getList={contractRepository.getListUser}
                classFilter={DemoFilter}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "createUser",
                  classFilter: IdFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                className="form-item"
                values={modelFilter?.organizationIdValue || []}
                label={translate("PL.filter_create_unit")}
                placeHolder={translate("PL.plh_filter_create_unit")}
                getList={purchasingPlanRepository.getListOrganization}
                classFilter={DemoFilter}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "organizationId",
                  classFilter: IdFilter,
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

export default PurchasingPlanMasterAdvanceFilter;
