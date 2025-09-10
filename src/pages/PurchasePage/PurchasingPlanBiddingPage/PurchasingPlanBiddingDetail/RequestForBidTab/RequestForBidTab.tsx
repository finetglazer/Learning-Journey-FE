import { type CollapseProps } from "antd";
import { emptyCloudIcon } from "assets/icons";

import { AdvancedCollapseView } from "components";
import Attachments from "components/Attachments/Attachments";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { ColumnKey, InformationSectionKey } from "models/PurchasingPlan";
import { useContext } from "react";
import { PurchasingPlanBiddingDetailHookContext } from "../PurchasingPlanBiddingDetailHook";
import AttachmentsDetail from "./Components/AttachmentsDetail/AttachmentsDetail";
import BiddingPackageInformation from "./Components/BiddingPackageInformation/BiddingPackageInformation";
import TechnicalProfile from "./Components/TechnicalProfile/TechnicalProfile";
import "./RequestForBidTab.scss";

const RequestForBidTab = ({ isDetail = false }) => {
  const currentContext = useContext(PurchasingPlanBiddingDetailHookContext);
  const { translate, model, handleChangeListField } = currentContext;
  const collapseItems: CollapseProps["items"] = [
    {
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
        />
      ),
    },
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
        />
      ),
    },
    {
      key: InformationSectionKey.ATTACHMENT,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_attachment")}
        </div>
      ),
      children: isDetail ? (
        model?.tenderRequests?.attachments?.length === 0 ? (
          <EmptyItemTable
            icon={<img src={emptyCloudIcon} alt="" />}
            content={translate("CM.empty.no_data_recorded")}
          />
        ) : (
          <AttachmentsDetail attachments={model?.tenderRequests?.attachments} />
        )
      ) : (
        <Attachments
          isDetail={isDetail}
          attachments={model?.tenderRequestAttachments}
          handleUpdate={handleChangeListField({
            fieldName: "tenderRequestAttachments",
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
          items={collapseItems}
          defaultActiveKey={[
            InformationSectionKey.BIDDING_PACKAGE_INFORMATION,
            InformationSectionKey.TECHNICAL_PROFILE,
            InformationSectionKey.FINANCIAL_PROFILE,
            InformationSectionKey.ATTACHMENT,
          ]}
        />
      )}
    </div>
  );
};

export default RequestForBidTab;
