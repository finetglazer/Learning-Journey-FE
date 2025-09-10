import { ColumnProps } from "antd/lib/table";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { PurchasePlanRelativeModel } from "models/Acceptance/Acceptance";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAcceptanceInformationContext } from "../../AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";
import { TicketTypeNumber } from "models/Contract";
import { listRedirectTicketTypeNumber } from "pages/PurchasePage/constants";
import { isEqual } from "lodash";

const TABLE_ROW_KEY = "id";

enum ColumnKey {
  CODE = "code",
  TYPE = "ticketType",
  CREATOR = "createdBy",
  UNIT = "ogranizationName",
  CREATE_DATE = "createdDate",
  APPROVAL_DATE = "approveDate",
  NAME = "name",
}

const columnsWidth = {
  code: 130,
  type: 180,
  creator: 150,
  unit: 150,
  creation_date: 120,
  approval_date: 120,
};

export const RelatedDocument = () => {
  const [translate] = useTranslation();
  const { model } = useAcceptanceInformationContext();

  const data = useMemo(
    () => model?.ticketRelated?.purchasePlanRelateds,
    [model]
  );

  const getLinkFollowTicketType = ({
    ticketTypeNumber,
    id,
  }: {
    ticketTypeNumber: TicketTypeNumber;
    id: string;
  }) => {
    const router = listRedirectTicketTypeNumber.find((item) =>
      isEqual(item.id, ticketTypeNumber)
    )?.code;

    return `${router}/${id}`;
  };

  const columns: ColumnProps<PurchasePlanRelativeModel>[] = useMemo(
    () => [
      {
        title: translate("AC.txt_ticket_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        width: columnsWidth.code,
        render(value: string, record) {
          return (
            <LayoutCell>
              <Link
                to={getLinkFollowTicketType({
                  ticketTypeNumber: record?.ticketTypeNumber,
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
        width: columnsWidth.type,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_created_by"),
        key: ColumnKey.CREATOR,
        dataIndex: ColumnKey.CREATOR,
        width: columnsWidth.creator,
        render(value: string, record) {
          return (
            <LayoutCell>
              <OneLineText value={`${value} - ${record?.createdName}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_created_unit"),
        key: ColumnKey.UNIT,
        dataIndex: ColumnKey.UNIT,
        width: columnsWidth.unit,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_creation_date"),
        key: ColumnKey.CREATE_DATE,
        dataIndex: ColumnKey.CREATE_DATE,
        width: columnsWidth.creation_date,
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
        title: translate("AC.txt_approval_date"),
        key: ColumnKey.APPROVAL_DATE,
        dataIndex: ColumnKey.APPROVAL_DATE,
        width: columnsWidth.approval_date,
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
    <StandardTable
      rowKey={TABLE_ROW_KEY}
      columns={columns}
      dataSource={data}
      scroll={{ y: "calc(100vh - 387px)" }}
    />
  );
};
