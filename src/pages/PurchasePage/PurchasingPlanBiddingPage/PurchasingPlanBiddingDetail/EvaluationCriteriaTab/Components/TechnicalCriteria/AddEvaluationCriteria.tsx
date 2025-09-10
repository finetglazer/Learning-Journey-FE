import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Key, RowSelectionType } from "antd/lib/table/interface";
import { EvaluationCriteria, TenderProfileType } from "models/PurchasingPlan";
import { indexOf, isEmpty } from "lodash";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputNumber,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";
import { AddIcon, DeleteRoundIcon } from "assets/icons";
import EmptyData from "../EmptyData/EmptyData";
import { utilService } from "core/services/common-services/util-service";
import { fieldService } from "core/services/page-services/field-service";
import { Col, Row } from "antd";
import classNames from "classnames";
import { childText } from "models/PurchasingPlan/PurchasingPlanConstant";
import useColumnScoreMethod from "../helper/useColumnScoreMethod";
import styles from "./TechnicalCriteria.module.scss";
import { useHistory } from "react-router";
import { PURCHASE_PLAN_ADJUST_BID_ROUTE } from "config/route-const";

type Props = {
  contextValue?: any;
  requiredInTable?: boolean;
  fieldName?: string;
  isScore?: boolean;
  fieldTable?: string;
  isDetail?: boolean;
};

const AddEvaluationCriteria = ({
  contextValue,
  requiredInTable = false,
  fieldName = "evaluationScore",
  isScore = false,
  fieldTable,
  isDetail = false,
}: Props) => {
  const { model, dispatchModel } = contextValue;
  const [translate] = useTranslation();
  const history = useHistory();
  const [idDelete, setIdDelete] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);

  const { handleChangeSingleField, handleChangeAllField } =
    fieldService.useField(model, dispatchModel);

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const isAdjustBid = history.location.pathname.includes(
    PURCHASE_PLAN_ADJUST_BID_ROUTE
  );
  const isInputNumberValid =
    !isAdjustBid && isScore && !model?.[`${fieldName}technicalWeight`];

  const handleAddNewScore = () => {
    const newEvaluationCriteria: EvaluationCriteria = {
      id: `${Date.now().toString()}${childText}`,
      tenderProfileType: TenderProfileType.TechnicalProfile,
    };

    handleChangeSingleField({ fieldName: fieldName })([
      ...(model?.[fieldName] ?? []),
      newEvaluationCriteria,
    ]);
  };

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleBulkDeleteRow = () => {
    const result = model?.[fieldName]?.filter(
      (item: EvaluationCriteria) => !selectedRowKeys.includes(item?.id)
    );

    const indexOfDeletedFiles = model?.[fieldName]
      .filter((item: EvaluationCriteria) => selectedRowKeys.includes(item?.id))
      .map((item: EvaluationCriteria) => indexOf(model?.[fieldName], item));

    const errors = indexOfDeletedFiles.reduce(
      (acc: { [key: string]: string }, index: number) => {
        acc[
          `evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${index}].name`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${index}].technicalRequirement`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${index}].maximumPointScale`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${index}].minimumPointScale`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${index}].user`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${index}].user.name`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${index}].user.email`
        ] = undefined;
        acc[
          `evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${index}].note`
        ] = undefined;
        return acc;
      },
      {}
    );

    handleChangeAllField({
      ...model,
      [fieldName]: result,
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
    const modelFieldName = model?.[fieldName]?.filter(
      (item: EvaluationCriteria) => item?.id !== idDelete
    );

    const indexOfDeletedFile = model?.[fieldName]?.findIndex(
      (item: EvaluationCriteria) => item?.id === idDelete
    );

    handleChangeAllField({
      ...model,
      [fieldName]: modelFieldName,
      errors: {
        ...model?.errors,
        [`evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${indexOfDeletedFile}].name`]:
          undefined,
        [`evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${indexOfDeletedFile}].description`]:
          undefined,
        [`evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${indexOfDeletedFile}].maximumPointScale`]:
          undefined,
        [`evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${indexOfDeletedFile}].minimumPointScale`]:
          undefined,
        [`evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${indexOfDeletedFile}].user.name`]:
          undefined,
        [`evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${indexOfDeletedFile}].user.email`]:
          undefined,
        [`evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${indexOfDeletedFile}].note`]:
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

  const columns = useColumnScoreMethod({
    model,
    handleChangeAllField,
    handleChangeSingleField,
    handleDeleteRowConfirm,
    requiredInTable: true,
    isScore,
    fieldNameWrap: fieldName,
    fieldTable,
    isDetail,
  });

  return (
    <div>
      <div className={styles["evaluation-method"]}>
        <div className={styles["title"]}>
          <Row
            justify={!isEmpty(model?.[fieldName]) ? "space-between" : "start"}
            align="middle"
            className={classNames(
              !isDetail && !isEmpty(model?.[fieldName]) && styles["title-score"]
            )}
          >
            {!isDetail && isScore && !isEmpty(model?.[fieldName]) && (
              <Button
                icon={<img src={AddIcon} alt="img" width={14} height={14} />}
                iconPlace="left"
                type="secondary"
                className=""
                onClick={handleAddNewScore}
              >
                {translate("PL.txt_add_criteria")}
              </Button>
            )}

            {isScore && (
              <Col className={classNames("p-2", styles["evaluation-method"])}>
                <span className={styles["label"]}>
                  {translate("PL.txt_evaluation_method_")}
                </span>
                <span className={styles["value"]}>
                  {translate("PL.txt_scoring")}
                </span>
                <span className={classNames(styles["label"], styles["ic"])}>
                  &nbsp; |&nbsp;
                </span>
                <span className={styles["label"]}>
                  {translate("PL.txt_technical_weight")}&nbsp;
                  <span className={styles["red"]}>*</span>
                </span>
              </Col>
            )}

            {isDetail && !isScore && model?.[`${fieldName}`]?.length && (
              <Col>
                <span className={styles["label"]}>
                  {translate("PL.txt_evaluation_method_")}
                </span>
                <span className={styles["value"]}>
                  {translate("PL.txt_pass_or_fail")}
                </span>
              </Col>
            )}

            {!isScore && !model?.[`${fieldName}`]?.length && (
              <Col className={classNames("p-2", styles["evaluation-method"])}>
                <span className={styles["label"]}>
                  {translate("PL.txt_evaluation_method_")}
                </span>
                <span className={styles["value"]}>
                  {translate("PL.txt_pass_or_fail")}
                </span>
              </Col>
            )}
          </Row>

          {isScore && (
            <div className={styles["score-rate"]}>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `evaluationCriteriaSummary.${fieldTable}.technicalWeight`
                )}
              >
                <InputNumber
                  isRequired
                  isTableCell
                  allowClear={false}
                  placeHolder={translate("PL.plh_score_rate")}
                  onChange={handleChangeSingleField({
                    fieldName: `${fieldName}technicalWeight`,
                    errorName: `evaluationCriteriaSummary.${fieldTable}.technicalWeight`,
                  })}
                  max={100}
                  value={model?.[`${fieldName}technicalWeight`]}
                  translate={translate}
                  suffix="%"
                  className={styles["input-number"]}
                  disabled={isAdjustBid}
                />
              </FormItem>
            </div>
          )}
        </div>

        {isEmpty(model?.[fieldName]) ? (
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              `evaluationCriteriaSummary.${fieldTable}.evaluationCriterias`
            )}
          >
            <EmptyData addNew={handleAddNewScore} isButtonDisabled={isDetail} />
          </FormItem>
        ) : (
          <div>
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
              columns={columns}
              dataSource={model?.[fieldName]}
              rowSelection={isDetail ? null : rowSelection}
              idContainer="table-id"
              rowClassName="payment-row"
              scroll={{ x: "max-content", y: "calc(100vh - 320px)" }}
              className="cost-allocation-row_selection"
            />
          </div>
        )}
      </div>

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

export default AddEvaluationCriteria;
