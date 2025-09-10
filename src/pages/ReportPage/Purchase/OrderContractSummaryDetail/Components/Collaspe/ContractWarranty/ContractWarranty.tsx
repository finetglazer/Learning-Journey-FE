import { ColumnProps } from "antd/lib/table";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { ContractWarrantyModel } from "models/OrderContract/OrderContract";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./ContractWarranty.module.scss";
import { formatNumber } from "core/helpers/number";
import EmptyNotAvailable from "components/EmptyNotAvailable/EmptyNotAvailable";
import { isEmpty, isUndefined } from "lodash";

interface ContractWarrantyProps {
  data?: ContractWarrantyModel[];
}

const ContractWarranty = ({ data }: ContractWarrantyProps) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<ContractWarrantyModel>[] = [
    {
      title: translate("CA.txt_type_warranty"),
      key: "warrantyTypeName",
      dataIndex: "warrantyTypeName",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_date_time_guarantee_month"),
      key: "warrantyPeriod",
      dataIndex: "warrantyPeriod",
      render(value: number) {
        return (
          <LayoutCell>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("CA.txt_warranty_form"),
      key: "warrantyTermsName",
      dataIndex: "warrantyTermsName",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.order_contract_summary.tab.txt_expiration_date"
      ),
      key: "expiredDate",
      dataIndex: "expiredDate",
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
  ];

  return (
    <div className={styles["warranty-information__container"]}>
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

export default ContractWarranty;
