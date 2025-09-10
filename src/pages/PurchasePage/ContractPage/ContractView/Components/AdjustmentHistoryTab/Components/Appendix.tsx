import { useContext, useMemo } from "react";
import { ColumnProps } from "antd/lib/table";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import { isEmpty } from "lodash";

import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { listAppendixStatus } from "pages/PurchasePage/ContractPage/constants";
import { ContractAppendix } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import AssetEmpty from "components/EmptyTable/AssetEmpty";
import { CONTRACT_ANNEX_DETAIL_ROUTE } from "config/route-const";

enum ColumnKey {
  CODE = "code",
  CONTRACT_APPENDIX_NO = "contractAppendixNo",
  NAME = "name",
  EFFECTIVE_DATE = "effectiveDate",
  APPROVED_DATE = "approvedDate",
  CREATED_DATE = "createdDate",
  USER = "user",
  STATUS = "status",
}

const columnsWidth = {
  code: 130,
  contractAppendixNo: 150,
  effectiveDate: 130,
  approvedDate: 130,
  createdDate: 130,
  user: 200,
  status: 116,
};

const Appendix = () => {
  const [translate] = useTranslation();
  const { model } = useContext(ContractDetailHookContext);

  const handleGoToAppendixDetail = (id: string) => {
    if (!id) return;
    window.open(`${CONTRACT_ANNEX_DETAIL_ROUTE}/${id}`, "_blank");
  };

  const columns: ColumnProps<ContractAppendix>[] = useMemo(
    () => [
      {
        title: translate("CT.ticket_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        ellipsis: true,
        width: columnsWidth.code,
        render(_, record: ContractAppendix) {
          return (
            <LayoutCell>
              <div
                onClick={() => {
                  handleGoToAppendixDetail(record?.id);
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
        title: translate("CT.contract_appendix.appendix_number"),
        key: ColumnKey.CONTRACT_APPENDIX_NO,
        dataIndex: ColumnKey.CONTRACT_APPENDIX_NO,
        ellipsis: true,
        width: columnsWidth.contractAppendixNo,
        render(_, record: ContractAppendix) {
          return (
            <LayoutCell>
              <OneLineText value={record?.contractAppendixNo} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_appendix.appendix_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        render(_, record: ContractAppendix) {
          return (
            <LayoutCell>
              <OneLineText value={record?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.txt_valid_date"),
        key: ColumnKey.EFFECTIVE_DATE,
        dataIndex: ColumnKey.EFFECTIVE_DATE,
        ellipsis: true,
        width: columnsWidth.effectiveDate,
        render(_, record: ContractAppendix) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  record?.effectiveDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
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
        render(_, record: ContractAppendix) {
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
        title: translate("CT.label_created_time"),
        key: ColumnKey.CREATED_DATE,
        dataIndex: ColumnKey.CREATED_DATE,
        ellipsis: true,
        width: columnsWidth.createdDate,
        render(_, record: ContractAppendix) {
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
      {
        title: translate("CT.label_create_user"),
        key: ColumnKey.USER,
        dataIndex: ColumnKey.USER,
        width: columnsWidth.user,
        ellipsis: true,
        render(_, record: ContractAppendix) {
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
        title: translate("CT.txt_status"),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        ellipsis: true,
        width: columnsWidth.status,
        render(_, record: ContractAppendix) {
          const item = listAppendixStatus.find(
            (statusType) => statusType.id === record?.status
          );

          return (
            <LayoutCell>
              {item && (
                <Tag
                  size="md"
                  value={item?.name}
                  status={item?.code}
                  isShowDot={false}
                  isShowBorder
                />
              )}
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  if (isEmpty(model?.contractAppendixs)) {
    return <AssetEmpty />;
  }

  return (
    <StandardTable
      rowKey="id"
      isDragable
      columns={columns}
      dataSource={model?.contractAppendixs}
      scroll={{ y: "calc(100vh - 430px)" }}
    />
  );
};

export default Appendix;
