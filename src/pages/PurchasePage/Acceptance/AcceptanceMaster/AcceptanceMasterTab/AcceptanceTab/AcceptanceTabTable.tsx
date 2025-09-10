import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import EmptyData from "components/EmptyData/EmptyData";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { ConfirmModalType } from "core/helpers/enum";
import { tableService } from "core/services/page-services/table-service";
import { isEqual, isNull } from "lodash";
import { AcceptanceModel } from "models/Acceptance";
import { TAB_KEY_ENUM } from "pages/PaymentPage/PaymentMaster/PaymentMasterHook";
import { AcceptanceConfirmModal } from "pages/PurchasePage/Acceptance/Components/AcceptanceConfirmModal/AcceptanceConfirmModal";
import { useAcceptanceActions } from "pages/PurchasePage/Acceptance/Components/hooks/useAcceptanceActions";
import {
  listAcceptanceStatus,
  LOCAL_STORAGE_ACCEPTANCE,
} from "pages/PurchasePage/constants";
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
import { ActionRowType } from "../../AcceptanceMasterHook";
import { AcceptanceMaster, AcceptanceMasterContext } from "../context";
import { TicketCode } from "components";

interface ListOverflowMenu {
  title: string;
  action: () => void;
  isShow: boolean;
}

const AcceptanceTabTable = () => {
  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    handleOnClickRow,
    handleGoToAcceptanceEdit,
    getLinkClickRow,
  } = useContext<AcceptanceMaster>(AcceptanceMasterContext);

  const {
    isLoadingModal,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
  } = useAcceptanceActions();

  const [translate] = useTranslation();

  const isWaitingApproveTab = useMemo(
    () => isEqual(Number(modelFilter?.tab), TAB_KEY_ENUM.IN_PROGRESS),
    [modelFilter?.tab]
  );

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (request: AcceptanceModel) => {
      const list: ListOverflowMenu[] = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleOnClickRow(request, ActionRowType.VIEW),
          isShow: request?.canView,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => handleGoToAcceptanceEdit(request),
          isShow: request?.canEdit,
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: request,
            }),
          isShow: request?.canCancel,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: request,
            }),
          isShow: request?.canDelete,
        },
        // View Approve
        {
          title: translate("CM.txt_view_approval"),
          action: () => handleOnClickRow(request, ActionRowType.VIEW, true),
          isShow: request?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [translate, handleOnClickRow, handleGoToAcceptanceEdit, setModelSelected]
  );

  const columns: ColumnProps<AcceptanceModel>[] = React.useMemo(
    () => [
      {
        title: translate("AC.txt_table_code"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: "12%",
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
        title: translate("AC.txt_contract_number"),
        key: "contractNo",
        dataIndex: "contractNo",
        ellipsis: true,
        width: "12%",
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_contract_name"),
        key: "contractName",
        dataIndex: "contractName",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_contract_type"),
        key: "contractType",
        dataIndex: "contractType",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_supplier"),
        key: "supplier",
        dataIndex: "supplier",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_commissioning_date"),
        key: "applyDate",
        dataIndex: "applyDate",
        ellipsis: true,
        render(applyDate: string) {
          const dateOnly = formatDateTimeToVietnamTimezone(
            applyDate,
            STANDARD_DATE_FORMAT_SLASH
          );

          return (
            <LayoutCell>
              <OneLineText value={dateOnly} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_creator"),
        key: "createUser",
        dataIndex: "createUser",
        ellipsis: true,
        render(value: string, record) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                placement="top"
                title={record?.createUser + " - " + record?.createUserName}
              >
                <div className="text-in-table-cell">{value}</div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_table_status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: "120px",
        render(id: string) {
          const item = listAcceptanceStatus().find((type) =>
            isEqual(type?.id, id)
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
        render(_, record: AcceptanceModel) {
          return <LayoutCell>{menu(record)}</LayoutCell>;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isWaitingApproveTab, menu, translate]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          columns={columns}
          dataSource={loadingList ? [] : list}
          loading={loadingList}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 350px)" }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
              />
            ),
          }}
        />
        <div className="page-master__pagination">
          <Pagination
            total={count}
            onChange={handlePagination}
            pageSize={modelFilter.pageSize}
            pageIndex={modelFilter.pageIndex}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>

        {isNull(modelSelected) ? null : (
          <AcceptanceConfirmModal
            type={modelSelected.type}
            model={modelSelected.model}
            errorMessage={modelSelected.errorMessage}
            onApply={handleApplyButtonInConfirmModal}
            onCancel={() => setModelSelected(null)}
            isLoading={isLoadingModal}
          />
        )}
      </div>
    </>
  );
};

export default AcceptanceTabTable;
