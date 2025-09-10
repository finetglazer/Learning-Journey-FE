import { CollapseProps } from "antd/lib/collapse";
import { AdvancedCollapseView } from "components";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import CriterialTechSection from "./components/CriterialSection/CriterialSection";
import { CriteriaType } from "models/PurchasingPlan";
import RoleSection from "./components/RoleSection/RoleSection";
import Attachments from "components/Attachments/Attachments";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { emptyCloudIcon } from "assets/icons";
import AttachmentsDetail from "./components/AttachmentsDetail/AttachmentsDetail";
import AttachmentsDetailModal from "./components/AttachmentsDetail/AttachmentsDetailModal/AttachmentsDetailModal";

enum InformationSectionKey {
  TECHNICAL_EVALUATION_CRITERIA,
  FINANCIAL_EVALUATION_CRITERIA,
  // ROLE,
  ATTACHMENT,
}

const EvaluationCriterialView = () => {
  const [translate] = useTranslation();
  const { model } = useContext(PurchasingPlanBiddingDetailHookContext);
  const [isOpenAttachmentsModal, setIsOpenAttachmentsModal] =
    useState<boolean>(false);

  const collapseItems: CollapseProps["items"] = [
    {
      key: InformationSectionKey.TECHNICAL_EVALUATION_CRITERIA,
      label: (
        <div className="fw-bold">
          {translate("PL.txt_technical_competency_assessment_criteria")}
        </div>
      ),
      children: (
        <CriterialTechSection criteriaType={CriteriaType.TechnicalCompetence} />
      ),
    },
    {
      key: InformationSectionKey.FINANCIAL_EVALUATION_CRITERIA,
      label: (
        <div className="fw-bold">
          {translate("PL.txt_financial_evaluation_criteria")}
        </div>
      ),
      children: <CriterialTechSection criteriaType={CriteriaType.Finance} />,
    },
    // {
    //   key: InformationSectionKey.ROLE,
    //   label: <div className="fw-bold">{translate("PL.txt_role")}</div>,
    //   children: <RoleSection />,
    // },
    {
      key: InformationSectionKey.ATTACHMENT,
      label: (
        <div className="d-flex justify-content-between align-items-center">
          <div className="fw-bold">
            {translate("PL.purchasing_plan_attachment")}
          </div>
          {model?.evaluationCriteriaAttachments?.length > 8 && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenAttachmentsModal(true);
              }}
            >
              <span className="text-table-link">
                {translate("CM.txt_show_more")}
              </span>
            </div>
          )}
        </div>
      ),
      children:
        model?.evaluationCriteriaAttachments?.length === 0 ? (
          <EmptyItemTable
            icon={<img src={emptyCloudIcon} alt="" />}
            content={translate("CM.empty.no_data_recorded")}
          />
        ) : (
          <AttachmentsDetail
            attachments={model?.evaluationCriteriaAttachments}
          />
        ),
    },
  ];

  return (
    <div>
      <AdvancedCollapseView items={collapseItems} />
      {isOpenAttachmentsModal && (
        <AttachmentsDetailModal
          onClose={() => setIsOpenAttachmentsModal(false)}
          open={isOpenAttachmentsModal}
          data={model?.evaluationCriteriaAttachments}
        />
      )}
    </div>
  );
};

export default EvaluationCriterialView;
