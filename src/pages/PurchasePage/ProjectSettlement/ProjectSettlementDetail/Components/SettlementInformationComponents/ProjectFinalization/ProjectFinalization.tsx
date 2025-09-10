import { ItemTableView } from "components/ItemTableView/ItemTableView";
import { PROPOSAL_DETAIL_ROUTE } from "config/route-const";
import { numberConstants } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { uniqueId } from "lodash";
import {
  FormItem,
  InputText,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "pages/PurchasePage/ProjectSettlement/Components/SettlementInformationComponents.module.scss";
import { useProjectSettlementDetailContext } from "../../../context";
import { Tooltip } from "antd";

function ProjectFinalization() {
  const [translate] = useTranslation();

  const { model, handleChangeSingleField } =
    useProjectSettlementDetailContext();
  const projectSettlementInfo = model?.projectSettlementInfo;

  const columnsCenter = [
    {
      title: translate("PS.txt_table_code_policy"),
      content: (
        <Link
          to={`${PROPOSAL_DETAIL_ROUTE}/${model?.originalPurchaseProposalId}`}
          className="hyperlink"
          target="_blank"
        >
          {projectSettlementInfo?.proposalCode}
        </Link>
      ),
    },
    {
      title: translate("PS.txt_table_name_policy"),
      content: <OneLineText value={projectSettlementInfo?.proposalName} />,
    },
    {
      title: translate("PS.txt_table_code_project"),
      content: (
        <Tooltip
          title={`${projectSettlementInfo?.projectCode} - ${projectSettlementInfo?.projectName}`}
        >
          {projectSettlementInfo?.projectCode}
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="d-flex flex-column gap-3">
      <table className={styles["table"]}>
        <tbody>
          <tr className={styles["bg-grey"]}>
            {columnsCenter.map((props) => (
              <ItemTableView key={uniqueId()} {...props} />
            ))}
          </tr>
          <tr>
            <ItemTableView
              title={translate("PS.txt_table_investment_location")}
              content={projectSettlementInfo?.investmentLocation}
              colSpan={numberConstants.THREE}
            />
          </tr>
        </tbody>
      </table>
      <div className={styles["form-container"]}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "investmentForm")}
        >
          <InputText
            label={translate("PS.txt_table_investment_form")}
            placeHolder={translate("PS.placeholder_table_investment_form")}
            value={model?.investmentForm}
            onChange={handleChangeSingleField({ fieldName: "investmentForm" })}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
    </div>
  );
}

export default ProjectFinalization;
