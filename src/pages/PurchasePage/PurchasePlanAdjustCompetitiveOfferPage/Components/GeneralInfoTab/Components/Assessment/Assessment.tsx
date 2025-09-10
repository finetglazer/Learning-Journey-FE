import { ColumnProps } from "antd/lib/table";
import { Model } from "react-3layer-common";
import {
  ActionBarComponent,
  Button,
  FormItem,
  InputNumber,
  LayoutCell,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";

import { utilService } from "core/services/common-services/util-service";
import { EvaluationCriteria, EvaluationMethod } from "models/PurchasingPlan";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { useAssessmentHook } from "./AssessmentHook";

import type { TableRowSelection } from "antd/es/table/interface";
import { AddIcon, TrashIcon } from "assets/icons";
import { EModal } from "config/const";
import { isEmpty, isNil, uniqueId } from "lodash";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";
import { of } from "rxjs";
import styles from "./Assessment.module.scss";
import { useTranslation } from "react-i18next";
import { EMPTY_STRING } from "core/config/consts";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";
import UploadDownloadFinancialCriteria from "../../../../../PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/OfferRequestTab/Components/EvaluationCriteria/UploadDownloadFinancialCriteria/UploadDownloadFinancialCriteria";
import React from "react";

export enum AssessmentMethodType {
  PASS_FAIL,
  SCORING,
}

enum ColumnKey {
  CRITERIA = "criteria",
  TECHNICAL_REQUIREMENTS = "technicalRequirements",

  MAXIMUM_SCORE = "maximumScore",
  MINIMUM_SCORE = "minimumScore",

  ASSESSOR = "assessor",
  EMAIL = "email",
  NOTE = "note",
}

interface Props {
  isDetail?: boolean;
  contextValue:
    | PurchasePlanAdjustCompetitiveOfferDetailHookContextProps
    | PurchasePlanAdjustBidDetailHookContextProps;
  fieldNameWrap?: string;
}

const Assessment = (props: Props) => {
  const {
    isDetail = false,
    contextValue,
    fieldNameWrap = "offerRequest",
  } = props;
  const [translate] = useTranslation();
  const {
    modal,
    isPassFail,
    selectedRowKeys,
    rowSelection,
    purchasePlanId,
    isDetailPage,
    isCreatePage,
    model,
    criteriaType,
    evaluationCriterions,
    technicalWeight,
    selectedRow,
    financialWeight,
    handleCloseDeleteModal,
    setSelectedRow,
    setSelectedRowKeys,
    handleChangeItemTable,
    handleDeleteRow,
    addNewAssessmentRow,
    handleConfirmDelete,
    evaluationMethodType,
  } = useAssessmentHook({ contextValue, fieldNameWrap });

  const canEdit =
    isDetailPage &&
    (isCreatePage ||
      [
        PURCHASING_PLAN_STATUS.WAITING_QUOTATION,
        PURCHASING_PLAN_STATUS.OPEN_PROFILE,
        PURCHASING_PLAN_STATUS.BIDDING,
        PURCHASING_PLAN_STATUS.DRAFT,
      ].includes(model.status));

  const getFieldError = (fieldName: string, index: number) => {
    return `${fieldNameWrap}.evaluationCriteriaGroup.evaluationCriterias[${index}].${fieldName}`;
  };

  const getError = (field: string) => {
    return utilService.getValidateObj(model, field);
  };

  const columns: ColumnProps<EvaluationCriteria>[] = [
    {
      title: (
        <>
          {translate("PPA.criteria_name")}
          {isDetail ? null : <span className="text-danger">&nbsp;*</span>}
        </>
      ),
      key: ColumnKey.CRITERIA,
      ellipsis: true,
      width: isPassFail ? 206 : 180,
      render: (record, _, index) => {
        if (!canEdit || record?.isDefault) {
          return (
            <LayoutCell>
              <OneLineText value={record?.name} />
            </LayoutCell>
          );
        }

        const errorField = getFieldError("name", index);

        return (
          <LayoutCell>
            <FormItem isTableCell validateObject={getError(errorField)}>
              <Select
                placeHolder={translate("PPA.select_criteria")}
                valueFilter={{
                  name: "",
                }}
                classFilter={undefined}
                getList={(filter) =>
                  purchasingPlanRepository.getAllEvaluationCriteria(
                    purchasePlanId,
                    isPassFail
                      ? EvaluationMethod.PassFail
                      : EvaluationMethod.Scoring,
                    criteriaType,
                    filter
                  )
                }
                value={record}
                onChange={(_, value: Model) => {
                  const criteriaItem = value as EvaluationCriteria;
                  // if (criteriaItem?.id === record?.id) return;
                  const evaluationUserSelected = record?.evaluationUserSelected;
                  const evaluationUser =
                    record?.criteriaItemSelected?.evaluationUser;
                  const dataMappingUser = evaluationUser?.find(
                    (el: EvaluationCriteria) =>
                      el.id === evaluationUserSelected?.id
                  );
                  let note = EMPTY_STRING;
                  if (dataMappingUser?.note) {
                    note = dataMappingUser.note;
                  }

                  handleChangeItemTable({
                    data: {
                      ...criteriaItem,
                      rowKeyId: uniqueId("evaluation_criteria"),
                      criteriaItemSelected: undefined,
                      minimumPointScaleSelected: undefined,
                      maximumPointScaleSelected: undefined,
                      note,
                    } as EvaluationCriteria,
                    id: record?.rowKeyId,
                    errorName: errorField,
                  });
                }}
                isEnumerable={false}
                appendToBody
                isRequired
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("EV.txt_evaluation_criteria_describe"),
      key: ColumnKey.TECHNICAL_REQUIREMENTS,
      width: isPassFail ? 300 : 200,
      render: (record, _, index) => {
        if (isNil(record?.criteriaItems)) {
          return null;
        }

        if (!canEdit || record?.isDefault) {
          return (
            <LayoutCell>
              <OneLineText
                value={record?.criteriaItemSelected?.technicalRequirement}
              />
            </LayoutCell>
          );
        }

        const errorField = getFieldError("technicalRequirement", index);

        return (
          <LayoutCell>
            <FormItem validateObject={getError(errorField)} isTableCell>
              <Select
                isRequired
                placeHolder={translate(
                  "EV.plh_evaluation_criteria_input_describe_select"
                )}
                valueFilter={{
                  name: "",
                }}
                classFilter={undefined}
                getList={() => of(record?.criteriaItems ?? [])}
                value={record?.criteriaItemSelected}
                onChange={(_, value: Model) => {
                  const evaluationUserSelected = record?.evaluationUserSelected;
                  const evaluationUser = value?.evaluationUser;
                  const dataMappingUser = evaluationUser?.find(
                    (el: EvaluationCriteria) =>
                      el.id === evaluationUserSelected?.id
                  );
                  let note = EMPTY_STRING;
                  if (dataMappingUser?.note) {
                    note = dataMappingUser.note;
                  }

                  handleChangeItemTable({
                    data: {
                      criteriaItemSelected: {
                        ...value,
                        evaluationCriteriaId: value?.id,
                      },
                      note,
                      minimumPointScaleSelected: undefined,
                      maximumPointScaleSelected: undefined,
                    } as EvaluationCriteria,
                    id: record?.rowKeyId,
                    errorName: errorField,
                  });
                }}
                render={(item) => item?.technicalRequirement}
                isEnumerable={false}
                appendToBody
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },

    {
      title: (
        <>
          {translate("PPA.maximum_score")}
          {isDetail ? null : <span className="text-danger">&nbsp;*</span>}
        </>
      ),
      key: ColumnKey.MAXIMUM_SCORE,
      width: 140,
      render: (record, _, index) => {
        if (isNil(record?.criteriaItems)) {
          return null;
        }

        if (!canEdit || record?.isDefault) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${record?.maximumPointScaleSelected?.score ?? ""}`}
              />
            </LayoutCell>
          );
        }

        const maximumPointScales =
          record?.criteriaItemSelected?.maximumPointScales ?? [];

        const errorField = getFieldError("maximumPointScale", index);

        return (
          <LayoutCell>
            <FormItem validateObject={getError(errorField)} isTableCell>
              <Select
                isRequired
                placeHolder={translate("PPA.select_score")}
                valueFilter={{
                  name: "",
                }}
                classFilter={undefined}
                getList={() => of(maximumPointScales)}
                value={record?.maximumPointScaleSelected}
                onChange={(_, value: Model) => {
                  handleChangeItemTable({
                    data: {
                      maximumPointScaleSelected: value,
                      minimumPointScaleSelected: undefined,
                    } as EvaluationCriteria,
                    id: record?.rowKeyId,
                    errorName: errorField,
                  });
                }}
                render={(item) => `${item?.score ?? ""}`}
                isEnumerable={false}
                appendToBody
              />
            </FormItem>
          </LayoutCell>
        );
      },
      hidden: isPassFail,
    },
    {
      title: (
        <>
          {translate("PPA.minimum_score")}
          {isDetail ? null : <span className="text-danger">&nbsp;*</span>}
        </>
      ),
      key: ColumnKey.MINIMUM_SCORE,
      ellipsis: true,
      width: 140,
      render: (record, _, index) => {
        if (isNil(record?.criteriaItems)) {
          return null;
        }

        if (!canEdit || record?.isDefault) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${record?.minimumPointScaleSelected?.score ?? ""}`}
              />
            </LayoutCell>
          );
        }

        const minimumPointScales =
          record?.maximumPointScaleSelected?.minimumPointScales;

        const errorField = getFieldError("minimumPointScale", index);

        return (
          <LayoutCell>
            <FormItem validateObject={getError(errorField)} isTableCell>
              <Select
                isRequired
                valueFilter={{
                  name: "",
                }}
                placeHolder={translate("PPA.select_score")}
                readOnly={isNil(record?.maximumPointScaleSelected)}
                classFilter={undefined}
                getList={() => of(minimumPointScales ?? [])}
                value={record?.minimumPointScaleSelected}
                onChange={(_, value: Model) => {
                  handleChangeItemTable({
                    data: {
                      minimumPointScaleSelected: value,
                    } as EvaluationCriteria,
                    id: record?.rowKeyId,
                    errorName: errorField,
                  });
                }}
                render={(item) => `${item?.score ?? ""}`}
                isEnumerable={false}
                appendToBody
              />
            </FormItem>
          </LayoutCell>
        );
      },
      hidden: isPassFail,
    },

    {
      title: (
        <>
          {translate("PPA.assessor")}
          {isDetail ? null : <span className="text-danger">&nbsp;*</span>}
        </>
      ),
      key: ColumnKey.ASSESSOR,
      ellipsis: true,
      width: 200,
      render: (record, _, index) => {
        if (!canEdit || record?.isDefault) {
          return (
            <LayoutCell>
              <OneLineText value={record?.evaluationUserSelected?.name} />
            </LayoutCell>
          );
        }

        const errorField = getFieldError("evaluationUserId", index);

        return (
          <LayoutCell>
            <FormItem validateObject={getError(errorField)} isTableCell>
              <Select
                placeHolder={translate("PPA.select_assessor")}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                classFilter={undefined}
                getList={purchasingPlanRepository.getListMasterUser}
                value={record?.evaluationUserSelected}
                onChange={(_, value: Model) => {
                  const evaluationUserSelected = value?.id;
                  const evaluationUser =
                    record?.criteriaItemSelected?.evaluationUser;
                  const dataMappingUser = evaluationUser?.find(
                    (el: EvaluationCriteria) => el.id === evaluationUserSelected
                  );
                  let note = EMPTY_STRING;
                  if (dataMappingUser?.note) {
                    note = dataMappingUser.note;
                  }

                  handleChangeItemTable({
                    data: {
                      evaluationUserSelected: value,
                      note,
                    } as EvaluationCriteria,
                    id: record?.rowKeyId,
                    errorName: errorField,
                  });
                }}
                isEnumerable={false}
                appendToBody
                isRequired
                isSearch
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.purchasing_plan_email"),
      key: ColumnKey.EMAIL,
      ellipsis: true,
      width: 200,
      render: (record) => {
        return (
          <LayoutCell>
            <OneLineText
              value={record?.evaluationUserSelected?.email ?? EMPTY_STRING}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("CT.note"),
      key: ColumnKey.NOTE,
      width: isPassFail ? 166 : 206,
      render: (record) => {
        return (
          <LayoutCell>
            <OneLineText value={record?.note ?? EMPTY_STRING} />
          </LayoutCell>
        );
      },
    },

    {
      width: 40,
      key: "id",
      fixed: "right",
      render(record) {
        if (!canEdit || record?.isDefault) return;

        return (
          <LayoutCell>
            <button
              className={styles["delete-row-btn"]}
              onClick={() => handleConfirmDelete(record?.rowKeyId)}
            >
              <TrashIcon fillColor="#C03629" />
            </button>
          </LayoutCell>
        );
      },
      hidden: !canEdit,
    },
  ];

  const renderAssessmentMethod = () => {
    return isPassFail ? (
      <div>
        <span className={styles["assessment-method-text"]}>{`${translate(
          "PPA.assessment_method"
        )}: `}</span>
        <strong className={styles["assessment-method-text--bold"]}>
          {translate("PPA.pass_fail")}
        </strong>
      </div>
    ) : (
      <div className="d-flex align-items-center gap-3">
        <div>
          <span className={styles["assessment-method-text"]}>{`${translate(
            "PPA.assessment_method"
          )}: `}</span>
          <strong className={styles["assessment-method-text--bold"]}>
            {translate("PPA.scoring")}
          </strong>
        </div>

        <div className={styles["assessment-method-text-divider"]}></div>

        <div className="d-flex gap-2 align-items-center">
          <span className={styles["assessment-method-text"]}>
            {translate("PL.technical_weight")}:&nbsp;
          </span>
          {canEdit ? (
            <div className={styles["scoring-ratio-input"]}>
              <InputNumber
                placeHolder="0"
                suffix="%"
                numberType="DECIMAL"
                max={0}
                min={100}
                translate={translate}
                value={technicalWeight}
                allowClear={false}
                disabled
              />
            </div>
          ) : (
            <strong className={styles["assessment-method-text--bold"]}>
              {technicalWeight ? `${technicalWeight}%` : "---"}
            </strong>
          )}
          <span className={styles["assessment-method-text"]}>
            {translate("PL.quotation_weight")}:&nbsp;
          </span>
          {canEdit ? (
            <div className={styles["scoring-ratio-input"]}>
              <InputNumber
                placeHolder="0"
                suffix="%"
                numberType="DECIMAL"
                max={0}
                min={100}
                translate={translate}
                value={financialWeight}
                allowClear={false}
                disabled
              />
            </div>
          ) : (
            <strong className={styles["assessment-method-text--bold"]}>
              {financialWeight ? `${financialWeight}%` : "---"}
            </strong>
          )}
        </div>
      </div>
    );
  };

  const rowSelections: TableRowSelection<EvaluationCriteria> = {
    ...rowSelection,
    getCheckboxProps: (record: EvaluationCriteria) => ({
      disabled: record?.isDefault,
    }),
    renderCell: (_, record, __, originNode) => {
      if (record?.isDefault) return <></>;

      return originNode;
    },
    onSelect: function (record: EvaluationCriteria, selected: boolean) {
      const rowKey = record?.rowKeyId;
      const selectedValuesId = selected
        ? [...selectedRowKeys, rowKey]
        : selectedRowKeys.filter((item) => item !== rowKey);
      const selectedValues = selected
        ? [...selectedRow, record]
        : selectedRow.filter((item) => item?.rowKeyId !== rowKey);
      setSelectedRowKeys(selectedValuesId);
      setSelectedRow(selectedValues);
    },
    onSelectAll: function (
      selected: boolean,
      selectedRows: EvaluationCriteria[],
      changeRows: EvaluationCriteria[]
    ) {
      let selectedValues = [...selectedRowKeys];
      const listKeys = changeRows.map(
        (value: EvaluationCriteria) => value?.rowKeyId
      );
      if (selected) {
        setSelectedRow([...selectedRow, ...changeRows]);
        selectedValues.push(...listKeys);
      } else {
        selectedValues = selectedValues.filter(
          (item) => !listKeys.includes(item as string)
        );
        setSelectedRow((prevState) =>
          prevState.filter((item) => !listKeys.includes(item?.rowKeyId))
        );
      }
      setSelectedRowKeys(selectedValues);
    },
  };

  return (
    <>
      <div className={styles["technical-capability-assessment-table"]}>
        <div className="d-flex justify-content-between align-items-center p-b--xs">
          {canEdit && (
            <div className="d-flex align-items-center gap-3">
              <Button
                icon={<img src={AddIcon} alt="img" width={14} height={14} />}
                iconPlace="left"
                type="secondary"
                onClick={addNewAssessmentRow}
              >
                {translate("PPA.add_criteria")}
              </Button>
              <UploadDownloadFinancialCriteria
                isSecondary={false}
                contextValue={contextValue}
                evaluationMethod={evaluationMethodType}
              />
            </div>
          )}
          {renderAssessmentMethod()}
        </div>
        <ActionBarComponent
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        >
          <Button
            type="secondary"
            size="sm"
            onClick={() => handleConfirmDelete(null)}
          >
            {translate("CM.txt_delete")}
          </Button>
        </ActionBarComponent>
        <StandardTable
          rowKey="rowKeyId"
          columns={columns}
          rowSelection={canEdit ? rowSelections : undefined}
          dataSource={evaluationCriterions}
          scroll={{ y: 300 }}
        />
      </div>
      <DeleteRecordModal
        title={translate("PL.txt_confirm_delete_evaluation_criteria_title")}
        content={translate("PL.txt_confirm_delete_evaluation_criteria_content")}
        handleConfirm={handleDeleteRow}
        handleCancel={handleCloseDeleteModal}
        open={modal === EModal.DELETE}
      />
    </>
  );
};

export default Assessment;
