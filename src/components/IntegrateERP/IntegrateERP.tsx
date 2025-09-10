import { ColumnProps } from "antd/lib/table";
import { emptyCloudIcon, IcUpdate } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import dayjs from "dayjs";
import { STATUS_INTEGRATE, STATUS_INTEGRATE_ERP } from "models/Payment";
import React from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./IntegrateERP.scss";

export interface PaymentIntegrateERP {
  paymentRequestId: string;
  batchDocId: string;
  integrationId: string;
  invoiceNo: string;
  paymentNo: string;
  status: number;
  approveDateTime: string;
  approver: string;
  errorDescription: string;
  isAllowUpdate: boolean;
  isAllowPushERP: boolean;
}

interface Props {
  listERP: PaymentIntegrateERP[];
  handlePushIntegrateERP: () => void;
  handleGetListERP?: () => void;
}

const IntegrateERP = ({
  listERP,
  handlePushIntegrateERP,
  handleGetListERP,
}: Props) => {
  const [translate] = useTranslation();

  const renderStatus = (status: number) => {
    switch (status) {
      case STATUS_INTEGRATE.FINAL:
        return STATUS_INTEGRATE_ERP.FINAL;
      case STATUS_INTEGRATE.PENDING:
        return STATUS_INTEGRATE_ERP.PENDING;
      case STATUS_INTEGRATE.ERROR:
        return STATUS_INTEGRATE_ERP.ERROR;
      case STATUS_INTEGRATE.REJECT:
        return STATUS_INTEGRATE_ERP.REJECT;
      case STATUS_INTEGRATE.PROCESSING:
        return STATUS_INTEGRATE_ERP.PROCESSING;
      case STATUS_INTEGRATE.NOT_EXISTED:
        return STATUS_INTEGRATE_ERP.NOT_EXISTED;
      case STATUS_INTEGRATE.NULL:
        return STATUS_INTEGRATE_ERP.NULL;
      default:
        return "";
    }
  };

  const columns: ColumnProps<PaymentIntegrateERP>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">{translate("CM.batch_doc_id")}</div>
        ),
        key: "batchDocId",
        dataIndex: "batchDocId",
        ellipsis: true,
        width: 286,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("CM.txt_integrate_id")}
          </div>
        ),
        key: "integrationId",
        dataIndex: "integrationId",
        ellipsis: true,
        width: 120,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("CM.txt_invoice_number")}
          </div>
        ),
        key: "invoiceNo",
        dataIndex: "invoiceNo",
        ellipsis: true,
        width: 140,
        render: (text) => (
          <LayoutCell>
            <OneLineText value={text} useTooltip />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("CM.txt_payment_number")}
          </div>
        ),
        key: "paymentNo",
        dataIndex: "paymentNo",
        ellipsis: true,
        width: 120,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">{translate("CM.status_erp")}</div>
        ),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: 120,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={renderStatus(text)} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("CM.txt_last_approval_date")}
          </div>
        ),
        key: "approveDateTime",
        dataIndex: "approveDateTime",
        ellipsis: true,
        width: 132,
        render: (text) => (
          <LayoutCell>
            <OneLineText
              useTooltip
              value={text ? dayjs(text).format("DD/MM/YYYY") : ""}
            />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("CM.txt_last_approval_user")}
          </div>
        ),
        key: "approver",
        dataIndex: "approver",
        ellipsis: true,
        width: 132,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("CM.txt_describe_error_erp")}
          </div>
        ),
        key: "errorDescription",
        dataIndex: "errorDescription",
        ellipsis: true,
        width: 132,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
      {
        title: "",
        key: "action",
        dataIndex: "action",
        width: 40,
        fixed: "right",
        render: (_, record) =>
          record?.isAllowUpdate ? (
            <LayoutCell>
              <div
                className="payment-trash_icon cursor-pointer btn"
                onClick={() => handleGetListERP()}
              >
                <img src={IcUpdate} alt="icon_update" />
              </div>
            </LayoutCell>
          ) : null,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, listERP]
  );

  return (
    <div className="integrate-erp-tab">
      <div className="d-flex justify-content-between align-items-center m-b--xs">
        <div className="fs-6 fw-semibold">
          {translate("CM.title_integrate_erp")}
        </div>
        {listERP?.[0]?.isAllowPushERP && (
          <div>
            <Button type="secondary" onClick={handlePushIntegrateERP}>
              {translate("CM.btn_push_erp")}
            </Button>
          </div>
        )}
      </div>
      {!listERP || listERP?.length === 0 ? (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate("CM.empty.no_data_recorded")}
        />
      ) : (
        <StandardTable
          rowKey={"paymentRequestId"}
          columns={columns}
          dataSource={listERP}
          scroll={{ y: 500 }}
          isDragable={true}
          rowClassName="integrate-erp"
        />
      )}
    </div>
  );
};

export default IntegrateERP;
