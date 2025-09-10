import { isEmpty, isNil } from "lodash";
import { useState } from "react";
import { Button, FormItem } from "react-components-design-system";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { AddIcon, emptyCloudIcon } from "assets/icons";

import { PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE } from "config/route-const";
import PlanGoodsServicesModal from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasePlanGenerationInfoTab/Components/PlanGoodsServices/PlanGoodsServicesModal/PlanGoodsServicesModal";
import { utilService } from "core/services/common-services/util-service";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import PlanServicesInformationTable from "./PlanServicesInformationTable";

type props = {
  isView?: boolean;
  contextValue: PurchasingPlanModel;
  pathEdit?: string;
};
const PlanServicesInformation = ({
  isView = false,
  contextValue,
  pathEdit = PURCHASING_PLAN_COMPETITIVE_OFFER_DETAIL_ROUTE,
}: props) => {
  const {
    translate,
    model,
    handleChangeSingleField,
    path,
    handleChangeAllField,
  } = contextValue;

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
                  icon={<img src={AddIcon} alt="img" width={12} height={12} />}
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
                path={path}
                pathEdit={pathEdit}
                isView={isView}
                contextValue={contextValue}
                handleChangeAllField={handleChangeAllField}
              />
            </div>
          )}
        </div>
        {isShowModalGoodsServices && (
          <PlanGoodsServicesModal
            id={model?.purchaseProposalId?.id}
            setModal={setIsShowModalGoodsServices}
            callback={(data) => {
              handleChangeSingleField({
                fieldName: "purchaseItems",
              })(
                data?.map((item) => ({
                  ...item,
                  quantity: !isNil(item?.quantity)
                    ? item?.quantity
                    : item?.remainingRequestQuantity,
                }))
              );
            }}
            selectRowsModal={model?.purchaseItems}
            selectedKeys={model?.purchaseItems?.map((item) => item.id)}
            isShowModalGoodsServices={isShowModalGoodsServices}
            setIsShowModalGoodsServices={setIsShowModalGoodsServices}
            purchasePlanId={model?.idDetail}
            model={model}
            isPurchasingPlanCompetitiveOfferPage={true}
          />
        )}
      </div>
    </div>
  );
};

export default PlanServicesInformation;
