import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { trimText } from "core/helpers/text";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { NumberFilter } from "react-3layer-advance-filters";
import {
  DateRangePicker,
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

const SIZE_COL = 8;
const SIZE_COL_16 = 16;
const SIZE_ROW = 16;
const SIZE_FILTER = 24;

import { NUMBER_MAX_13 } from "config/const";
import {
  datePickerPopupClassName,
  NUMBER_TYPE_INPUT,
} from "core/config/consts";
import { values } from "lodash";
import { ReceivingGoodModel } from "models/ReceivingGood";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import {
  ReceivingGoodsContext,
  ReceivingGoodsContextType,
} from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";
import { receivedGoodsRepository } from "../../ReceivedGoodRepository";
import styles from "./WaitingReceivedGoodsAdvancedFilter.module.scss";

interface WaitingReceivingGoodsAdvancedFilterProps {
  setVisible?: Dispatch<SetStateAction<boolean>>;
}

export const WaitingReceivingGoodsAdvancedFilter = ({
  setVisible,
}: WaitingReceivingGoodsAdvancedFilterProps) => {
  const [translate] = useTranslation();

  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<ReceivingGoodsContextType>(ReceivingGoodsContext);

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ReceivingGoodModel,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
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
    <div className="WaitingReceivedFilter">
      <FilterPanel
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        modelFilter={modelFilter}
        handleApplyFilter={handleApplyFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        handleClickOutside={handleClickOutside}
        className={styles["waiting-received-filter-panel"]}
        exceptNodeIds={values(datePickerPopupClassName)}
      >
        <FilterPanel.Right lg={SIZE_FILTER}>
          <Row gutter={SIZE_ROW}>
            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("RG.txt_code_contract")}
                placeHolder={translate("RG.placeholder_code_contract_filter")}
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
                label={translate("RG.txt_number_contract")}
                placeHolder={translate("RG.placeholder_number_contract")}
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
                label={translate("RG.tab_label_name_contract")}
                placeHolder={translate("RG.placeholder_name_contract")}
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
              <MultipleSelect
                values={modelFilter?.suppliersValue || []}
                label={translate("RG.txt_supplier")}
                placeHolder={translate("RG.placeholder_supplier")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={receivedGoodsRepository.getDropdownSupplier}
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
                  label={translate("RG.txt_contract_value")}
                  placeHolder={translate("CM.placeholder_from")}
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
                <div className={styles["waiting-received-filter__dash"]}>-</div>
                <InputNumber
                  value={modelFilter?.contractTo?.equal}
                  label={undefined}
                  placeHolder={translate("CM.placeholder_to")}
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
              <DateRangePicker
                label={translate("CT.txt_valid_date")}
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
                popupClassName={datePickerPopupClassName.first}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.managerValue || []}
                label={translate("RG.txt_manager_contract")}
                placeHolder={translate("RG.placehoder_manager_contract")}
                render={(item) => `${item?.email} - ${item?.name}`}
                getList={receivedGoodsRepository.getListUser}
                classFilter={CommonFilter}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "manager",
                })}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.goodsServicesValue || []}
                label={translate("RG.txt_goods_services_filter")}
                placeHolder={translate("RG.placeholder_goods_services")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={contractRepository.getListGoodsServices}
                classFilter={CommonFilter}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "goodsServices",
                })}
              />
            </Col>
            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.createdUserValue || []}
                label={translate("RG.txt_create_user")}
                placeHolder={translate("RG.placeholder_create_user")}
                render={(item) => `${item?.email} - ${item?.name}`}
                getList={receivedGoodsRepository.getListUser}
                classFilter={CommonFilter}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "createdUser",
                })}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.organizationIdsValue || []}
                label={translate("RG.txt_unit_of_creation")}
                placeHolder={translate("RG.placeholder_unit_of_creation")}
                getList={receivedGoodsRepository.getListOrganization}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "organizationIds",
                })}
                classFilter={CommonFilter}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <DateRangePicker
                label={translate("RG.txt_create_date")}
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
                popupClassName={datePickerPopupClassName.second}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.purchaseProposalValue || []}
                label={translate("RG.txt_policy")}
                placeHolder={translate("RG.placeholder_policy")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={receivedGoodsRepository.getListDropdownProposal}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "purchaseProposal",
                })}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.purchaseRequestValue || []}
                label={translate("RG.txt_purchase_request")}
                placeHolder={translate("RG.placeholder_purchase_request")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={
                  receivedGoodsRepository.getListDropdownProposalApproved
                }
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "purchaseRequest",
                })}
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};
