import { type CollapseProps } from "antd";

import { useContext, useEffect, useMemo, useState } from "react";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import {
  ColumnKey,
  InformationSectionKey,
  OfferRequest,
} from "models/PurchasingPlan";

import { AdvancedCollapseView } from "components";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { emptyCloudIcon } from "assets/icons";
import ActualOfferInformation from "./Components/ActualOfferInformation/ActualOfferInformation";
import BiddingPackageInformation from "./Components/BiddingPackageInformation/BiddingPackageInformation";
import TechnicalProfile from "./Components/TechnicalProfile/TechnicalProfile";
import EvaluationCriteriaList from "./Components/EvaluationCriteria/EvaluationCriteriaList";
import AttachmentsDetail from "./Components/AttachmentsDetail/AttachmentsDetail";
import AttachmentsDetailModal from "./Components/AttachmentsDetail/AttachmentsDetailModal/AttachmentsDetailModal";

interface OfferRequestSummaryProps {
  roundData?: OfferRequest;
  isDetail?: boolean;
  indexOfferRequest?: number;
}

const OfferRequestSummary = ({
  roundData,
  isDetail,
  indexOfferRequest,
}: OfferRequestSummaryProps) => {
  const currentContext = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const { translate, model } = currentContext;
  const [isOpenAttachmentsModal, setIsOpenAttachmentsModal] =
    useState<boolean>(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const collapseViewItems: CollapseProps["items"] = useMemo(() => {
    const items = [
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
            data={roundData?.offerRequestProfiles}
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
            isDetail={isDetail}
            data={roundData?.evaluationCriteriaGroup}
          />
        ),
      },
    ];

    if (model?.offerSummary) {
      const insertIndex = model?.offerSummary?.offerRequest?.length > 1 ? 0 : 1;
      items.splice(insertIndex, 0, {
        key: InformationSectionKey.ACTUAL_OFFER_INFORMATION,
        label: (
          <div className="fw-bold">
            {translate("PL.txt_actual_offer_information")}
          </div>
        ),
        children: <ActualOfferInformation data={roundData} />,
      });
    }

    if (model?.offerSummary?.offerRequest?.length - 1 === indexOfferRequest) {
      items.splice(0, 0, {
        key: InformationSectionKey.BIDDING_PACKAGE_INFORMATION,
        label: (
          <div className="fw-bold">
            {translate("PL.bidding_package_information")}
          </div>
        ),
        children: (
          <BiddingPackageInformation
            contextValue={currentContext}
            data={roundData}
          />
        ),
      });
    }

    if (model?.offerSummary?.offerRequest?.length === 1) {
      items?.push({
        key: InformationSectionKey.ATTACHMENT,
        label: (
          <div className="d-flex align-items-center justify-content-between">
            <div className="fw-bold">
              {translate("PL.competitive_offer.title.attachments")}
            </div>
            {isDetail && roundData?.attachments?.length > 8 && (
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
          roundData?.attachments?.length === 0 ? (
            <EmptyItemTable
              icon={<img src={emptyCloudIcon} alt="" />}
              content={translate("CM.empty.no_data_recorded")}
            />
          ) : (
            <AttachmentsDetail attachments={roundData?.attachments} />
          ),
      });
    }

    const itemsNegotiate = [
      {
        key: InformationSectionKey.ACTUAL_OFFER_INFORMATION,
        label: (
          <div className="fw-bold">
            {translate("PL.txt_actual_offer_information")}
          </div>
        ),
        children: <ActualOfferInformation data={roundData} />,
      },
    ];

    return roundData?.type === 0 ? items : itemsNegotiate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translate, currentContext, roundData, model?.offerSummary]);

  useEffect(() => {
    const keysToOpen = collapseViewItems.map((item) => String(item.key));
    setActiveKeys(keysToOpen);
  }, [collapseViewItems]);

  return (
    <div className="offer-request-information-summary">
      <AdvancedCollapseView
        isFullView
        items={collapseViewItems}
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
      />

      {isOpenAttachmentsModal && (
        <AttachmentsDetailModal
          onClose={() => setIsOpenAttachmentsModal(false)}
          open={isOpenAttachmentsModal}
          data={roundData?.attachments}
        />
      )}
    </div>
  );
};

export default OfferRequestSummary;
