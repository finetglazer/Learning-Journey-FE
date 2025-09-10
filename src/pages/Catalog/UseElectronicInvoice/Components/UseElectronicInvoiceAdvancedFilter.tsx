import { Col, Row } from "antd";
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

import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";

import CommonFilter from "models/CommonFilter";
import { UseElectronicInvoiceFilter } from "models/UseElectronicInvoice";
import {
  UseElectronicInvoiceContext,
  UseElectronicInvoiceContextProps,
} from "../UseElectronicInvoiceMaster/UseElectronicInvoiceMasterHook";

import FilterPanel from "components/FilterPanel/FilterPanel";
import { trimText } from "core/helpers/text";
import { listStatus } from "../constants";
import useElectronicInvoiceRepository from "../UseElectronicInvoiceRepository";

import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import styles from "./UseElectronicInvoice.module.scss";

interface UseElectronicInvoiceAdvancedFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const UseElectronicInvoiceAdvancedFilter = ({
  setVisible,
}: UseElectronicInvoiceAdvancedFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<UseElectronicInvoiceContextProps>(UseElectronicInvoiceContext);
  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: UseElectronicInvoiceFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
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
    <FilterPanel
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.btn_apply")}
      modelFilter={modelFilter}
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      handleClickOutside={handleClickOutside}
      className={styles["invoice-filter-panel"]}
    >
      {/* Checkbox status */}
      <FilterPanel.Left lg={5}>
        <div className="d-flex flex-column gap-3">
          {/* <CheckboxGroup
            label={translate("UEI.txt_use_electronic_invoice_status_e_pro")}
            dataOptions={listStatusEPro}
            values={modelFilter?.statusEProId || []}
            onChange={handleChangeCheckboxFilter({
              fieldName: "statusEPro",
            })}
          /> */}
          <CheckboxGroup
            label={translate("UEI.txt_use_electronic_invoice_status_invoice")}
            dataOptions={listStatus}
            values={modelFilter?.statusId || []}
            onChange={handleChangeCheckboxFilter({
              fieldName: "status",
            })}
          />
        </div>
      </FilterPanel.Left>

      <FilterPanel.Right lg={19}>
        <Row gutter={16}>
          <Col lg={8} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.sellerTaxNumsValue || []}
              label={translate(
                "UEI.label_use_electronic_invoice_seller_tax_num"
              )}
              placeHolder={translate(
                "UEI.placeholder_use_electronic_invoice_seller_tax_num"
              )}
              render={(item) => item?.name}
              getList={useElectronicInvoiceRepository.getListSeller}
              classFilter={CommonFilter}
              searchProperty="name"
              isEnumerable={false}
              isSmall={false}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "sellerTaxNums",
              })}
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <InputText
              label={translate("UEI.label_use_electronic_invoice_seller_name")}
              placeHolder={translate(
                "UEI.placeholder_use_electronic_invoice_seller_name"
              )}
              value={modelFilter?.sellerName}
              isSmall={false}
              onChange={(value) => {
                const trimmedText = trimText(value);
                handleChangeInputFilter({
                  fieldName: "sellerName",
                })(trimmedText);
              }}
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.fromEmailsValue || []}
              label={translate("UEI.label_use_electronic_invoice_sender")}
              placeHolder={translate(
                "UEI.placeholder_use_electronic_invoice_sender"
              )}
              render={(item) => item?.email}
              getList={useElectronicInvoiceRepository.getListUser}
              classFilter={CommonFilter}
              searchProperty="name"
              isEnumerable={false}
              isSmall={false}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "fromEmails",
              })}
            />
          </Col>

          <Col lg={8} className="m-b--md">
            <InputText
              label={translate("UEI.label_use_electronic_invoice_no")}
              placeHolder={translate(
                "UEI.placeholder_use_electronic_invoice_no"
              )}
              value={modelFilter?.no}
              isSmall={false}
              onChange={(value) => {
                const trimmedText = trimText(value);
                handleChangeInputFilter({
                  fieldName: "no",
                })(trimmedText);
              }}
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <InputText
              label={translate("UEI.label_use_electronic_invoice_notation")}
              placeHolder={translate(
                "UEI.placeholder_use_electronic_invoice_notation"
              )}
              value={modelFilter?.notation}
              isSmall={false}
              onChange={(value) => {
                const trimmedText = trimText(value);
                handleChangeInputFilter({
                  fieldName: "notation",
                })(trimmedText);
              }}
            />
          </Col>
          <Col lg={8} className="m-b--md">
            <InputText
              label={translate("UEI.label_use_electronic_invoice_form_no")}
              placeHolder={translate(
                "UEI.placeholder_use_electronic_invoice_form_no"
              )}
              value={modelFilter?.formNo}
              isSmall={false}
              onChange={(value) => {
                const trimmedText = trimText(value);
                handleChangeInputFilter({
                  fieldName: "formNo",
                })(trimmedText);
              }}
            />
          </Col>

          {/* <Col lg={8} className="m-b--md">
            <InputText
              label={translate("UEI.label_use_electronic_invoice_contract_no")}
              placeHolder={translate(
                "UEI.placeholder_use_electronic_invoice_contract_no"
              )}
              value={modelFilter?.contractNo}
              isSmall={false}
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
              label={translate("UEI.label_use_electronic_invoice_po_no")}
              placeHolder={translate(
                "UEI.placeholder_use_electronic_invoice_po_no"
              )}
              value={modelFilter?.poNo}
              isSmall={false}
              onChange={(value) => {
                const trimmedText = trimText(value);
                handleChangeInputFilter({
                  fieldName: "poNo",
                })(trimmedText);
              }}
            />
          </Col> */}
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate(
                "UEI.label_use_electronic_invoice_status_messages"
              )}
              placeHolder={translate(
                "UEI.placeholder_use_electronic_invoice_status_messages"
              )}
              value={modelFilter?.statusMessages}
              isSmall={false}
              onChange={(value) => {
                const trimmedText = trimText(value);
                handleChangeInputFilter({
                  fieldName: "statusMessages",
                })(trimmedText);
              }}
            />
          </Col>

          <Col lg={16} className="m-b--md">
            <div className="d-flex align-items-end h-100 flex-grow">
              <InputNumber
                value={modelFilter?.totalAmountFrom?.equal}
                label={translate(
                  "UEI.label_use_electronic_invoice_total_amount"
                )}
                placeHolder={translate(
                  "UEI.placeholder_use_electronic_invoice_total_amount_from"
                )}
                isSmall={false}
                onChange={handleChangeInputFilter({
                  fieldName: "totalAmountFrom",
                  fieldType: "equal",
                  classFilter: NumberFilter,
                })}
              />
              <div className={styles["use-electronic-invoice__dash"]}>-</div>
              <InputNumber
                value={modelFilter?.totalAmountTo?.equal}
                label={undefined}
                placeHolder={translate(
                  "UEI.placeholder_use_electronic_invoice_total_amount_to"
                )}
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
            <DateRangePicker
              label={translate("UEI.label_use_electronic_invoice_date")}
              placeholder={[
                translate("UEI.placeholder_use_electronic_invoice_date"),
                translate("UEI.placeholder_use_electronic_invoice_date"),
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
            />
          </Col>

          <Col lg={24} className="m-b--sm">
            <MultipleSelect
              values={modelFilter?.substitutePersonsValue || []}
              label={translate("UEI.label_substitute_person")}
              placeHolder={translate(
                "UEI.placeholder_use_electronic_invoice_substitute_persons"
              )}
              render={(item) => item?.email}
              getList={useElectronicInvoiceRepository.getListUser}
              classFilter={CommonFilter}
              searchProperty="name"
              isEnumerable={false}
              isSmall={false}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "substitutePersons",
              })}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
