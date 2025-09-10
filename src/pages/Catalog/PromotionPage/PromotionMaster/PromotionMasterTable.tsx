import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { tableService } from "core/services/page-services/table-service";
import { Dayjs } from "dayjs";
import { gt, isEmpty, isEqual } from "lodash";
import { Promotion } from "models/Promotion";
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

import "./PromotionMaster.scss";

import {
  PromotionMasterContext,
  PromotionMasterContextModel,
} from "./PromotionMasterHook";
import { PromotionEmptySearchData } from "./PromotionEmptySearchData";
import { formatNumber } from "core/helpers/number";
import { listPromotionType } from "../PromotionConstant";
export interface ListOverflowMenu {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  isShow: boolean;
}
export const PromotionMasterTable = () => {
  const promotionMaster = useContext<PromotionMasterContextModel>(
    PromotionMasterContext
  );

  // const history = useHistory();

  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleLoadList,
    countFilter,
    handleOpenModal,
    handleOpenModalDelete,
    validAction,
  } = promotionMaster;

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (item: Promotion) => {
      const list: ListOverflowMenu[] = [
        // preview
        {
          title: translate("generalActions.preview"),
          action: () => handleOpenModal(item?.id, "preview"),
          isShow: true,
        },
        // Edit
        {
          title: translate("generalActions.edit"),
          action: () => handleOpenModal(item?.id, "detail"),
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
    [translate, validAction, handleOpenModal, handleOpenModalDelete]
  );

  const columns: ColumnProps<Promotion>[] = useMemo(
    () => [
      {
        title: translate("promotions.code"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        render(...params: [string, Promotion, number]) {
          return (
            <LayoutCell>
              <div
                className="w-100"
                onClick={() => handleOpenModal(params[1]?.id, "preview")}
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
        title: translate("promotions.name"),
        key: "name",
        dataIndex: "name",
        sorter: true,
        render(...params: [string, Promotion, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("promotions.promotionType"),
        key: "promotionType",
        dataIndex: "promotionType",
        sorter: true,
        render(...params: [string, Promotion, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={listPromotionType[Number(params[0])]?.name}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("promotions.startDate"),
        key: "startDate",
        dataIndex: "startDate",
        sorter: true,
        render(...params: [Dayjs, Promotion, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatDate(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("promotions.endDate"),
        key: "endDate",
        dataIndex: "endDate",
        sorter: true,
        render(...params: [Dayjs, Promotion, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={params[0] ? formatDate(params[0]) : ""}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("promotions.budget"),
        key: "budget",
        dataIndex: "budget",
        sorter: true,
        render(...params: [number, Promotion, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={params[0] ? formatNumber(params[0]) : null}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("promotions.status"),
        key: "isActive",
        dataIndex: "isActive",
        sorter: true,
        width: "200px",
        render(isActive: boolean) {
          const value = isEqual(isActive, true)
            ? translate("promotions.active")
            : translate("promotions.inactive");
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
        render(id: number, record: Promotion) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [handleOpenModal, menu, translate]
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
          onChange={handleTableChange}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          scroll={{ y: "calc(100vh - 326px)" }}
          locale={{
            emptyText: <PromotionEmptySearchData />,
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
