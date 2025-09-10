import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import {
  ACCOUNTING_ENTRY_DETAIL_ROUTE,
  ADVANCE_DETAIL_ROUTE,
  DEPOSIT_DETAIL_ROUTE,
  EXPENSE_DETAIL_ROUTE,
  PAYMENT_REQUEST_DETAIL_ROUTE,
} from "config/route-const";
import { addNumbers, formatNumber } from "core/helpers/number";
import { isEmpty } from "lodash";
import { ContractDetailModel, PaymentTrackings } from "models/Contract";
import { TYPE_OF_PROPOSAL } from "models/Payment";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import React, { useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { getNameByERPStatus, getNameByRequestStatus } from "./helper";
import "./PaymentTrackingsTablet.scss";
import { toFixedNumber } from "core/helpers/calculator";

const PaymentTrackingsTablet = () => {
  const [translate] = useTranslation();

  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const columns: ColumnProps<PaymentTrackings>[] = React.useMemo(
    () => [
      {
        title: translate("CT.payment_trackings.ticket_code"),
        key: "code",
        dataIndex: "code",
        width: 140,
        ellipsis: true,
        render: (_, record) => {
          return (
            <div
              onClick={() => handleDirectToEditPage(record)}
              className="cursor-pointer"
            >
              <LayoutCell>
                <OneLineText className="text-blue" value={record?.code} />
              </LayoutCell>
            </div>
          );
        },
      },
      {
        title: translate("CT.payment_trackings.requester"),
        key: "createUser",
        dataIndex: "createUser",
        width: 200,
        render: (_, record) => {
          return (
            <LayoutCell>
              <Tooltip
                title={`${record?.createUser} - ${
                  record?.createUserName || ""
                }`}
              >
                <span className="text-truncate">{record?.createUser} </span>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.payment_trackings.description"),
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        width: 200,
        render: (description) => {
          return (
            <LayoutCell>
              <OneLineText value={description} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.payment_trackings.requested_amount"),
        key: "requestAmount",
        dataIndex: "requestAmount",
        ellipsis: true,
        width: 145,
        align: "right",
        render: (_, record) => {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(record?.requestAmount)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.payment_trackings.paid_amount"),
        key: "paidAmount",
        dataIndex: "paidAmount",
        ellipsis: true,
        width: 160,
        align: "right",
        render: (_, record) => {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(record?.paidAmount)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.payment_trackings.currency"),
        key: "currency",
        dataIndex: "currency",
        ellipsis: true,
        width: 160,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(record?.currency?.code)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.payment_trackings.status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: 140,
        render: (status) => {
          return (
            <LayoutCell>
              <Tag
                status={getNameByRequestStatus(status)?.status}
                value={getNameByRequestStatus(status)?.title}
                isShowDot={false}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.payment_trackings.erp_status"),
        key: "erpStatus",
        dataIndex: "erpStatus",
        ellipsis: true,
        render: (erpStatus) => {
          return (
            <LayoutCell>
              <OneLineText value={getNameByERPStatus(erpStatus)} />
            </LayoutCell>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  );

  const totalPaidAmount = model?.paymentTrackings?.reduce(
    (acc, cur) => addNumbers(acc + cur.paidAmount),
    0
  );
  const totalRequestAmount = model?.paymentTrackings?.reduce(
    (acc, cur) => addNumbers(acc + cur.requestAmount),
    0
  );

  const handleDirectToEditPage = (item: PaymentTrackings) => {
    const { type, paymentId } = item || {};
    const routes = {
      [TYPE_OF_PROPOSAL.PAYMENT]: PAYMENT_REQUEST_DETAIL_ROUTE,
      [TYPE_OF_PROPOSAL.ADVANCE]: ADVANCE_DETAIL_ROUTE,
      [TYPE_OF_PROPOSAL.EXPENSE]: EXPENSE_DETAIL_ROUTE,
      [TYPE_OF_PROPOSAL.ACCOUNTING_ENTRY]: ACCOUNTING_ENTRY_DETAIL_ROUTE,
      [TYPE_OF_PROPOSAL.DEPOSIT]: DEPOSIT_DETAIL_ROUTE,
    };
    const route = routes[type];
    if (route) {
      window.open(`${route}/${paymentId}`, "_blank");
    }
  };

  const renderFooter = () => {
    return (
      <div className="footer-table">
        <div className="footer-table__item">
          <div className="label fw-bold">
            {translate("CT.payment_trackings.total_paid_value")}
          </div>
          <div className="requested_amount fw-bold">
            {formatNumber(toFixedNumber(totalRequestAmount, 4))}
          </div>
          <div className="paid_amount fw-bold">
            {formatNumber(totalPaidAmount)}
          </div>
        </div>
        <div className="footer-table__item">
          <div className="label fw-bold">
            {translate("CT.payment_trackings.total_contract_value")}
          </div>
          <div className="requested_amount fw-bold"></div>
          <div className="paid_amount fw-bold">
            {formatNumber(model?.totalAmountContractGoodsServicesList)}
          </div>
        </div>
        <div className="footer-table__item">
          <div className="label fw-bold">
            {translate("CT.payment_trackings.remaining_value")}
          </div>
          <div className="requested_amount fw-bold"></div>
          <div className="paid_amount fw-bold">
            {formatNumber(
              addNumbers(
                model?.totalAmountContractGoodsServicesList,
                -totalPaidAmount
              )
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="payment_trackings_tablet">
      <div className="title">{translate("CT.txt_payment_trackings")}</div>
      <StandardTable
        rowKey={"id"}
        columns={columns}
        rowSelection={null}
        dataSource={model?.paymentTrackings}
        isDragable={true}
        idContainer="table-id"
        rowClassName="cost-allocation-row"
        scroll={{ y: "calc(100vh - 320px)" }}
        footer={isEmpty(model?.paymentTrackings) ? null : renderFooter}
      />
    </div>
  );
};

export default PaymentTrackingsTablet;
