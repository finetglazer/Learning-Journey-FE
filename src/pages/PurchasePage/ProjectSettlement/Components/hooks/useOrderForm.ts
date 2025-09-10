import { numberConstants } from "core/config/consts";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual, uniqueId } from "lodash";
import {
  AssetItemModel,
  ProjectSettlementAsset,
} from "models/ProjectSettlement";
import { useProjectSettlementDetailContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/context";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export enum ProjectSettlementModal {
  LIST = "LIST",
}

export const useOrderFormHooks = ({
  data,
  index,
}: {
  data: ProjectSettlementAsset;
  index: number;
}) => {
  const [translate] = useTranslation();
  const { dispatch, model } = useProjectSettlementDetailContext();
  const [assetItemSelected, setAssetItemSelected] =
    useState<AssetItemModel | null>(null);

  const onSave = (index: number) => {
    if (!assetItemSelected) return;

    const newAssetItem: AssetItemModel = {
      ...assetItemSelected,
      id: assetItemSelected?.id || uniqueId(),
      isCreate: true,
    };

    const projectSettlementAssets =
      model?.contractSettlementAsset?.projectSettlementAssets.map(
        (item, indexData) => {
          if (indexData !== index) return item;
          const assetItems = item?.assetItems || [];
          const indexCur = assetItems.findIndex((asset) =>
            isEqual(asset?.id, newAssetItem?.id)
          );

          if (indexCur > -1) {
            return {
              ...item,
              assetItems: assetItems.map((asset, i) =>
                i === indexCur ? newAssetItem : asset
              ),
            };
          }

          return {
            ...item,
            assetItems: [newAssetItem, ...assetItems],
          };
        }
      );

    const {
      assetFixedIntangibleAmount,
      assetFixedTangibleAmount,
      assetToolsAmount,
    } = projectSettlementAssets.reduce(
      (acc, assetItems) => {
        assetItems?.assetItems.forEach((asset) => {
          switch (asset.classify) {
            case translate("PS.txt_asset_fixed_intangible"):
              acc.assetFixedIntangibleAmount += asset.originalCost;
              break;
            case translate("PS.txt_asset_fixed_tangible"):
              acc.assetFixedTangibleAmount += asset.originalCost;
              break;
            case translate("PS.txt_asset_aseful_tool"):
              acc.assetToolsAmount += asset.originalCost;
              break;
          }
        });
        return acc;
      },
      {
        assetFixedIntangibleAmount: numberConstants.ZERO,
        assetFixedTangibleAmount: numberConstants.ZERO,
        assetToolsAmount: numberConstants.ZERO,
      }
    );

    const totalGoodsAmount = model?.goodsCategoryCosts.reduce(
      (acc, item) => acc + item.settlementSum,
      numberConstants.ZERO
    );

    const assetFixedAmount =
      assetFixedIntangibleAmount + assetFixedTangibleAmount;

    const sumFixedAmountAndTools = assetFixedAmount + assetToolsAmount;

    const assetCostAmount = totalGoodsAmount - sumFixedAmountAndTools;

    const totalAmount = assetFixedAmount + assetToolsAmount + assetCostAmount;

    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        contractSettlementAsset: {
          ...model?.contractSettlementAsset,
          projectSettlementAssets,
          assetFixedIntangibleAmount,
          assetFixedTangibleAmount,
          assetToolsAmount,
          assetFixedAmount,
          assetCostAmount,
          totalAmount,
        },
      },
    });

    setAssetItemSelected(null);
  };

  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const handleDeleteOrderForm = useCallback(
    (ids: string[]) => {
      const dataCopy = { ...model };
      const updatedAssetItems =
        dataCopy?.contractSettlementAsset?.projectSettlementAssets.map(
          (item) => ({
            ...item,
            assetItems: item?.assetItems?.filter(
              (asset) => !ids.includes(asset?.id)
            ),
          })
        );

      const newData = {
        ...model,
        contractSettlementAsset: {
          ...model?.contractSettlementAsset,
          projectSettlementAssets: updatedAssetItems,
        },
      };

      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: newData,
      });
      setAssetItemSelected(null);
      setIsOpenModelConfirmDeleteRow(false);
    },
    [dispatch, model]
  );

  return {
    isOpenModelConfirmDeleteRow,
    handleDeleteOrderForm,
    setIsOpenModelConfirmDeleteRow,
    assetItemSelected,
    setAssetItemSelected,
    onSave,
  };
};
