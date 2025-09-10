import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { ColumnProps } from "antd/lib/table";

import { STANDARD_DATE_FORMAT_SLASH, TABLE_ROW_KEY } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";

import { TicketReceipt } from "models/Contract";
import { useTicketsReceiveGoodsTableHook } from "./TicketsReceiveGoodsTableHook";
import { listTicketsReceiveGoodsStatus } from "pages/PurchasePage/ContractPage/constants";

enum ColumnKey {
  RECEIPT_CODE = "receiptCode",
  RECEIVER = "receiver",
  CREATED_DATE = "createdDate",
  ACTUAL_RECEIPT_DATE = "actualReceiptedDate",
  STATUS = "status",
}

const columnsWidth = {
  status: 140,
};

const TicketsReceiveGoodsTable = () => {
  const { translate, ticketsReceiveGoodsList, viewRelatedTicket } =
    useTicketsReceiveGoodsTableHook();

  const ticketsReceiveGoodsColumns: ColumnProps<TicketReceipt>[] = useMemo(
    () => [
      {
        title: translate("CT.ticket_code"),
        key: ColumnKey.RECEIPT_CODE,
        dataIndex: ColumnKey.RECEIPT_CODE,
        ellipsis: true,
        render(_, rowData: TicketReceipt) {
          return (
            <LayoutCell>
              <div onClick={() => viewRelatedTicket(rowData)}>
                <OneLineText
                  className="text-table-content-primary"
                  value={rowData?.receiptCode}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.receiver"),
        key: ColumnKey.RECEIVER,
        dataIndex: ColumnKey.RECEIVER,
        ellipsis: true,
        render(_, rowData: TicketReceipt) {
          return (
            <LayoutCell>
              <OneLineText value={rowData?.receiver} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_plan.create_date"),
        key: ColumnKey.CREATED_DATE,
        dataIndex: ColumnKey.CREATED_DATE,
        ellipsis: true,
        render(_, rowData: TicketReceipt) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  rowData?.createdDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.real_receipt_date"),
        key: ColumnKey.ACTUAL_RECEIPT_DATE,
        dataIndex: ColumnKey.ACTUAL_RECEIPT_DATE,
        ellipsis: true,
        render(_, rowData: TicketReceipt) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  rowData?.actualReceiptedDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.txt_status"),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        ellipsis: true,
        width: columnsWidth.status,
        render(_, rowData: TicketReceipt) {
          const item = listTicketsReceiveGoodsStatus.find(
            (statusType) => statusType.id === rowData?.status
          );

          return (
            <LayoutCell>
              {item && (
                <Tag
                  size="md"
                  value={item?.name}
                  status={item?.code}
                  isShowDot={false}
                  isShowBorder
                />
              )}
            </LayoutCell>
          );
        },
      },
    ],
    [translate, viewRelatedTicket]
  );

  return (
    <StandardTable
      rowKey={TABLE_ROW_KEY}
      isDragable
      columns={ticketsReceiveGoodsColumns}
      dataSource={ticketsReceiveGoodsList}
      scroll={{ y: "calc(100vh - 640px)" }}
    />
  );
};

export default TicketsReceiveGoodsTable;
