import { ColumnProps } from "antd/lib/table";
import classNames from "classnames";
import { ColumnKey } from "models/Contract";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { ContractAdjustmentContext } from "pages/PurchasePage/ContractPage/ContractAdjustment/ContractAdjustmentDetail/ContractAdjustmentDetailHook";
import {
  ContractAdjustmentContextModel,
  listRedirectTicketTypePayment,
} from "models/ContractAdjustment";
import { size } from "lodash";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { emptyCloudIcon } from "assets/icons";
import styles from "./ShoppingPlanTable.module.scss";

const ShoppingPlanTable = () => {
  const [translate] = useTranslation();

  const getLinkFollowTicketType = (type: number) => {
    return listRedirectTicketTypePayment.find((el) => el.id === type)?.url;
  };
  const { model } = useContext<ContractAdjustmentContextModel>(
    ContractAdjustmentContext
  );

  const listDataShoppingPlan = model?.listDataShoppingPlan || [];
  const handleOpenTicket = (item: any) => {
    const linkFollowTicketTypeNumber = getLinkFollowTicketType(
      item?.ticketTypeNumber
    );

    const linkHaveId = `${linkFollowTicketTypeNumber}/${item?.id}`;
    window.open(linkHaveId, "_blank");
  };

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        title: (
          <div
            className={classNames("", {
              "p-l--lg": model?.isDetail,
            })}
          >
            {translate("CT.create_contract.table.ticket_id")}
          </div>
        ),
        ellipsis: true,
        width: 200,
        fixed: "left",
        dataIndex: ColumnKey.CODE,
        key: ColumnKey.CODE,
        render: (item, record) => {
          return (
            <LayoutCell className="p-l--sm">
              <div onClick={() => handleOpenTicket(record)}>
                <OneLineText
                  useTooltip
                  className={`${styles["text-blue"]} fw-semibold`}
                  value={item}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14 d-flex">
            {translate("CT.create_contract.table.ticket_name")}
          </div>
        ),
        width: 446,
        ellipsis: true,
        dataIndex: ColumnKey.NAME,
        key: ColumnKey.NAME,
        render: (item) => {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={item} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14 d-flex">
            {translate("CT.create_contract.table.ticket_type")}
          </div>
        ),
        ellipsis: true,
        width: 200,
        dataIndex: ColumnKey.TICKET_TYPE,
        key: ColumnKey.TICKET_TYPE,
        render: (item) => {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={item} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14 d-flex">
            {translate("CT.create_contract.table.created_person")}
          </div>
        ),
        ellipsis: true,
        width: 200,
        dataIndex: ColumnKey.CREATE_BY,
        key: ColumnKey.CREATE_BY,
        render: (item, record) => {
          return (
            <LayoutCell>
              <OneLineText
                useTooltip
                value={`${item} ${
                  record?.createdName ? `- ${record.createdName}` : ""
                }`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14 d-flex">
            {translate("CT.create_contract.table.created_date")}
          </div>
        ),
        ellipsis: true,
        width: 120,
        dataIndex: ColumnKey.CREATE_DATE,
        key: ColumnKey.CREATE_DATE,
        render: (item) => {
          const dateOnly = formatDate(item, STANDARD_DATE_FORMAT_SLASH);
          return (
            <LayoutCell>
              <OneLineText useTooltip value={dateOnly} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14 d-flex">
            {translate("CA.table_grounds_approval_date")}
          </div>
        ),
        ellipsis: true,
        width: 120,
        dataIndex: ColumnKey.CREATE_DATE,
        key: ColumnKey.CREATE_DATE,
        render: (item) => {
          const dateOnly = formatDate(item, STANDARD_DATE_FORMAT_SLASH);
          return (
            <LayoutCell>
              <OneLineText useTooltip value={dateOnly} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, model]
  );

  return size(listDataShoppingPlan) > 0 ? (
    <div className={styles["shopping_plan_table"]}>
      <StandardTable
        rowKey="id"
        isDragable
        idContainer={"shopping-plan-table"}
        dataSource={listDataShoppingPlan}
        columns={columns}
        scroll={{ y: "calc(100vh - 320px)" }}
      />
    </div>
  ) : (
    <EmptyItemTable
      icon={<img src={emptyCloudIcon} alt="" />}
      content={translate("CM.empty.no_data_recorded")}
    />
  );
};

export default ShoppingPlanTable;
