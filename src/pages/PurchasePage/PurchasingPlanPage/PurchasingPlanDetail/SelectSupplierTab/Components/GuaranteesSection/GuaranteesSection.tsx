import type { ColumnProps } from "antd/es/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { isEmpty } from "lodash";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
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
  fromDate?: string;
  toDate?: string;
  description?: string;
}

interface GuaranteesSectionProperties {
  guarantees?: IGuarantees[];
  currency?: string;
}

const GuaranteesSection = ({
  guarantees,
  currency,
}: GuaranteesSectionProperties) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<IGuarantees>[] = useMemo(
    () => [
      {
        title: (
          <div className="vertical_baseline">
            {translate("PL.guarantee_type_label")}
          </div>
        ),
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
        title: () => (
          <UnitTitle
            title={translate("PL.guarantee_money_label")}
            className="align-items-end"
            unit={currency}
          />
        ),
        ellipsis: true,
        width: 145,
        key: "amount",
        dataIndex: "amount",
        render: (amount) => {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(amount)} useTooltip />
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
        width: 200,
        key: "duration",
        dataIndex: "duration",
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText
                value={`${formatDate(
                  record?.fromDate,
                  STANDARD_DATE_FORMAT_SLASH
                )} - ${formatDate(record?.toDate, STANDARD_DATE_FORMAT_SLASH)}`}
                useTooltip
              />
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
    [currency, translate]
  );

  return isEmpty(guarantees) ? (
    <EmptyDocuments isNewVersion />
  ) : (
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
