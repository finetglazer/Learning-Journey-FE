import { map } from "rxjs";
import { values } from "lodash";
import { Row, Col } from "antd";
import { trimText } from "core/helpers/text";
import { ModelFilter } from "react-3layer-common";
import { filterService } from "core/services/page-services/filter-service";
import { NUMBER_MAX_13 } from "config/const";
import { useTranslation } from "react-i18next";
import { FilterActionEnum } from "core/services/service-types";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { ContractAnnexFilter } from "models/ContractAnnex";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { contractTypeRepository } from "core/repositories/ContractRepository";
import { listContractAnnexStatus } from "../../constants";
import { ContractAnnexMaster, ContractAnnexMasterContext } from "../context";
import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import {
  NUMBER_TYPE_INPUT,
  datePickerPopupClassName,
} from "core/config/consts";
import {
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import {
  InputText,
  InputNumber,
  CheckboxGroup,
  MultipleSelect,
  DateRangePicker,
} from "react-components-design-system";
import styles from "./ContractAnnexAdvancedFilter.module.scss";
import FilterPanel from "components/FilterPanel/FilterPanel";
import CommonFilter from "models/CommonFilter";

const SIZE_COL = 8;
const SIZE_COL_16 = 16;
const SIZE_FILTER_LEFT = 3;
const SIZE_FILTER_RIGHT = 21;

interface ContractAnnexAdvancedFilterProps {
  setVisible?: Dispatch<SetStateAction<boolean>>;
}

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

export const ContractAnnexAdvancedFilter = ({
  setVisible,
}: ContractAnnexAdvancedFilterProps) => {
  const [translate] = useTranslation();

  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<ContractAnnexMaster>(ContractAnnexMasterContext);

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ContractAnnexFilter,
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

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <div className="ContractAnnexFilter">
      <FilterPanel
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        modelFilter={modelFilter}
        handleApplyFilter={handleApplyFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        handleClickOutside={handleClickOutside}
        className={styles["contract-annex-filter-panel"]}
        exceptNodeIds={values(datePickerPopupClassName)}
      >
        <FilterPanel.Left lg={SIZE_FILTER_LEFT}>
          <div className="d-flex flex-column gap-y--md">
            <CheckboxGroup
              label={translate("CM.txt_status")}
              dataOptions={listContractAnnexStatus()}
              values={modelFilter?.statusesId || []}
              onChange={handleChangeCheckboxFilter({
                fieldName: "statuses",
              })}
            />
          </div>
        </FilterPanel.Left>

        <FilterPanel.Right lg={SIZE_FILTER_RIGHT}>
          <Row gutter={SIZE_COL_16}>
            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CA.list.title.annex_code")}
                placeHolder={translate("CA.list.placeholder.annex_code")}
                value={modelFilter?.code}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "code",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CA.txt_annex_no")}
                placeHolder={translate("CA.list.placeholder.annex_number")}
                value={modelFilter?.appendixNo}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "appendixNo",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CA.txt_annex_name")}
                placeHolder={translate("CA.list.placeholder.annex_name")}
                value={modelFilter?.name}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "name",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CA.list.filter.contract_code")}
                placeHolder={translate("CA.list.placeholder.contract_code")}
                value={modelFilter?.contractCode}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "contractCode",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CA.list.title.contract_number")}
                placeHolder={translate("CA.list.placeholder.contract_number")}
                value={modelFilter?.contractNo}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "contractNo",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CA.list.title.contract_name")}
                placeHolder={translate("CA.list.placeholder.contract_name")}
                value={modelFilter?.contractName}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "contractName",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.contractTypeValue || []}
                label={translate("CA.list.filter.contract_type")}
                placeHolder={translate("CA.list.placeholder.contract_type")}
                render={(item) => `${item?.name}`}
                getList={contractTypeRepository.getListContractType}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "contractType",
                })}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.costItemValue || []}
                label={translate("CA.list.title.expense_item")}
                placeHolder={translate("CA.list.placeholder.expense_item")}
                render={(item) =>
                  item?.id ? `${item?.code} - ${item?.name}` : null
                }
                getList={contractRepository.getListCostGroup}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "costItem",
                })}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.suppliersValue || []}
                label={translate("CA.list.title.supplier")}
                placeHolder={translate("CA.list.placeholder.supplier")}
                render={(item) => `${item?.taxCode} - ${item?.name}`}
                getList={paymentRepository.listSupplier}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "suppliers",
                })}
              />
            </Col>

            <Col lg={SIZE_COL_16} className="m-b--md">
              <div className="d-flex align-items-end h-100 flex-grow">
                <InputNumber
                  value={modelFilter?.contractFrom?.equal}
                  label={translate("CA.list.filter.contract_value_range")}
                  placeHolder={translate("CA.list.placeholder.from")}
                  isSmall={false}
                  onChange={handleChangeInputFilter({
                    fieldName: "contractFrom",
                    fieldType: "equal",
                    classFilter: NumberFilter,
                  })}
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  numberType={NUMBER_TYPE_INPUT}
                />
                <div className={styles["contract-annex-filter__dash"]}>-</div>
                <InputNumber
                  value={modelFilter?.contractTo?.equal}
                  label={undefined}
                  placeHolder={translate("CA.list.placeholder.to")}
                  isSmall={false}
                  onChange={handleChangeInputFilter({
                    fieldName: "contractTo",
                    fieldType: "equal",
                    classFilter: NumberFilter,
                  })}
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  numberType={NUMBER_TYPE_INPUT}
                />
              </div>
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                isSmall={false}
                values={modelFilter?.goodsValue || []}
                label={translate("CA.list.filter.goods_service_change")}
                placeHolder={translate("CA.list.placeholder.goods_service")}
                getList={(filter: ModelFilter) => {
                  return proposalRepository
                    .getGoodServicesList({
                      ...filter,
                      search: filter?.name?.contain,
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
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "goods",
                })}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.organizationsValue || []}
                label={translate("CA.list.filter.management_unit")}
                placeHolder={translate("CA.list.placeholder.management_unit")}
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
                  fieldName: "organizations",
                })}
                appendToBody
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.managersValue || []}
                label={translate("CA.list.title.manager")}
                placeHolder={translate("CA.list.placeholder.manager")}
                render={(item) => `${item?.email} - ${item?.name}`}
                getList={contractRepository.getListUser}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "managers",
                })}
                appendToBody
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <DateRangePicker
                label={translate("CA.list.filter.contract_effective_date")}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
                value={[
                  modelFilter?.effectiveDate?.greaterEqual,
                  modelFilter?.effectiveDate?.lessEqual,
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
                label={translate("CA.list.filter.contract_end_date")}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
                value={[
                  modelFilter?.endDate?.greaterEqual,
                  modelFilter?.endDate?.lessEqual,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "endDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                popupClassName="date-range-picker-2"
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <DateRangePicker
                label={translate("CA.table_grounds_created_date")}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
                value={[
                  modelFilter?.createdDate?.greaterEqual,
                  modelFilter?.createdDate?.lessEqual,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "createdDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                popupClassName={datePickerPopupClassName.first}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.createdUsersValue || []}
                label={translate("CA.txt_annex_create")}
                placeHolder={translate("CA.list.placeholder.annex_create")}
                render={(item) => `${item?.email} - ${item?.name}`}
                getList={contractRepository.getListUser}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "createdUsers",
                })}
                appendToBody
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.createdOrganizationsValue || []}
                label={translate("CA.txt_annex_unit_create")}
                placeHolder={translate("CA.list.placeholder.annex_unit_create")}
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
                  fieldName: "createdOrganizations",
                })}
                appendToBody
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};
