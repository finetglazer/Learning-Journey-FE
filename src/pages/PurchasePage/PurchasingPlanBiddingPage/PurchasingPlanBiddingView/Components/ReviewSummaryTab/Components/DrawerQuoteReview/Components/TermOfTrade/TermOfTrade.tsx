import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";
import { ContractTerm } from "models/Contract";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./TermOfTrade.module.scss";
import { Tooltip } from "antd";

interface TermOfTradeProps {
  data?: ContractTerm[];
}

const TermOfTrade = ({ data }: TermOfTradeProps) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<ContractTerm>[] = useMemo(
    () => [
      {
        title: translate("PPA.txt_name_of_term"),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: 300,
        className: "align-top",
        render(_, record: ContractTerm) {
          return (
            <LayoutCell>
              <Tooltip placement="topLeft" title={record?.name}>
                <div className={styles["cell-contract_term"]}>
                  {record?.name}
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.txt_description"),
        key: "description",
        dataIndex: "description",
        className: "align-top",
        render(_, record: ContractTerm) {
          return (
            <LayoutCell>
              <div className={styles["cell-contract_term"]}>
                {record?.description}
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );
  return (
    <div className={styles["term-of-trade__container"]}>
      {isEmpty(data) ? (
        <EmptyDocuments isNewVersion />
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

export default TermOfTrade;
