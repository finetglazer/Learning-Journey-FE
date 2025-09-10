import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CommercialTerm } from "models/PurchasingPlan";
import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";

interface Props {
  values: CommercialTerm[];
}

const TableCommercialTerms = ({ values }: Props) => {
  const [translate] = useTranslation();

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        key: "commercialTerms",
        title: translate("PL.drawer_commercial_terms"),
        dataIndex: "commercialTerms",
        width: 300,
        render: (_, record: CommercialTerm) => (
          <LayoutCell>
            <OneLineText value={record?.commercialTerms?.name} />
          </LayoutCell>
        ),
      },
      {
        key: "description",
        title: translate("PL.drawer_description"),
        dataIndex: "description",
        render: (_, record: CommercialTerm) => (
          <LayoutCell>
            <OneLineText value={record?.description} />
          </LayoutCell>
        ),
      },
    ],
    [translate, values]
  );

  return (
    <div>
      {isEmpty(values) ? (
        <EmptyDocuments />
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
