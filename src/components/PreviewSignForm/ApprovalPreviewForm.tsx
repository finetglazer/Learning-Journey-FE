import { ApproveIcon } from "assets/icons";
import { LoadingCM } from "components";
import { WorkflowCommand } from "models/WorkflowCommand";
import React, { useRef, useState } from "react";
import { Model } from "react-3layer-common";
import { Button, Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Observable } from "rxjs";
interface PreviewSignForm {
  request?: Model;
  visiblePreview?: boolean;
  loading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previewSignedForm?: (request: Model) => Observable<any>;
  handleClose?: () => void;
  handleApprove?: () => void;
}

const ApprovalPreviewSignForm = (props: PreviewSignForm) => {
  const [translate] = useTranslation();
  const {
    request,
    visiblePreview,
    previewSignedForm,
    handleClose,
    handleApprove,
    loading,
  } = props;

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (request?.id) {
      const listRequestTaskId =
        request?.commands?.map((p: WorkflowCommand) => p?.requestTaskId) || [];
      const subscription = previewSignedForm({
        requestId: request?.id,
        pendingRequestTaskIds: listRequestTaskId,
      }).subscribe({
        next: (res) => {
          const blob = new Blob([res.data], {
            type: "application/pdf",
          });
          if (iframeLoaded && blob && iframeRef.current) {
            const reader = new FileReader();
            reader.onload = () => {
              const arrayBuffer = reader.result;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              iframeRef.current!.contentWindow?.postMessage(
                { type: "LOAD_PDF", data: arrayBuffer },
                "*"
              );
            };
            reader.readAsArrayBuffer(blob);
          }
        },
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [iframeLoaded, previewSignedForm, request?.commands, request?.id]);

  return (
    <>
      <Modal
        title={null}
        visible={visiblePreview}
        handleCancel={handleClose}
        width={1300}
        visibleFooter={false}
      >
        <div className="preview-modal__body d-flex align-items-center justify-content-between">
          <iframe
            title={"file_render"}
            src={"/viewer/index.html"}
            height={700}
            width={1200}
            onLoad={() => {
              setIframeLoaded(true);
            }}
            ref={iframeRef}
          ></iframe>
        </div>
        <div className="preview-modal__footer p-2">
          <div className="d-flex justify-content-end justify-content-end">
            <Button
              type={"primary"}
              size="lg"
              icon={<img src={ApproveIcon} alt="img" />}
              onClick={handleApprove}
              disabled={loading}
              iconPlace="left"
            >
              {translate("CM.approveAction")}
            </Button>
          </div>
        </div>
        {loading && <LoadingCM />}
      </Modal>
    </>
  );
};

export default ApprovalPreviewSignForm;
