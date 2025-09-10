import { detailService } from "core/services/page-services/detail-service";
import { GoodsServices } from "models/GoodsServices";
import React from "react";
import { goodsServicesRepository } from "../GoodsServicesRepository";
import { useHistory } from "react-router";
import { GOODS_SERVICES_MASTER_ROUTE } from "config/route-const";

export function useGoodsServicesPreviewHook() {
  const { model, dispatch: dispatchModel } =
    detailService.useModel<GoodsServices>(GoodsServices);

  const history = useHistory();

  const { isDetail } = detailService.useGetIsDetail(
    goodsServicesRepository.detail,
    dispatchModel
  );

  const [loading, setLoading] = React.useState<boolean>(false);

  const handleGoMaster = React.useCallback(() => {
    history.push(GOODS_SERVICES_MASTER_ROUTE);
  }, [history]);

  const [renderUOMGroup, setRenderUOMGroup] = React.useState<string>("--");

  React.useEffect(() => {
    if (model?.unitOfMeasureGroupId) {
      goodsServicesRepository
        .getUnitOfMeasure(model?.unitOfMeasureGroupId)
        .subscribe((res) => {
          setRenderUOMGroup(res?.toString());
        });
    }
  }, [model?.unitOfMeasureGroupId]);

  return {
    model,
    isDetail,
    loading,
    setLoading,
    handleGoMaster,
    renderUOMGroup,
  };
}
