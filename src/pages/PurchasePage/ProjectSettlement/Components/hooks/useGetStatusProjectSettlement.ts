import { isEqual } from "lodash";
import { listContractAnnexStatus } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface GetStatusProjectSettlementProps {
  status: number | undefined;
  contractId?: string;
  id?: string;
}

export const useGetStatusProjectSettlement = ({
  status,
  contractId,
  id,
}: GetStatusProjectSettlementProps) => {
  const [translate] = useTranslation();

  const statusProjectSettlement = useMemo(() => {
    const item = listContractAnnexStatus().find((type) =>
      isEqual(type.id, status)
    );

    const value = contractId
      ? translate("CM.txt_create")
      : id
      ? translate("CM.txt_create")
      : item?.name || translate("CM.txt_create");

    return {
      value,
      status: item?.code || "DEFAULT",
    };
  }, [status, contractId, id, translate]);

  return { statusProjectSettlement };
};
