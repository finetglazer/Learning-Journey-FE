import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { listContractRequestTypeKey } from "../constants";

const useTranslationContract = () => {
  const [t] = useTranslation();
  const history = useHistory();

  const isListContractHaveRequestType = (type: string) => {
    const listContractMapId = listContractRequestTypeKey.map((item) => item.id);
    return listContractMapId.includes(type);
  };

  const nameContractRequestType = useMemo(() => {
    const lastIndexSlash = history.location.pathname.lastIndexOf("/");
    const lastPathName = history.location.pathname.substring(0, lastIndexSlash);
    let contractRequestType = history.location.pathname.split("/").pop();

    const isHaveRequestType =
      isListContractHaveRequestType(contractRequestType);

    if (!isHaveRequestType) {
      contractRequestType = lastPathName;
    }

    if (!isListContractHaveRequestType(contractRequestType)) {
      contractRequestType = history.location.pathname;
    }

    if (isListContractHaveRequestType(contractRequestType)) {
      return listContractRequestTypeKey.find(
        (el) => el.id === contractRequestType
      )?.name;
    }

    return t("CT.txt_contract");
  }, [history.location.pathname, t]);

  const translate = (
    key: string,
    options?: Record<string, unknown>
  ): string => {
    return t(key, { contractType: nameContractRequestType, ...options });
  };

  return [translate as typeof t];
};

export default useTranslationContract;
