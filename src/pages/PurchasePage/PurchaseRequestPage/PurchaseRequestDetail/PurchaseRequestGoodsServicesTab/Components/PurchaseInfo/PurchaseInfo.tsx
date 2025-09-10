import { Add } from "@carbon/icons-react";
import { isEmpty } from "lodash";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import GoodsServicesModal from "../GoodsServicesModal/GoodsServicesModal";
import "./PurchaseInfo.scss";
import EmptyData from "./EmptyData";
import PurchaseInfoTable from "./PurchaseInfoTable";

const PurchaseInfo = () => {
  const [translate] = useTranslation();

  const {
    model,
    handleChangeSingleField,
    setIsShowModalGoodsServices,
    isShowModalGoodsServices,
  } = useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  return (
    <div className="purchase_info_wrapper">
      <div className="header">
        <div className="title">{translate("PR.purchase_item_info")}</div>
      </div>
      <div className="body">
        <div>
          {isEmpty(model.purchaseItems) ? (
            <EmptyData />
          ) : (
            <div>
              {!model.isDetail && (
                <Button
                  icon={<Add />}
                  iconPlace="left"
                  type="secondary"
                  disabled={isEmpty(model.purchaseProposalId)}
                  onClick={() => {
                    setIsShowModalGoodsServices(true);
                  }}
                  className="mt-3"
                >
                  {translate("PR.add_goods")}
                </Button>
              )}
              <PurchaseInfoTable />
            </div>
          )}
        </div>
        {isShowModalGoodsServices && (
          <GoodsServicesModal
            setModal={setIsShowModalGoodsServices}
            addedGoodsServices={null}
            callback={(value) => {
              handleChangeSingleField({
                fieldName: "purchaseItems",
              })(
                [...model.purchaseItems, ...value].map((item, index) => ({
                  ...item,
                  id: index.toString(),
                }))
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PurchaseInfo;
