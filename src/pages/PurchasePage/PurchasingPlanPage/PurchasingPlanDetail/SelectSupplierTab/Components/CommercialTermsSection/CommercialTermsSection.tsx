import type { ColumnProps } from "antd/es/table";
import { isEmpty } from "lodash";
import { CommercialTerms } from "models/Contract";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import { OneLineText, StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface CommercialTermsSectionProperties {
  commercialTerms?: CommercialTerms[];
}

const CommercialTermsSection = ({
  commercialTerms,
}: CommercialTermsSectionProperties) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<CommercialTerms>[] = useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_commercial_terms_name"),
        ellipsis: true,
        width: 300,
        key: "name",
        dataIndex: "name",
        render: (_, record) => {
          return (
            <OneLineText
              className="commercial_terms_name vertical_baseline"
              value={record?.commercialTerms?.name}
            />
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_description_label"),
        key: "description",
        dataIndex: "description",
        render: (description) => (
          <div className="commercial_terms_content">{description}</div>
        ),
      },
    ],
    [translate]
  );

  return isEmpty(commercialTerms) ? (
    <EmptyDocuments isNewVersion />
  ) : (
    <StandardTable
      rowKey="id"
      id="commercial-terms-table"
      isDragable
      columns={columns}
      dataSource={commercialTerms}
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default CommercialTermsSection;
