import { ColumnProps } from "antd/lib/table";
import { ColumnKey, ContractDetailModel } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";

const DateReceivedTable = () => {
  const [translate] = useTranslation();

  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const listReceiverInfosByGoodItems = useMemo(() => {
    return model?.contractGoodsItems?.[0]?.receiverInfos || [];
  }, [model?.contractGoodsItems]);

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14 d-flex p-l--2xs">
            {translate("CT.create_contract.table.delivery_date")}
          </div>
        ),
        isRequired: true,
        ellipsis: true,
        width: 80,
        dataIndex: ColumnKey.SHIPPING_DATE,
        key: ColumnKey.SHIPPING_DATE,
        render: (value) => {
          const date = formatDate(value, STANDARD_DATE_FORMAT_SLASH);
          return (
            <LayoutCell>
              <OneLineText className="p-l--2xs" value={date} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14 d-flex">
            {translate("PR.address")}
          </div>
        ),
        ellipsis: true,
        width: 250,
        dataIndex: ColumnKey.ADDRESS,
        key: ColumnKey.ADDRESS,
        render: (value) => {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14 d-flex">{translate("PR.note")}</div>
        ),
        ellipsis: true,
        width: 250,
        dataIndex: ColumnKey.NOTE,
        key: ColumnKey.NOTE,
        render: (value) => {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <StandardTable
      rowKey="id"
      isDragable
      dataSource={listReceiverInfosByGoodItems}
      columns={columns}
      scroll={{ y: "calc(100vh - 320px)" }}
      className="date_received_table"
    />
  );
};

export default DateReceivedTable;
