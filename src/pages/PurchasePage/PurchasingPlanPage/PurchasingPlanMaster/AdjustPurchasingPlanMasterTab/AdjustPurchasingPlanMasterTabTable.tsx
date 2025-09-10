import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { TicketCode } from "components";
import { listPurchasingPlanStatusEnum } from "config/const";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { tableService } from "core/services/page-services/table-service";
import { isNull } from "lodash";
import { Organization } from "models/Organization";
import { PurchasingPlan } from "models/PurchasingPlan";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
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
import { PurchasingPlanConfirmModal } from "../Components/PurchasingPlanConfirmModal";
import {
  ActionRowType,
  PurchasingPlanMasterContext,
} from "../PurchasingPlanMasterHook";
import { ConfirmModalType } from "models/PurchasingPlan/PurchasingPlanConstant";

const PurchasingPlanMasterTabTable = () => {
  const [translate] = useTranslation();
  const appUserMaster = useContext(PurchasingPlanMasterContext);

  const {
    list,
    modelFilter,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    count,
    loadingList,
    loadingModal,
    repo,
    dispatchFilter,
    handleLoadList,
    handleOnClickRow,
    loadingConfirm,
    getLinkClickRow,
  } = appUserMaster;

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
          action: () =>
            handleOnClickRow(
              purchasingPlan,
              ActionRowType.VIEW_ADJUST_PURCHASING_PLAN
            ),
          isShow: purchasingPlan?.canView,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () =>
            handleOnClickRow(
              purchasingPlan,
              ActionRowType.EDIT_ADJUST_PURCHASING_PLAN
            ),
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
          action: () =>
            handleOnClickRow(
              purchasingPlan,
              ActionRowType.APPROVAL_CANCEL_ADJUST_PURCHASING_PLAN
            ),
          isShow: purchasingPlan?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [repo.tabKey, handleOnClickRow, setModelSelected, translate]
  );

  const columns: ColumnProps<PurchasingPlan>[] = React.useMemo(
    () => [
      {
        title: translate("PL.table_adjust_purchase_plan_code"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: "180px",
        render(item, row: PurchasingPlan) {
          return (
            <LayoutCell>
              <TicketCode
                content={item}
                href={getLinkClickRow(
                  row,
                  ActionRowType.VIEW_ADJUST_PURCHASING_PLAN_FROM_MASTER
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_purchase_plan_origin"),
        key: "originalPurchasePlanCode ",
        dataIndex: "originalPurchasePlanCode",
        ellipsis: true,
        width: "180px",
        render(item, row: PurchasingPlan) {
          return (
            <LayoutCell>
              <TicketCode
                content={item}
                href={getLinkClickRow(
                  row,
                  ActionRowType.VIEW_ORIGINAL_PURCHASING_PLAN
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_description_adjust_purchase_plan"),
        key: "adjustmentDescription",
        dataIndex: "adjustmentDescription",
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
        title: translate("PL.table_purchase_plan_create_date"),
        key: "createdDate",
        dataIndex: "createdDate",
        ellipsis: true,
        width: "96px",
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
        width: "160px",
        render(value: Organization) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={value?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.filter_purchase_plan_cost_group"),
        key: "costGroup",
        dataIndex: "costGroup",
        ellipsis: true,
        width: "250px",
        render(value) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={value?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.table_purchase_plan_status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: "105px",
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
    [menu, translate, modelFilter]
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

        {!isNull(modelSelected) ? (
          <PurchasingPlanConfirmModal
            loadingButton={loadingConfirm}
            type={modelSelected.type}
            model={modelSelected.model}
            isLoading={loadingModal}
            errorMessage={modelSelected.errorMessage}
            onApply={handleApplyButtonInConfirmModal}
            onCancel={() => setModelSelected(null)}
            isAdjust={true}
          />
        ) : null}
      </div>
    </>
  );
};

export default PurchasingPlanMasterTabTable;
