import { Add } from "@carbon/icons-react";
import { BasisIcon } from "assets/icons";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import "./PolicyInfo.scss";

const EmptyData = () => {
  const [translate] = useTranslation();

  const { setIsShowModalProposal } = useContext<PurchaseRequestDetailModel>(
    PurchaseRequestDetailHookContext
  );

  return (
    <div className="empty__wrapper">
      <img src={BasisIcon} alt="img" width={140} height={140} />
      <div className="empty__body__content">
        <span className="content">
          {translate("PR.select_policy_from_system")}
        </span>
        <div className="empty__body__content__button">
          <Button
            icon={<Add />}
            iconPlace="left"
            type="secondary"
            onClick={() => setIsShowModalProposal(true)}
          >
            {translate("PR.select_policy")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyData;
