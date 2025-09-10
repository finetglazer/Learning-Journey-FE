import { ColumnProps } from "antd/lib/table";
import { RequestAttachment } from "models/CostOwner/BudgetPlan";
import {
  PaymentCreateModel,
  PurchasingDocumentsModel,
  TicketTypePayment,
} from "models/Payment";
import React, { useCallback, useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { getIcon } from "../../Helper/Helper";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";
import { Col, Row } from "antd";
import { Attachment } from "models/Attachment";
import {
  ACCEPTANCE_DETAIL_ROUTE,
  CONTRACT_ORDER,
  CONTRACT_PRINCIPLE_VIEW_ROUTE,
  CONTRACT_ROUTE_VIEW,
  CONTRACT_TERMINATION_VIEW_ROUTE,
  PROJECT_SETTLEMENT_DETAIL_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
  SETTLEMENT_VIEW_ROUTE,
} from "config/route-const";
import { formatCurrency } from "core/helpers/number";
import { useTranslation } from "react-i18next";
import styles from "./PurchasingDocumentsTable.module.scss";
import { isNil } from "lodash";

export const listRedirectTicketTypePayment = [
  {
    id: TicketTypePayment.PurchasePlan,
    url: PURCHASING_PLAN_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.PurchaseProposal,
    url: PROPOSAL_DETAIL_ROUTE,
  },
  {
    id: TicketTypePayment.PurchaseRequest,
    url: PURCHASE_REQUEST_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.ContractPrinciple,
    url: CONTRACT_PRINCIPLE_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.ContractSettlement,
    url: SETTLEMENT_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.Liquidation,
    url: CONTRACT_TERMINATION_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.Acceptance,
    url: ACCEPTANCE_DETAIL_ROUTE,
  },
  {
    id: TicketTypePayment.ProjectSettlement,
    url: PROJECT_SETTLEMENT_DETAIL_ROUTE,
  },
  {
    id: TicketTypePayment.ContractLiquidation,
    url: CONTRACT_TERMINATION_VIEW_ROUTE,
  },
  {
    id: TicketTypePayment.GoodsReceiptRequest,
    url: RECEIVING_GOODS_DETAIL_ROUTE,
  },
  {
    id: TicketTypePayment.Contract,
    url: CONTRACT_ROUTE_VIEW,
  },
  {
    id: TicketTypePayment.Order,
    url: CONTRACT_ORDER,
  },
];

const PurchasingDocumentsTable = () => {
  const [translate] = useTranslation();
  const { model, handleDownloadFileAttached } = useContext<PaymentCreateModel>(
    PaymentCreateHookContext
  );
  const getLinkFollowTicketType = (type: number) => {
    return listRedirectTicketTypePayment.find((el) => el.id === type)?.url;
  };
  const openLinkInNewTab = (record: PurchasingDocumentsModel) => {
    const path = getLinkFollowTicketType(record?.type);
    if (!path) return;
    const url = `${window.location.origin}${path}/${record?.id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const renderIcon = useCallback(
    (item: RequestAttachment) => {
      return (
        <div>
          <img src={getIcon(item)} alt="img" width={20} height={20} />
        </div>
      );
    },
    [model?.listPuchasingDocument]
  );
  const columns: ColumnProps<PurchasingDocumentsModel>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="d-flex payment-font-14">
            {translate("PM.payment_table_type_of_voucher_label")}
          </div>
        ),
        key: "typeName",
        dataIndex: "typeName",
        ellipsis: true,
        width: 150,
        render: (text) => (
          <LayoutCell>
            <OneLineText value={text} useTooltip={true} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="d-flex payment-font-14">
            {translate("PM.payment_table_voucher_code_label")}
          </div>
        ),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: 165,
        render: (text, record) => (
          <LayoutCell className="payment-cell_blue fw-semibold">
            <div
              onClick={() => openLinkInNewTab(record)}
              className="cursor-pointer"
            >
              <OneLineText
                value={text}
                useTooltip={true}
                className="payment-cell_blue"
              />
            </div>
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="d-flex payment-font-14">
            {translate("PM.payment_table_voucher_content_label")}
          </div>
        ),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: 179,
        render: (text) => (
          <LayoutCell className={styles["custom_cell"]}>
            <OneLineText value={text} useTooltip={true} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div>
            <div className="payment-font-14">
              {translate("PM.payment_table_voucher_total_amount_label")}
            </div>
          </div>
        ),
        key: "amount",
        dataIndex: "amount",
        ellipsis: true,
        align: "right",
        width: 145,
        render: (text, record) => (
          <LayoutCell className="justify-content-end">
            <OneLineText
              value={
                !isNil(text)
                  ? formatCurrency({
                      value: text,
                      shouldRoundTwoNumber: false,
                      code: record?.currency,
                    })
                  : ""
              }
              useTooltip={true}
            />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div>
            <div className="payment-font-14">
              {translate("PM.label_type_money")}
            </div>
          </div>
        ),
        key: "currency",
        dataIndex: "currency",
        ellipsis: true,
        width: 91,
        render: (text) => (
          <LayoutCell>
            <OneLineText value={text} useTooltip={true} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="d-flex payment-font-14">
            {translate("PM.payment_table_voucher_attached_label")}
          </div>
        ),
        key: "attachments",
        dataIndex: "attachments",
        ellipsis: true,
        width: 572,
        render: (attachments: Attachment) => (
          <div className={styles["minHeight"]}>
            <Row gutter={[8, 8]} className="w-100">
              {attachments?.map((item: RequestAttachment, index: number) => {
                return (
                  <Col span={8} key={item?.systemFileId}>
                    <UploadFile.FileLoadedContent
                      className={`${styles["custom_file"]}`}
                      key={index}
                      file={{ ...item, id: index }}
                      isViewMode={true}
                      icon={renderIcon(item)}
                      onClickFile={() => handleDownloadFileAttached(item)}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
        ),
      },
    ],
    [model, translate]
  );
  return (
    <div className="payment pb-1">
      <StandardTable
        idContainer="purchasing-document-table"
        isDragable
        rowKey={"id"}
        columns={columns}
        dataSource={model?.listPuchasingDocument}
        className="payment-table payment-custom_table"
        scroll={{ x: "max-content", y: "calc(100vh - 320px)" }}
        rowClassName="payment-row"
      />
    </div>
  );
};

export default PurchasingDocumentsTable;
