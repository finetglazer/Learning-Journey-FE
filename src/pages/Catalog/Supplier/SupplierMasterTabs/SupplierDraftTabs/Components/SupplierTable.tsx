import { ColumnProps } from "antd/lib/table";
import { EmptyData } from "components";
import { SUPPLIER_DETAIL_ROUTE, SUPPLIER_VIEW_ROUTE } from "config/route-const";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { getStatus } from "core/helpers/status";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import { SupplierFilter } from "models/Payment";
import { Supplier, SupplierType } from "models/Supplier/Supplier";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import {
  SupplierContext,
  SupplierContextType,
} from "pages/Catalog/Supplier/context";
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
import { useHistory } from "react-router";

const TABLE_ROW_KEY = "id";

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  ADDRESS = "address",
  PROVINCE = "provinceName",
  NATION = "nationName",
  TYPE = "supplierType",
  ACCOUNT = "hasAccount",
  STATUS = "isActive",
}

const WIDTH_140 = 140;

const columnsWidth = {
  code: WIDTH_140,
  province: WIDTH_140,
  nation: WIDTH_140,
  type: 160,
  account: WIDTH_140,
  status: 140,
  overflowMenu: 40,
};

const WIDTH_400 = 400;

export const SupplierTable = () => {
  const {
    list,
    count,
    loadingList,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    handleOpenAccountModal,
    validAction,
  } = useContext<SupplierContextType>(SupplierContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const history = useHistory();

  const navigateToDetail = useCallback(
    (id: string) => {
      if (id) {
        history.push(SUPPLIER_DETAIL_ROUTE + `/${id}`);
      } else history.push(SUPPLIER_DETAIL_ROUTE);
    },
    [history]
  );

  const navigateToView = useCallback(
    (id: string) => {
      history.push(SUPPLIER_VIEW_ROUTE + `/${id}`);
    },
    [history]
  );
  const columns: ColumnProps<Supplier>[] = useMemo(
    () => [
      {
        title: translate("SL.txt_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          "code"
        ),
        ellipsis: true,
        width: columnsWidth.code,
        render(code: string, { id }) {
          return (
            <LayoutCell>
              <div className="w-full" onClick={() => navigateToView(id)}>
                <OneLineText
                  value={code}
                  className="text-table-content-primary"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.txt_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          "name"
        ),
        ellipsis: true,
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.txt_address"),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          ColumnKey.ADDRESS
        ),
        ellipsis: true,
        render(address: string) {
          return (
            <LayoutCell>
              <OneLineText value={address} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.txt_city"),
        key: ColumnKey.PROVINCE,
        dataIndex: ColumnKey.PROVINCE,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          ColumnKey.PROVINCE
        ),
        ellipsis: true,
        width: columnsWidth.province,
        render(province: string) {
          return (
            <LayoutCell>
              <OneLineText value={province} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.txt_nation"),
        key: ColumnKey.NATION,
        dataIndex: ColumnKey.NATION,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          ColumnKey.NATION
        ),
        ellipsis: true,
        width: columnsWidth.nation,
        render(nation: string) {
          return (
            <LayoutCell>
              <OneLineText value={nation} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("SL.txt_type"),
        key: ColumnKey.TYPE,
        dataIndex: ColumnKey.TYPE,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          ColumnKey.TYPE
        ),
        ellipsis: true,
        width: columnsWidth.type,
        render(type: SupplierType) {
          return (
            <LayoutCell>
              <OneLineText value={type?.name} />
            </LayoutCell>
          );
        },
      },

      // Account
      {
        title: translate("SL.txt_account"),
        key: ColumnKey.ACCOUNT,
        dataIndex: ColumnKey.ACCOUNT,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          ColumnKey.STATUS
        ),
        ellipsis: true,
        width: columnsWidth.account,
        render(hasAccount: boolean) {
          const value = translate(
            `SL.${
              hasAccount ? "txt_have_been_account" : "txt_have_not_account"
            }`
          );
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      // Status
      {
        title: translate("CM.txt_status"),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          ColumnKey.STATUS
        ),
        ellipsis: true,
        width: columnsWidth.status,
        render(status: boolean) {
          const value = getStatus(status);
          return (
            <LayoutCell>
              <Tag
                size="md"
                value={translate(value.keyI18n)}
                status={value.type}
                isShowDot={false}
                isShowBorder
              />
            </LayoutCell>
          );
        },
      },

      // Overflow menu container
      {
        title: "",
        width: columnsWidth.overflowMenu,
        render(_, row: Supplier) {
          const items: ListOverflowMenu[] = [
            {
              title: translate("generalActions.preview"),
              action: () => navigateToView(row?.id),
              isShow: true,
            },
            {
              title: translate("CM.txt_editable"),
              action: () => navigateToDetail(row?.id),
              isShow: validAction("UPDATE"),
            },
            {
              title: translate("generalActions.addAccount"),
              action: () => handleOpenAccountModal(row?.id, "CREATE"),
              isShow:
                row?.isActive &&
                !row?.canRecoverAccount &&
                validAction("UPDATE"),
            },
            {
              title: translate("generalActions.recoverAccount"),
              action: () => handleOpenAccountModal(row?.id, "RECOVER"),
              isShow:
                row?.isActive &&
                row?.canRecoverAccount &&
                validAction("UPDATE"),
            },
          ];
          return (
            <LayoutCell>
              <OverflowMenu list={items} />
            </LayoutCell>
          );
        },
      },
    ],
    [
      handleOpenAccountModal,
      modelFilter,
      navigateToDetail,
      navigateToView,
      translate,
      validAction,
    ]
  );

  return (
    <>
      <div className="page-master__table">
        {/* Table */}
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 387px)" }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
              />
            ),
          }}
        />
        {/* Pagination */}
        <Pagination
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={count}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </>
  );
};
