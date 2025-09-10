import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import React, { useContext, useState } from "react";
import OfferRequestSummary from "./OfferRequestSummary/OfferRequestSummary";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { AdvancedCollapseView } from "components";
import { InformationSectionKey, OfferRequest } from "models/PurchasingPlan";
import AttachmentsDetail from "./OfferRequestSummary/Components/AttachmentsDetail/AttachmentsDetail";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { emptyCloudIcon } from "assets/icons";
import AttachmentsDetailModal from "./OfferRequestSummary/Components/AttachmentsDetail/AttachmentsDetailModal/AttachmentsDetailModal";
import OfferRequestTab from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/OfferRequestTab/OfferRequestTab";
import "./OfferRequestTabView.scss";

const OfferRequestTabView = ({ isDetail = false }) => {
  const currentContext = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const { translate, model } = currentContext;
  const [isOpenAttachmentsModal, setIsOpenAttachmentsModal] =
    useState<boolean>(false);

  const offerRequestRounds = model?.offerSummary?.offerRequest || [];

  const collapseItems = offerRequestRounds?.map(
    (item: OfferRequest, index: number) => {
      return {
        key: index,
        label: (
          <div className="fw-bold">{`${
            item?.type === 0
              ? translate("CM.round_price_offer")
              : translate("CM.round_negotiation")
          } ${item?.roundNumber}: ${formatDate(
            item?.roundStartDate,
            STANDARD_DATE_FORMAT_SLASH
          )} - ${formatDate(
            item?.roundEndDate,
            STANDARD_DATE_FORMAT_SLASH
          )}`}</div>
        ),
        children: (
          <OfferRequestSummary
            roundData={item}
            isDetail={isDetail}
            indexOfferRequest={index}
          />
        ),
      };
    }
  );

  const getSectionKey = () =>
    offerRequestRounds.map((item: OfferRequest, index: number) => index);

  const itemsAttachments = [
    {
      key: InformationSectionKey.ATTACHMENT,
      label: (
        <div className="d-flex align-items-center justify-content-between">
          <div className="fw-bold">
            {translate("PL.competitive_offer.title.attachments")}
          </div>
          {model?.offerSummary?.attachments?.length > 8 && (
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
        model?.offerSummary?.attachments?.length === 0 ? (
          <EmptyItemTable
            icon={<img src={emptyCloudIcon} alt="" />}
            content={translate("CM.empty.no_data_recorded")}
          />
        ) : (
          <AttachmentsDetail attachments={model?.offerSummary?.attachments} />
        ),
    },
  ];

  return (
    <>
      {offerRequestRounds?.length > 1 ? (
        <div className="offer-request-information-tab-view">
          <AdvancedCollapseView
            items={collapseItems}
            defaultActiveKey={getSectionKey()}
          />
          {offerRequestRounds?.length > 1 && (
            <div className="m-t--sm">
              <AdvancedCollapseView
                items={itemsAttachments}
                defaultActiveKey={[InformationSectionKey.ATTACHMENT]}
              />
            </div>
          )}
        </div>
      ) : (
        <OfferRequestTab isDetail={true} />
      )}

      {isOpenAttachmentsModal && (
        <AttachmentsDetailModal
          onClose={() => setIsOpenAttachmentsModal(false)}
          open={isOpenAttachmentsModal}
          data={model?.offerSummary?.attachments}
        />
      )}
    </>
  );
};

export default OfferRequestTabView;
