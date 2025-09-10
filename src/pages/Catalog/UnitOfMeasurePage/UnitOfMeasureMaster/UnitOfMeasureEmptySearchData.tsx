import { IcEmptySearchSvg } from "assets/icons";
import { EmptyData } from "components";
import { useTranslation } from "react-i18next";

export const UnitOfMeasureEmptySearchData = () => {
  const [translate] = useTranslation();

  return (
    <EmptyData
      message={translate("CM.txt_search_no_data")}
      icon={IcEmptySearchSvg}
      height={376}
    >
      <></>
    </EmptyData>
  );
};
