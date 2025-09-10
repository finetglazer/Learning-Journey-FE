import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { ColumnProps } from "antd/lib/table";
import { Tooltip } from "antd";

import { STANDARD_DATE_FORMAT_SLASH, TABLE_ROW_KEY } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";

import { PurchasePlanRelated } from "models/Contract";
import { useRelatedTicketsTableHook } from "./RelatedTicketsTableHook";

enum ColumnKey {
  CODE = "code",
  TICKET_TYPE = "ticketType",
  CREATED_BY = "createdBy",
  CREATED_DATE = "createdDate",
  NAME = "name",
}

const columnsWidth = {
  code: 200,
  ticketType: 200,
  createdBy: 200,
  createdDate: 200,
};

const RelatedTicketsTable = () => {
  const { translate, relatedTicketsList, viewRelatedTicket } =
    useRelatedTicketsTableHook();

  const relatedTicketsColumns: ColumnProps<PurchasePlanRelated>[] = useMemo(
    () => [
      {
        title: translate("CT.ticket_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        ellipsis: true,
        width: columnsWidth.code,
        render(_, rowData: PurchasePlanRelated) {
          return (
            <LayoutCell>
              <div onClick={() => viewRelatedTicket(rowData)}>
                <OneLineText
                  className="text-table-content-primary"
                  value={rowData?.code}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.ticket_type"),
        key: ColumnKey.TICKET_TYPE,
        dataIndex: ColumnKey.TICKET_TYPE,
        ellipsis: true,
        width: columnsWidth.ticketType,
        render(_, rowData: PurchasePlanRelated) {
          return (
            <LayoutCell>
              <OneLineText value={rowData?.ticketType} />
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
        render(_, rowData: PurchasePlanRelated) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                placement="top"
                title={`${rowData?.createdBy} - ${rowData?.createdName}`}
              >
                <div className="text-in-table-cell">
                  <div className="text-ellipsis">{`${rowData?.createdBy}`}</div>
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_plan.create_date"),
        key: ColumnKey.CREATED_DATE,
        dataIndex: ColumnKey.CREATED_DATE,
        ellipsis: true,
        width: columnsWidth.createdDate,
        render(_, rowData: PurchasePlanRelated) {
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
        title: translate("CT.ticket_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        render(_, rowData: PurchasePlanRelated) {
          return (
            <LayoutCell>
              <OneLineText value={rowData?.name} />
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
      columns={relatedTicketsColumns}
      dataSource={relatedTicketsList}
      scroll={{ y: "calc(100vh - 640px)" }}
    />
  );
};

export default RelatedTicketsTable;
