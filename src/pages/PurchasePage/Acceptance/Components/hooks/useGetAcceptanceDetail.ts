import { ACCEPTANCE_ROUTE_MASTER } from "config/route-const";
import { acceptanceRepository } from "core/repositories/AcceptanceRepository";
import { detailService } from "core/services/page-services/detail-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual } from "lodash";
import { AcceptanceModel } from "models/Acceptance/Acceptance";
import { useAcceptanceActions } from "pages/PurchasePage/Acceptance/Components/hooks/useAcceptanceActions";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { finalize } from "rxjs";

interface GetAcceptanceIdParams {
  acceptanceId: string;
}

const IS_VIEW_PARAM = "isView";

export const useGetAcceptanceDetail = ({
  acceptanceId,
}: GetAcceptanceIdParams) => {
  const { model, dispatch } =
    detailService.useModel<AcceptanceModel>(AcceptanceModel);
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const { state } = useAcceptanceActions();
  const isViewFromUrl = new URLSearchParams(history.location.search).get(
    IS_VIEW_PARAM
  );
  const isView = isEqual(state, "DETAIL")
    ? isEqual(isViewFromUrl, "true")
    : true;

  const getAcceptanceDetail = useCallback(() => {
    setLoading(true);

    acceptanceRepository
      .getAcceptanceDetail(acceptanceId, isView)
      .pipe(finalize(() => setLoading(false)))
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
  }, [acceptanceId, dispatch, history, isView]);

  useEffect(() => {
    if (acceptanceId) {
      getAcceptanceDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptanceId]);

  return {
    model,
    loading,
    dispatch,
    setLoading,
    getAcceptanceDetail,
  };
};
