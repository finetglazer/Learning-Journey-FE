import type { ColumnProps } from "antd/es/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { WarrantyCalculationTimeEnum } from "config/const";
import { isEmpty } from "lodash";
import { ColumnKey, Warranty, WarrantyType } from "models/PurchasingPlan";
import { SelectSupplierTabDefaultProps } from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import { Supplier } from "models/Supplier/Supplier";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface WarrantiesSectionProperties extends SelectSupplierTabDefaultProps {
  data?: Warranty[];
  isHaveSupplier?: boolean;
}

const WarrantiesSection = ({
  data,
  contextValue,
  isHaveSupplier = true,
}: WarrantiesSectionProperties) => {
  const [translate] = useTranslation();

  const warrantyCalculationTimeMapping: {
    [key in WarrantyCalculationTimeEnum]: string;
  } = useMemo(
    () => ({
      [WarrantyCalculationTimeEnum.ActualReceivedDate]: translate(
        "PL.actual_received_date"
      ),
      [WarrantyCalculationTimeEnum.DateOfUse]: translate("PL.date_of_use"),
    }),
    [translate]
  );

  const columns: ColumnProps<Warranty>[] = useMemo(
    () =>
      [
        isHaveSupplier && {
          title: (
            <div className="vertical_baseline">
              {translate("PL.purchasing_plan_supplier_tab")}
            </div>
          ),
          ellipsis: true,
          width: 200,
          key: ColumnKey.SUPPLIER,
          dataIndex: ColumnKey.SUPPLIER,
          render: (value: Supplier, record: Warranty) => {
            return (
              <LayoutCell>
                <OneLineText value={record?.supplierName} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <div className="vertical_baseline">
              {translate("PL.warranty_type_label")}
            </div>
          ),
          ellipsis: true,
          width: 200,
          key: ColumnKey.WARRANTY_TYPE,
          dataIndex: ColumnKey.WARRANTY_TYPE,
          render: (value: WarrantyType) => {
            return (
              <LayoutCell>
                <OneLineText value={value?.name} useTooltip />
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
          width: 150,
          key: ColumnKey.WARRANTY_PERIOD,
          dataIndex: ColumnKey.WARRANTY_PERIOD,
          render: (value: string) => {
            return (
              <LayoutCell position="right">
                <OneLineText value={value} useTooltip />
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
          key: ColumnKey.WARRANTY_CALCULATION_TIME,
          dataIndex: ColumnKey.WARRANTY_CALCULATION_TIME,
          render: (value: number) => {
            return (
              <LayoutCell>
                <OneLineText
                  value={
                    warrantyCalculationTimeMapping[
                      value as WarrantyCalculationTimeEnum
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
          width: 250,
          key: ColumnKey.WARRANTY_TERMS,
          dataIndex: ColumnKey.WARRANTY_TERMS,
          render: (value: WarrantyType) => {
            return (
              <LayoutCell>
                <OneLineText value={value?.name} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <div className="vertical_baseline">
              {translate("PL.note_label")}
            </div>
          ),
          ellipsis: true,
          key: ColumnKey.DESCRIPTION,
          dataIndex: ColumnKey.DESCRIPTION,
          render: (value: string) => {
            return (
              <LayoutCell>
                <OneLineText value={value} useTooltip />
              </LayoutCell>
            );
          },
        },
      ].filter((el) => Boolean(el)),
    [isHaveSupplier, translate, warrantyCalculationTimeMapping]
  );

  return isEmpty(data) ? (
    <EmptyDocuments isNewVersion />
  ) : (
    <StandardTable
      rowKey={(el) => `${el.id}-${el.supplierName}`}
      id="warranties-table"
      isDragable
      columns={columns}
      dataSource={data}
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default WarrantiesSection;
