import { isEqual } from "lodash";
import { listAcceptanceStatus } from "pages/PurchasePage/constants";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface GetStatusAcceptanceProps {
  status: number | undefined;
}

export const useGetStatusAcceptance = ({
  status,
}: GetStatusAcceptanceProps) => {
  const [translate] = useTranslation();
  const statusAcceptance = useMemo(() => {
    const item = listAcceptanceStatus().find((type) =>
      isEqual(type.id, status)
    );

    return {
      value: item?.name || translate("CM.txt_create"),
      status: item?.code || "DEFAULT",
    };
  }, [status, translate]);

  return { statusAcceptance };
};
