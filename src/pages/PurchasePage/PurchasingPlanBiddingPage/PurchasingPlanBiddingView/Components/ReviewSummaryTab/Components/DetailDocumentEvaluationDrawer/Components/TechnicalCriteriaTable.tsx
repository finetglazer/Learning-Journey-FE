import Table, { ColumnProps } from "antd/lib/table";
import {
  ColumnKey,
  CriteriaType,
  EvaluationGroupResult,
  EvaluationItemResult,
  EvaluationResult,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import React, { useEffect, useMemo, useState } from "react";
import {
  FormItem,
  InputNumber,
  LayoutCell,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { getStatusByPassFlag } from "../../../helper";
import { of } from "rxjs";
import { listEvaluation } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { isNil } from "lodash";
import FooterTable from "./FooterTable";
import "./TechnicalCriteriaTable.scss";
import { Col, Tooltip } from "antd";
import { ConfigField } from "core/services/service-types";

type Props = {
  model?: EvaluationResult;
  data: EvaluationItemResult[];
  groupData: EvaluationGroupResult;
  type?: TechnicalCompetenceType;
  isEdit?: boolean;
  handleUpdate?: (data: EvaluationItemResult[]) => void;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
};

const TechnicalCriteriaTable = ({
  data,
  groupData,
  type,
  isEdit,
  handleUpdate,
  model,
  handleChangeSingleField,
}: Props) => {
  const [translate] = useTranslation();
  const [dataRender, setDataRender] = useState(data);

  useEffect(() => {
    setDataRender(data);
  }, [data]);

  const columns: ColumnProps<EvaluationItemResult>[] = [
    {
      title: translate("PL.txt_stt"),
      key: ColumnKey.INDEX,
      dataIndex: ColumnKey.INDEX,
      sorter: false,
      width: 46,
      render(item, record, index) {
        return (
          <LayoutCell>
            <OneLineText value={`${index + 1}`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_criteria_name"),
      key: ColumnKey.NAME,
      dataIndex: ColumnKey.NAME,
      sorter: false,
      width: 408,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText value={item} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_evaluator"),
      key: ColumnKey.EVALUATION_USER,
      dataIndex: ColumnKey.EVALUATION_USER,
      sorter: false,
      width: 120,
      render(item) {
        return (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${item?.email} - ${item?.name}`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {item?.email || "---"}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },

    {
      title: translate("PL.txt_review_summary_assessment_score"),
      key: ColumnKey.PASS_FLAG,
      dataIndex: ColumnKey.PASS_FLAG,
      sorter: false,
      width: 130,
      render(_, item) {
        return (
          <LayoutCell>
            <OneLineText
              value={getStatusByPassFlag(item.passFlag)}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_note_review"),
      key: ColumnKey.NOTE,
      dataIndex: ColumnKey.NOTE,
      sorter: false,
      width: 300,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText value={item || "---"} useTooltip />
          </LayoutCell>
        );
      },
    },
  ];

  const columnsTechnicalScore: ColumnProps<EvaluationItemResult>[] = [
    {
      title: translate("PL.txt_stt"),
      key: "index",
      dataIndex: "index",
      sorter: false,
      width: 46,
      render(item, record, index) {
        return (
          <LayoutCell>
            <OneLineText value={`${index + 1}`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_criteria_name"),
      key: ColumnKey.NAME,
      dataIndex: ColumnKey.NAME,
      sorter: false,
      width:
        groupData?.criteriaType === CriteriaType.TechnicalCompetence
          ? 168
          : 318,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText value={item} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_evaluator"),
      key: ColumnKey.EVALUATION_USER,
      dataIndex: ColumnKey.EVALUATION_USER,
      sorter: false,
      width: 130,
      render(item) {
        return (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${item?.email} - ${item?.name}`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {item?.email || "---"}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_max_score"),
      key: ColumnKey.MAX_POINT_SCALE,
      dataIndex: ColumnKey.MAX_POINT_SCALE,
      sorter: false,
      width: 130,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText value={item ?? "---"} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_min_score"),
      key: ColumnKey.MIN_POINT_SCALE,
      dataIndex: ColumnKey.MIN_POINT_SCALE,
      sorter: false,
      width: 130,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText value={item ?? "---"} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_review_summary_assessment_score"),
      key: ColumnKey.POINT,
      dataIndex: "point",
      sorter: false,
      width: 130,
      render(_, item) {
        return (
          <LayoutCell>
            <OneLineText value={item?.point?.toString() || "---"} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.txt_note_review"),
      key: ColumnKey.NOTE,
      dataIndex: ColumnKey.NOTE,
      sorter: false,
      width: 300,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText value={item || "---"} useTooltip />
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <div className="technical-criteria-table">
      <StandardTable
        rowKey={ColumnKey.TECHNICAL_REQUIREMENT}
        isDragable
        columns={
          type === TechnicalCompetenceType.TechnicalCriteriaMet
            ? columns
            : columnsTechnicalScore
        }
        dataSource={dataRender || []}
        scroll={{ y: "calc(100vh - 546px)" }}
        summary={() => {
          return (
            <FooterTable
              data={dataRender}
              type={type}
              isEdit={isEdit}
              model={model}
              groupData={groupData}
              handleChangeSingleField={handleChangeSingleField}
            />
          );
        }}
      />
    </div>
  );
};

export default React.memo(TechnicalCriteriaTable);
