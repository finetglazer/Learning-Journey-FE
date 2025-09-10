import { LayoutCell, OneLineText, Tag } from "react-components-design-system";
import type { ColumnProps } from "antd/es/table";
import { useTranslation } from "react-i18next";
import {
  BusinessEntity,
  PaymentMethod,
  PaymentMethodType,
  PaymentRequestType,
  PaymentRequestTypeGroup,
  User,
} from "models/Report/CostItems";
import dayjs from "dayjs";
import { formatNumber } from "core/helpers/number";
import { Tooltip } from "antd";
import { listReportCostItemsEnum } from "config/const";
import { Link } from "react-router-dom";
import {
  ACCOUNTING_ENTRY_DETAIL_ROUTE,
  ADVANCE_DETAIL_ROUTE,
  DEPOSIT_DETAIL_ROUTE,
  EXPENSE_DETAIL_ROUTE,
  PAYMENT_REQUEST_DETAIL_ROUTE,
} from "config/route-const";
import styles from "pages/ReportPage/Payment/ReportPage.module.scss";
import { TYPE_OF_PROPOSAL } from "models/Payment/PaymentRequestConstant";

export function getPaymentRequestType(type: number): string {
  return PaymentRequestType[type as PaymentRequestTypeGroup];
}

export function getPaymentMethodDescription(type: number): string {
  return PaymentMethodType[type as PaymentMethod];
}

export function useColumns(): ColumnProps[] {
  const [translate] = useTranslation();

  const urlPayment = (paymentId: string, paymentRequestType: number) => {
    switch (paymentRequestType) {
      case TYPE_OF_PROPOSAL.PAYMENT:
        return `${PAYMENT_REQUEST_DETAIL_ROUTE}/${paymentId}`;
      case TYPE_OF_PROPOSAL.ADVANCE:
        return `${ADVANCE_DETAIL_ROUTE}/${paymentId}`;
      case TYPE_OF_PROPOSAL.EXPENSE:
        return `${EXPENSE_DETAIL_ROUTE}/${paymentId}`;
      case TYPE_OF_PROPOSAL.ACCOUNTING_ENTRY:
        return `${ACCOUNTING_ENTRY_DETAIL_ROUTE}/${paymentId}`;
      case TYPE_OF_PROPOSAL.DEPOSIT:
        return `${DEPOSIT_DETAIL_ROUTE}/${paymentId}`;
      default:
        return "";
    }
  };

  return [
    {
      title: translate("report.payment.cost_items.table.txt_branch_request"),
      width: 200,
      key: "businessBranch",
      dataIndex: "businessBranch",
      render(value: BusinessEntity) {
        return (
          <LayoutCell>
            <OneLineText value={value?.code + " - " + value?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.cost_items.table.txt_bank_block_request"
      ),
      key: "businessUnit",
      dataIndex: "businessUnit",
      width: 200,
      render(value: BusinessEntity) {
        return (
          <LayoutCell>
            <OneLineText value={value?.code + " - " + value?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_request_code"),
      width: 140,
      key: "code",
      dataIndex: "code",
      render(value: string, record) {
        return (
          <LayoutCell>
            <Link
              className="text-decoration-none"
              target="_blank"
              to={urlPayment(
                record.paymentRequestId,
                record.paymentRequestType
              )}
              rel="noopener noreferrer"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <OneLineText
                className={styles["text-table-content-primary"]}
                value={value}
              />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_creation_date"),
      width: 100,
      key: "createdDate",
      dataIndex: "createdDate",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={dayjs(value).format("DD/MM/YYYY")} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_request_type"),
      width: 100,
      key: "paymentRequestType",
      dataIndex: "paymentRequestType",
      render(value: number) {
        return (
          <LayoutCell>
            <OneLineText value={getPaymentRequestType(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_cost_type"),
      width: 130,
      key: "costType",
      dataIndex: "costType",
      render(value: BusinessEntity) {
        return (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${value?.code + " - " + value?.name}`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {value?.name}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_cost_item"),
      width: 160,
      key: "costGroup",
      dataIndex: "costGroup",
      render(value: BusinessEntity) {
        return (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${value?.code + " - " + value?.name}`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {value?.name}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_payment_method"),
      width: 190,
      key: "paymentMethod",
      dataIndex: "paymentMethod",
      render(value: number) {
        return (
          <LayoutCell>
            <OneLineText value={getPaymentMethodDescription(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_payment_content"),
      width: 154,
      key: "description",
      dataIndex: "description",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_currency_type"),
      width: 90,
      key: "currency",
      dataIndex: "currency",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_original_amount"),
      width: 200,
      key: "amount",
      dataIndex: "amount",
      align: "right",
      render(value: string) {
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_converted_amount"),
      width: 200,
      key: "exchangeAmount",
      dataIndex: "exchangeAmount",
      align: "right",
      render(value: string) {
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_requester"),
      width: 160,
      key: "createUser",
      dataIndex: "createUser",
      render(value: User) {
        return (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${value?.email} - ${value?.name}`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {value?.email}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_approver"),
      width: 160,
      key: "approveUser",
      dataIndex: "approveUser",
      render(value: User, record) {
        const isShow = record?.status !== 1;
        return (
          <LayoutCell>
            {isShow && (
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={`${value?.email} - ${value?.name}`}
              >
                <div className="d-inline-block text-in-table-cell text-truncate">
                  {value?.email}
                </div>
              </Tooltip>
            )}
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_status"),
      width: 126,
      key: "status",
      dataIndex: "status",
      render(id) {
        const item = listReportCostItemsEnum.find((type) => type.id === id);
        return (
          <LayoutCell>
            <Tag
              size="md"
              value={item?.name}
              status={item?.code}
              isShowDot={false}
              isShowBorder={true}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.cost_items.table.txt_final_ERP"),
      width: 114,
      key: "finalERPDate",
      dataIndex: "finalERPDate",
      render(value?: string) {
        return (
          <LayoutCell>
            {value && <OneLineText value={dayjs(value).format("DD/MM/YYYY")} />}
          </LayoutCell>
        );
      },
    },
  ];
}
