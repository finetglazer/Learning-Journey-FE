import { useTranslation } from "react-i18next";
import { ColumnProps } from "antd/lib/table";
import { isNil } from "lodash";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { ModelFilter } from "react-3layer-common";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { formatDate } from "core/helpers/date-time";

interface GoodsServiceTableProps {
  data: any;
  loadingList?: boolean;
  modelFilter?: ModelFilter;
  onPagination?: (pageIndex: number, pageSize: number) => void;
}

const ContractGoodsServiceTable: React.FC<GoodsServiceTableProps> = ({
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

  const columns: ColumnProps<any>[] = [
    {
      title: translate("report.purchase.goods_services_detail.table.stt"),
      key: "id",
      dataIndex: "id",
      width: 50,
      ellipsis: true,
      render: (i, record, index: number) => {
        return (
          <LayoutCell position="center">
            <OneLineText value={`${index + 1}`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.approvedDate"
      ),
      width: 100,
      dataIndex: "approvedDate",
      key: "approvedDate",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText
              value={formatDate(
                record.contractInfo?.approvedDate,
                STANDARD_DATE_FORMAT_SLASH
              )}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.description"
      ),
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.branchName"
      ),
      width: 200,
      dataIndex: "branchName",
      key: "branchName",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record.branch?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.goods_services_detail.table.unitName"),
      width: 100,
      dataIndex: "unitName",
      key: "unitName",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record.unit?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.goods_services_detail.table.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
      width: 145,
      render: (value) => {
        return (
          <LayoutCell position="right">
            <OneLineText value={isNil(value) ? null : formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.goods_services_detail.table.currency"),
      width: 100,
      dataIndex: "currency",
      key: "currency",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record.contractInfo?.currency} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.goods_services_detail.table.unitPrice"),
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right",
      width: 120,
      render: (value) => {
        return (
          <LayoutCell position="right">
            <OneLineText value={isNil(value) ? null : formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.taxPercent"
      ),
      dataIndex: "taxPercent",
      key: "taxPercent",
      align: "right",
      width: 84,
      render: (value) => {
        return (
          <LayoutCell position="right">
            <OneLineText value={isNil(value) ? null : `${value}%`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.goods_services_detail.table.taxAmount"),
      dataIndex: "taxAmount",
      key: "taxAmount",
      align: "right",
      width: 120,
      render: (value) => {
        return (
          <LayoutCell position="right">
            <OneLineText value={isNil(value) ? null : formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.totalAmount"
      ),
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      width: 145,
      render: (value) => {
        return (
          <LayoutCell position="right">
            <OneLineText value={isNil(value) ? null : formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.supplierInfoCode"
      ),
      width: 150,
      dataIndex: "supplierInfoCode",
      key: "supplierInfoCode",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record.supplierInfo?.code} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.supplierInfoName"
      ),
      width: 200,
      dataIndex: "supplierInfoName",
      key: "supplierInfoName",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record.supplierInfo?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.contractInfoContractNo"
      ),
      width: 150,
      dataIndex: "contractInfoContractNo",
      key: "contractInfoContractNo",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record.contractInfo?.contractNo} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.contractInfoName"
      ),
      width: 200,
      dataIndex: "contractInfoName",
      key: "contractInfoName",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record.contractInfo?.name} />
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

export default ContractGoodsServiceTable;
