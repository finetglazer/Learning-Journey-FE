import Table, { ColumnProps } from "antd/lib/table";
import { listEvaluation } from "config/const";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";
import { formatNumber, roundTo } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField } from "core/services/service-types";
import { isNil } from "lodash";
import {
  ColumnKey,
  EvaluationItemResult,
  EvaluationResult,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import { getStatusByPassFlag } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingView/Components/ReviewSummaryTab/helper";
import React, { useEffect, useMemo, useState } from "react";
import { Model } from "react-3layer-common";
import {
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import "./EvaluationResultsTable.scss";
import { Tooltip } from "antd";
import { formatDecimal } from "core/helpers/currency";

type Props = {
  model?: EvaluationResult;
  data: EvaluationItemResult[];
  type?: TechnicalCompetenceType;
  isEdit?: boolean;
  handleUpdate?: (data: EvaluationItemResult[]) => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  dataTable?: EvaluationResult;
};

const EvaluationResultsTable = ({
  data,
  type,
  isEdit,
  handleUpdate,
  model,
  handleChangeSingleField,
  dataTable,
}: Props) => {
  const [translate] = useTranslation();
  const [dataRender, setDataRender] = useState(data);
  const [sumTechnical, setSumTechnical] = useState<number>(0);
  const [sumQuotation, setSumQuotation] = useState<number>(0);

  useEffect(() => {
    setDataRender(data);
  }, [data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeItemTable = (
    id: string,
    value: number | string,
    key: string
  ) => {
    const newData = dataRender.map((item) => {
      if (item.evaluationCriteriaId === id) {
        return {
          ...item,
          [key]: value,
        };
      }
      return item;
    });
    setDataRender(newData);
    handleUpdate(newData);
  };

  const columns: ColumnProps<EvaluationItemResult>[] = useMemo(
    () => [
      {
        title: translate("PL.txt_stt"),
        key: ColumnKey.INDEX,
        dataIndex: ColumnKey.INDEX,
        sorter: false,
        width: 50,
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
        width: 294,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_evaluator"),
        key: "evaluationUser",
        dataIndex: "evaluationUser",
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
        title: () => (
          <div className="d-flex align-items-center">
            <span className="p-r--3xs">
              {translate("PL.txt_review_summary_assessment_score")}
            </span>
          </div>
        ),
        key: ColumnKey.PASS_FLAG,
        dataIndex: ColumnKey.PASS_FLAG,
        sorter: false,
        width: 130,
        render(_, item) {
          if (item?.isDefaultCriteria) {
            return (
              <LayoutCell>
                <OneLineText
                  value={getStatusByPassFlag(item?.point)}
                  useTooltip
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <OneLineText
                value={
                  item?.isQuotation
                    ? String(roundTo(item?.point, 2))
                    : getStatusByPassFlag(item?.passFlag)
                }
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
        width: 150,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-flex align-items-center">
            <span className="p-r--3xs">
              {translate("PL.txt_summary_score")}
            </span>
            {isEdit && <span className="text-danger">*</span>}
          </div>
        ),
        key: "summaryPassFlag",
        dataIndex: "summaryPassFlag",
        sorter: false,
        width: 130,
        render(_, item, index) {
          if (item?.isDefaultCriteria) {
            return (
              <LayoutCell>
                <OneLineText
                  value={getStatusByPassFlag(item?.summaryPoint)}
                  useTooltip
                />
              </LayoutCell>
            );
          }
          if (isEdit && index) {
            return (
              <FormItem
                validateObject={
                  isNil(item?.passFlag)
                    ? utilService.getValidateObj(
                        model,
                        `summaryPassFlag.${item?.evaluationCriteriaId}`
                      )
                    : null
                }
                isTableCell
              >
                <LayoutCell>
                  <Select
                    valueFilter={{
                      name: "",
                    }}
                    isRequired
                    classFilter={undefined}
                    getList={() => of(listEvaluation)}
                    onChange={(id, value) => {
                      handleChangeItemTable(
                        item?.evaluationCriteriaId,
                        value?.id,
                        "summaryPassFlag"
                      );
                    }}
                    searchType=""
                    isEnumerable={false}
                    placeHolder={translate("PL.txt_choice_evaluation_point")}
                    value={listEvaluation.find(
                      (i) => i.id === item?.summaryPassFlag
                    )}
                    appendToBody
                  />
                </LayoutCell>
              </FormItem>
            );
          }
          return (
            <LayoutCell>
              <OneLineText
                value={
                  item?.isQuotation
                    ? String(roundTo(item.point, 2))
                    : getStatusByPassFlag(item.passFlag)
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_summary_note"),
        key: "summaryNote",
        dataIndex: "summaryNote",
        sorter: false,
        width: 150,
        render(item, record, index) {
          if (isEdit && index) {
            return (
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `summaryNote.${record?.evaluationCriteriaId}`
                )}
                isTableCell
              >
                <LayoutCell>
                  <InputText
                    value={item}
                    onChange={(value) => {
                      handleChangeItemTable(
                        record?.evaluationCriteriaId,
                        value,
                        "summaryNote"
                      );
                    }}
                    placeHolder={translate(
                      "PL.purchasing_plan_note_placeholder"
                    )}
                    isTableCell
                    maxLength={255}
                    translate={translate}
                    regexInput={NOT_TAB_ENTER_REGEX}
                    regexErrorDescription={translate(
                      "PL.warning_tab_enter_character"
                    )}
                  />
                </LayoutCell>
              </FormItem>
            );
          }
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [handleChangeItemTable, isEdit, model, translate]
  );

  const columnsTechnicalScore: ColumnProps<EvaluationItemResult>[] = useMemo(
    () => [
      {
        title: translate("PL.txt_stt"),
        key: "index",
        dataIndex: "index",
        sorter: false,
        width: 50,
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
        width: 120,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_evaluator"),
        key: "evaluationUser",
        dataIndex: "evaluationUser",
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
        title: translate("PL.txt_max_score"),
        key: "maximumPointScale",
        dataIndex: "maximumPointScale",
        sorter: false,
        align: "left",
        width: 130,
        render(item) {
          return (
            <LayoutCell position="left">
              <OneLineText value={item ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_min_score"),
        key: "minimumPointScale",
        dataIndex: "minimumPointScale",
        sorter: false,
        align: "left",
        width: 130,
        render(item) {
          return (
            <LayoutCell position="left">
              <OneLineText value={item ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-flex align-items-center">
            <span className="p-r--3xs">
              {translate("PL.txt_review_summary_assessment_score")}
            </span>
          </div>
        ),
        key: "point",
        dataIndex: "point",
        sorter: false,
        width: 130,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText
                value={String(roundTo(item.point, 2)) || "---"}
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
        width: 150,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-flex align-items-center">
            <span className="p-r--3xs">
              {translate("PL.txt_summary_score")}
            </span>
            {isEdit && <span className="text-danger">*</span>}
          </div>
        ),
        key: "summaryPoint",
        dataIndex: "summaryPoint",
        sorter: false,
        width: 130,
        render(_, item: EvaluationItemResult, index) {
          if (isEdit && index) {
            return (
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `summaryPoint.${item?.evaluationCriteriaId}`
                )}
                isTableCell
              >
                <LayoutCell>
                  <InputNumber
                    isRequired
                    isTableCell
                    value={item?.summaryPoint}
                    onChange={(value) => {
                      handleChangeItemTable(
                        item?.evaluationCriteriaId,
                        value,
                        "summaryPoint"
                      );
                    }}
                    numberType={"DECIMAL"}
                    decimalDigit={2}
                    max={item?.maximumPointScale}
                    placeHolder={translate("PL.plh_score")}
                    translate={translate}
                  />
                </LayoutCell>
              </FormItem>
            );
          }
          return (
            <LayoutCell>
              <OneLineText
                value={
                  isNil(item?.summaryPoint) ? "---" : String(item.summaryPoint)
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_summary_note"),
        key: "summaryNote",
        dataIndex: "summaryNote",
        sorter: false,
        width: 150,
        render(item, record, index) {
          if (isEdit && index) {
            return (
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `summaryNote.${record?.evaluationCriteriaId}`
                )}
                isTableCell
              >
                <LayoutCell>
                  <InputText
                    value={item}
                    onChange={(value) => {
                      handleChangeItemTable(
                        record?.evaluationCriteriaId,
                        value,
                        "summaryNote"
                      );
                    }}
                    placeHolder={translate(
                      "PL.purchasing_plan_note_placeholder"
                    )}
                    isTableCell
                    maxLength={255}
                    translate={translate}
                    regexInput={NOT_TAB_ENTER_REGEX}
                    regexErrorDescription={translate(
                      "PL.warning_tab_enter_character"
                    )}
                  />
                </LayoutCell>
              </FormItem>
            );
          }
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, isEdit, model, handleChangeItemTable]
  );

  const renderItem = (
    label: string,
    content: JSX.Element,
    noteContent: JSX.Element,
    isScoreLabel = false,
    isPassType = false,
    summaryKeyIndex?: string,
    summaryKeyNote?: string
  ) => (
    <Table.Summary.Row>
      <Table.Summary.Cell index={0} colSpan={10} className="footer-table">
        <div className="footer-item-table">
          <div className={isScoreLabel ? "label-score" : "label"}>{label}</div>

          {isEdit ? (
            <>
              <div className="edit-content">{content}</div>
              <div className="edit-note">{noteContent}</div>
            </>
          ) : (
            <div className="d-flex align-items-center p--3xs">
              <div className="value-score">
                {isPassType
                  ? summaryKeyIndex === "summaryTechnicalPassFlag"
                    ? listEvaluation.find(
                        (i) => i?.id === dataTable?.[summaryKeyIndex]
                      )?.name
                    : !isNil(dataTable?.[summaryKeyIndex])
                    ? formatNumber(dataTable?.[summaryKeyIndex])
                    : ""
                  : !isNil(dataTable?.[summaryKeyIndex])
                  ? formatDecimal(dataTable?.[summaryKeyIndex], 2)
                  : ""}
              </div>
              <div className="value-note">
                {dataTable?.[summaryKeyNote] ?? ""}
              </div>
            </div>
          )}
        </div>
      </Table.Summary.Cell>
    </Table.Summary.Row>
  );

  const calculateResult = (data: EvaluationItemResult[]) => {
    const financialWeight =
      model?.evaluationGroupResult?.[0]?.technicalWeight || 0;
    let sumTech = 0;
    const sumQuotation =
      data?.reduce((acc: number, curr: EvaluationItemResult, index) => {
        if (index === 0) {
          sumTech = curr?.summaryPoint || 0;
          return acc + 0;
        }
        return acc + (curr?.summaryPoint || 0);
      }, 0) || 0;

    const sumMaxPointScale =
      financialWeight === 0
        ? 0
        : data.reduce(
            (acc: number, curr: EvaluationItemResult, currentIndex) => {
              if (currentIndex === 0) {
                return acc + 0;
              }
              const maxPoint = curr?.maximumPointScale || 0;
              return acc + maxPoint;
            },
            0
          );

    const sumTechnical = (sumQuotation * financialWeight) / sumMaxPointScale;
    setSumQuotation(sumTech || 0);
    setSumTechnical(sumTechnical || 0);
  };

  const triggerSum = () => {
    const sumQuota = model?.summaryQuotationPoint ?? sumQuotation;
    const sumTech = model?.summaryTechnicalPoint ?? sumTechnical;

    handleChangeSingleField({
      fieldName: "summaryPoint",
    })(sumQuota + sumTech);
  };

  useEffect(() => {
    triggerSum();
  }, [
    sumQuotation,
    sumTechnical,
    model?.summaryQuotationPoint,
    model?.summaryTechnicalPoint,
  ]);

  useEffect(() => {
    if (sumQuotation) {
      handleChangeSingleField({
        fieldName: "summaryQuotationPoint",
      })(sumQuotation);
    }
  }, [sumQuotation]);

  useEffect(() => {
    if (sumTechnical) {
      handleChangeSingleField({
        fieldName: "summaryTechnicalPoint",
      })(sumTechnical);
    }
  }, [sumTechnical]);

  const renderFooter = (data: EvaluationItemResult[]) => {
    if (
      isNil(dataTable?.summaryPoint) &&
      isNil(dataTable?.summaryTechnicalPoint) &&
      isNil(dataTable?.summaryQuotationPoint)
    ) {
      calculateResult(data);
    }

    if (type === TechnicalCompetenceType.TechnicalCriteriaMet) {
      return (
        <>
          {renderItem(
            translate("PL.txt_result_total_technical"),
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryTechnicalPassFlag`
              )}
              isTableCell
            >
              <Select
                valueFilter={{
                  name: "",
                }}
                isRequired
                classFilter={undefined}
                getList={() => of(listEvaluation)}
                onChange={(id) => {
                  handleChangeSingleField({
                    fieldName: "summaryTechnicalPassFlag",
                  })(id);
                }}
                value={listEvaluation.find(
                  (i) => i?.id === model?.summaryTechnicalPassFlag
                )}
                searchType=""
                isEnumerable={false}
                placeHolder={translate("PL.txt_choice_evaluation_point")}
                appendToBody
              />
            </FormItem>,
            <InputText
              placeHolder={translate("PL.purchasing_plan_note_placeholder")}
              maxLength={255}
              translate={translate}
              regexInput={NOT_TAB_ENTER_REGEX}
              isTableCell
              value={model?.summaryTechnicalNote}
              onChange={handleChangeSingleField({
                fieldName: "summaryTechnicalNote",
              })}
              regexErrorDescription={translate(
                "PL.warning_tab_enter_character"
              )}
            />,
            false,
            true,
            "summaryTechnicalPassFlag",
            "summaryTechnicalNote"
          )}

          {renderItem(
            translate("PL.txt_result_total_financial"),
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryQuotationPoint`
              )}
              isTableCell
            >
              <InputNumber
                isRequired
                numberType="DECIMAL"
                decimalDigit={2}
                placeHolder={translate("PL.plh_score")}
                onChange={handleChangeSingleField({
                  fieldName: "summaryQuotationPoint",
                })}
                value={model?.summaryQuotationPoint}
                translate={translate}
                isTableCell
              />
            </FormItem>,
            <InputText
              placeHolder={translate("PL.purchasing_plan_note_placeholder")}
              value={model?.summaryQuotationNote}
              isTableCell
              onChange={handleChangeSingleField({
                fieldName: "summaryQuotationNote",
              })}
              maxLength={255}
              translate={translate}
              regexInput={NOT_TAB_ENTER_REGEX}
              regexErrorDescription={translate(
                "PL.warning_tab_enter_character"
              )}
            />,
            false,
            true,
            "summaryQuotationPoint",
            "summaryQuotationNote"
          )}
        </>
      );
    }

    return (
      <>
        {renderItem(
          translate("PL.txt_result_total_technical"),
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              `summaryTechnicalPoint`
            )}
            isTableCell
          >
            <InputNumber
              isRequired
              numberType="DECIMAL"
              decimalDigit={2}
              placeHolder={translate("PL.plh_score")}
              onChange={handleChangeSingleField({
                fieldName: "summaryTechnicalPoint",
              })}
              value={model?.summaryTechnicalPoint}
              translate={translate}
              isTableCell
            />
          </FormItem>,
          <InputText
            isTableCell
            value={model?.summaryTechnicalNote}
            onChange={handleChangeSingleField({
              fieldName: "summaryTechnicalNote",
            })}
            placeHolder={translate("PL.purchasing_plan_note_placeholder")}
            maxLength={255}
            translate={translate}
            regexInput={NOT_TAB_ENTER_REGEX}
            regexErrorDescription={translate("PL.warning_tab_enter_character")}
          />,
          true,
          false,
          "summaryTechnicalPoint",
          "summaryTechnicalNote"
        )}

        {renderItem(
          translate("PL.txt_result_total_financial"),
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              `summaryQuotationPoint`
            )}
            isTableCell
          >
            <InputNumber
              isRequired
              numberType="DECIMAL"
              decimalDigit={2}
              placeHolder={translate("PL.plh_score")}
              onChange={handleChangeSingleField({
                fieldName: "summaryQuotationPoint",
              })}
              value={model?.summaryQuotationPoint}
              translate={translate}
              isTableCell
            />
          </FormItem>,
          <InputText
            isTableCell
            value={model?.summaryQuotationNote}
            onChange={handleChangeSingleField({
              fieldName: "summaryQuotationNote",
            })}
            placeHolder={translate("PL.purchasing_plan_note_placeholder")}
            maxLength={255}
            translate={translate}
            regexInput={NOT_TAB_ENTER_REGEX}
            regexErrorDescription={translate("PL.warning_tab_enter_character")}
          />,
          true,
          false,
          "summaryQuotationPoint",
          "summaryQuotationNote"
        )}

        {renderItem(
          translate("PL.txt_result_total"),
          <FormItem
            validateObject={utilService.getValidateObj(model, `summaryPoint`)}
            isTableCell
          >
            <InputNumber
              isRequired
              numberType="DECIMAL"
              decimalDigit={2}
              placeHolder={translate("PL.plh_score")}
              onChange={handleChangeSingleField({
                fieldName: "summaryPoint",
              })}
              value={model?.summaryPoint || 0}
              translate={translate}
              isTableCell
            />
          </FormItem>,
          <InputText
            isTableCell
            value={model?.summaryNote}
            onChange={handleChangeSingleField({
              fieldName: "summaryNote",
            })}
            placeHolder={translate("PL.purchasing_plan_note_placeholder")}
            maxLength={255}
            translate={translate}
            regexInput={NOT_TAB_ENTER_REGEX}
            regexErrorDescription={translate("PL.warning_tab_enter_character")}
          />,
          true,
          false,
          "summaryPoint",
          "summaryNote"
        )}
      </>
    );
  };

  return (
    <div className="evaluation-results-table">
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
        summary={(data) => renderFooter(data as EvaluationItemResult[])}
      />
    </div>
  );
};

export default React.memo(EvaluationResultsTable);
