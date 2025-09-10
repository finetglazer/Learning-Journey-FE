import { emptyIconContact } from "assets/icons";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import styles from "../AnnexFile.module.scss";
import { AnnexFileContext, AnnexFileContextType } from "../AnnexFileHooks";
import { AddFileButton } from "./AddFileButton";

export const EmptyState = () => {
  const [translate] = useTranslation();

  const { addNewRow } = useContext<AnnexFileContextType>(AnnexFileContext);

  return (
    <div className={styles["empty-state__wrapper"]}>
      {/* Image */}
      <img className={styles["empty-icon"]} src={emptyIconContact} alt="" />
      <div className={styles["content"]}>
        {/* Text */}
        <div className={styles["message"]}>
          {translate("CPA.msg_empty_data_in_system")}
        </div>
        <AddFileButton
          title={translate("CPA.btn_add_new_document")}
          onClick={addNewRow}
        />
      </div>
    </div>
  );
};
