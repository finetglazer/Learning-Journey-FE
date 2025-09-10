import { ColumnProps } from "antd/lib/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { WarrantyCalculationTimeEnum } from "config/const";
import { isEmpty } from "lodash";
import { Warranty } from "models/PurchasingPlan";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface Props {
  values: Warranty[];
}

const TableWarrantyInformation = ({ values }: Props) => {
  const [translate] = useTranslation();

  const warrantyCalculationTimeMapping: {
    [key in WarrantyCalculationTimeEnum]: string;
  } = {
    [WarrantyCalculationTimeEnum.ActualReceivedDate]: translate(
      "PL.actual_received_date"
    ),
    [WarrantyCalculationTimeEnum.DateOfUse]: translate("PL.date_of_use"),
  };

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        key: "warrantyType",
        title: (
          <div className="vertical_baseline">
            {translate("PL.drawer_type_warranty")}
          </div>
        ),
        dataIndex: "warrantyType",
        ellipsis: true,
        width: 200,
        render: (_, record: Warranty) => (
          <LayoutCell>
            <OneLineText value={record?.warrantyType?.name} />
          </LayoutCell>
        ),
      },
      {
        key: "warrantyPeriod",
        title: () => (
          <UnitTitle
            title={translate("PL.drawer_time_warranty")}
            className="align-items-end"
            unit={translate("CM.txt_month")}
          />
        ),
        dataIndex: "warrantyPeriod",
        ellipsis: true,
        width: 145,
        render: (_, record: Warranty) => (
          <LayoutCell position="right">
            <OneLineText value={record?.warrantyPeriod} />
          </LayoutCell>
        ),
      },
      {
        key: "warrantyCalculationTime",
        title: (
          <div className="vertical_baseline">
            {translate("PL.drawer_start_warranty")}
          </div>
        ),
        dataIndex: "warrantyCalculationTime",
        ellipsis: true,
        width: 250,
        render: (_, record: Warranty) => (
          <LayoutCell>
            <OneLineText
              value={
                warrantyCalculationTimeMapping[
                  record?.warrantyCalculationTime
                ] ?? ""
              }
            />
          </LayoutCell>
        ),
      },
      {
        key: "warrantyTerms",
        title: (
          <div className="vertical_baseline">
            {translate("PL.drawer_method_warranty")}
          </div>
        ),
        dataIndex: "warrantyTerms",
        ellipsis: true,
        width: 200,
        render: (_, record: Warranty) => (
          <LayoutCell>
            <OneLineText value={record?.warrantyTerms?.name} />
          </LayoutCell>
        ),
      },
      {
        title: (
          <div className="vertical_baseline">{translate("PL.note_label")}</div>
        ),
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

    [translate, values]
  );

  return (
    <div>
      {isEmpty(values) ? (
        <EmptyDocuments isNewVersion />
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
