import { ColumnProps } from "antd/lib/table";
import { CheckedDisable, emptyCloudIcon, IcCheckedSuccess } from "assets/icons";
import dayjs from "dayjs";
import React from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./HistoryReviewTable.scss";
import { PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE } from "config/route-const";
import { useHistory } from "react-router-dom";
import { isArray, isNil, size } from "lodash";
import { Tooltip } from "antd";
import { addZStringToDate } from "core/helpers/date-time";
import { LIST_ROLE_EVALUATION } from "config/const";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";

const APPOINTMENT_METHOD_ICON_SIZE = 16;

interface EvaluationHistory {
  adjustmentId: string;
  adjustmentCode: string;
  approveDate: string;
  role: number;
  isActive: boolean;
}

interface Props {
  currentData?: EvaluationHistory[];
}

const HistoryReviewTable = ({ currentData }: Props) => {
  const [translate] = useTranslation();
  const history = useHistory();

  const handleRedirectBiddingView = (id: string) => {
    if (isNil(id)) {
      return;
    }
    return history.push(`${PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE}/${id}`);
  };

  const columns: ColumnProps<EvaluationHistory>[] = [
    {
      title: translate("PL.txt_code_dc"),
      key: "phone_number",
      dataIndex: "user",
      sorter: false,
      width: 160,
      render(_, record) {
        return (
          <LayoutCell>
            <Tooltip title={record?.adjustmentCode}>
              <div
                className="text-table-content-primary"
                onClick={() => handleRedirectBiddingView(record?.adjustmentId)}
              >
                {record?.adjustmentCode}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_date_apply"),
      key: "position",
      dataIndex: "user",
      sorter: false,
      width: 175,
      render(_, record) {
        return (
          <LayoutCell>
            <OneLineText
              className="text-first__style"
              value={
                record?.approveDate &&
                dayjs(addZStringToDate(record?.approveDate)).format(
                  "DD/MM/YYYY"
                )
              }
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_role_vote"),
      key: "organization",
      dataIndex: "user",
      sorter: false,
      width: 175,
      render(_, record) {
        return (
          <LayoutCell>
            <OneLineText
              className="text-first__style"
              value={
                LIST_ROLE_EVALUATION.find((item) => item.id === record?.role)
                  ?.name
              }
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.table_purchase_plan_status"),
      key: "criteria_count",
      dataIndex: "criteriaCount",
      ellipsis: true,
      sorter: false,
      width: 90,
      align: "center",
      render(_, record) {
        return (
          <LayoutCell position="center">
            <img
              src={record?.isActive ? IcCheckedSuccess : CheckedDisable}
              width={APPOINTMENT_METHOD_ICON_SIZE}
              height={APPOINTMENT_METHOD_ICON_SIZE}
              alt="icon_checked_success"
            />
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <div className="history-review-table">
      {isArray(currentData) && size(currentData) === 0 ? (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate("CM.empty.no_data_recorded")}
        />
      ) : (
        <StandardTable
          rowKey="id"
          isDragable
          idContainer="evaluation-table"
          columns={columns}
          dataSource={currentData}
          scroll={{ y: "calc(100vh - 326px)" }}
        />
      )}
    </div>
  );
};

export default HistoryReviewTable;
