import { PropsWithChildren, ReactNode, useMemo } from "react";
import GeneralInformationViewSmall, {
  Ticket,
  BlockContainer,
} from "components/GeneralInformationViewSmall/GeneralInformationViewSmall";

import { formatNumber } from "core/helpers/number";
import { isEmpty } from "lodash";
import { VND_CURRENCY } from "models/Payment";
import { Card, Col, Row } from "antd";
import { getLinkFollowTicketType } from "pages/PurchasePage/ContractPage/ContractDetail/Components/GenerationInfoTab/Components/ContractDetailBase/ShoppingPlanTable/ShoppingPlanTable";
import { TicketTypeNumber } from "models/Contract";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import stylesGeneration from "./GenerationInfo.module.scss";
import { useTranslation } from "react-i18next";
import { addZStringToDate, formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";

const ContentTicket = ({
  contextValue,
}: {
  contextValue: PurchasingPlanModel;
}) => {
  const { model } = contextValue;
  const [translate] = useTranslation();
  return (
    <Ticket
      ticketClassName={stylesGeneration["ticket-item-label"]}
      code={model?.originalPurchaseRequest?.purchaseProposalCode}
      description={`${translate("PL.txt_based_on_the_policy_directive")}: ${
        model?.originalPurchaseRequest?.purchaseProposalName
      }
      `}
      titleClassName={stylesGeneration["ticket-item-title"]}
      descriptionClassName={stylesGeneration["ticket-item-description"]}
      link={
        getLinkFollowTicketType(TicketTypeNumber.Policy) +
        `/${model?.originalPurchaseRequest?.purchaseProposalId}`
      }
    />
  );
};

const PurchasingPlanCompetitiveOfferGenerationInfo = ({
  contextValue,
}: {
  contextValue: PurchasingPlanModel;
}) => {
  const { translate, model, getPurchasePlanTypeByRouter } = contextValue;

  const linkPurchaseRequestTicket = useMemo(() => {
    return `${getLinkFollowTicketType(TicketTypeNumber.ShoppingRequest)}/${
      model?.originalPurchaseRequest?.id
    }`;
  }, [model]);

  const handleOpenNewTab = (yourPath: string) => {
    if (!yourPath) return;
    const origin = window.location.origin; // Lấy origin hiện tại
    const fullUrl = `${origin}${yourPath}`; // Tạo URL đầy đủ

    window.open(fullUrl, "_blank");
  };
  const blocksLeft = [
    {
      label: "PL.purchasing_plan_request_code",
      content: (
        <div
          className={stylesGeneration["link"]}
          onClick={() => {
            handleOpenNewTab(linkPurchaseRequestTicket);
          }}
        >
          {model?.originalPurchaseRequest?.code}
        </div>
      ),
    },
    {
      label: "PL.purchasing_plan_request_name",
      content: model?.originalPurchaseRequest?.name,
    },
    {
      label: "PL.purchasing_plan_total_value",
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
      content: `${model?.originalPurchaseRequest?.createUser} - ${model?.originalPurchaseRequest?.createUserName}`,
    },
    {
      label: "PL.purchasing_plan_title",
      content: model?.originalPurchaseRequest?.position?.name,
    },
    {
      label: "PL.purchasing_plan_creator_unit",
      content: model?.originalPurchaseRequest?.organization?.name,
    },
    {
      label: "PL.purchasing_plan_request_sent_date",
      content: formatDate(
        addZStringToDate(model?.originalPurchaseRequest?.sentDate),
        STANDARD_DATE_FORMAT_SLASH
      ),
    },
  ];

  const blocksRight = [
    {
      label: "PL.purchasing_plan_name",
      content: model?.name,
    },
    {
      label: "PL.purchasing_plan_purchase_form",
      content: getPurchasePlanTypeByRouter(model?.purchasePlanType?.id)?.name,
    },
    {
      label: "PL.purchasing_plan_description",
      content: model?.note,
    },
    {
      label: "PL.create_user_header_table",
      content: `${model?.user?.email} - ${model?.user?.name}`,
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
      <ContentTicket contextValue={contextValue} />
      <Row>
        <Col span={12}>
          <Card
            hoverable
            className={stylesGeneration["card-generation-competitive-offer"]}
          >
            <GeneralInformationViewSmall>
              <BlockContainer
                title={translate("PL.purchasing_plan_based_on_requirements")}
              >
                {blocksLeft.map(({ label, content }) => (
                  <Block
                    key={`${model?.idDetail}-${label}-${content}`}
                    label={translate(label)}
                    content={content}
                  />
                ))}
              </BlockContainer>
            </GeneralInformationViewSmall>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            className={stylesGeneration["card-generation-competitive-offer"]}
          >
            <GeneralInformationViewSmall>
              <BlockContainer
                title={translate("PL.purchasing_plan_general_information_tab")}
              >
                {blocksRight.map(({ label, content }) => (
                  <Block
                    key={`${model?.idDetail}-${label}-${content}`}
                    label={translate(label)}
                    content={content}
                  />
                ))}
              </BlockContainer>
            </GeneralInformationViewSmall>
          </Card>
        </Col>
      </Row>
    </>
  );
};

interface BlockContainerProps extends PropsWithChildren {
  title?: ReactNode;
  label?: string;
  content?: ReactNode | string;
  className?: string;
}

function Block({ content, label, children, className }: BlockContainerProps) {
  return (
    <Col className={stylesGeneration["block"]}>
      {label && <div className={stylesGeneration["block-label"]}>{label}</div>}
      {content && (
        <div className={`${stylesGeneration["block-content"]} ${className}`}>
          {content}
        </div>
      )}
      {children}
    </Col>
  );
}

export default PurchasingPlanCompetitiveOfferGenerationInfo;
