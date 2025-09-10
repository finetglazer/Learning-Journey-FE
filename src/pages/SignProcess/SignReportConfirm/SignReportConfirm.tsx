import { Col, Row, Space } from "antd";
import { RequestFormConfigurationContent } from "models/RequestFormConfigurationContent";
import React, { useEffect, useRef, useState } from "react";
import { InputText } from "react-components-design-system";
import {
  SignProcessModalContext,
  SignProcessModalContextInt,
} from "../SignProcessMaster";

// interface SignReportConfirmProps { }

const SignReportConfirm: React.FC = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { model, repository, errorMessage } =
    React.useContext<SignProcessModalContextInt>(SignProcessModalContext);

  useEffect(() => {
    repository.previewFormConfiguration(model).subscribe({
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
  }, [iframeLoaded, model, repository]);

  return (
    <Row>
      <Col span={18}>
        <iframe
          title={"file_render"}
          id="preview__pdf_result"
          src={"/viewer/index.html"}
          style={{
            height: "calc(100vh - 240px)",
            width: "100%",
          }}
          onLoad={() => {
            setIframeLoaded(true);
          }}
          ref={iframeRef}
        ></iframe>
        <div className="w-100">
          {errorMessage &&
            errorMessage.length > 0 &&
            Array.isArray(errorMessage) &&
            errorMessage.map((err) => (
              <div className="mt-3 mb-3 pl-2 text-danger" key={err}>
                {err}
              </div>
            ))}
        </div>
      </Col>
      <Col span={6}>
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          {model.signatureConfigurations &&
            model.signatureConfigurations.length > 0 &&
            model.signatureConfigurations.map(
              (item: RequestFormConfigurationContent) => {
                return (
                  <div key={item.id} style={{ padding: "10px 20px" }}>
                    <InputText
                      label={item.previewDisplay}
                      value={item.previewDisplay}
                      disabled
                    />
                  </div>
                );
              }
            )}
        </Space>
      </Col>
    </Row>
  );
};

export default SignReportConfirm;
