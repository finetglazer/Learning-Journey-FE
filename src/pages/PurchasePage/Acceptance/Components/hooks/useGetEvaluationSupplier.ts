import { acceptanceRepository } from "core/repositories/AcceptanceRepository";
import { EvaluationSupplierModel } from "models/Acceptance/Acceptance";
import { useCallback, useEffect, useState } from "react";
import { finalize, tap } from "rxjs";

interface GetEvaluationSupplierParams {
  receivedId: string[];
}

export const useGetEvaluationSupplier = ({
  receivedId,
}: GetEvaluationSupplierParams) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [evaluationSupplier, setEvaluationSupplier] =
    useState<EvaluationSupplierModel>([]);

  const getEvaluationSupplierDetail = useCallback(() => {
    acceptanceRepository
      .getEvaluationSupplier(receivedId)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: (response: EvaluationSupplierModel) => {
          setEvaluationSupplier(response);
        },
      });
  }, [receivedId]);

  useEffect(() => {
    if (receivedId?.length) {
      getEvaluationSupplierDetail();
    }
  }, [getEvaluationSupplierDetail, receivedId]);

  return {
    evaluationSupplier,
    loading,
    setEvaluationSupplier,
  };
};
