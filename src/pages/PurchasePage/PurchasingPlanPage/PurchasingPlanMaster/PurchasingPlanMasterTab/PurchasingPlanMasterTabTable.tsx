import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { TicketCode } from "components";
import {
  listPurchasingPlanStatusEnum,
  listPurchasingPlanType,
} from "config/const";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { tableService } from "core/services/page-services/table-service";
import { isNull } from "lodash";
import { Organization } from "models/Organization";
import {
  ICostGroup,
  PurchasingPlan,
  SupplierServicesCategory,
  TabKeyBidder,
} from "models/PurchasingPlan";
import React, { useCallback, useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { PurchasingPlanConfirmModal } from "../Components/PurchasingPlanConfirmModal";
import {
  PurchasingPlanMaster,
  PurchasingPlanMasterContext,
} from "../PurchasingPlanMasterHook";
import EmptyDataCM from "../Components/EmptyDataCM";
import {
  ConfirmModalType,
  PURCHASING_PLAN_STATUS,
  TYPE_PURCHASING_PLAN,
} from "models/PurchasingPlan/PurchasingPlanConstant";

const PurchasingPlanMasterTabTable = () => {
  const history = useHistory();
  const appUserMaster = useContext<PurchasingPlanMaster>(
    PurchasingPlanMasterContext
  );

  const {
    list,
    modelFilter,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    count,
    loadingList,
    loadingModal,
    dispatchFilter,
    handleLoadList,
    handleOnClickRow,
    getPurchasePlanTypeByRouter,
    loadingConfirm,
    getLinkClickRow,
  } = appUserMaster;

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (purchasingPlan: PurchasingPlan) => {
      const list = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => {
            const tabKey =
              purchasingPlan.purchasePlanType ===
                TYPE_PURCHASING_PLAN.COMPETITIVE_BIDDING &&
              purchasingPlan.status ===
                PURCHASING_PLAN_STATUS.SELECT_SUPPLIER &&
              TabKeyBidder.SelectSupplier;

            history.push(
              `${
                getPurchasePlanTypeByRouter(purchasingPlan?.purchasePlanType)
                  .pathView
              }/${purchasingPlan.id}${tabKey ? `?tabKey=${tabKey}` : ""}`
            );
          },
          isShow: purchasingPlan?.canView,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => {
            history.push(
              `${
                getPurchasePlanTypeByRouter(purchasingPlan?.purchasePlanType)
                  .pathEdit
              }/${purchasingPlan.id}`
            );
          },
          isShow: purchasingPlan?.canEdit,
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: purchasingPlan,
            });
          },
          isShow: purchasingPlan?.canCancel,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: purchasingPlan,
            });
          },
          isShow: purchasingPlan.canDelete,
        },
        // View Approval
        {
          title: translate("CM.txt_view_approval"),
          action: () => {
            history.push(
              `${
                getPurchasePlanTypeByRouter(purchasingPlan?.purchasePlanType)
                  .pathView
              }/${purchasingPlan.id}${"?isViewWaitingApprove=true"}`
            );
          },
          isShow: purchasingPlan?.canViewApprove,
        },
        // Action
        {
          title: translate("CM.txt_perform"),
          action: () => {
            history.push(
              `${
                getPurchasePlanTypeByRouter(purchasingPlan?.purchasePlanType)
                  .pathEdit
              }/${purchasingPlan.id}`
            );
          },
          isShow: purchasingPlan?.canAction,
        },
        // Thực hiện
        {
          title: translate("CM.txt_perform"),
          action: () => {
            history.push(
              `${
                getPurchasePlanTypeByRouter(purchasingPlan?.purchasePlanType)
                  .pathView
              }/${purchasingPlan.id}?isPerform=true`
            );
          },
          isShow: purchasingPlan?.canPerform,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [translate, history, getPurchasePlanTypeByRouter, setModelSelected]
  );

  const columns: ColumnProps<PurchasingPlan>[] = React.useMemo(
    () => [
      {
        title: translate("PL.table_code"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: "110px",
        render(item, row: PurchasingPlan) {
          return (
            <LayoutCell>
              <TicketCode content={item} href={getLinkClickRow(row)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_purchase_plan_formality"),
        key: "purchasePlanType",
        dataIndex: "purchasePlanType",
        ellipsis: true,
        width: "180px",
        render(id: number) {
          const item = listPurchasingPlanType.find((type) => type.id === id);
          return (
            <LayoutCell>
              <OneLineText value={item?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_purchase_plan_name"),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_purchase_plan_cost_group"),
        key: "costGroup",
        dataIndex: "costGroup",
        ellipsis: true,
        width: "200px",
        render(costGroup: ICostGroup) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={costGroup?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_purchase_plan_create_date"),
        key: "createdDate",
        dataIndex: "createdDate",
        ellipsis: true,
        width: "110px",
        render(createdDate: string) {
          const dateOnly = formatDate(createdDate, STANDARD_DATE_FORMAT_SLASH);

          return (
            <LayoutCell>
              <OneLineText useTooltip value={dateOnly} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_purchase_plan_user_create"),
        key: "createUser",
        dataIndex: "createUser",
        ellipsis: true,
        width: "160px",
        render(createUser: string, row: PurchasingPlan) {
          return (
            <LayoutCell>
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={`${createUser} - ${row?.createUserName}`}
              >
                <div className="d-inline-block text-in-table-cell text-truncate">
                  {createUser}
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_purchase_plan_unit"),
        key: "organization",
        dataIndex: "organization",
        ellipsis: true,
        width: "140px",
        render(value: Organization) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={value?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_purchase_plan_provider"),
        key: "suppliers",
        dataIndex: "suppliers",
        ellipsis: true,
        width: "250px",
        render(items: SupplierServicesCategory[]) {
          const dataSupplier = items.map((item) => item?.name).join(", ");
          return (
            <LayoutCell>
              <OneLineText useTooltip value={dataSupplier} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_purchase_plan_status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: "130px",
        render(id: number) {
          const item = listPurchasingPlanStatusEnum.find(
            (type) => type.id === id
          );
          return (
            <LayoutCell>
              <Tag
                size="md"
                value={item?.name}
                status={item?.code}
                isShowDot={false}
                isShowBorder={true}
              />
            </LayoutCell>
          );
        },
      },

      // menu
      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: "40px",
        align: "center",
        render(id: number, record: PurchasingPlan) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [menu, translate, handleOnClickRow]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          rowKey={"id"}
          columns={columns}
          dataSource={list}
          isDragable={true}
          loading={loadingList}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 348px)" }}
          idContainer="table-id"
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.txt_search_no_data")}
                isFilter
                icon={IcEmptySearchSvg}
                height={365}
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

        {!isNull(modelSelected) ? (
          <PurchasingPlanConfirmModal
            loadingButton={loadingConfirm}
            type={modelSelected.type}
            model={modelSelected.model}
            isLoading={loadingModal}
            errorMessage={modelSelected.errorMessage}
            onApply={handleApplyButtonInConfirmModal}
            setModelSelected={setModelSelected}
            onCancel={() => setModelSelected(null)}
          />
        ) : null}
      </div>
    </>
  );
};

export default PurchasingPlanMasterTabTable;
