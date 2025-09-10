import { Tooltip } from "antd";
import { TableProps } from "antd/lib";
import { STANDARD_DATE_FORMAT_SLASH, TABLE_ROW_KEY } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { isEqual } from "lodash";
import { RelatedSlipInfo } from "models/ContractAnnex";
import {
  combineText,
  relatedSlipListType,
} from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { useCallback, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

enum TableKey {
  CODE = "code",
  NAME = "name",
  TYPE = "typeName",
  CREATOR = "createUser",
  CREATED_DATE = "createdDate",
  APPROVAL_DATE = "approvedDate",
}

enum ColumnWidths {
  CODE = 200,
  TYPE = 200,
  CREATOR = 200,
  CREATED_DATE = 120,
  APPROVAL_DATE = 120,
}

interface TermsProps {
  data: RelatedSlipInfo[];
}

export const Terms = ({ data }: TermsProps) => {
  const [translate] = useTranslation();

  const getLinkFollowTicketType = useCallback(
    ({ type, id }: RelatedSlipInfo) => {
      const router = relatedSlipListType.find((item) =>
        isEqual(item?.id, type)
      )?.url;

      return `${router}/${id}`;
    },
    []
  );

  const columns: TableProps["columns"] = useMemo(() => {
    return [
      // Code
      {
        title: translate("CA.table_grounds_code"),
        key: TableKey.CODE,
        dataIndex: TableKey.CODE,
        width: ColumnWidths.CODE,
        render: (code: string, item: RelatedSlipInfo) => {
          return (
            <LayoutCell>
              <Link
                to={getLinkFollowTicketType(item)}
                className="hyperlink"
                target="_blank"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <OneLineText className="text-table-link" value={code} />
              </Link>
            </LayoutCell>
          );
        },
      },
      //   Name
      {
        title: translate("CA.table_grounds_name"),
        key: TableKey.NAME,
        dataIndex: TableKey.NAME,
        render: (name: string) => {
          return (
            <LayoutCell>
              <OneLineText value={name} useTooltip />
            </LayoutCell>
          );
        },
      },
      //   Type
      {
        title: translate("CA.table_grounds_type"),
        key: TableKey.TYPE,
        dataIndex: TableKey.TYPE,
        width: ColumnWidths.TYPE,
        render: (type: string) => {
          return (
            <LayoutCell>
              <OneLineText useTooltip={false} value={type} />
            </LayoutCell>
          );
        },
      },
      //   Creator
      {
        title: translate("CA.table_grounds_created_by"),
        key: TableKey.CREATOR,
        dataIndex: TableKey.CREATOR,
        width: ColumnWidths.CREATOR,
        render: (
          noUse: unknown,
          { createUser, createFullname }: RelatedSlipInfo
        ) => {
          return (
            <LayoutCell>
              <Tooltip
                title={combineText(createUser, createFullname)}
                placement="topLeft"
              >
                <span
                  className={`${styles["normal-text"]} ${styles["one-line-text"]}`}
                >
                  {createUser}
                </span>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      //   Created date
      {
        title: translate("CA.table_grounds_created_date"),
        key: TableKey.CREATED_DATE,
        dataIndex: TableKey.CREATED_DATE,
        width: ColumnWidths.CREATED_DATE,
        render: (createdDate: string) => {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  createdDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      //   Approval date
      {
        title: translate("CA.table_grounds_approval_date"),
        key: TableKey.APPROVAL_DATE,
        dataIndex: TableKey.APPROVAL_DATE,
        width: ColumnWidths.APPROVAL_DATE,
        render: (approvalDate: string) => {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  approvalDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
    ];
  }, [getLinkFollowTicketType, translate]);

  return (
    <>
      <StandardTable
        tableLayout="fixed"
        rowKey={TABLE_ROW_KEY}
        columns={columns}
        dataSource={data}
      />
    </>
  );
};
