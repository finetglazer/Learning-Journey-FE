/* eslint-disable @typescript-eslint/no-explicit-any */
import { Download } from "@carbon/icons-react";
import { Modal } from "antd";
import { SignedForm } from "models/SignatureInfo";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import React, { useRef, useState } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
interface SignProcessDownloadProps {
  signedForm?: SignedForm;
  open?: boolean;
  handleClose?: () => void;
}

const SignProcessDownload = (props: SignProcessDownloadProps) => {
  const { signedForm, open, handleClose } = props;
  const [translate] = useTranslation();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [fileBlob, setFileBlob] = React.useState<Blob>(null);
  const handleDownload = React.useCallback(() => {
    saveAs(fileBlob, signedForm.name);
  }, [fileBlob, signedForm.name]);

  React.useEffect(() => {
    if (signedForm?.path && open) {
      // các api download file dùng chung 1 đường dẫn nên dùng của proposal cũng được
      const subscription = proposalRepository
        .getFileByPath(signedForm.path)
        .subscribe({
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
              setFileBlob(blob);
              reader.readAsArrayBuffer(blob);
            }
          },
        });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [iframeLoaded, open, signedForm.path]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        width={1200}
        closable={true}
        footer={false}
      >
        <div className="d-flex align-items-center justify-content-between p--2xs m-t--xl">
          <iframe
            title={"file_render"}
            src={"/viewer/index.html"}
            height={window.innerHeight - 250}
            width={1200}
            onLoad={() => {
              setIframeLoaded(true);
            }}
            ref={iframeRef}
          ></iframe>
        </div>
        <div className="w-100">
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

export default SignProcessDownload;
