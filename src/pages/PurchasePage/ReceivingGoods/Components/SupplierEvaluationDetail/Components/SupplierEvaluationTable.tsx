import { ColumnProps } from "antd/lib/table";
import classNames from "classnames";
import { MAX_DIGITAL_NUMBER_2_DIGITS } from "config/const";
import {
  MAX_LENGTH_255,
  NUMBER_TYPE_INPUT,
  TABLE_ROW_KEY,
} from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { isEqual } from "lodash";
import { SupplierEvaluationDetail } from "models/ReceivingGood/GoodsReceipt";
import { useCallback } from "react";
import {
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useSupplierEvaluationDetailHooks } from "../SupplierEvaluationDetailHook";
import "./SupplierEvaluationTable.scss";

const CHAR_IS_REQUIRED = "\u00A0*";

enum ColumnKey {
  NAME = "name",
  STANDARD = "standard",
  WEIGHT = "weight",
  SCORE = "score",
  NOTE = "note",
}

function SupplierEvaluationTable() {
  const {
    model,
    evaluations,
    supplierEvaluation,
    isEditable,
    translate,
    hasEvaluation,
    handleChangeSingleField,
  } = useSupplierEvaluationDetailHooks();

  const makeTitle = useCallback(
    (key: string, type?: string) => {
      return (
        <div className={classNames("component__title p-b--xs")}>
          {translate(key)}
          <span className="text-danger">{type}</span>
        </div>
      );
    },
    [translate]
  );

  const handleUpdateField = useCallback(
    (fieldName: string, value: string | number, id: string) => {
      const updatedEvaluationDetails =
        supplierEvaluation?.evaluationDetails?.map(
          (item: SupplierEvaluationDetail) => {
            if (isEqual(item.id, id)) {
              return {
                ...item,
                [fieldName]: value,
              };
            }
            return item;
          }
        );

      const newSupplierEvaluation = {
        ...supplierEvaluation,
        evaluationDetails: updatedEvaluationDetails,
      };
      handleChangeSingleField({
        fieldName: "supplierEvaluation",
      })(newSupplierEvaluation);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supplierEvaluation]
  );

  const columns: ColumnProps<SupplierEvaluationDetail>[] = [
    {
      title: makeTitle("RG.txt_criteria_name"),
      key: ColumnKey.NAME,
      dataIndex: ColumnKey.NAME,
      width: 240,
      render: (value: string) => {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
      onCell: (record) => {
        return {
          className: classNames({
            "font-bold": !hasEvaluation(record),
          }),
        };
      },
    },
    {
      title: makeTitle("AC.txt_standard"),
      key: ColumnKey.STANDARD,
      dataIndex: ColumnKey.STANDARD,
      render: (value: string) => (
        <LayoutCell>
          <p className="text-break-line my-2">{value}</p>
        </LayoutCell>
      ),
    },
    {
      title: makeTitle("AC.txt_weight_percent"),
      align: "right",
      width: 200,
      key: ColumnKey.WEIGHT,
      dataIndex: ColumnKey.WEIGHT,
      render: (value: number) => (
        <LayoutCell position="right">{formatNumber(value)}</LayoutCell>
      ),
      onCell: (record) => {
        return {
          className: classNames({
            "font-bold": !hasEvaluation(record),
          }),
        };
      },
    },
    {
      title: makeTitle("RG.txt_evaluation_score", CHAR_IS_REQUIRED),
      key: ColumnKey.SCORE,
      dataIndex: ColumnKey.SCORE,
      width: 124,
      align: "right",
      render: (value: number, record) => {
        if (!isEditable || !hasEvaluation(record)) {
          return (
            <LayoutCell position="right">{formatNumber(value)}</LayoutCell>
          );
        }
        return (
          <LayoutCell position="right">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `supplierEvaluation.evaluationDetails[${record?.indexBeforeValidate}].score`
              )}
              isTableCell
            >
              <InputNumber
                translate={translate}
                numberType={NUMBER_TYPE_INPUT}
                placeHolder={translate("RG.txt_placeholder_source")}
                onChange={(value) =>
                  handleUpdateField(ColumnKey.SCORE, value, record?.id)
                }
                min={0}
                decimalDigit={MAX_DIGITAL_NUMBER_2_DIGITS}
                max={supplierEvaluation?.evaluationScoreMax}
                value={value}
                isTableCell
              />
            </FormItem>
          </LayoutCell>
        );
      },
      onCell: (record) => {
        return {
          className: classNames({
            "font-bold": !hasEvaluation(record),
          }),
        };
      },
    },
    {
      title: makeTitle("RG.txt_notes"),
      key: ColumnKey.NOTE,
      dataIndex: ColumnKey.NOTE,
      render: (value, record) => {
        if (!hasEvaluation(record)) {
          return null;
        }

        if (!isEditable) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `supplierEvaluation.evaluationDetails[${record?.indexBeforeValidate}].note`
              )}
              isTableCell
            >
              <InputText
                maxLength={MAX_LENGTH_255}
                translate={translate}
                placeHolder={translate("RG.txt_placeholder_note")}
                value={value}
                onChange={(value) =>
                  handleUpdateField(ColumnKey.NOTE, value, record?.id)
                }
                isTableCell
                isByteCheck
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <div className="evaluation-supplier">
      <span className={"source-point"}>
        {translate("AC.txt_point_supplier", {
          count: supplierEvaluation?.evaluationScoreMax,
        })}
      </span>
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        columns={columns}
        dataSource={evaluations}
        scroll={{ y: "calc(100vh - 320px)" }}
      />
    </div>
  );
}

export default SupplierEvaluationTable;
