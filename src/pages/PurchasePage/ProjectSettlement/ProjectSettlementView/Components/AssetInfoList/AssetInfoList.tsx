import { useTranslation } from "react-i18next";
import styles from "./AssetInfoList.module.scss";

interface AssetInfo {
  key: string;
  value: string;
}

interface AssetInfoListProps {
  data: AssetInfo[];
  className?: string;
}

const AssetInfoList = ({ data, className }: AssetInfoListProps) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      {data.map(({ key, value }) => (
        <div key={key} className={styles["asset-info__box"]}>
          <span className={styles["asset-title"]}>{t(key)}</span>
          <span className={styles["asset-value"]}>{value}</span>
        </div>
      ))}
    </div>
  );
};

export default AssetInfoList;
