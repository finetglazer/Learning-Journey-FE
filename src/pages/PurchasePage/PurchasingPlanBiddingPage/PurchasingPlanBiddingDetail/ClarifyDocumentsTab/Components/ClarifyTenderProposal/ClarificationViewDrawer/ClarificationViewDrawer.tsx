import React from "react";
import styles from "./ClarificationViewDrawer.module.scss";
import { Drawer, Tag, UploadFile } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ClarificationFile } from "../../ClarificationDetailDrawer/ClarificationFileUpload";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { isArray } from "lodash";
import { Col, Divider, Row } from "antd";
import { getIconFile } from "core/helpers/common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { budgetRepository } from "../../../../../../../BudgetPage/BudgetRepository";
import type { AxiosResponse } from "axios";
import saveAs from "file-saver";
import { classificationMap } from "../../../../../constants";
import { ClarificationDetailModel } from "models/PurchasingPlan";

interface ClarificationDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: ClarificationDetailModel;
}

export const ClarificationViewDrawer: React.FC<
  ClarificationDetailDrawerProps
> = ({ visible, onClose, data }) => {
  const [translate] = useTranslation();
  const isResponded = true;

  // Create fields for request section
  const response = data?.response;

  const requestFields = [
    {
      value: translate("PL.txt_msb_staff_requestor") + ":",
      isShow: true,
    },
    {
      value: data?.user?.name,
      isShow: true,
    },
    {
      value: translate("PL.clarification_title") + ":",
      isShow: true,
    },
    {
      value: data?.title,
      isShow: true,
    },
    {
      value: translate("PL.clarification_content") + ":",
      isShow: true,
    },
    {
      value: data?.content,
      isShow: true,
      isContent: true,
    },
    {
      value: translate("PL.txt_clarification_sent_date") + ":",
      isShow: true,
    },
    {
      value: formatDate(data?.createdDate, STANDARD_DATE_FORMAT_SLASH),
      isShow: true,
    },
    {
      value: translate("PL.clarification_file") + ":",
      isShow: true,
    },
    {
      value: data?.attachments,
      isShow: true,
    },
  ];

  // Create fields for response section (if responded)
  const responseFields = isResponded
    ? [
        {
          value: translate("PL.txt_supplier_responder") + ":",
          isShow: true,
        },
        {
          value: data?.supplier?.name,
          isShow: true,
        },
        {
          value: translate("PL.response_content") + ":",
          isShow: true,
        },
        {
          value: response?.content,
          isShow: true,
          isContent: true,
        },
        {
          value: translate("PL.response_submission_date") + ":",
          isShow: true,
        },
        {
          value: formatDate(response?.createdDate, STANDARD_DATE_FORMAT_SLASH),
          isShow: true,
        },
        {
          value: translate("PL.response_file") + ":",
          isShow: true,
        },
        {
          value: response?.attachments,
          isShow: true,
        },
      ]
    : [];

  const renderTag = (type) => {
    const item = classificationMap[type];
    if (!item) return null;
    return (
      <div>
        <Tag
          size="sm"
          value={item?.name}
          status={item?.code}
          isShowDot={false}
          isShowBorder={true}
        />
      </div>
    );
  };

  const handleDownloadFileAttached = (file?: FileModel) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const renderContent = (fields: any[]) => {
    return fields?.map(
      (item, index) =>
        item.isShow && (
          <Col span={index % 2 ? 19 : 5} key={index}>
            {isArray(item.value) ? (
              <Row gutter={[8, 8]} className="file-loaded-list">
                {item?.value?.map((file: ClarificationFile, index: number) => (
                  <Col span={8} key={`file-${index}`}>
                    <UploadFile.FileLoadedContent
                      key={`file-${index}`}
                      file={{ ...file, id: file.systemFileId }}
                      onClickFile={() => handleDownloadFileAttached(file)}
                      isViewMode={true}
                      icon={
                        <img
                          src={getIconFile(file)}
                          alt="img"
                          width={24}
                          height={24}
                        />
                      }
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className={index % 2 ? styles.value : styles.label}>
                {item?.isContent ? (
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                    dangerouslySetInnerHTML={{ __html: item?.value }}
                  ></div>
                ) : (
                  item?.value
                )}
              </div>
            )}
          </Col>
        )
    );
  };

  return (
    <Drawer
      size="max"
      visible={visible}
      handleClose={onClose}
      title={
        <strong>{translate("PL.details_of_bid_proposal_clarification")}</strong>
      }
      titleButtonApply={translate("CM.txt_save")}
      titleButtonCancel={translate("CM.btn_close")}
      isHaveCloseIcon={true}
      hasOverlay={true}
      visibleFooter={true}
      loading={false}
      handleCancel={onClose}
      className={styles.drawer}
      isShowButtonCancel={true}
      isShowButtonApply={false}
    >
      <div className="d-flex align-items-center gap-2">
        <div className={styles.text_title}>
          {translate("PL.txt_clarification_classification")}
        </div>
        <div>{renderTag(data?.classification)}</div>
      </div>
      <Row className="mt-3" gutter={[16, 12]}>
        {renderContent(requestFields)}
      </Row>
      {isResponded && <Divider />}
      <Row className="mt-3" gutter={[16, 12]}>
        {renderContent(responseFields)}
      </Row>
    </Drawer>
  );
};
