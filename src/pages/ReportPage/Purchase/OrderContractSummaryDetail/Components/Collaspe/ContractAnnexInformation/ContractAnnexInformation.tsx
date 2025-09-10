import { ColumnProps } from "antd/lib/table";
import EmptyNotAvailable from "components/EmptyNotAvailable/EmptyNotAvailable";
import { CONTRACT_ANNEX_DETAIL_ROUTE } from "config/route-const";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { toFixedByCurrency } from "core/helpers/calculator";
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
import { Link } from "react-router-dom";
import styles from "./ContractAnnexInformation.module.scss";

interface ContractAnnexInformationProps {
  data?: ContractAppendixModel[];
  currency?: string;
}

const ContractAnnexInformation = ({
  data,
  currency,
}: ContractAnnexInformationProps) => {
  const [translate] = useTranslation();

  const getRowClassName = (record: ContractAppendixModel) => {
    return record?.isTotal ? styles["total-row"] : "";
  };

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
          <LayoutCell>
            <OneLineText value={`${index}`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("AC.txt_approval_date"),
      key: "approvedDate",
      dataIndex: "approvedDate",
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
      title: translate("CPA.table.txt_code_appendix"),
      key: "code",
      dataIndex: "code",
      render(value: string, record) {
        if (record?.isTotal) {
          return (
            <LayoutCell>
              <OneLineText value={translate("CT.total")} className="fw-bold" />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <Link
              to={`${CONTRACT_ANNEX_DETAIL_ROUTE}/${record?.id}`}
              target="_blank"
              className="text-decoration-none"
            >
              <OneLineText value={value} className={styles["text-code"]} />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("CA.txt_annex_no"),
      key: "contractAppendixNo",
      dataIndex: "contractAppendixNo",
      render(value: string, record) {
        return (
          <LayoutCell>
            <Link
              to={`${CONTRACT_ANNEX_DETAIL_ROUTE}/${record?.id}`}
              target="_blank"
              className="text-decoration-none"
            >
              <OneLineText value={value} className={styles["text-code"]} />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("CA.txt_annex_name"),
      key: "name",
      dataIndex: "name",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PS.txt_table_pre_tax_value"),
      key: "totalAmountBeforeTax",
      dataIndex: "totalAmountBeforeTax",
      align: "right",
      render(value: number, record) {
        if (record?.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatNumber(
                  toFixedByCurrency(
                    calculateTotal("totalAmountBeforeTax"),
                    currency
                  )
                )}
                className="fw-bold"
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell position="right">
            <OneLineText
              value={formatNumber(toFixedByCurrency(value ?? 0, currency))}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("AC.txt_tax_value"),
      key: "totalTax",
      dataIndex: "totalTax",
      align: "right",
      render(value: number, record) {
        if (record?.isTotal) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatNumber(calculateTotal("totalTax"))}
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
    <div className={styles["contract-annex-information__container"]}>
      {isEmpty(data) || isUndefined(data) ? (
        <EmptyNotAvailable />
      ) : (
        <StandardTable
          rowKey="id"
          isDragable
          columns={columns}
          dataSource={[{ isTotal: true }, ...(data || [])]}
          scroll={{ y: "calc(100vh - 546px)" }}
          rowClassName={getRowClassName}
        />
      )}
    </div>
  );
};

export default ContractAnnexInformation;
