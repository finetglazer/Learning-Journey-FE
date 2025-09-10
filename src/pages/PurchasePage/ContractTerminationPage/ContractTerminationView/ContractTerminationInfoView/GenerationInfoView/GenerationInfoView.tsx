/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  BlockContainer,
  Ticket,
} from "components/GeneralInformationView/GeneralInformationView";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { OneLineText, Tag } from "react-components-design-system";
import "./GenerationInfoView.scss";
import IcUser from "assets/icons/ic_user.svg";
import ItemBox from "./ItemContent";
import dayjs from "dayjs";
import { uniqueId } from "lodash";
import { ContractTerminationContextModel } from "models/ContractTermination";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";
import { Col, Row } from "antd";

const HeadInfo = () => {
  const [translate] = useTranslation();
  const { model } = useContext<ContractTerminationContextModel>(
    ContractTerminationDetailHookContext
  );
  const contractData = model?.contract;

  const getContractTitle = () => {
    const contractRequestType = model?.contract?.contractRequestType;

    if (contractRequestType === 0) {
      return "contractTermination.contract_code";
    }

    return "contractTermination.title_order_code";
  };

  return (
    <div className="head-infor-block">
      <BlockContainer title={""} className="fs-6">
        <div className="flex between g-8 item-box mb-16">
          <Row gutter={16} className="w100">
            <Col span={16}>
              <div className="flex start g-8 large code-box">
                <Ticket
                  code={contractData?.contractNo}
                  link={`${CONTRACT_ROUTE_VIEW}/${contractData?.id}`}
                  description={""}
                  note={""}
                  ticketClassName="code"
                />
                <div className="text large name-box">
                  <OneLineText
                    className="line-height-22"
                    value={contractData?.name}
                  />
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="flex g-4 total-box">
                <div className="text">
                  {translate("contractTermination.total_value")}
                </div>
                <div className="large total">
                  {formatNumber(contractData?.total)} {contractData?.currency}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="flex start g-8 item-box bottom">
          <div>
            <img src={IcUser} alt="user" />
          </div>
          <div className="text bold">
            {contractData?.managerEmail} - {contractData?.managerName}
          </div>
          <div className="dot" />
          <ItemBox
            label={translate(getContractTitle())}
            content={contractData?.code}
          />
          <div className="dot" />
          <ItemBox
            label={`${translate("contractTermination.effective_period")}:`}
            content={`${dayjs(contractData?.effectiveDate).format(
              "DD/MM/YYYY"
            )} - ${dayjs(contractData?.endDate).format("DD/MM/YYYY")}`}
          />
        </div>
      </BlockContainer>
    </div>
  );
};

export default function GenerationInfoView() {
  const [translate] = useTranslation();
  const { model } = useContext<ContractTerminationContextModel>(
    ContractTerminationDetailHookContext
  );

  const blocks = [
    {
      title: translate("contractTermination.general_infor_title"),
      items: [
        {
          label: translate("contractTermination.liquidation_description"),
          content: (
            <div className="text-break break-all text-start">
              {model?.description}
            </div>
          ),
        },
        {
          label: translate("contractTermination.effective_liquidation_date"),
          content: `${formatDate(
            model?.effectiveDate,
            STANDARD_DATE_FORMAT_SLASH
          )}`,
        },
        {
          label: "settlement.filter_creator",
          content: (
            <div className="text-break break-all text-start">
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
      ],
    },
    {
      title: "contractTermination.legal_entity_title",
      items: [
        {
          label: "AC.txt_buyer_unit_name",
          content: model?.legalEntity?.name,
        },
        {
          label: "PL.purchasing_plan_supplier_tax_code",
          content: model?.legalEntity?.taxCode,
        },
        {
          label: "CT.address",
          content: model?.legalEntity?.address,
        },
        {
          label: "AC.txt_representative",
          content: model?.legalEntity?.personAgent,
        },
        {
          label: "AC.txt_position",
          content: model?.legalEntity?.position,
        },
      ],
    },
    {
      title: "contractTermination.seller_service_provider_txt",
      items: [
        {
          label: "AC.txt_supplier",
          content: model?.supplierName,
        },
        {
          label: "AC.txt_tax_id",
          content: model?.supplierTaxCode,
        },
        {
          label: "AC.txt_address",
          content: model?.supplierAddress,
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
        ...(model?.isSupplierAuthorized
          ? [
              {
                label: "CT.create_contract.title.power_of_attorney",
                content: model?.supplierAuthorizationLetter,
              },
            ]
          : []),
        {
          label: "CPU.txt_contact_person",
          content: model?.supplierContact,
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
    <div className="generation-infor-container">
      <HeadInfo />
      <Row className="mg-0 g-16 flex-1">
        {blocks.map(({ title, items }, index) => (
          <Col span={8} key={index} className="block">
            <div className="title">{translate(title)}</div>
            {items.map(({ label, content }) => (
              <ItemBox
                key={uniqueId()}
                label={translate(label)}
                content={content}
                className="custom align-start"
              />
            ))}
          </Col>
        ))}
      </Row>
    </div>
  );
}
