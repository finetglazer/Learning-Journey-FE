import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import { gt, isEmpty, isEqual } from "lodash";
import { CostItemGoodsServices } from "models/CostItemGoodsServices";
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
import { CostItemGoodsServicesEmptySearchData } from "./CostItemGoodsServicesEmptySearchData";
import "./CostItemGoodsServicesMaster.scss";
import {
  CostItemGoodsServicesMasterContext,
  CostItemGoodsServicesMasterContextModel,
} from "./CostItemGoodsServicesMasterHook";

export interface ListOverflowMenu {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  isShow: boolean;
}
export const CostItemGoodsServicesMasterTable = () => {
  const costItemGoodsServicesMaster =
    useContext<CostItemGoodsServicesMasterContextModel>(
      CostItemGoodsServicesMasterContext
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
  } = costItemGoodsServicesMaster;

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (item: CostItemGoodsServices) => {
      const list: ListOverflowMenu[] = [
        // Preview
        {
          title: translate("generalActions.preview"),
          action: () => handleOpenModalPreview(item?.costItemId),
          isShow: true,
        },
        // Edit
        {
          title: translate("generalActions.edit"),
          action: () => handleGoDetail(item?.costItemId),
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

  const columns: ColumnProps<CostItemGoodsServices>[] = useMemo(
    () => [
      {
        title: translate("costItemGoodsServices.costItemCode"),
        key: "costItemCode",
        dataIndex: "costItemCode",
        sorter: true,
        render(...params: [string, CostItemGoodsServices, number]) {
          return (
            <LayoutCell>
              <div
                className="w-100"
                onClick={() => handleOpenModalPreview(params[1]?.costItemId)}
              >
                <OneLineText
                  className="text-table-content-primary"
                  value={params[0]}
                  useTooltip
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("costItemGoodsServices.costItemName"),
        key: "costItemName",
        dataIndex: "costItemName",
        sorter: true,
        render(...params: [string, CostItemGoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("costItemGoodsServices.goodServices"),
        key: "goodServiceCode",
        dataIndex: "goodServiceCode",
        sorter: true,
        render(...params: [string, CostItemGoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  params[0] && params[0]?.length > 0
                    ? `${params[0]}-${params[1]?.goodServiceName}`
                    : null
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("costItemGoodsServices.status"),
        key: "isActive",
        dataIndex: "isActive",
        sorter: true,
        width: "200px",
        render(...params: [boolean, CostItemGoodsServices, number]) {
          const value = isEqual(params[0], true)
            ? translate("costItemGoodsServices.active")
            : translate("costItemGoodsServices.inactive");
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
        render(id: number, record: CostItemGoodsServices) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [handleOpenModalPreview, menu, translate]
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
            emptyText: <CostItemGoodsServicesEmptySearchData />,
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
