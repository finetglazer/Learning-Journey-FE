import { useTranslation } from "react-i18next";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useMemo } from "react";
import { Guarantee } from "models/PurchasingPlan";
import { ColumnProps } from "antd/lib/table";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { isEmpty } from "lodash";

interface Props {
  values: Guarantee[];
}

const TableGuaranteeInformation = ({ values }: Props) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<Guarantee>[] = useMemo(
    () => [
      {
        key: "guaranteeType",
        title: translate("PL.drawer_type_guarantee"),
        dataIndex: "guaranteeType",
        width: 300,
        render: (_, record: Guarantee) => (
          <LayoutCell>
            <OneLineText value={record?.guaranteeType?.name} />
          </LayoutCell>
        ),
      },
      {
        key: "description",
        title: translate("PL.drawer_notes_table"),
        dataIndex: "description",
        render: (_, record: Guarantee) => (
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
          idContainer="guarantee_quotation_table"
          columns={columns}
          dataSource={values}
          scroll={{ y: "200px" }}
        />
      )}
    </div>
  );
};

export default TableGuaranteeInformation;
