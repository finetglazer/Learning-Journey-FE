import { Col, Row } from "antd";
import React, { useContext } from "react";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import FilterPanel from "components/FilterPanel/FilterPanel";
import { trimText } from "core/helpers/text";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import {
  ContractPrincipleMaster,
  ContractPrincipleMasterContext,
} from "../ContractPrincipleMasterHook";

import { ContractPrincipleFilter } from "models/ContractPrinciple";
import { contractPrincipleRepository } from "../../ContractPrincipleRepository";
import { listContractPrincipleStatus } from "../constants";
import styles from "./ContractPrincipleMasterTab.module.scss";

interface ContractPrincipleMasterAdvancedFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContractPrincipleMasterAdvancedFilter = (
  props: ContractPrincipleMasterAdvancedFilterProps
) => {
  const { setVisible } = props;
  const [translate] = useTranslation();

  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<ContractPrincipleMaster>(ContractPrincipleMasterContext);

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ContractPrincipleFilter,
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
              dataOptions={listContractPrincipleStatus}
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
                label={translate("CT.title_filter.code")}
                placeHolder={translate("CT.placeholder.code")}
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
                label={translate("CT.title_filter.no")}
                placeHolder={translate("CT.placeholder.no")}
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
                label={translate("CT.title_filter.name")}
                placeHolder={translate("CT.placeholder.name")}
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
                values={modelFilter?.suppliersValue || []}
                label={translate("CT.title_filter.supplier")}
                placeHolder={translate("CT.placeholder.supplier")}
                render={(item) => `${item?.taxCode} - ${item?.name}`}
                getList={contractPrincipleRepository.getListSupplier}
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
                label={translate("CT.title_filter.goods_services")}
                placeHolder={translate("CT.placeholder.goods_services")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={contractPrincipleRepository.getListGoodsServices}
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
              <DateRangePicker
                label={translate("CT.title_filter.valid_date")}
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
              <MultipleSelect
                values={modelFilter?.managementUnitsValue || []}
                label={translate("CT.title_filter.management_units")}
                placeHolder={translate("CT.placeholder.management_units")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={contractPrincipleRepository.getListOrganization}
                classFilter={CommonFilter}
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
                getList={contractPrincipleRepository.getListUser}
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
                label={translate("CT.txt_end_date")}
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

            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.applicableOrganizationIdsValue || []}
                label={translate("CT.title_filter.applicable_unit")}
                placeHolder={translate("CT.placeholder.applicable_unit")}
                render={(item) => `${item?.name}`}
                getList={contractPrincipleRepository.getListOrganization}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "applicableOrganizationIds",
                })}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.applicableBranchIdsValue || []}
                label={translate("CT.title_filter.applicable_branch")}
                placeHolder={translate("CT.placeholder.applicable_branch")}
                render={(item) => `${item?.name}`}
                getList={contractPrincipleRepository.listBusinessBranch}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "applicableBranchIds",
                })}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.applicableUnitIdsValue || []}
                label={translate("CT.title_filter.applicable_block")}
                placeHolder={translate("CT.placeholder.applicable_block")}
                render={(item) => `${item?.name}`}
                getList={contractPrincipleRepository.listBusinessUnit}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "applicableUnitIds",
                })}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.organizationCreateIdsValue || []}
                label={translate("CT.title_filter.created_unit")}
                placeHolder={translate("CT.placeholder.created_unit")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={contractPrincipleRepository.getListOrganization}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "organizationCreateIds",
                })}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.createdUsersValue || []}
                label={translate("CT.title_filter.created_user")}
                placeHolder={translate("CT.placeholder.created_user")}
                render={(item) => `${item?.email} - ${item?.name}`}
                getList={contractPrincipleRepository.getListUser}
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
                label={translate("CT.title_filter.created_date")}
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

            <Col lg={8} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("CT.title_filter.code_purchase_plan")}
                placeHolder={translate("CT.placeholder.code_purchase_plan")}
                value={modelFilter?.purchasePlanCode}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "purchasePlanCode",
                  })(trimmedText);
                }}
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};
