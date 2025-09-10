import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { listMenuShoppingType } from "config/const";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { ContractFilter } from "models/Contract/ContractFilter";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { contractPrincipleRepository } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleRepository";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import React, { useContext, useEffect } from "react";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import {
  DateRangePicker,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { map, of } from "rxjs";
import { contractRepository } from "../../ContractRepository";
import { ContractMaster, ContractMasterContext } from "../ContractMasterHook";
import "./ContractPlanTabAdvanceFilter.scss";
interface ContractFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const ContractPlanTabAdvanceFilter = (props: ContractFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<ContractMaster>(ContractMasterContext);

  const { setVisible } = props;

  const [translate] = useTranslation();

  const handleCloseFilter = () => {
    setVisible(false);
  };

  const {
    handleApplyFilter,
    handleClearFilter,
    handleResetFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ContractFilter,
    filter,
    updateFilter,
    handleCloseFilter,
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeDateFilter,
    handleChangeMultipleSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <div
      className="contract_plan"
      style={{ maxWidth: "1000px !important", width: "1000px !important" }}
    >
      <FilterPanel
        handleApplyFilter={handleApplyFilter}
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
        modelFilter={modelFilter}
        handleClickOutside={handleClickOutside}
        width={1000}
        className="wait_contract_filter"
      >
        <Row gutter={16} className="flex p-x--sm">
          <Col lg={8}>
            <InputText
              className="m-b--sm"
              value={modelFilter?.code}
              label={translate("CT.contract_plan.code_full")}
              placeHolder={translate("CT.contract_plan.placeholder.code_full")}
              onChange={handleChangeInputFilter({
                fieldName: "code",
              })}
              isSmall={false}
            />
          </Col>
          <Col lg={8}>
            <InputText
              className="m-b--sm"
              value={modelFilter?.name}
              label={translate("CT.contract_plan.name")}
              placeHolder={translate("CT.contract_plan.placeholder.name")}
              onChange={handleChangeInputFilter({
                fieldName: "name",
              })}
              isSmall={false}
            />
          </Col>
          <Col lg={8}>
            <InputText
              className="m-b--sm"
              value={modelFilter?.note}
              label={translate("CT.contract_plan.description")}
              placeHolder={translate(
                "CT.contract_plan.placeholder.description"
              )}
              onChange={handleChangeInputFilter({
                fieldName: "note",
              })}
              isSmall={false}
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.purchasePlanTypesValue || []}
              label={translate("CT.contract_plan.form")}
              placeHolder={translate("CT.contract_plan.placeholder.form")}
              getList={() => of(listMenuShoppingType)}
              classFilter={DemoFilter}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "purchasePlanTypes",
              })}
              isSmall={false}
              isUsingSearch={false}
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.costGroupIdsValue || []}
              label={translate("CT.expense_item")}
              placeHolder={translate("CT.placeholder_expense_item")}
              getList={contractRepository.getListCostGroup}
              classFilter={DemoFilter}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "costGroupIds",
              })}
              isSmall={false}
              render={(item) =>
                item?.id ? `${item?.code} - ${item?.name}` : null
              }
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.goodIdsValue || []}
              label={translate("PP.tab_goods_services")}
              placeHolder={translate("PP.filter_choose_goods_services")}
              isEnumerable={false}
              getList={(filterGoodService: ModelFilter) => {
                return proposalRepository
                  .getGoodServicesList({
                    ...filterGoodService,
                    search: filterGoodService?.name?.contain,
                  })
                  .pipe(
                    map((response) => {
                      if (Array.isArray(response?.data?.items)) {
                        return response?.data?.items;
                      }

                      return [];
                    })
                  );
              }}
              classFilter={DemoFilter}
              render={(item) => {
                return `${item?.code} - ${item?.name}`;
              }}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "goodIds",
              })}
              isSmall={false}
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.supplierIdsValue || []}
              label={translate("CT.contract_plan.approved_supplier")}
              placeHolder={translate("PM.plh_supplier")}
              getList={paymentRepository.listSupplier}
              classFilter={DemoFilter}
              render={(item) => `${item?.taxCode} - ${item?.name}`}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "supplierIds",
              })}
              isSmall={false}
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.originPurchaseRequestIdsValue || []}
              label={translate("CT.contract_plan.request")}
              placeHolder={translate("CT.contract_plan.placeholder.request")}
              getList={(filterPurchase: ModelFilter) => {
                return contractRepository
                  .getListPurchaseRequest({
                    ...filterPurchase,
                    search: filterPurchase?.name?.contain,
                  })
                  .pipe(
                    map((response) => {
                      if (Array.isArray(response?.items)) {
                        return response?.items;
                      }

                      return [];
                    })
                  );
              }}
              classFilter={DemoFilter}
              render={(item) => {
                return `${item?.code}`;
              }}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "originPurchaseRequestIds",
              })}
              isSmall={false}
            />
          </Col>
          <Col lg={8} className="m-b--sm">
            <DateRangePicker
              label={translate("PR.filter_label_time_created")}
              onChange={handleChangeDateFilter({
                fieldName: "createdDate",
                fieldType: ["greaterEqual", "lessEqual"],
              })}
              value={[
                modelFilter?.createdDate?.greaterEqual,
                modelFilter?.createdDate?.lessEqual,
              ]}
              placeholder={[
                translate("BG.plh_date_from"),
                translate("BG.plh_date__to"),
              ]}
              bgColor="white"
              isSmall={false}
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.createUserValue || []}
              label={translate("CT.title_filter.created_user")}
              placeHolder={translate("CT.placeholder.created_user")}
              render={(item) => item?.email + " - " + item?.name}
              getList={contractPrincipleRepository.getListUser}
              classFilter={DemoFilter}
              searchProperty="name"
              isEnumerable={false}
              isSmall={false}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "createUser",
              })}
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.businessUnitIdValue || []}
              label={translate("CT.title_filter.created_unit")}
              placeHolder={translate("CT.placeholder.created_unit")}
              render={(item) => `${item?.code} - ${item?.name}`}
              getList={contractPrincipleRepository.getListOrganization}
              classFilter={DemoFilter}
              searchProperty="name"
              isEnumerable={false}
              isSmall={false}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "businessUnitId",
              })}
            />
          </Col>
        </Row>
      </FilterPanel>
    </div>
  );
};

export default ContractPlanTabAdvanceFilter;
