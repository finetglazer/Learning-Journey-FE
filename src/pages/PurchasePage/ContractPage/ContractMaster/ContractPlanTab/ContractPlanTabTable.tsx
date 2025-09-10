import { ColumnProps } from "antd/lib/table";
import React from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import { SupplierModel } from "models/Payment";

import { formatDate } from "core/helpers/date-time";

import { EmptyData, TicketCode } from "components";
import { listMenuShoppingType } from "config/const";
import { ActionRowType, ColumnKey, Contract } from "models/Contract";
import { ContractMaster, ContractMasterContext } from "../ContractMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

const columnsWidth = {
  code: 140,
  name: 300,
  formBuy: 152,
  expenseItem: 180,
  updatedDate: 100,
  createUser: 180,
  supplier: 194,
  overflowMenu: 40,
};

const ContractPlanTabTable = () => {
  const [translate] = useTranslation();

  const {
    modelFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    dispatchFilter,
    handleOnClickRowWaitCreateContract,
    getLinkClickRow,
  } = React.useContext<ContractMaster>(ContractMasterContext);

  const { validAction: validActionContract } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "Contract");

  const { validAction: validActionOrder } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "Order");

  const { validAction: validActionOrderHDNT } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "OrderHDNT");

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<Contract>[] = React.useMemo(
    () => [
      {
        title: translate("CT.contract_plan.code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        ellipsis: true,
        width: columnsWidth.code,
        render(code, row) {
          return (
            <LayoutCell>
              <TicketCode
                content={code}
                href={getLinkClickRow(row, ActionRowType.VIEW_SHOPPING_PLAN)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_plan.name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render(name: string) {
          return (
            <LayoutCell>
              <div onClick={() => null}>
                <OneLineText value={name} />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_plan.form"),
        key: ColumnKey.PURCHASE_PLAN_TYPE,
        dataIndex: ColumnKey.PURCHASE_PLAN_TYPE,
        ellipsis: true,
        width: columnsWidth.formBuy,
        render(status: number) {
          const nameFollowStatus = listMenuShoppingType.find(
            (item) => item.code === status
          )?.name;
          return (
            <LayoutCell>
              <OneLineText value={nameFollowStatus} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("CT.contract_plan.expense_item"),
        key: ColumnKey.COSTGROUP,
        dataIndex: ColumnKey.COSTGROUP,
        ellipsis: true,
        width: columnsWidth.formBuy,
        render(record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("CT.approved_date"),
        key: ColumnKey.UPDATE_DATE,
        dataIndex: ColumnKey.UPDATE_DATE,
        ellipsis: true,
        width: columnsWidth.updatedDate,
        render(updatedDate: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(updatedDate, STANDARD_DATE_FORMAT_SLASH)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_plan.create_person"),
        key: ColumnKey.CREATE_PERSON,
        dataIndex: ColumnKey.CREATE_PERSON,
        ellipsis: true,
        width: columnsWidth.createUser,
        render(createUser: string) {
          return (
            <LayoutCell>
              <OneLineText value={createUser} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("CT.contract_plan.supplier"),
        key: ColumnKey.SUPPLIER,
        dataIndex: ColumnKey.SUPPLIER,
        width: columnsWidth.supplier,
        ellipsis: true,
        render(suppliers: SupplierModel[]) {
          let valueSupplier = "";
          if (suppliers) {
            valueSupplier = suppliers
              ?.map((supplier) => supplier.name)
              ?.join(", ");
          }
          return (
            <LayoutCell>
              <OneLineText value={valueSupplier} />
            </LayoutCell>
          );
        },
      },

      // Menu Actions
      {
        title: "",
        width: columnsWidth.overflowMenu,
        render(row) {
          const list =
            row.purchasePlanType === 2
              ? [
                  {
                    title: translate(
                      "CT.contract_plan.create_order_principle_contract"
                    ),
                    action: () =>
                      handleOnClickRowWaitCreateContract(
                        row,
                        ActionRowType.CREATE_PRINCIPLE
                      ),
                    isShow: validActionOrderHDNT("CREATE"),
                  },
                ]
              : [
                  {
                    title: translate("CT.contract_plan.create_order"),
                    action: () =>
                      handleOnClickRowWaitCreateContract(
                        row,
                        ActionRowType.CREATE_ORDER
                      ),
                    isShow: validActionOrder("CREATE"),
                  },
                  {
                    title: translate("CT.contract_plan.create_contract"),
                    action: () =>
                      handleOnClickRowWaitCreateContract(
                        row,
                        ActionRowType.CREATE_CONTRACT
                      ),
                    isShow: validActionContract("CREATE"),
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
    [handleOnClickRowWaitCreateContract, translate, validActionContract]
  );

  return (
    <div className="page-master__table">
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        columns={columns}
        dataSource={list}
        isDragable={true}
        loading={loadingList}
        scroll={{ y: "calc(100vh - 350px)" }}
        idContainer="contract-plan-id"
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
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={count}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </div>
  );
};

export default ContractPlanTabTable;
