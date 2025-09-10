import { emptyIconContact } from "assets/icons";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface EmptyViewProps {
  children?: ReactNode;
}

export const EmptyView = ({ children }: EmptyViewProps) => {
  const [translate] = useTranslation();

  return (
    <div className={styles["empty-view__wrapper"]}>
      {/* Icon */}
      <img src={emptyIconContact} alt="" />
      {/* Children */}
      <div className={styles["content"]}>
        <span>{translate("CA.msg_empty_data_in_system")}</span>
        <div>{children}</div>
      </div>
    </div>
  );
};
