import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import { gt, isEmpty, isEqual } from "lodash";
import { CostLineCostItem } from "models/CostLineCostItem";
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
import { CostLineCostItemEmptySearchData } from "./CostLineCostItemEmptySearchData";
import "./CostLineCostItemMaster.scss";
import {
  CostLineCostItemMasterContext,
  CostLineCostItemMasterContextModel,
} from "./CostLineCostItemMasterHook";

export interface ListOverflowMenu {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  isShow: boolean;
}
export const CostLineCostItemMasterTable = () => {
  const costLineCostItemMaster = useContext<CostLineCostItemMasterContextModel>(
    CostLineCostItemMasterContext
  );

  // const history = useHistory();

  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    countFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleGoDetail,
    handleOpenModalDelete,
    handleOpenModalPreview,
    validAction,
  } = costLineCostItemMaster;

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (item: CostLineCostItem) => {
      const list: ListOverflowMenu[] = [
        // Preview
        {
          title: translate("generalActions.preview"),
          action: () => handleOpenModalPreview(item?.costLineId),
          isShow: true,
        },
        // Edit
        {
          title: translate("generalActions.edit"),
          action: () => handleGoDetail(item?.costLineId),
          isShow: validAction("UPDATE"),
        },
        // Delete
        {
          title: translate("generalActions.delete"),
          action: () => handleOpenModalDelete(item),
          isShow: item?.isUsed || !validAction("DELETE") ? false : true,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [
      translate,
      validAction,
      handleOpenModalPreview,
      handleGoDetail,
      handleOpenModalDelete,
    ]
  );

  const columns: ColumnProps<CostLineCostItem>[] = useMemo(
    () => [
      {
        title: translate("costLineCostItems.costLineCode"),
        key: "costLineCode",
        dataIndex: "costLineCode",
        sorter: false,
        render(...params: [string, CostLineCostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("costLineCostItems.costLineName"),
        key: "costLineName",
        dataIndex: "costLineName",
        sorter: false,
        render(...params: [string, CostLineCostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("costLineCostItems.costItem"),
        key: "costItemCode",
        dataIndex: "costItemCode",
        sorter: false,
        render(...params: [string, CostLineCostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${params[0]}-${params[1]?.costItemName}`}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("costLineCostItems.status"),
        key: "isActive",
        dataIndex: "isActive",
        sorter: false,
        width: "200px",
        render(...params: [boolean, CostLineCostItem, number]) {
          const value = isEqual(params[0], true)
            ? translate("costLineCostItems.active")
            : translate("costLineCostItems.inactive");
          const statusValue = isEqual(params[0], true) ? "SUCCESS" : "DEFAULT";

          return (
            <LayoutCell>
              <Tag
                size="md"
                value={value}
                status={statusValue}
                isShowDot={false}
                isShowBorder={true}
              />
            </LayoutCell>
          );
        },
      },

      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: 40,
        align: "center",
        render(id: number, record: CostLineCostItem) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [menu, translate]
  );

  return (
    <>
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => handleOpenModalDelete(undefined)}
        >
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>
      {/* List view */}
      <div className="page-master__table">
        <StandardTable
          rowKey="id"
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          scroll={{ y: "calc(100vh - 326px)" }}
          onChange={handleTableChange}
          locale={{
            emptyText: <CostLineCostItemEmptySearchData />,
          }}
        />

        {isEmpty(list) &&
        (!isEmpty(modelFilter.search) || gt(countFilter, 0)) ? null : (
          <div className="page-master__pagination">
            <Pagination
              pageIndex={modelFilter.pageIndex}
              pageSize={modelFilter.pageSize}
              total={count}
              onChange={handlePagination}
              pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
            />
          </div>
        )}
      </div>
    </>
  );
};
