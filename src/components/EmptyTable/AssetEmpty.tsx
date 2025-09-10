import { EmptyAssetIcon } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface AssetEmptyProps {
  content?: ReactNode;
}

export default function AssetEmpty({ content }: AssetEmptyProps) {
  const [translate] = useTranslation();

  return (
    <EmptyItemTable
      icon={<img src={EmptyAssetIcon} alt="" />}
      content={content || translate("CM.empty.no_data_recorded")}
    />
  );
}
