import { useTranslation } from "react-i18next";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useMemo } from "react";
import { Warranty } from "models/PurchasingPlan";
import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";

interface Props {
  values: Warranty[];
}

const TableWarrantyInformation = ({ values }: Props) => {
  const [translate] = useTranslation();

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        key: "warrantyType",
        title: translate("PL.drawer_type_warranty"),
        dataIndex: "warrantyType",
        width: "25%",
        render: (_, record: Warranty) => (
          <LayoutCell>
            <OneLineText value={record?.warrantyType?.name} />
          </LayoutCell>
        ),
      },
      {
        key: "warrantyPeriod",
        title: translate("PL.drawer_time_warranty"),
        dataIndex: "warrantyPeriod",
        width: "25%",
        render: (_, record: Warranty) => (
          <LayoutCell>
            <OneLineText value={record?.warrantyPeriod} />
          </LayoutCell>
        ),
      },
      {
        key: "warrantyCalculationTime",
        title: translate("PL.drawer_start_warranty"),
        dataIndex: "warrantyCalculationTime",
        width: "25%",
        render: (_, record: Warranty) => (
          <LayoutCell>
            <OneLineText value={record?.warrantyCalculationTime} />
          </LayoutCell>
        ),
      },
      {
        key: "warrantyTerms",
        title: translate("PL.drawer_method_warranty"),
        dataIndex: "warrantyTerms",
        width: "25%",
        render: (_, record: Warranty) => (
          <LayoutCell>
            <OneLineText value={record?.warrantyTerms?.name} />
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
          idContainer="warranty_quotation_table"
          columns={columns}
          dataSource={values}
          scroll={{ y: "200px" }}
        />
      )}
    </div>
  );
};

export default TableWarrantyInformation;
