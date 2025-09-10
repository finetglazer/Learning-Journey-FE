import { isEmpty, isEqual } from "lodash";
import { WarningCircleIcon } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/GeneralInformation";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import React, { useContext } from "react";
import { ContractAdjustmentContext } from "../../../ContractAdjustmentDetail/ContractAdjustmentDetailHook";
import { Tag } from "react-components-design-system";
import { numberConstants } from "core/config/consts";

interface SectionProps {
  title: string;
  isAdjusted?: boolean;
}

const GenerationSection = ({ title, isAdjusted }: SectionProps) => {
  const { model } = useContext(ContractAdjustmentContext);
  const { user } = model?.contract || {};
  const [translate] = useTranslation();

  const makeTitle = () => {
    return (
      <div className={styles["section-title-wrapper"]}>
        <div className={styles["title"]}>{title}</div>
        {isAdjusted ? (
          <div className={styles["size-24"]}>
            <WarningCircleIcon />
          </div>
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

  const makeContent = () => {
    return (
      <>
        {makeRow("contractAdjustment.description_contract", model?.desciption)}
        {makeRow("settlement.table_creator", user?.createUser?.name)}
        {makeRow("CA.txt_annex_unit_create", user?.organizationName)}
        {makeRow("CA.txt_annex_position", user?.positionName)}
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
  const { model } = useContext(ContractAdjustmentContext);
  const { contractSupplier } = model?.contract || {};
  const [translate] = useTranslation();

  const makeTitle = () => {
    return (
      <div className={styles["section-title-wrapper"]}>
        <div className={styles["title"]}>{title}</div>
        {isAdjusted ? (
          <div className={styles["size-24"]}>
            <WarningCircleIcon />
          </div>
        ) : null}
      </div>
    );
  };

  const makeRow = (
    labelKey: string,
    value: string,
    textTag?: string | null
  ) => {
    return (
      <div className={styles["row-wrapper"]}>
        <div className={styles["label"]}>{translate(labelKey)}</div>
        <div className={styles["value"]}>
          <span>{value || "---"}</span>
          {!isEmpty(textTag) && !isEmpty(value) && (
            <div className="d-flex align-center mt-1">
              <Tag
                size="sm"
                value={translate(textTag)}
                isShowDot={false}
                isShowBorder={true}
                backgroundColor={"#F4F5F7"}
                color={"#5E6C84"}
                colorBorder={"#B3BAC5"}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const makeContent = () => {
    return (
      <>
        {makeRow("CA.list.title.supplier", contractSupplier?.supplierName)}
        {makeRow("CA.txt_seller_tax_code", contractSupplier?.taxCode)}
        {makeRow("CA.txt_seller_address", contractSupplier?.address)}
        {makeRow("CA.txt_seller_representative", contractSupplier?.agentPerson)}
        {makeRow(
          "CA.txt_seller_position",
          contractSupplier?.agentPersonPosition
        )}
        {model?.contract?.isEmpower &&
          makeRow(
            "CA.txt_seller_authorization_document",
            contractSupplier?.procuration
          )}
        {makeRow(
          "CA.txt_seller_contact_person",
          contractSupplier?.contactPerson
        )}
        {makeRow("CA.txt_seller_email", contractSupplier?.email)}
        {makeRow("CA.txt_seller_phone_number", contractSupplier?.phone)}
        {makeRow(
          "CA.txt_seller_bank_account_number",
          contractSupplier?.supplierPayment?.bankAccountNo,
          contractSupplier?.supplierPayment?.isIsDomestic
            ? "CA.txt_seller_domestic_transfer"
            : "contractAdjustment.txt_bank_transfer"
        )}
        {makeRow(
          "CA.txt_seller_account_name",
          contractSupplier?.supplierPayment?.bankAccountName
        )}
        {makeRow(
          "CA.txt_seller_bank_name",
          contractSupplier?.supplierPayment?.bank?.name
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

const BuySection = ({ title, isAdjusted }: SectionProps) => {
  const { model } = useContext(ContractAdjustmentContext);
  const { legalEntity } = model?.contract || {};

  const [translate] = useTranslation();

  const makeTitle = () => {
    return (
      <div className={styles["section-title-wrapper"]}>
        <div className={styles["title"]}>{title}</div>
        {isAdjusted ? (
          <div className={styles["size-24"]}>
            <WarningCircleIcon />
          </div>
        ) : null}
      </div>
    );
  };

  const makeRow = (labelKey: string, value: string) => {
    return (
      <div className={styles["row-wrapper"]}>
        <div className={styles["label"]}>{translate(labelKey)}</div>
        <div className={styles["value"]}>{value || "---"}</div>
      </div>
    );
  };

  const makeContent = () => {
    return (
      <>
        {makeRow("CA.txt_buyer_name", legalEntity?.name)}
        {makeRow("PL.purchasing_plan_supplier_tax_code", legalEntity?.taxCode)}
        {makeRow("AC.txt_address", legalEntity?.address)}
        {makeRow(
          "AC.txt_representative",
          !isEqual(model?.status, numberConstants.TWO)
            ? "---"
            : isEmpty(legalEntity?.personAgent)
            ? "---"
            : legalEntity?.personAgent
        )}
        {makeRow(
          "AC.txt_position",
          !isEqual(model?.status, numberConstants.TWO)
            ? "---"
            : isEmpty(legalEntity?.position)
            ? "---"
            : legalEntity?.position
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

export const ServicesInformationView = () => {
  const { model } = useContext(ContractAdjustmentContext);
  const [translate] = useTranslation();

  return (
    <div className={styles["services-information"]}>
      {/* Buyer information */}
      <div className={styles["content"]}>
        <GenerationSection
          title={translate("PP.general_information")}
          isAdjusted={model?.contract?.isChangeGeneral}
        />
        <BuySection
          title={translate("settlement.buyer_service_user_txt")}
          isAdjusted={false}
        />
        <SellerSection
          title={translate("CA.txt_seller_provide_services")}
          isAdjusted={false}
        />
      </div>
    </div>
  );
};
