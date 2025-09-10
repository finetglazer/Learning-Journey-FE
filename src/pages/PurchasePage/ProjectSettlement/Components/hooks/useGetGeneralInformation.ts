import { PROJECT_SETTLEMENT_MASTER_ROUTE } from "config/route-const";
import { projectSettlementRepository } from "core/repositories/ProjectSettlementRepository";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual } from "lodash";
import { ProjectSettlementProposal } from "models/ProjectSettlement";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { finalize, tap } from "rxjs";

// Define type mapping constants
const SETTLEMENT_TYPES = {
  NEW: 1,
  UPGRADE: 2,
} as const;

const SETTLEMENT_TYPE_NAMES = {
  [SETTLEMENT_TYPES.NEW]: "Mua mới",
  [SETTLEMENT_TYPES.UPGRADE]: "Nâng cấp",
} as const;

interface GetProposalInformationParams {
  originalPurchaseProposalId: string | undefined;
  id: string | undefined;
}

export const useGetGeneralInformation = ({
  originalPurchaseProposalId,
  id,
}: GetProposalInformationParams) => {
  const { model, dispatch } = detailService.useModel<ProjectSettlementProposal>(
    ProjectSettlementProposal
  );
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const location = useLocation();

  const { handleChangeSingleField } = fieldService.useField(model, dispatch);

  const isView = useMemo(() => {
    const isViewFromQuery = new URLSearchParams(location.search).get("isView");

    return isEqual(isViewFromQuery, "true");
  }, []);

  const mapTypeToOption = (type: number) => {
    return {
      id: type,
      code: type,
      name:
        SETTLEMENT_TYPE_NAMES[type as keyof typeof SETTLEMENT_TYPE_NAMES] || "",
    };
  };

  const getProposalInformation = useCallback(() => {
    projectSettlementRepository
      .getGeneralProposalInformation(originalPurchaseProposalId)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: (response: ProjectSettlementProposal) => {
          const dataLoop =
            response?.contractSettlementAsset?.projectSettlementAssets;
          const updatedResponse = {
            ...response,
            contractSettlementAsset: {
              ...response.contractSettlementAsset,
              projectSettlementAssets: dataLoop?.map((asset) => ({
                ...asset,
                assetItems: asset?.assetItems?.map((item) => ({
                  ...item,
                  type:
                    typeof item?.type === "number"
                      ? mapTypeToOption(item.type)
                      : null,
                })),
              })),
            },
          };
          dispatch({
            type: GeneralActionEnum.SET,
            payload: updatedResponse as unknown as ProjectSettlementProposal,
          });
        },
        error: () => {
          history.push(PROJECT_SETTLEMENT_MASTER_ROUTE);
        },
      });
  }, [originalPurchaseProposalId, dispatch, history]);

  const getProjectSettlementDetail = useCallback(() => {
    projectSettlementRepository
      .getProjectSettlementDetail(id, isView)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: (response: ProjectSettlementProposal) => {
          const dataLoop =
            response?.contractSettlementAsset?.projectSettlementAssets;
          const updatedResponse = {
            ...response,
            contractSettlementAsset: {
              ...response.contractSettlementAsset,
              projectSettlementAssets: dataLoop?.map((asset) => ({
                ...asset,
                assetItems: asset?.assetItems?.map((item) => ({
                  ...item,
                  type:
                    typeof item?.type === "number"
                      ? mapTypeToOption(item.type)
                      : null,
                })),
              })),
            },
          };
          dispatch({
            type: GeneralActionEnum.SET,
            payload: updatedResponse as unknown as ProjectSettlementProposal,
          });
        },
        error: () => {
          history.push(PROJECT_SETTLEMENT_MASTER_ROUTE);
        },
      });
  }, [id, isView, dispatch, history]);

  useEffect(() => {
    if (originalPurchaseProposalId) {
      getProposalInformation();
      return;
    }

    if (id) {
      getProjectSettlementDetail();
      return;
    }
  }, [
    id,
    originalPurchaseProposalId,
    getProjectSettlementDetail,
    getProposalInformation,
  ]);

  return {
    model,
    loading,
    dispatch,
    setLoading,
    getProjectSettlementDetail,
    handleChangeSingleField,
  };
};
