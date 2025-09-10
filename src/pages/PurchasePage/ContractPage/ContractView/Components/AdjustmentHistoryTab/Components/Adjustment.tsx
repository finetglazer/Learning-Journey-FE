import { useContext, useMemo } from "react";
import { ColumnProps } from "antd/lib/table";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import { isEmpty } from "lodash";

import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { AdjustmentContract } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import AssetEmpty from "components/EmptyTable/AssetEmpty";

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  APPROVED_DATE = "approvedDate",
  USER = "user",
  CREATED_DATE = "createdDate",
}

const columnsWidth = {
  code: 160,
  approvedDate: 226,
  user: 300,
  createdDate: 300,
};

const Adjustment = () => {
  const [translate] = useTranslation();
  const { model } = useContext(ContractDetailHookContext);

  const handleGoToAdjustmentDetail = (id: string) => {
    if (!id) return;
    // TODO
    // window.open(`${CONTRACT_ROUTE_MASTER}/${id}`, "_blank");
  };

  const columns: ColumnProps<AdjustmentContract>[] = useMemo(
    () => [
      {
        title: translate("CT.adjustment_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        ellipsis: true,
        width: columnsWidth.code,
        render(_, record: AdjustmentContract) {
          return (
            <LayoutCell>
              <div
                onClick={() => {
                  handleGoToAdjustmentDetail(record?.id);
                }}
              >
                <OneLineText
                  className="text-table-content-primary"
                  value={record?.code}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.adjustment_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        render(_, record: AdjustmentContract) {
          return (
            <LayoutCell>
              <OneLineText value={record?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.approved_date"),
        key: ColumnKey.APPROVED_DATE,
        dataIndex: ColumnKey.APPROVED_DATE,
        ellipsis: true,
        width: columnsWidth.approvedDate,
        render(_, record: AdjustmentContract) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  record?.approvedDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.label_create_user"),
        key: ColumnKey.USER,
        dataIndex: ColumnKey.USER,
        width: columnsWidth.user,
        ellipsis: true,
        render(_, record: AdjustmentContract) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                placement="top"
                title={`${record?.user?.email}${
                  record?.user?.email ? " - " + record?.user?.fullName : ""
                }`}
              >
                <div className="text-in-table-cell">
                  <div className="text-ellipsis">{record?.user?.email}</div>
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.label_created_time"),
        key: ColumnKey.CREATED_DATE,
        dataIndex: ColumnKey.CREATED_DATE,
        ellipsis: true,
        width: columnsWidth.createdDate,
        render(_, record: AdjustmentContract) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  record?.createdDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  if (isEmpty(model?.adjustmentContracts)) {
    return <AssetEmpty />;
  }

  return (
    <StandardTable
      rowKey="id"
      isDragable
      columns={columns}
      dataSource={model?.adjustmentContracts}
      scroll={{ y: "calc(100vh - 430px)" }}
    />
  );
};

export default Adjustment;
