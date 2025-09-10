import { ColumnProps } from "antd/lib/table";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import React, { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { Link } from "react-router-dom";
import { TicketTypeNumber } from "models/Contract";
import { isEmpty, isEqual, size } from "lodash";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { listRedirectTicketTypeNumber } from "models/Settlement/SettlementConstant";
import { RelatedSlipsModel } from "models/Settlement";
import { Tooltip } from "antd";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { emptyCloudIcon } from "assets/icons";

const TABLE_ROW_KEY = "id";

enum ColumnKey {
  CODE = "code", // Mã phiếu
  TYPE = "type", // Loại phiếu
  NAME = "name", // Tên phiếu
  CREATOR = "creator", // Người tạo
  CREATE_DATE = "createdDate", // Ngày tạo
}

export const RelatedDocument = () => {
  const { model, translate } = useContext(SettlementHookContext);
  const relatedSlips = model?.contactOrderInfo?.relatedSlips || [];

  const getLinkFollowTicketType = ({
    ticketTypeNumber,
    id,
  }: {
    ticketTypeNumber: TicketTypeNumber;
    id: string;
  }) => {
    const router = listRedirectTicketTypeNumber.find((item) =>
      isEqual(item.id, ticketTypeNumber)
    )?.url;
    return `${router}/${id}`;
  };

  const columns: ColumnProps<RelatedSlipsModel>[] = useMemo(
    () => [
      {
        title: translate("AC.txt_ticket_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        width: 130,
        render(value: string, record) {
          return (
            <LayoutCell>
              <Link
                to={getLinkFollowTicketType({
                  ticketTypeNumber: record?.type,
                  id: record?.id,
                })}
                className="hyperlink"
                target="_blank"
              >
                {value}
              </Link>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_ticket_type"),
        key: ColumnKey.TYPE,
        dataIndex: ColumnKey.TYPE,
        width: 180,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.typeName} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_created_by"),
        key: ColumnKey.CREATOR,
        dataIndex: ColumnKey.CREATOR,
        width: 150,
        render(creator) {
          return (
            <LayoutCell>
              <Tooltip
                placement="top"
                title={`${creator?.email} - ${creator?.name}`}
              >
                <div className="d-flex text-truncate">
                  <span className="value text-truncate">{creator?.email}</span>
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_creation_date"),
        key: ColumnKey.CREATE_DATE,
        dataIndex: ColumnKey.CREATE_DATE,
        width: 120,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(value, STANDARD_DATE_FORMAT_SLASH)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_ticket_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        width: 706,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <div>
      {isEmpty(relatedSlips) || size(relatedSlips) === 0 ? (
        <EmptyItemTable
          icon={<img width={140} src={emptyCloudIcon} alt="" />}
          content={translate("PM.payment_empty_list_expense_reversal_title")}
          containerClassName="p-4 gap-2"
        />
      ) : (
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          columns={columns}
          dataSource={relatedSlips}
          idContainer={"related-document-table"}
          scroll={{ y: "calc(100vh - 387px)" }}
        />
      )}
    </div>
  );
};
