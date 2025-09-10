/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import "./BusinessDepartmentPreview.scss";
import {
  BusinessDepartmentMasterContext,
  BusinessDepartmentMasterContextModel,
} from "../BusinessDepartmentMaster/BusinessDepartmentMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty, isEqual } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";
import { formatDate } from "core/helpers/date-time";
import { Col, Row } from "antd";

const BusinessDepartmentPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<BusinessDepartmentMasterContextModel>(
    BusinessDepartmentMasterContext
  );

  const { notifyToast } = appMessageService.useCRUDMessage();

  const copyToClipboard = () => {
    const textToCopy = model?.code;
    if (isEmpty(textToCopy)) return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        notifyToast({
          message: translate("CL.copied_to_clipboard_message"),
        });
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  return (
    <>
      <Modal
        open={isOpenPreviewModal}
        title={translate("businessDepartments.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="business-branch-view-body">
          <Tag
            size="md"
            value={
              isEqual(model?.isActive, true)
                ? translate("businessDepartments.active")
                : translate("businessDepartments.inactive")
            }
            status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
            isShowDot={false}
            isShowBorder={true}
            className="business-branch__status"
          />
          <span className="business-branch__name">{model?.name}</span>
          <div className="business-branch__code" onClick={copyToClipboard}>
            <span className="business-branch__code-value">{model?.code}</span>
            <div className="business-branch__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="business-branch__item">
            <span className="business-branch__item-label">
              {translate("businessDepartments.businessUnit")}
            </span>
            <span className="business-branch__item-description">
              {model?.businessUnitName}
            </span>
          </div>

          <Row gutter={16}>
            <Col lg={12}>
              <div className="business-branch__item">
                <span className="business-branch__item-label">
                  {translate("businessDepartments.startDate")}
                </span>
                <span className="business-branch__item-description">
                  {formatDate(model?.startDate)}
                </span>
              </div>
            </Col>
            <Col lg={12}>
              <div className="business-branch__item">
                <span className="business-branch__item-label">
                  {translate("businessDepartments.endDate")}
                </span>
                <span className="business-branch__item-description">
                  {formatDate(model?.endDate)}
                </span>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default BusinessDepartmentPreview;
