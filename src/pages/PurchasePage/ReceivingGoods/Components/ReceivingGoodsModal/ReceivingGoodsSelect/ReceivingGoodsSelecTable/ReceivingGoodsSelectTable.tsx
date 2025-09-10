import type { ColumnProps } from "antd/es/table";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  EMPTY_WIDTH_400,
  TABLE_ROW_KEY,
} from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";
import {
  ContractGoodsItem,
  GoodsReceiptRequestItem,
} from "models/ReceivingGood/GoodsReceipt";
import { ProjectModalEmptySearchData } from "pages/BudgetPage/BudgetSettlementCreate/Components/ProjectModal/ProjectModalEmptySearchData";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ReceivingGoodsSelectHooksContext } from "../ReceivingGoodsSelectHooks";

const columnsWidth = {
  GOOD_NAME: 300,
  MANUFACTURER_NAME: 160,
  UNIT: 160,
  QUANTITY: 135,
};

export const ReceivingGoodsSelectTable = () => {
  const [translate] = useTranslation();
  const {
    list,
    count,
    modelFilter,
    rowSelection,
    loadingList,
    dispatchFilter,
    handleLoadList,
  } = useContext(ReceivingGoodsSelectHooksContext);

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<GoodsReceiptRequestItem>[] = useMemo(
    () => [
      {
        title: translate("RG.txt_goods_services"),
        width: columnsWidth.GOOD_NAME,
        dataIndex: "contractGoodsItem",
        key: "contractGoodsItem",
        render(contractGoodsItem: ContractGoodsItem) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={contractGoodsItem?.goodsInfo?.name}
                valueLine2={contractGoodsItem?.goodsInfo?.code}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("RG.txt_brand_type"),
        width: columnsWidth.MANUFACTURER_NAME,
        dataIndex: "contractGoodsItem",
        key: "contractGoodsItem",
        render(contractGoodsItem: ContractGoodsItem) {
          return (
            <LayoutCell>
              <OneLineText value={contractGoodsItem?.manufacturerInfo?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("RG.txt_moving_service_good"),
        key: "contractGoodsItem",
        dataIndex: "contractGoodsItem",
        render(contractGoodsItem: ContractGoodsItem) {
          return (
            <LayoutCell>
              <OneLineText value={contractGoodsItem?.description} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("RG.txt_unit_of_measure"),
        width: columnsWidth.UNIT,
        key: "contractGoodsItem",
        dataIndex: "contractGoodsItem",
        render(contractGoodsItem: ContractGoodsItem) {
          return (
            <LayoutCell>
              <OneLineText
                value={contractGoodsItem?.goodsInfo?.goodsServiceUnit?.name}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-end">
            {translate("RG.txt_quantity_contract")}
          </div>
        ),
        width: columnsWidth.QUANTITY,
        dataIndex: "qualityByContract",
        key: "qualityByContract",
        render(qualityByContract: number) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(qualityByContract)} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, modelFilter]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          loading={loadingList}
          rowKey={TABLE_ROW_KEY}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          scroll={{ y: EMPTY_WIDTH_400 }}
          locale={{
            emptyText: <ProjectModalEmptySearchData />,
          }}
        />
        <div className="page-master__pagination">
          <Pagination
            pageIndex={modelFilter.pageIndex}
            pageSize={modelFilter.pageSize}
            total={count}
            onChange={handlePagination}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>
      </div>
    </>
  );
};
