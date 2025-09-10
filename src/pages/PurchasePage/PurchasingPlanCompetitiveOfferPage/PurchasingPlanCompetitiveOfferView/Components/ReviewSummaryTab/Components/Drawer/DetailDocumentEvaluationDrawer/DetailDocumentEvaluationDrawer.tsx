import { AdvancedCollapseView } from "components";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isNil } from "lodash";
import {
  CriteriaType,
  EditEvaluation,
  EvaluationItemResult,
  EvaluationResult,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useCallback, useContext, useEffect } from "react";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import TechnicalCriteriaTable from "./Components/TechnicalCriteriaTable";
import "./DetailDocumentEvaluationDrawer.scss";
import CapacityProfileTable from "./Components/CapacityProfileTable";
import { RoundType } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferView/Components/ReviewSummaryTab/Components/TechnicalReview/SummaryReviewTable";

type Props = {
  visible?: boolean;
  onPressClose?: () => void;
  data?: EvaluationResult;
  isEdit?: boolean;
  roundData?: RoundType;
};

const DetailDocumentEvaluationDrawer = ({
  onPressClose,
  data,
  isEdit = false,
  roundData,
}: Props) => {
  const [translate] = useTranslation();

  const { model: modelMaster, ...contextMaster } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const { model, dispatch } = detailService.useModel<EvaluationResult>(
    EvaluationResult,
    data
  );

  const { handleChangeSingleField } = fieldService.useField(model, dispatch);

  useEffect(() => {
    dispatch({ type: "SET", payload: data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getDataTableByCriteriaType = (
    type: CriteriaType,
    technicalCompetenceType?: TechnicalCompetenceType
  ) => {
    return model?.evaluationGroupResult?.find((item) => {
      if (!isNil(technicalCompetenceType)) {
        return (
          item?.criteriaType == type &&
          item?.evaluationMethod == technicalCompetenceType
        );
      }
      return item?.criteriaType == type;
    });
  };

  const checkShowFinancial = getDataTableByCriteriaType(CriteriaType.Finance);

  const checkShowTechnical = getDataTableByCriteriaType(
    CriteriaType.TechnicalCompetence
  );

  const checkShowFinancialProfile = !isNil(data?.financialProfiles);

  const checkShowTechnicalProfile = !isNil(data?.technicalCompetencyProfiles);

  const handleUpdateDataTable = useCallback(
    (id: string, data: EvaluationItemResult[]) => {
      const updatedEvaluationGroupResult = model.evaluationGroupResult.map(
        (item) => {
          if (item.id === id) {
            return { ...item, evaluationItemResult: data };
          }
          return item;
        }
      );

      model.evaluationGroupResult = updatedEvaluationGroupResult;
    },
    [model]
  );

  const TechnicalCriteria = () => {
    return (
      <div>
        <div className="header_criteria p-b--sm">
          <span>{translate("PL.txt_evaluation_method")}: </span>
          <span className="fw-bold m-l--2xs">
            {translate("PL.txt_pass_or_fail")}
          </span>
        </div>
        <TechnicalCriteriaTable
          data={
            getDataTableByCriteriaType(
              CriteriaType.TechnicalCompetence,
              TechnicalCompetenceType.TechnicalCriteriaMet
            ).evaluationItemResult
          }
          type={TechnicalCompetenceType.TechnicalCriteriaMet}
          isEdit={isEdit}
          model={model}
          handleUpdate={(value) => {
            handleUpdateDataTable(
              getDataTableByCriteriaType(
                CriteriaType.TechnicalCompetence,
                TechnicalCompetenceType.TechnicalCriteriaMet
              )?.id,
              value
            );
          }}
        />
        <div className="header_criteria m-t--lg p-b--sm">
          <span>{translate("PL.txt_evaluation_method")}:</span>
          <span className="fw-bold m-l--2xs">
            {translate("PL.txt_scoring")}
          </span>
          <div className="partition" />
          <span className="">{translate("PL.txt_technical_weight")}: </span>
          <span className="fw-bold m-l--2xs">
            {
              getDataTableByCriteriaType(
                CriteriaType.TechnicalCompetence,
                TechnicalCompetenceType.TechnicalScore
              ).pointRate
            }
            %
          </span>
        </div>
        <TechnicalCriteriaTable
          data={
            getDataTableByCriteriaType(
              CriteriaType.TechnicalCompetence,
              TechnicalCompetenceType.TechnicalScore
            ).evaluationItemResult
          }
          model={model}
          type={TechnicalCompetenceType.TechnicalScore}
          isEdit={isEdit}
          handleUpdate={(value) => {
            handleUpdateDataTable(
              getDataTableByCriteriaType(
                CriteriaType.TechnicalCompetence,
                TechnicalCompetenceType.TechnicalScore
              )?.id,
              value
            );
          }}
        />
      </div>
    );
  };

  const FinancialCriteria = () => {
    return (
      <TechnicalCriteriaTable
        data={
          getDataTableByCriteriaType(CriteriaType.Finance)?.evaluationItemResult
        }
        handleUpdate={(value) => {
          handleUpdateDataTable(
            getDataTableByCriteriaType(CriteriaType.Finance)?.id,
            value
          );
        }}
        type={
          getDataTableByCriteriaType(CriteriaType.Finance)?.evaluationMethod
        }
        model={model}
        isEdit={isEdit}
      />
    );
  };

  const collapseItems = [
    {
      key: "1",
      label: translate("PL.txt_technical_competence_evaluation"),
      children: checkShowTechnical ? <TechnicalCriteria /> : null,
    },
    {
      key: "2",
      label: translate("PL.txt_financial_competence_evaluation"),
      children: checkShowFinancial ? <FinancialCriteria /> : null,
    },
  ].filter((item) => item.children !== null);

  const FinancialProfile = () => {
    return (
      <CapacityProfileTable
        data={data?.financialProfiles}
        type={CriteriaType.Finance}
      />
    );
  };

  const TechnicalProfile = () => {
    return (
      <CapacityProfileTable
        data={data?.technicalCompetencyProfiles}
        type={CriteriaType.TechnicalCompetence}
      />
    );
  };

  const collapseItemsBidDocument = [
    {
      key: "1",
      label: translate("PL.txt_technical_profile"),
      children: checkShowTechnicalProfile ? <TechnicalProfile /> : null,
    },
    {
      key: "2",
      label: translate("PL.txt_financial_profile"),
      children: checkShowFinancialProfile ? <FinancialProfile /> : null,
    },
  ].filter((item) => item.children !== null);

  const getContent = () => {
    return <AdvancedCollapseView items={collapseItems} isFullView />;
  };

  const getContentBidDocument = () => {
    return <AdvancedCollapseView items={collapseItemsBidDocument} isFullView />;
  };

  const handleSave = () => {
    if (!validateModel()) {
      return;
    }
    const dataEdit: EditEvaluation = {
      id: modelMaster?.profileEvaluation?.quotationRequestId,
      evaluateRequests: [],
    };

    model.evaluationGroupResult.forEach((item) => {
      item?.evaluationItemResult?.forEach((itemChild) => {
        dataEdit.evaluateRequests.push({
          evaluationCriteriaId: itemChild?.evaluationCriteriaId,
          quotationRoundId: roundData?.id,
          supplierId: model?.supplierId,
          point: itemChild?.point,
          passFlag: itemChild?.passFlag,
        });
      });
    });

    contextMaster?.editEvaluation(dataEdit);

    onPressClose();
  };

  const validateModel = () => {
    let isValid = true;
    const errors: any = {};

    model.evaluationGroupResult.forEach((item) => {
      item?.evaluationItemResult?.forEach((itemChild) => {
        if (
          item?.evaluationMethod == TechnicalCompetenceType.TechnicalCriteriaMet
        ) {
          if (isNil(itemChild?.passFlag)) {
            isValid = false;
            errors[`passFlag.${itemChild?.evaluationCriteriaId}`] = translate(
              "CM.input_require_validation"
            );
          }
        } else {
          if (isNil(itemChild?.point)) {
            isValid = false;
            errors[`point.${itemChild?.evaluationCriteriaId}`] = translate(
              "CM.input_require_validation"
            );
          } else if (itemChild?.point < itemChild?.minimumPointScale) {
            isValid = false;
            errors[`point.${itemChild?.evaluationCriteriaId}`] = translate(
              "PL.txt_minimum_point_scale",
              { point: itemChild?.minimumPointScale }
            );
          }
        }
      });
    });
    model.errors = errors;
    handleChangeSingleField({ fieldName: "errors" })(errors);
    return isValid;
  };

  return (
    <div className="detail_document_evaluation_drawer">
      <Drawer
        size={"2xl"}
        loading={false}
        visible={true}
        titleButtonCancel={translate("PM.bth_close")}
        titleButtonApply={translate("PR.drawer_btn_save")}
        handleClose={onPressClose}
        handleSave={handleSave}
        handleCancel={onPressClose}
        isHaveCloseIcon={true}
        shouldCloseWhenClickOutSide={false}
        hasOverlay={false}
        visibleFooter={isEdit}
        title={
          <div className="fw-bold">
            <span>{translate("CT.contract_plan.supplier")}: </span>
            <span className="txt_blue p-l--3xs">{data?.supplier?.name}</span>
          </div>
        }
      >
        <div className="detail_review_drawer__content">
          <div className="item_content">
            <AdvancedCollapseView
              items={[
                {
                  key: "1",
                  label: translate("PL.txt_bid_document"),
                  children: getContentBidDocument(),
                },
              ]}
              className="content__collapse"
            />
            <AdvancedCollapseView
              items={[
                {
                  key: "1",
                  label: translate("PL.evaluation_results"),
                  children: getContent(),
                },
              ]}
              className="content__collapse"
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DetailDocumentEvaluationDrawer;
