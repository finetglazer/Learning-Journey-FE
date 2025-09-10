import { emptyCloudIcon } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface AssetEmptyProps {
  content?: ReactNode;
}

export default function EmptyCloud({ content }: AssetEmptyProps) {
  const [translate] = useTranslation();

  return (
    <EmptyItemTable
      icon={<img src={emptyCloudIcon} alt="" />}
      content={content || translate("CM.empty.no_data_recorded")}
    />
  );
}
