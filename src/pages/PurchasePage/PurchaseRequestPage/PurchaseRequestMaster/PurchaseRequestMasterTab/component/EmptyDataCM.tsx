import { IcPlusSVG } from "assets/icons";
import { EmptyData } from "components";
import { FC, useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  PurchaseRequestMaster,
  PurchaseRequestMasterContext,
} from "../../PurchaseRequestMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

type IProps = {
  icon?: string;
  isFilter?: boolean;
  height?: number;
  message?: string;
};

const EmptyDataCM: FC<IProps> = ({ icon, isFilter, height = 250, message }) => {
  const { modelFilter, handlePressAdd, setIsShowModalPurchaseRequest } =
    useContext<PurchaseRequestMaster>(PurchaseRequestMasterContext);
  const { t } = useTranslation();

  const onPressAdd = () => {
    if (modelFilter?.tabKey == 1) {
      setIsShowModalPurchaseRequest(true);
    } else {
      handlePressAdd();
    }
  };
  const { validAction } =
    authorizationService.useAuthorizedAction("PURCHASE_REQUEST");

  return (
    <EmptyData
      message={message ? message : t("PR.txt_content_no_data")}
      height={height}
      icon={icon}
    >
      {!isFilter && (
        <div className="PurchaseRequest__ctn__button--nodata ">
          {validAction("CREATE") && modelFilter?.tabKey !== 1 && (
            <Button
              icon={<img src={IcPlusSVG} width={16} alt="img" />}
              iconPlace="left"
              type="secondary"
              onClick={onPressAdd}
            >
              {modelFilter?.tabKey == 1
                ? t("PR.btn_create_purchase_adjust")
                : t("PR.btn_create_purchase")}
            </Button>
          )}
          {modelFilter?.tabKey === 1 && (
            <Button
              icon={<img src={IcPlusSVG} width={16} alt="img" />}
              iconPlace="left"
              type="secondary"
              onClick={onPressAdd}
            >
              {t("PR.btn_create_purchase_adjust")}
            </Button>
          )}

          {/* <Button
            icon={<img src={IcPlusSVG} width={16} alt="img" />}
            iconPlace="left"
            type="secondary"
            onClick={() => handlePressAdd(BudgetAddType.Adjust)}
          >
            {t("BG.btn_create_adjust")}
          </Button>
          <Button
            icon={<img src={IcPlusSVG} width={16} alt="img" />}
            iconPlace="left"
            type="secondary"
            onClick={() => handlePressAdd(BudgetAddType.Settlement)}
          >
            {t("BG.btn_create_finalization")}
          </Button> */}
        </div>
      )}
    </EmptyData>
  );
};

export default EmptyDataCM;
