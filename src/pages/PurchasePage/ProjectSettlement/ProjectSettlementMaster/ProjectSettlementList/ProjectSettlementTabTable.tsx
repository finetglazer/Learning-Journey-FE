import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { EmptyData, TicketCode } from "components";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";
import { isEqual, isUndefined } from "lodash";
import { ProjectSettlementModel } from "models/ProjectSettlement";
import { TAB_MASTER } from "models/Settlement";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { listProjectSettlementStatus } from "pages/PurchasePage/constants";
import {
  ActionRowType,
  ProjectSettlementMasterContext,
  ProjectSettlementMasterType,
} from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/context";
import { useCallback, useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../ProjectSettlement.module.scss";

enum ColumnKey {
  ID = "code",
  PURCHASE_PROPOSAL_CODE = "purchaseProposalCode",
  PURCHASE_PROPOSAL_NAME = "purchaseProposalName",
  PROJECT_CODE = "projectCode",
  CREATED_USER_NAME = "createUserName",
  CREATED_DATE = "createdDate",
  PROJECT_SETTLEMENT_AMOUNT = "projectSettlementAmount",
  STATUS = "status",
}

const columnsWidth = {
  code: 155,
  purchaseProposalCode: 140,
  projectCode: 150,
  createdUserName: 150,
  createdDate: 100,
  projectSettlementAmount: 140,
  status: 105,
  overflowMenu: 40,
};
const ProjectSettlementTabTable = () => {
  const {
    list,
    count,
    loadingList,
    handleOnClickRow,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    getLinkClickRow,
  } = useContext<ProjectSettlementMasterType>(ProjectSettlementMasterContext);
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const isWaitingApproveTab = useMemo(
    () => isEqual(modelFilter?.tab, TAB_MASTER.IN_PROGRESS.toString()),
    [modelFilter?.tab]
  );

  const menu = useCallback(
    (projectSettlement: ProjectSettlementModel) => {
      const list: ListOverflowMenu[] = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleOnClickRow(projectSettlement, ActionRowType.VIEW),
          isShow: projectSettlement?.canView,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => handleOnClickRow(projectSettlement, ActionRowType.EDIT),
          isShow: projectSettlement?.canEdit,
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () =>
            handleOnClickRow(projectSettlement, ActionRowType.CANCEL),
          isShow: projectSettlement?.canCancel,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () =>
            handleOnClickRow(projectSettlement, ActionRowType.DELETE),
          isShow: projectSettlement?.canDelete,
        },
        // View Approve
        {
          title: translate("CM.txt_view_approval"),
          action: () =>
            handleOnClickRow(projectSettlement, ActionRowType.VIEW, true),
          isShow: projectSettlement?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [translate, handleOnClickRow]
  );

  const columns: ColumnProps<ProjectSettlementModel>[] = useMemo(
    () => [
      {
        title: translate("PS.txt_table_code_project_settlement"),
        key: ColumnKey.ID,
        dataIndex: ColumnKey.ID,
        ellipsis: true,
        width: columnsWidth.code,
        render(code: string, record) {
          return (
            <LayoutCell>
              <TicketCode
                content={code}
                href={getLinkClickRow(
                  record,
                  ActionRowType.VIEW_FROM_MASTER,
                  isWaitingApproveTab
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_table_code_policy"),
        key: ColumnKey.PURCHASE_PROPOSAL_CODE,
        dataIndex: ColumnKey.PURCHASE_PROPOSAL_CODE,
        ellipsis: true,
        width: columnsWidth.purchaseProposalCode,
        render(purchaseProposalCode: string, row) {
          return (
            <LayoutCell>
              <TicketCode
                content={purchaseProposalCode}
                href={getLinkClickRow(row, ActionRowType.VIEW_POLICY)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_table_name_policy"),
        key: ColumnKey.PURCHASE_PROPOSAL_NAME,
        dataIndex: ColumnKey.PURCHASE_PROPOSAL_NAME,
        ellipsis: true,
        render(purchaseProposalName: string) {
          return (
            <LayoutCell>
              <OneLineText value={purchaseProposalName} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_table_code_project"),
        key: ColumnKey.PROJECT_CODE,
        ellipsis: true,
        width: columnsWidth.projectCode,
        render(code: ProjectSettlementModel) {
          return (
            <LayoutCell>
              <Tooltip
                title={`${code?.projectCode} - ${code?.projectName}`}
                placement="topLeft"
              >
                {code?.projectCode}
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_table_person_create"),
        key: ColumnKey.CREATED_USER_NAME,
        ellipsis: true,
        width: columnsWidth.createdUserName,
        render(user: ProjectSettlementModel) {
          return (
            <LayoutCell>
              <Tooltip
                title={`${user?.createUser} - ${user?.createUserName}`}
                placement="topLeft"
              >
                {user?.createUser}
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_table_date_create"),
        key: ColumnKey.CREATED_DATE,
        dataIndex: ColumnKey.CREATED_DATE,
        ellipsis: true,
        width: columnsWidth.createdDate,
        render(createdDate: string) {
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
      {
        title: translate("PS.txt_table_settlement_value"),
        key: ColumnKey.PROJECT_SETTLEMENT_AMOUNT,
        dataIndex: ColumnKey.PROJECT_SETTLEMENT_AMOUNT,
        width: columnsWidth.projectSettlementAmount,
        ellipsis: true,
        render(projectSettlementAmount: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(projectSettlementAmount)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.txt_status"),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        ellipsis: true,
        width: columnsWidth.status,
        render(id: number) {
          const item = listProjectSettlementStatus().find((type) =>
            isEqual(type.id, id)
          );
          return (
            <LayoutCell>
              {isUndefined(item) ? null : (
                <Tag
                  size="md"
                  value={item?.name}
                  status={item.code}
                  isShowDot={false}
                  isShowBorder={true}
                />
              )}
            </LayoutCell>
          );
        },
      },

      // Menu Actions
      {
        title: "",
        width: columnsWidth.overflowMenu,
        fixed: "right",
        align: "center",
        render(record: ProjectSettlementModel) {
          return <LayoutCell>{menu(record)}</LayoutCell>;
        },
      },
    ],
    [getLinkClickRow, isWaitingApproveTab, menu, translate]
  );
  return (
    <div className={styles["table-container"]}>
      <div className="page-master__table">
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          columns={columns}
          dataSource={list}
          isDragable={true}
          scroll={{ y: "calc(100vh - 320px)" }}
          loading={loadingList}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
              />
            ),
          }}
          onChange={handleTableChange}
        />
        <div className="page-master__pagination">
          <Pagination
            pageIndex={modelFilter?.pageIndex}
            pageSize={modelFilter?.pageSize}
            total={count}
            onChange={handlePagination}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectSettlementTabTable;
