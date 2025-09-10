import type { ColumnProps } from "antd/es/table";
import { CommercialTerms } from "models/Contract";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
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
        title: translate("PL.purchasing_plan_commercial_terms"),
        ellipsis: true,
        width: 300,
        key: "name",
        dataIndex: "name",
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.commercialTerms?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.description_label"),
        ellipsis: true,
        key: "description",
        dataIndex: "description",
        render: (description) => {
          return (
            <LayoutCell>
              <OneLineText value={description} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
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
