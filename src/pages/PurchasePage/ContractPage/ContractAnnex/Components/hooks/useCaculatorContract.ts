import { SelectAdjustableGoodsServicesModel } from "models/ContractAnnex";
import { useMemo } from "react";
import { ContractAnnexStatus } from "../../constants";

interface CalculatorContractParams {
  contractValueOrigin: number;
  goodServices: SelectAdjustableGoodsServicesModel[];
  status?: ContractAnnexStatus;
}

export const useCalculatorContract = ({
  contractValueOrigin,
  goodServices,
  status,
}: CalculatorContractParams) => {
  const contractValue = useMemo(() => {
    return goodServices?.reduce(
      (acc, cur) => acc + (cur?.totalAmount || 0),
      contractValueOrigin
    );
  }, [contractValueOrigin, goodServices]);

  return {
    contractValue:
      status === ContractAnnexStatus.APPROVED
        ? contractValueOrigin
        : contractValue ?? contractValueOrigin,
  };
};
