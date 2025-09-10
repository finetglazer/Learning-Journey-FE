import { ColumnProps } from "antd/lib/table";
import { isEqual } from "lodash";
import { useCallback, useContext, useMemo } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { EmptyData } from "components";
import { DEFAULT_PAGE_SIZE_OPTION, TABLE_ROW_KEY } from "core/config/consts";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import {
  CentralPurchaseUnit,
  CentralPurchaseUnitFilter,
} from "models/CentralPurchaseUnit";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import {
  CentralPurchaseUnitContext,
  CentralPurchaseUnitContextProps,
} from "../CentralPurchaseUnitMaster/CentralPurchaseUnitMasterHook";

const WIDTH_400 = 400;
enum ColumnKey {
  CODE = "code",
  NAME = "name",
  ORGANIZATION = "organization",
  STATUS = "isActive",
}

const columnsWidth = {
  code: 280,
  status: 240,
  overflowMenu: 40,
};

export const CentralPurchaseUnitTable = () => {
  const {
    loadingList,
    list,
    count,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    dispatchFilter,
    handleLoadList,
    setModalType,
    validAction,
  } = useContext<CentralPurchaseUnitContextProps>(CentralPurchaseUnitContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const navigateToDetail = useCallback(
    (id: string) => {
      setModalType({ type: "DETAIL", id });
    },
    [setModalType]
  );

  const columns: ColumnProps<CentralPurchaseUnit>[] = useMemo(
    () => [
      {
        title: translate("CPU.txt_central_purchase_unit_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        sorter: true,
        sortOrder: getAntOrderType<
          CentralPurchaseUnit,
          CentralPurchaseUnitFilter
        >(modelFilter, ColumnKey.CODE),
        ellipsis: true,
        width: columnsWidth.code,
        render(_, centralPurchaseUnit: CentralPurchaseUnit) {
          return (
            <LayoutCell>
              <div
                className="w-full"
                onClick={() => navigateToDetail(centralPurchaseUnit?.id)}
              >
                <OneLineText
                  value={centralPurchaseUnit?.organization?.code}
                  className="text-table-content-primary"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPU.txt_central_purchase_unit_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        sorter: true,
        sortOrder: getAntOrderType<
          CentralPurchaseUnit,
          CentralPurchaseUnitFilter
        >(modelFilter, ColumnKey.NAME),
        ellipsis: true,
        render(_, centralPurchaseUnit: CentralPurchaseUnit) {
          return (
            <LayoutCell>
              <OneLineText value={centralPurchaseUnit?.organization?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("CPU.txt_status"),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        sorter: true,
        sortOrder: getAntOrderType<
          CentralPurchaseUnit,
          CentralPurchaseUnitFilter
        >(modelFilter, ColumnKey.STATUS),
        ellipsis: true,
        width: columnsWidth.status,
        render(status: boolean) {
          const translateKey = isEqual(status, true)
            ? "CM.txt_status_active"
            : "CM.txt_status_deactivate";
          const value = translate(translateKey);
          const statusValue = isEqual(status, true) ? "SUCCESS" : "DEFAULT";
          return (
            <LayoutCell>
              <Tag
                size="md"
                value={value}
                status={statusValue}
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
        render(_, row: CentralPurchaseUnit) {
          const items: ListOverflowMenu[] = [
            {
              title: translate("CM.txt_view"),
              action: () => navigateToDetail(row?.id),
              isShow: true,
            },
            {
              title: translate("CM.txt_editable"),
              action: () => setModalType({ type: "EDIT", id: row?.id }),
              isShow: validAction("UPDATE"),
            },
            {
              title: translate("CM.txt_delete"),
              action: () => setModalType({ type: "DELETE", id: row?.id }),
              isShow: row?.isUsed || !validAction("DELETE") ? false : true,
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
    [modelFilter, navigateToDetail, setModalType, translate, validAction]
  );

  const handleBulkDelete = useCallback(() => {
    setModalType({ type: "DELETE" });
  }, [setModalType]);

  return (
    <>
      {/* Action control */}
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button type="secondary" size="sm" onClick={handleBulkDelete}>
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>

      <div className="page-master__table">
        {/* Table */}
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          scroll={{ y: "calc(100vh - 326px)" }}
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
        {/* Pagination */}
        <Pagination
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={count}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          onChange={handlePagination}
        />
      </div>
    </>
  );
};
