import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { trimText } from "core/helpers/text";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { listReceivedGoodsStatus } from "pages/PurchasePage/constants";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { NumberFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  DateRangePicker,
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

const SIZE_COL = 8;
const SIZE_COL_16 = 16;
const SIZE_ROW = 16;
const SIZE_FILTER_LEFT = 3;
const SIZE_FILTER_RIGHT = 21;

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
import styles from "./ReceivedGoodsAdvancedFilter.module.scss";

interface ReceivingGoodsAdvancedFilterProps {
  setVisible?: Dispatch<SetStateAction<boolean>>;
}

export const ReceivingGoodsAdvancedFilter = ({
  setVisible,
}: ReceivingGoodsAdvancedFilterProps) => {
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
    <div className="ReceivedFilter">
      <FilterPanel
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        modelFilter={modelFilter}
        handleApplyFilter={handleApplyFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        handleClickOutside={handleClickOutside}
        className={styles["received-filter-panel"]}
        exceptNodeIds={values(datePickerPopupClassName)}
      >
        <FilterPanel.Left lg={SIZE_FILTER_LEFT}>
          <div className="d-flex flex-column gap-y--md">
            <CheckboxGroup
              label={translate("CM.txt_status")}
              dataOptions={listReceivedGoodsStatus()}
              values={modelFilter?.statusesId || []}
              onChange={handleChangeCheckboxFilter({
                fieldName: "statuses",
              })}
            />
          </div>
        </FilterPanel.Left>
        <FilterPanel.Right lg={SIZE_FILTER_RIGHT}>
          <Row gutter={SIZE_ROW}>
            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("RG.txt_code_received")}
                placeHolder={translate("RG.placeholder_code_received")}
                value={modelFilter?.receiptCode}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "receiptCode",
                  })(trimmedText);
                }}
              />
            </Col>
            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("RG.txt_code_contract")}
                placeHolder={translate("RG.placeholder_code_contract")}
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
              <MultipleSelect
                values={modelFilter?.goodsServicesValue || []}
                label={translate("RG.txt_goods_services_filter")}
                placeHolder={translate("RG.placeholder_goods_services")}
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

            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("RG.tab_label_name_contract")}
                placeHolder={translate("RG.placeholder_name_contract")}
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

            <Col lg={SIZE_COL} className="m-b--md">
              <DateRangePicker
                label={translate("RG.txt_effective_date")}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
                value={[
                  modelFilter?.receiptDate?.greaterEqual,
                  modelFilter?.receiptDate?.lessEqual,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "receiptDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                popupClassName={datePickerPopupClassName.first}
              />
            </Col>

            <Col lg={SIZE_COL_16} className="m-b--md">
              <div className="d-flex align-items-end h-100 flex-grow">
                <InputNumber
                  value={modelFilter?.totalAmountFrom?.equal}
                  label={translate("RG.txt_contract_value")}
                  placeHolder={translate("CM.placeholder_from")}
                  isSmall={false}
                  onChange={handleChangeInputFilter({
                    fieldName: "totalAmountFrom",
                    fieldType: "equal",
                  })}
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  numberType={NUMBER_TYPE_INPUT}
                />
                <div className={styles["received-filter__dash"]}>-</div>
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
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  numberType={NUMBER_TYPE_INPUT}
                />
              </div>
            </Col>
            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.recipientUnitValue || []}
                label={translate("RG.txt_consignee")}
                placeHolder={translate("RG.placeholder_consignee")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={receivedGoodsRepository.getListOrganization}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "recipientUnit",
                })}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.receiptPersonValue || []}
                label={translate("RG.txt_received_by")}
                placeHolder={translate("RG.placeholder_received_by")}
                render={(item) => `${item?.email}`}
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
                  fieldName: "receiptPerson",
                })}
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
                  modelFilter?.createDate?.greaterEqual,
                  modelFilter?.createDate?.lessEqual,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "createDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                popupClassName={datePickerPopupClassName.second}
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};
