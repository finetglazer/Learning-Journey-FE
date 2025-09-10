import { ColumnProps } from "antd/lib/table";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { ContractGuaranteeModel } from "models/OrderContract/OrderContract";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./ContractGuarantee.module.scss";
import { formatNumber } from "core/helpers/number";
import EmptyNotAvailable from "components/EmptyNotAvailable/EmptyNotAvailable";
import { isEmpty, isUndefined } from "lodash";

interface ContractGuaranteeProps {
  data?: ContractGuaranteeModel[];
}

const ContractGuarantee = ({ data }: ContractGuaranteeProps) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<ContractGuaranteeModel>[] = [
    {
      title: translate("CA.txt_guarantee_type"),
      key: "guaranteeTypeName",
      dataIndex: "guaranteeTypeName",
      width: 300,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("CM.txt_start_date"),
      key: "fromDate",
      dataIndex: "fromDate",
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
      title: translate("CM.txt_end_date"),
      key: "toDate",
      dataIndex: "toDate",
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
        "report.purchase.order_contract_summary.tab.txt_value_guarantee"
      ),
      key: "amount",
      dataIndex: "amount",
      render(value: number) {
        return (
          <LayoutCell>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.order_contract_summary.tab.txt_status"),
      key: "status",
      dataIndex: "status",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <div className={styles["guarantee-information__container"]}>
      {isEmpty(data) || isUndefined(data) ? (
        <EmptyNotAvailable />
      ) : (
        <StandardTable
          rowKey="id"
          isDragable
          columns={columns}
          dataSource={data}
          scroll={{ y: "calc(100vh - 546px)" }}
        />
      )}
    </div>
  );
};

export default ContractGuarantee;
