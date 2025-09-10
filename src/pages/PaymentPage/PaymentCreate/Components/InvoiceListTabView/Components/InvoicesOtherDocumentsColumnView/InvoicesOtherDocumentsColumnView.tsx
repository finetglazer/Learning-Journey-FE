import { ColumnProps } from "antd/lib/table";
import classNames from "classnames";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import {
  InvoicesOtherDocumentViewModel,
  PaymentDetailTypeModel,
} from "models/Payment";
import { LayoutCell, OneLineText } from "react-components-design-system";
// eslint-disable-next-line import/named
import { TFunction } from "i18next";
// eslint-disable-next-line import/no-unresolved
import { formatDate } from "core/helpers/date-time";

type props = {
  translate: TFunction;
  formatNumberToCurrency: (value: number) => string;
  invoiceOtherList: InvoicesOtherDocumentViewModel[];
  model: PaymentDetailTypeModel;
};

const InvoicesOtherDocumentsColumnView = ({
  translate,
  formatNumberToCurrency,
  invoiceOtherList,
  model,
}: props): ColumnProps<InvoicesOtherDocumentViewModel>[] => {
  return [
    {
      key: "stt",
      dataIndex: "stt",
      width: 30,
      fixed: "left",
      render(...params: [number, InvoicesOtherDocumentViewModel, number]) {
        if (params[1]?.isTotal) return null;
        return <LayoutCell>{params[2] + 1}</LayoutCell>;
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className={classNames("component__title text-nowrap")}>
            {typeof translate === "function" &&
              translate("PM.payment_interpretation_of_documents")}
          </div>
        </div>
      ),
      fixed: "left",
      key: "description",
      dataIndex: "description",
      width: 200,
      render: (value, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="left">
              <label className="m-0 invoice-title_view">
                {translate("PM.total")}
              </label>
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={value} useTooltip />
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
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.paymentDetailInfomation?.currencyDTO?.code}
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
                  invoiceOtherList?.reduce(
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
            <OneLineText value={formatNumberToCurrency(value)} useTooltip />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-start text-nowrap">
            {typeof translate === "function" && translate("PM.tax_type")}
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
          <LayoutCell className="d-flex justify-content-start">
            <OneLineText value={record?.tax?.name} useTooltip />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14 d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" && translate("PM.tax_amount")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.paymentDetailInfomation?.currencyDTO?.code}
          </div>
        </div>
      ),
      dataIndex: "taxAmount",
      key: "taxAmount",
      width: 160,
      render: (value, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="invoice-title_view"
                value={formatNumberToCurrency(
                  invoiceOtherList?.reduce(
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
            <OneLineText value={formatNumberToCurrency(value)} useTooltip />
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
            {model?.paymentDetailInfomation?.currencyDTO?.code}
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
                className="invoice-title_view"
                useTooltip
                value={formatNumberToCurrency(
                  invoiceOtherList?.reduce(
                    (total, item) => total + (item.netAmount || 0),
                    0
                  ) +
                    invoiceOtherList?.reduce(
                      (total, item) => total + (item.taxAmount || 0),
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
              useTooltip
              value={formatNumberToCurrency(
                record?.netAmount + record?.taxAmount || 0
              )}
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
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.paymentDetailInfomation?.currencyDTO?.code}
          </div>
        </div>
      ),
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      width: 160,
      render: (value, record, index) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="amount-title"
                useTooltip
                value={formatNumberToCurrency(
                  invoiceOtherList.reduce(
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
            <OneLineText useTooltip value={formatNumberToCurrency(value)} />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="payment-font-14 d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" && translate("PM.retained_amount")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {model?.paymentDetailInfomation?.currencyDTO?.code}
          </div>
        </div>
      ),
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      width: 145,
      render: (value, record) => {
        if (record.isTotal) {
          const retainedAmount = invoiceOtherList?.reduce(
            (total, item) =>
              total +
              ((item?.taxAmount ?? 0) +
                (item?.netAmount ?? 0) -
                (item?.paymentAmount ?? 0)),
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
              useTooltip
              value={formatNumberToCurrency(
                record?.netAmount + record?.taxAmount - record?.paymentAmount ||
                  0
              )}
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
            <OneLineText useTooltip value={value} />
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
            <OneLineText
              useTooltip
              value={formatDate(value, STANDARD_DATE_FORMAT_SLASH)}
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
            <OneLineText useTooltip value={value} />
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
            <OneLineText useTooltip value={value} />
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
            <OneLineText useTooltip value={value} />
          </LayoutCell>
        );
      },
    },
  ];
};

export default InvoicesOtherDocumentsColumnView;
