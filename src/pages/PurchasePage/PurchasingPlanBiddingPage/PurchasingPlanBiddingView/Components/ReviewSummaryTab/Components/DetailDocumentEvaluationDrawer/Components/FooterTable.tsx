import { Table } from "antd/lib";
import { listEvaluation } from "config/const";
import { isNil } from "lodash";
import {
  CriteriaType,
  EvaluationGroupResult,
  EvaluationItemResult,
  EvaluationMethod,
  EvaluationResult,
  TechnicalCompetenceType,
  ViewRole,
} from "models/PurchasingPlan";
import { useTranslation } from "react-i18next";
import { formatNumber } from "core/helpers/number";
import { formatDecimal } from "core/helpers/currency";
import {
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  OneLineText,
  Select,
} from "react-components-design-system";
import { utilService } from "core/services/common-services/util-service";
import { of } from "rxjs";
import { ConfigField } from "core/services/service-types";
import { useEffect, useState, useMemo, useContext } from "react";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";

type SummaryKey = keyof Pick<
  EvaluationGroupResult,
  | "summaryTechnicalPoint"
  | "summaryFinancialPoint"
  | "summaryQuotationPoint"
  | "summaryTechnicalPassFlag"
  | "summaryFinancialPassFlag"
  | "summaryTechnicalNote"
  | "summaryFinancialNote"
  | "summaryQuotationNote"
  | "summaryPoint"
  | "summaryNote"
>;

interface FooterTableProps {
  data: EvaluationItemResult[];
  groupData: EvaluationGroupResult;
  type: TechnicalCompetenceType;
  isEdit: boolean;
  model: EvaluationResult;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
}

const MAX_LENGTH_NOTE = 255;
const MAX_POINT_SCALE = 100;

const renderValue = (
  isPassType: boolean,
  summaryKeyIndex: SummaryKey,
  groupData?: EvaluationGroupResult
) => {
  if (isPassType) {
    if (
      summaryKeyIndex === "summaryTechnicalPassFlag" ||
      summaryKeyIndex === "summaryFinancialPassFlag"
    ) {
      return listEvaluation.find((i) => i?.id === groupData?.[summaryKeyIndex])
        ?.name;
    }
    return !isNil(groupData?.[summaryKeyIndex])
      ? formatNumber(Number(groupData?.[summaryKeyIndex]))
      : "";
  }
  return !isNil(groupData?.[summaryKeyIndex])
    ? formatDecimal(Number(groupData?.[summaryKeyIndex]), 2)
    : "";
};

const FooterTable = ({ data, isEdit, model, groupData }: FooterTableProps) => {
  const [translate] = useTranslation();
  const { model: modelMaster } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );
  const [groupDataRender, setGroupDataRender] = useState(groupData);

  useEffect(() => {
    setGroupDataRender(groupData);
  }, [groupData]);

  const handleChangeGroup = (
    id: string,
    key: string,
    value: number | string
  ) => {
    setGroupDataRender({ ...groupDataRender, [key]: value });

    const filterGroupData = (item: EvaluationGroupResult) => {
      return item.id !== groupDataRender.id;
    };
    const newGroupData =
      model?.evaluationGroupResult?.filter(filterGroupData) ?? [];

    if (model) {
      model.evaluationGroupResult = [
        ...newGroupData,
        {
          ...groupDataRender,
          [key]: value ?? null,
        },
      ];
    }
  };

  const shouldRenderTechnicalScore =
    groupData?.evaluationMethod === EvaluationMethod.Scoring &&
    groupData?.criteriaType === CriteriaType.TechnicalCompetence;

  const shouldRenderPassFlag =
    groupData?.evaluationMethod === EvaluationMethod.PassFail &&
    groupData?.criteriaType === CriteriaType.TechnicalCompetence;

  const shouldRenderQuotationScore =
    groupData?.evaluationMethod === EvaluationMethod.Scoring &&
    groupData?.criteriaType === CriteriaType.Finance;

  const shouldRenderQuotationPassFlag =
    groupData?.evaluationMethod === EvaluationMethod.PassFail &&
    groupData?.criteriaType === CriteriaType.Finance;

  const isEditTechnicalRole =
    modelMaster?.viewRole === ViewRole.TechnicalLeader ||
    modelMaster?.viewRole === ViewRole.FinancialEvaluator;

  const isEditFinancialRole =
    modelMaster?.viewRole === ViewRole.FinancialLeader ||
    modelMaster?.viewRole === ViewRole.TechnicalEvaluator;

  const renderItem = useMemo(() => {
    const renderItemComponent = (
      label: string,
      content: JSX.Element,
      noteContent: JSX.Element,
      isPassType = false,
      summaryKeyIndex?: SummaryKey,
      summaryKeyNote?: SummaryKey,
      isEdit = false,
      groupData?: EvaluationGroupResult
    ) => {
      return (
        <Table.Summary.Row>
          <Table.Summary.Cell
            index={0}
            colSpan={
              isEditFinancialRole && summaryKeyIndex === "summaryQuotationPoint"
                ? isPassType
                  ? 2
                  : 4
                : isPassType
                ? 3
                : 5
            }
            className="footer-table"
          >
            <div className="footer-item-table">
              <div className={isPassType ? "label-flag" : "label-score"}>
                {label}
              </div>
            </div>
          </Table.Summary.Cell>
          {isEdit ? (
            <>
              {isEditFinancialRole &&
                summaryKeyIndex === "summaryQuotationPoint" && (
                  <Table.Summary.Cell index={0} colSpan={1} className="p-0">
                    <LayoutCell>
                      <div>
                        {translate("PL.purchasing_plan_self_generating_system")}
                      </div>
                    </LayoutCell>
                  </Table.Summary.Cell>
                )}
              <Table.Summary.Cell index={0} colSpan={1} className="p-0">
                <LayoutCell>
                  <div>{content}</div>
                </LayoutCell>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={0} colSpan={1} className="p-0">
                <LayoutCell>
                  <div style={{ width: "230px" }}>{noteContent}</div>
                </LayoutCell>
              </Table.Summary.Cell>
            </>
          ) : (
            <>
              <Table.Summary.Cell
                index={0}
                colSpan={1}
                className={isPassType ? "value-flag p-0" : "value-score p-0"}
              >
                <LayoutCell>
                  <OneLineText
                    value={
                      summaryKeyIndex &&
                      renderValue(isPassType, summaryKeyIndex, groupData)
                    }
                  />
                </LayoutCell>
              </Table.Summary.Cell>
              <Table.Summary.Cell
                index={0}
                colSpan={1}
                className={isPassType ? "note-flag p-0" : "note-score p-0"}
              >
                <LayoutCell>
                  <OneLineText
                    value={String(groupData?.[summaryKeyNote] ?? "")}
                    useTooltip
                  />
                </LayoutCell>
              </Table.Summary.Cell>
            </>
          )}
        </Table.Summary.Row>
      );
    };
    return renderItemComponent;
  }, []);

  return (
    <>
      {shouldRenderPassFlag &&
        renderItem(
          translate("PL.totalPass"),
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              `summaryTechnicalPassFlag.${groupDataRender?.id}`
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
              onChange={(value) => {
                handleChangeGroup(
                  groupDataRender?.id,
                  "summaryTechnicalPassFlag",
                  value
                );
              }}
              searchType=""
              isEnumerable={false}
              placeHolder={translate("PL.txt_choice_evaluation_point")}
              value={listEvaluation.find(
                (i) => i.id === groupDataRender?.summaryTechnicalPassFlag
              )}
              appendToBody
            />
          </FormItem>,
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              `summaryTechnicalNote.${groupDataRender?.id}`
            )}
            isTableCell
          >
            <InputText
              placeHolder={translate("PL.purchasing_plan_note_placeholder")}
              onChange={(value) => {
                handleChangeGroup(
                  groupDataRender?.id,
                  "summaryTechnicalNote",
                  value
                );
              }}
              value={groupDataRender?.summaryTechnicalNote}
              translate={translate}
              maxLength={MAX_LENGTH_NOTE}
              regexInput={NOT_TAB_ENTER_REGEX}
              regexErrorDescription={translate(
                "PL.warning_tab_enter_character"
              )}
              isTableCell
            />
          </FormItem>,
          true,
          "summaryTechnicalPassFlag",
          "summaryTechnicalNote",
          isEdit && isEditTechnicalRole,
          groupDataRender
        )}

      {shouldRenderTechnicalScore &&
        renderItem(
          translate("PL.totalScore"),
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              `summaryTechnicalPoint.${groupDataRender?.id}`
            )}
            isTableCell
          >
            <InputNumber
              isRequired
              numberType="DECIMAL"
              decimalDigit={2}
              placeHolder={translate("PL.plh_score")}
              onChange={(value) => {
                handleChangeGroup(
                  groupDataRender?.id,
                  "summaryTechnicalPoint",
                  value
                );
              }}
              max={MAX_POINT_SCALE}
              value={groupDataRender?.summaryTechnicalPoint}
              translate={translate}
              isTableCell
            />
          </FormItem>,
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              `summaryTechnicalNote.${groupDataRender?.id}`
            )}
            isTableCell
          >
            <InputText
              placeHolder={translate("PL.purchasing_plan_note_placeholder")}
              onChange={(value) => {
                handleChangeGroup(
                  groupDataRender?.id,
                  "summaryTechnicalNote",
                  value
                );
              }}
              value={groupDataRender?.summaryTechnicalNote}
              translate={translate}
              maxLength={MAX_LENGTH_NOTE}
              regexInput={NOT_TAB_ENTER_REGEX}
              regexErrorDescription={translate(
                "PL.warning_tab_enter_character"
              )}
              isTableCell
            />
          </FormItem>,
          false,
          "summaryTechnicalPoint",
          "summaryTechnicalNote",
          isEdit && isEditTechnicalRole,
          groupDataRender
        )}

      {shouldRenderQuotationScore && (
        <>
          {renderItem(
            translate("PL.total_quotation"),
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryQuotationPoint.${groupDataRender?.id}`
              )}
              isTableCell
            >
              <InputNumber
                isRequired
                numberType="DECIMAL"
                decimalDigit={2}
                placeHolder={translate("PL.plh_score")}
                onChange={(value) => {
                  handleChangeGroup(
                    groupDataRender?.id,
                    "summaryQuotationPoint",
                    value
                  );
                }}
                max={MAX_POINT_SCALE}
                value={groupDataRender?.summaryQuotationPoint}
                translate={translate}
                isTableCell
              />
            </FormItem>,
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryQuotationNote.${groupDataRender?.id}`
              )}
              isTableCell
            >
              <InputText
                placeHolder={translate("PL.purchasing_plan_note_placeholder")}
                onChange={(value) => {
                  handleChangeGroup(
                    groupDataRender?.id,
                    "summaryQuotationNote",
                    value
                  );
                }}
                value={groupDataRender?.summaryQuotationNote}
                translate={translate}
                maxLength={MAX_LENGTH_NOTE}
                regexInput={NOT_TAB_ENTER_REGEX}
                regexErrorDescription={translate(
                  "PL.warning_tab_enter_character"
                )}
                isTableCell
              />
            </FormItem>,
            false,
            "summaryQuotationPoint",
            "summaryQuotationNote",
            isEdit && isEditFinancialRole,
            groupDataRender
          )}

          {renderItem(
            translate("PL.total_score_of_other_criteria"),
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryFinancialPoint.${groupDataRender?.id}`
              )}
              isTableCell
            >
              <InputNumber
                isRequired
                numberType="DECIMAL"
                decimalDigit={2}
                placeHolder={translate("PL.plh_score")}
                onChange={(value) => {
                  handleChangeGroup(
                    groupDataRender?.id,
                    "summaryFinancialPoint",
                    value
                  );
                }}
                max={MAX_POINT_SCALE}
                value={groupDataRender?.summaryFinancialPoint}
                translate={translate}
                isTableCell
              />
            </FormItem>,
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryFinancialNote.${groupDataRender?.id}`
              )}
              isTableCell
            >
              <InputText
                placeHolder={translate("PL.purchasing_plan_note_placeholder")}
                onChange={(value) => {
                  handleChangeGroup(
                    groupDataRender?.id,
                    "summaryFinancialNote",
                    value
                  );
                }}
                value={groupDataRender?.summaryFinancialNote}
                translate={translate}
                maxLength={MAX_LENGTH_NOTE}
                regexInput={NOT_TAB_ENTER_REGEX}
                regexErrorDescription={translate(
                  "PL.warning_tab_enter_character"
                )}
                isTableCell
              />
            </FormItem>,
            false,
            "summaryFinancialPoint",
            "summaryFinancialNote",
            isEdit && isEditFinancialRole,
            groupDataRender
          )}

          {renderItem(
            translate("PL.txt_total_point"),
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryPoint.${groupDataRender?.id}`
              )}
              isTableCell
            >
              <InputNumber
                isRequired
                numberType="DECIMAL"
                decimalDigit={2}
                placeHolder={translate("PL.plh_score")}
                onChange={(value) => {
                  handleChangeGroup(groupDataRender?.id, "summaryPoint", value);
                }}
                max={MAX_POINT_SCALE}
                value={groupDataRender?.summaryPoint}
                translate={translate}
                isTableCell
              />
            </FormItem>,
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryNote.${groupDataRender?.id}`
              )}
              isTableCell
            >
              <InputText
                placeHolder={translate("PL.purchasing_plan_note_placeholder")}
                onChange={(value) => {
                  handleChangeGroup(groupDataRender?.id, "summaryNote", value);
                }}
                value={groupDataRender?.summaryNote}
                translate={translate}
                maxLength={MAX_LENGTH_NOTE}
                regexInput={NOT_TAB_ENTER_REGEX}
                regexErrorDescription={translate(
                  "PL.warning_tab_enter_character"
                )}
                isTableCell
              />
            </FormItem>,
            false,
            "summaryPoint",
            "summaryNote",
            isEdit && isEditFinancialRole,
            groupDataRender
          )}
        </>
      )}

      {shouldRenderQuotationPassFlag && (
        <>
          {renderItem(
            translate("PL.total_quotation"),
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryQuotationPoint.${groupDataRender?.id}`
              )}
              isTableCell
            >
              <InputNumber
                isRequired
                numberType="DECIMAL"
                decimalDigit={2}
                placeHolder={translate("PL.plh_score")}
                max={MAX_POINT_SCALE}
                onChange={(value) => {
                  handleChangeGroup(
                    groupDataRender?.id,
                    "summaryQuotationPoint",
                    value
                  );
                }}
                value={groupDataRender?.summaryQuotationPoint}
                translate={translate}
                isTableCell
              />
            </FormItem>,
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryQuotationNote.${groupDataRender?.id}`
              )}
              isTableCell
            >
              <InputText
                placeHolder={translate("PL.purchasing_plan_note_placeholder")}
                onChange={(value) => {
                  handleChangeGroup(
                    groupDataRender?.id,
                    "summaryQuotationNote",
                    value
                  );
                }}
                value={groupDataRender?.summaryQuotationNote}
                translate={translate}
                maxLength={MAX_LENGTH_NOTE}
                regexInput={NOT_TAB_ENTER_REGEX}
                regexErrorDescription={translate(
                  "PL.warning_tab_enter_character"
                )}
                isTableCell
              />
            </FormItem>,
            true,
            "summaryQuotationPoint",
            "summaryQuotationNote",
            isEdit && isEditFinancialRole,
            groupDataRender
          )}

          {renderItem(
            translate("PL.total_score_of_other_criteria"),
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryFinancialPassFlag.${groupDataRender?.id}`
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
                onChange={(value) => {
                  handleChangeGroup(
                    groupDataRender?.id,
                    "summaryFinancialPassFlag",
                    value
                  );
                }}
                searchType=""
                isEnumerable={false}
                placeHolder={translate("PL.txt_choice_evaluation_point")}
                value={listEvaluation.find(
                  (i) => i.id === groupDataRender?.summaryFinancialPassFlag
                )}
                appendToBody
              />
            </FormItem>,
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `summaryFinancialNote.${groupDataRender?.id}`
              )}
              isTableCell
            >
              <InputText
                placeHolder={translate("PL.purchasing_plan_note_placeholder")}
                onChange={(value) => {
                  handleChangeGroup(
                    groupDataRender?.id,
                    "summaryFinancialNote",
                    value
                  );
                }}
                value={groupDataRender?.summaryFinancialNote}
                translate={translate}
                maxLength={MAX_LENGTH_NOTE}
                regexInput={NOT_TAB_ENTER_REGEX}
                regexErrorDescription={translate(
                  "PL.warning_tab_enter_character"
                )}
                isTableCell
              />
            </FormItem>,
            true,
            "summaryFinancialPassFlag",
            "summaryFinancialNote",
            isEdit && isEditFinancialRole,
            groupDataRender
          )}
        </>
      )}
    </>
  );
};

export default FooterTable;
