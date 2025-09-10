import { ACCEPTANCE_ROUTE_MASTER } from "config/route-const";
import { acceptanceRepository } from "core/repositories/AcceptanceRepository";
import { detailService } from "core/services/page-services/detail-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEmpty } from "lodash";
import { AcceptanceModel } from "models/Acceptance/Acceptance";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { finalize, tap } from "rxjs";
import { useGetGoodItems } from "./useGetGoodItems";

interface GetGeneralInformationParams {
  contractId: string | undefined;
  acceptanceId: string | undefined;
}

export const useGetGeneralInformation = ({
  contractId,
  acceptanceId,
}: GetGeneralInformationParams) => {
  const { model, dispatch } =
    detailService.useModel<AcceptanceModel>(AcceptanceModel);
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const { loading: loadingGoodItems, getGetGoodItems } = useGetGoodItems({
    dispatch,
  });

  const getGeneralInformation = useCallback(() => {
    acceptanceRepository
      .getGeneralInformation(contractId)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: (response: AcceptanceModel) => {
          dispatch({
            type: GeneralActionEnum.SET,
            payload: {
              ...response,
              id: null,
            },
          });
          const goodItemIds = response?.goodsReceiptRequests?.map(
            (good) => good?.id
          );
          if (isEmpty(goodItemIds)) return;

          getGetGoodItems(goodItemIds);
        },
        error: () => {
          history.push(ACCEPTANCE_ROUTE_MASTER);
        },
      });
  }, [contractId, dispatch, history]);

  const getAcceptanceDetail = useCallback(() => {
    acceptanceRepository
      .getAcceptanceDetail(acceptanceId)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: (response: AcceptanceModel) => {
          dispatch({
            type: GeneralActionEnum.SET,
            payload: response,
          });
        },
        error: () => {
          history.push(ACCEPTANCE_ROUTE_MASTER);
        },
      });
  }, [acceptanceId, dispatch, history]);

  useEffect(() => {
    if (contractId) {
      getGeneralInformation();
      return;
    }

    if (acceptanceId) {
      getAcceptanceDetail();
      return;
    }
  }, [acceptanceId, contractId, getAcceptanceDetail, getGeneralInformation]);

  return {
    model,
    loading,
    loadingGoodItems,
    dispatch,
    setLoading,
    getGetGoodItems,
    getAcceptanceDetail,
  };
};
