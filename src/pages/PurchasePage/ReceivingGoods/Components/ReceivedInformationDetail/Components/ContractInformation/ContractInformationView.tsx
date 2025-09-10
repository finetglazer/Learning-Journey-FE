import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import styles from "./ContractInformation.module.scss";
import { useTranslation } from "react-i18next";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { combineNameAndCode } from "pages/PurchasePage/constants";
import { OneLineText } from "react-components-design-system";
import { Tooltip } from "antd";

type ContractDetailRowProps = {
  title: string;
  value: string;
};

const ContractDetailRow = ({ title, value }: ContractDetailRowProps) => (
  <div className={styles["contract-main__col"]}>
    <span className={styles["contract-content__title"]}>{title}</span>
    <p className={styles["contract-content__value"]}>{value}</p>
  </div>
);

const ContractInformationView = () => {
  const { model, handleViewContract } = useReceivingGoodsDetailContext();
  const [translate] = useTranslation();

  const contractInfo = model?.contractInfo;
  const managerOrgDetail = contractInfo?.managerOrganizationDetail;

  const contractFiled = [
    {
      title: translate("RG.txt_actual_effective_date"),
      value: formatDate(
        contractInfo?.effectiveDate,
        STANDARD_DATE_FORMAT_SLASH
      ),
    },
    {
      title: translate("RG.txt_end_date"),
      value: formatDate(contractInfo?.endDate, STANDARD_DATE_FORMAT_SLASH),
    },
    {
      title: translate("RG.txt_managing_unit"),
      value: contractInfo?.managerOrganization?.name,
    },
    {
      title: translate("RG.txt_branch_management"),
      value: combineNameAndCode(
        managerOrgDetail?.businessBranch?.code,
        managerOrgDetail?.businessBranch?.name
      ),
    },
    {
      title: translate("RG.txt_bank_unit_management"),
      value: combineNameAndCode(
        managerOrgDetail?.businessUnit?.code,
        managerOrgDetail?.businessUnit?.name
      ),
    },
  ];

  return (
    <div className={styles["contract-container"]}>
      <span className={styles["contract-title"]}>
        {translate("RG.txt_contract_info")}
      </span>
      <div className={styles["contract-main"]}>
        <div className={styles["contract-main__header"]}>
          <div
            className={styles["contract-code"]}
            onClick={contractInfo?.code ? handleViewContract : undefined}
          >
            {contractInfo?.code}
          </div>
          <Tooltip title={contractInfo?.contractNo}>
            <span className={styles["contract-information"]}>
              {contractInfo?.contractNo}
            </span>
          </Tooltip>
          <OneLineText
            value={contractInfo?.name}
            className={styles["contract-description"]}
          />
        </div>
        <div className={styles["contract-main__col"]}>
          <span className={styles["contract-content__title"]}>
            {translate("RG.txt_manager")}
          </span>
          <p className={styles["contract-content__value"]}>
            <span className={styles["contract-value__one"]}>
              {model?.contractInfo?.managerEmail}
            </span>
            <span className={styles["contract-value__two"]}>
              {model?.contractInfo?.managerName}
            </span>
          </p>
        </div>
        {contractFiled.map((field, index) => (
          <ContractDetailRow key={index} {...field} />
        ))}
      </div>
    </div>
  );
};

export default ContractInformationView;
