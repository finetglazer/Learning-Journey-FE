import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";
import { ContractGuaranteeModel } from "models/OrderContract/OrderContract";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./ContractTerms.module.scss";
import { NOT_AVAILABLE } from "config/const";

interface ContractTermsProps {
  data?: ContractGuaranteeModel[];
}

const ContractTerms = ({ data }: ContractTermsProps) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<ContractGuaranteeModel>[] = [
    {
      title: translate("report.purchase.purchase_plan_detail.terms.txt_name"),
      key: "name",
      dataIndex: "name",
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
      title: translate(
        "report.purchase.purchase_plan_detail.terms.txt_description"
      ),
      key: "description",
      dataIndex: "description",
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
    <div>
      {isEmpty(data) ? (
        <div className={styles["empty_contract_terms"]}>
          <span>{NOT_AVAILABLE}</span>
        </div>
      ) : (
        <StandardTable
          rowKey="id"
          columns={columns}
          dataSource={data}
          scroll={{ y: "calc(100vh - 546px)" }}
        />
      )}
    </div>
  );
};

export default ContractTerms;
