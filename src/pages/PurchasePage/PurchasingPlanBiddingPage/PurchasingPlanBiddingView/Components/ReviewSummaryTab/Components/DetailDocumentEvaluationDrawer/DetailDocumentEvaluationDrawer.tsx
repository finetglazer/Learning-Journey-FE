import { AdvancedCollapseView } from "components";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { cloneDeep, first, isEmpty, isNil } from "lodash";
import {
  BiddingProcedure,
  CriteriaType,
  EditEvaluation,
  EvaluationItemResult,
  EvaluationMethod,
  EvaluationResult,
  TechnicalCompetenceType,
  ViewRole,
} from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { memo, useCallback, useContext, useEffect, useMemo } from "react";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { RoundType } from "../TechnicalReview/TechnicalReviewTable";
import TechnicalCriteriaTable from "./Components/TechnicalCriteriaTable";
import "./DetailDocumentEvaluationDrawer.scss";
import CapacityProfileTable from "./Components/CapacityProfileTable";
import SupplierDocumentTable from "./Components/SupplierDocumentTable";
import EmptyCloud from "../Empty/EmptyCloud";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";

type Props = {
  visible?: boolean;
  onPressClose?: () => void;
  data?: EvaluationResult;
  isEdit?: boolean;
  roundData?: RoundType;
  handleViewQuote?: () => void;
};

const DetailDocumentEvaluationDrawer = ({
  onPressClose,
  data,
  isEdit = false,
  roundData,
  handleViewQuote,
}: Props) => {
  const [translate] = useTranslation();

  const {
    model: modelMaster,
    handleChangeAllField: handleChangeAllFieldMaster,
  } = useContext(PurchasingPlanBiddingDetailHookContext);

  const { model, dispatch } = detailService.useModel<EvaluationResult>(
    EvaluationResult,
    data
  );

  const { handleChangeSingleField } = fieldService.useField(model, dispatch);

  useEffect(() => {
    dispatch({ type: "SET", payload: data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const validateModel = () => {
    let isValid = true;
    const errors: any = {};

    const validatePoint = (
      value: number | null | undefined,
      fieldName: string,
      id: string
    ) => {
      if (isNil(value)) {
        isValid = false;
        errors[`${fieldName}.${id}`] = translate("CM.input_require_validation");
      }
    };

    const validatePassFlag = (
      value: number | null | undefined,
      fieldName: string,
      id: string
    ) => {
      if (isNil(value)) {
        isValid = false;
        errors[`${fieldName}.${id}`] = translate("CM.input_require_validation");
      }
    };

    const validateNote = (
      value: string | null | undefined,
      fieldName: string,
      id: string
    ) => {
      if (value?.length > 255) {
        isValid = false;
        errors[`${fieldName}.${id}`] = translate("CM.max_length_character", {
          length: 255,
        });
      }

      if (!NOT_TAB_ENTER_REGEX.test(value)) {
        isValid = false;
      }
    };

    const technicalRoles = [
      ViewRole.TechnicalLeader,
      ViewRole.TechnicalEvaluator,
    ];

    const financialRoles = [
      ViewRole.FinancialLeader,
      ViewRole.FinancialEvaluator,
    ];

    const isEditTechnicalRole = technicalRoles.includes(modelMaster?.viewRole);
    const isEditFinancialRole = financialRoles.includes(modelMaster?.viewRole);

    model?.evaluationGroupResult?.forEach((item) => {
      const itemId = item?.id;

      // Validate cho Technical Competence
      if (
        item?.criteriaType === CriteriaType.TechnicalCompetence &&
        isEditTechnicalRole
      ) {
        if (item?.evaluationMethod === EvaluationMethod.Scoring) {
          validatePoint(
            item?.summaryTechnicalPoint,
            "summaryTechnicalPoint",
            itemId
          );
          validateNote(
            item?.summaryTechnicalNote,
            "summaryTechnicalNote",
            itemId
          );
        } else if (item?.evaluationMethod === EvaluationMethod.PassFail) {
          validatePassFlag(
            item?.summaryTechnicalPassFlag,
            "summaryTechnicalPassFlag",
            itemId
          );
          validateNote(
            item?.summaryTechnicalNote,
            "summaryTechnicalNote",
            itemId
          );
        }
      }

      // Validate cho Finance
      if (item?.criteriaType === CriteriaType.Finance && isEditFinancialRole) {
        if (item?.evaluationMethod === EvaluationMethod.Scoring) {
          validatePoint(
            item?.summaryFinancialPoint,
            "summaryFinancialPoint",
            itemId
          );
          validateNote(
            item?.summaryFinancialNote,
            "summaryFinancialNote",
            itemId
          );

          // Validate cho Quotation
          validatePoint(
            item?.summaryQuotationPoint,
            "summaryQuotationPoint",
            itemId
          );
          validateNote(
            item?.summaryQuotationNote,
            "summaryQuotationNote",
            itemId
          );

          // Validate cho Total Point
          validatePoint(item?.summaryPoint, "summaryPoint", itemId);
          validateNote(item?.summaryNote, "summaryNote", itemId);
        } else if (item?.evaluationMethod === EvaluationMethod.PassFail) {
          validatePassFlag(
            item?.summaryFinancialPassFlag,
            "summaryFinancialPassFlag",
            itemId
          );
          validateNote(
            item?.summaryFinancialNote,
            "summaryFinancialNote",
            itemId
          );
        }
      }
    });
    model.errors = errors;
    handleChangeSingleField({ fieldName: "errors" })(errors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateModel()) {
      return;
    }

    // Lấy dữ liệu mới nhất từ các groupData
    const technicalCriteriaMet = getDataTableByCriteriaType(
      CriteriaType.TechnicalCompetence,
      TechnicalCompetenceType.TechnicalCriteriaMet
    );
    const technicalScore = getDataTableByCriteriaType(
      CriteriaType.TechnicalCompetence,
      TechnicalCompetenceType.TechnicalScore
    );
    const finance = getDataTableByCriteriaType(CriteriaType.Finance);

    // Cập nhật model với dữ liệu mới
    const updatedEvaluationGroupResult = model.evaluationGroupResult.map(
      (group) => {
        let updatedGroup = { ...group };

        // Cập nhật Technical Competence
        if (group.criteriaType === CriteriaType.TechnicalCompetence) {
          if (group.evaluationMethod === EvaluationMethod.Scoring) {
            updatedGroup = {
              ...updatedGroup,
              summaryTechnicalPoint: technicalScore?.summaryTechnicalPoint,
              summaryTechnicalNote: technicalScore?.summaryTechnicalNote,
            };
          } else if (group.evaluationMethod === EvaluationMethod.PassFail) {
            updatedGroup = {
              ...updatedGroup,
              summaryTechnicalPassFlag:
                technicalCriteriaMet?.summaryTechnicalPassFlag,
              summaryTechnicalNote: technicalCriteriaMet?.summaryTechnicalNote,
            };
          }
        }

        // Cập nhật Finance
        if (group.criteriaType === CriteriaType.Finance) {
          if (group.evaluationMethod === EvaluationMethod.Scoring) {
            updatedGroup = {
              ...updatedGroup,
              summaryFinancialPoint: finance?.summaryFinancialPoint,
              summaryFinancialNote: finance?.summaryFinancialNote,
            };
          } else if (group.evaluationMethod === EvaluationMethod.PassFail) {
            updatedGroup = {
              ...updatedGroup,
              summaryFinancialPassFlag: finance?.summaryFinancialPassFlag,
              summaryFinancialNote: finance?.summaryFinancialNote,
            };
          }
        }

        // Cập nhật các trường chung
        updatedGroup = {
          ...updatedGroup,
          summaryQuotationPoint: group.summaryQuotationPoint,
          summaryQuotationNote: group.summaryQuotationNote,
          summaryPoint: group.summaryPoint,
          summaryNote: group.summaryNote,
        };

        return updatedGroup;
      }
    );

    // Cập nhật model với dữ liệu mới
    model.evaluationGroupResult = updatedEvaluationGroupResult;

    // Cập nhật toàn bộ modelMaster
    const newModelMaster = {
      ...modelMaster,
      evaluationSummary: modelMaster?.evaluationSummary?.map((summary) => ({
        ...summary,
        evaluationResults: summary.evaluationResults?.map((result) => {
          if (result?.id === model?.id) {
            return {
              ...result,
              summaryFinancialPassFlag: finance?.summaryFinancialPassFlag,
              summaryFinancialPoint: finance?.summaryFinancialPoint,
              summaryTechnicalPoint: technicalScore?.summaryTechnicalPoint,
              summaryTechnicalPassFlag:
                technicalCriteriaMet?.summaryTechnicalPassFlag,
              summaryQuotationPoint: finance?.summaryQuotationPoint,
              summaryPoint: finance?.summaryPoint,
              technicalStatus:
                modelMaster.viewRole === ViewRole?.TechnicalLeader
                  ? 1
                  : result?.technicalStatus,
              financialStatus:
                modelMaster.viewRole === ViewRole?.FinancialLeader
                  ? 1
                  : result?.financialStatus,
              evaluationGroupResult: updatedEvaluationGroupResult,
            };
          }
          return result;
        }),
      })),
    };

    handleChangeAllFieldMaster(newModelMaster);
    onPressClose();
  };

  const getDataTableByCriteriaType = useCallback(
    (type: CriteriaType, technicalCompetenceType?: TechnicalCompetenceType) => {
      return model?.evaluationGroupResult?.find((item) => {
        if (!isNil(technicalCompetenceType)) {
          return (
            item?.criteriaType === type &&
            item?.evaluationMethod === technicalCompetenceType
          );
        }
        return item?.criteriaType === type;
      });
    },
    [model, model?.evaluationGroupResult]
  );

  const checkShowFinancial = getDataTableByCriteriaType(CriteriaType.Finance);

  const checkShowTechnical = getDataTableByCriteriaType(
    CriteriaType.TechnicalCompetence
  );

  const checkShowFinancialProfile = !isEmpty(data?.financialProfiles);

  const checkShowTechnicalProfile = !isEmpty(data?.technicalCompetencyProfiles);

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

  const TechnicalCriteria = useMemo(() => {
    return (
      <div>
        <div className="header_criteria p-b--sm">
          <span>{translate("PL.txt_evaluation_method")}: </span>
          <span className="fw-bold m-l--2xs">
            {translate("PL.txt_pass_or_fail")}
          </span>
        </div>
        {/* Table Technical Flag */}
        <TechnicalCriteriaTable
          data={
            getDataTableByCriteriaType(
              CriteriaType.TechnicalCompetence,
              TechnicalCompetenceType.TechnicalCriteriaMet
            )?.evaluationItemResult
          }
          groupData={getDataTableByCriteriaType(
            CriteriaType.TechnicalCompetence,
            TechnicalCompetenceType.TechnicalCriteriaMet
          )}
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
              )?.technicalWeight
            }
            %
          </span>
        </div>
        {/* Table Technical Score */}
        <TechnicalCriteriaTable
          data={
            getDataTableByCriteriaType(
              CriteriaType.TechnicalCompetence,
              TechnicalCompetenceType.TechnicalScore
            )?.evaluationItemResult
          }
          groupData={getDataTableByCriteriaType(
            CriteriaType.TechnicalCompetence,
            TechnicalCompetenceType.TechnicalScore
          )}
          model={model}
          handleChangeSingleField={handleChangeSingleField}
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
  }, [
    model,
    isEdit,
    translate,
    getDataTableByCriteriaType,
    handleUpdateDataTable,
    handleChangeSingleField,
  ]);

  // Table Financial
  const FinancialCriteria = useMemo(() => {
    const isScoring =
      getDataTableByCriteriaType(CriteriaType.Finance)?.evaluationMethod ==
      EvaluationMethod.Scoring;
    return (
      <>
        {isScoring ? (
          <div className="header_criteria p-b--sm">
            <span>{translate("PL.txt_evaluation_method")}:</span>
            <span className="fw-bold m-l--2xs">
              {translate("PL.txt_scoring")}
            </span>
            <div className="partition" />
            <span className="">{translate("PL.txt_financial_weight")}: </span>
            <span className="fw-bold m-l--2xs">
              {
                getDataTableByCriteriaType(
                  CriteriaType.TechnicalCompetence,
                  TechnicalCompetenceType.TechnicalScore
                )?.technicalWeight
              }
              %
            </span>
          </div>
        ) : (
          <div className="header_criteria p-b--sm">
            <span>{translate("PL.txt_evaluation_method")}: </span>
            <span className="fw-bold m-l--2xs">
              {translate("PL.txt_pass_or_fail")}
            </span>
          </div>
        )}
        <TechnicalCriteriaTable
          data={
            getDataTableByCriteriaType(CriteriaType.Finance)
              ?.evaluationItemResult
          }
          type={
            getDataTableByCriteriaType(CriteriaType.Finance)?.evaluationMethod
          }
          isEdit={isEdit}
          model={model}
          handleUpdate={(value) => {
            handleUpdateDataTable(
              getDataTableByCriteriaType(CriteriaType.Finance)?.id,
              value
            );
          }}
          handleChangeSingleField={handleChangeSingleField}
          groupData={getDataTableByCriteriaType(CriteriaType.Finance)}
        />
      </>
    );
  }, [
    model,
    isEdit,
    translate,
    getDataTableByCriteriaType,
    handleUpdateDataTable,
    handleChangeSingleField,
  ]);

  const collapseItems = [
    checkShowTechnical && {
      key: "1",
      label: translate("PL.txt_technical_competence_evaluation"),
      children: TechnicalCriteria,
    },
    checkShowFinancial && {
      key: "2",
      label: translate("PL.txt_financial_competence_evaluation"),
      children: FinancialCriteria,
    },
  ].filter(Boolean);

  const collapseItemsBidDocument = [
    {
      key: "1",
      label: translate("PL.txt_technical_profile"),
      children: checkShowTechnicalProfile && (
        <SupplierDocumentTable
          data={data?.technicalCompetencyProfiles}
          // type={CriteriaType.TechnicalCompetence}
          handleViewQuote={handleViewQuote}
        />
      ),
    },
    {
      key: "2",
      label: translate("PL.txt_financial_profile"),
      children: checkShowFinancialProfile && (
        <SupplierDocumentTable
          data={data?.financialProfiles}
          // type={CriteriaType.Finance}
          handleViewQuote={handleViewQuote}
        />
      ),
    },
  ].filter((item) => item?.children?.props?.data?.length > 0);

  const getContent = () => {
    return <AdvancedCollapseView items={collapseItems} isFullView />;
  };

  const getContentBidDocument = () => {
    return <AdvancedCollapseView items={collapseItemsBidDocument} isFullView />;
  };

  return (
    <div className="bid_document_evaluation_drawer">
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
        hasOverlay={true}
        visibleFooter={isEdit}
        title={
          <div className="fw-bold">
            <span>{translate("CT.contract_plan.supplier")}: </span>
            <span className="txt_blue p-l--3xs">{data?.supplier?.name}</span>
          </div>
        }
      >
        <div className="bid_document_evaluation_drawer__content">
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
