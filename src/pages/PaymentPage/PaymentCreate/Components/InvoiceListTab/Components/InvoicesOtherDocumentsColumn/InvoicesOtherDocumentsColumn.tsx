import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { NUMBER_MAX_13 } from "config/const";
import {
  DESCRIPTION_REGEX,
  NAME_BANK_REGEX,
  STANDARD_DATE_FORMAT_SLASH,
  SUPPLIER_TAX_CODE_REGEX,
} from "core/config/consts";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { utilService } from "core/services/common-services/util-service";
import { FieldValue } from "core/services/service-types";
import dayjs, { Dayjs } from "dayjs";
import type { TFunction } from "i18next";
import { isEmpty, round, TruncateOptions } from "lodash";
import {
  CODE_TYPE_ADVANCE_TUNCC,
  CODE_TYPE_EXPENSE_DCNCC,
  CODE_TYPE_PAYMENT_REQUEST_CORP,
  InvoicesOtherDocumentModel,
  PaymentRequestModel,
  VND_CURRENCY,
} from "models/Payment";
import { convertToNumber } from "pages/PaymentPage/PaymentCreate/Helper/Helper";
import {
  BORDER_TYPE,
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  OneLineText,
  Select,
} from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { paymentRepository } from "../../../../../PaymentRepository";

type props = {
  translate: TFunction;
  _truncate?: (string?: string, options?: TruncateOptions) => string;
  formatNumberToCurrency: (
    value: number,
    shouldRound?: boolean,
    code?: string
  ) => string;
  handleChangeItemTable: (
    fieldName: string,
    value: FieldValue,
    objectValue: FieldValue,
    id: string,
    indexBeforeValidate?: number,
    nameError?: string
  ) => void;
  handleChangeMultipleItemTable: (
    data: object,
    id: string,
    indexBeforeValidate?: number,
    nameError?: string[]
  ) => void;
  model: PaymentRequestModel;
  handleDownloadFileAttached: (file?: FileModel) => void;
  handleDeleteRowConfirm: (id: string) => void;
  getSupplierOtherDocument: (
    supplierTaxCode: string,
    recordId: string,
    isClearTaxCode?: boolean
  ) => void;
};

const InvoicesOtherDocumentsColumn = ({
  translate,
  formatNumberToCurrency,
  model,
  handleChangeMultipleItemTable,
  handleChangeItemTable,
  handleDeleteRowConfirm,
  getSupplierOtherDocument,
}: props): ColumnProps<InvoicesOtherDocumentModel>[] => {
  return [
    {
      key: "stt",
      dataIndex: "stt",
      width: 30,
      fixed: "left",
      render(...params: [number, InvoicesOtherDocumentModel, number]) {
        if (params[1]?.isTotal) return null;
        return <LayoutCell>{params[2] + 1}</LayoutCell>;
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-start text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_interpretation_of_documents")}
            <span className="text-danger">&nbsp;*</span>
          </div>
        </div>
      ),
      fixed: "left",
      key: "description",
      dataIndex: "description",
      width: 200,
      render: (text, record, index) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="left" className="invoice-title_view ms-0">
              {translate("PM.total")}
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `otherDocuments[${record?.indexBeforeValidate}].description`
              )}
            >
              <InputText
                isTableCell
                className="payment-label_none"
                label={translate("PM.payment_interpretation_of_documents")}
                translate={translate}
                isRequired
                placeHolder={translate(
                  "PM.payment_interpretation_of_documents_placeholder"
                )}
                value={text}
                onChange={(value: string) => {
                  handleChangeItemTable(
                    "description",
                    value,
                    null,
                    record.id,
                    record?.indexBeforeValidate,
                    "description"
                  );
                }}
                isByteCheck
                maxLength={240}
                regexInput={NAME_BANK_REGEX}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14  d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_amount_before_tax")}
            <span className="text-danger">&nbsp;*</span>
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.currency?.code}
          </div>
        </div>
      ),
      dataIndex: "netAmount",
      key: "netAmount",
      width: 160,
      fixed: "left",
      render: (value, record, index) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="invoice-title_view"
                value={formatNumberToCurrency(
                  model?.invoicesOtherDocument.reduce(
                    (total, item) => total + (item.netAmount || 0),
                    0
                  )
                )}
                useTooltip
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="d-flex justify-content-end">
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `otherDocuments[${record?.indexBeforeValidate}].netAmount`
              )}
            >
              <InputNumber
                isInputRight
                isTableCell
                isRequired
                translate={translate}
                label={translate("PM.payment_amount_before_tax")}
                className="payment-custom_input payment-label_none"
                placeHolder={translate("PM.payment_amount_placeholder")}
                isSmall={true}
                onChange={(value: number) => {
                  const taxAmount =
                    (value || 0) * (record?.taxType?.rate || 0) * 0.01;
                  const taxAmountRound = convertToNumber(
                    formatNumberToCurrency(taxAmount, true)
                  );
                  const paymentAmount = (value || 0) + taxAmountRound;

                  handleChangeMultipleItemTable(
                    {
                      netAmount: value,
                      taxAmount:
                        model.currency?.code != VND_CURRENCY
                          ? taxAmountRound
                          : Math.round(taxAmountRound),
                      paymentAmount:
                        model.currency?.code != VND_CURRENCY
                          ? round(paymentAmount, 4)
                          : Math.round(paymentAmount) || 0,
                      totalAmount:
                        model.currency?.code != VND_CURRENCY
                          ? round(paymentAmount, 4)
                          : Math.round(paymentAmount) || 0,
                    },
                    record.id,
                    record.indexBeforeValidate,
                    ["netAmount", "taxAmount", "paymentAmount"]
                  );
                }}
                value={value}
                isReverseSymb
                numberType={getNumberTypeByCurrency(model.currency?.code)}
                allowNegative
                max={NUMBER_MAX_13}
                min={-NUMBER_MAX_13}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-start text-nowrap">
            {typeof translate === "function" && translate("PM.tax_type")}
            <span className="text-danger">&nbsp;*</span>
          </div>
        </div>
      ),
      dataIndex: "taxId",
      key: "taxId",
      width: 120,
      render: (value, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell className="d-flex justify-content-end">
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `otherDocuments[${record?.indexBeforeValidate}].taxId`
              )}
            >
              <Select
                label={translate("PM.tax_type")}
                className="payment-custom_input payment-label_none"
                placeHolder={translate("PM.select_tax_type")}
                isRequired
                searchType=""
                valueFilter={{
                  name: "",
                  taxType: model.taxTypeInvoiceSubmit,
                }}
                searchProperty={"name"}
                classFilter={undefined}
                isSearch
                onChange={(value, objectValue) => {
                  const taxAmount =
                    (record?.netAmount || 0) * (objectValue?.rate || 0) * 0.01;
                  const taxAmountRound = convertToNumber(
                    formatNumberToCurrency(taxAmount, true)
                  );
                  const paymentAmount = record?.netAmount + taxAmountRound;

                  handleChangeMultipleItemTable(
                    {
                      taxType: objectValue,
                      taxAmount:
                        model.currency?.code != VND_CURRENCY
                          ? taxAmountRound
                          : Math.round(taxAmountRound),
                      paymentAmount:
                        model.currency?.code != VND_CURRENCY
                          ? round(paymentAmount, 4)
                          : Math.round(paymentAmount),
                      totalAmount:
                        model.currency?.code != VND_CURRENCY
                          ? round(paymentAmount, 4)
                          : Math.round(paymentAmount),
                    },
                    record.id,
                    record.indexBeforeValidate,
                    ["taxId", "taxAmount", "paymentAmount"]
                  );
                }}
                getList={paymentRepository.taxType}
                isEnumerable={false}
                value={record?.taxType}
                appendToBody
                render={(tax) =>
                  tax?.id ? `${tax?.code} - ${tax?.name}` : null
                }
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14 d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" && translate("PM.tax_amount")}
            <span className="text-danger">&nbsp;*</span>
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.currency?.code}
          </div>
        </div>
      ),
      dataIndex: "taxAmount",
      key: "taxAmount",
      width: 160,
      render: (value, record, index) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="invoice-title_view"
                value={formatNumberToCurrency(
                  model?.invoicesOtherDocument.reduce(
                    (total, item) => total + (item.taxAmount || 0),
                    0
                  )
                )}
                useTooltip
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="d-flex justify-content-end">
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `otherDocuments[${record?.indexBeforeValidate}].taxAmount`
              )}
            >
              <InputNumber
                isInputRight
                isTableCell
                translate={translate}
                label={translate("PM.tax_amount")}
                className="payment-label_none"
                isRequired
                placeHolder={translate("PM.payment_amount_placeholder")}
                isSmall={true}
                onChange={(value: number) => {
                  const paymentAmount = (value || 0) + (record.netAmount || 0);
                  const totalAmount = (value || 0) + (record.netAmount || 0);
                  handleChangeMultipleItemTable(
                    {
                      taxAmount: value,
                      paymentAmount:
                        model.currency?.code != VND_CURRENCY
                          ? round(paymentAmount, 4)
                          : Math.round(paymentAmount),
                      totalAmount:
                        model.currency?.code != VND_CURRENCY
                          ? round(totalAmount, 4)
                          : Math.round(totalAmount),
                    },
                    record.id,
                    record.indexBeforeValidate,
                    ["taxAmount", "paymentAmount"]
                  );
                }}
                value={value}
                isReverseSymb
                numberType={getNumberTypeByCurrency(model?.currency?.code)}
                allowNegative
                max={NUMBER_MAX_13}
                min={-NUMBER_MAX_13}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" && translate("PM.total_amount")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.currency?.code}
          </div>
        </div>
      ),
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 145,
      render: (value, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="amount-title"
                useTooltip
                value={formatNumberToCurrency(
                  model?.invoicesOtherDocument.reduce(
                    (total, item) => total + (item.totalAmount || 0),
                    0
                  )
                )}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="d-flex justify-content-end">
            <OneLineText
              className="amount-title"
              useTooltip
              value={formatNumberToCurrency(value || 0)}
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" && translate("PM.payment_amount")}
            <span className="text-danger">&nbsp;*</span>
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.currency?.code}
          </div>
        </div>
      ),
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      width: 160,
      render: (value, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="amount-title"
                useTooltip
                value={formatNumberToCurrency(
                  model?.invoicesOtherDocument.reduce(
                    (total, item) => total + (item?.paymentAmount || 0),
                    0
                  )
                )}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="d-flex justify-content-end">
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `otherDocuments[${record?.indexBeforeValidate}].paymentAmount`
              )}
            >
              <InputNumber
                isInputRight
                isTableCell
                translate={translate}
                label={translate("PM.payment_amount")}
                isRequired
                className="payment-custom_input payment-label_none"
                placeHolder={translate("PM.payment_amount_placeholder")}
                isSmall={true}
                onChange={(value: number) => {
                  handleChangeItemTable(
                    "paymentAmount",
                    value,
                    null,
                    record.id,
                    record.indexBeforeValidate,
                    "paymentAmount"
                  );
                }}
                value={value}
                isReverseSymb
                numberType={getNumberTypeByCurrency(model?.currency?.code)}
                allowNegative
                max={NUMBER_MAX_13}
                min={-NUMBER_MAX_13}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" && translate("PM.retained_amount")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.currency?.code}
          </div>
        </div>
      ),
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      width: 145,
      render: (value, record) => {
        if (record.isTotal) {
          const retainedAmount = model?.invoicesOtherDocument?.reduce(
            (total, item) =>
              total + ((item?.totalAmount ?? 0) - (item?.paymentAmount ?? 0)),
            0
          );
          return (
            <LayoutCell position="right">
              <OneLineText
                className="amount-title"
                useTooltip
                value={formatNumberToCurrency(retainedAmount)}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="d-flex justify-content-end">
            <OneLineText
              className="invoice-title_view"
              value={formatNumberToCurrency(
                (record?.totalAmount || 0) - (record?.paymentAmount || 0)
              )}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-start text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_document_number")}
          </div>
        </div>
      ),
      dataIndex: "documentNumber",
      key: "documentNumber",
      width: 120,
      render: (value, record, index) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `otherDocuments[${record?.indexBeforeValidate}].documentNumber`
              )}
            >
              <InputText
                isTableCell
                className="payment-label_none"
                type={BORDER_TYPE.BORDERED}
                label={translate("PM.payment_document_number")}
                placeHolder={translate(
                  "PM.payment_document_number_placeholder"
                )}
                onChange={(value: string) => {
                  handleChangeItemTable(
                    "documentNumber",
                    value,
                    null,
                    record.id,
                    record.indexBeforeValidate,
                    "documentNumber"
                  );
                }}
                value={value}
                maxLength={50}
                isSmall={true}
                translate={translate}
                regexInput={DESCRIPTION_REGEX}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-start text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_document_date")}
            <span className="text-danger">&nbsp;*</span>
          </div>
        </div>
      ),
      dataIndex: "documentDate",
      key: "documentDate",
      width: 138,
      render: (value, record, index) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `otherDocuments[${record?.indexBeforeValidate}].documentDate`
              )}
            >
              <DatePicker
                label={translate("PM.payment_document_date")}
                className="payment-label_none"
                value={value}
                placeholder={"dd/mm/yyyy"}
                isRequired={true}
                isSmall={true}
                size={"middle"}
                onChange={(value: Dayjs) => {
                  handleChangeItemTable(
                    "documentDate",
                    value,
                    null,
                    record.id,
                    record.indexBeforeValidate,
                    "documentDate"
                  );
                }}
                format={STANDARD_DATE_FORMAT_SLASH}
                maxDate={dayjs().endOf("date")}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-start text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_supplier_table_tax_title")}
          </div>
        </div>
      ),
      dataIndex: "supplierTaxCode",
      key: "supplierTaxCode",
      width: 160,
      render: (value, record, index) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `otherDocuments[${record?.indexBeforeValidate}].supplierTaxCode`
              )}
            >
              <InputText
                isTableCell
                disabled={
                  model?.paymentRequestType?.code ===
                    CODE_TYPE_PAYMENT_REQUEST_CORP ||
                  model?.paymentRequestType?.code === CODE_TYPE_ADVANCE_TUNCC ||
                  model?.paymentRequestType?.code === CODE_TYPE_EXPENSE_DCNCC
                }
                className="payment-label_none"
                type={BORDER_TYPE.BORDERED}
                onKeyUp={(event: any) => {
                  const value = (event.target as HTMLInputElement).value;
                  if (event.key === "Backspace" || event.key === "Delete") {
                    getSupplierOtherDocument(value, record?.id, true);
                  }
                }}
                onEnter={(value: string) => {
                  getSupplierOtherDocument(value, record?.id);
                }}
                label={translate("PM.payment_supplier_table_tax_title")}
                placeHolder={translate("PM.payment_tax_code_placeholder")}
                onChange={(value: string) => {
                  if (isEmpty(value)) {
                    getSupplierOtherDocument(value, record?.id, true);
                  }
                  handleChangeItemTable(
                    "supplierTaxCode",
                    value,
                    null,
                    record.id,
                    record.indexBeforeValidate,
                    "supplierTaxCode"
                  );
                }}
                value={value}
                maxLength={150}
                isSmall={true}
                translate={translate}
                regexInput={SUPPLIER_TAX_CODE_REGEX}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-start text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_supplier_table_name_title")}
          </div>
        </div>
      ),
      dataIndex: "supplierName",
      key: "supplierName",
      width: 200,
      render: (value, record, index) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `otherDocuments[${record?.indexBeforeValidate}].supplierName`
              )}
            >
              <InputText
                isTableCell
                disabled={
                  model?.paymentRequestType?.code ===
                    CODE_TYPE_PAYMENT_REQUEST_CORP ||
                  model?.paymentRequestType?.code === CODE_TYPE_ADVANCE_TUNCC ||
                  model?.paymentRequestType?.code === CODE_TYPE_EXPENSE_DCNCC
                }
                className="payment-label_none"
                type={BORDER_TYPE.BORDERED}
                label={translate("PM.payment_supplier_table_name_title")}
                placeHolder={translate("PM.payment_enter_supplier_name")}
                onChange={(value: string) => {
                  handleChangeItemTable(
                    "supplierName",
                    value,
                    null,
                    record.id,
                    record.indexBeforeValidate,
                    "supplierName"
                  );
                }}
                value={value}
                maxLength={150}
                isSmall={true}
                translate={translate}
                regexInput={NAME_BANK_REGEX}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-start text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_supplier_code_input_label")}
          </div>
        </div>
      ),
      dataIndex: "supplierCode",
      key: "supplierCode",
      width: 140,
      render: (value, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText value={value} useTooltip={true} />
          </LayoutCell>
        );
      },
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      dataIndex: "action",
      width: 40,
      render: (_, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <div className="payment-red cursor-pointer btn">
              <TrashCan
                size={24}
                onClick={() => handleDeleteRowConfirm(record.id)}
              />
            </div>
          </LayoutCell>
        );
      },
    },
  ];
};

export default InvoicesOtherDocumentsColumn;
