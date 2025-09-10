import { acceptanceRepository } from "core/repositories/AcceptanceRepository";
import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import { AcceptanceModel, GoodItemsModel } from "models/Acceptance/Acceptance";
import { Dispatch, useCallback, useState } from "react";
import { finalize, tap } from "rxjs";

interface GetGoodItemsParams {
  dispatch?: Dispatch<GeneralAction<AcceptanceModel>>;
}

export const useGetGoodItems = ({ dispatch }: GetGoodItemsParams) => {
  const [loading, setLoading] = useState<boolean>(false);

  const getGetGoodItems = useCallback(
    (goodItemIds: string[]) => {
      acceptanceRepository
        .getGoodItems(goodItemIds)
        .pipe(
          tap(() => setLoading(true)),
          finalize(() => setLoading(false))
        )
        .subscribe({
          next: (response: GoodItemsModel[]) => {
            dispatch({
              type: GeneralActionEnum.UPDATE,
              payload: {
                acceptanceGoodsItems: response,
              },
            });
          },
        });
    },
    [dispatch]
  );

  return {
    loading,
    getGetGoodItems,
  };
};
