import { ColumnProps } from "antd/lib/table";
import { emptyIcon, IcArrowDown } from "assets/icons";
import classNames from "classnames";
import dayjs from "dayjs";
import { RequestAttachment } from "models/CostOwner/BudgetPlan";
import { PaymentDetailModel, PurchasingDocumentsModel } from "models/Payment";
import { getIcon } from "pages/PaymentPage/PaymentCreate/Helper/Helper";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line import/named
import { Collapse, CollapseProps } from "antd";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";

const AttachDocumentTable = () => {
  const [translate] = useTranslation();
  const { model, handleDownloadFileAttached } = useContext<PaymentDetailModel>(
    PaymentDetailHookContext
  );

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
          <div className="payment-font-14">
            {translate("PM.payment_table_attached_document_type_label")}
          </div>
        ),
        key: "documentType",
        dataIndex: "documentType",
        ellipsis: true,
        width: 150,
        render: (text) => <LayoutCell>{text?.name}</LayoutCell>,
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("PM.payment_table_voucher_attached_label")}
          </div>
        ),
        key: "requestDocuments",
        dataIndex: "requestDocuments",
        ellipsis: true,
        width: 572,
        render: (_, record) => (
          <div className="payment-custom_grid_9 py-1 px-2">
            {record?.requestDocuments?.map((item: any, index: number) => {
              return (
                <UploadFile.FileLoadedContent
                  key={index}
                  file={{ ...item, id: index }}
                  isViewMode={true}
                  className={classNames(
                    "file-loaded-item w-100 position-relative payment-custom_grid_9-col_3",
                    {
                      "file-loaded-item-4": true,
                    }
                  )}
                  icon={renderIcon(item)}
                  onClickFile={() => handleDownloadFileAttached(item)}
                />
              );
            })}
          </div>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("PM.payment_table_attached_document_des_label")}
          </div>
        ),
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        width: 580,
        render: (text) => (
          <LayoutCell>
            <OneLineText value={text} useTooltip />
          </LayoutCell>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  );

  const [listAttachDocument, setListAttachDocument] = useState([]);

  useEffect(() => {
    if (model?.paymentDetailInfomation?.documentGroups.length > 0) {
      const dataTable = model?.paymentDetailInfomation?.documentGroups?.map(
        (item: any) => {
          return {
            id: dayjs(new Date()).valueOf(),
            ...item,
          };
        }
      );
      setListAttachDocument(dataTable);
    } else {
      setListAttachDocument([]);
    }
  }, [model?.paymentDetailInfomation?.documentGroups]);

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="invoice-title">
          {translate("PM.payment_table_attached_document_reference_title")}
        </div>
      ),
      children:
        listAttachDocument.length === 0 ? (
          <EmptyItemTable
            icon={<img src={emptyIcon} alt="" />}
            content={translate("PM.empty_data")}
          />
        ) : (
          <StandardTable
            rowKey={"id"}
            columns={columns}
            dataSource={listAttachDocument}
            className="payment-table"
            idContainer="payment-table-attached-document"
            scroll={{ y: 500 }}
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

export default AttachDocumentTable;
