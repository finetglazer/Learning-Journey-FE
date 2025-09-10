import { ItemTableView } from "components/ItemTableView/ItemTableView";
import { EMPTY_STRING, numberConstants } from "core/config/consts";
import { uniqueId } from "lodash";
import { PurchaseOrganization } from "models/Acceptance/Acceptance";
import { LOCAL_STORAGE_ACCEPTANCE } from "pages/PurchasePage/constants";
import { useMemo } from "react";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../Acceptance.module.scss";
import { State } from "../constant";

interface PartnerInformationProps {
  isSeller?: boolean;
  data: PurchaseOrganization;
  checkStatus?: boolean;
}

export const PartnerInformation = ({
  isSeller,
  data,
  checkStatus,
}: PartnerInformationProps) => {
  const [translate] = useTranslation();

  const state = useMemo(() => {
    const state = localStorage.getItem(LOCAL_STORAGE_ACCEPTANCE) as string;

    return state as State["mode"];
  }, []);

  const shouldShowEmptyString = useMemo(() => {
    return ["CREATE", "EDIT"].includes(state);
  }, [state]);

  const personAgent = useMemo(() => {
    if (shouldShowEmptyString) {
      return EMPTY_STRING;
    }

    return checkStatus ? data?.personAgent : data?.personAgent || EMPTY_STRING;
  }, [checkStatus, data?.personAgent, shouldShowEmptyString]);

  const position = useMemo(() => {
    if (shouldShowEmptyString) {
      return EMPTY_STRING;
    }

    return checkStatus ? data?.position : data?.position || EMPTY_STRING;
  }, [checkStatus, data?.position, shouldShowEmptyString]);

  const columnsTop = [
    {
      title: translate(
        `AC.${isSeller ? "txt_supplier" : "txt_buyer_unit_name"}`
      ),
      content: data?.name,
    },
    {
      title: translate("AC.txt_tax_id"),
      content: data?.taxCode,
    },
    {
      title: translate("AC.txt_address"),
      content: <OneLineText value={data?.address} />,
    },
  ];

  const columnsBottom = [
    {
      title: translate("AC.txt_representative"),
      content: personAgent,
    },
    {
      title: translate("AC.txt_position"),
      content: position,
    },
  ];

  return (
    <table className={styles["table"]}>
      <tbody>
        <tr className={styles["bg-grey"]}>
          {columnsTop.map((props) => (
            <ItemTableView key={uniqueId()} {...props} />
          ))}
        </tr>
        <tr>
          {columnsBottom.map((props, index) => (
            <ItemTableView
              key={uniqueId()}
              {...props}
              colSpan={index ? numberConstants.TWO : undefined}
            />
          ))}
        </tr>
      </tbody>
    </table>
  );
};
