import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import dayjs from "dayjs";
import { PurchasingPlanModel, Quotation } from "models/PurchasingPlan";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import React, { Dispatch, SetStateAction, useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import "./SupplierQuoteTable.scss";
import { formatNumber } from "core/helpers/number";
import { VND_CURRENCY } from "models/Payment";
import { VIETNAMESE_TIME_ZONE_OFFSET } from "core/config/consts";

interface Props {
  quotationRound: Quotation[];
  setOpenDrawerSendEmail: Dispatch<SetStateAction<boolean>>;
}

const SupplierQuoteTable = ({
  quotationRound,
  setOpenDrawerSendEmail,
}: Props) => {
  const { translate, model, handleClickDrawerQuote } =
    useContext<PurchasingPlanModel>(PurchasingPlanDetailHookContext);

  const handleClickSupplierDrawer = (record: Quotation) => {
    handleClickDrawerQuote(record?.quotationId, true);
    setOpenDrawerSendEmail(false);
  };

  const columns: ColumnProps<Quotation>[] = React.useMemo(
    () => {
      const isShowCurrency = quotationRound?.[0]?.currency !== VND_CURRENCY;

      const arrayColumn: ColumnProps<Quotation>[] = [
        {
          title: () => (
            <div className="p-b--xs">
              <label>{translate("PL.purchasing_plan_quote_code")}</label>
            </div>
          ),
          key: "code",
          dataIndex: "code",
          ellipsis: true,
          width: 240,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <Tooltip
                  placement="topLeft"
                  className="w-100"
                  title={<div>{record?.code}</div>}
                >
                  <div
                    onClick={() => handleClickSupplierDrawer(record)}
                    className="table__cell-blue fw-semibold cursor-pointer text-truncate"
                  >
                    {record?.code}
                  </div>
                </Tooltip>
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div className="p-b--xs">
              <label>
                {translate("PL.purchasing_plan_quotation_validity")}
              </label>
            </div>
          ),
          key: "effectivePeriod",
          dataIndex: "effectivePeriod",
          width: 160,
          ellipsis: true,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText
                  value={dayjs(record?.effectivePeriod)
                    .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
                    .format("DD/MM/YYYY")}
                />
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div className="p-b--xs">
              <label>{translate("PL.purchasing_plan_time_sent")}</label>
            </div>
          ),
          key: "submissionPeriod",
          dataIndex: "submissionPeriod",
          width: 160,
          ellipsis: true,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText
                  value={dayjs(record?.submissionPeriod)
                    .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
                    .format("DD/MM/YYYY hh:mm:ss")}
                />
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div className="p-b--xs">
              <label>{translate("PL.purchasing_plan_amount")}</label>
            </div>
          ),
          key: "totalAmount",
          dataIndex: "totalAmount",
          width: 200,
          ellipsis: true,
          align: "right",
          render: (_text_, record) => {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(record?.totalAmount)} />
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div className="p-b--xs">
              <label>{translate("PL.purchasing_plan_currency")}</label>
            </div>
          ),
          key: "currency",
          dataIndex: "currency",
          ellipsis: true,
          width: 140,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText value={record?.currency} />
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div className="p-b--xs">
              <label>
                {isShowCurrency
                  ? translate("PL.purchasing_plan_reference_rate")
                  : ""}
              </label>
            </div>
          ),
          key: "exchangeRate",
          dataIndex: "exchangeRate",
          width: 160,
          ellipsis: true,
          align: "right",
          render: (_text_, record) => {
            if (isShowCurrency) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={formatNumber(record?.exchangeRate)} />
                </LayoutCell>
              );
            }
            return null;
          },
        },
        {
          title: () =>
            isShowCurrency ? (
              <UnitTitle
                title={translate("PL.purchasing_plan_total_exchange_rate")}
                unit={"VND"}
              />
            ) : (
              ""
            ),
          key: "totalConvertedAmount",
          dataIndex: "totalConvertedAmount",
          ellipsis: true,
          align: "right",
          width: 226,
          render: (_text_, record) => {
            if (isShowCurrency) {
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={formatNumber(record?.totalConvertedAmount)}
                  />
                </LayoutCell>
              );
            }
            return null;
          },
        },
      ];

      return arrayColumn;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model, translate]
  );

  return (
    <div className="supplier-quote_table">
      <div className="table-title p-b--sm">
        {translate("PL.purchasing_plan_supplier_quotes_title")}
      </div>
      <StandardTable
        rowKey={"id"}
        columns={columns}
        dataSource={quotationRound}
        isDragable={true}
        idContainer="supplier-quote-table"
        scroll={{ y: "calc(100vh - 320px)" }}
        className="purchasing-plan_supplier"
      />
    </div>
  );
};

export default SupplierQuoteTable;
