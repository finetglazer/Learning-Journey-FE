import { useTranslation } from "react-i18next";

export const useContractTermsTabHook = () => {
  const [translate] = useTranslation();

  return {
    translate,
  };
};
