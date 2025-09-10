import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import { gt, isEmpty, isEqual } from "lodash";
import { GoodServiceType } from "models/GoodServiceType";
import { GoodsServices } from "models/GoodsServices";
import { GoodsServicesCategory } from "models/GoodsServicesCategory";
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
import { GoodsServicesEmptySearchData } from "./GoodsServicesEmptySearchData";
import "./GoodsServicesMaster.scss";
import {
  GoodsServicesMasterContext,
  GoodsServicesMasterContextModel,
} from "./GoodsServicesMasterHook";

export interface ListOverflowMenu {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  isShow: boolean;
}
export const GoodsServicesMasterTable = () => {
  const goodsServicesMaster = useContext<GoodsServicesMasterContextModel>(
    GoodsServicesMasterContext
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
    handleGoPreview,
    handleOpenModalDelete,
    validAction,
  } = goodsServicesMaster;

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (item: GoodsServices) => {
      const list: ListOverflowMenu[] = [
        //Preview
        {
          title: translate("generalActions.preview"),
          action: () => handleGoPreview(item?.id),
          isShow: true,
        },
        // Edit
        {
          title: translate("generalActions.edit"),
          action: () => handleGoDetail(item?.id),
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
      handleGoPreview,
      handleGoDetail,
      handleOpenModalDelete,
    ]
  );

  const columns: ColumnProps<GoodsServices>[] = useMemo(
    () => [
      {
        title: translate("goodsServices.code"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        render(...params: [string, GoodsServices, number]) {
          return (
            <LayoutCell>
              <div
                className="w-100"
                onClick={() => handleGoPreview(params[1]?.id, false)}
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
        title: translate("goodsServices.name"),
        key: "name",
        dataIndex: "name",
        sorter: true,
        render(...params: [string, GoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("goodsServices.goodsServiceCategory"),
        key: "goodsServicesCategory",
        dataIndex: "goodsServicesCategory",
        sorter: true,
        render(...params: [GoodsServicesCategory, GoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]?.name} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("goodsServices.goodsServicesType"),
        key: "goodServiceType",
        dataIndex: "goodServiceType",
        sorter: true,
        render(...params: [GoodServiceType, GoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]?.name} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("goodsServices.description"),
        key: "description",
        dataIndex: "description",
        sorter: true,
        render(...params: [string, GoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("goodsServices.status"),
        key: "isActive",
        dataIndex: "isActive",
        sorter: true,
        width: "200px",
        render(isActive: boolean) {
          const value = isEqual(isActive, true)
            ? translate("goodsServices.active")
            : translate("goodsServices.inactive");
          const statusValue = isEqual(isActive, true) ? "SUCCESS" : "DEFAULT";

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
        render(id: number, record: GoodsServices) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [handleGoPreview, menu, translate]
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
            emptyText: <GoodsServicesEmptySearchData />,
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
