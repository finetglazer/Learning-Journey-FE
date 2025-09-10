import { ColumnProps } from "antd/lib/table";
import { emptyCloudIcon } from "assets/icons";
import { EvaluationTeam } from "models/PurchasingPlan";
import React from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { size } from "lodash";

type Props = {
  evaluationTeamDetails: EvaluationTeam[];
};

const EvaluationTable = ({ evaluationTeamDetails }: Props) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<EvaluationTeam>[] = [
    {
      title: translate("PL.competitive_offer.title.txt_evaluator"),
      key: "user",
      dataIndex: "user",
      sorter: false,
      width: 206,
      render(_, value) {
        return (
          <LayoutCell>
            <OneLineText
              className="text-first__style"
              value={value?.user?.name}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.competitive_offer.title.email"),
      key: "email",
      dataIndex: "user",
      sorter: false,
      width: 200,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText
              className="text-first__style"
              value={item?.email}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.competitive_offer.title.phone_number"),
      key: "phone_number",
      dataIndex: "user",
      sorter: false,
      width: 200,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText
              className="text-first__style"
              value={item?.phoneNumber}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.competitive_offer.title.position"),
      key: "position",
      dataIndex: "user",
      sorter: false,
      width: 200,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText
              className="text-first__style"
              value={item?.position?.name}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.competitive_offer.title.unit"),
      key: "organization",
      dataIndex: "user",
      sorter: false,
      width: 200,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText
              className="text-first__style"
              value={item?.organization?.name}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.competitive_offer.title.criteria_count"),
      key: "criteria_count",
      dataIndex: "criteriaCount",
      ellipsis: true,
      sorter: false,
      width: 200,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText
              className="text-first__style"
              value={item.toString()}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <div>
      {size(evaluationTeamDetails) > 0 ? (
        <StandardTable
          rowKey="id"
          isDragable
          idContainer="evaluation-table"
          columns={columns}
          dataSource={evaluationTeamDetails || []}
          scroll={{ y: "calc(100vh - 326px)" }}
        />
      ) : (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate("CM.empty.no_data_recorded")}
        />
      )}
    </div>
  );
};

export default EvaluationTable;
