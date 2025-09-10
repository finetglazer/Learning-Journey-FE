import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import dayjs from "dayjs";
import {
  PurchasingPlanModel,
  SupplierModel,
  SupplierPurchasingPlanDetails,
} from "models/PurchasingPlan";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import React, { Dispatch, SetStateAction, useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import "./SupplierInformationTable.scss";

interface Props {
  supplier: SupplierPurchasingPlanDetails[];
  handleOpenSupplierDrawerByRecord?: (record: SupplierModel) => void;
  isViewModeDraft?: boolean;
  setDataDrawer?: (data: SupplierModel) => void;
  setOpenDrawerSendEmail?: Dispatch<SetStateAction<boolean>>;
}

const SupplierInformationTable = ({
  supplier,
  handleOpenSupplierDrawerByRecord,
  isViewModeDraft,
  setDataDrawer,
  setOpenDrawerSendEmail,
}: Props) => {
  const { translate, model, handleClickDrawerSupplier } =
    useContext<PurchasingPlanModel>(PurchasingPlanDetailHookContext);

  const onClickSupplier = (record: SupplierModel) => {
    if (handleOpenSupplierDrawerByRecord) {
      handleOpenSupplierDrawerByRecord(record);
    } else {
      handleClickDrawerSupplier(true);
      setDataDrawer(record);
      setOpenDrawerSendEmail(false);
    }
  };

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(
    () =>
      [
        {
          title: () => (
            <div className="columns-table">
              <label>{translate("PL.purchasing_plan_supplier_name")}</label>
            </div>
          ),
          key: "name",
          dataIndex: "name",
          ellipsis: true,
          width: 262,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <Tooltip
                  placement="topLeft"
                  className="w-100"
                  title={<div>{record?.name}</div>}
                >
                  <div
                    onClick={() => onClickSupplier(record)}
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
          title: () => (
            <div className="columns-table">
              <label>{translate("PL.purchasing_plan_supplier_tax_code")}</label>
            </div>
          ),
          key: "taxCode",
          dataIndex: "taxCode",
          width: 120,
          ellipsis: true,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText value={record?.taxCode} />
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div className="columns-table">
              <label>{translate("PL.purchasing_plan_supplier_address")}</label>
            </div>
          ),
          key: "address",
          dataIndex: "address",
          width: 262,
          ellipsis: true,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText value={record?.address} />
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div className="columns-table">
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
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText value={record?.quoteName} />
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div className="columns-table">
              <label>
                {translate(
                  "PL.purchasing_plan_supplier_email_of_the_person_quoting_the_price"
                )}
              </label>
            </div>
          ),
          key: "quoteEmail",
          dataIndex: "quoteEmail",
          width: !isViewModeDraft ? 160 : undefined,
          ellipsis: true,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText value={record?.quoteEmail} />
              </LayoutCell>
            );
          },
        },
        !isViewModeDraft && {
          title: () => (
            <div className="columns-table">
              <label>{translate("PL.purchasing_plan_start_date_bid")}</label>
            </div>
          ),
          key: "startDate",
          dataIndex: "startDate",
          ellipsis: true,
          width: 170,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText
                  value={dayjs(record?.quotationRoundDetail?.startDate).format(
                    "DD/MM/YYYY"
                  )}
                />
              </LayoutCell>
            );
          },
        },
        !isViewModeDraft && {
          title: () => (
            <div className="columns-table">
              <label>{translate("PL.purchasing_plan_end_date_bid")}</label>
            </div>
          ),
          key: "endDate",
          dataIndex: "endDate",
          ellipsis: true,
          width: 170,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText
                  value={dayjs(record?.quotationRoundDetail?.endDate).format(
                    "DD/MM/YYYY"
                  )}
                />
              </LayoutCell>
            );
          },
        },
        !isViewModeDraft && {
          title: () => (
            <div className="columns-table">
              <label>
                {translate("PL.purchasing_plan_number_of_times_email")}
              </label>
            </div>
          ),
          key: "emailSendCount",
          dataIndex: "emailSendCount",
          width: 180,
          ellipsis: true,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText value={record?.emailSendCount} />
              </LayoutCell>
            );
          },
        },
        !isViewModeDraft && {
          title: () => (
            <div className="columns-table">
              <label>{translate("PL.purchasing_plan_content")}</label>
            </div>
          ),
          key: "content",
          dataIndex: "content",
          width: 262,
          ellipsis: true,
          render: (_text_, record) => {
            return (
              <LayoutCell position="left">
                <OneLineText value={record?.content} />
              </LayoutCell>
            );
          },
        },
      ].filter(Boolean),
    [handleClickDrawerSupplier, translate]
  );

  return (
    <div className="supplier-information_table">
      <StandardTable
        rowKey={"id"}
        columns={columns}
        dataSource={supplier}
        isDragable={true}
        idContainer="table-id"
        scroll={{ y: "calc(100vh - 320px)" }}
        className="purchasing-plan_supplier"
      />
    </div>
  );
};

export default SupplierInformationTable;
