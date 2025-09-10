import GeneralInformationViewLayout, {
  Attachments,
  BlockContainer,
  ItemContent,
  Ticket,
} from "components/GeneralInformationView/GeneralInformationView";
import { PROPOSAL_DETAIL_ROUTE } from "config/route-const";
import { uniqueId } from "lodash";
import { useTranslation } from "react-i18next";
import { useProjectSettlementViewContext } from "../../context";
import styles from "./GeneralInformation.module.scss";
import { ReactNode } from "react";

interface TextWrapperProps {
  children: ReactNode;
  className?: string;
}

const TextWrapper = ({ children, className }: TextWrapperProps) => {
  return (
    <span className={`${styles["text-wrapper"]} ${className || ""}`}>
      {children}
    </span>
  );
};

const ContentLeft = () => {
  const [translate] = useTranslation();
  const { model } = useProjectSettlementViewContext();
  const projectSettlementInfo = model?.projectSettlementInfo;
  const items = [
    {
      label: "PS.txt_table_investment_location",
      content: projectSettlementInfo?.investmentLocation,
    },
    {
      label: "PS.txt_table_investment_form",
      content: <TextWrapper>{model?.investmentForm}</TextWrapper>,
    },
  ];

  return (
    <>
      <BlockContainer title={translate("PS.txt_project_information")}>
        <Ticket
          code={projectSettlementInfo?.proposalCode}
          link={`${PROPOSAL_DETAIL_ROUTE}/${model?.originalPurchaseProposalId}`}
          description={projectSettlementInfo?.proposalName}
          note={`${translate("PS.txt_table_code_project")}: ${
            projectSettlementInfo?.projectCode || ""
          }`}
        />
        {items.map(({ label, content }, index) => (
          <ItemContent key={index} label={translate(label)} content={content} />
        ))}
      </BlockContainer>
      <Attachments data={model?.attachments} />
    </>
  );
};

export default function GeneralInformation() {
  const [translate] = useTranslation();
  const { model } = useProjectSettlementViewContext();
  const createUserInfo = model?.createUserInfo;

  const blocks = [
    {
      title: "PS.txt_tab_information_settlement",
      items: [
        {
          label: "PS.txt_description_settlement",
          content: <TextWrapper>{model?.settlementDescription}</TextWrapper>,
        },
        {
          label: "PS.txt_table_person_create",
          content: createUserInfo?.createUser,
        },
        {
          label: "PS.txt_unit_create",
          content: createUserInfo?.createOrganization,
        },
        {
          label: "AC.txt_title",
          content: createUserInfo?.createPosition,
        },
      ],
    },
    {
      title: "PS.txt_investor_responsibilities",
      items: [
        {
          label: "PS.txt_description_settlement",
          content: <TextWrapper>{model?.responsibility}</TextWrapper>,
        },
      ],
    },
    {
      title: "PS.txt_project_performance_evaluation",
      items: [
        {
          label: "PS.txt_evaluation_results",
          content: <TextWrapper>{model?.evaluationResult}</TextWrapper>,
        },
      ],
    },
  ];

  return (
    <GeneralInformationViewLayout contentLeft={<ContentLeft />}>
      {blocks.map(({ title, items }, index) => (
        <BlockContainer key={index} title={translate(title)}>
          {items.map(({ label, content }) => (
            <ItemContent
              key={uniqueId()}
              label={translate(label)}
              content={content}
            />
          ))}
        </BlockContainer>
      ))}
    </GeneralInformationViewLayout>
  );
}
