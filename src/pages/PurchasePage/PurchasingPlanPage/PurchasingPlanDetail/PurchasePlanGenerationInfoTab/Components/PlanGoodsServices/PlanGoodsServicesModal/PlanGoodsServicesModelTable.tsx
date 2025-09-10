import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { EmptyData } from "components";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";
import { useContext, useMemo } from "react";
import {
  Checkbox,
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  GoodsServicesModal,
  PlanGoodsServicesModalContext,
} from "./PlanGoodsServicesModalHook";
import { PurchasePlanGoodsServicesModel } from "models/PurchasingPlan";

export const PlanGoodsServicesModelTable = () => {
  const [translate] = useTranslation();

  const {
    list,
    loadingList,
    rowSelection,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    count,
    setSelectedRowKeys,
    setSelectedRow,
    selectedRowKeys,
    selectedRow,
  } = useContext<GoodsServicesModal>(PlanGoodsServicesModalContext);

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<PurchasePlanGoodsServicesModel>[] = useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_goods_services_code"),
        key: "code",
        dataIndex: "code",
        width: 160,
        sorter: false,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText value={item?.code} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_goods_services_name"),
        key: "name",
        dataIndex: "name",
        sorter: false,
        width: 312,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText value={item?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_goods_services_category"),
        key: "category",
        dataIndex: "category",
        sorter: false,
        width: 250,
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
          <div className="text-left">
            {translate("PL.purchasing_plan_unit")}
          </div>
        ),
        key: "unit",
        dataIndex: "unit",
        sorter: false,
        width: 145,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(item?.unit?.name)} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-right">
            {translate("PL.purchasing_plan_request_quantity")}
          </div>
        ),
        key: "remainingRequestQuantity",
        dataIndex: "remainingRequestQuantity",
        sorter: false,
        width: 132,
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
    ],
    [translate]
  );

  return (
    <>
      <div className="m-t--2xs">
        <StandardTable
          rowKey={"id"}
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: 390 }}
          rowSelection={{
            ...rowSelection,
            renderCell: (
              value: boolean,
              record: PurchasePlanGoodsServicesModel
            ) => {
              return (
                <div className="d-flex justify-content-center align-items-center payment-height_40">
                  <Checkbox
                    checked={value}
                    onChange={(e) => {
                      if (e) {
                        setSelectedRowKeys([...selectedRowKeys, record.id]);
                        setSelectedRow([...selectedRow, record]);
                      } else {
                        setSelectedRowKeys(
                          selectedRowKeys.filter((key) => key !== record.id)
                        );
                        setSelectedRow(
                          selectedRow.filter((item) => item.id !== record.id)
                        );
                      }
                    }}
                  />
                </div>
              );
            },
          }}
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
