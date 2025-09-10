import { TrashCan } from "@carbon/icons-react";
import { Col, Row, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { warning } from "assets/icons";
import classNames from "classnames";
import { NUMBER_MAX_13 } from "config/const";
import {
  NAME_BANK_REGEX,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { formatDate } from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import { FieldValue } from "core/services/service-types";
import type { TFunction } from "i18next";
import { TruncateOptions } from "lodash";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import { InvoiceModel, PaymentRequestModel } from "models/Payment";
import {
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  OneLineText,
  UploadFile,
} from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

type props = {
  translate: TFunction;
  _truncate?: (string?: string, options?: TruncateOptions) => string;
  formatNumberToCurrency: (value: number) => string;
  handleChangeItemTable: (
    fieldName: string,
    value: FieldValue,
    objectValue: FieldValue,
    id: string,
    indexBeforeValidate: number,
    nameError: string
  ) => void;
  handleChangeMultipleItemTable: (
    data: object,
    id: string,
    indexBeforeValidate: number,
    nameError: string
  ) => void;
  model: PaymentRequestModel;
  renderIcon: (
    item: RequestAttachment,
    handleDownloadFileAttached: (file?: FileModel) => void
  ) => JSX.Element;
  handleDownloadFileAttached: (file?: FileModel) => void;
  initFileAttached: (record: InvoiceModel) => RequestAttachment[];
  handleDeleteRowConfirm: (id: string) => void;
  isDisablePaymentAmount: boolean;
};

const InvoicesTableColumn = ({
  translate,
  formatNumberToCurrency,
  model,
  handleChangeItemTable,
  renderIcon,
  handleDownloadFileAttached,
  initFileAttached,
  handleDeleteRowConfirm,
  handleChangeMultipleItemTable,
  isDisablePaymentAmount,
}: props): ColumnProps<InvoiceModel>[] => {
  return [
    {
      title: null,
      dataIndex: "statusMessages",
      key: "statusMessages",
      fixed: "left",
      width: 60,
      render: (text, record, index) => (
        <LayoutCell>
          {record?.isTotal ? null : index + 1}
          <Tooltip
            placement="top"
            title={translate("PM.payment_warning_message_tooltip")}
          >
            {text && <img src={warning} alt="" className="m-l--3xs" />}
          </Tooltip>
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className={classNames("component__title text-nowrap")}>
            {typeof translate === "function" &&
              translate("PM.payment_invoice_breakdown")}
            <span className="text-danger">&nbsp;*</span>
          </div>
        </div>
      ),
      fixed: "left",
      key: "descriptionSubmit",
      dataIndex: "descriptionSubmit",
      width: 160,
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
              isTableCell={true}
              validateObject={utilService.getValidateObj(
                model,
                `invoices[${record?.indexBeforeValidate}].description`
              )}
            >
              <InputText
                isTableCell
                className="payment-label_none"
                label={translate("PM.payment_invoice_breakdown")}
                isRequired
                translate={translate}
                placeHolder={translate("PM.budget_plan_input")}
                value={text}
                onChange={(value: string) => {
                  handleChangeItemTable(
                    "descriptionSubmit",
                    value,
                    null,
                    record.id,
                    record.indexBeforeValidate,
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
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_amount_before_tax")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.currency?.code}
          </div>
        </div>
      ),
      dataIndex: "amountBeforeTax",
      key: "amountBeforeTax",
      width: 145,
      fixed: "left",
      render: (text, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="invoice-title_view"
                value={formatNumberToCurrency(
                  model?.invoices.reduce(
                    (total, item) => total + (item.amountBeforeTax || 0),
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
            <OneLineText value={formatNumberToCurrency(text)} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_tax_rate")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.currency?.code}
          </div>
        </div>
      ),
      dataIndex: "taxCode",
      key: "taxCode",
      width: 100,
      render: (text, record) => {
        if (record?.isTotal) {
          return null;
        }
        return (
          <LayoutCell className="text-break d-flex justify-content-end">
            <OneLineText value={text} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" && translate("PM.tax_amount")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.currency?.code}
          </div>
        </div>
      ),
      dataIndex: "taxAmount",
      key: "taxAmount",
      width: 145,
      render: (text, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatNumberToCurrency(
                  model?.invoices.reduce(
                    (total, item) => total + (item.taxAmount || 0),
                    0
                  )
                )}
                useTooltip
                className="invoice-title_view"
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="d-flex justify-content-end">
            <OneLineText value={formatNumberToCurrency(text)} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14 d-flex justify-content-end flex-column">
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
      render: (text, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatNumberToCurrency(
                  model?.invoices.reduce(
                    (total, item) => total + (item.totalAmount || 0),
                    0
                  )
                )}
                useTooltip
                className="invoice-title_view"
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="d-flex justify-content-end">
            <OneLineText value={formatNumberToCurrency(text)} useTooltip />
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
      dataIndex: "paymentAmountSubmit",
      key: "paymentAmountSubmit",
      width: 160,
      render: (value, record, index) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="amount-title"
                useTooltip
                value={formatNumberToCurrency(
                  model?.invoices.reduce(
                    (total, item) => total + (item.paymentAmountSubmit || 0),
                    0
                  )
                )}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="d-flex justify-content-end pb-1">
            <FormItem
              isTableCell={true}
              validateObject={utilService.getValidateObj(
                model,
                `invoices[${record?.indexBeforeValidate}].paymentAmount`
              )}
            >
              <InputNumber
                isInputRight
                isTableCell
                disabled={isDisablePaymentAmount}
                label={translate("PM.payment_amount")}
                isRequired
                translate={translate}
                className="payment-custom_input payment-label_none"
                placeHolder={translate("PM.payment_amount_placeholder")}
                isSmall={true}
                onChange={(value: number) => {
                  const retainedAmount =
                    (record?.totalAmount || 0) - (value || 0);
                  handleChangeMultipleItemTable(
                    {
                      paymentAmountSubmit: value,
                      retainedAmount: retainedAmount,
                    },
                    record.id,
                    record.indexBeforeValidate,
                    "paymentAmount"
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
        <div className="payment-font-14  d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_bank_with_hold_not_pay_input_label")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.currency?.code}
          </div>
        </div>
      ),
      dataIndex: "retainedAmount",
      key: "retainedAmount",
      width: 145,
      render: (text, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="invoice-title_view"
                useTooltip
                value={formatNumberToCurrency(
                  model?.invoices.reduce(
                    (total, item) => total + (item.retainedAmount || 0),
                    0
                  )
                )}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="d-flex justify-content-end">
            <OneLineText useTooltip value={formatNumberToCurrency(text)} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14  d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" && translate("PM.payment_paid")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.currency?.code}
          </div>
        </div>
      ),
      dataIndex: "paid",
      key: "paid",
      width: 145,
      render: (text, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatNumberToCurrency(
                  model?.invoices.reduce(
                    (total, item) => total + (item.paid || 0),
                    0
                  )
                )}
                useTooltip
                className="invoice-title_view"
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="d-flex justify-content-end">
            <OneLineText useTooltip value={formatNumberToCurrency(text)} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_invoice_number")}
          </div>
        </div>
      ),
      dataIndex: "no",
      key: "no",
      width: 120,
      render: (text, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_invoice_date")}
          </div>
        </div>
      ),
      dataIndex: "date",
      key: "date",
      width: 110,
      render: (text, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText
              useTooltip
              value={formatDate(text, STANDARD_DATE_FORMAT_SLASH)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_supplier_table_tax_title")}
          </div>
        </div>
      ),
      dataIndex: "sellerTaxNum",
      key: "sellerTaxNum",
      width: 142,
      render: (text, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_supplier_table_name_title")}
          </div>
        </div>
      ),
      dataIndex: "sellerName",
      key: "sellerName",
      width: 200,
      render: (text, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText value={text} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_supplier_code_input_label")}
          </div>
        </div>
      ),
      dataIndex: "sellerCode",
      key: "sellerCode",
      width: 140,
      render: (text, record) => {
        if (record.isTotal) {
          return null;
        }
        return <LayoutCell>{text}</LayoutCell>;
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_invoice_symbol")}
          </div>
        </div>
      ),
      dataIndex: "notation",
      key: "notation",
      width: 90,
      render: (text, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_contract_form")}
          </div>
        </div>
      ),
      dataIndex: "formNo",
      key: "formNo",
      width: 90,
      render: (text, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className="text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_invoice_nature_HD")}
          </div>
        </div>
      ),
      dataIndex: "invoiceKind",
      key: "invoiceKind",
      width: 200,
      render: (text, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className="d-flex justify-content-start text-nowrap">
            {typeof translate === "function" && translate("PM.payment_warning")}
          </div>
        </div>
      ),
      dataIndex: "statusMessages",
      key: "statusMessages",
      width: 200,
      render: (text, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className="d-flex justify-content-start text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_table_voucher_attached_label")}
          </div>
        </div>
      ),
      key: "pdfUrl",
      dataIndex: "pdfUrl",
      ellipsis: true,
      width: 384,
      render: (_, record) => {
        if (record.isTotal) {
          return null;
        }
        // const fileAttached = initFileAttached(record);
        return (
          <div className="p-y--3xs p-x--2xs">
            <Row gutter={[8, 8]}>
              {record?.files?.map((item: RequestAttachment, index: number) => {
                return (
                  <Col span={8} key={item?.systemFileId}>
                    <UploadFile.FileLoadedContent
                      key={index}
                      file={{ ...item, id: index }}
                      isViewMode={true}
                      icon={renderIcon(item, handleDownloadFileAttached)}
                      onClickFile={() => handleDownloadFileAttached(item)}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
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

export default InvoicesTableColumn;
