import { IcPlusSVG } from "assets/icons";
import { EmptyData } from "components";
import { FC, useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  BudgetAddType,
  BudgetMaster,
  BudgetMasterContext,
} from "../../BudgetMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

type IProps = {
  icon?: string;
  isFilter?: boolean;
  height?: number;
  message?: string;
};

const EmptyDataCM: FC<IProps> = ({ icon, isFilter, height = 250, message }) => {
  const { handlePressAdd } = useContext<BudgetMaster>(BudgetMasterContext);
  const { t } = useTranslation();

  const { validAction: validActionRequest } =
    authorizationService.useAuthorizedAction("PKG_REQUEST");

  const { validAction: validActionAdjust } =
    authorizationService.useAuthorizedAction("PKG_ADJUST");

  const { validAction: validActionSettlement } =
    authorizationService.useAuthorizedAction("PKG_SETTLEMENT");

  return (
    <EmptyData
      message={message ? message : t("BG.txt_content_no_data")}
      height={height}
      icon={icon}
    >
      {!isFilter &&
        (validActionRequest("CREATE") ||
          validActionAdjust("CREATE") ||
          validActionSettlement("CREATE")) && (
          <div className="ctn__button__nodata">
            {validActionRequest("CREATE") ? (
              <Button
                icon={<img src={IcPlusSVG} width={16} alt="img" />}
                iconPlace="left"
                type="secondary"
                onClick={() => handlePressAdd(BudgetAddType.Request)}
              >
                {t("BG.btn_create_budget")}
              </Button>
            ) : null}
            {validActionAdjust("CREATE") ? (
              <Button
                icon={<img src={IcPlusSVG} width={16} alt="img" />}
                iconPlace="left"
                type="secondary"
                onClick={() => handlePressAdd(BudgetAddType.Adjust)}
              >
                {t("BG.btn_create_adjust")}
              </Button>
            ) : null}

            {validActionSettlement("CREATE") ? (
              <Button
                icon={<img src={IcPlusSVG} width={16} alt="img" />}
                iconPlace="left"
                type="secondary"
                onClick={() => handlePressAdd(BudgetAddType.Settlement)}
              >
                {t("BG.btn_create_finalization")}
              </Button>
            ) : null}
          </div>
        )}
    </EmptyData>
  );
};

export default EmptyDataCM;
