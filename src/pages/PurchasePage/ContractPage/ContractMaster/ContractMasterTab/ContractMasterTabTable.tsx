import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { isNull, isObject } from "lodash";
import React from "react";
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
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";

import { ActionRowType, Contract } from "models/Contract";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { listContractStatus } from "pages/PurchasePage/constants";
import { ContractConfirmModal } from "../ContractConfirmModal/ContractConfirmModal";
import { ContractMaster, ContractMasterContext } from "../ContractMasterHook";
import EmptyDataCM from "./Components/EmptyDataCM";
import { EmptyAssetIcon } from "assets/icons";
import { TicketCode } from "components";

enum ColumnKey {
  CODE = "code",
  SUPPLIER_NAME = "supplierName",
  MANAGER = "manager",
  EFFECTIVE_DATE = "effectiveDate",
  CONTRACT_TYPE = "contractType",
  NAME = "name",
  TOTAL = "total",
  COST_ITEM = "costGroup",
  STATUS = "status",
}

const columnsWidth = {
  code: 140,
  name: 214,
  contractType: 112,
  supplierName: 140,
  manager: 140,
  total: 140,
  costGroup: 142,
  status: 108,
  overflowMenu: 40,
};

const ContractMasterTabTable = () => {
  const {
    modelFilter,
    list,
    count,
    loadingList,
    isLoadingModal,
    selectedModal,
    setSelectedModal,
    handleApplyButtonInConfirmModal,
    handleClickMenuActions,
    handleLoadList,
    dispatchFilter,
    getLinkClickRow,
  } = React.useContext<ContractMaster>(ContractMasterContext);
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<Contract>[] = React.useMemo(
    () => [
      {
        title: translate("CT.txt_code_contract"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        ellipsis: true,
        width: columnsWidth.code,
        render(code: string, contractItem: Contract) {
          return (
            <LayoutCell>
              <TicketCode
                content={code}
                href={getLinkClickRow(contractItem, ActionRowType.VIEW)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.txt_contract_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_type"),
        key: ColumnKey.CONTRACT_TYPE,
        dataIndex: ColumnKey.CONTRACT_TYPE,
        ellipsis: true,
        width: columnsWidth.contractType,
        render(contractType: string) {
          return (
            <LayoutCell>
              <OneLineText value={contractType} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.txt_supplier"),
        key: ColumnKey.SUPPLIER_NAME,
        dataIndex: ColumnKey.SUPPLIER_NAME,
        ellipsis: true,
        width: columnsWidth.supplierName,
        render(_, contractItem: Contract) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                placement="top"
                title={`${contractItem?.supplierTaxCode} - ${contractItem?.supplierName}`}
              >
                <div className="text-in-table-cell">
                  <div className="text-ellipsis">
                    {contractItem?.supplierName}
                  </div>
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.txt_manager"),
        key: ColumnKey.MANAGER,
        dataIndex: ColumnKey.MANAGER,
        ellipsis: true,
        width: columnsWidth.manager,
        render(_, contractItem: Contract) {
          if (!contractItem?.managerEmail || !contractItem?.managerName) {
            return "";
          }
          return (
            <LayoutCell>
              <OneLineText
                value={`${contractItem.managerEmail} - ${contractItem.managerName}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.txt_valid_date"),
        key: ColumnKey.EFFECTIVE_DATE,
        dataIndex: ColumnKey.EFFECTIVE_DATE,
        width: columnsWidth.contractType,
        ellipsis: true,
        render(effectiveDate: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  effectiveDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.txt_total_amount"),
        key: ColumnKey.TOTAL,
        dataIndex: ColumnKey.TOTAL,
        ellipsis: true,
        width: columnsWidth.total,
        align: "right",
        render(total: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(total)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.expense_item"),
        key: ColumnKey.COST_ITEM,
        dataIndex: ColumnKey.COST_ITEM,
        ellipsis: true,
        width: columnsWidth.costGroup,
        render(costGroup: string) {
          if (isObject(costGroup)) return "";

          return (
            <LayoutCell>
              <OneLineText value={costGroup} />
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
        render(contractStatus: number) {
          const item = listContractStatus.find(
            (statusType) => statusType.id === contractStatus
          );

          return (
            <LayoutCell>
              {item && (
                <Tag
                  size="md"
                  value={item?.name}
                  status={item?.code}
                  isShowDot={false}
                  isShowBorder
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
        render(_, contractItem: Contract) {
          const list: ListOverflowMenu[] = [
            // VIEW
            {
              title: translate("CM.txt_view"),
              action: () =>
                handleClickMenuActions(contractItem, ActionRowType.VIEW),
              isShow: contractItem.canView,
            },

            // EDIT
            {
              title: translate("CM.txt_editable"),
              action: () =>
                handleClickMenuActions(contractItem, ActionRowType.EDIT),
              isShow: contractItem.canEdit,
            },

            // CANCEL
            {
              title: translate("CM.txt_cancel"),
              action: () =>
                handleClickMenuActions(contractItem, ActionRowType.CANCEL),
              isShow: contractItem.canCancel,
            },

            // DELETE
            {
              title: translate("CM.txt_delete"),
              action: () =>
                handleClickMenuActions(contractItem, ActionRowType.DELETE),
              isShow: contractItem.canDelete,
            },

            // VIEW APPROVE
            {
              title: translate("CM.txt_view_approval"),
              action: () =>
                handleClickMenuActions(
                  contractItem,
                  ActionRowType.VIEW_APPROVE
                ),
              isShow: contractItem.canViewApprove,
            },

            // CREATE ADJUSTMENT CONTRACT
            {
              title: translate("CM.txt_create_adjustment"),
              action: () =>
                handleClickMenuActions(
                  contractItem,
                  ActionRowType.CREATE_ADJUSTMENT_CONTRACT
                ),
              isShow: contractItem.canCreateAdjustmentContract,
            },

            // CREATE APPENDIX CONTRACT
            {
              title: translate("CM.txt_create_appendix"),
              action: () =>
                handleClickMenuActions(
                  contractItem,
                  ActionRowType.CREATE_APPENDIX_CONTRACT
                ),
              isShow: contractItem.canCreateAppendixContract,
            },

            // Close proposal
            {
              title: translate("PR.btn_close_proposal"),
              action: () =>
                handleClickMenuActions(contractItem, ActionRowType.CLOSE),
              isShow: contractItem.canCloseRequest,
            },
          ];
          return (
            <LayoutCell>
              <OverflowMenu list={list} />
            </LayoutCell>
          );
        },
      },
    ],
    [handleClickMenuActions, translate]
  );

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
          idContainer="table-id"
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.message_empty_data")}
                height={WIDTH_400}
                icon={EmptyAssetIcon}
              />
            ),
          }}
          onChange={handleTableChange}
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

        {!isNull(selectedModal) ? (
          <ContractConfirmModal
            type={selectedModal.type}
            model={selectedModal.model}
            errorMessage={selectedModal.errorMessage}
            setSelectedModal={setSelectedModal}
            onApply={handleApplyButtonInConfirmModal}
            onCancel={() => setSelectedModal(null)}
            isLoading={isLoadingModal}
          />
        ) : null}
      </div>
    </>
  );
};

export default ContractMasterTabTable;
