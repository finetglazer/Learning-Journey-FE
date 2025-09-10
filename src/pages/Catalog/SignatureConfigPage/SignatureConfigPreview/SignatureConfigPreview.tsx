/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./SignatureConfigPreview.scss";
import {
  SignatureConfigMasterContext,
  SignatureConfigMasterContextModel,
} from "../SignatureConfigMaster/SignatureConfigMasterHook";

import { isEqual } from "lodash";

const SignatureConfigPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<SignatureConfigMasterContextModel>(
    SignatureConfigMasterContext
  );

  return (
    <>
      <Modal
        open={isOpenPreviewModal}
        title={translate("signatureConfigs.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="signatureConfig-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("signatureConfigs.active")
                : translate("signatureConfigs.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="signature-supplier__status"
          />
          <div className="signature-supplier__item m-t--md">
            <span className="signature-supplier__item-label">
              {translate("signatureConfigs.signatureSupplier")}
            </span>
            <span className="signature-supplier__item-description">
              {model?.signatureSupplierName}
            </span>
          </div>

          <div className="signature-supplier__item m-t--md">
            <span className="signature-supplier__item-label">
              {translate("signatureConfigs.user")}
            </span>
            <span className="signature-supplier__item-description">
              {`${model?.user?.name} - ${model?.user?.email}`}
            </span>
          </div>
          <div className="signature-supplier__item m-t--md">
            <span className="signature-supplier__item-label">
              {translate("signatureConfigs.citizenIdentification")}
            </span>
            <span className="signature-supplier__item-description">
              {model?.citizenIdentification}
            </span>
          </div>

          <div className="signature-supplier__item m-t--md">
            <span className="signature-supplier__item-label">
              {translate("signatureConfigs.description")}
            </span>
            <span className="signature-supplier__item-description">
              {model?.description}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SignatureConfigPreview;
