/* eslint-disable import/no-unresolved */
import { ColumnProps } from "antd/lib/table";
import { emptyCloudIcon } from "assets/icons";
import classNames from "classnames";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { RequestAttachment } from "models/CostOwner/BudgetPlan";
import { getIcon } from "pages/PaymentPage/PaymentCreate/Helper/Helper";
import React, { useCallback } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import "./IntegrateECM.scss";

export interface Documents {
  systemFileId: string;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

export interface PaymentIntegrateECM {
  paymentRequestId: string;
  code: string;
  type: string;
  documentType: string;
  documentNames: Documents[];
  documentTitle: string;
  ecmId: string;
  errorDescription: string;
  isAllowPushECM: boolean;
}

interface Props {
  handleDownloadFileAttached: (file?: FileModel) => void;
  listECM: PaymentIntegrateECM[];
  handlePushIntegrateECM: () => void;
}

const IntegrateECM = ({
  handleDownloadFileAttached,
  listECM,
  handlePushIntegrateECM,
}: Props) => {
  const [translate] = useTranslation();

  const renderIcon = useCallback((item: RequestAttachment) => {
    return (
      <div>
        <img src={getIcon(item)} alt="icon" width={24} height={24} />
      </div>
    );
  }, []);

  const columns: ColumnProps<PaymentIntegrateECM>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">{translate("CM.ticket_code")}</div>
        ),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: 160,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">{translate("CM.ticket_type")}</div>
        ),
        key: "type",
        dataIndex: "type",
        ellipsis: true,
        width: 160,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">{translate("CM.document_type")}</div>
        ),
        key: "documentType",
        dataIndex: "documentType",
        ellipsis: true,
        width: 160,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">{translate("CM.document_name")}</div>
        ),
        key: "documentNames",
        dataIndex: "documentNames",
        ellipsis: true,
        width: 384,
        render: (_, record) => (
          <div className="payment-custom_grid_12 gap-1">
            {record?.documentNames?.map(
              (item: RequestAttachment, index: number) => {
                return (
                  <UploadFile.FileLoadedContent
                    key={index}
                    file={{ ...item, id: index }}
                    isViewMode={true}
                    className={classNames(
                      "file-loaded-item w-100 payment-custom_grid_9-col_6",
                      {
                        "file-loaded-item-4": true,
                      }
                    )}
                    icon={renderIcon(item)}
                    onClickFile={() => handleDownloadFileAttached(item)}
                  />
                );
              }
            )}
          </div>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("CM.document_title_ecm")}
          </div>
        ),
        key: "documentTitle",
        dataIndex: "documentTitle",
        ellipsis: true,
        width: 180,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">{translate("CM.id_ecm")}</div>
        ),
        key: "ecmId",
        dataIndex: "ecmId",
        ellipsis: true,
        width: 246,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("CM.describe_error_ecm")}
          </div>
        ),
        key: "errorDescription",
        dataIndex: "errorDescription",
        ellipsis: true,
        width: 160,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, listECM]
  );

  return (
    <div className="integrate-ecm-tab">
      <div className="d-flex justify-content-between align-items-center m-b--xs">
        <div className="fs-6 fw-semibold">
          {translate("CM.title_integrate_ecm")}
        </div>
        {listECM?.[0]?.isAllowPushECM && (
          <div>
            <Button type="secondary" onClick={handlePushIntegrateECM}>
              {translate("CM.btn_push_ecm")}
            </Button>
          </div>
        )}
      </div>
      {!listECM || listECM?.length === 0 ? (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate("CM.empty.no_data_recorded")}
        />
      ) : (
        <StandardTable
          rowKey={"paymentRequestId"}
          columns={columns}
          dataSource={listECM}
          scroll={{ y: 500 }}
          isDragable={true}
          rowClassName="integrate-erp"
        />
      )}
    </div>
  );
};

export default IntegrateECM;
