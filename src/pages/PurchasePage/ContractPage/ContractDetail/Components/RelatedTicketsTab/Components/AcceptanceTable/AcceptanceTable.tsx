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

import { TicketAcceptance } from "models/Contract";
import { useAcceptanceTableHook } from "./AcceptanceTableHook";
import { listTicketsAcceptanceStatus } from "pages/PurchasePage/ContractPage/constants";

enum ColumnKey {
  ACCEPTANCE_CODE = "acceptanceCode",
  CREATED_BY = "createdBy",
  ORGANIZATION_NAME = "organizationName",
  APPROVED_DATE = "approvedDate",
  DESCRIPTION = "description",
  STATUS = "status",
}

const columnsWidth = {
  acceptanceCode: 140,
  createdBy: 200,
  organizationName: 200,
  approvedDate: 200,
  status: 140,
};

const AcceptanceTable = () => {
  const { translate, acceptanceList, viewAcceptanceTicket } =
    useAcceptanceTableHook();

  const acceptanceColumns: ColumnProps<TicketAcceptance>[] = useMemo(
    () => [
      {
        title: translate("CT.ticket_code"),
        key: ColumnKey.ACCEPTANCE_CODE,
        dataIndex: ColumnKey.ACCEPTANCE_CODE,
        ellipsis: true,
        width: columnsWidth.acceptanceCode,
        render(_, rowData: TicketAcceptance) {
          return (
            <LayoutCell>
              <div onClick={() => viewAcceptanceTicket(rowData)}>
                <OneLineText
                  className="text-table-content-primary"
                  value={rowData?.acceptanceCode}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.label_create_user"),
        key: ColumnKey.CREATED_BY,
        dataIndex: ColumnKey.CREATED_BY,
        ellipsis: true,
        width: columnsWidth.createdBy,
        render(_, rowData: TicketAcceptance) {
          return (
            <LayoutCell>
              <OneLineText value={rowData?.createdBy} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.label_create_unit"),
        key: ColumnKey.ORGANIZATION_NAME,
        dataIndex: ColumnKey.ORGANIZATION_NAME,
        ellipsis: true,
        width: columnsWidth.organizationName,
        render(_, rowData: TicketAcceptance) {
          return (
            <LayoutCell>
              <OneLineText value={rowData?.organizationName} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.approved_date"),
        key: ColumnKey.APPROVED_DATE,
        dataIndex: ColumnKey.APPROVED_DATE,
        ellipsis: true,
        width: columnsWidth.approvedDate,
        render(_, rowData: TicketAcceptance) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  rowData?.approvedDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.acceptance_description"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
        ellipsis: true,
        render(_, rowData: TicketAcceptance) {
          return (
            <LayoutCell>
              <OneLineText value={rowData?.description} />
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
        render(_, rowData: TicketAcceptance) {
          const item = listTicketsAcceptanceStatus.find(
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
    [translate, viewAcceptanceTicket]
  );

  return (
    <StandardTable
      rowKey={TABLE_ROW_KEY}
      isDragable
      columns={acceptanceColumns}
      dataSource={acceptanceList}
      scroll={{ y: "calc(100vh - 640px)" }}
    />
  );
};

export default AcceptanceTable;
