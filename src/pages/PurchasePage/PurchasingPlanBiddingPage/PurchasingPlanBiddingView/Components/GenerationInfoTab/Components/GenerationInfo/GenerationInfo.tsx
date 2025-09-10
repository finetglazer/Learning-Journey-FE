import { useContext } from "react";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import GeneralInformationViewLayout, {
  Attachments,
  BlockContainer,
  ItemContent,
  Ticket,
} from "components/GeneralInformationView/GeneralInformationView";
import { useTranslation } from "react-i18next";
import { formatNumber } from "core/helpers/number";
import { isEmpty } from "lodash";
import { VND_CURRENCY } from "models/Payment";
import { PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE } from "config/route-const";

const ContentLeft = () => {
  const [translate] = useTranslation();
  const { model } = useContext(PurchasingPlanBiddingDetailHookContext);

  const items = [
    {
      label: "PL.total_value_header_table",
      content:
        formatNumber(model?.originalPurchaseRequest?.total) +
        ` ${
          isEmpty(model?.originalPurchaseRequest?.currency?.code)
            ? VND_CURRENCY
            : model?.originalPurchaseRequest?.currency?.code
        }`,
    },
    {
      label: "PL.create_user_header_table",
      content: model?.user?.name,
    },
    {
      label: "PL.business_unit_header_table",
      content: model?.userOrganization?.[0]?.name,
    },
    {
      label: "PL.purchasing_plan_title",
      content: model?.userPosition?.name,
    },
  ];

  return (
    <>
      <BlockContainer>
        <Ticket
          code={model?.code}
          link={`${PURCHASE_PLAN_ADJUST_BID_DETAIL_ROUTE}/${model?.id}`}
          description={model?.note}
          note={`${translate("PL.purchasing_plan_request_code")}: ${
            model?.originalPurchaseRequest?.code
          }`}
        />
        <h6 className="bold-text mt-4">
          {translate("PL.bidding.title.proposal_information")}
        </h6>
        {items.map(({ label, content }, index) => (
          <ItemContent key={index} label={translate(label)} content={content} />
        ))}
      </BlockContainer>
      <Attachments data={model?.attachments} />
    </>
  );
};

const PurchasePlanBiddingGenerationInfo = () => {
  const { translate, model, getPurchasePlanTypeByRouter } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const blocks = [
    {
      title: "PL.bidding.title.purchase_plan_general_information",
      items: [
        {
          label: "PL.purchasing_plan_name",
          content: model?.name,
        },
        {
          label: "PL.purchasing_plan_description",
          content: model?.note,
        },
        {
          label: "PL.purchasing_plan_purchase_form",
          content: getPurchasePlanTypeByRouter(model?.purchasePlanType?.id)
            ?.name,
        },
        {
          label: "PL.create_user_header_table",
          content: model?.user?.name,
        },
        {
          label: "PL.business_unit_header_table",
          content: model?.userOrganization?.[0]?.name,
        },
        {
          label: "PL.purchasing_plan_title",
          content: model?.userPosition?.name,
        },
      ],
    },
  ];

  return (
    <div>
      <GeneralInformationViewLayout contentLeft={<ContentLeft />}>
        {blocks.map(({ title, items }, index) => (
          <BlockContainer key={index} title={translate(title)}>
            {items.map(({ label, content }) => (
              <ItemContent
                key={`${model?.idDetail}-${label}-${content}`}
                label={translate(label)}
                content={content}
              />
            ))}
          </BlockContainer>
        ))}
      </GeneralInformationViewLayout>
    </div>
  );
};

export default PurchasePlanBiddingGenerationInfo;
