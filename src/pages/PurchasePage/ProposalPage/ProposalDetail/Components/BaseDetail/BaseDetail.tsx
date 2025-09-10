/* eslint-disable import/no-unresolved */
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import {
  ProposalCreateModel,
  ProposalReferences,
  RequestAttachment,
} from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import "./BaseDetail.scss";
import { isEmpty } from "lodash";
import { UploadFile } from "react-components-design-system";
import { getIconFile } from "core/helpers/common";

const BaseDetail = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);
  const { model, handleDownloadFileAttached } = useContext<ProposalCreateModel>(
    ProposalCreateHookContext
  );

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  if (isEmpty(model?.proposalReferences)) return null;

  const renderAttachFile = (requestAttachment: RequestAttachment[]) => {
    return (
      <div className="attach-file-wrapper">
        {requestAttachment?.map((file, index) => {
          return (
            <UploadFile.FileLoadedContent
              key={index}
              file={{ ...file, id: file.systemFileId, name: file.name }}
              className={"file-item-base"}
              isViewMode={true}
              onClickFile={() => handleDownloadFileAttached(file)}
              icon={
                <img src={getIconFile(file)} alt="gif" width={20} height={20} />
              }
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="base_wrapper">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{translate("PP.base")}</div>
        <div>
          <img
            className={classNames("cursor-pointer", {
              "rotate-180": collapse,
              "rotate-0": !collapse,
            })}
            src={IcArrowDown}
            alt="img"
            width={16}
            height={16}
          />
        </div>
      </div>
      {collapse && (
        <div className="base_wrapper_body">
          <div className="base_wrapper__table">
            <div className="table__header">
              <div className="table__header__item_first">
                {translate("PP.document_description")}
              </div>
              <div className="table__header__item_last">
                {translate("PP.attach")}
              </div>
            </div>
            <div className="table__content_base">
              {model?.proposalReferences?.map(
                (item: ProposalReferences, index) => {
                  return (
                    <div className="table__content__item" key={index}>
                      <div className="table__content__item__first">
                        {item.description}
                      </div>
                      <div className="table__content__item__last">
                        {renderAttachFile(item.attachments)}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseDetail;
