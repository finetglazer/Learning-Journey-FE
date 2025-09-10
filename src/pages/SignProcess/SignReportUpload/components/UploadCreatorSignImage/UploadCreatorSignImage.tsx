/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row } from "antd";
import classNames from "classnames";
import { pdfService } from "core/services/common-services/pdf-service";
import { usePdf } from "core/services/common-services/sign-report-service";
import { Pdf } from "core/services/service-types";
import { isEqual } from "lodash";
import { RequestFormConfigurationContent } from "models/RequestFormConfigurationContent";
import {
  SignProcessModalContext,
  SignProcessModalContextInt,
} from "pages/SignProcess/SignProcessMaster";
import { Attachments } from "pages/SignProcess/SignReportPage/Attachments/Attachments";
import CanvasPdf from "pages/SignProcess/SignReportPage/CanvasPdf/CanvasPdf";
import React from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import image from "../../../../../assets/images/image.svg";
import { AESdecrypt } from "core/helpers/common";
interface UploadCreatorSignImageProps {
  pdfBlob?: Blob;
  leftContent?: React.ReactNode;
  creatorSignAttachment?: RequestFormConfigurationContent;
  setCreatorSignAttachment?: (
    attachment: RequestFormConfigurationContent
  ) => void;
}
const UploadCreatorSignImage = (props: UploadCreatorSignImageProps) => {
  const { model, dispatch } = React.useContext<SignProcessModalContextInt>(
    SignProcessModalContext
  );

  const {
    pdfBlob,
    leftContent,
    creatorSignAttachment,
    setCreatorSignAttachment,
  } = props;

  const [translate] = useTranslation();
  const { initialize, pages, setDimensions, dimensions } = usePdf();

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
      attachment.previewDisplay = AESdecrypt(localStorage.getItem("email"));
      setCreatorSignAttachment(attachment);
    },
    [setCreatorSignAttachment]
  );

  const handleRemoveAttachment = React.useCallback(() => {
    setCreatorSignAttachment(null);
  }, [setCreatorSignAttachment]);

  const handleUpdateAttachment = React.useCallback(
    (attachment: RequestFormConfigurationContent) => {
      setCreatorSignAttachment({ ...attachment });
    },
    [setCreatorSignAttachment]
  );

  const handleDragSignImage = React.useCallback((event: any) => {
    const dataJson = {
      x: event.clientX,
      y: event.clientY,
      typeId: 1,
    };
    event.dataTransfer.setData("dragPosition", JSON.stringify(dataJson));
  }, []);

  React.useEffect(() => {
    if (pdfBlob) {
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
      convertPDFFile(pdfBlob);
    }
  }, [initialize, pdfBlob]);

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

  return (
    <Row className="w-100">
      <Col span={7} className="p-r--sm m-t--2xs">
        <div className="sign-process-master-action">
          <div>
            {!(typeof creatorSignAttachment?.page === "number") && (
              <div className="sign-process-master-action__wrapper">
                <div className="sign-process-master-action__content">
                  <div
                    className={classNames(
                      "sign-process-master-action__button d-flex flex-column ",
                      "pointer"
                    )}
                    draggable={true}
                    onDragStart={handleDragSignImage}
                  >
                    <div className="button__title">
                      <img src={image} alt="IMG" height={24} width={24}></img>
                      <span>{translate("signReports.signImageCreator")}</span>
                    </div>
                    <div className="triangle"></div>
                  </div>
                </div>
              </div>
            )}

            {leftContent}
          </div>
        </div>
      </Col>
      <Col span={17}>
        <div style={{ maxHeight: "calc(100vh - 315px)", overflow: "scroll" }}>
          {pages.map((page: Promise<any>, index: number) => {
            const pageIndex = index + 1;
            const attachments = isEqual(creatorSignAttachment?.page, pageIndex)
              ? [creatorSignAttachment]
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
                  getAttachment={() => undefined}
                />
              </div>
            );
          })}
        </div>
      </Col>
    </Row>
  );
};

export default UploadCreatorSignImage;
