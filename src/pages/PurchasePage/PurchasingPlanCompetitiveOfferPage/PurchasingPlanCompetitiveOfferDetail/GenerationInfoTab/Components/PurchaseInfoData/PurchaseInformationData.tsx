import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { useTranslation } from "react-i18next";
import {
  PurchasingPlanModel,
  PurchaseProposalModel,
} from "models/PurchasingPlan";
import { isEmpty } from "lodash";
import { VND_CURRENCY } from "models/Payment";
import { ContentInfoModel } from "models/ContractAdjustment/ContractAdjustmentModel";
import Insight from "../../../Components/Insight/Insight";
import { combineText } from "core/helpers/text";

type styleProps = {
  context: PurchasingPlanModel;
};
const PurchaseInformationData = (props: styleProps) => {
  const [translate] = useTranslation();
  const { context } = props;

  const {
    model,
    handleViewPurchaseProposal,
    handleViewOriginPurchaseProposal,
  } = context;

  const purchaseProposal =
    model?.purchaseProposalId || ({} as PurchaseProposalModel);

  const content: ContentInfoModel[] = [
    {
      label: translate("PR.table_proposal_code"),
      value: purchaseProposal?.purchaseProposalCode,
      colSpan: 6,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
      isLink: true,
      onClick: handleViewOriginPurchaseProposal,
      valueTooltip: combineText(
        purchaseProposal?.purchaseProposalCode,
        purchaseProposal?.purchaseProposalName
      ),
    },
    {
      label: translate("PL.purchasing_plan_request_code"),
      value: purchaseProposal?.code,
      colSpan: 6,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
      isLink: true,
      onClick: handleViewPurchaseProposal,
      valueTooltip: purchaseProposal?.code,
    },
    {
      label: translate("PL.purchasing_plan_request_name"),
      value: purchaseProposal?.name,
      colSpan: 6,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
      isLink: false,
      onClick: null,
      valueTooltip: purchaseProposal?.name,
    },
    {
      label: translate("PL.purchasing_plan_total_value"),
      value:
        formatNumber(purchaseProposal?.total) +
        ` ${
          isEmpty(purchaseProposal?.currency?.code)
            ? VND_CURRENCY
            : purchaseProposal?.currency?.code
        }`,
      colSpan: 6,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
      isLink: false,
    },
    {
      label: translate("PL.purchasing_plan_creator"),
      value: combineText(
        purchaseProposal?.createUser,
        purchaseProposal?.createUserName
      ),
      colSpan: 6,
      isShowTag: false,
      textTag: "",
      isNotBorder: true,
      isShow: true,
      isLink: false,
    },
    {
      label: translate("PL.purchasing_plan_title"),
      value: purchaseProposal?.position?.name,
      colSpan: 6,
      isShowTag: false,
      textTag: "",
      isNotBorder: true,
      isShow: true,
      isLink: false,
    },
    {
      label: translate("PL.purchasing_plan_creator_unit"),
      value: purchaseProposal?.organization?.name,
      colSpan: 6,
      isShowTag: false,
      textTag: "",
      isNotBorder: true,
      isShow: true,
      isLink: false,
    },
    {
      label: translate("PL.purchasing_plan_request_sent_date"),
      value: formatDate(
        purchaseProposal?.createdDate,
        STANDARD_DATE_FORMAT_SLASH
      ),
      colSpan: 6,
      isShowTag: false,
      textTag: "",
      isNotBorder: true,
      isShow: true,
      isLink: false,
    },
  ];

  return (
    <div>
      <Insight content={content} />
    </div>
  );
};

export default PurchaseInformationData;
