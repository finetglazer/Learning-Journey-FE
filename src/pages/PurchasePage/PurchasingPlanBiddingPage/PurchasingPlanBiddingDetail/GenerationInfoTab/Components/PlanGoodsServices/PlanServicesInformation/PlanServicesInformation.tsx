import { isEmpty } from "lodash";
import React, { useContext, useState } from "react";
import { Button, FormItem } from "react-components-design-system";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { AddIcon, emptyCloudIcon } from "assets/icons";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";

import { PURCHASING_PLAN_BIDDING_DETAIL_ROUTE } from "config/route-const";
import PlanGoodsServicesModal from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasePlanGenerationInfoTab/Components/PlanGoodsServices/PlanGoodsServicesModal/PlanGoodsServicesModal";
import { utilService } from "core/services/common-services/util-service";
import PlanServicesInformationTable from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/PlanGoodsServices/PlanServicesInformation/PlanServicesInformationTable";
import { useTranslation } from "react-i18next";

type props = {
  isView?: boolean;
};
const PlanServicesInformation = ({ isView = false }: props) => {
  const currentContext = useContext(PurchasingPlanBiddingDetailHookContext);
  const { model, handleChangeSingleField, path, handleChangeAllField } =
    currentContext;
  const [translate] = useTranslation();

  const [isShowModalGoodsServices, setIsShowModalGoodsServices] =
    useState(false);

  return (
    <div className="purchase_info_plan_wrapper">
      <div className="body">
        <div>
          {isEmpty(model.purchaseItems) && !isView ? (
            <div>
              <FormItem
                validateObject={utilService.getValidateObj(model, "goodsItems")}
              >
                <EmptyInitializeTable
                  isSolid={false}
                  textButton={translate(
                    "PL.purchasing_plan_select_goods_services"
                  )}
                  content={
                    <div className="text-break-line">
                      {translate("PL.bidding.title.add_new_data")}
                    </div>
                  }
                  icon={<img src={emptyCloudIcon} alt="" />}
                  disableButton={isEmpty(model.purchaseProposalId?.id)}
                  onHandleClickAdd={() => {
                    setIsShowModalGoodsServices(true);
                  }}
                />
              </FormItem>
            </div>
          ) : (
            <div>
              {!isView && (
                <Button
                  icon={<img src={AddIcon} alt="img" width={14} height={14} />}
                  iconPlace="left"
                  type="secondary"
                  className="m-b--sm"
                  disabled={isEmpty(model.purchaseProposalId?.id)}
                  onClick={() => {
                    setIsShowModalGoodsServices(true);
                  }}
                >
                  {translate("PL.purchasing_plan_select_goods_services")}
                </Button>
              )}
              <PlanServicesInformationTable
                model={model}
                handleChangeSingleField={handleChangeSingleField}
                handleChangeAllField={handleChangeAllField}
                path={path}
                pathEdit={PURCHASING_PLAN_BIDDING_DETAIL_ROUTE}
                isView={isView}
                contextValue={currentContext}
              />
            </div>
          )}
        </div>
        {isShowModalGoodsServices && (
          <PlanGoodsServicesModal
            id={model?.purchaseProposalId?.id}
            setModal={setIsShowModalGoodsServices}
            callback={handleChangeSingleField({
              fieldName: "purchaseItems",
            })}
            selectRowsModal={model?.purchaseItems}
            selectedKeys={model?.purchaseItems?.map((item) => item.id)}
            isShowModalGoodsServices={isShowModalGoodsServices}
            setIsShowModalGoodsServices={setIsShowModalGoodsServices}
            purchasePlanId={model?.idDetail}
            model={model}
          />
        )}
      </div>
    </div>
  );
};

export default PlanServicesInformation;
