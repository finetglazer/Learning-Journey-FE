import GeneralInformationViewLayout, {
  BlockContainer,
  ItemContent,
  Ticket,
} from "components/GeneralInformationView/GeneralInformationView";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";
import { isEqual, uniqueId } from "lodash";
import { useTranslation } from "react-i18next";
import React, { useContext } from "react";
import { SettlementHookModel } from "models/Settlement/SettlementModel";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { ContractRequestType } from "models/Settlement";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatCurrency, formatNumber } from "core/helpers/number";
import { Tag } from "react-components-design-system";
import AttachmentsView from "../../AttachmentsView/AttachmentsView";

const ContentLeft = () => {
  const [translate] = useTranslation();
  const { model } = useContext<SettlementHookModel>(SettlementHookContext);
  const contactOrderInfo = model?.contactOrderInfo;
  const items = [
    {
      label: "settlement.total_contract_value",
      content: (
        <div className="fw-bold fs-6">
          {`${formatCurrency({
            value: contactOrderInfo?.total,
            code: contactOrderInfo?.currency,
          })} ${contactOrderInfo?.currency}`}
        </div>
      ),
    },
    {
      label: "settlement.validity_period_txt",
      content: `${formatDate(
        contactOrderInfo?.effectiveDate,
        STANDARD_DATE_FORMAT_SLASH
      )} - ${formatDate(
        contactOrderInfo?.endDate,
        STANDARD_DATE_FORMAT_SLASH
      )}`,
    },
    {
      label: "AC.txt_table_manager",
      content: (
        <div className="text-break break-all text-end">
          <span> {contactOrderInfo?.managerEmail} </span>
          <br />
          <span> {contactOrderInfo?.managerName} </span>
        </div>
      ),
    },
  ];

  const itemsGeneration = [
    {
      label: "settlement.settlement_description",
      content: (
        <div className="text-break break-all text-start">
          {model?.description}
        </div>
      ),
    },
    {
      label: "settlement.filter_effective_date",
      content: `${formatDate(
        model?.effectiveDate,
        STANDARD_DATE_FORMAT_SLASH
      )}`,
    },
    {
      label: "settlement.rate_txt",
      content: `${formatNumber(model?.rate)}`,
    },
    {
      label: "settlement.filter_creator",
      content: (
        <div className="text-break break-all text-end">
          <span> {model?.creator?.email} </span>
          <br />
          <span> {model?.creator?.name} </span>
        </div>
      ),
    },
    {
      label: "PL.filter_create_unit",
      content: `${model?.createdOrganization?.name}`,
    },
    {
      label: "settlement.position_title_txt",
      content: `${model?.position?.name}`,
    },
  ];

  return (
    <>
      <BlockContainer
        title={translate("settlement.contact_order_information")}
        className="fs-6"
      >
        <Ticket
          code={contactOrderInfo?.code}
          link={`${CONTRACT_ROUTE_VIEW}/${contactOrderInfo?.id}`}
          description={contactOrderInfo?.name}
          note={
            isEqual(
              contactOrderInfo?.contractRequestType,
              ContractRequestType.Contract
            )
              ? `${translate("settlement.purchase_contract")}: ${
                  contactOrderInfo?.contractNo
                }`
              : `${translate("settlement.purchase_order")}: ${
                  contactOrderInfo?.contractNo
                }`
          }
        />
        {items.map(({ label, content }, index) => (
          <ItemContent key={index} label={translate(label)} content={content} />
        ))}
      </BlockContainer>
      <BlockContainer
        title={translate("settlement.generation_information")}
        className="fs-6"
      >
        {itemsGeneration.map(({ label, content }, index) => (
          <ItemContent key={index} label={translate(label)} content={content} />
        ))}
      </BlockContainer>
      <AttachmentsView data={model?.attachments} />
    </>
  );
};

export default function GenerationInfoView() {
  const [translate] = useTranslation();
  const { model } = useContext<SettlementHookModel>(SettlementHookContext);
  const contactOrderInfo = model?.contactOrderInfo;

  const blocks = [
    {
      title: "settlement.buyer_service_user_txt",
      items: [
        {
          label: "AC.txt_buyer_unit_name",
          content: contactOrderInfo?.legalEntity?.name,
        },
        {
          label: "PL.purchasing_plan_supplier_tax_code",
          content: contactOrderInfo?.legalEntity?.taxCode,
        },
        {
          label: "CT.address",
          content: contactOrderInfo?.legalEntity?.address,
        },
        {
          label: "AC.txt_representative",
          content: contactOrderInfo?.legalEntity?.personAgent,
        },
        {
          label: "AC.txt_position",
          content: contactOrderInfo?.legalEntity?.position,
        },
      ],
    },
    {
      title: "settlement.seller_service_provider_txt",
      items: [
        {
          label: "AC.txt_supplier",
          content: model?.supplierName,
        },
        {
          label: "AC.txt_address",
          content: model?.supplierAddress,
        },
        {
          label: "AC.txt_tax_id",
          content: model?.supplierTaxCode,
        },
        {
          label: "AC.txt_representative",

          content: (
            <div>
              <span>{model?.supplierRepresentative}</span>
              {model?.isSupplierAuthorized && (
                <Tag
                  className={"m-l--2xs"}
                  size="sm"
                  value={translate("settlement.by_authorization")}
                  isShowDot={false}
                  isShowBorder={true}
                  color={"#42526E"}
                  backgroundColor={"#F4F5F7"}
                />
              )}
            </div>
          ),
        },
        {
          label: "AC.txt_position",
          content: model?.supplierPosition,
        },
        {
          label: "CT.create_contract.title.power_of_attorney",
          content: model?.supplierAuthorizationLetter,
        },
        {
          label: "CPU.txt_contact_person",
          content: model?.contactPerson,
        },
        {
          label: "settlement.email_txt",
          content: model?.supplierEmail,
        },
        {
          label: "CM.phone_number",
          content: model?.supplierPhone,
        },
      ],
    },
  ];

  return (
    <GeneralInformationViewLayout contentLeft={<ContentLeft />}>
      {blocks.map(({ title, items }, index) => (
        <BlockContainer key={index} title={translate(title)} className="fs-6">
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
