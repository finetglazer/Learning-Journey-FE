import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { indexOf, isEmpty, isNumber } from "lodash";
import { AddIcon, DeleteRoundIcon, emptyCloudIcon } from "assets/icons";
import { LIST_EVALUATION_METHOD } from "config/const";
import { of } from "rxjs";
import { utilService } from "core/services/common-services/util-service";
import { useTranslation } from "react-i18next";
import {
  ColumnKey,
  EvaluationCriteria,
  EvaluationCriteriaGroup,
  EvaluationMethod,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import { Key, RowSelectionType } from "antd/lib/table/interface";
import { ColumnByEvaluationMethod } from "./EvaluationMethod/ColumnByEvaluationMethod";
import CommonFilter from "models/CommonFilter";
import { fieldService } from "core/services/page-services/field-service";
import { childText } from "models/PurchasingPlan/PurchasingPlanConstant";
import EmptyData from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/EvaluationCriteriaTab/Components/EmptyData/EmptyData";
import { TABLE_ROW_KEY } from "core/config/consts";

import "./EvaluationCriteriaList.scss";
import { useAppSelector } from "rtk/useRedux";
import { v4 as uuidv4 } from "uuid";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import UploadDownloadFinancialCriteria from "./UploadDownloadFinancialCriteria/UploadDownloadFinancialCriteria";

const EvaluationCriteriaList = ({
  contextValue,
  columnKey,
  columnKeyTechnicalWeight,
  columnKeyFinancialWeight,
  columnKeyEnumMethod,
  modelEvaluationCriteriaGroup,
  isDetail = false,
}: {
  contextValue: PurchasingPlanModel;
  columnKey: ColumnKey;
  columnKeyTechnicalWeight: ColumnKey | string;
  columnKeyFinancialWeight: ColumnKey | string;
  columnKeyEnumMethod: ColumnKey | string;
  modelEvaluationCriteriaGroup: EvaluationCriteriaGroup;
  isDetail: boolean;
}) => {
  const [translate] = useTranslation();
  const [idDelete, setIdDelete] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);

  const { model, dispatchModel } = contextValue;
  const profile = useAppSelector((state) => state.profile);

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

  const handleAddNewEvaluationCriteria = useCallback(() => {
    const newEvaluationCriteria: EvaluationCriteria = {
      id: `${Date.now().toString()}${childText}`,
      isDefault: false,
    };

    const creatorEvaluationCriteria = isEmpty(model?.[columnKey])
      ? {
          id: `${uuidv4()}${childText}`,
          isDefault: true,
          name: translate("PL.quotation_step_text"),
          user: profile?.account,
          minimumPointScale:
            model?.[columnKeyEnumMethod]?.id === EvaluationMethod.Scoring
              ? 0
              : undefined,
          maximumPointScale:
            model?.[columnKeyEnumMethod]?.id === EvaluationMethod.Scoring
              ? 100
              : undefined,
        }
      : null;

    const existingCriteria = model?.[columnKey] || [];

    const newArray = isEmpty(model?.[columnKey])
      ? [creatorEvaluationCriteria, newEvaluationCriteria]
      : [...existingCriteria, newEvaluationCriteria];

    handleChangeSingleField({ fieldName: columnKey })(newArray);
  }, [
    columnKey,
    columnKeyEnumMethod,
    handleChangeSingleField,
    model,
    profile?.account,
    translate,
  ]);

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleBulkDeleteRow = () => {
    const dataFollowColumnKey = model[columnKey].filter(
      (item: EvaluationCriteria) => !selectedRowKeys.includes(item.id)
    );
    const updatedErrors = { ...model?.errors };

    selectedRowKeys.forEach((id) => {
      const indexOfDeletedFile = model?.[columnKey]?.findIndex(
        (item: EvaluationCriteria) => item.id === id
      );
      updatedErrors[
        `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].name`
      ] = undefined;
      updatedErrors[
        `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].technicalRequirement`
      ] = undefined;
      updatedErrors[
        `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].maximumPointScale`
      ] = undefined;
      updatedErrors[
        `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].minimumPointScale`
      ] = undefined;
      updatedErrors[
        `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].user`
      ] = undefined;
      updatedErrors[
        `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].note`
      ] = undefined;
    });

    const deletedIndices = selectedRowKeys
      .map((id) =>
        model?.[columnKey]?.findIndex(
          (item: EvaluationCriteria) => item.id === id
        )
      )
      .sort((a, b) => a - b);

    Object.keys(model?.errors || {}).forEach((key) => {
      const match = key.match(
        new RegExp(
          `offerRequest\\.${columnKey}\\.evaluationCriterias\\[(\\d+)\\]\\.(.*)`
        )
      );
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];

        const shift = deletedIndices.filter(
          (delIndex) => delIndex < index
        ).length;

        if (shift > 0) {
          const newKey = `offerRequest.${columnKey}.evaluationCriterias[${
            index - shift
          }].${field}`;
          updatedErrors[newKey] = model.errors[key];
          updatedErrors[key] = undefined;
        }
      }
    });

    handleChangeAllField({
      ...model,
      [columnKey]: dataFollowColumnKey,
      errors: updatedErrors,
    });

    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const dataFollowColumnKey = model?.[columnKey].filter(
      (item: EvaluationCriteria) => item.id !== idDelete
    );

    const indexOfDeletedFile = model?.[columnKey]?.findIndex(
      (item: EvaluationCriteria) => item.id === idDelete
    );
    const updatedErrors = { ...model?.errors };

    updatedErrors[
      `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].name`
    ] = undefined;
    updatedErrors[
      `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].technicalRequirement`
    ] = undefined;
    updatedErrors[
      `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].maximumPointScale`
    ] = undefined;
    updatedErrors[
      `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].minimumPointScale`
    ] = undefined;
    updatedErrors[
      `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].user`
    ] = undefined;
    updatedErrors[
      `offerRequest.${columnKey}.evaluationCriterias[${indexOfDeletedFile}].note`
    ] = undefined;

    Object.keys(model?.errors || {}).forEach((key) => {
      const match = key.match(
        new RegExp(
          `offerRequest\\.${columnKey}\\.evaluationCriterias\\[(\\d+)\\]\\.(.*)`
        )
      );
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        if (index > indexOfDeletedFile) {
          // Create new key with reduced index
          const newKey = `offerRequest.${columnKey}.evaluationCriterias[${
            index - 1
          }].${field}`;
          updatedErrors[newKey] = model.errors[key];
          updatedErrors[key] = undefined;
        }
      }
    });

    handleChangeAllField({
      ...model,
      [columnKey]: dataFollowColumnKey,
      errors: updatedErrors,
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

  useEffect(() => {
    if (isEmpty(model?.[columnKeyEnumMethod])) {
      handleChangeSingleField({
        fieldName: columnKeyEnumMethod,
      })(LIST_EVALUATION_METHOD[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.[columnKeyEnumMethod]]);

  useEffect(() => {
    if (model?.[columnKey]?.length === 0) {
      const updatedErrors = { ...model?.errors };

      updatedErrors[`offerRequest.${columnKeyTechnicalWeight}`] = undefined;
      updatedErrors[`offerRequest.${columnKeyFinancialWeight}`] = undefined;

      handleChangeAllField({
        ...model,
        [columnKeyFinancialWeight]: null,
        [columnKeyTechnicalWeight]: null,
        errors: updatedErrors,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.[columnKey]]);

  useEffect(() => {
    const { technicalWeight, financialWeight, evaluationMethod } =
      modelEvaluationCriteriaGroup || {};

    if (technicalWeight) {
      handleChangeSingleField({ fieldName: columnKeyTechnicalWeight })(
        technicalWeight
      );
    }

    if (financialWeight) {
      handleChangeSingleField({ fieldName: columnKeyFinancialWeight })(
        financialWeight
      );
    }

    if (isNumber(evaluationMethod)) {
      const methodItem =
        LIST_EVALUATION_METHOD.find((item) => item.id === evaluationMethod) ||
        LIST_EVALUATION_METHOD[1];
      handleChangeSingleField({ fieldName: columnKeyEnumMethod })(methodItem);
    }
  }, [
    columnKeyEnumMethod,
    columnKeyFinancialWeight,
    columnKeyTechnicalWeight,
    handleChangeSingleField,
    modelEvaluationCriteriaGroup,
  ]);

  return (
    <div className="evaluation_criteria_list">
      <div className="header-tech-criteria align-items-end">
        <div className="select-box">
          {isDetail && (
            <div className="evaluation-method">
              <span className="label">
                {translate("PL.txt_evaluation_method_")}
              </span>
              {model?.[columnKeyEnumMethod]?.id ===
                EvaluationMethod.Scoring && (
                <span>
                  <span className="value">{translate("PL.txt_scoring")}</span>
                  <span className="label ic p-x--sm">|</span>

                  <span className="label">
                    {translate("PL.technical_weight")}:&nbsp;
                  </span>
                  <span className="value p-r--sm">
                    {model?.[columnKeyTechnicalWeight]}%
                  </span>

                  <span className="label p-l--sm">
                    {translate("PL.quotation_weight")}:&nbsp;
                  </span>
                  <span className="value">
                    {model?.[columnKeyFinancialWeight]}%
                  </span>
                </span>
              )}
              {model?.[columnKeyEnumMethod]?.id ===
                EvaluationMethod.PassFail && (
                <span>
                  <span className="value">
                    {translate("PL.txt_pass_or_fail")}
                  </span>
                </span>
              )}
            </div>
          )}
          {!isDetail && isEmpty(model?.[columnKey]) && (
            <div className="select-evaluation-form">
              <FormItem
                validateObject={utilService.getValidateObj(model, columnKey)}
              >
                <Select
                  isSmall={true}
                  isRequired
                  classFilter={CommonFilter}
                  getList={getListType}
                  onChange={handleChangeSelectField({
                    fieldName: columnKeyEnumMethod,
                  })}
                  isEnumerable={false}
                  placeHolder={translate("PL.plh_evaluation_method")}
                  value={model?.[columnKeyEnumMethod]}
                  label={translate("PL.txt_evaluation_method")}
                />
              </FormItem>
            </div>
          )}
          {!isDetail && isEmpty(model?.[columnKey]) && (
            <UploadDownloadFinancialCriteria
              isSecondary={true}
              contextValue={contextValue}
              evaluationMethod={model?.[columnKeyEnumMethod]?.id}
            />
          )}
        </div>
      </div>

      {isEmpty(model?.[columnKey]) && (
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            `offerRequest.${columnKey}.evaluationCriterias`
          )}
        >
          {isDetail ? (
            <EmptyItemTable
              icon={<img src={emptyCloudIcon} alt="" />}
              content={translate("CM.empty.no_data_recorded")}
            />
          ) : (
            <EmptyData
              addNew={handleAddNewEvaluationCriteria}
              isButtonDisabled={isDetail}
            />
          )}
        </FormItem>
      )}

      {!isEmpty(model?.[columnKey]) && (
        <div>
          <div className="header-tech-criteria align-items-end">
            {!isDetail && (
              <div className="d-flex justify-content-between gap-12 align-items-center">
                <Button
                  icon={<img src={AddIcon} alt="img" width={14} height={14} />}
                  iconPlace="left"
                  type="secondary"
                  onClick={handleAddNewEvaluationCriteria}
                >
                  {translate("PL.txt_add_criteria")}
                </Button>
                <UploadDownloadFinancialCriteria
                  isSecondary={false}
                  contextValue={contextValue}
                  evaluationMethod={model?.[columnKeyEnumMethod]?.id}
                />
              </div>
            )}
            {!isDetail &&
              model?.[columnKeyEnumMethod]?.id ===
                EvaluationMethod.PassFail && (
                <span className="evaluation-method">
                  <span className="label">
                    {translate("PL.txt_evaluation_method_")}
                  </span>
                  <span className="value">
                    {translate("PL.txt_pass_or_fail")}
                  </span>
                </span>
              )}
            {!isDetail &&
              !isEmpty(model?.[columnKey]) &&
              model?.[columnKeyEnumMethod]?.id === EvaluationMethod.Scoring && (
                <div className="d-flex gap-1">
                  <div className="evaluation-method d-flex justify-content-end align-items-center gap-12 text-nowrap p-b--3xs">
                    <span className="label">
                      {translate("PL.txt_evaluation_method_")}
                      <span className="value">
                        {translate("PL.txt_scoring")}
                      </span>
                      <span className="label ic"> | </span>
                    </span>
                  </div>
                  <div className="evaluation-method d-flex align-items-center">
                    <span className="label text-nowrap">
                      {translate("PL.technical_weight")}
                      <span className="require"> * </span>
                    </span>
                    <div className="p-l--3xs">
                      <FormItem
                        validateObject={utilService.getValidateObj(
                          model,
                          `offerRequest.${columnKeyTechnicalWeight}`
                        )}
                      >
                        <InputNumber
                          className="w-150"
                          allowClear={false}
                          isSmall={false}
                          isRequired
                          placeHolder={translate(
                            "PL.technical_weight_placeholder"
                          )}
                          onChange={handleChangeSingleField({
                            fieldName: columnKeyTechnicalWeight,
                            errorName: `offerRequest.${columnKeyTechnicalWeight}`,
                          })}
                          min={0}
                          max={100}
                          value={model?.[columnKeyTechnicalWeight]}
                          suffix="%"
                          translate={translate}
                        />
                      </FormItem>
                    </div>
                  </div>

                  <div className="evaluation-method d-flex align-items-center">
                    <div className="">
                      <span className="label text-nowrap">
                        {translate("PL.quotation_weight")}
                        <span className="require"> * </span>
                      </span>
                    </div>
                    <div className="p-l--3xs">
                      <FormItem
                        validateObject={utilService.getValidateObj(
                          model,
                          `offerRequest.${columnKeyFinancialWeight}`
                        )}
                      >
                        <InputNumber
                          className="w-150"
                          allowClear={false}
                          isSmall={false}
                          isRequired
                          placeHolder={translate(
                            "PL.quotation_weight_placeholder"
                          )}
                          onChange={handleChangeSingleField({
                            fieldName: columnKeyFinancialWeight,
                            errorName: `offerRequest.${columnKeyFinancialWeight}`,
                          })}
                          min={0}
                          max={100}
                          value={model?.[columnKeyFinancialWeight]}
                          suffix="%"
                          translate={translate}
                        />
                      </FormItem>
                    </div>
                  </div>
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
            rowKey={TABLE_ROW_KEY}
            columns={ColumnByEvaluationMethod({
              translate,
              model,
              handleChangeSingleField,
              handleDeleteRowConfirm,
              isScoring:
                model?.[columnKeyEnumMethod]?.id === EvaluationMethod.Scoring,
              columnKey,
              isDetail,
            })}
            dataSource={model[columnKey]}
            rowSelection={isDetail ? null : rowSelection}
            scroll={{ y: "calc(100vh - 470px)" }}
            rowClassName="payment-custom_row_table"
            className="payment-row_selection"
            isDragable={true}
          />
        </div>
      )}
      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PL.txt_confirm_delete_evaluation_criteria_title")}
        content={translate("PL.txt_confirm_delete_evaluation_criteria_content")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
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
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default EvaluationCriteriaList;
