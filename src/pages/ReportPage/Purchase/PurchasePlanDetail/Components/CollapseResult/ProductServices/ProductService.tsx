import { ColumnProps } from "antd/lib/table";
import DetailTableReport from "pages/ReportPage/Components/DetailTableReport/DetailTableReport";
import { useTranslation } from "react-i18next";
import { GoodsItem } from "models/Report/PurchasePlanDetail";
import { isNil } from "lodash";
import { useState } from "react";
import { LayoutCell, OneLineText } from "react-components-design-system";

interface ProductServiceProps {
  data?: GoodsItem[];
  loadingList?: boolean;
}

export default function ProductService({
  data,
  loadingList,
}: ProductServiceProps) {
  const [translate] = useTranslation();

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setPagination({ pageIndex, pageSize });
  };

  const paginatedData = data?.slice(
    (pagination.pageIndex - 1) * pagination.pageSize,
    pagination.pageIndex * pagination.pageSize
  );
  const columns: ColumnProps<GoodsItem>[] = [
    {
      title: translate("report.purchase.purchase_plan_detail.table.txt_index"),
      dataIndex: "id",
      key: "id",
      width: 40,
      align: "center",
      render: (value, _, index) => (isNil(value) ? null : index),
    },
    {
      title: translate("report.purchase.purchase_plan_detail.table.txt_code"),
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: translate("report.purchase.purchase_plan_detail.table.txt_name"),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.table.txt_interpretation"
      ),
      dataIndex: "note",
      key: "note",
      width: 200,
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.table.txt_standard_type"
      ),
      dataIndex: "branch",
      key: "branch",
      width: 150,
      render: (branch) => {
        return (
          <LayoutCell>
            <OneLineText value={branch?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.purchase_plan_detail.table.txt_unit"),
      dataIndex: "unit",
      key: "unit",
      width: 100,
      render: (unit) => {
        return (
          <LayoutCell>
            <OneLineText value={unit?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.table.txt_quantity"
      ),
      dataIndex: "quantity",
      key: "quantity",
      width: 77,
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.table.txt_unit_price"
      ),
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right",
      width: 145,
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.table.txt_total_price"
      ),
      dataIndex: "amountBeforeTax",
      key: "amountBeforeTax",
      width: 164,
    },
    {
      title: translate("report.purchase.purchase_plan_detail.table.txt_vat"),
      dataIndex: "tax",
      key: "tax",
      width: 84,
      render: (tax) => {
        return (
          <LayoutCell>
            <OneLineText value={isNil(tax) ? null : `VAT ${tax?.rate}%`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.purchase_plan_detail.table.txt_tax"),
      dataIndex: "taxAmount",
      key: "taxAmount",
      align: "right",
      width: 145,
    },
    {
      title: translate("report.purchase.purchase_plan_detail.table.txt_total"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      width: 145,
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.table.txt_currency"
      ),
      dataIndex: "currency",
      key: "currency",
      width: 74,
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.table.txt_supplier"
      ),
      dataIndex: "selectedSupplier",
      key: "selectedSupplier",
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
        "report.purchase.purchase_plan_detail.table.txt_round_number"
      ),
      dataIndex: "numberOfRounds",
      key: "numberOfRounds",
      align: "right",
      width: 160,
    },
  ];

  return (
    <DetailTableReport
      columns={columns}
      dataSource={paginatedData || []}
      total={paginatedData?.length}
      loadingList={loadingList}
      modelFilter={pagination}
      isShowResult={true}
      onChangePagination={onChangePagination}
      isEmptyError={false}
    />
  );
}
