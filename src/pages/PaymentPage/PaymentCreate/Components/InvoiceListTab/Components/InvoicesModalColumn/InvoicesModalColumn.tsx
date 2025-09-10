import { ColumnProps } from "antd/lib/table";
import classNames from "classnames";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { TruncateOptions } from "lodash";
import { InvoiceModel } from "models/Payment";
import { LayoutCell, OneLineText } from "react-components-design-system";

type props = {
  currentCurrencyCode?: string;
  translate: (key: string) => string;
  _truncate?: (string?: string, options?: TruncateOptions) => string;
  formatNumberToCurrency: (value: number) => string;
};

const InvoicesModalColumn = ({
  currentCurrencyCode,
  translate,
  _truncate,
  formatNumberToCurrency,
}: props): ColumnProps<InvoiceModel>[] => {
  return [
    {
      title: () => (
        <div className="payment-font-14">
          <div className={classNames("component__title text-nowrap")}>
            {typeof translate === "function" &&
              translate("PM.payment_invoice_code")}
          </div>
        </div>
      ),
      dataIndex: "sellerTaxNum",
      key: "sellerTaxNum",
      width: 102,
      render: (text) => (
        <LayoutCell>
          <OneLineText value={text} useTooltip />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" &&
              translate("PM.payment_invoice_name")}
          </div>
        </div>
      ),
      dataIndex: "sellerName",
      key: "sellerName",
      width: 136,
      render: (text) => (
        <LayoutCell>
          <OneLineText value={text} useTooltip />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" &&
              translate("PM.payment_invoice_number")}
          </div>
        </div>
      ),
      dataIndex: "no",
      key: "no",
      width: 92,
      render: (text) => (
        <LayoutCell>
          <OneLineText value={text} useTooltip />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className={classNames("component__title text-nowrap")}>
            {typeof translate === "function" &&
              translate("PM.payment_invoice_symbol")}
          </div>
        </div>
      ),
      dataIndex: "notation",
      key: "notation",
      width: 90,
      render: (text) => (
        <LayoutCell>
          <OneLineText value={text} useTooltip />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" &&
              translate("PM.payment_invoice_date")}
          </div>
        </div>
      ),
      dataIndex: "date",
      key: "date",
      width: 110,
      render: (text) => (
        <LayoutCell>
          <OneLineText
            useTooltip
            value={formatDate(text, STANDARD_DATE_FORMAT_SLASH)}
          />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {typeof translate === "function" &&
              translate("PM.payment_invoice_total_amount_tax")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {currentCurrencyCode}
          </div>
        </div>
      ),
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 147,
      render: (text) => (
        <LayoutCell className="d-flex justify-content-end">
          <OneLineText useTooltip value={formatNumberToCurrency(text)} />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" &&
              translate("PM.payment_invoice_nature")}
          </div>
        </div>
      ),
      dataIndex: "invoiceKind",
      key: "invoiceKind",
      width: 138,
      render: (text) => (
        <LayoutCell>
          <OneLineText useTooltip value={text} />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" && translate("PM.payment_warning")}
          </div>
        </div>
      ),
      dataIndex: "statusMessages",
      key: "statusMessages",
      width: 140,
      render: (text, record) => (
        <LayoutCell>
          <OneLineText useTooltip value={text} />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" && translate("PM.payment_relate")}
          </div>
        </div>
      ),
      dataIndex: "invoiceRelated",
      key: "invoiceRelated",
      width: 184,
      render: (text, record) => (
        <LayoutCell>
          <OneLineText useTooltip value={text} />
        </LayoutCell>
      ),
    },
  ];
};

export default InvoicesModalColumn;
