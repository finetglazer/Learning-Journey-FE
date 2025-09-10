import { Modal, Tag } from "react-components-design-system";
import { isEqual } from "lodash";

import { useManufacturerCategoriesViewHook } from "./ManufacturerCategoriesViewHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import styles from "./ManufacturerCategoriesView.module.scss";

const MODAL_WIDTH = 600;

export interface ManufacturerCategoriesViewProps {
  manufacturerCategoryId: string;
  dismiss: () => void;
}

const ManufacturerCategoriesView = ({
  manufacturerCategoryId,
  dismiss,
}: ManufacturerCategoriesViewProps) => {
  const { translate, model, isLoading, copyToClipboard } =
    useManufacturerCategoriesViewHook(manufacturerCategoryId);

  const MainSection = () => {
    const isActive = isEqual(model?.isActive, true);
    const translatedKey = isActive
      ? "CM.txt_status_active"
      : "CM.txt_status_deactivate";
    const value = translate(translatedKey);
    const statusValue = isActive ? "SUCCESS" : "DEFAULT";

    return (
      <div className={styles["main-section"]}>
        {/* Status */}
        <Tag
          size="md"
          value={value}
          status={statusValue}
          isShowDot={false}
          isShowBorder
          className={styles["status-tag"]}
        />

        {/* Name */}
        <span className={styles["text-name"]}>{model?.name}</span>

        {/* Code */}
        <div className={styles["code-container"]} onClick={copyToClipboard}>
          <span className={styles["text-code"]}>{model?.code}</span>
          <img src={CopySvg} alt="copy" />
        </div>
      </div>
    );
  };

  return (
    <Modal
      open
      isShowButtonCancel={false}
      isShowIconBack={false}
      title={translate("MC.txt_view_detail_manufacturer_categories")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={MODAL_WIDTH}
      handleSave={dismiss}
      handleCancel={dismiss}
    >
      <div className={styles["wrapper"]}>
        <MainSection />
        <div className={styles["description-section"]}>
          <span className={styles["description-label"]}>
            {translate("MC.txt_manufacturer_categories_description")}
          </span>
          <span className={styles["description-value"]}>
            {model?.description}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ManufacturerCategoriesView;
