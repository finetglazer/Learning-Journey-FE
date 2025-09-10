import { ColumnProps } from "antd/lib/table";
import classNames from "classnames";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import {
  ColumnKey,
  ContractDetailModel,
  TicketTypeNumber,
} from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { listRedirectTicketTypeNumber } from "pages/PurchasePage/constants";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./ShoppingPlanTable.scss";
export const getLinkFollowTicketType = (ticketTypeNumber: TicketTypeNumber) => {
  return listRedirectTicketTypeNumber.find((el) => el.id === ticketTypeNumber)
    ?.code;
};

const ShoppingPlanTable = () => {
  const [translate] = useTranslation();
  const [listDataShoppingPlan, setListDataShoppingPlan] = useState([]);

  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  useEffect(() => {
    if (model?.originalPurchasePlanId) {
      contractRepository
        .getRelateShoppingPlan(model?.originalPurchasePlanId)
        .subscribe((response) => {
          setListDataShoppingPlan(response);
        });
    }
  }, [model?.originalPurchasePlanId]);

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
          const linkFollowTicketTypeNumber = getLinkFollowTicketType(
            record?.ticketTypeNumber
          );

          const linkHaveId = `${linkFollowTicketTypeNumber}/${record?.id}`;
          return (
            <LayoutCell className="p-l--sm">
              <Link
                to={linkHaveId}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <OneLineText
                  useTooltip
                  className="fw-semibold text-blue"
                  value={item}
                />
              </Link>
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
        width: 486,
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
        width: 200,
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

  return (
    <StandardTable
      rowKey="code"
      isDragable
      dataSource={listDataShoppingPlan}
      columns={columns}
      scroll={{ y: "calc(100vh - 320px)" }}
      className="shopping_plan_table"
    />
  );
};

export default ShoppingPlanTable;
