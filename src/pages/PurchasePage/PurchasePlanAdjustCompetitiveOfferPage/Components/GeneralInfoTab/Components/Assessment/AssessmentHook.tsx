import { useMemo, useRef, useState } from "react";

import { listService } from "core/services/page-services/list-service";
import { uniqueId } from "lodash";
import {
  EvaluationCriteria,
  EvaluationCriteriaModelBase,
  EvaluationMethod,
} from "models/PurchasingPlan";
import { EModal } from "config/const";

import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";

interface Props {
  isDetail?: boolean;
  contextValue?:
    | PurchasePlanAdjustCompetitiveOfferDetailHookContextProps
    | PurchasePlanAdjustBidDetailHookContextProps;
  fieldNameWrap?: string;
}

export const useAssessmentHook = (props: Props) => {
  const {
    isDetail = false,
    contextValue,
    fieldNameWrap = "offerRequest",
  } = props;
  const {
    purchasePlanId,
    isDetailPage,
    isCreatePage,
    model,
    handleChangeSingleField,
    translate,
  } = contextValue;
  const [modal, setModal] = useState<EModal | null>(null);

  const assessmentId = useRef<string | null>(null);
  const dataRequest = useMemo(
    () => model?.[fieldNameWrap],
    [fieldNameWrap, model]
  );

  const evaluationCriteriaGroup = useMemo(() => {
    return dataRequest?.evaluationCriteriaGroup;
  }, [dataRequest?.evaluationCriteriaGroup]);

  const isPassFail =
    evaluationCriteriaGroup?.evaluationMethod === EvaluationMethod.PassFail;

  const criteriaType = evaluationCriteriaGroup?.criteriaType;

  const evaluationCriterions =
    (evaluationCriteriaGroup?.evaluationCriterias as EvaluationCriteriaModelBase[]) ??
    [];

  const technicalWeight = evaluationCriteriaGroup?.technicalWeight;
  const financialWeight = evaluationCriteriaGroup?.financialWeight;

  const {
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRow,
    setSelectedRowKeys,
  } = listService.useRowSelection<EvaluationCriteriaModelBase>(
    "checkbox",
    [],
    true,
    "manual",
    true
  );

  const handleChangeItemTable = ({
    data,
    id,
    errorName,
  }: {
    data: EvaluationCriteria;
    id: string;
    errorName: string;
  }) => {
    const newEvaluationCriterions = evaluationCriterions.map((item) => {
      return item?.rowKeyId === id ? { ...item, ...data } : item;
    });

    const evaluationCriteriaGroup =
      model?.[fieldNameWrap]?.evaluationCriteriaGroup;

    handleChangeSingleField({
      fieldName: fieldNameWrap,
      errorName,
    })({
      ...model[fieldNameWrap],
      evaluationCriteriaGroup: {
        ...evaluationCriteriaGroup,
        evaluationCriterias: newEvaluationCriterions,
      },
    });
  };

  const handleCloseDeleteModal = () => {
    assessmentId.current = null;
    setModal(null);
  };

  const handleConfirmDelete = (idDelete: string | null) => {
    setModal(EModal.DELETE);
    assessmentId.current = idDelete;
  };

  const handleUpdateRowSelected = (
    newAssessmentList: EvaluationCriteriaModelBase[]
  ) => {
    evaluationCriteriaGroup.evaluationCriterias = newAssessmentList;

    handleChangeSingleField({
      fieldName: fieldNameWrap,
    })(model[fieldNameWrap]);

    const newAssessmentIds = newAssessmentList?.map((item) => item?.rowKeyId);

    const newRowKeysSelected = selectedRowKeys?.filter((id) =>
      newAssessmentIds.includes(id as string)
    );
    setSelectedRowKeys(newRowKeysSelected);
    handleCloseDeleteModal();
  };

  const handleDeleteRow = () => {
    let newAssessmentList = evaluationCriterions;
    if (assessmentId.current) {
      newAssessmentList = newAssessmentList?.filter(
        (item) => item?.rowKeyId !== assessmentId.current
      );
    } else {
      newAssessmentList = newAssessmentList?.filter(
        (item) => !selectedRowKeys.includes(item?.rowKeyId)
      );
    }

    handleUpdateRowSelected(newAssessmentList);
  };

  const addNewAssessmentRow = () => {
    const newScoringRow = {
      rowKeyId: uniqueId("evaluation_criteria"),
      maximumPointScale: 0,
      minimumPointScale: 0,
    };
    const newAssessmentScoring = [...evaluationCriterions, newScoringRow];

    if (!evaluationCriteriaGroup) {
      model[fieldNameWrap].evaluationCriteriaGroup = {
        evaluationCriterias: [],
      };
    }

    model[fieldNameWrap].evaluationCriteriaGroup.evaluationCriterias =
      newAssessmentScoring;

    handleChangeSingleField({
      fieldName: fieldNameWrap,
    })({
      ...model[fieldNameWrap],
    });
  };

  return {
    modal,
    isPassFail,
    selectedRowKeys,
    criteriaType,
    rowSelection,
    selectedRow,
    purchasePlanId,
    isDetailPage,
    isCreatePage,
    model,
    translate,
    evaluationCriterions,
    technicalWeight,
    financialWeight,
    setSelectedRow,
    handleCloseDeleteModal,
    setSelectedRowKeys,
    handleChangeItemTable,
    handleDeleteRow,
    addNewAssessmentRow,
    handleConfirmDelete,
    evaluationMethodType: evaluationCriteriaGroup?.evaluationMethod,
  };
};
