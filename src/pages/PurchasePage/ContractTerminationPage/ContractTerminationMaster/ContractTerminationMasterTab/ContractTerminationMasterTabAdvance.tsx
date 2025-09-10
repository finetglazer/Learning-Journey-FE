import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import React, { useCallback, useContext } from "react";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { FilterActionEnum } from "core/services/service-types";
import { filterService } from "core/services/page-services/filter-service";
import { listTemporaryImportAssetStatusEnum } from "config/const";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { gt } from "lodash";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { SettlementFilter } from "models/Settlement/SettlementFilter";
import { contractPrincipleRepository } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleRepository";
import {
  ContractTerminationMaster,
  ContractTerminationMasterHookContext,
} from "../ContractTerminationMasterHook";

interface TemporaryImportAssetMasterAdvanceFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const ContractTerminationMasterTabAdvance = (
  props: TemporaryImportAssetMasterAdvanceFilterProps
) => {
  const appUserMaster = useContext<ContractTerminationMaster>(
    ContractTerminationMasterHookContext
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
    ModelFilterClass: SettlementFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
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
      >
        <FilterPanel.Left>
          <CheckboxGroup
            label={translate("CLQ.filter_status")}
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
                label={translate("CLQ.filter_code")}
                placeHolder={translate("CLQ.plh_code")}
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
                label={translate("CLQ.filter_description")}
                placeHolder={translate("CLQ.plh_description")}
                value={modelFilter?.description}
                onChange={handleChangeInputFilter({
                  fieldName: "description",
                  classFilter: StringFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("CLQ.filter_contract_code")}
                placeHolder={translate("CLQ.plh_contract_code")}
                value={modelFilter?.contractCode}
                onChange={handleChangeInputFilter({
                  fieldName: "contractCode",
                  classFilter: StringFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("CLQ.filter_contract_no")}
                placeHolder={translate("CLQ.plh_contract_no")}
                value={modelFilter?.contractNumber}
                onChange={handleChangeInputFilter({
                  fieldName: "contractNumber",
                  classFilter: StringFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <InputText
                className="form-item"
                label={translate("CLQ.filter_contract_name")}
                placeHolder={translate("CLQ.plh_contract_name")}
                value={modelFilter?.contractName}
                onChange={handleChangeInputFilter({
                  fieldName: "contractName",
                  classFilter: StringFilter,
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.supplierIdsValue || []}
                label={translate("CLQ.filter_supplier")}
                placeHolder={translate("CLQ.plh_choose_supplier")}
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
              <DateRangePicker
                className="form-picker"
                label={translate("CLQ.filter_date_create")}
                onChange={handleChangeDateFilter({
                  fieldName: "createDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                value={[
                  modelFilter?.createDate?.greaterEqual,
                  modelFilter?.createDate?.lessEqual,
                ]}
                placeholder={[
                  translate("CLQ.plh_form_day"),
                  translate("CLQ.plh_to_day"),
                ]}
                bgColor="white"
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                className="form-item mb-3"
                values={modelFilter?.organizationIdValue || []}
                label={translate("CLQ.filter_unit_create")}
                placeHolder={translate("CLQ.plh_choose_unit_create")}
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

export default ContractTerminationMasterTabAdvance;
