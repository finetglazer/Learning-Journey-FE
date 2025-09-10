import React, { useContext, useEffect } from "react";
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
import { ContractFilter } from "models/Contract/ContractFilter";
import { trimText } from "core/helpers/text";
import { contractRepository } from "../../../ContractRepository";
import CommonFilter from "models/CommonFilter";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";

import styles from "../../../ContractMaster/ContractMasterTab/ContractMasterTab.module.scss";
import { listContractAdjustmentStatus } from "../../constants";
import {
  ContractAdjustmentMaster,
  ContractAdjustmentMasterContext,
} from "../../ContractAdjustmentMaster/context";

interface ContractMasterAdvancedFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

const listContractStatus = listContractAdjustmentStatus();

export const ContractMasterAdvancedFilter = (
  props: ContractMasterAdvancedFilterProps
) => {
  const { setVisible } = props;
  const [translate] = useTranslation();

  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<ContractAdjustmentMaster>(ContractAdjustmentMasterContext);

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

  useEffect(() => {
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
          </div>
        </FilterPanel.Left>
        <FilterPanel.Right lg={20}>
          <Row gutter={16}>
            <Col lg={8} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate(
                  "contractAdjustment.list.title.adjustment_code"
                )}
                placeHolder={translate(
                  "contractAdjustment.list.placeholder.adjustment_code"
                )}
                value={modelFilter?.codeAdjust}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "codeAdjust",
                  })(trimmedText);
                }}
              />
            </Col>
            <Col lg={16} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("contractAdjustment.txt_adjustment_note")}
                placeHolder={translate(
                  "contractAdjustment.list.placeholder.adjustment_note"
                )}
                value={modelFilter?.desciption}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "desciption",
                  })(trimmedText);
                }}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CT.txt_code_contract")}
                placeHolder={translate("CT.placeholder_code_contract")}
                value={modelFilter?.code}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "code",
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
                value={modelFilter?.name}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "name",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.contractTypesValue || []}
                label={translate("CT.label_contract_type")}
                placeHolder={translate("CT.placeholder_contract_type")}
                render={(item) => `${item?.name}`}
                getList={contractRepository.getListContractType}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "contractTypes",
                })}
              />
            </Col>
            <Col lg={16} className="m-b--md">
              <div className="d-flex align-items-end h-100 flex-grow">
                <InputNumber
                  value={modelFilter?.totalAmountFrom?.equal}
                  label={translate(
                    "contractAdjustment.list.filter.contract_value_range"
                  )}
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
                values={modelFilter?.suppliersValue || []}
                label={translate("CT.txt_supplier")}
                placeHolder={translate("CT.placeholder_supplier")}
                render={(item) =>
                  [item?.code, item?.name].filter(Boolean).join(" - ")
                }
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
                values={modelFilter?.costGroupsValue || []}
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
                  fieldName: "costGroups",
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
                valueFilter={{
                  name: "",
                }}
                searchType=""
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "organizationCreate",
                })}
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
              <DateRangePicker
                label={translate("contractAdjustment.txt_date_create")}
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
                popupClassName="date-range-picker-3"
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};
