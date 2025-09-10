import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import {
  listAdjustPurchasingPlanStatusEnum,
  MAX_DIGITAL_NUMBER_4_DIGITS,
  NUMBER_MAX_13,
} from "config/const";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { gt } from "lodash";
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
import { map } from "rxjs";
import { purchasingPlanRepository } from "../../PurchasingPlanRepository";
import {
  PurchasingPlanMaster,
  PurchasingPlanMasterContext,
} from "../PurchasingPlanMasterHook";

interface BudgetMasterAdvanceFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

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
              dataOptions={listAdjustPurchasingPlanStatusEnum}
              values={modelFilter?.statusesId}
              onChange={handleChangeCheckboxFilter({
                fieldName: "statuses",
                classFilter: IdFilter,
              })}
            />
          </div>
        </FilterPanel.Left>
        <FilterPanel.Right>
          <div style={{ paddingBottom: "16px" }}>
            <Row gutter={[16, 16]}>
              <Col lg={8}>
                <InputText
                  className="form-item"
                  label={translate("PL.filter.code_adjust")}
                  placeHolder={translate("PL.filter.plh_code_adjust")}
                  value={modelFilter?.code}
                  onChange={handleChangeInputFilter({
                    fieldName: "code",
                  })}
                  isSmall={false}
                />
              </Col>
              <Col lg={8}>
                <InputText
                  className="form-item"
                  label={translate("PL.filter.description_adjust")}
                  placeHolder={translate("PL.filter.plh_description_adjust")}
                  value={modelFilter?.adjustmentDescription}
                  onChange={handleChangeInputFilter({
                    fieldName: "adjustmentDescription",
                  })}
                  isSmall={false}
                />
              </Col>
              <Col lg={8}>
                <InputText
                  className="form-item"
                  label={translate("PL.filter.code_purchase_plan")}
                  placeHolder={translate("PL.filter.plh_code_purchase_plan")}
                  value={modelFilter?.originalPurchasePlanCode}
                  onChange={handleChangeInputFilter({
                    fieldName: "originalPurchasePlanCode",
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
                  })}
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
                  values={modelFilter?.listApprovedValue || []}
                  label={translate("PL.filter_supplier_approved")}
                  placeHolder={translate("PL.plh_filter_supplier_approved")}
                  getList={purchasingPlanRepository.getDropdownSupplier}
                  onChange={handleChangeMultipleSelectFilter({
                    fieldName: "listApproved",
                  })}
                  render={(item) => item.name}
                  classFilter={DemoFilter}
                  isSmall={false}
                  isEnumerable={false}
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
                  label={translate("PL.filter_create_unit")}
                  placeHolder={translate("PL.plh_filter_create_unit")}
                  getList={purchasingPlanRepository.getListOrganization}
                  classFilter={DemoFilter}
                  render={(item) => `${item?.code} - ${item?.name}`}
                  onChange={handleChangeMultipleSelectFilter({
                    fieldName: "organizationId",
                  })}
                  isSmall={false}
                />
              </Col>
            </Row>
          </div>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};

export default PurchasingPlanMasterAdvanceFilter;
