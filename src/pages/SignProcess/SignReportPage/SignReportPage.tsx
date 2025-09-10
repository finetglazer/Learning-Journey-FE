/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Divider, Row } from "antd";
import React from "react";
import InformationSignature from "./InformationSignature/InformationSignature";
import CanvasPdf from "./CanvasPdf/CanvasPdf";
import { Attachments } from "./Attachments/Attachments";
import {
  SignProcessModalContext,
  SignProcessModalContextInt,
} from "../SignProcessMaster";

import "./SignReportPage.scss";
import { RequestFormConfigurationContent } from "models/RequestFormConfigurationContent";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import image from "../../../assets/images/image.svg";
import codeSigningService from "./../../../assets/images/code-signing-service.svg";
import classNames from "classnames";
import { pdfService } from "core/services/common-services/pdf-service";
import { usePdf } from "core/services/common-services/sign-report-service";
import { Pdf } from "core/services/service-types";

const SignReportPage = () => {
  const {
    model,
    dispatch,
    requestId,
    requestField,
    repository,
    errorMessage,
    haveDigitalSigining,
    typeRequirement,
    setListSignature,
  } = React.useContext<SignProcessModalContextInt>(SignProcessModalContext);
  const [selectedAttachment, setSelectedAttachment] =
    React.useState<RequestFormConfigurationContent>();
  const [signedCount, setSignedCount] = React.useState<number>(
    model?.signatureConfigurations?.length
  );
  const [maxSignedCount, setMaxSignedCount] = React.useState<number>(0);

  const [translate] = useTranslation();
  const { initialize, pages, setDimensions, dimensions } = usePdf();

  React.useEffect(() => {
    repository.listSignature({ id: requestId }).subscribe((res) => {
      setMaxSignedCount(res?.length || 0);
      setListSignature(res);
    });
  }, [repository, requestField, requestId]);

  const sizeOfDimensions = React.useMemo(() => {
    return {
      width: dimensions.width,
      height: dimensions.height,
    };
  }, [dimensions.width, dimensions.height]);

  const handleAddAttachment = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ xCoordinate, yCoordinate, signatureType, pageIndex }: any) => {
      const attachment = new RequestFormConfigurationContent();
      attachment.rowId = uuidv4();
      attachment.xCoordinate = xCoordinate;
      attachment.yCoordinate = yCoordinate;
      attachment.width = 156;
      attachment.height = 90;
      attachment.page = pageIndex;
      attachment.signatureType = signatureType;
      dispatch({
        type: "ADD_CONTENT",
        payload: {
          signatureConfigurations: [attachment],
        },
      });
      setSignedCount(signedCount + 1);
    },
    [dispatch, signedCount]
  );

  const handleRemoveAttachment = React.useCallback(
    (attachment: RequestFormConfigurationContent) => {
      dispatch({
        type: "REMOVE_CONTENT",
        payload: {
          signatureConfigurations: [attachment],
        },
      });
      setSignedCount(signedCount - 1);
    },
    [dispatch, signedCount]
  );

  const handleUpdateAttachment = React.useCallback(
    (attachment: RequestFormConfigurationContent) => {
      dispatch({
        type: "UPDATE_CONTENT",
        payload: {
          signatureConfigurations: [attachment],
        },
      });
    },
    [dispatch]
  );

  const handleGetAttachment = React.useCallback(
    (attachment: RequestFormConfigurationContent) => {
      setSelectedAttachment({ ...attachment });
    },
    []
  );

  const handleDragSignImage = React.useCallback((event: any) => {
    const dataJson = {
      x: event.clientX,
      y: event.clientY,
      typeId: 1,
    };
    event.dataTransfer.setData("dragPosition", JSON.stringify(dataJson));
  }, []);

  const handleDragSignDigital = React.useCallback((event: any) => {
    const dataJson = {
      x: event.clientX,
      y: event.clientY,
      typeId: 2,
    };
    event.dataTransfer.setData("dragPosition", JSON.stringify(dataJson));
  }, []);

  const handleDragLegalSignDigital = React.useCallback((event: any) => {
    const dataJson = {
      x: event.clientX,
      y: event.clientY,
      typeId: 3,
    };
    event.dataTransfer.setData("dragPosition", JSON.stringify(dataJson));
  }, []);

  React.useEffect(() => {
    if (model?.attachment?.systemFileId) {
      const convertPDFFile = async (file: Blob) => {
        try {
          const pdf = await pdfService.readAsPDF(file);
          const pdfDetail = {
            file,
            pages: Array(pdf.numPages)
              .fill(0)
              .map((_, index) => pdf.getPage(index + 1)),
          } as Pdf;
          initialize(pdfDetail);
        } catch (error) {
          throw new Error("Failed to load PDF");
        }
      };
      const subscription = repository
        .getFile(model?.attachment?.systemFileId?.toString())
        .subscribe({
          next: (res) => {
            const blob = new Blob([res.data], {
              type: "application/pdf",
            });
            convertPDFFile(blob);
          },
        });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [initialize, model?.attachment?.systemFileId, repository]);

  React.useEffect(() => {
    if (sizeOfDimensions.width > 0 && sizeOfDimensions.height > 0) {
      dispatch({
        type: "UPDATE_SIZE_DIMENSION",
        payload: {
          elementHeight: sizeOfDimensions.height,
          elementWidth: sizeOfDimensions.width,
        },
      });
    }
  }, [dispatch, sizeOfDimensions.height, sizeOfDimensions.width]);

  const isShowDegitalSign = React.useMemo(() => {
    let showLegalSign = false;
    let showPersonSign = false;
    if (!haveDigitalSigining) {
      showLegalSign = false;
      showPersonSign = false;
    }
    if (typeRequirement?.legalEntitySignatureRequirement !== 0) {
      const legalSign = model?.signatureConfigurations?.find(
        (item: RequestFormConfigurationContent) => item.signatureType === 3
      );
      showLegalSign = legalSign ? false : true;
    }
    if (typeRequirement?.personalSignatureRequirement !== 0) {
      showPersonSign = true;
    }

    return {
      showLegalSign,
      showPersonSign,
    };
  }, [
    haveDigitalSigining,
    model?.signatureConfigurations,
    typeRequirement?.legalEntitySignatureRequirement,
    typeRequirement?.personalSignatureRequirement,
  ]);

  return (
    <Row>
      <Col span={17}>
        <div style={{ maxHeight: "calc(100vh - 240px)", overflow: "scroll" }}>
          {pages.map((page: Promise<any>, index: number) => {
            const pageIndex = index + 1;
            const attachments =
              model.signatureConfigurations &&
              model.signatureConfigurations.length > 0
                ? model.signatureConfigurations.filter(
                    (item: RequestFormConfigurationContent) =>
                      item.page === pageIndex
                  )
                : [];

            return (
              <div className="page-pdf__container" key={pageIndex}>
                <CanvasPdf
                  id="canvas"
                  page={page}
                  pageIndex={index + 1}
                  dimensions={dimensions}
                  updateDimensions={setDimensions}
                  addText={handleAddAttachment}
                />
                <Attachments
                  attachments={attachments}
                  pdfName={model?.attachment?.name}
                  pageDimensions={dimensions}
                  removeAttachment={handleRemoveAttachment}
                  updateAttachment={handleUpdateAttachment}
                  getAttachment={handleGetAttachment}
                />
              </div>
            );
          })}
        </div>
        <div className="w-100">
          {errorMessage &&
            errorMessage.length > 0 &&
            errorMessage.map((err) => (
              <div className="mt-3 mb-3 pl-2 text-danger" key={err}>
                {err}
              </div>
            ))}
        </div>
      </Col>
      <Col span={7}>
        <div className="sign-process-master-action">
          <Divider type="vertical" style={{ height: "calc(100vh - 240px)" }} />
          <div className="sign-process-master-action__wrapper">
            <p className="sign-process-master-action__title">
              {translate("signReports.signArea")}
            </p>
            <div className="sign-process-master-action__content">
              <div
                className={classNames(
                  "sign-process-master-action__button d-flex flex-column ",
                  maxSignedCount > signedCount ? "pointer" : "no-drop"
                )}
                draggable={maxSignedCount > signedCount}
                onDragStart={handleDragSignImage}
              >
                <div className="button__title">
                  <img src={image} alt="IMG" height={24} width={24}></img>
                  <span>{translate("signReports.signImage")}</span>
                </div>
                <div className="triangle"></div>
              </div>
              {haveDigitalSigining && isShowDegitalSign?.showPersonSign && (
                <div
                  className={classNames(
                    "sign-process-master-action__button orange d-flex flex-column ",
                    "pointer"
                  )}
                  draggable={true}
                  onDragStart={handleDragSignDigital}
                >
                  <div className="button__title">
                    <img
                      src={codeSigningService}
                      alt="IMG"
                      height={24}
                      width={24}
                    ></img>
                    <span>{translate("signReports.personSign")}</span>
                  </div>
                  <div className="triangle orange"></div>
                </div>
              )}
              {haveDigitalSigining && isShowDegitalSign?.showLegalSign && (
                <div
                  className={classNames(
                    "sign-process-master-action__button critical d-flex flex-column ",
                    "pointer"
                  )}
                  draggable={true}
                  onDragStart={handleDragLegalSignDigital}
                >
                  <div className="button__title">
                    <img
                      src={codeSigningService}
                      alt="IMG"
                      height={24}
                      width={24}
                    ></img>
                    <span>{translate("signReports.legalSign")}</span>
                  </div>
                  <div className="triangle critical"></div>
                </div>
              )}
            </div>
            {selectedAttachment && selectedAttachment?.signatureType !== 3 ? (
              <InformationSignature
                requestFormConfiguration={model}
                currentContent={selectedAttachment}
                updateContent={setSelectedAttachment}
                updateAttachment={handleUpdateAttachment}
                requestId={requestId}
                requestField={requestField}
                repository={repository}
                haveDigitalSigining={haveDigitalSigining}
              />
            ) : null}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default SignReportPage;
