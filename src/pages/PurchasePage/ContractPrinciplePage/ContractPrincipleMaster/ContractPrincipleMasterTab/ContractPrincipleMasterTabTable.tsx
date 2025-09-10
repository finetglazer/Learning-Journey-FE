import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
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
import { tableService } from "core/services/page-services/table-service";

import { isNull } from "lodash";
import { ActionRowType } from "models/Contract";
import { ContractPrinciple } from "models/ContractPrinciple";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { listContractPrincipleStatus } from "../constants";
import {
  ConfirmModalType,
  ContractPrincipleConfirmModal,
} from "../ContractPrincipleConfirmModal/ContractPrincipleConfirmModal";
import {
  ContractPrincipleMaster,
  ContractPrincipleMasterContext,
} from "../ContractPrincipleMasterHook";
import EmptyDataCM from "./Components/EmptyDataCM";
import { TicketCode } from "components";

enum ColumnKey {
  CODE = "code",
  SUPPLIER_NAME = "supplierName",
  MANAGER = "manager",
  EFFECTIVE_DATE = "effectiveDate",
  END_DATE = "endDate",
  CONTRACT_PRINCIPLE_NO = "contractNo",
  NAME = "name",
  TOTAL = "total",
  COST_ITEM = "costGroup",
  STATUS = "status",
}

const columnsWidth = {
  code: 140,
  contractNo: 140,
  name: 350,
  supplierName: 200,
  manager: 140,
  startDate: 112,
  endDate: 112,
  status: 110,
  overflowMenu: 40,
};

const ContractPrincipleMasterTabTable = () => {
  const {
    modelFilter,
    list,
    count,
    loadingList,
    loadingModal,
    handleOnClickRow,
    handleLoadList,
    dispatchFilter,
    selectedModal,
    handleApplyButtonInConfirmModal,
    setSelectedModal,
    getLinkClickRow,
  } = React.useContext<ContractPrincipleMaster>(ContractPrincipleMasterContext);
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<ContractPrinciple>[] = React.useMemo(
    () => [
      {
        title: translate("CT.txt_code_contract_principle"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        ellipsis: true,
        width: columnsWidth.code,
        render(code: string, contractPrincipleItem: ContractPrinciple) {
          return (
            <LayoutCell>
              <TicketCode
                content={code}
                href={getLinkClickRow(contractPrincipleItem)}
              />
            </LayoutCell>
          );
          // return (
          //   <LayoutCell>
          //     <div
          //       onClick={() => {
          //         handleOnClickRow(
          //           contractPrincipleItem,
          //           ActionRowType.VIEW_FROM_MASTER
          //         );
          //       }}
          //     >
          //       <OneLineText
          //         className="text-table-content-primary"
          //         value={code}
          //       />
          //     </div>
          //   </LayoutCell>
          // );
        },
      },

      {
        title: translate("CT.txt_contract_no"),
        key: ColumnKey.CONTRACT_PRINCIPLE_NO,
        dataIndex: ColumnKey.CONTRACT_PRINCIPLE_NO,
        ellipsis: true,
        width: columnsWidth.contractNo,
        render(ContractPrincipleType: string) {
          return (
            <LayoutCell>
              <OneLineText value={ContractPrincipleType} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.txt_contract_principle_name"),
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
        title: translate("CT.txt_supplier"),
        key: ColumnKey.SUPPLIER_NAME,
        dataIndex: ColumnKey.SUPPLIER_NAME,
        ellipsis: true,
        width: columnsWidth.supplierName,
        render(_, ContractPrincipleItem: ContractPrinciple) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                placement="top"
                title={`${ContractPrincipleItem?.supplierTaxCode} - ${ContractPrincipleItem?.supplierName}`}
              >
                <div className="text-in-table-cell">
                  <div className="text-ellipsis">
                    {`${ContractPrincipleItem?.supplierName}`}
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
        render(_, ContractPrincipleItem: ContractPrinciple) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${ContractPrincipleItem?.managerEmail} - ${ContractPrincipleItem?.managerName}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.txt_valid_date"),
        key: ColumnKey.EFFECTIVE_DATE,
        dataIndex: ColumnKey.EFFECTIVE_DATE,
        ellipsis: true,
        width: columnsWidth.startDate,
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
        title: translate("CT.txt_end_date"),
        key: ColumnKey.END_DATE,
        dataIndex: ColumnKey.END_DATE,
        ellipsis: true,
        width: columnsWidth.endDate,
        render(endDate: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  endDate,
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
        render(contractPrincipleStatus: number) {
          const item = listContractPrincipleStatus.find(
            (statusType) => statusType.id === contractPrincipleStatus
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
        render(_, contractPrincipleItem: ContractPrinciple) {
          const list: ListOverflowMenu[] = [
            // VIEW
            {
              title: translate("CM.txt_view"),
              action: () =>
                handleOnClickRow(contractPrincipleItem, ActionRowType.VIEW),

              isShow: contractPrincipleItem.canView,
            },

            // EDIT
            {
              title: translate("CM.txt_editable"),
              action: () =>
                handleOnClickRow(contractPrincipleItem, ActionRowType.EDIT),
              isShow: contractPrincipleItem.canEdit,
            },

            // DELETE
            {
              title: translate("CM.txt_delete"),
              action: () =>
                setSelectedModal({
                  type: ConfirmModalType.DELETE,
                  model: contractPrincipleItem,
                }),
              isShow: contractPrincipleItem.canDelete,
            },

            // CANCEL
            {
              title: translate("CM.txt_cancel"),
              action: () =>
                setSelectedModal({
                  type: ConfirmModalType.CANCEL,
                  model: contractPrincipleItem,
                }),
              isShow: contractPrincipleItem.canCancel,
            },

            // VIEW APPROVAL
            {
              title: translate("CM.txt_view_approval"),
              action: () =>
                handleOnClickRow(
                  contractPrincipleItem,
                  ActionRowType.VIEW,
                  true
                ),
              isShow: contractPrincipleItem.canViewApprove,
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
    [handleOnClickRow, translate]
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
          scroll={{ y: "calc(100vh - 332px)" }}
          idContainer="table-id"
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
                isFilter
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
      </div>

      {!isNull(selectedModal) ? (
        <ContractPrincipleConfirmModal
          type={selectedModal.type}
          model={selectedModal.model}
          errorMessage={selectedModal.errorMessage}
          onApply={handleApplyButtonInConfirmModal}
          onCancel={() => setSelectedModal(null)}
          isLoading={loadingModal}
        />
      ) : null}
    </>
  );
};

export default ContractPrincipleMasterTabTable;
