import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import { Row } from "antd";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import CardGrid from "../../CardGrid/CardGrid";
import { ContractDetailModel } from "models/Contract";
import { useContext } from "react";

import "./SellerInformation.scss";
import { useTranslation } from "react-i18next";
import { Tag } from "react-components-design-system";

const ContractViewSellerInformation = () => {
  const [translate] = useTranslation();
  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  return (
    <div className="contract_view_buyer_information">
      <CollapseCard title={translate("CT.create_contract.seller_information")}>
        <div className="contract_view_buyer_information-body">
          <Row>
            <CardGrid
              title={translate("CT.txt_supplier")}
              className="w-percentage-4 card-bg-gray card-rounded-top-left"
            >
              {model?.contractSupplier?.supplier?.name
                ? model.contractSupplier.supplier.name
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("PP.tax_code_title")}
              className="w-percentage-4 card-bg-gray card-top"
            >
              {model?.contractSupplier?.supplier?.taxCode
                ? model.contractSupplier.supplier.taxCode
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("PR.address")}
              className="w-percentage-4 card-bg-gray card-rounded-top-right card-right"
            >
              {model?.contractSupplier?.address
                ? model.contractSupplier.address
                : "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.create_contract.title.legal_person")}
              className="w-percentage-4"
            >
              <div className="d-flex align-center">
                {model?.contractSupplier?.agentPerson
                  ? model.contractSupplier.agentPerson
                  : "--"}
                {model?.isEmpower && (
                  <Tag
                    value={translate(
                      "CT.create_contract.title.follow_attorney"
                    )}
                    className="m-l--2xs"
                    size="sm"
                    isShowBorder
                    isShowDot={false}
                  />
                )}
              </div>
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.company_position")}
              className="w-percentage-4"
            >
              {model?.contractSupplier?.agentPersonPosition
                ? model.contractSupplier.agentPersonPosition
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.power_of_attorney")}
              className="w-percentage-4 card-right"
            >
              {model?.contractSupplier?.procuration
                ? model.contractSupplier.procuration
                : "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.create_contract.title.contact_person")}
              className="w-percentage-4 "
            >
              {model?.contractSupplier?.contactPerson
                ? model.contractSupplier.contactPerson
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.contact_email")}
              className="w-percentage-4 "
            >
              {model?.contractSupplier?.email
                ? model.contractSupplier.email
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("PR.telephone_number")}
              className="w-percentage-4 card-right"
            >
              {model?.contractSupplier?.phone
                ? model.contractSupplier.phone
                : "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.create_contract.title.account_bank")}
              className="w-percentage-4 card-bottom card-rounded-bottom-left"
            >
              <div className="d-flex align-center">
                {model?.contractSupplier?.supplierPayment
                  ? model.contractSupplier.supplierPayment.bankAccountNo
                  : "--"}
                {model?.supplierPayment?.bank?.isInternal && (
                  <Tag
                    value={translate(
                      "CT.create_contract.title.domestic_transfer"
                    )}
                    className="m-l--2xs"
                    size="sm"
                    isShowBorder
                    isShowDot={false}
                  />
                )}
              </div>
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.account_name")}
              className="w-percentage-4 card-bottom"
            >
              {model?.contractSupplier?.supplierPayment
                ? model.contractSupplier.supplierPayment.bankAccountName
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.bank_name")}
              className="w-percentage-4 card-rounded-bottom-right card-right card-bottom"
            >
              {model?.contractSupplier?.supplierPayment
                ? model.contractSupplier.supplierPayment?.bank?.name
                : "--"}
            </CardGrid>
          </Row>
        </div>
      </CollapseCard>
    </div>
  );
};

export default ContractViewSellerInformation;
