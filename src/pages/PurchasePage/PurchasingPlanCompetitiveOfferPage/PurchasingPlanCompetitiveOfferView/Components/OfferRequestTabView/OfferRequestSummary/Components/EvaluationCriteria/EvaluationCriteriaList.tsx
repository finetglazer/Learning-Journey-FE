import { Key, RowSelectionType } from "antd/lib/table/interface";
import { emptyCloudIcon } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { TABLE_ROW_KEY } from "core/config/consts";
import { isEmpty } from "lodash";
import {
  ColumnKey,
  EvaluationCriteria,
  EvaluationCriteriaGroup,
  EvaluationMethod,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import React, { useState } from "react";
import { Checkbox, StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./EvaluationCriteriaList.scss";
import { ColumnByEvaluationMethod } from "./EvaluationMethod/ColumnByEvaluationMethod";

const EvaluationCriteriaList = ({
  contextValue,
  columnKey,
  isDetail = false,
  data,
}: {
  contextValue: PurchasingPlanModel;
  columnKey: ColumnKey;
  isDetail: boolean;
  data?: EvaluationCriteriaGroup;
}) => {
  const [translate] = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);

  const { model } = contextValue;

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: "checkbox" as RowSelectionType,
    renderCell: (value: boolean, record: EvaluationCriteria) => {
      return (
        <div className="d-flex justify-content-center align-items-center pt-2 payment-height_40">
          <Checkbox
            checked={value}
            onChange={(e) => {
              if (e) {
                setSelectedRowKeys([...selectedRowKeys, record.id]);
              } else {
                setSelectedRowKeys(
                  selectedRowKeys.filter((key) => key !== record.id)
                );
              }
            }}
          />
        </div>
      );
    },
  };

  return (
    <div className="evaluation_criteria_list">
      <div className="header-tech-criteria align-items-end">
        <div className="select-box">
          {isDetail && (
            <div className="evaluation-method">
              <span className="label">
                {translate("PL.txt_evaluation_method_")}
              </span>
              {data?.evaluationMethod === EvaluationMethod.Scoring && (
                <span>
                  <span className="value">{translate("PL.txt_scoring")}</span>
                  <span className="label ic p-x--sm">|</span>

                  <span className="label">
                    {translate("PL.technical_weight")}:&nbsp;
                  </span>
                  <span className="value p-r--sm">
                    {data?.technicalWeight}%
                  </span>

                  <span className="label p-l--sm">
                    {translate("PL.quotation_weight")}:&nbsp;
                  </span>
                  <span className="value">{data?.financialWeight}%</span>
                </span>
              )}
              {data?.evaluationMethod === EvaluationMethod.PassFail && (
                <span>
                  <span className="value">
                    {translate("PL.txt_pass_or_fail")}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {isEmpty(data?.evaluationCriterias) ? (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate("CM.empty.no_data_recorded")}
        />
      ) : (
        <div>
          <StandardTable
            rowKey={TABLE_ROW_KEY}
            columns={ColumnByEvaluationMethod({
              translate,
              model,
              isScoring: data?.evaluationMethod === EvaluationMethod.Scoring,
              columnKey,
              isDetail,
            })}
            dataSource={data?.evaluationCriterias}
            rowSelection={isDetail ? null : rowSelection}
            scroll={{ y: "calc(100vh - 470px)" }}
            rowClassName="payment-custom_row_table"
            className="payment-row_selection"
            isDragable={true}
            idContainer="evaluation-criteria-list"
          />
        </div>
      )}
    </div>
  );
};

export default EvaluationCriteriaList;
