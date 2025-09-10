import { UploadCloudIcon } from "assets/icons";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import styles from "../AnnexFile.module.scss";
import { AnnexFileContext, AnnexFileContextType } from "../AnnexFileHooks";

export const EmptyState = () => {
  const [translate] = useTranslation();

  const { addNewRow } = useContext<AnnexFileContextType>(AnnexFileContext);

  return (
    <div className={styles["empty-state__wrapper"]}>
      {/* Image */}
      <img className={styles["empty-icon"]} src={UploadCloudIcon} alt="" />
      <div className={styles["content"]}>
        <button className={styles["upload-button"]} onClick={addNewRow}>
          {translate("BG.upload")}
        </button>
        {/* Text */}
        <div className={styles["message"]}>
          {translate("BG.multiple_files_upload")}
        </div>
      </div>
    </div>
  );
};
