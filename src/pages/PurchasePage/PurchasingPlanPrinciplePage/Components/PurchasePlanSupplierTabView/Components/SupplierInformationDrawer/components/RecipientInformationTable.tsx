import { ColumnProps } from "antd/lib/table";

type Props = {
  data: {
    id?: string;
    email?: string;
    name?: string;
  }[];
};

import React from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";

type TableItemType = {
  title: string;
  value: string;
  type?: "text" | "tooltip";
  colSpan?: number;
};

const RecipientInformationTable = ({ data }: Props) => {
  const [translate] = useTranslation();
  const columns: ColumnProps<TableItemType>[] = React.useMemo(
    () => [
      {
        title: translate("PL.drawer_email"),
        key: "email",
        dataIndex: "email",
        ellipsis: true,
        width: "50%",
        render: (text) => (
          <LayoutCell>
            <OneLineText value={text} useTooltip />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.drawer_full_name"),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: "50%",
        render: (text) => (
          <LayoutCell>
            <OneLineText value={text} useTooltip />
          </LayoutCell>
        ),
      },
    ],
    [translate]
  );
  return (
    <div>
      {isEmpty(data) ? (
        <EmptyDocuments />
      ) : (
        <StandardTable
          rowKey={"id"}
          idContainer="supplier-information-table"
          columns={columns}
          dataSource={data}
          scroll={{ y: "200px" }}
        />
      )}
    </div>
  );
};

export default RecipientInformationTable;
