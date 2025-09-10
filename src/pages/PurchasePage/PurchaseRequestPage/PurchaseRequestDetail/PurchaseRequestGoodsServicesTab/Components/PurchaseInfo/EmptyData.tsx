import { Add } from "@carbon/icons-react";
import { IcEmptyGoodsServices } from "assets/icons";
import { isEmpty } from "lodash";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import "./PurchaseInfo.scss";

const EmptyData = () => {
  const [translate] = useTranslation();

  const { model, setIsShowModalGoodsServices } =
    useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  if (model.isDetail) return null;

  return (
    <div className="empty__wrapper">
      <img src={IcEmptyGoodsServices} alt="img" width={140} height={140} />
      <div className="empty__body__content">
        <span className="content">
          <div className="title">{translate("PR.please_add_goods")}</div>
          <div className="title">{translate("PR.to_purchase_info")}</div>
        </span>
        <div className="empty__body__content__button">
          <Button
            icon={<Add />}
            iconPlace="left"
            type="secondary"
            disabled={isEmpty(model.purchaseProposalId)}
            onClick={() => setIsShowModalGoodsServices(true)}
          >
            {translate("PR.add_goods")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyData;
