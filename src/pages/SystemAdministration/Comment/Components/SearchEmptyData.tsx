import { IcEmptySearchSvg } from "assets/icons";
import { EmptyData } from "components";
import { useTranslation } from "react-i18next";

const HEIGHT = 584;
export const SearchEmptyData = () => {
  const [translate] = useTranslation();

  return (
    <EmptyData
      message={translate("CM.txt_search_no_data")}
      icon={IcEmptySearchSvg}
      height={HEIGHT}
    >
      <></>
    </EmptyData>
  );
};
