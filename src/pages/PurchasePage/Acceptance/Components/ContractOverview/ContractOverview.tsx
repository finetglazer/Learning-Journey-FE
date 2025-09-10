import { ItemTableView } from "components/ItemTableView/ItemTableView";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { toFixedByCurrency } from "core/helpers/calculator";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { uniqueId } from "lodash";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useAcceptanceInformationContext } from "../../AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";
import styles from "../Acceptance.module.scss";

export const ContractOverview = () => {
  const [translate] = useTranslation();
  const { model } = useAcceptanceInformationContext();
  const currency = model?.currency;
  const totalAmount = toFixedByCurrency(model?.totalAmount, currency);
  const { contractId } = useParams<{
    contractId: string | undefined;
    acceptanceId: string | undefined;
  }>();

  const columnsCenter = [
    {
      title: translate("AC.txt_contract_number"),
      content: (
        <Link
          to={`${CONTRACT_ROUTE_VIEW}/${
            contractId || model?.contractId || model?.id
          }`}
          className="hyperlink"
          target="_blank"
        >
          {model?.contractNo}
        </Link>
      ),
    },
    {
      title: translate("AC.txt_contract_id"),
      content: model?.contractCode || model?.code,
    },
    {
      title: translate("AC.txt_contract_type"),
      content: <OneLineText value={model?.contractType} />,
    },
  ];

  const columnsBottom = [
    {
      title: translate("AC.txt_contract_total_value"),
      content: `${formatNumber(totalAmount)} ${currency}`,
    },
    {
      title: translate("AC.txt_contract_validity_period"),
      content: `${formatDate(
        model?.effectiveDate,
        STANDARD_DATE_FORMAT_SLASH
      )} - ${formatDate(model?.endDate, STANDARD_DATE_FORMAT_SLASH)}`,
    },
    {
      title: translate("AC.txt_contract_manager"),
      content: `${model?.managerEmail} - ${model?.managerName}`,
    },
  ];

  return (
    <table className={styles["table"]}>
      <tbody>
        <tr className={styles["bg-grey"]}>
          <ItemTableView
            title={translate("AC.txt_contract_name")}
            content={<OneLineText value={model?.contractName} />}
            colSpan={numberConstants.THREE}
          />
        </tr>
        <tr>
          {columnsCenter.map((props) => (
            <ItemTableView key={uniqueId()} {...props} />
          ))}
        </tr>
        <tr>
          {columnsBottom.map((props) => (
            <ItemTableView key={uniqueId()} {...props} />
          ))}
        </tr>
      </tbody>
    </table>
  );
};
