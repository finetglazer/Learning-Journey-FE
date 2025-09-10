import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { datePickerPopupClassName } from "core/config/consts";
import { trimText } from "core/helpers/text";
import { contractPrincipleDropdownRepository } from "core/repositories/ContractPrincipleDropdownRepository";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { values } from "lodash";
import CommonFilter from "models/CommonFilter";
import { ContractPrincioleAppendixFilter } from "models/ContractPrincipleAppendix";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { listContractAnnexStatus } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { annexType } from "pages/PurchasePage/ContractPrinciplePage/constants";
import {
  ContractPrincipleAppendixMaster,
  ContractPrincipleAppendixMasterContext,
} from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/context";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { ModelFilter } from "react-3layer-common";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
  MultipleSelect,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./ContractPrincipleAppendixAdvancedFilter.module.scss";

const SIZE_COL = 8;
const SIZE_COL_16 = 16;
const SIZE_FILTER_LEFT = 3;
const SIZE_FILTER_RIGHT = 21;

interface ContractPrincipleAppenndixAdvancedFilterProps {
  setVisible?: Dispatch<SetStateAction<boolean>>;
}

export const ContractPrincipleAppenndixAdvancedFilter = ({
  setVisible,
}: ContractPrincipleAppenndixAdvancedFilterProps) => {
  const [translate] = useTranslation();

  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<ContractPrincipleAppendixMaster>(
    ContractPrincipleAppendixMasterContext
  );

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ContractPrincioleAppendixFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeCheckboxFilter,
    handleChangeInputFilter,
    handleChangeMultipleSelectFilter,
    handleChangeSelectFilter,
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
        className={styles["contract-priciple-appendix-filter-panel"]}
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
              <Select
                classFilter={ModelFilter}
                getList={annexType}
                label={translate("CPA.txt_adjust_type")}
                placeHolder={translate("CPA.placeholder_adjust_type")}
                value={modelFilter?.adjustmentTypeValue}
                onChange={handleChangeSelectFilter({
                  fieldName: "adjustmentType",
                  fieldType: "in",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CPA.filter.code_contract_principle")}
                placeHolder={translate(
                  "CPA.filter.placeholder_code_contract_principle"
                )}
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
                label={translate("CPA.filter.number_contract_principle")}
                placeHolder={translate(
                  "CPA.filter.placeholder_number_contract_principle"
                )}
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
            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CPA.filter.name_contract_principle")}
                placeHolder={translate(
                  "CPA.filter.placeholder_name_contract_principle"
                )}
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
                label={translate("CPA.filter.type_contract_principle")}
                placeHolder={translate(
                  "CPA.filter.placeholder_type_contract_principle"
                )}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={contractPrincipleDropdownRepository.getAll}
                classFilter={ModelFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "contractType",
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
            <Col lg={SIZE_COL} className="m-b--md">
              <DateRangePicker
                label={translate("CPA.filter.date_appendix")}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
                value={[
                  modelFilter?.appendixDate?.greaterEqual,
                  modelFilter?.appendixDate?.lessEqual,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "appendixDate",
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
