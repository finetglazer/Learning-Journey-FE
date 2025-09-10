import { Tooltip } from "antd";
import { VND_CURRENCY_UNIT } from "core/config/consts";
import { isEqual } from "lodash";
import { DEFAULT_PLACEHOLDER } from "pages/BudgetPage/BudgetSettlementCreate/constant";
import {
  combineText,
  ContractAnnexStatus,
} from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { WarningCircleIcon } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/GeneralInformation";
import { Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useContractPrincipleAppendixViewContext } from "../../../../context";
import styles from "./styles.module.scss";
import { formatDate } from "core/helpers/date-time";

interface SectionProps {
  title: string;
  isAdjusted?: boolean;
}

const BuyerSection = ({ title, isAdjusted }: SectionProps) => {
  const { model } = useContractPrincipleAppendixViewContext();
  const [translate] = useTranslation();

  const makeTitle = () => {
    return (
      <div className={styles["section-title-wrapper"]}>
        <div className={styles["title"]}>{title}</div>
        {isAdjusted ? (
          <Tooltip placement="topLeft" title={translate("CPA.txt_adjusted")}>
            <div className={"cursor-pointer"}>
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
  const { model } = useContractPrincipleAppendixViewContext();
  const [translate] = useTranslation();

  const isInternalBanking = () => {
    if (
      isEqual(
        model?.supplierInfo?.supplierPayment?.currency?.code,
        VND_CURRENCY_UNIT
      )
    ) {
      return translate("CPA.txt_internal_banking");
    }

    return undefined;
  };

  const makeTitle = () => {
    return (
      <div className={styles["section-title-wrapper"]}>
        <div className={styles["title"]}>{title}</div>
        {isAdjusted ? (
          <Tooltip placement="topLeft" title={translate("CPA.txt_adjusted")}>
            <div className={"cursor-pointer"}>
              <WarningCircleIcon />
            </div>
          </Tooltip>
        ) : null}
      </div>
    );
  };

  const makeRow = (labelKey: string, value: string, tagValue?: string) => {
    return (
      <div className={styles["row-wrapper"]}>
        <div className={styles["label"]}>{translate(labelKey)}</div>
        <div className={styles["value"]}>
          <div>{value || "---"}</div>
          {tagValue ? (
            <Tag value={tagValue} isShowDot={false} isShowBorder size="sm" />
          ) : null}
        </div>
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
          model?.supplierInfo?.supplierAgentPerson,
          model?.supplierInfo?.isByProcuration
            ? translate("CA.txt_seller_authorized")
            : ""
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
          model?.supplierInfo?.supplierPayment?.bankAccountNo,
          isInternalBanking()
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
  const { model } = useContractPrincipleAppendixViewContext();
  const [translate] = useTranslation();

  const makeTitle = () => {
    return (
      <div className={styles["section-title-wrapper"]}>
        <div className={styles["title"]}>{title}</div>
        {isAdjusted ? (
          <Tooltip placement="topLeft" title={translate("CPA.txt_adjusted")}>
            <div className={"cursor-pointer"}>
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

  const makeContent = () => {
    return (
      <>
        {makeRow("CA.txt_annex_no", model?.contractAppendixNo)}
        {makeRow("CA.txt_annex_appendix_date", formatDate(model?.appendixDate))}
        {makeRow(
          "CA.txt_annex_adjustment_type",
          model?.adjustmentType === 1
            ? translate("CPA.txt_annex_type_1")
            : translate("CPA.txt_annex_type_0")
        )}
        {makeRow("CA.txt_annex_name", model?.name)}
        {makeRow(
          "CA.txt_annex_create",
          combineText(
            model?.userCreatedInfo?.createFullname,
            model?.userCreatedInfo?.createUser
          )
        )}

        {makeRow(
          "CA.txt_annex_position",
          model?.userCreatedInfo?.createPosition
        )}
        {makeRow(
          "CA.txt_annex_unit_create",
          model?.userCreatedInfo?.createOrganization
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
  const { model } = useContractPrincipleAppendixViewContext();
  const [translate] = useTranslation();

  return (
    <div className={styles["services-information"]}>
      {/* Buyer information */}
      <div className={styles["content"]}>
        <AnnexSection
          title={translate("CPA.txt_annex_information")}
          isAdjusted={false}
        />
        <BuyerSection
          title={translate("CA.txt_buyer_used_information")}
          isAdjusted={model?.isAdjustedLegalInfo}
        />
        <SellerSection
          title={translate("CA.txt_seller_provide_services")}
          isAdjusted={model?.isAdjustedSupplierInfo}
        />
      </div>
    </div>
  );
};
