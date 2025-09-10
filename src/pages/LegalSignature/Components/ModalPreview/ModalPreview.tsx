import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import React from "react";
import styles from "./ModalPreview.module.scss";
import { TagFilterEnum } from "../../constants";
import { isEqual } from "lodash";
import ReactPdfViewer from "../ReactPdfViewer/ReactPdfViewer";
type props = {
  open: boolean;
  handleCancel: () => void;
  onSave: (data: any) => void;
  model?: any;
  loadingPreview: boolean;
};
const ModalPreview = ({
  open,
  handleCancel,
  onSave,
  model,
  loadingPreview,
}: props) => {
  const [translate] = useTranslation();
  const handleSave = () => {
    onSave("data");
  };
  return (
    <Modal
      className={styles.modalPreview}
      open={open}
      size={1440}
      footer={false}
      title={translate("legalSignature.title")}
      closeIcon={true}
      handleSave={handleSave}
      isShowIconBack={false}
      handleCancel={handleCancel}
      disableButtonApply={false}
      titleButtonCancel={translate("CM.btn_close")}
      isShowButtonCancel={false}
      titleButtonApply={translate("legalSignature.title")}
      isShowButtonApply={
        !loadingPreview && !isEqual(model?.status, TagFilterEnum.SIGNED)
      }
    >
      <ReactPdfViewer
        code={model?.code}
        fileUrl={model?.fileUrl}
        loadingPreview={loadingPreview}
      />
    </Modal>
  );
};

export default ModalPreview;
