import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { TicketCode } from "components";
import { listPaymentStatusEnum, listPaymentStatusErpEnum } from "config/const";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import { isEqual } from "lodash";
import { AppUser } from "models/AppUser";
import { PaymentFilter, PaymentModel } from "models/Payment";
import React, { useCallback, useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ConfirmModalType } from "../../../BudgetPage/BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { ListOverflowMenu } from "../../../BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import {
  PaymentMaster,
  PaymentMasterContext,
  TAB_KEY_ENUM,
} from "../PaymentMasterHook";
import EmptyDataCM from "./component/EmptyDataCM";

const PaymentMasterTabTable = () => {
  const appUserMaster = useContext<PaymentMaster>(PaymentMasterContext);
  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    handleOnClickRow,
    setModelSelected,
    handleGoToPaymentEdit,
    handleGoToPaymentClone,
    getLinkClickRow,
  } = appUserMaster;
  const [translate] = useTranslation();

  const isWaitingApproveTab = useMemo(
    () => isEqual(modelFilter?.tab, TAB_KEY_ENUM.IN_PROGRESS.toString()),
    [modelFilter?.tab]
  );

  // const [actionRow, setActionRow] = React.useState<ActionRowType<any>>({
  //   visible: false,
  //   record: null,
  //   x: 0,
  //   y: 0,
  // });

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  // const handleRowClicked = (record: any) => {
  //   return {
  //     onMouseEnter: (event: any) => {
  //       const rect = (
  //         event.currentTarget as HTMLElement
  //       )?.getBoundingClientRect();
  //       setActionRow({
  //         record: record,
  //         visible: true,
  //         x: 16,
  //         y: rect?.top,
  //         rowHeight: rect?.height,
  //       });
  //     },
  //   };
  // };

  const menu = useCallback(
    (payment: AppUser) => {
      const list: ListOverflowMenu[] = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleOnClickRow(payment),
          isShow: payment?.canView,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () => {
            setModelSelected({ type: ConfirmModalType.DELETE, model: payment });
          },
          isShow: payment.canDelete,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => handleGoToPaymentEdit(payment),
          isShow: payment?.canEdit,
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () => {
            setModelSelected({ type: ConfirmModalType.CANCEL, model: payment });
          },
          isShow: payment?.canCancel,
        },
        // clone
        {
          title: translate("CM.txt_clone"),
          action: () => handleGoToPaymentClone(payment),
          isShow: payment?.canCoppy,
        },
        // View Approval
        {
          title: translate("CM.txt_view_approval"),
          action: () => handleOnClickRow(payment, true),
          isShow: payment?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [
      translate,
      handleOnClickRow,
      setModelSelected,
      handleGoToPaymentEdit,
      handleGoToPaymentClone,
    ]
  );

  const columns: ColumnProps<AppUser>[] = React.useMemo(
    () => [
      {
        title: (
          <div className="d-flex align-items-center justify-content-start">
            {translate("PM.table_coupon_code")}
          </div>
        ),
        key: "code",
        dataIndex: "code",
        // sorter: true,
        sortOrder: getAntOrderType<AppUser, PaymentFilter>(modelFilter, "code"),
        ellipsis: true,
        width: 165,
        render(code: string, row) {
          return (
            <LayoutCell>
              <TicketCode
                content={code}
                href={getLinkClickRow(row, isWaitingApproveTab)}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <div className="d-flex align-items-center justify-content-start">
            {translate("PM.table_proponent")}
          </div>
        ),
        key: "requester",
        dataIndex: "requester",
        // sorter: true,
        sortOrder: getAntOrderType<AppUser, PaymentFilter>(
          modelFilter,
          "requester"
        ),
        ellipsis: true,
        width: 165,
        render(requester: string, record: AppUser) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                placement="top"
                title={record?.requester + " - " + record?.requesterName}
              >
                <div className="text-truncate">{requester}</div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <div className="d-flex align-items-center justify-content-start">
            {translate("PM.table_remember_block")}
          </div>
        ),
        key: "businessUnit",
        dataIndex: "businessUnit",
        // sorter: false,
        sortOrder: getAntOrderType<AppUser, PaymentFilter>(
          modelFilter,
          "businessUnit"
        ),
        width: 165,
        ellipsis: true,
        render(...params: [PaymentModel, AppUser, number]) {
          return (
            <LayoutCell>
              <OneLineText value={`${params[0]?.code} - ${params[0]?.name}`} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <div className="d-flex align-items-center justify-content-start">
            {translate("PM.table_cost_item")}
          </div>
        ),
        key: "costGroup",
        dataIndex: "costGroup",
        // sorter: false,
        sortOrder: getAntOrderType<AppUser, PaymentFilter>(
          modelFilter,
          "costGroup"
        ),
        ellipsis: true,
        width: 141,
        render(...params: [PaymentModel, AppUser, number]) {
          return (
            <LayoutCell>
              <OneLineText value={`${params[0]?.name}`} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <div className="d-flex align-items-center justify-content-start">
            {translate("PM.table_interpertation_proposal")}
          </div>
        ),
        width: 165,
        key: "description",
        dataIndex: "description",
        // sorter: true,
        sortOrder: getAntOrderType<AppUser, PaymentFilter>(
          modelFilter,
          "description"
        ),
        ellipsis: true,
        // width: "14%",
        render(description: string) {
          return (
            <LayoutCell>
              <OneLineText value={description} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <div className="d-flex align-items-center justify-content-end">
            {translate("PM.table_money_proposal")}
          </div>
        ),
        key: "amount",
        dataIndex: "amount",
        // sorter: true,
        sortOrder: getAntOrderType<AppUser, PaymentFilter>(
          modelFilter,
          "amount"
        ),
        ellipsis: true,
        width: 145,

        render(amount: number) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(amount)} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <div className="d-flex align-items-center justify-content-start">
            {translate("PM.table_money_type")}
          </div>
        ),
        key: "currency",
        dataIndex: "currency",
        // sorter: true,
        sortOrder: getAntOrderType<AppUser, PaymentFilter>(
          modelFilter,
          "currency"
        ),
        ellipsis: true,
        width: 76,
        render(...params: [PaymentModel, AppUser, number]) {
          const currency = params[0]?.code;
          return (
            <LayoutCell>
              <OneLineText value={currency} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <div className="d-flex align-items-center justify-content-start">
            {translate("PM.table_status")}
          </div>
        ),
        key: "status",
        dataIndex: "status",
        // sorter: true,
        sortOrder: getAntOrderType<AppUser, PaymentFilter>(
          modelFilter,
          "status"
        ),
        width: 110,
        ellipsis: true,
        render(id: number) {
          const item = listPaymentStatusEnum.find((type) => type.id === id);
          return (
            <LayoutCell>
              <Tag
                size="md"
                value={item?.name}
                status={item.code}
                isShowDot={false}
                isShowBorder={true}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="d-flex align-items-center justify-content-start">
            {translate("PM.table_status_erp")}
          </div>
        ),
        key: "erpStatus",
        dataIndex: "erpStatus",
        // sorter: true,
        sortOrder: getAntOrderType<AppUser, PaymentFilter>(
          modelFilter,
          "erpStatus"
        ),
        width: 116,
        ellipsis: true,
        render(id: number) {
          const item = listPaymentStatusErpEnum.find((type) => type.id === id);
          return (
            <LayoutCell>
              <OneLineText value={item?.name} />
            </LayoutCell>
          );
        },
      },
      // menu
      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: 40,
        align: "center",
        render(id: number, record: AppUser) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [translate, modelFilter, getLinkClickRow, isWaitingApproveTab, menu]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          className="tab__budget"
          rowKey={"id"}
          columns={columns}
          dataSource={list}
          isDragable={true}
          loading={loadingList}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 308px)" }}
          idContainer="table-id"
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.txt_search_no_data")}
                isFilter
                icon={IcEmptySearchSvg}
                height={376}
              />
            ),
          }}
        />
        <div className="page-master__pagination">
          <Pagination
            pageIndex={modelFilter.pageIndex}
            pageSize={modelFilter.pageSize}
            total={count}
            onChange={handlePagination}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentMasterTabTable;
