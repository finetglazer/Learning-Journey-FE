import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { EmptyData } from "components";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";
import { PurchaseProposalModel } from "models/PurchasingPlan/PurchasingPlan";
import React, { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ModalSelectPurchaseRequest.scss";
import {
  ProposalModal,
  ProposalModalContext,
} from "./ModalSelectPurchaseRequestHook";
import { Tooltip } from "antd";

export const ModalSelectPurchaseRequestTable = () => {
  const {
    list,
    loadingList,
    rowSelection,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    count,
  } = useContext<ProposalModal>(ProposalModalContext);
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<PurchaseProposalModel>[] = useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_policy"),
        key: "purchasing_plan_policy",
        dataIndex: "purchasing_plan_policy",
        width: 180,
        sorter: false,
        render(_, record) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={record?.purchaseProposalName}
                valueLine2={record?.purchaseProposalCode}
                classNameFirstLine={"table_text"}
                classNameSecondLine={"pl-color-sub-text"}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_procurement_request"),
        key: "name",
        dataIndex: "name",
        sorter: false,
        render(_, record) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={record?.name}
                valueLine2={record?.code}
                classNameFirstLine={"table_text"}
                classNameSecondLine={"pl-color-sub-text"}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-left">{translate("PR.table_total_value")}</div>
        ),
        key: "total",
        dataIndex: "total",
        sorter: false,
        width: 145,
        render(_, record) {
          return (
            <LayoutCell position="left">
              <OneLineText
                value={
                  formatNumber(record?.total) + ` ${record?.currency?.code}`
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_request_date"),
        key: "createdDate",
        dataIndex: "createdDate",
        width: 108,
        sorter: false,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(
                  record?.createdDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.table_user_create"),
        key: "createUser",
        dataIndex: "createUser",
        sorter: false,
        width: 200,
        render(_, record) {
          return (
            <LayoutCell>
              <Tooltip
                placement="top"
                className="w-100"
                title={<div>{record?.createUserName}</div>}
              >
                <div className="text-truncate">{record?.createUser}</div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.creating_unit"),
        key: "organization",
        dataIndex: "organization",
        sorter: false,
        width: 200,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText value={item?.organization?.name} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <>
      <div className="m-t--2xs">
        <StandardTable
          rowKey="id"
          isDragable
          loading={loadingList}
          columns={columns}
          idContainer={"modal-select-purchase-request-table"}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: 390 }}
          rowSelection={rowSelection}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                icon={IcEmptySearchSvg}
                height={576}
              >
                <></>
              </EmptyData>
            ),
          }}
        />
      </div>
      <div>
        <Pagination
          total={count}
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          onChange={handlePagination}
        />
      </div>
    </>
  );
};
