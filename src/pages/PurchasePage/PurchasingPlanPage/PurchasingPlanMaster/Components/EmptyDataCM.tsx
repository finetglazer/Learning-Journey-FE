import { EmptyData } from "components";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react-components-design-system";
import {
  PurchasingPlanMaster,
  PurchasingPlanMasterContext,
} from "../PurchasingPlanMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

type IProps = {
  icon?: string;
  isFilter?: boolean;
  height?: number;
  message?: string;
};

const EmptyDataCM: FC<IProps> = ({ icon, isFilter, height = 250, message }) => {
  const { t } = useTranslation();
  const appUserMaster = useContext<PurchasingPlanMaster>(
    PurchasingPlanMasterContext
  );
  const { handleModal } = appUserMaster;
  const { validAction } =
    authorizationService.useAuthorizedAction("PURCHASE_PLAN");

  return (
    <EmptyData
      message={message ? message : t("PL.txt_content_no_data")}
      height={height}
      icon={icon}
    >
      {!isFilter && validAction("CREATE") && (
        <Button onClick={() => handleModal()} type="primary" size="lg">
          {t("CM.btn_add")}
        </Button>
      )}
    </EmptyData>
  );
};

export default EmptyDataCM;
