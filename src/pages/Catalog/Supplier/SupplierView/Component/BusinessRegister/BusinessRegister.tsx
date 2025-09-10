import { getIconFile } from "core/helpers/common";

import { isEmpty } from "lodash";

import { RequestAttachment } from "models/Proposal";
import { useContext } from "react";
import { UploadFile } from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { SupplierViewContext } from "../../SupplierViewHook";
import "../AttachmentOther/AttachmentOther.scss";
import { OpinionCollectorIcon } from "assets/icons";
import { useTranslation } from "react-i18next";

export interface FileModelExtend extends FileModel {
  systemFileId?: string | number;
  isBusinessRegistration?: boolean;
}
const ICON_SIZE_LARGE = 24;

export default function BusinessRegister() {
  const { model, handleDownloadFileAttached } = useContext(SupplierViewContext);
  const [translate] = useTranslation();

  const businessFiles = model?.attachments?.filter(
    (file: RequestAttachment) => file.isBusinessRegistration === true
  );
  return (
    <div className="attachments w-100">
      {isEmpty(businessFiles) ? (
        <div className="empty_data_section w-100">
          <img src={OpinionCollectorIcon} alt="Icon" />
          <div className="body">
            <span>{translate("SL.emptyRegister")}</span>
          </div>
        </div>
      ) : (
        <div className="items">
          {businessFiles?.map((file: RequestAttachment) => (
            <UploadFile.FileLoadedContent
              key={file?.systemFileId}
              file={{ ...file, id: file.systemFileId }}
              className="items-view_file"
              onClickFile={() => handleDownloadFileAttached(file)}
              icon={
                <img
                  src={getIconFile(file)}
                  width={ICON_SIZE_LARGE}
                  height={ICON_SIZE_LARGE}
                  alt=""
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
