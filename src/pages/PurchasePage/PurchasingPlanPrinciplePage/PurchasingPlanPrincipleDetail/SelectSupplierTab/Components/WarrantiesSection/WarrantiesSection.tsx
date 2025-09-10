import type { ColumnProps } from "antd/es/table";
import { Warranty } from "models/Contract";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface WarrantiesSectionProperties {
  warranties?: Warranty[];
}

const WarrantiesSection = ({ warranties }: WarrantiesSectionProperties) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<Warranty>[] = useMemo(
    () => [
      {
        title: translate("PL.warranty_type_label"),
        ellipsis: true,
        key: "warrantyType",
        dataIndex: "warrantyType",
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.warrantyType?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.warranty_period_label"),
        ellipsis: true,
        key: "warrantyPeriod",
        dataIndex: "warrantyPeriod",
        render: (warrantyPeriod) => {
          return (
            <LayoutCell>
              <OneLineText value={warrantyPeriod} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.warranty_calculation_time_label"),
        ellipsis: true,
        key: "warrantyCalculationTime",
        dataIndex: "warrantyCalculationTime",
        render: (warrantyCalculationTime) => {
          return (
            <LayoutCell>
              <OneLineText value={warrantyCalculationTime} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.warranty_terms_label"),
        ellipsis: true,
        key: "warrantyTerms",
        dataIndex: "warrantyTerms",
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.warrantyTerms?.name} useTooltip />
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
      id="warranties-table"
      isDragable
      columns={columns}
      dataSource={warranties}
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default WarrantiesSection;
