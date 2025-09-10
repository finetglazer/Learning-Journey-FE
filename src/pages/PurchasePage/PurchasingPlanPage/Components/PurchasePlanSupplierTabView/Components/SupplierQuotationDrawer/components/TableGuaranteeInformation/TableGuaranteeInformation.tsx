import { ColumnProps } from "antd/lib/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { isEmpty } from "lodash";
import { Guarantee } from "models/Contract";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface Props {
  values: Guarantee[];
  currency?: string;
}

const TableGuaranteeInformation = ({ values, currency }: Props) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<Guarantee>[] = useMemo(
    () => [
      {
        key: "guaranteeType",
        title: (
          <div className="vertical_baseline">
            {translate("PL.drawer_type_guarantee")}
          </div>
        ),
        ellipsis: true,
        dataIndex: "guaranteeType",
        width: 300,
        render: (_, record: Guarantee) => (
          <LayoutCell>
            <OneLineText value={record?.guaranteeType?.name} />
          </LayoutCell>
        ),
      },
      // TODO:
      // {
      //   title: () => (
      //     <UnitTitle
      //       title={translate("PL.guarantee_money_label")}
      //       className="align-items-end"
      //       unit={currency}
      //     />
      //   ),
      //   ellipsis: true,
      //   width: 145,
      //   key: "amount",
      //   dataIndex: "amount",
      //   render: (amount) => {
      //     return (
      //       <LayoutCell position="right">
      //         <OneLineText value={formatNumber(amount)} useTooltip />
      //       </LayoutCell>
      //     );
      //   },
      // },
      // {
      //   title: (
      //     <div className="vertical_baseline">
      //       {translate("PL.guarantee_duration_label")}
      //     </div>
      //   ),
      //   ellipsis: true,
      //   width: 200,
      //   key: "duration",
      //   dataIndex: "duration",
      //   render: (_, record) => {
      //     return (
      //       <LayoutCell>
      //         <OneLineText
      //           value={`${formatDate(
      //             record?.fromDate,
      //             STANDARD_DATE_FORMAT_SLASH
      //           )} - ${formatDate(record?.toDate, STANDARD_DATE_FORMAT_SLASH)}`}
      //           useTooltip
      //         />
      //       </LayoutCell>
      //     );
      //   },
      // },
      {
        key: "description",
        title: (
          <div className="vertical_baseline">
            {translate("PL.drawer_notes_table")}
          </div>
        ),
        dataIndex: "description",
        ellipsis: true,
        render: (_, record: Guarantee) => (
          <LayoutCell>
            <OneLineText value={record?.description} />
          </LayoutCell>
        ),
      },
    ],
    [translate]
  );

  return (
    <div>
      {isEmpty(values) ? (
        <EmptyDocuments isNewVersion />
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
