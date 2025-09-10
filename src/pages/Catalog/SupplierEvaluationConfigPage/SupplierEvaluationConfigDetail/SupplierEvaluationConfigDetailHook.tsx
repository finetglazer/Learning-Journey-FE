/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import _, { isArray, isEqual } from "lodash";
import { SupplierEvaluationConfig } from "models/SupplierEvaluationConfig";
import React, { createContext, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { supplierEvaluationConfigRepository } from "../SupplierEvaluationConfigRepository";
import { useHistory } from "react-router";
import { SUPPLIER_EVALUATION_CONFIG_MASTER_ROUTE } from "config/route-const";
import {
  ConfigField,
  KeyType as ServiceKeyType,
} from "core/services/service-types";
import { Model } from "react-3layer-common";
import { Dayjs } from "dayjs";
import { EvaluationItem } from "models/EvaluationItem";
import { EvaluationResult } from "models/EvaluationResult";
import { ColumnProps } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import { LayoutCell, OneLineText } from "react-components-design-system";
import { formatNumber } from "core/helpers/number";
import { listService } from "core/services/page-services/list-service";

import { v4 as uuidv4 } from "uuid";
import { TrashCan } from "@carbon/icons-react";
import { IcPencilSvg } from "assets/icons";

export interface SupplierEvaluationConfigDetailContextModel {
  //for detail model
  model: SupplierEvaluationConfig;
  isDetail: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeAllField: (data: SupplierEvaluationConfig) => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeBoolField: (config: ConfigField) => (value: boolean) => void;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeDateField: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeTreeField: (
    config: ConfigField
  ) => (values: Model[], isMultiple: boolean) => void;
  handleSave: () => void;
  //for content
  evaluationItems?: EvaluationItem[];
  evaluationResults?: EvaluationResult[];
  evaluationItemColumns: ColumnProps<EvaluationItem>[];
  evaluationResultColumns: ColumnProps<EvaluationResult>[];
  evaluationItemRowSelection: TableRowSelection<EvaluationItem>;
  selectedEvaluationItemRowKeys: ServiceKeyType[];
  setSelectedEvaluationItemRowKeys: React.Dispatch<
    React.SetStateAction<ServiceKeyType[]>
  >;
  evaluationResultRowSelection: TableRowSelection<EvaluationResult>;
  selectedEvaluationResultRowKeys: ServiceKeyType[];
  setSelectedEvaluationResultRowKeys: React.Dispatch<
    React.SetStateAction<ServiceKeyType[]>
  >;
  handleDeleteContent: (type: "Item" | "Result", index: number) => void;
  handleBulkDeleteContent: (type: "Item" | "Result", ids: number[]) => void;
  handleAddNewContent: (type: "Item" | "Result") => void;
  handleChangeContent: (
    value: EvaluationItem | EvaluationResult,
    type: "Item" | "Result",
    index: number
  ) => void;
  //for contentDetailModal
  isOpenItemContent: boolean;
  isOpenResultContent: boolean;
  loadingContent: boolean;
  maxWeight: number;
  handleCloseDetailContent: (type: "Item" | "Result") => void;
  targetItem: EvaluationItem;
  targetResult: EvaluationResult;
  handleChangeSimpleFieldContent: (
    type: "Item" | "Result",
    field: keyof EvaluationItem | keyof EvaluationResult
  ) => (value: string | number) => void;
  handleSaveContentModal: (type: "Item" | "Result") => void;
}
export const SupplierEvaluationConfigDetailContext =
  createContext<SupplierEvaluationConfigDetailContextModel>({
    model: null,
    isDetail: null,
    loading: null,
    setLoading: null,
    handleChangeAllField: null,
    handleChangeSingleField: null,
    handleChangeBoolField: null,
    handleChangeSelectField: null,
    handleChangeDateField: null,
    handleChangeTreeField: null,
    handleSave: null,
    evaluationItems: null,
    evaluationResults: null,
    evaluationItemColumns: null,
    evaluationResultColumns: null,
    evaluationItemRowSelection: null,
    selectedEvaluationItemRowKeys: null,
    setSelectedEvaluationItemRowKeys: null,
    evaluationResultRowSelection: null,
    selectedEvaluationResultRowKeys: null,
    setSelectedEvaluationResultRowKeys: null,
    handleDeleteContent: null,
    handleBulkDeleteContent: null,
    handleAddNewContent: null,
    handleChangeContent: null,
    //for contentDetailModal
    isOpenItemContent: null,
    isOpenResultContent: null,
    loadingContent: null,
    maxWeight: null,

    handleCloseDetailContent: null,
    targetItem: null,
    targetResult: null,
    handleChangeSimpleFieldContent: null,
    handleSaveContentModal: null,
  });

export function useSupplierEvaluationConfigDetailHook() {
  const { model, dispatch: dispatchModel } =
    detailService.useModel<SupplierEvaluationConfig>(SupplierEvaluationConfig);

  const history = useHistory();

  const { isDetail } = detailService.useGetIsDetail(
    supplierEvaluationConfigRepository.detail,
    dispatchModel
  );

  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
  } = fieldService.useField(model, dispatchModel);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();

  const handleGoMaster = React.useCallback(() => {
    history.push(SUPPLIER_EVALUATION_CONFIG_MASTER_ROUTE);
  }, [history]);

  const handleSave = React.useCallback(() => {
    setLoading(true);

    const newModel = { ...model };

    supplierEvaluationConfigRepository
      .saveSupplierEvaluationConfig(newModel)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (response: any) => {
          if (isEqual(response?.status, 200)) {
            notifyToast({
              message: translate("CM.updateSuccess"),
            });
            handleGoMaster();
          }
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
              supplierEvaluationConfigContents:
                newModel?.supplierEvaluationConfigContents,
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  }, [handleChangeAllField, handleGoMaster, model, notifyToast, translate]);

  //for content
  const evaluationItems = useMemo(() => {
    return isArray(model?.evaluationItems) ? model?.evaluationItems : [];
  }, [model?.evaluationItems]);

  const evaluationResults = useMemo(() => {
    return isArray(model?.evaluationResults) ? model?.evaluationResults : [];
  }, [model?.evaluationResults]);

  const {
    rowSelection: evaluationItemRowSelection,
    selectedRowKeys: selectedEvaluationItemRowKeys,
    setSelectedRowKeys: setSelectedEvaluationItemRowKeys,
  } = listService.useRowSelection<EvaluationItem>("checkbox", [], true);

  const {
    rowSelection: evaluationResultRowSelection,
    selectedRowKeys: selectedEvaluationResultRowKeys,
    setSelectedRowKeys: setSelectedEvaluationResultRowKeys,
  } = listService.useRowSelection<EvaluationResult>("checkbox", [], true);

  const handleDeleteContent = useCallback(
    (type: "Item" | "Result", index: number) => {
      const newContents = type === "Item" ? evaluationItems : evaluationResults;
      newContents.splice(index, 1);
      const newModel = _.cloneDeep(model);
      if (type === "Item") {
        handleChangeAllField({ ...newModel, evaluationItems: newContents });
      } else
        handleChangeAllField({ ...newModel, evaluationResults: newContents });
    },
    [evaluationItems, evaluationResults, handleChangeAllField, model]
  );

  const handleBulkDeleteContent = useCallback(
    (type: "Item" | "Result", ids: ServiceKeyType[]) => {
      const currentContents =
        type === "Item" ? evaluationItems : evaluationResults;
      const newContents = currentContents?.filter((content) => {
        return !ids?.includes(content?.id);
      });

      const newModel = _.cloneDeep(model);
      if (type === "Item") {
        handleChangeAllField({ ...newModel, evaluationItems: newContents });
        setSelectedEvaluationItemRowKeys([]);
      } else {
        handleChangeAllField({ ...newModel, evaluationResults: newContents });
        setSelectedEvaluationResultRowKeys([]);
      }
      setSelectedEvaluationItemRowKeys([]);
    },
    [
      evaluationItems,
      evaluationResults,
      handleChangeAllField,
      model,
      setSelectedEvaluationItemRowKeys,
      setSelectedEvaluationResultRowKeys,
    ]
  );

  const handleChangeContent = useCallback(
    (
      value: EvaluationItem | EvaluationResult,
      type: "Item" | "Result",
      index: number
    ) => {
      const newContents = type === "Item" ? evaluationItems : evaluationResults;
      newContents[index] = value;
      const newModel = _.cloneDeep(model);
      if (type === "Item") {
        handleChangeAllField({ ...newModel, evaluationItems: newContents });
      } else
        handleChangeAllField({ ...newModel, evaluationResults: newContents });
    },
    [evaluationItems, evaluationResults, handleChangeAllField, model]
  );

  //for content modal
  const [isOpenItemContent, setIsOpenItemContent] = useState<boolean>(false);
  const [isOpenResultContent, setIsOpenResultContent] =
    useState<boolean>(false);

  const [loadingContent, setLoadingContent] = useState<boolean>(false);

  const [targetItem, setTargetItem] = useState<EvaluationItem>(
    new EvaluationItem()
  );
  const [targetResult, setTargetResult] = useState<EvaluationResult>(
    new EvaluationResult()
  );

  const [targetIndex, setTargetIndex] = useState<number>(null);

  const [maxWeight, setMaxWeight] = useState<number>(null);

  const handleOpenDetailContent = useCallback(
    (
      value: EvaluationItem | EvaluationResult | undefined,
      type: "Item" | "Result",
      index: number
    ) => {
      setTargetIndex(index);
      if (type === "Item") {
        setTargetItem({ ...value, errors: undefined });
        setIsOpenItemContent(true);
        let max = 100;
        evaluationItems.forEach((item) => {
          if (item?.id !== value?.id) {
            max -= item?.weight;
          }
        });
        setMaxWeight(max);
      } else {
        setTargetResult({ ...value, errors: undefined });
        setIsOpenResultContent(true);
      }
    },
    [evaluationItems]
  );

  const handleAddNewContent = useCallback(
    (type: "Item" | "Result") => {
      const newContent =
        type === "Item"
          ? { ...new EvaluationItem() }
          : { ...new EvaluationResult() };

      if (type === "Item") {
        setTargetItem(newContent);
        let max = 100;
        evaluationItems.forEach((item) => {
          max -= item?.weight;
        });

        setMaxWeight(max);
        setIsOpenItemContent(true);
      } else {
        setTargetItem(newContent);
        setIsOpenResultContent(true);
      }
    },
    [evaluationItems]
  );

  const handleCloseDetailContent = useCallback((type: "Item" | "Result") => {
    setTargetIndex(null);
    setTargetItem({ ...new EvaluationItem() });
    setTargetResult({ ...new EvaluationResult() });
    if (type === "Item") {
      setIsOpenItemContent(false);
    } else {
      setIsOpenResultContent(false);
    }
  }, []);

  const handleChangeSimpleFieldContent = useCallback(
    (
        type: "Item" | "Result",
        field: keyof EvaluationItem | keyof EvaluationResult
      ) =>
      (value: string | number) => {
        if (type === "Item") {
          const newContent = _.cloneDeep(targetItem);
          newContent[`${field}`] = value;
          setTargetItem(newContent);
        } else {
          const newContent = _.cloneDeep(targetResult);
          newContent[`${field}`] = value;
          setTargetResult(newContent);
        }
      },
    [targetItem, targetResult]
  );

  const validatedItem = (
    evaluationItem: EvaluationItem,
    listItem: EvaluationItem[]
  ) => {
    const newItem = _.cloneDeep(evaluationItem);
    const checkDuplicate = listItem
      ?.filter((content) => content?.id !== newItem?.id)
      .map((item) => item?.code)
      .includes(newItem?.code);
    newItem.errors = {
      code: !newItem?.code
        ? translate("supplierEvaluationConfigs.errorEvaluationItem.codeEmpty")
        : newItem?.code?.length > 255
        ? translate("supplierEvaluationConfigs.errorEvaluationItem.codeTooLong")
        : checkDuplicate
        ? translate(
            "supplierEvaluationConfigs.errorEvaluationItem.codeDuplicate"
          )
        : undefined,
      name: !newItem?.name
        ? translate("supplierEvaluationConfigs.errorEvaluationItem.nameEmpty")
        : newItem?.name?.length > 255
        ? translate("supplierEvaluationConfigs.errorEvaluationItem.nameTooLong")
        : undefined,
      weight:
        !newItem?.weight && newItem?.weight !== 0
          ? translate(
              "supplierEvaluationConfigs.errorEvaluationItem.weightEmpty"
            )
          : undefined,
      standard: !newItem?.standard
        ? translate(
            "supplierEvaluationConfigs.errorEvaluationItem.standardEmpty"
          )
        : newItem?.standard?.length > 255
        ? translate(
            "supplierEvaluationConfigs.errorEvaluationItem.standardTooLong"
          )
        : undefined,
    };
    return {
      validatedEvaluationItem: newItem,
      canUpdateItem:
        !newItem?.errors?.code &&
        !newItem?.errors?.name &&
        !newItem?.errors?.weight &&
        !newItem?.errors?.standard,
    };
  };

  const validatedResult = (
    evaluationResult: EvaluationResult,
    listResult: EvaluationResult[]
  ) => {
    const newResult = _.cloneDeep(evaluationResult);
    const listCheck = listResult?.filter(
      (content) => content?.id !== newResult?.id
    );
    let checkRangeFrom = false;
    let checkRangeTo = false;
    const checkFromTo = newResult?.fromScore < newResult?.toScore;
    if (listCheck?.length > 0 && checkFromTo) {
      const errorRangefrom = listCheck?.filter((item) => {
        return (
          newResult?.fromScore > item?.fromScore &&
          newResult?.fromScore < item?.toScore
        );
      });

      const errorRangeTo = listCheck?.filter((item) => {
        return (
          newResult?.toScore > item?.fromScore &&
          newResult?.toScore < item?.toScore
        );
      });
      if (errorRangefrom && errorRangefrom?.length > 0) {
        checkRangeFrom = true;
      }
      if (errorRangeTo && errorRangeTo?.length > 0) {
        checkRangeTo = true;
      }
    }
    newResult.errors = {
      fromScore:
        !newResult?.fromScore && newResult?.fromScore !== 0
          ? translate(
              "supplierEvaluationConfigs.errorEvaluationResult.fromScoreEmpty"
            )
          : !checkFromTo
          ? translate(
              "supplierEvaluationConfigs.errorEvaluationResult.invalidFromTo"
            )
          : checkRangeFrom
          ? translate(
              "supplierEvaluationConfigs.errorEvaluationResult.fromScoreInvalidRange"
            )
          : undefined,
      toScore:
        !newResult?.toScore && newResult?.toScore !== 0
          ? translate(
              "supplierEvaluationConfigs.errorEvaluationResult.fromScoreEmpty"
            )
          : checkRangeTo
          ? translate(
              "supplierEvaluationConfigs.errorEvaluationResult.fromScoreInvalidRange"
            )
          : undefined,
      conclude: !newResult?.conclude
        ? translate(
            "supplierEvaluationConfigs.errorEvaluationResult.concludeEmpty"
          )
        : newResult?.conclude?.length > 500
        ? translate(
            "supplierEvaluationConfigs.errorEvaluationResult.concludeTooLong"
          )
        : undefined,
    };

    return {
      validatedEvaluationResult: newResult,
      canUpdateResult:
        !newResult?.errors?.fromScore &&
        !newResult?.errors?.toScore &&
        !newResult?.errors?.conclude,
    };
  };

  const handleSaveContentModal = useCallback(
    (type: "Item" | "Result") => {
      setLoadingContent(true);
      const { validatedEvaluationItem, canUpdateItem } = validatedItem(
        targetItem,
        evaluationItems
      );

      const { validatedEvaluationResult, canUpdateResult } = validatedResult(
        targetResult,
        evaluationResults
      );

      if (canUpdateItem || canUpdateResult) {
        if (targetIndex !== null && targetIndex !== undefined) {
          handleChangeContent(
            type === "Item" ? targetItem : targetResult,
            type,
            targetIndex
          );
          setIsOpenItemContent(false);
          setIsOpenResultContent(false);
          setLoadingContent(false);
          setTargetItem(new EvaluationItem());
          setTargetResult(new EvaluationResult());
        } else {
          const newContents =
            type === "Item"
              ? _.cloneDeep(evaluationItems)
              : _.cloneDeep(evaluationResults);
          const newContent =
            type === "Item"
              ? {
                  ...targetItem,
                  id: uuidv4(),
                  code: targetItem?.code?.toUpperCase(),
                }
              : { ...targetResult, id: uuidv4() };
          newContents.push(newContent);
          const newModel = _.cloneDeep(model);
          if (type === "Item") {
            handleChangeAllField({ ...newModel, evaluationItems: newContents });
          } else {
            handleChangeAllField({
              ...newModel,
              evaluationResults: newContents,
            });
          }
          setIsOpenItemContent(false);
          setIsOpenResultContent(false);
          setLoadingContent(false);
          setTargetItem(new EvaluationItem());
          setTargetResult(new EvaluationResult());
        }
      } else {
        if (!canUpdateItem) {
          setTargetItem(validatedEvaluationItem);
        }
        if (!canUpdateResult) {
          setTargetResult(validatedEvaluationResult);
        }
        setLoadingContent(false);
      }
    },
    [
      evaluationItems,
      evaluationResults,
      handleChangeAllField,
      handleChangeContent,
      model,
      targetIndex,
      targetItem,
      targetResult,
      validatedItem,
      validatedResult,
    ]
  );

  const evaluationItemColumns: ColumnProps<EvaluationItem>[] = useMemo(
    () => [
      {
        title: translate("supplierEvaluationConfigs.evaluationItems.code"),
        key: "code",
        dataIndex: "code",

        width: 200,
        render(...params: [string, EvaluationItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierEvaluationConfigs.evaluationItems.name"),
        key: "name",
        dataIndex: "name",

        width: 300,
        render(...params: [string, EvaluationItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierEvaluationConfigs.evaluationItems.weight"),
        key: "weight",
        dataIndex: "weight",

        width: 300,
        render(...params: [number, EvaluationItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierEvaluationConfigs.evaluationItems.standard"),
        key: "standard",
        dataIndex: "standard",

        render(...params: [string, EvaluationItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: 80,
        align: "center",
        render(...params: [boolean, EvaluationItem, number]) {
          return (
            <LayoutCell>
              <div
                className="payment-red cursor-pointer btn m-l--xs"
                onClick={() =>
                  handleOpenDetailContent(params[1], "Item", params[2])
                }
              >
                <img
                  src={IcPencilSvg}
                  alt="edit"
                  width={20}
                  height={20}
                  className="m-r--sm"
                />
              </div>
              <div className="payment-trash_icon cursor-pointer btn">
                <TrashCan
                  size={20}
                  onClick={() => handleDeleteContent("Item", params[2])}
                />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [handleDeleteContent, handleOpenDetailContent, translate]
  );

  const evaluationResultColumns: ColumnProps<EvaluationResult>[] = useMemo(
    () => [
      {
        title: translate(
          "supplierEvaluationConfigs.evaluationResults.fromScore"
        ),
        key: "fromScore",
        dataIndex: "fromScore",

        width: 200,
        render(...params: [number, EvaluationResult, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierEvaluationConfigs.evaluationResults.toScore"),
        key: "toScore",
        dataIndex: "toScore",
        width: 200,

        render(...params: [number, EvaluationResult, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate(
          "supplierEvaluationConfigs.evaluationResults.conclude"
        ),
        key: "conclude",
        dataIndex: "conclude",

        render(...params: [string, EvaluationResult, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: 80,
        align: "center",
        render(...params: [boolean, EvaluationResult, number]) {
          return (
            <LayoutCell>
              <div
                className="payment-red cursor-pointer btn m-l--xs"
                onClick={() =>
                  handleOpenDetailContent(params[1], "Result", params[2])
                }
              >
                <img
                  src={IcPencilSvg}
                  alt="edit"
                  width={20}
                  height={20}
                  className="m-r--sm"
                />
              </div>
              <div className="payment-trash_icon cursor-pointer btn">
                <TrashCan
                  size={20}
                  onClick={() => handleDeleteContent("Result", params[2])}
                />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [handleDeleteContent, handleOpenDetailContent, translate]
  );

  return {
    model,
    isDetail,
    loading,
    setLoading,
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
    handleSave,
    //for content
    evaluationItems,
    evaluationResults,
    evaluationItemColumns,
    evaluationResultColumns,
    evaluationItemRowSelection,
    selectedEvaluationItemRowKeys,
    setSelectedEvaluationItemRowKeys,
    evaluationResultRowSelection,
    selectedEvaluationResultRowKeys,
    setSelectedEvaluationResultRowKeys,
    handleDeleteContent,
    handleBulkDeleteContent,
    handleAddNewContent,
    handleChangeContent,
    //for contentDetailModal
    isOpenItemContent,
    isOpenResultContent,
    loadingContent,
    maxWeight,
    handleCloseDetailContent,
    targetItem,
    targetResult,
    handleChangeSimpleFieldContent,
    handleSaveContentModal,
  };
}
