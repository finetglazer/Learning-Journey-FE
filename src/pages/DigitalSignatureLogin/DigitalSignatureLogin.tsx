import { Card, Col, Radio, Row, Space, Spin } from "antd";
import { RadioChangeEvent } from "antd/lib";
import { AxiosError } from "axios";
import { CredentialModel, SignatureInfo } from "models/SignatureInfo";
import React from "react";
import { InputText, Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

interface DigitalSignatureLoginProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signatureMethod?: (signatureInfo: SignatureInfo) => Observable<any>;
  handleSuccess?: () => void;
  fileId?: number;
  requestId?: number;
}

const DigitalSignatureLogin = (props: DigitalSignatureLoginProps) => {
  const {
    visible,
    setVisible,
    signatureMethod,
    handleSuccess,
    requestId,
    fileId,
  } = props;

  const [translate] = useTranslation();

  const [loading, setLoading] = React.useState(false);

  const [signatureInfo, setSignatureInfo] = React.useState<SignatureInfo>({});

  const [credentialList, setCredentialList] = React.useState<CredentialModel[]>(
    []
  );

  const [errorMessage, setErrorMessage] = React.useState(null);

  const handleChangeField = React.useCallback(
    (fieldName: string) => (value: string) => {
      const signatureInfoValue = { ...signatureInfo };
      signatureInfoValue[fieldName] = value;
      setSignatureInfo(signatureInfoValue);
    },
    [signatureInfo]
  );

  const handleChangeCredential = React.useCallback(
    (id: string) => {
      const signatureInfoValue = { ...signatureInfo };
      signatureInfoValue["credentialId"] = id;
      setSignatureInfo(signatureInfoValue);
    },
    [signatureInfo]
  );

  const handleSave = React.useCallback(() => {
    setLoading(true);
    const payload: SignatureInfo = { ...signatureInfo };
    payload.requestId = requestId;
    payload.fileId = fileId;
    signatureMethod(payload)
      .pipe(
        finalize(() => {
          setLoading(false);
        })
      )
      .subscribe({
        next: () => {
          handleSuccess();
        },
        error: (err: AxiosError) => {
          const errorMessage = err.response.data;
          if (typeof errorMessage === "object") {
            setCredentialList(errorMessage);
            setErrorMessage(undefined);
          } else {
            setErrorMessage(errorMessage);
            setCredentialList(undefined);
          }
        },
      });
  }, [signatureInfo, requestId, fileId, signatureMethod, handleSuccess]);

  const handleCancel = React.useCallback(() => {
    setSignatureInfo({});
    setVisible(false);
  }, [setVisible]);

  return (
    <Modal
      maskClosable={false}
      open={visible}
      handleSave={handleSave}
      handleCancel={handleCancel}
      visibleFooter={!loading}
      width={credentialList?.length > 0 ? 1000 : 500}
      titleButtonApply={translate("signatureInfo.button.send")}
    >
      {loading && (
        <div className="loading-block">
          <Spin size="large" />
        </div>
      )}
      <div className="page page__detail">
        <div className="page__modal-header w-100">
          <div className="page__modal-header-block"></div>
          <Row className="d-flex">
            <Col lg={24} className="page__modal-header-title">
              {translate("signatureInfo.title")}
            </Col>
          </Row>
        </div>
        <div className="w-100 page__detail-tabs">
          <Row className="d-flex">
            <Col lg={24}>
              <Card>
                <Row>
                  <Col lg={24}>
                    <InputText
                      value={signatureInfo.username}
                      placeHolder={translate(
                        "signatureInfo.placeholder.username"
                      )}
                      className={"tio-user"}
                      onChange={handleChangeField("username")}
                    />
                  </Col>
                  <Col lg={24}>
                    <InputText
                      typeInput={"password"}
                      value={signatureInfo.password}
                      placeHolder={translate(
                        "signatureInfo.placeholder.password"
                      )}
                      className={"tio-password"}
                      onChange={handleChangeField("password")}
                    />
                  </Col>
                  {credentialList?.length && (
                    <Col lg={24}>
                      <div className="text-danger m-t--xs">
                        {translate("signatureInfo.warningDigitalSignature")}
                      </div>
                      <Radio.Group
                        onChange={(e: RadioChangeEvent) => {
                          handleChangeCredential(e.target.value);
                        }}
                        value={signatureInfo?.credentialId}
                        style={{
                          maxHeight: 300,
                          overflow: "scroll",
                        }}
                      >
                        <Space direction="vertical">
                          {credentialList?.map((cre) => {
                            return (
                              <Radio
                                value={cre?.credentialId}
                                key={cre?.credentialId}
                              >
                                <div>
                                  <div>
                                    <strong>SubjectDN</strong>: {cre?.subjectDN}
                                  </div>
                                  <div>
                                    <strong>IssueDN</strong>: {cre?.issuerDN}
                                  </div>
                                  <div>
                                    <strong>SerialNumber</strong>:{" "}
                                    {cre?.serialNumber}
                                  </div>
                                </div>
                              </Radio>
                            );
                          })}
                        </Space>
                      </Radio.Group>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          </Row>
          {errorMessage && (
            <div className="d-flex">
              <span className="text-danger">{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DigitalSignatureLogin;
