import { Tooltip } from "antd";
import { type ColumnProps } from "antd/es/table";
import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { PurchasingPlanDetailHookContext } from "../../../PurchasingPlanDetailHook";

const BiddingSupplierTable = () => {
  const { translate, model, handleOpenSupplierDrawerByRecord } =
    useContext<PurchasingPlanModel>(PurchasingPlanDetailHookContext);

  const columns: ColumnProps<SupplierModel>[] = useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_name"),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: 262,
        render: (_text, record) => {
          return (
            <LayoutCell position="left">
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={<div>{record?.name}</div>}
              >
                <div
                  onClick={() => handleOpenSupplierDrawerByRecord(record)}
                  className="table__cell-blue fw-semibold cursor-pointer text-truncate"
                >
                  {record?.name}
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_supplier_tax_code"),
        key: "taxCode",
        dataIndex: "taxCode",
        width: 120,
        ellipsis: true,
        render: (_text, record) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.taxCode} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_supplier_address"),
        key: "address",
        dataIndex: "address",
        width: 262,
        ellipsis: true,
        render: (_text, record) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.address} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>
            <label>
              {translate(
                "PL.purchasing_plan_supplier_name_of_the_person_quoting_the_price"
              )}
            </label>
          </div>
        ),
        key: "quoteName",
        dataIndex: "quoteName",
        width: 220,
        ellipsis: true,
        render: (_text, record) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.quoteName} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate(
          "PL.purchasing_plan_supplier_email_of_the_person_quoting_the_price"
        ),
        key: "quoteEmail",
        dataIndex: "quoteEmail",
        width: 210,
        ellipsis: true,
        render: (_text, record) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.quoteEmail} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_number_of_times_email"),
        dataIndex: "emailSendCount",
        width: 180,
        ellipsis: true,
        render: (_text, record) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.emailSendCount} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, handleOpenSupplierDrawerByRecord]
  );

  return (
    <div className="supplier-information_table">
      <StandardTable
        rowKey={"id"}
        columns={columns}
        dataSource={[model?.currentBiddingRound?.supplierPurchase] || []}
        isDragable={true}
        idContainer="bidding-supplier-table-id"
        scroll={{ y: 45 }}
      />
    </div>
  );
};

export default BiddingSupplierTable;
