import { type CollapseProps } from "antd";
import { emptyCloudIcon } from "assets/icons";

import { AdvancedCollapseView } from "components";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import {
  ColumnKey,
  InformationSectionKey,
  OfferRequest,
} from "models/PurchasingPlan";
import { useContext, useState } from "react";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import AttachmentsDetail from "../EvaluationCriterialViewTab/components/AttachmentsDetail/AttachmentsDetail";
import { isArray, size } from "lodash";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import AttachmentsDetailModal from "../EvaluationCriterialViewTab/components/AttachmentsDetail/AttachmentsDetailModal/AttachmentsDetailModal";
import BiddingPackageInformation from "./Components/BiddingPackageInformation/BiddingPackageInformation";
import TechnicalProfile from "./Components/TechnicalProfile/TechnicalProfile";
import ActualOfferInformation from "./Components/ActualOfferInformation/ActualOfferInformation";

const RequestForBidTabView = ({ isDetail = false }) => {
  const currentContext = useContext(PurchasingPlanBiddingDetailHookContext);
  const { translate, model } = currentContext;
  const [isOpenAttachmentsModal, setIsOpenAttachmentsModal] =
    useState<boolean>(false);

  const collapseItems = (data: any) => {
    const items: CollapseProps["items"] = [
      {
        key: InformationSectionKey.TECHNICAL_PROFILE,
        label: (
          <div className="fw-bold">
            {translate("PL.bidding.title.technical_profile")}
          </div>
        ),
        children: (
          <TechnicalProfile
            isDetail={isDetail}
            contextValue={currentContext}
            columnKey={ColumnKey.TECHNICAL_PROFILE}
            dataTable={data?.technicalProfile}
          />
        ),
      },
      {
        key: InformationSectionKey.FINANCIAL_PROFILE,
        label: (
          <div className="fw-bold">
            {translate("PL.bidding.title.financial_profile")}
          </div>
        ),
        children: (
          <TechnicalProfile
            isDetail={isDetail}
            contextValue={currentContext}
            columnKey={ColumnKey.FINANCIAL_PROFILE}
            dataTable={data?.financialProfile}
          />
        ),
      },
      {
        key: InformationSectionKey.ATTACHMENT,
        label: (
          <div className="d-flex align-items-center justify-content-between">
            <div className="fw-bold">
              {translate("PL.purchasing_plan_attachment")}
            </div>
            {isDetail && model?.tenderRequestAttachments?.length > 8 && (
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
          data?.attachments?.length === 0 ? (
            <EmptyItemTable
              icon={<img src={emptyCloudIcon} alt="" />}
              content={translate("CM.empty.no_data_recorded")}
            />
          ) : (
            <AttachmentsDetail attachments={data?.attachments} />
          ),
      },
    ];

    if (isArray(model?.tenderRequests) && model?.tenderRequests?.length > 1) {
      const insertIndex =
        isArray(model?.tenderRequests) && model?.tenderRequests?.length > 1
          ? 0
          : 1;
      items.splice(insertIndex, 0, {
        key: InformationSectionKey.ACTUAL_OFFER_INFORMATION,
        label: (
          <div className="fw-bold">
            {translate("PL.txt_actual_offer_information")}
          </div>
        ),
        children: <ActualOfferInformation data={data} />,
      });
    }

    if (data?.roundNumber === 1 && data?.type === 0) {
      items.splice(0, 0, {
        key: InformationSectionKey.BIDDING_PACKAGE_INFORMATION,
        label: (
          <div className="fw-bold">
            {translate("PL.bidding.title.bidding_package_information")}
          </div>
        ),
        children: (
          <BiddingPackageInformation
            contextValue={currentContext}
            isDetail={isDetail}
            dataRound={data}
          />
        ),
      });
    }

    if (isArray(model?.tenderRequests) && model?.tenderRequests?.length > 1) {
      items.pop();
    }

    const itemsNegotiate = [
      {
        key: InformationSectionKey.ACTUAL_OFFER_INFORMATION,
        label: (
          <div className="fw-bold">
            {translate("PL.txt_actual_offer_information")}
          </div>
        ),
        children: <ActualOfferInformation data={data} />,
      },
    ];

    return data?.type === 0 ? items : itemsNegotiate;
  };

  const collapseItemsView =
    isArray(model?.tenderRequests) &&
    model?.tenderRequests?.map((item: OfferRequest, index: number) => {
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
          <AdvancedCollapseView isFullView items={collapseItems(item)} />
        ),
      };
    });

  const collapseItemsAttachments = [
    {
      key: InformationSectionKey.ATTACHMENT,
      label: (
        <div className="d-flex align-items-center justify-content-between">
          <div className="fw-bold">
            {translate("PL.purchasing_plan_attachment")}
          </div>
          {isDetail && model?.tenderRequestAttachments?.length > 8 && (
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
        model?.tenderRequestAttachments?.length === 0 ? (
          <EmptyItemTable
            icon={<img src={emptyCloudIcon} alt="" />}
            content={translate("CM.empty.no_data_recorded")}
          />
        ) : (
          <AttachmentsDetail attachments={model?.tenderRequestAttachments} />
        ),
    },
  ];

  const moreRound =
    isArray(model?.tenderRequests) && size(model?.tenderRequests) > 1;

  if (!moreRound) {
    return (
      <div>
        {isArray(model?.tenderRequests) &&
          model?.tenderRequests?.map((item: OfferRequest, index: number) => {
            return (
              <>
                <AdvancedCollapseView key={index} items={collapseItems(item)} />
              </>
            );
          })}

        {isOpenAttachmentsModal && (
          <AttachmentsDetailModal
            onClose={() => setIsOpenAttachmentsModal(false)}
            open={isOpenAttachmentsModal}
            data={model?.tenderRequestAttachments}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <AdvancedCollapseView items={collapseItemsView} />
      <AdvancedCollapseView items={collapseItemsAttachments} />

      {isOpenAttachmentsModal && (
        <AttachmentsDetailModal
          onClose={() => setIsOpenAttachmentsModal(false)}
          open={isOpenAttachmentsModal}
          data={model?.tenderRequestAttachments}
        />
      )}
    </div>
  );
};

export default RequestForBidTabView;
