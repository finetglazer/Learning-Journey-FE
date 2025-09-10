import { Col, Row, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { warning } from "assets/icons";
import classNames from "classnames";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import type { TFunction } from "i18next";
import { RequestAttachment } from "models/Budget/BugetSettlement";
import {
  InvoiceModel,
  InvoicesViewModel,
  PaymentDetailTypeModel,
} from "models/Payment";
import {
  LayoutCell,
  OneLineText,
  UploadFile,
} from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

type props = {
  translate: TFunction;
  formatNumberToCurrency: (value: number) => string;
  renderIcon: (
    item: RequestAttachment,
    handleDownloadFileAttached: (file?: FileModel) => void
  ) => JSX.Element;
  handleDownloadFileAttached: (file?: FileModel) => void;
  initFileAttached: (record: InvoiceModel) => RequestAttachment[];
  invoiceList: InvoicesViewModel[];
  model: PaymentDetailTypeModel;
};

const InvoicesTableColumnView = ({
  translate,
  formatNumberToCurrency,
  renderIcon,
  handleDownloadFileAttached,
  initFileAttached,
  invoiceList,
  model,
}: props): ColumnProps<InvoicesViewModel>[] => {
  return [
    {
      title: null,
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 60,
      fixed: "left",
      render: (invoiceDetail: InvoiceModel, record, index: number) => {
        if (record?.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            {record?.isTotal ? null : index + 1}
            <Tooltip
              placement="top"
              title={translate("PM.payment_warning_message_tooltip")}
            >
              {invoiceDetail?.statusMessages && (
                <img src={warning} alt="" className="m-l--3xs" />
              )}
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className={classNames("component__title text-nowrap")}>
            {typeof translate === "function" &&
              translate("PM.payment_invoice_breakdown")}
          </div>
        </div>
      ),
      fixed: "left",
      key: "invoiceDetail",
      dataIndex: "invoiceDetail",
      width: 160,
      render: (_, record) => {
        if (record?.isTotal) {
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
            <OneLineText value={record?.description} useTooltip />
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
            {model?.paymentDetailInfomation?.currencyDTO?.code}
          </div>
        </div>
      ),
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 147,
      fixed: "left",
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record?.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="invoice-title_view"
                value={formatNumberToCurrency(
                  invoiceList?.reduce(
                    (total, item) =>
                      total + (item?.invoiceDetail?.amountBeforeTax || 0),
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
            <OneLineText
              value={formatNumberToCurrency(invoiceDetail?.amountBeforeTax)}
              useTooltip
            />
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
            {model?.paymentDetailInfomation?.currencyDTO?.code}
          </div>
        </div>
      ),
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 100,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record?.isTotal) {
          return null;
        }
        return (
          <LayoutCell className="text-break d-flex justify-content-end">
            <OneLineText
              value={formatNumberToCurrency(invoiceDetail?.taxCode)}
              useTooltip
              className="text-break"
            />
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
            {model?.paymentDetailInfomation?.currencyDTO?.code}
          </div>
        </div>
      ),
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 145,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="invoice-title_view"
                value={formatNumberToCurrency(
                  invoiceList?.reduce(
                    (total, item) =>
                      total + (item?.invoiceDetail?.taxAmount || 0),
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
            <OneLineText
              value={formatNumberToCurrency(invoiceDetail?.taxAmount)}
              useTooltip
            />
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
            {model?.paymentDetailInfomation?.currencyDTO?.code}
          </div>
        </div>
      ),
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 145,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="invoice-title_view"
                value={formatNumberToCurrency(
                  invoiceList?.reduce(
                    (total, item) =>
                      total + (item?.invoiceDetail?.totalAmount || 0),
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
            <OneLineText
              value={formatNumberToCurrency(invoiceDetail?.totalAmount)}
              useTooltip
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
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 160,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                className="invoice-title_view"
                value={formatNumberToCurrency(
                  invoiceList?.reduce(
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
            <OneLineText
              value={formatNumberToCurrency(record?.paymentAmount)}
              useTooltip
              className="text-break"
            />
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
            {model?.paymentDetailInfomation?.currencyDTO?.code}
          </div>
        </div>
      ),
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 145,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="invoice-title_view"
                useTooltip
                value={formatNumberToCurrency(
                  invoiceList?.reduce(
                    (total, item) =>
                      total + (item?.invoiceDetail?.totalAmount || 0),
                    0
                  ) -
                    invoiceList?.reduce(
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
            <OneLineText
              useTooltip
              value={formatNumberToCurrency(
                invoiceDetail?.totalAmount - record?.paymentAmount
              )}
            />
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
            {model?.paymentDetailInfomation?.currencyDTO?.code}
          </div>
        </div>
      ),
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 145,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="invoice-title_view"
                useTooltip
                value={formatNumberToCurrency(
                  invoiceList?.reduce(
                    (total, item) => total + (item?.invoiceDetail?.hold || 0),
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
              value={formatNumberToCurrency(invoiceDetail?.hold)}
            />
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
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 120,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText useTooltip value={invoiceDetail?.no} />
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
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 110,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText
              useTooltip
              value={formatDate(
                invoiceDetail?.date,
                STANDARD_DATE_FORMAT_SLASH
              )}
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
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 142,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText useTooltip value={invoiceDetail?.sellerTaxNum} />
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
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 200,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText value={invoiceDetail?.sellerName} useTooltip />
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
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 140,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText value={invoiceDetail?.sellerCode} useTooltip />
          </LayoutCell>
        );
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
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 90,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText value={invoiceDetail?.notation} useTooltip />
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
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 90,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText value={invoiceDetail?.formNo} useTooltip />
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
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 200,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record?.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText useTooltip value={invoiceDetail?.invoiceKind} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" && translate("PM.payment_warning")}
          </div>
        </div>
      ),
      dataIndex: "invoiceDetail",
      key: "invoiceDetail",
      width: 200,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record?.isTotal) {
          return null;
        }
        return (
          <LayoutCell>
            <OneLineText useTooltip value={invoiceDetail?.statusMessages} />
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
      key: "invoiceDetail",
      dataIndex: "invoiceDetail",
      ellipsis: true,
      width: 384,
      render: (invoiceDetail: InvoiceModel, record) => {
        if (record.isTotal) {
          return null;
        }
        // const fileAttached = initFileAttached(invoiceDetail);
        return (
          <div className="p-y--3xs p-x--2xs">
            <Row gutter={[8, 8]}>
              {invoiceDetail?.files?.map(
                (item: RequestAttachment, index: number) => {
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
                }
              )}
            </Row>
          </div>
        );
      },
    },
  ];
};

export default InvoicesTableColumnView;
