import { ColumnProps } from "antd/lib/table";
import { EmptyData, TicketCode } from "components";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { tableService } from "core/services/page-services/table-service";
import { isEqual, isNull, isUndefined } from "lodash";
import { ReceivingGoodModel } from "models/ReceivingGood";
import { ConfirmModalType } from "pages/BudgetPage/BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { TAB_KEY_ENUM } from "pages/PaymentPage/PaymentMaster/PaymentMasterHook";
import {
  listReceivedGoodsStatus,
  LOCAL_STORAGE_ACTION_STATE,
} from "pages/PurchasePage/constants";
import { ReceivedConfirmModal } from "pages/PurchasePage/ReceivingGoods/Components/ReceivedGoodConfirmModal/ReceivedGoodConfirmModal";
import {
  ActionRowType,
  ReceivingGoodsContext,
  ReceivingGoodsContextType,
} from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";
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
import { Link } from "react-router-dom";

const TABLE_ID_CONTAINER = "received-goods-id";

enum ColumnKey {
  ID = "code",
  CODE_CONTRACT = "contractCode",
  SUPPLIER_NAME = "supplierName",
  NAME_CONTRACT = "contractName",
  UNIT_RECEIVED = "recipientUnitName",
  RECEIVED_BY = "receiptPerson",
  RECEIVED_DATE = "receiptDate",
  STATUS = "status",
}

const columnsWidth = {
  code: 130,
  codeContract: 140,
  supplierName: 200,
  nameContract: 400,
  unitReceived: 180,
  receivedBy: 180,
  receivedDate: 110,
  status: 105,
  overflowMenu: 40,
};

const ReceivedGoodsTabTable = () => {
  const {
    modelFilter,
    list,
    count,
    setModelSelected,
    handleOnClickRow,
    handleGoToReceivedClone,
    dispatchFilter,
    modelSelected,
    loadingModal,
    handleLoadList,
    handleApplyButtonInConfirmModal,
    loadingList,
    getLinkClickRow,
  } = useContext<ReceivingGoodsContextType>(ReceivingGoodsContext);
  const [translate] = useTranslation();

  const isWaitingApproveTab = useMemo(
    () => isEqual(modelFilter?.tab, TAB_KEY_ENUM.IN_PROGRESS.toString()),
    [modelFilter?.tab]
  );

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (received: ReceivingGoodModel) => {
      const list: ListOverflowMenu[] = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleOnClickRow(received, ActionRowType.VIEW),
          isShow: received?.canView,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => handleOnClickRow(received, ActionRowType.EDIT),
          isShow: received?.canEdit,
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: received,
            });
          },
          isShow: received?.canCancel,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: received,
            });
          },
          isShow: received?.canDelete,
        },
        // Clone
        {
          title: translate("CM.txt_clone"),
          action: () => handleGoToReceivedClone(received),
          isShow: received?.canCopy,
        },
        // View Approve
        {
          title: translate("CM.txt_view_approval"),
          action: () => handleOnClickRow(received, ActionRowType.VIEW, true),
          isShow: received?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [translate, handleOnClickRow, setModelSelected, handleGoToReceivedClone]
  );

  const columns: ColumnProps<ReceivingGoodModel>[] = [
    {
      title: translate("RG.tab_label_code_received"),
      key: ColumnKey.ID,
      dataIndex: ColumnKey.ID,
      ellipsis: true,
      width: columnsWidth.code,
      render(code: string, row) {
        return (
          <LayoutCell>
            <TicketCode
              content={code}
              href={getLinkClickRow(
                row,
                ActionRowType.VIEW,
                isWaitingApproveTab
              )}
              onClick={(event) => {
                event.stopPropagation();
                localStorage.setItem(LOCAL_STORAGE_ACTION_STATE, "VIEW");
              }}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("RG.tab_label_code_contract"),
      key: ColumnKey.CODE_CONTRACT,
      dataIndex: ColumnKey.CODE_CONTRACT,
      ellipsis: true,
      width: columnsWidth.codeContract,
      render(contractCode: string, row) {
        return (
          <LayoutCell>
            <TicketCode
              content={contractCode}
              href={`${CONTRACT_ROUTE_VIEW}/${row?.contractId}`}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("RG.tab_label_supplier"),
      key: ColumnKey.SUPPLIER_NAME,
      dataIndex: ColumnKey.SUPPLIER_NAME,
      ellipsis: true,
      width: columnsWidth.supplierName,
      render(_, contractItem: ReceivingGoodModel) {
        return (
          <LayoutCell>
            <OneLineText value={contractItem?.supplierName} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("RG.tab_label_name_contract"),
      key: ColumnKey.NAME_CONTRACT,
      dataIndex: ColumnKey.NAME_CONTRACT,
      ellipsis: true,
      width: columnsWidth.nameContract,
      render(effectiveDate: string) {
        return (
          <LayoutCell>
            <OneLineText value={effectiveDate} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("RG.tab_label_unit_received"),
      key: ColumnKey.UNIT_RECEIVED,
      dataIndex: ColumnKey.UNIT_RECEIVED,
      ellipsis: true,
      width: columnsWidth.unitReceived,
      render(recipientUnitName: string) {
        return (
          <LayoutCell>
            <OneLineText value={recipientUnitName} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("RG.tab_label_received_by"),
      key: ColumnKey.RECEIVED_BY,
      dataIndex: ColumnKey.RECEIVED_BY,
      ellipsis: true,
      width: columnsWidth.receivedBy,
      render(contractNo: string) {
        return (
          <LayoutCell>
            <OneLineText value={contractNo} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("RG.tab_label_received_date"),
      key: ColumnKey.RECEIVED_DATE,
      dataIndex: ColumnKey.RECEIVED_DATE,
      ellipsis: true,
      render(name: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={formatDateTimeToVietnamTimezone(
                name,
                STANDARD_DATE_FORMAT_SLASH
              )}
            />
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
        const item = listReceivedGoodsStatus().find((type) => type.id === id);
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
      render(record: ReceivingGoodModel) {
        return <LayoutCell>{menu(record)}</LayoutCell>;
      },
    },
  ];

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          columns={columns}
          dataSource={list}
          isDragable={true}
          loading={loadingList}
          scroll={{ y: "calc(100vh - 350px)" }}
          idContainer={TABLE_ID_CONTAINER}
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

        {!isNull(modelSelected) ? (
          <ReceivedConfirmModal
            type={modelSelected.type}
            model={modelSelected.model}
            errorMessage={modelSelected.errorMessage}
            onApply={handleApplyButtonInConfirmModal}
            onCancel={() => setModelSelected(null)}
            isLoading={loadingModal}
          />
        ) : null}
      </div>
    </>
  );
};

export default ReceivedGoodsTabTable;
