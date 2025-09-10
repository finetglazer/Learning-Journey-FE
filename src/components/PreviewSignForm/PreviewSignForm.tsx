import { Download } from "@carbon/icons-react";
import { SignedForm } from "models/SignatureInfo";
import React from "react";
import { Button, Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Observable } from "rxjs";

interface PreviewSignForm {
  signedForm?: SignedForm;
  visiblePreview?: boolean;
  handleClose?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFile?: (params: { id: number }) => Observable<any>;
  taskAssignmentId?: number | string;
}

const PreviewSignForm = (props: PreviewSignForm) => {
  const [translate] = useTranslation();
  const { signedForm, visiblePreview, getFile, handleClose, taskAssignmentId } =
    props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [url, setUrl] = React.useState<any>("");

  const handleDownload = React.useCallback(() => {
    const element = document.createElement("a");
    element.setAttribute("href", signedForm.url);
    element.setAttribute("download", signedForm.name);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [signedForm]);

  React.useEffect(() => {
    if (signedForm.id && !taskAssignmentId) {
      const subscription = getFile({ id: signedForm.id }).subscribe({
        next: (res) => {
          const blob = new Blob([res.data], {
            type: "application/pdf",
          });
          setUrl(window.URL.createObjectURL(blob));
        },
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [getFile, signedForm.id, taskAssignmentId]);

  return (
    <>
      <Modal
        title={null}
        visible={visiblePreview}
        onCancel={handleClose}
        handleCancel={handleClose}
        width={1300}
        closable={true}
        visibleFooter={false}
      >
        <div className="preview-modal__body d-flex align-items-center justify-content-between p-5">
          <iframe
            title={"file_render"}
            src={url}
            height={700}
            width={1200}
          ></iframe>
        </div>
        <div className="preview-modal__footer p-2">
          <div className="d-flex justify-content-end justify-content-end">
            <Button
              type="secondary"
              className="btn--lg"
              onClick={handleDownload}
              icon={<Download size={16} />}
            >
              {translate("CM.exportFile")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PreviewSignForm;
