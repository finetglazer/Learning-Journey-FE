import type { ColumnProps } from "antd/es/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { WarrantyCalculationTimeEnum } from "config/const";
import { isEmpty } from "lodash";
import { Warranty } from "models/Contract";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface IItemCommon {
  id?: string;
  name?: string;
  code?: string;
}

interface WarrantiesSectionProperties {
  warranties?: Warranty[];
}

const WarrantiesSection = ({ warranties }: WarrantiesSectionProperties) => {
  const [translate] = useTranslation();

  const warrantyCalculationTimeMapping: {
    [key in WarrantyCalculationTimeEnum]: string;
  } = {
    [WarrantyCalculationTimeEnum.ActualReceivedDate]: translate(
      "PL.actual_received_date"
    ),
    [WarrantyCalculationTimeEnum.DateOfUse]: translate("PL.date_of_use"),
  };

  const columns: ColumnProps<Warranty>[] = useMemo(
    () => [
      {
        title: (
          <div className="vertical_baseline">
            {translate("PL.warranty_type_label")}
          </div>
        ),
        ellipsis: true,
        width: 200,
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
        title: () => (
          <UnitTitle
            title={translate("PL.warranty_period_label")}
            className="align-items-end"
            unit={translate("CM.txt_month")}
          />
        ),
        ellipsis: true,
        width: 145,
        key: "warrantyPeriod",
        dataIndex: "warrantyPeriod",
        render: (warrantyPeriod) => {
          return (
            <LayoutCell position="right">
              <OneLineText value={warrantyPeriod} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="vertical_baseline">
            {translate("PL.warranty_calculation_time_label")}
          </div>
        ),
        ellipsis: true,
        width: 250,
        key: "warrantyCalculationTime",
        dataIndex: "warrantyCalculationTime",
        render: (warrantyCalculationTime) => {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  warrantyCalculationTimeMapping[
                    warrantyCalculationTime as WarrantyCalculationTimeEnum
                  ] ?? ""
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="vertical_baseline">
            {translate("PL.warranty_terms_label")}
          </div>
        ),
        ellipsis: true,
        width: 200,
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
    [translate]
  );

  return isEmpty(warranties) ? (
    <EmptyDocuments isNewVersion />
  ) : (
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
