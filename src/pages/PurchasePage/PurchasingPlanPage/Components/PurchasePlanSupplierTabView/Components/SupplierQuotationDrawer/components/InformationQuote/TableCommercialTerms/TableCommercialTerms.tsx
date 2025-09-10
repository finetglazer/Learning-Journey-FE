import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";
import { ContractTerm } from "models/Contract";
import { CommercialTerm } from "models/PurchasingPlan";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import { OneLineText, StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface Props {
  values: ContractTerm[];
}

const TableCommercialTerms = ({ values }: Props) => {
  const [translate] = useTranslation();

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        key: "commercialTerms",
        title: translate("PL.drawer_commercial_terms"),
        dataIndex: "commercialTerms",
        ellipsis: true,
        width: 300,
        render: (_, record) => {
          return (
            <OneLineText
              className="commercial_terms_name vertical_baseline"
              value={record?.name}
            />
          );
        },
      },
      {
        key: "description",
        title: translate("PL.drawer_description"),
        dataIndex: "description",
        render: (_, record: CommercialTerm) => (
          <div className="commercial_terms_content">{record?.description}</div>
        ),
      },
    ],
    [translate, values]
  );

  return (
    <div>
      {isEmpty(values) ? (
        <EmptyDocuments isNewVersion />
      ) : (
        <StandardTable
          rowKey={"id"}
          idContainer="commercial_quotation_table"
          columns={columns}
          dataSource={values}
          scroll={{ y: "200px" }}
        />
      )}
    </div>
  );
};

export default TableCommercialTerms;
