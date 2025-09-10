import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";
import { isEmpty, isUndefined } from "lodash";
import AttachedFile from "./Components/AttachedFile/AttachedFile";
import BasicInformation from "./Components/BasicInformation/BasicInformation";
import PolicyInfo from "./Components/PolicyInfo/PolicyInfo";
import "./PurchaseRequestGenerationInfoTab.scss";
import { useContext } from "react";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { PurchaseRequestDetailHookContext } from "../PurchaseRequestDetailHook";

interface PurchaseRequestGenerationInfoTabProps {
  topicId?: string;
}
const PurchaseRequestGenerationInfoTab = ({
  topicId,
}: PurchaseRequestGenerationInfoTabProps) => {
  const { model } = useContext<PurchaseRequestDetailModel>(
    PurchaseRequestDetailHookContext
  );

  const topicType = model?.isAdjust
    ? TopicType.PurchaseRequestAdjustment
    : TopicType.PurchaseRequest;

  return (
    <div className="purchase_request_info_tab">
      <BasicInformation />
      <PolicyInfo />
      <AttachedFile />
      <div className="proposal_generation_info_tab__comment">
        {!isEmpty(topicId) && !isUndefined(model?.isAdjust) && (
          <Comments topicType={topicType} topicId={topicId} />
        )}
      </div>
    </div>
  );
};

export default PurchaseRequestGenerationInfoTab;
