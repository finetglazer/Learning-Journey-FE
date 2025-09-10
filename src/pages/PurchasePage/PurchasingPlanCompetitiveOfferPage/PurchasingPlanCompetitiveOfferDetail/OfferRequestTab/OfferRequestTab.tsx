import { type CollapseProps } from "antd";

import { useContext, useState } from "react";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { ColumnKey, InformationSectionKey } from "models/PurchasingPlan";

import Attachments from "components/Attachments/Attachments";
import { AdvancedCollapseView } from "components";
import BiddingPackageInformation from "./Components/BiddingPackageInformation/BiddingPackageInformation";
import EvaluationCriteriaList from "./Components/EvaluationCriteria/EvaluationCriteriaList";
import AttachmentsDetail from "./Components/AttachmentsDetail/AttachmentsDetail";
import AttachmentsDetailModal from "./Components/AttachmentsDetail/AttachmentsDetailModal/AttachmentsDetailModal";
import TechnicalProfile from "./Components/TechnicalProfile/TechnicalProfile";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { emptyCloudIcon } from "assets/icons";

const OfferRequestTab = ({ isDetail = false }) => {
  const currentContext = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const { translate, model, handleChangeListField } = currentContext;
  const [isOpenAttachmentsModal, setIsOpenAttachmentsModal] =
    useState<boolean>(false);
  const collapseItems: CollapseProps["items"] = [
    {
      key: InformationSectionKey.BIDDING_PACKAGE_INFORMATION,
      label: (
        <div className="fw-bold">
          {translate("PL.bidding_package_information")}
        </div>
      ),
      children: (
        <BiddingPackageInformation
          contextValue={currentContext}
          isDetail={isDetail}
        />
      ),
    },
    {
      key: InformationSectionKey.TECHNICAL_PROFILE,
      label: (
        <div className="fw-bold">
          {translate("PL.competitive_offer.title.request_for_proposal")}
        </div>
      ),
      children: (
        <TechnicalProfile
          isDetail={isDetail}
          contextValue={currentContext}
          columnKey={ColumnKey.OFFER_REQUEST_PROFILES}
          columnKeyParent={ColumnKey.OFFER_REQUEST}
        />
      ),
    },
    {
      key: InformationSectionKey.FINANCIAL_EVALUATION_CRITERIA,
      label: (
        <div className="fw-bold">
          {translate(
            "PL.competitive_offer.title.criteria_evaluation_offer_profile"
          )}
        </div>
      ),
      children: (
        <EvaluationCriteriaList
          contextValue={currentContext}
          columnKey={ColumnKey.EVALUATION_CRITERIA_GROUP}
          columnKeyTechnicalWeight={`${ColumnKey.EVALUATION_CRITERIA_GROUP}.${ColumnKey.TECHNICAL_WEIGHT}`}
          columnKeyFinancialWeight={`${ColumnKey.EVALUATION_CRITERIA_GROUP}.${ColumnKey.FINANCIAL_WEIGHT}`}
          columnKeyEnumMethod={`${ColumnKey.EVALUATION_CRITERIA_GROUP}.${ColumnKey.EVALUATION_METHOD}`}
          modelEvaluationCriteriaGroup={
            model?.offerRequest?.evaluationCriteriaGroup
          }
          isDetail={isDetail}
        />
      ),
    },
    {
      key: InformationSectionKey.ATTACHMENT,
      label: (
        <div className="d-flex align-items-center justify-content-between">
          <div className="fw-bold">
            {translate("PL.competitive_offer.title.attachments")}
          </div>
          {isDetail && model?.offerRequest?.attachments?.length > 8 && (
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
      children: isDetail ? (
        model?.offerRequest?.attachments?.length === 0 ? (
          <EmptyItemTable
            icon={<img src={emptyCloudIcon} alt="" />}
            content={translate("CM.empty.no_data_recorded")}
          />
        ) : (
          <AttachmentsDetail attachments={model?.offerRequest?.attachments} />
        )
      ) : (
        <Attachments
          isDetail={isDetail}
          attachments={model?.attachmentsOfferRequest}
          handleUpdate={handleChangeListField({
            fieldName: "attachmentsOfferRequest",
          })}
        />
      ),
    },
  ];

  return (
    <div>
      {isDetail ? (
        <AdvancedCollapseView items={collapseItems} />
      ) : (
        <AdvancedCollapseView
          className="p--sm"
          ghost
          items={collapseItems}
          defaultActiveKey={[
            InformationSectionKey.BIDDING_PACKAGE_INFORMATION,
            InformationSectionKey.TECHNICAL_PROFILE,
            InformationSectionKey.FINANCIAL_PROFILE,
            InformationSectionKey.FINANCIAL_EVALUATION_CRITERIA,
            InformationSectionKey.ATTACHMENT,
          ]}
        />
      )}
      {isOpenAttachmentsModal && (
        <AttachmentsDetailModal
          onClose={() => setIsOpenAttachmentsModal(false)}
          open={isOpenAttachmentsModal}
          data={model?.offerRequest?.attachments}
        />
      )}
    </div>
  );
};

export default OfferRequestTab;
