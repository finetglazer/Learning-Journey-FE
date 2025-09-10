import { Col, Collapse, Row, type CollapseProps } from "antd";
import { ColumnProps } from "antd/lib/table";
import { emptyIcon, IcArrowDown } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { RequestAttachment } from "models/CostOwner/BudgetPlan";
import { PaymentDetailModel, PurchasingDocumentsModel } from "models/Payment";
import { getIcon } from "pages/PaymentPage/PaymentCreate/Helper/Helper";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import React, { useCallback, useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { listRedirectTicketTypePayment } from "../../../PaymentCreate/Components/PurchasingDocumentsTable/PurchasingDocumentsTable";
import { Attachment } from "models/Attachment";
import { formatCurrency } from "core/helpers/number";
import styles from "./PurchasingDocumentsTable.module.scss";
import { isNil } from "lodash";

const PurchasingDocumentsTable = () => {
  const [translate] = useTranslation();
  const { model, handleDownloadFileAttached } = useContext<PaymentDetailModel>(
    PaymentDetailHookContext
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

  const renderIcon = useCallback((item: RequestAttachment) => {
    return (
      <div>
        <img src={getIcon(item)} alt="img" width={24} height={24} />
      </div>
    );
  }, []);
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
          <div className="d-flex payment-font-14 justify-content-end">
            {translate("PM.payment_table_voucher_total_amount_label")}
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

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="invoice-title">
          {translate("PM.payment_purchasing_title")}
        </div>
      ),
      children:
        model?.paymentDetailInfomation?.purchasingDocuments.length === 0 ? (
          <EmptyItemTable
            icon={<img src={emptyIcon} alt="" />}
            content={translate("PM.empty_data")}
          />
        ) : (
          <StandardTable
            rowKey={"id"}
            columns={columns}
            idContainer="payment-table-attached-purchasing-document"
            dataSource={model?.paymentDetailInfomation?.purchasingDocuments}
            className="payment-table"
            scroll={{ y: 400 }}
            isDragable={true}
            rowClassName="payment-row"
          />
        ),
    },
  ];

  return (
    <div className="payment">
      <Collapse
        items={items}
        ghost
        defaultActiveKey={["1", "2"]}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <div>
            <img
              src={IcArrowDown}
              className="invoice-transition"
              style={{ transform: isActive ? "rotate(180deg)" : "" }}
              alt=""
            />
          </div>
        )}
      />
    </div>
  );
};

export default PurchasingDocumentsTable;
