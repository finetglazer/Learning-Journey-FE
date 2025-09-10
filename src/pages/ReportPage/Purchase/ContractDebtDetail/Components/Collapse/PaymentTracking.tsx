import { ColumnProps } from "antd/lib/table";
import EmptyNotAvailable from "components/EmptyNotAvailable/EmptyNotAvailable";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { isEmpty, isEqual, isUndefined } from "lodash";
import { ContractAppendixModel } from "models/OrderContract/OrderContract";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../../../OrderContractSummaryDetail/Components/Collaspe/ContractAnnexInformation/ContractAnnexInformation.module.scss";
import {
  PaymentRequestType,
  PaymentRequestTypeGroup,
} from "models/Report/CostItems";

interface ContractAnnexInformationProps {
  data?: ContractAppendixModel[];
}

const PaymentTracking = ({ data }: ContractAnnexInformationProps) => {
  const [translate] = useTranslation();

  const getRowClassName = (record: ContractAppendixModel) => {
    return record?.isTotal ? styles["total-row"] : "";
  };

  function getPaymentRequestType(type: number): string {
    return PaymentRequestType[type as PaymentRequestTypeGroup];
  }

  const calculateTotal = (key: keyof ContractAppendixModel) => {
    if (!data || isEqual(data.length, numberConstants.ZERO))
      return numberConstants.ZERO;

    return data.reduce((sum, record) => {
      const value = record[key] ? Number(record[key]) : numberConstants.ZERO;
      return sum + value;
    }, numberConstants.ZERO);
  };

  const columns: ColumnProps<ContractAppendixModel>[] = [
    {
      title: translate(
        "report.purchase.order_contract_summary.table.txt_index"
      ),
      key: "id",
      width: 44,
      render(_, record, index: number) {
        if (record?.isTotal) {
          return null;
        }
        return (
          <LayoutCell position="center">
            <OneLineText value={`${index + 1}`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table_tracking.erpApproveDateTime"
      ),
      key: "erpApproveDateTime",
      dataIndex: "erpApproveDateTime",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={formatDate(value, STANDARD_DATE_FORMAT_SLASH)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table_tracking.type"
      ),
      key: "type",
      dataIndex: "type",
      render(value: number, record) {
        if (record?.isTotal) {
          return (
            <LayoutCell>
              <OneLineText value={translate("CT.total")} className="fw-bold" />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={getPaymentRequestType(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table_tracking.description"
      ),
      key: "description",
      dataIndex: "description",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table_tracking.currencyName"
      ),
      key: "currencyName",
      dataIndex: "currencyName",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText value={record.currency?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table_tracking.paidAmount"
      ),
      key: "paidAmount",
      dataIndex: "paidAmount",
      align: "right",
      render(value: number, record) {
        if (record?.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatNumber(calculateTotal("paidAmount"))}
                className="fw-bold"
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value || "0")} />
          </LayoutCell>
        );
      },
    },
  ];
  return (
    <div>
      {isEmpty(data) || isUndefined(data) ? (
        <EmptyNotAvailable />
      ) : (
        <StandardTable
          rowKey="id"
          isDragable
          columns={columns}
          dataSource={[...(data || []), { isTotal: true }]}
          scroll={{ y: "calc(100vh - 546px)" }}
          rowClassName={getRowClassName}
        />
      )}
    </div>
  );
};

export default PaymentTracking;
