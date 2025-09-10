/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions */
import React from "react";
import { SignatureAttachment } from "./SignatureAttachment/SignatureAttachment";
import { RequestFormConfigurationContent } from "models/RequestFormConfigurationContent";
import { Dimensions } from "core/services/service-types";

interface Props {
  attachments: RequestFormConfigurationContent[];
  pdfName: string;
  pageDimensions: Dimensions;
  removeAttachment: (attachment: RequestFormConfigurationContent) => void;
  updateAttachment: (attachment: RequestFormConfigurationContent) => void;
  getAttachment: (attachment: RequestFormConfigurationContent) => void;
}

export const Attachments: React.FC<Props> = ({
  pageDimensions,
  getAttachment,
  removeAttachment,
  updateAttachment,
  attachments,
}) => {
  const handleUpdateTextAttachment = React.useCallback(
    (attachment: RequestFormConfigurationContent) =>
      ({ xCoordinate, yCoordinate, height, width }: any) => {
        const newAttachment = { ...attachment };
        newAttachment.xCoordinate = xCoordinate;
        newAttachment.yCoordinate = yCoordinate;
        newAttachment.height = height;
        newAttachment.width = width;
        updateAttachment(newAttachment);
      },
    [updateAttachment]
  );

  return attachments ? (
    <>
      {attachments.length
        ? attachments.map((attachment: RequestFormConfigurationContent) => {
            const key = attachment.id ? attachment.id : attachment.rowId;
            return (
              <React.Fragment key={key}>
                {" "}
                <SignatureAttachment
                  {...(attachment as RequestFormConfigurationContent)}
                  pageWidth={pageDimensions.width}
                  pageHeight={pageDimensions.height}
                  removeSignature={() => removeAttachment(attachment)}
                  updateTextAttachment={handleUpdateTextAttachment(attachment)}
                  getAttachment={() => getAttachment(attachment)}
                  text={
                    attachment.previewDisplay ??
                    (attachment.signatureType === 1
                      ? "Chữ ký ảnh"
                      : attachment.signatureType === 2
                      ? "Ký số cá nhân"
                      : "Ký số pháp nhân")
                  }
                />
              </React.Fragment>
            );
          })
        : null}
    </>
  ) : null;
};
