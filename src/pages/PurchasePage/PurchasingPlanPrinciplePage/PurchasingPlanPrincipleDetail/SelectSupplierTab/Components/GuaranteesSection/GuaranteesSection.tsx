import type { ColumnProps } from "antd/es/table";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface IGuarantees {
  guaranteeTypeId?: string;
  guaranteeType?: {
    id?: string;
    name?: string;
    code?: string;
  };
  description?: string;
}

interface GuaranteesSectionProperties {
  guarantees?: IGuarantees[];
}

const GuaranteesSection = ({ guarantees }: GuaranteesSectionProperties) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<IGuarantees>[] = useMemo(
    () => [
      {
        title: translate("PL.guarantee_type_label"),
        ellipsis: true,
        width: 300,
        key: "name",
        dataIndex: "name",
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.guaranteeType?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.note_label"),
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
      rowKey="guaranteeTypeId"
      id="guarantees-table"
      isDragable
      columns={columns}
      dataSource={guarantees}
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default GuaranteesSection;
