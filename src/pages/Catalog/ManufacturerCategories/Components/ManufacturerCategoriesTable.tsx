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
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import {
  ManufacturerCategories,
  ManufacturerCategoriesFilter,
} from "models/ManufacturerCategories";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import {
  ManufacturerCategoriesContext,
  ManufacturerCategoriesContextProps,
} from "../ManufacturerCategoriesMaster/ManufacturerCategoriesMasterHook";

const TABLE_ROW_KEY = "id";
const WIDTH_400 = 400;
enum ColumnKey {
  CODE = "code",
  NAME = "name",
  DESCRIPTION = "description",
  STATUS = "isActive",
}

const columnsWidth = {
  code: 260,
  name: 260,
  status: 150,
  overflowMenu: 40,
};

export const ManufacturerCategoriesTable = () => {
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
  } = useContext<ManufacturerCategoriesContextProps>(
    ManufacturerCategoriesContext
  );

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

  const columns: ColumnProps<ManufacturerCategories>[] = useMemo(
    () => [
      {
        title: translate("MC.txt_manufacturer_categories_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        sorter: true,
        sortOrder: getAntOrderType<
          ManufacturerCategories,
          ManufacturerCategoriesFilter
        >(modelFilter, "code"),
        ellipsis: true,
        width: columnsWidth.code,
        render(code: string, { id }) {
          return (
            <LayoutCell>
              <div className="w-full" onClick={() => navigateToDetail(id)}>
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
        title: translate("MC.txt_manufacturer_categories_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        sorter: true,
        sortOrder: getAntOrderType<
          ManufacturerCategories,
          ManufacturerCategoriesFilter
        >(modelFilter, "name"),
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
        title: translate("MC.txt_manufacturer_categories_description"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
        sortOrder: getAntOrderType<
          ManufacturerCategories,
          ManufacturerCategoriesFilter
        >(modelFilter, "description"),
        ellipsis: true,
        render(description: string) {
          return (
            <LayoutCell>
              <OneLineText value={description} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("CM.txt_status"),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        sorter: true,
        sortOrder: getAntOrderType<
          ManufacturerCategories,
          ManufacturerCategoriesFilter
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
        render(_, row: ManufacturerCategories) {
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
