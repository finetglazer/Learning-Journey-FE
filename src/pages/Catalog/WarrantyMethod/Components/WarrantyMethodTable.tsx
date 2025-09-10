import { ColumnProps } from "antd/lib/table";
import { EmptyData } from "components";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import { isEqual } from "lodash";
import { WarrantyMethod } from "models/WarrantyMethod/WarrantyMethod";
import { WarrantyMethodFilter } from "models/WarrantyMethod/WarrantyMethodFilter";
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
import {
  ConfirmModalType,
  WarrantyMethodContext,
  WarrantyMethodHooks,
} from "../WarrantyMethodMasterHooks";

const TABLE_ROW_KEY = "id";

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  DESCRIPTION = "description",
  STATUS = "isActive",
}

const columnsWidth = {
  code: 200,
  name: 350,
  status: 150,
  overflowMenu: 40,
};

const WIDTH_400 = 400;

interface ListOverflowMenu {
  title: string;
  action: (params?: ConfirmModalType) => void;
  isShow: boolean;
}

export const WarrantyMethodTable = () => {
  const {
    list,
    count,
    loadingList,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    dispatchFilter,
    handleLoadList,
    setModalType,
    validAction,
  } = useContext<WarrantyMethodHooks>(WarrantyMethodContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );
  const navigateToDetail = useCallback(
    (id: string) => {
      setModalType({ type: ConfirmModalType.DETAIL, id });
    },
    [setModalType]
  );

  const columns: ColumnProps<WarrantyMethod>[] = useMemo(
    () => [
      {
        title: translate("WM.txt_warranty_method_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        ellipsis: true,
        width: columnsWidth.code,
        sorter: true,
        sortOrder: getAntOrderType<WarrantyMethod, WarrantyMethodFilter>(
          modelFilter,
          "code"
        ),
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
        title: translate("WM.txt_warranty_method_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        sorter: true,
        sortOrder: getAntOrderType<WarrantyMethod, WarrantyMethodFilter>(
          modelFilter,
          "name"
        ),
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("WM.txt_warranty_method_describe"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
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
        title: translate("WM.txt_status"),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        ellipsis: true,
        width: columnsWidth.status,
        sorter: true,
        sortOrder: getAntOrderType<WarrantyMethod, WarrantyMethodFilter>(
          modelFilter,
          ColumnKey.STATUS
        ),
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
        render(_, row: WarrantyMethod) {
          const items: ListOverflowMenu[] = [
            {
              title: translate("CM.txt_view"),
              action: () => navigateToDetail(row?.id),
              isShow: true,
            },
            {
              title: translate("CM.txt_editable"),
              action: () =>
                setModalType({ type: ConfirmModalType.EDIT, id: row?.id }),
              isShow: validAction("UPDATE"),
            },
            {
              title: translate("CM.txt_delete"),
              action: () =>
                setModalType({ type: ConfirmModalType.DELETE, id: row?.id }),
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
    setModalType({ type: ConfirmModalType.DELETE });
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
          isDragable={true}
          loading={loadingList}
          columns={columns}
          dataSource={list}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 326px)" }}
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
