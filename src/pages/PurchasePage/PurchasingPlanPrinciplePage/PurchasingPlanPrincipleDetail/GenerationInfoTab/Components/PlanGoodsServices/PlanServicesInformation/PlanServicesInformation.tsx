import { isEmpty } from "lodash";
import React, { useContext, useState } from "react";
import { Button } from "react-components-design-system";

import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { AddIcon, emptyIcon } from "assets/icons";
import { PurchasingPlanPrincipleDetailHookContext } from "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";

import PlanGoodsServicesModal from "../PlanGoodsServicesModal/PlanGoodsServicesModal";
import PlanServicesInformationTable from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasePlanGenerationInfoTab/Components/PlanGoodsServices/PlanServicesInformation/PlanServicesInformationTable";
import { PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE } from "config/route-const";

type props = {
  isView?: boolean;
};
const PlanServicesInformation = ({ isView = false }: props) => {
  const currentContext = useContext(PurchasingPlanPrincipleDetailHookContext);
  const { translate, model, handleChangeSingleField, path } = currentContext;

  const [isShowModalGoodsServices, setIsShowModalGoodsServices] =
    useState(false);

  return (
    <div className="purchase_info_plan_wrapper">
      <div className="body">
        <div>
          {isEmpty(model.purchaseItems) && !isView ? (
            <EmptyInitializeTable
              isSolid={false}
              textButton={translate("PL.purchasing_plan_select_goods_services")}
              content={
                <div>
                  {translate("PL.purchasing_plan_no_goods_services_info")}
                </div>
              }
              icon={<img src={emptyIcon} alt="" />}
              disableButton={isEmpty(model.purchaseProposalId?.id)}
              onHandleClickAdd={() => {
                setIsShowModalGoodsServices(true);
              }}
            />
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
                path={path}
                pathEdit={PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE}
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
          />
        )}
      </div>
    </div>
  );
};

export default PlanServicesInformation;
