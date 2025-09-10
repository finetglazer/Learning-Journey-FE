import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { listPurchaseRequestStatusEnum } from "config/const";
import { tableService } from "core/services/page-services/table-service";

import { Tooltip } from "antd";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { isNull } from "lodash";
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

import { formatNumber } from "core/helpers/number";

import { Organization } from "models/Organization";
import { PurchaseRequest } from "models/PurchaseRequest";
import {
  ConfirmModalType,
  PurchaseRequestConfirmModal,
} from "../../PurchaseRequestConfirmModal/PurchaseRequestConfirmModal";
import {
  ActionRowType,
  PurchaseRequestMaster,
  PurchaseRequestMasterContext,
} from "../../PurchaseRequestMasterHook";
import EmptyDataCM from "../../PurchaseRequestMasterTab/component/EmptyDataCM";
import { TicketCode } from "components";
import { authorizationService } from "core/services/common-services/authorization-service";

interface ListOverflowMenu {
  title: string;
  action: (params?: ActionRowType) => void;
  isShow: boolean;
}

const AdjustPurchaseRequestMasterTabTable = () => {
  const appUserMaster = useContext<PurchaseRequestMaster>(
    PurchaseRequestMasterContext
  );

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
    repo,
    getLinkClickRow,
  } = appUserMaster;
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const { validAction } =
    authorizationService.useAuthorizedAction("PURCHASE_REQUEST");

  const menu = useCallback(
    (request: PurchaseRequest) => {
      const list: ListOverflowMenu[] = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleOnClickRow(request, ActionRowType.VIEW),
          isShow: request.canView,
        },
        //Edit
        {
          title: translate("CM.txt_editable"),
          action: () => {
            handleOnClickRow(request, ActionRowType.EDIT);
          },
          isShow: request.canEdit,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: request,
            }),
          isShow: request.canDelete && validAction("DELETE"),
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: request,
            }),
          isShow: request.canCancel && validAction("DELETE"),
        },

        {
          title: translate("CM.txt_view_approval"),
          action: () => handleOnClickRow(request, ActionRowType.VIEW_APPROVAL),
          isShow: request?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [repo.tabKey, handleOnClickRow, setModelSelected, translate]
  );

  const columns: ColumnProps<PurchaseRequest>[] = React.useMemo(
    () => [
      {
        title: translate("PR.adjusted_purchasing_requirements_code"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: 150,
        render(item, row: PurchaseRequest) {
          return (
            <LayoutCell>
              <TicketCode content={item} href={getLinkClickRow(row)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.original_purchasing_requirements_code"),
        key: "originalPurchaseRequestCode",
        dataIndex: "originalPurchaseRequestCode",
        ellipsis: true,
        width: 150,
        render(item, row: PurchaseRequest) {
          return (
            <LayoutCell>
              <TicketCode
                content={item}
                href={getLinkClickRow(
                  row,
                  ActionRowType.VIEW_ORIGINAL_PURCHASE_REQUEST
                )}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PR.table_proposal_code"),
        key: "purchaseProposalCode",
        dataIndex: "purchaseProposalCode",
        ellipsis: true,
        width: 140,
        render(item, row: PurchaseRequest) {
          return (
            <LayoutCell>
              <TicketCode
                content={item}
                href={getLinkClickRow(row, ActionRowType.VIEW_PROPOSAL)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.adjust_description_purchasing_requirements"),
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        width: 250,
        render(adjustmentDescription: string) {
          return (
            <LayoutCell>
              <OneLineText value={adjustmentDescription} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PR.table_user_create"),
        key: "createUser",
        dataIndex: "createUser",
        ellipsis: true,
        width: 200,
        render(value: string, row: PurchaseRequest) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                placement="top"
                title={row?.createUser + " - " + row?.createUserName}
              >
                <div className="text-in-table-cell">{value}</div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PR.table_unit"),
        key: "organization",
        dataIndex: "organization",
        ellipsis: true,
        width: 200,
        render(value: Organization) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={value?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PR.table_create_date"),
        key: "createdDate",
        dataIndex: "createdDate",
        ellipsis: true,
        width: 100,
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
          <div className="text-right">{translate("PR.table_total_value")}</div>
        ),
        key: "total",
        dataIndex: "total",
        ellipsis: true,
        width: 150,
        render(item) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(item)} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.table_status"),
        key: "status",
        dataIndex: "status",

        ellipsis: true,
        width: 100,
        render(id: number) {
          const item = listPurchaseRequestStatusEnum.find(
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
        width: 40,
        align: "center",
        render(id: number, record: PurchaseRequest) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu({ ...record, isAdjust: !!Number(repo.tabKey) })}
            </div>
          );
        },
      },
    ],
    [menu, repo.tabKey, translate]
  );

  return (
    <>
      <div className="adjust-proposal">
        <StandardTable
          className="adjust-proposal__table"
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
        <PurchaseRequestConfirmModal
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

export default AdjustPurchaseRequestMasterTabTable;
