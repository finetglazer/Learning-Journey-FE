import React, { useContext } from "react";
import { Col, Row } from "antd";
import { NumberFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  DateRangePicker,
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { ContractFilter, ContractStatus } from "models/Contract/ContractFilter";
import { ContractMaster, ContractMasterContext } from "../ContractMasterHook";
import {
  listContractAdvancedFilters,
  listContractStatus,
  listContractType,
} from "pages/PurchasePage/constants";
import { trimText } from "core/helpers/text";
import { contractRepository } from "../../ContractRepository";
import CommonFilter from "models/CommonFilter";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";

import styles from "./ContractMasterTab.module.scss";
import dayjs from "dayjs";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { map } from "rxjs";

interface ContractMasterAdvancedFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContractMasterAdvancedFilter = (
  props: ContractMasterAdvancedFilterProps
) => {
  const { setVisible } = props;
  const [translate] = useTranslation();

  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<ContractMaster>(ContractMasterContext);

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ContractFilter,
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
  } = filterService.useFilter(modelFilter, dispatchFilter);

  React.useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <div className="ContractFilter">
      <FilterPanel
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        modelFilter={modelFilter}
        handleApplyFilter={handleApplyFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        handleClickOutside={handleClickOutside}
        className={styles["contract-filter-panel"]}
        exceptNodeIds={[
          "date-range-picker-1",
          "date-range-picker-2",
          "date-range-picker-3",
        ]}
      >
        <FilterPanel.Left lg={4}>
          <div className="d-flex flex-column gap-y--md">
            <CheckboxGroup
              label={translate("CM.txt_status")}
              dataOptions={listContractStatus}
              values={modelFilter?.statusesId || []}
              onChange={handleChangeCheckboxFilter({
                fieldName: "statuses",
              })}
            />
            <CheckboxGroup
              label={translate("CM.txt_type")}
              dataOptions={listContractType}
              values={modelFilter?.typesId || []}
              onChange={handleChangeCheckboxFilter({
                fieldName: "types",
              })}
            />
            <CheckboxGroup
              label={translate("CM.txt_advanced_filters")}
              dataOptions={listContractAdvancedFilters}
              values={modelFilter?.advancedFiltersId || []}
              onChange={handleChangeCheckboxFilter({
                fieldName: "advancedFilters",
              })}
            />
          </div>
        </FilterPanel.Left>
        <FilterPanel.Right lg={20}>
          <Row gutter={16}>
            <Col lg={8} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CT.txt_code_contract")}
                placeHolder={translate("CT.placeholder_code_contract")}
                value={modelFilter?.contractCode}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "contractCode",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CT.txt_contract_no")}
                placeHolder={translate("CT.placeholder_search_contract_no")}
                value={modelFilter?.contractNo}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "contractNo",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CT.txt_contract_name")}
                placeHolder={translate("CT.placeholder_contract_name")}
                value={modelFilter?.contractName}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "contractName",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.contractTypeValue || []}
                label={translate("CT.label_contract_type")}
                placeHolder={translate("CT.placeholder_contract_type")}
                render={(item) => `${item?.name}`}
                getList={contractRepository.getListContractType}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "contractType",
                })}
              />
            </Col>
            <Col lg={16} className="m-b--md">
              <div className="d-flex align-items-end h-100 flex-grow">
                <InputNumber
                  value={modelFilter?.totalAmountFrom?.equal}
                  label={translate("CT.label_total_amount")}
                  placeHolder={translate("CM.placeholder_from")}
                  isSmall={false}
                  onChange={handleChangeInputFilter({
                    fieldName: "totalAmountFrom",
                    fieldType: "equal",
                    classFilter: NumberFilter,
                  })}
                />
                <div className={styles["contract-filter__dash"]}>-</div>
                <InputNumber
                  value={modelFilter?.totalAmountTo?.equal}
                  label={undefined}
                  placeHolder={translate("CM.placeholder_to")}
                  isSmall={false}
                  onChange={handleChangeInputFilter({
                    fieldName: "totalAmountTo",
                    fieldType: "equal",
                    classFilter: NumberFilter,
                  })}
                />
              </div>
            </Col>

            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.costGroupValue || []}
                label={translate("CT.expense_item")}
                placeHolder={translate("CT.placeholder_expense_item")}
                render={(item) =>
                  item?.id ? `${item?.code} - ${item?.name}` : null
                }
                getList={contractRepository.getListCostGroup}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "costGroup",
                })}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.suppliersValue || []}
                label={translate("CT.txt_supplier")}
                placeHolder={translate("CT.placeholder_supplier")}
                render={(item) => `${item?.taxCode} - ${item?.name}`}
                getList={contractRepository.getListSupplier}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "suppliers",
                })}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.goodsServicesValue || []}
                label={translate("CT.label_goods_services")}
                placeHolder={translate("CT.placeholder_goods_services")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={contractRepository.getListGoodsServices}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "goodsServices",
                })}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.purchaseProposalCodeValue || []}
                label={translate("CT.title_filter.proposal")}
                placeHolder={translate("CT.placeholder.proposal")}
                render={(item) => `${item?.code}`}
                getList={(filter) =>
                  proposalRepository
                    .listAll({
                      search: filter?.name?.contain,
                      tab: "0",
                      statusesId: [ContractStatus.APPROVED],
                      pageSize: 100,
                    })
                    .pipe(map((response) => response?.data?.items))
                }
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "purchaseProposalCode",
                })}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CT.label_purchase_plan_code")}
                placeHolder={translate("CT.placeholder_purchase_plan_code")}
                value={modelFilter?.purchasePlanCode}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "purchasePlanCode",
                  })(trimmedText);
                }}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.managementUnitsValue || []}
                label={translate("CT.label_management_units")}
                placeHolder={translate("CT.placeholder_management_units")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={contractRepository.getListOrganization}
                classFilter={CommonFilter}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "managementUnits",
                })}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.managersValue || []}
                label={translate("CT.txt_manager")}
                placeHolder={translate("CT.placeholder_manager")}
                render={(item) => `${item?.email} - ${item?.name}`}
                getList={contractRepository.getListUser}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "managers",
                })}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <DateRangePicker
                label={translate("CT.txt_valid_date")}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
                value={[
                  modelFilter?.effectiveDate?.greaterEqual
                    ? dayjs(modelFilter?.effectiveDate?.greaterEqual)
                    : null,
                  modelFilter?.effectiveDate?.lessEqual
                    ? dayjs(modelFilter?.effectiveDate?.lessEqual)
                    : null,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "effectiveDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                popupClassName="date-range-picker-1"
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <DateRangePicker
                label={translate("CT.txt_end_date")}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
                value={[
                  modelFilter?.endDate?.greaterEqual
                    ? dayjs(modelFilter?.endDate?.greaterEqual)
                    : null,
                  modelFilter?.endDate?.lessEqual
                    ? dayjs(modelFilter?.endDate?.lessEqual)
                    : null,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "endDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                popupClassName="date-range-picker-2"
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <DateRangePicker
                label={translate("CT.label_created_time")}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
                value={[
                  modelFilter?.createdDate?.greaterEqual
                    ? dayjs(modelFilter?.createdDate?.greaterEqual)
                    : null,
                  modelFilter?.createdDate?.lessEqual
                    ? dayjs(modelFilter?.createdDate?.lessEqual)
                    : null,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "createdDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                popupClassName="date-range-picker-3"
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.createdUsersValue || []}
                label={translate("CT.label_create_user")}
                placeHolder={translate("CT.placeholder_create_user")}
                render={(item) => `${item?.email} - ${item?.name}`}
                getList={contractRepository.getListUser}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "createdUsers",
                })}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.organizationCreateValue || []}
                label={translate("CT.label_create_unit")}
                placeHolder={translate("CT.placeholder_create_unit")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={contractRepository.getListOrganization}
                classFilter={CommonFilter}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "organizationCreate",
                })}
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};
