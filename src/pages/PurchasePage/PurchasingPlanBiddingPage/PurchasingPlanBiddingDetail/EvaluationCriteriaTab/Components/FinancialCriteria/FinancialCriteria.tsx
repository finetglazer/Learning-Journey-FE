import React, { useCallback, useEffect, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputNumber,
  Select,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";
import { indexOf, isEmpty, isNil } from "lodash";
import { AddIcon, DeleteRoundIcon } from "assets/icons";
import { LIST_EVALUATION_METHOD } from "config/const";
import { of } from "rxjs";
import { utilService } from "core/services/common-services/util-service";
import { useTranslation } from "react-i18next";
import { EvaluationCriteria, TenderProfileType } from "models/PurchasingPlan";
import EmptyData from "../EmptyData/EmptyData";
import { Key, RowSelectionType } from "antd/lib/table/interface";
import useColumnScoreMethod from "../helper/useColumnScoreMethod";
import CommonFilter from "models/CommonFilter";
import { Model } from "react-3layer-common";
import { fieldService } from "core/services/page-services/field-service";
import { childText } from "models/PurchasingPlan/PurchasingPlanConstant";
import styles from "./FinancialCriteria.module.scss";
import classNames from "classnames";
import UploadDownloadFinancialCriteria from "./UploadDownloadFinancialCriteria/UploadDownloadFinancialCriteria";
import { useHistory } from "react-router";
import { PURCHASE_PLAN_ADJUST_BID_ROUTE } from "config/route-const";

type Props = {
  contextValue?: any;
  requiredInTable?: boolean;
  isDetail?: boolean;
};

const FinancialCriteria = (props: Props) => {
  const { contextValue, isDetail = false } = props;
  const { model, dispatchModel } = contextValue;
  const [translate] = useTranslation();
  const history = useHistory();
  const [idDelete, setIdDelete] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
  } = fieldService.useField(model, dispatchModel);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const getListType = () => {
    return of(LIST_EVALUATION_METHOD);
  };

  const isAdjustBid = history.location.pathname.includes(
    PURCHASE_PLAN_ADJUST_BID_ROUTE
  );

  const handleAddNewFinancialCriteria = useCallback(() => {
    const newEvaluationCriteria: EvaluationCriteria = {
      id: `${Date.now().toString()}${childText}`,
      tenderProfileType: TenderProfileType.FinancialProfile,
    };
    handleChangeSingleField({ fieldName: "evaluationFinancial" })([
      ...(model?.evaluationFinancial ?? []),
      newEvaluationCriteria,
    ]);
    setIsHeaderVisible(false);
  }, [handleChangeSingleField, model.evaluationFinancial]);

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleBulkDeleteRow = () => {
    const evaluationFinancial = model.evaluationFinancial.filter(
      (item: EvaluationCriteria) => !selectedRowKeys.includes(item.id)
    );

    const indexOfDeletedFiles = model?.evaluationFinancial
      .filter((item: EvaluationCriteria) => selectedRowKeys.includes(item.id))
      .map((item: EvaluationCriteria) =>
        indexOf(model.evaluationFinancial, item)
      );

    const errors = indexOfDeletedFiles.reduce(
      (acc: { [key: string]: string }, index: number) => {
        acc[
          `evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${index}].name`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${index}].technicalRequirement`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${index}].maximumPointScale`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${index}].minimumPointScale`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${index}].user`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${index}].user.name`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${index}].user.email`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${index}].note`
        ] = undefined;
        return acc;
      },
      {}
    );

    handleChangeAllField({
      ...model,
      evaluationFinancial: evaluationFinancial,
      errors: { ...model?.errors, ...errors },
    });

    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const evaluationFinancial = model.evaluationFinancial.filter(
      (item: EvaluationCriteria) => item.id !== idDelete
    );

    const indexOfDeletedFile = model?.evaluationFinancial?.findIndex(
      (item: EvaluationCriteria) => item.id === idDelete
    );

    handleChangeAllField({
      ...model,
      evaluationFinancial: evaluationFinancial,
      errors: {
        ...model?.errors,
        [`evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${indexOfDeletedFile}].name`]:
          undefined,
        [`evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${indexOfDeletedFile}].technicalRequirement`]:
          undefined,
        [`evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${indexOfDeletedFile}].maximumPointScale`]:
          undefined,
        [`evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${indexOfDeletedFile}].minimumPointScale`]:
          undefined,
        [`evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${indexOfDeletedFile}].user`]:
          undefined,
        [`evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${indexOfDeletedFile}].user.name`]:
          undefined,
        [`evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${indexOfDeletedFile}].user.email`]:
          undefined,
        [`evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias[${indexOfDeletedFile}].note`]:
          undefined,
      },
    });

    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

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

  const column = useColumnScoreMethod({
    model,
    handleChangeAllField,
    handleChangeSingleField,
    handleDeleteRowConfirm,
    requiredInTable: true,
    isScore: model?.evaluationMethodFinancial?.id === 0,
    fieldNameWrap: "evaluationFinancial",
    fieldTable: "evaluationCriteriaFinanceType",
    isDetail,
  });

  useEffect(() => {
    setIsHeaderVisible(isEmpty(model?.evaluationFinancial));
  }, [handleChangeSingleField, model?.evaluationFinancial]);

  useEffect(() => {
    if (isNil(model?.evaluationMethodFinancial)) {
      handleChangeSingleField({
        fieldName: "evaluationMethodFinancial",
      })(LIST_EVALUATION_METHOD[1]);
    }
  }, [handleChangeSingleField, model?.evaluationMethodFinancial]);

  return (
    <div>
      {isHeaderVisible && (
        <div className={styles["header-tech-criteria"]}>
          <div className={styles["select-box"]}>
            <div className={styles["select-evaluation-form"]}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "evaluationFinancial"
                )}
              >
                <Select
                  isSmall={false}
                  valueFilter={{
                    name: "",
                  }}
                  isRequired
                  classFilter={CommonFilter}
                  getList={getListType}
                  onChange={(value: number, T: Model) => {
                    handleChangeSelectField({
                      fieldName: "evaluationMethodFinancial",
                    })(value, T);
                  }}
                  searchType=""
                  isEnumerable={false}
                  placeHolder={translate("PL.plh_evaluation_method")}
                  value={model?.evaluationMethodFinancial}
                  label={translate("PL.txt_evaluation_method")}
                  disabled={isDetail || isAdjustBid}
                />
              </FormItem>
            </div>
            {model?.evaluationMethodFinancial?.id === 0 && (
              <div className={styles["score-rate"]}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "evaluationCriteriaSummary.evaluationCriteriaFinanceType.financialWeight"
                  )}
                >
                  <InputNumber
                    allowClear={false}
                    isSmall={false}
                    isRequired
                    label={translate("PL.txt_financial_weight")}
                    placeHolder={translate("PL.plh_score_rate")}
                    onChange={handleChangeSingleField({
                      fieldName: "evaluationPointRateFinancial",
                      errorName:
                        "evaluationCriteriaSummary.evaluationCriteriaFinanceType.financialWeight",
                    })}
                    max={100}
                    value={model?.evaluationPointRateFinancial}
                    suffix="%"
                    translate={translate}
                    disabled={isAdjustBid}
                  />
                </FormItem>
              </div>
            )}
          </div>
        </div>
      )}

      {isEmpty(model?.evaluationFinancial) ? (
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            "evaluationCriteriaSummary.evaluationCriteriaFinanceType.evaluationCriterias"
          )}
        >
          <EmptyData
            addNew={handleAddNewFinancialCriteria}
            isButtonDisabled={isDetail}
          />
        </FormItem>
      ) : (
        <div>
          <div className={styles["header-tech-criteria"]}>
            {!isDetail && (
              <div className="d-flex justify-content-between align-items-center gap-3">
                <Button
                  icon={<img src={AddIcon} alt="img" width={14} height={14} />}
                  iconPlace="left"
                  type="secondary"
                  onClick={handleAddNewFinancialCriteria}
                >
                  {translate("PL.txt_add_criteria")}
                </Button>
                <UploadDownloadFinancialCriteria
                  contextValue={contextValue}
                  evaluationMethod={model?.evaluationMethodFinancial?.id}
                />
              </div>
            )}

            {model?.evaluationMethodFinancial?.id === 0 ? (
              <div className={styles["title"]}>
                <div className={styles["evaluation-method"]}>
                  <span className={styles["label"]}>
                    {translate("PL.txt_evaluation_method_")}
                  </span>
                  <span className={styles["value"]}>
                    {translate("PL.txt_scoring")}
                  </span>
                  <span className={classNames(styles["label"], styles["ic"])}>
                    &nbsp;|&nbsp;
                  </span>
                  <span className={styles["label"]}>
                    {translate("PL.txt_financial_weight")}
                    <span className={styles["red"]}>*</span>
                  </span>
                </div>

                <div className={styles["score-rate"]}>
                  <FormItem
                    isTableCell
                    validateObject={utilService.getValidateObj(
                      model,
                      "evaluationCriteriaSummary.evaluationCriteriaFinanceType.financialWeight"
                    )}
                  >
                    <InputNumber
                      isTableCell
                      isRequired
                      allowClear={false}
                      placeHolder={translate("PL.plh_score_rate")}
                      value={model?.evaluationPointRateFinancial}
                      translate={translate}
                      className="input-number"
                      suffix="%"
                      max={100}
                      onChange={handleChangeSingleField({
                        fieldName: "evaluationPointRateFinancial",
                        errorName:
                          "evaluationCriteriaSummary.evaluationCriteriaFinanceType.financialWeight",
                      })}
                      disabled={isAdjustBid}
                    />
                  </FormItem>
                </div>
              </div>
            ) : (
              <div className={styles["evaluation-method"]}>
                <span className={styles["label"]}>
                  {translate("PL.txt_evaluation_method_")}
                </span>
                <span className={styles["value"]}>
                  {translate("PL.txt_pass_or_fail")}
                </span>
              </div>
            )}
          </div>
          <ActionBarComponent
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          >
            <Button type="secondary" size="sm" onClick={handleBulkDelete}>
              {translate("CL.delete_btn")}
            </Button>
          </ActionBarComponent>
          <StandardTable
            rowKey={"id"}
            columns={column}
            dataSource={model.evaluationFinancial}
            rowSelection={isDetail ? null : rowSelection}
            idContainer="table-id"
            rowClassName="payment-row"
            scroll={{ x: "max-content", y: "calc(100vh - 320px)" }}
            className="cost-allocation-row_selection"
          />
        </div>
      )}

      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PL.txt_confirm_delete_evaluation_criteria_title")}
        content={translate("PL.txt_confirm_delete_evaluation_criteria_content")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("CM.btn_confirm")}
        handleSave={() => {
          handleDeleteRow();
        }}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />
      <ModalConfirm
        open={openModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PL.txt_confirm_delete_evaluation_criteria_title")}
        content={translate("PL.txt_confirm_delete_evaluation_criteria_content")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("CM.btn_confirm")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default FinancialCriteria;
