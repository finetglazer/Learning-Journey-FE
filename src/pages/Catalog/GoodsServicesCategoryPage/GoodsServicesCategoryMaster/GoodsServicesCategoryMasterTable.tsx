/* eslint-disable react-hooks/exhaustive-deps */
import { ColumnProps } from "antd/lib/table";
import { tableService } from "core/services/page-services/table-service";
import { isEqual } from "lodash";
import { GoodsServicesCategory } from "models/GoodsServicesCategory";
import { useCallback, useContext, useMemo } from "react";
import {
  LayoutCell,
  OverflowMenu,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import "./GoodsServicesCategoryMaster.scss";

import { ChevronDown, ChevronRight } from "@carbon/icons-react";
import { Model } from "react-3layer-common";
import { GoodsServicesCategoryEmptySearchData } from "./GoodsServicesCategoryEmptySearchData";
import {
  GoodsServicesCategoryMasterContext,
  GoodsServicesCategoryMasterContextModel,
} from "./GoodsServicesCategoryMasterHook";

export interface ListOverflowMenu {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  isShow: boolean;
}

export const GoodsServicesCategoryMasterTable = () => {
  const goodsServicesCategoryMaster =
    useContext<GoodsServicesCategoryMasterContextModel>(
      GoodsServicesCategoryMasterContext
    );

  // const history = useHistory();

  const {
    modelFilter,
    dispatchFilter,
    list,

    loadingList,
    handleLoadList,

    handleOpenModal,
    handleCreateFromParent,
    handleOpenModalDelete,
    handleOpenPreviewModal,
    validAction,
  } = goodsServicesCategoryMaster;

  const [translate] = useTranslation();

  const { handleTableChange } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const convertTreeToList = (
    data: GoodsServicesCategory[]
  ): GoodsServicesCategory[] => {
    const result: GoodsServicesCategory[] = [];
    data.forEach((item) => {
      result.push(item);
      if (item.children) {
        result.push(...convertTreeToList(item.children));
      }
    });
    return result;
  };

  const goodsServiceCategories = useMemo(() => {
    return convertTreeToList(list);
  }, [list]);

  const Level: (category: Model) => number = (category: Model) => {
    if (category?.parentId) {
      const filterCategory = goodsServiceCategories?.filter(
        (item) => item?.id === category?.parentId
      );
      if (filterCategory?.length > 0) {
        return Level(filterCategory[0]) + 1;
      } else return 0;
    } else return 0;
  };

  const PADDING = 40;

  const ICON_WIDTH = 18;

  const menu = useCallback(
    (item: GoodsServicesCategory) => {
      const list: ListOverflowMenu[] = [
        //View
        {
          title: translate("generalActions.view"),
          action: () => handleOpenPreviewModal(item?.id),
          isShow: true,
        },
        //Add
        {
          title: translate("generalActions.add"),
          action: () => handleCreateFromParent(item?.id),
          isShow: Level(item) <= 1 && validAction("CREATE"),
        },
        // Edit
        {
          title: translate("generalActions.edit"),
          action: () => handleOpenModal(item?.id),
          isShow: validAction("UPDATE"),
        },
        // Delete
        {
          title: translate("generalActions.delete"),
          action: () => handleOpenModalDelete(item),
          isShow: item?.children?.length === 0 && validAction("DELETE"),
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [translate, handleOpenModal, handleOpenModalDelete, handleCreateFromParent]
  );

  const columns: ColumnProps<GoodsServicesCategory>[] = useMemo(
    () => [
      {
        title: translate("goodsServiceCategories.codeName"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        render(...params: [string, GoodsServicesCategory, number]) {
          return (
            <LayoutCell>
              <div
                style={{
                  paddingLeft: `${
                    Level(params[1]) * PADDING +
                    (params[1]?.children?.length > 0 ? 0 : ICON_WIDTH)
                  }px`,
                }}
              >
                <span>{`${params[0]} -  ${params[1]?.name}`}</span>
              </div>
            </LayoutCell>
          );
        },
      },

      {
        title: translate("goodsServiceCategories.status"),
        key: "isActive",
        dataIndex: "isActive",
        sorter: true,
        width: "200px",
        render(isActive: boolean) {
          const value = isEqual(isActive, true)
            ? translate("goodsServiceCategories.active")
            : translate("goodsServiceCategories.inactive");
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
        render(...params: [string, GoodsServicesCategory, number]) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(params[1])}
            </div>
          );
        },
      },
    ],
    [Level, menu, translate]
  );

  return (
    <>
      {/* List view */}
      <div className="page-master__table">
        <StandardTable
          rowKey="id"
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 282px)" }}
          locale={{
            emptyText: <GoodsServicesCategoryEmptySearchData />,
          }}
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              record.children && record.children?.length > 0 ? (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={(e) => onExpand(record, e)}
                >
                  {expanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </span>
              ) : null,
          }}
        />

        {/* {isEmpty(list) &&
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
        )} */}
      </div>
    </>
  );
};
