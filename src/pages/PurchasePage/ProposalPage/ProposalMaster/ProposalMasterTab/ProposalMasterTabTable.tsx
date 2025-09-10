import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { listProposalStatusEnum } from "config/const";
import { tableService } from "core/services/page-services/table-service";

import { Tooltip } from "antd";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { isNull } from "lodash";
import { Organization } from "models/Organization";
import { Proposal } from "models/Proposal";
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
import {
  ConfirmModalType,
  ProposalConfirmModal,
} from "../ProposalConfirmModal/ProposalConfirmModal";
import {
  ActionRowType,
  ProposalMaster,
  ProposalMasterContext,
} from "../ProposalMasterHook";
import EmptyDataCM from "./component/EmptyDataCM";
import { TicketCode } from "components";
import { authorizationService } from "core/services/common-services/authorization-service";

interface ListOverflowMenu {
  title: string;
  action: (params?: ActionRowType) => void;
  isShow: boolean;
}

const ProposalMasterTabTable = () => {
  const appUserMaster = useContext<ProposalMaster>(ProposalMasterContext);

  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    handleOnClickRow,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    loadingModal,
    getLinkClickRow,
  } = appUserMaster;
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const { validAction } = authorizationService.useAuthorizedAction(
    "PURCHASE_PROPOSAL",
    "Original"
  );

  const menu = useCallback(
    (proposal: Proposal) => {
      const list: ListOverflowMenu[] = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleOnClickRow(proposal, ActionRowType.VIEW),
          isShow: proposal?.canView,
        },

        {
          title: translate("PP.action_create_adjustment_proposal"),
          action: () =>
            handleOnClickRow(
              proposal,
              ActionRowType.CREATE_ADJUSTMENT_PROPOSAL
            ),
          isShow: proposal?.canCreateAdjustmentProposal,
        },
        {
          title: translate("PP.action_create_payment_request"),
          action: () => {
            handleOnClickRow(proposal, ActionRowType.CREATE_PAYMENT_REQUEST);
          },
          isShow: proposal?.canCreatePaymentRequest,
        },
        {
          title: translate("PP.action_create_advance_payment"),
          action: () => {
            handleOnClickRow(proposal, ActionRowType.CREATE_ADVANCE_PAYMENT);
          },
          isShow: proposal?.canCreateAdvancePaymentRequest,
        },
        {
          title: translate("PP.action_create_expenditure_request"),
          action: () => {
            handleOnClickRow(
              proposal,
              ActionRowType.CREATE_EXPENDITURE_REQUEST
            );
          },
          isShow: proposal?.canCreateExpenditureRequest,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => {
            handleOnClickRow(proposal, ActionRowType.EDIT);
          },
          isShow: proposal?.canEdit,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: proposal,
            }),
          isShow: proposal?.canDelete && validAction("DELETE"),
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: proposal,
            }),
          isShow: proposal?.canCancel && validAction("DELETE"),
        },
        // View approve
        {
          title: translate("CM.txt_view_approval"),
          action: () => handleOnClickRow(proposal, ActionRowType.VIEW),
          isShow: proposal?.canViewApprove,
        },
        // Close proposal
        {
          title: translate("PR.btn_close_proposal"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.CLOSE,
              model: proposal,
            }),
          isShow: proposal?.canCloseRequest,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [handleOnClickRow, setModelSelected, translate, validAction]
  );

  const columns: ColumnProps<Proposal>[] = React.useMemo(
    () => [
      {
        title: translate("PP.table_proposal_code"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: "10%",
        render(item, row: Proposal) {
          return (
            <LayoutCell>
              <TicketCode content={item} href={getLinkClickRow(row)} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PP.table_proposal_user_create"),
        key: "createUser",
        dataIndex: "createUser",
        ellipsis: true,
        render(value: string, row: Proposal) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                placement="top"
                title={row?.createUser + " - " + row?.createUserName}
              >
                <OneLineText className="text-in-table-cell" value={value} />
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PP.table_proposal_unit"),
        key: "organization",
        dataIndex: "organization",
        ellipsis: true,
        render(value: Organization) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={value?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PP.table_proposal_proposal_name"),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PP.table_proposal_create_date"),
        key: "createdDate",
        dataIndex: "createdDate",
        ellipsis: true,
        width: "100px",
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
        title: (
          <div className="text-right">
            {translate("PP.table_proposal_total_value")}
          </div>
        ),
        key: "totalAmount",
        dataIndex: "totalAmount",
        className: "custom-sorter-column",
        ellipsis: true,
        width: "145px",
        render(item) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(item)} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <div className="text-right">
            {translate("PP.table_proposal_used")}
          </div>
        ),
        key: "usedAmount",
        dataIndex: "usedAmount",
        ellipsis: true,
        width: "145px",
        render(item) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(item)} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <div className="text-right">
            {translate("PP.table_proposal_remain")}
          </div>
        ),
        key: "remainingAmount",
        dataIndex: "remainingAmount",
        ellipsis: true,
        width: "145px",
        render(item) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(item)} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PP.table_proposal_status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: "105px",
        render(id: number) {
          const item = listProposalStatusEnum.find((type) => type.id === id);
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
        width: 40,
        align: "center",
        render(id: number, record: Proposal) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [handleOnClickRow, menu, translate]
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
          scroll={{ y: "calc(100vh - 356px)" }}
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

      {!isNull(modelSelected) ? (
        <ProposalConfirmModal
          type={modelSelected.type}
          model={modelSelected.model}
          errorMessage={modelSelected.errorMessage}
          onApply={handleApplyButtonInConfirmModal}
          onCancel={() => setModelSelected(null)}
          isLoading={loadingModal}
        />
      ) : null}
    </>
  );
};

export default ProposalMasterTabTable;
