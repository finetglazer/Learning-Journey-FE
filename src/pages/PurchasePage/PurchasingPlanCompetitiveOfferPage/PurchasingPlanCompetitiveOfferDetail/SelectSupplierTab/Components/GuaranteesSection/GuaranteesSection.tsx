import type { ColumnProps } from "antd/es/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import {
  STANDARD_DATE_FORMAT_SLASH,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { isEmpty } from "lodash";
import { ColumnKey, Guarantee, GuaranteeType } from "models/PurchasingPlan";
import { SelectSupplierTabDefaultProps } from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import { Supplier } from "models/Supplier/Supplier";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface GuaranteesSectionProperties extends SelectSupplierTabDefaultProps {
  currency?: string;
  isHaveSupplier?: boolean;
}

const GuaranteesSection = ({
  data,
  currency,
  contextValue,
  isHaveSupplier = true,
}: GuaranteesSectionProperties) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<Guarantee>[] = useMemo(
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
          render: (value: Supplier, record: Guarantee) => {
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
              {translate("PL.guarantee_type_label")}
            </div>
          ),
          ellipsis: true,
          width: 200,
          key: ColumnKey.GUARANTEE_TYPE,
          dataIndex: ColumnKey.GUARANTEE_TYPE,
          render: (value: GuaranteeType) => {
            return (
              <LayoutCell>
                <OneLineText value={value?.name} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div className="text-right">
              {translate("PL.guarantee_money_label")}
            </div>
          ),
          ellipsis: true,
          width: 200,
          key: ColumnKey.AMOUNT,
          dataIndex: ColumnKey.AMOUNT,
          render: (value: string | number) => {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <div className="vertical_baseline">
              {translate("PL.guarantee_duration_label")}
            </div>
          ),
          ellipsis: true,
          width: 250,
          key: ColumnKey.DURATION,
          dataIndex: ColumnKey.DURATION,
          render: (_: unknown, record: Guarantee) => {
            return (
              <LayoutCell>
                <OneLineText
                  value={`${formatDate(
                    record?.fromDate,
                    STANDARD_DATE_FORMAT_SLASH
                  )} - ${formatDate(
                    record?.toDate,
                    STANDARD_DATE_FORMAT_SLASH
                  )}`}
                  useTooltip
                />
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
    [currency, isHaveSupplier, translate]
  );

  return isEmpty(data) ? (
    <EmptyDocuments />
  ) : (
    <StandardTable
      rowKey={(el) => `${el.id}-${el.supplierName}`}
      id="guarantees-table"
      isDragable
      columns={columns}
      dataSource={data}
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default GuaranteesSection;
