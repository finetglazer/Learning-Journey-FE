import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { uniqueId } from "lodash";
import { combineNameAndCode } from "pages/PurchasePage/constants";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ItemTable } from "../../../ItemTable/ItemTable";
import styles from "../../ReceivedInformationDetail.module.scss";

export const ContractInformation = () => {
  const { model, handleViewContract } = useReceivingGoodsDetailContext();
  const [translate] = useTranslation();

  const columnsTop = [
    {
      title: translate("RG.txt_contract_po_code"),
      content: (
        <div onClick={handleViewContract}>
          <OneLineText
            className={styles["text-hyperlink"]}
            value={model?.contractInfo?.code}
          />
        </div>
      ),
    },
    {
      title: translate("RG.txt_contract_po_number"),
      content: <OneLineText value={model?.contractInfo?.contractNo} />,
    },
    {
      title: translate("RG.txt_contract_po_name"),
      content: <OneLineText value={model?.contractInfo?.name} />,
    },
  ];

  const columnsCenter = [
    {
      title: translate("RG.txt_manager"),
      content: (
        <OneLineText
          value={`${model?.contractInfo?.managerEmail} - ${model?.contractInfo?.managerName}`}
        />
      ),
    },
    {
      title: translate("RG.txt_actual_effective_date"),
      content: (
        <OneLineText
          value={formatDate(
            model?.contractInfo?.effectiveDate,
            STANDARD_DATE_FORMAT_SLASH
          )}
        />
      ),
    },
    {
      title: translate("RG.txt_end_date"),
      content: (
        <OneLineText
          value={formatDate(
            model?.contractInfo?.endDate,
            STANDARD_DATE_FORMAT_SLASH
          )}
        />
      ),
    },
  ];

  const columnsBottom = [
    {
      title: translate("RG.txt_managing_unit"),
      content: (
        <OneLineText value={model?.contractInfo?.managerOrganization?.name} />
      ),
    },
    {
      title: translate("RG.txt_branch_management"),
      content: (
        <OneLineText
          value={combineNameAndCode(
            model?.contractInfo?.managerOrganizationDetail?.businessBranch
              ?.code,
            model?.contractInfo?.managerOrganizationDetail?.businessBranch?.name
          )}
        />
      ),
    },
    {
      title: translate("RG.txt_bank_unit_management"),
      content: (
        <OneLineText
          value={combineNameAndCode(
            model?.contractInfo?.managerOrganizationDetail?.businessUnit?.code,
            model?.contractInfo?.managerOrganizationDetail?.businessUnit?.name
          )}
        />
      ),
    },
  ];

  return (
    <table className={styles["table"]}>
      <tbody>
        <tr className={styles["bg-grey"]}>
          {columnsTop.map((props) => (
            <ItemTable key={uniqueId()} {...props} />
          ))}
        </tr>
        <tr>
          {columnsCenter.map((props) => (
            <ItemTable key={uniqueId()} {...props} />
          ))}
        </tr>
        <tr>
          {columnsBottom.map((props) => (
            <ItemTable key={uniqueId()} {...props} />
          ))}
        </tr>
      </tbody>
    </table>
  );
};
