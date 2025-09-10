import { Tooltip } from "antd";
import { TextWrapper } from "components";
import { isEqual } from "lodash";
import { DEFAULT_PLACEHOLDER } from "pages/BudgetPage/BudgetSettlementCreate/constant";
import {
  combineText,
  ContractAnnexStatus,
} from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { WarningCircleIcon } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/GeneralInformation";
import { useTranslation } from "react-i18next";
import { useContractAnnexViewContext } from "../../../../context";
import styles from "./styles.module.scss";

interface SectionProps {
  title: string;
  isAdjusted?: boolean;
}

const BuyerSection = ({ title, isAdjusted }: SectionProps) => {
  const { model } = useContractAnnexViewContext();
  const [translate] = useTranslation();

  const makeTitle = () => {
    return (
      <div className={styles["section-title-wrapper"]}>
        <div className={styles["title"]}>{title}</div>
        {isAdjusted ? (
          <Tooltip title={translate("CA.txt_adjusted")} placement="topLeft">
            <div className={styles["size-24"]}>
              <WarningCircleIcon />
            </div>
          </Tooltip>
        ) : null}
      </div>
    );
  };

  const makeRow = (labelKey: string, value: string) => {
    return (
      <div className={styles["row-wrapper"]}>
        <div className={styles["label"]}>{translate(labelKey)}</div>
        <div className={styles["value"]}>{value}</div>
      </div>
    );
  };

  const isApproved = isEqual(model?.status, ContractAnnexStatus.APPROVED);

  const makeContent = () => {
    return (
      <>
        {makeRow("CA.txt_buyer_name", model?.legalInfo?.name)}
        {makeRow("CA.txt_buyer_tax_code", model?.legalInfo?.taxCode)}
        {makeRow("CA.txt_buyer_address", model?.legalInfo?.address)}
        {makeRow(
          "CA.txt_buyer_representative",
          isApproved ? model?.legalInfo?.approverName : DEFAULT_PLACEHOLDER
        )}
        {makeRow(
          "CA.txt_buyer_position",
          isApproved ? model?.legalInfo?.approverPosition : DEFAULT_PLACEHOLDER
        )}
      </>
    );
  };

  return (
    <div className={styles["section-wrapper"]}>
      {/* Title */}
      {makeTitle()}
      {makeContent()}
    </div>
  );
};

const SellerSection = ({ title, isAdjusted }: SectionProps) => {
  const { model } = useContractAnnexViewContext();
  const [translate] = useTranslation();

  const makeTitle = () => {
    return (
      <div className={styles["section-title-wrapper"]}>
        <div className={styles["title"]}>{title}</div>
        {isAdjusted ? (
          <Tooltip title={translate("CA.txt_adjusted")} placement="topLeft">
            <div className={styles["size-24"]}>
              <WarningCircleIcon />
            </div>
          </Tooltip>
        ) : null}
      </div>
    );
  };

  const makeRow = (labelKey: string, value: string) => {
    return (
      <div className={styles["row-wrapper"]}>
        <div className={styles["label"]}>{translate(labelKey)}</div>
        <TextWrapper className={styles["value"]}>{value || "---"}</TextWrapper>
      </div>
    );
  };

  const makeContent = () => {
    return (
      <>
        {makeRow("CA.list.title.supplier", model?.supplierInfo?.supplierName)}
        {makeRow(
          "CA.txt_seller_tax_code",
          model?.supplierInfo?.supplierTaxCode
        )}
        {makeRow("CA.txt_seller_address", model?.supplierInfo?.supplierAddress)}
        {makeRow(
          "CA.txt_seller_representative",
          model?.supplierInfo?.supplierAgentPerson
        )}
        {makeRow(
          "CA.txt_seller_position",

          model?.supplierInfo?.supplierAgentPersonPosition
        )}
        {makeRow(
          "CA.txt_seller_authorization_document",
          model?.supplierInfo?.supplierProcuration
        )}
        {makeRow(
          "CA.txt_seller_contact_person",
          model?.supplierInfo?.supplierContactPerson
        )}
        {makeRow("CA.txt_seller_email", model?.supplierInfo?.supplierEmail)}
        {makeRow(
          "CA.txt_seller_phone_number",
          model?.supplierInfo?.supplierPhone
        )}
        {makeRow(
          "CA.txt_seller_bank_account_number",
          model?.supplierInfo?.supplierPayment?.bankAccountNo
        )}
        {makeRow(
          "CA.txt_seller_account_name",
          model?.supplierInfo?.supplierPayment?.bankAccountName
        )}
        {makeRow(
          "CA.txt_seller_bank_name",
          model?.supplierInfo?.supplierPayment?.bank?.name
        )}
      </>
    );
  };

  return (
    <div className={styles["section-wrapper"]}>
      {/* Title */}
      {makeTitle()}
      {makeContent()}
    </div>
  );
};

const AnnexSection = ({ title, isAdjusted }: SectionProps) => {
  const { model } = useContractAnnexViewContext();
  const [translate] = useTranslation();

  const makeTitle = () => {
    return (
      <div className={styles["section-title-wrapper"]}>
        <div className={styles["title"]}>{title}</div>
        {isAdjusted ? (
          <Tooltip title={translate("CA.txt_adjusted")} placement="topLeft">
            <div className={styles["size-24"]}>
              <WarningCircleIcon />
            </div>
          </Tooltip>
        ) : null}
      </div>
    );
  };

  const makeRow = (labelKey: string, value: string) => {
    return (
      <div className={styles["row-wrapper"]}>
        <div className={styles["label"]}>{translate(labelKey)}</div>
        <TextWrapper className={styles["value"]}>{value}</TextWrapper>
      </div>
    );
  };

  const makeContent = () => {
    return (
      <>
        {makeRow("CA.txt_annex_no", model?.contractAppendixNo)}
        {makeRow("CA.txt_annex_name", model?.name)}
        {makeRow(
          "CA.txt_annex_create",
          combineText(
            model?.userCreatedInfo?.createFullname,
            model?.userCreatedInfo?.createUser
          )
        )}
        {makeRow(
          "CA.txt_annex_unit_create",
          model?.userCreatedInfo?.createOrganization
        )}
        {makeRow(
          "CA.txt_annex_position",
          model?.userCreatedInfo?.createPosition
        )}
      </>
    );
  };

  return (
    <div className={styles["section-wrapper"]}>
      {/* Title */}
      {makeTitle()}
      {makeContent()}
    </div>
  );
};

export const ServicesInformation = () => {
  const { model } = useContractAnnexViewContext();
  const [translate] = useTranslation();

  return (
    <div className={styles["services-information"]}>
      {/* Buyer information */}
      <div className={styles["content"]}>
        <BuyerSection
          title={translate("CA.txt_buyer_used_information")}
          isAdjusted={model?.isAdjustedLegalInfo}
        />
        <SellerSection
          title={translate("CA.txt_seller_provide_services")}
          isAdjusted={model?.isAdjustedSupplierInfo}
        />
        <AnnexSection title={translate("CA.txt_annex")} isAdjusted={false} />
      </div>
    </div>
  );
};
