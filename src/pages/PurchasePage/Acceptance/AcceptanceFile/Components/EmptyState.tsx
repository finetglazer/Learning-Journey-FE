import { AddFileButton } from "./AddFileButton";

import { NoDataIcon } from "assets/icons";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import styles from "../AcceptanceFile.module.scss";
import {
  AcceptanceFileContext,
  AcceptanceFileContextType,
} from "../AcceptanceFileHooks";

export const EmptyState = () => {
  const [translate] = useTranslation();

  const { addNewRow } = useContext<AcceptanceFileContextType>(
    AcceptanceFileContext
  );

  return (
    <div className={styles["empty-state__wrapper"]}>
      {/* Image */}
      <img className={styles["empty-icon"]} src={NoDataIcon} alt="" />
      <div className={styles["content"]}>
        {/* Text */}
        <div
          className={styles["message"]}
          dangerouslySetInnerHTML={{
            __html: translate("AC.msg_add_new_document"),
          }}
        />
        <AddFileButton onClick={addNewRow} />
      </div>
    </div>
  );
};
