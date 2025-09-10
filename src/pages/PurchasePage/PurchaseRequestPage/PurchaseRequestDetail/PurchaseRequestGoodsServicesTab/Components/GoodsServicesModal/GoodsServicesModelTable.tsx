import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { EmptyData } from "components";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";
import { GoodsServices } from "models/PurchaseRequest";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  GoodsServicesModal,
  GoodsServicesModalContext,
} from "./GoodsServicesModalHook";

export const GoodsServicesModelTable = () => {
  const [translate] = useTranslation();

  const {
    list,
    loadingList,
    rowSelection,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    count,
  } = useContext<GoodsServicesModal>(GoodsServicesModalContext);

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<GoodsServices>[] = useMemo(
    () => [
      {
        title: translate("PR.goods_services"),
        key: "code",
        dataIndex: "code",
        width: 180,
        sorter: false,
        render(_, item) {
          return (
            <LayoutCell>
              <TwoLineText
                classNameFirstLine="text-first__style"
                classNameSecondLine="text-second__style"
                valueLine1={item?.name}
                valueLine2={item?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.unit"),
        key: "unit",
        dataIndex: "unit",
        sorter: false,
        width: 90,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText value={item?.unit?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.goods_services_list"),
        key: "category",
        dataIndex: "category",
        sorter: false,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText value={item?.category?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-right">{translate("PR.remaining_quantity")}</div>
        ),
        key: "remainingRequestQuantity",
        dataIndex: "remainingRequestQuantity",
        width: 164,
        sorter: false,
        render(_, item) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatNumber(item?.remainingRequestQuantity)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-right">{translate("PR.policy_quantity")}</div>
        ),
        key: "originalQuantity",
        dataIndex: "originalQuantity",
        sorter: false,
        width: 132,
        render(_, item) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(item?.originalQuantity)} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-right">{translate("PR.purchased_quantity")}</div>
        ),
        key: "registeredQuantity",
        dataIndex: "registeredQuantity",
        sorter: false,
        width: 100,
        render(_, item) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(item?.registeredQuantity)} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <>
      <div className="m-t--xs">
        <StandardTable
          rowKey="id"
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 546px)" }}
          rowSelection={rowSelection}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                icon={IcEmptySearchSvg}
                height={576}
              >
                <></>
              </EmptyData>
            ),
          }}
        />
      </div>
      <div>
        <Pagination
          total={count}
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          onChange={handlePagination}
        />
      </div>
    </>
  );
};
