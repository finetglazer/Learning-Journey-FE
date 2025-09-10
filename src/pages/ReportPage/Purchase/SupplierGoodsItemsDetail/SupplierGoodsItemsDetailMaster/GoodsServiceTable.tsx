import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ColumnProps } from "antd/lib/table";
import { GoodsItem } from "models/Report/PurchasePlanDetail";
import { isNil } from "lodash";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { ModelFilter } from "react-3layer-common";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import dayjs from "dayjs";
import { formatNumber } from "core/helpers/number";

interface GoodsServiceTableProps {
  data: any;
  loadingList?: boolean;
  modelFilter?: ModelFilter;
  onPagination?: (pageIndex: number, pageSize: number) => void;
}

const GoodsServiceTable: React.FC<GoodsServiceTableProps> = ({
  data,
  loadingList,
  onPagination,
  modelFilter,
}) => {
  const [translate] = useTranslation();

  const paginationProps = {
    pageIndex: modelFilter?.pageIndex,
    pageSize: modelFilter?.pageSize,
    total: data?.totalRecords,
    onChange: onPagination,
    pageSizeOptions: DEFAULT_PAGE_SIZE_OPTION,
  };

  const columns: ColumnProps<GoodsItem>[] = [
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_index"
      ),
      key: "stt",
      dataIndex: "stt",
      width: 50,
      ellipsis: true,
      render: (i, record, index: number) => {
        return (
          <LayoutCell>
            <OneLineText value={`${index + 1}`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_created_date"
      ),
      width: 100,
      dataIndex: "createdDate",
      key: "createdDate",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={dayjs(value).format("DD/MM/YYYY")} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_contract_code"
      ),
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_contract_name"
      ),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_contract_no"
      ),
      dataIndex: "contractNo",
      key: "contractNo",
      width: 150,
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_contract_type"
      ),
      dataIndex: "contractType",
      key: "contractType",
      width: 150,
      render: (contractType) => {
        return (
          <LayoutCell>
            <OneLineText value={contractType?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_contract_approvedDate"
      ),
      dataIndex: "approvedDate",
      key: "approvedDate",
      width: 100,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={dayjs(value).format("DD/MM/YYYY")} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goodsCategory_name"
      ),
      dataIndex: "goodsCategory",
      key: "goodsCategory",
      width: 160,
      render(goodsCategory) {
        return (
          <LayoutCell>
            <OneLineText value={goodsCategory.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_code"
      ),
      dataIndex: "goodsCode",
      key: "goodsCode",
      align: "center",
      width: 145,
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_name"
      ),
      dataIndex: "goodsName",
      key: "goodsName",
      width: 170,
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_unit"
      ),
      dataIndex: "goodsUnit",
      key: "goodsUnit",
      width: 170,
      render(goodsUnit) {
        return (
          <LayoutCell>
            <OneLineText value={goodsUnit.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_quantity"
      ),
      dataIndex: "goodsName",
      key: "goodsName",
      width: 170,
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_unitPrice"
      ),
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 170,
      render: (unitPrice) => {
        return (
          <LayoutCell>
            <OneLineText
              value={isNil(unitPrice) ? null : formatNumber(unitPrice)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_amountBeforeTax"
      ),
      dataIndex: "amountBeforeTax",
      key: "amountBeforeTax",
      width: 170,
      render: (amountBeforeTax) => {
        return (
          <LayoutCell>
            <OneLineText
              value={
                isNil(amountBeforeTax) ? null : formatNumber(amountBeforeTax)
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_tax"
      ),
      dataIndex: "tax",
      key: "tax",
      width: 84,
      render: (tax) => {
        return (
          <LayoutCell>
            <OneLineText value={isNil(tax) ? null : `${tax?.rate}%`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_taxAmount"
      ),
      dataIndex: "taxAmount",
      key: "taxAmount",
      align: "right",
      width: 145,
      render: (taxAmount) => {
        return (
          <LayoutCell position="right">
            <OneLineText
              value={isNil(taxAmount) ? null : formatNumber(taxAmount)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_totalAmount"
      ),
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      width: 145,
      render: (totalAmount) => {
        return (
          <LayoutCell position="right">
            <OneLineText
              value={isNil(totalAmount) ? null : formatNumber(totalAmount)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_contractManager"
      ),
      dataIndex: "contractManager",
      key: "contractManager",
      width: 200,
      render: (value) => {
        return (
          <LayoutCell>
            <OneLineText value={value?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_goods_organizationManager"
      ),
      dataIndex: "organizationManager",
      key: "organizationManager",
      width: 200,
      render: (value) => {
        return (
          <LayoutCell>
            <OneLineText value={value?.organization?.name} />
          </LayoutCell>
        );
      },
    },
  ];
  return (
    <>
      <StandardTable
        columns={columns}
        dataSource={data?.items || []}
        tableLayout="fixed"
        scroll={{ x: 425 }}
        loading={loadingList}
      />
      <div className="page-master__pagination">
        <Pagination {...paginationProps} />
      </div>
    </>
  );
};

export default GoodsServiceTable;
