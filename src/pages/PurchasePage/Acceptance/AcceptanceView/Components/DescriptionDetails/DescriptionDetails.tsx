import { ItemTableView } from "components/ItemTableView/ItemTableView";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import {
  formatDate,
  formatDateTimeToVietnamTimezone,
} from "core/helpers/date-time";
import { uniqueId } from "lodash";
import { useAcceptanceInformationContext } from "pages/PurchasePage/Acceptance/AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "rtk/useRedux";
import styles from "../../../Components/Acceptance.module.scss";

export const DescriptionDetails = () => {
  const [translate] = useTranslation();
  const { model } = useAcceptanceInformationContext();
  const profile = useAppSelector((state) => state.profile);

  const columnsCenter = [
    {
      title: translate("AC.txt_create_date"),
      content: formatDate(model?.createdDate, STANDARD_DATE_FORMAT_SLASH),
    },
    {
      title: translate("AC.txt_creator"),
      content: `${model?.createUser} - ${model?.createUserName}`,
    },
    {
      title: translate("AC.txt_title"),
      content: model?.createUserPosition,
    },
  ];

  const columnsBottom = [
    {
      title: translate("AC.txt_creator_unit"),
      content: model?.createUserOrganizationName,
    },
    {
      title: translate("AC.txt_branch_creator"),
      content: `${profile?.businessBranch?.code} - ${profile?.businessBranch?.name}`,
    },
    {
      title: translate("AC.txt_headquarters_creator"),
      content: `${profile?.businessUnit?.code} - ${profile?.businessUnit?.name}`,
    },
  ];

  return (
    <table className={styles["table"]}>
      <tbody>
        <tr className={styles["bg-grey"]}>
          <ItemTableView
            title={translate("AC.txt_acceptance_description")}
            content={model?.description}
            colSpan={numberConstants.TWO}
          />
          <ItemTableView
            title={translate("AC.txt_commissioning_date")}
            content={formatDateTimeToVietnamTimezone(
              model?.applyDate,
              STANDARD_DATE_FORMAT_SLASH
            )}
            colSpan={numberConstants.ONE}
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
