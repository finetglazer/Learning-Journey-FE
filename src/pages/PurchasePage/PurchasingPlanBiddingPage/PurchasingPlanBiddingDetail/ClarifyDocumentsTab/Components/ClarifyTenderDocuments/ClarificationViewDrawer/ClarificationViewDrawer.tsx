import React, { useCallback, useContext, useState } from "react";
import styles from "./ClarificationViewDrawer.module.scss";
import {
  Drawer,
  FormItem,
  InputText,
  Tag,
  TextArea,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  ClarificationFile,
  ClarificationFileUpload,
} from "../../ClarificationDetailDrawer/ClarificationFileUpload";
import { formatDate } from "core/helpers/date-time";
import {
  MAX_LENGTH_250,
  MAX_LENGTH_500,
  NOT_TAB_ENTER_REGEX,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { cloneDeep, isArray, isEmpty, size } from "lodash";
import { Col, Row } from "antd";
import { getIconFile } from "core/helpers/common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { budgetRepository } from "../../../../../../../BudgetPage/BudgetRepository";
import type { AxiosResponse } from "axios";
import saveAs from "file-saver";
import { classificationMap } from "../../../../../constants";
import {
  ClarificationDetailModel,
  ClarificationResponseBody,
  RespondStatus,
  TextValidationRule,
  ValidationRule,
} from "models/PurchasingPlan";
import { useAppSelector } from "rtk/useRedux";
import { utilService } from "core/services/common-services/util-service";
import { TEXT_AREA_MAX_LENGTH } from "../../../../../../../Catalog/constants";
import { PurchasingPlanBiddingDetailHookContext } from "../../../../PurchasingPlanBiddingDetailHook";

interface ClarificationDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: ClarificationDetailModel & {
    action: string;
  };
}

export const ClarificationViewDrawer: React.FC<
  ClarificationDetailDrawerProps
> = ({ visible, onClose, data }) => {
  const context = useContext(PurchasingPlanBiddingDetailHookContext);
  const [translate] = useTranslation();
  const canRespond = data?.canResponse;
  const isView = !data?.action;
  const status = data?.status;

  // Create fields for request section
  const requestFields = [
    {
      value: translate("PL.txt_requesting_supplier") + ":",
      isShow: true,
    },
    {
      value: data?.supplier?.name,
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
  const response = data?.response;
  const responseFields = isView
    ? [
        {
          value: translate("PL.txt_msb_staff_responder"),
          isShow: true,
        },
        {
          value: response?.createUser,
          isShow: true,
        },
        {
          value: translate("PL.response_content"),
          isShow: true,
        },
        {
          value: response?.content,
          isShow: true,
          isContent: true,
        },
        {
          value: translate("PL.response_submission_date"),
          isShow: true,
        },
        {
          value: isEmpty(response?.createdDate)
            ? null
            : formatDate(response?.createdDate, STANDARD_DATE_FORMAT_SLASH),
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

  const renderTag = (type: any) => {
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

  const profile = useAppSelector((state) => state.profile);
  const accountRespond = profile?.account;

  const [model, setModel] = useState<any>({
    errors: {},
    files: [],
  });

  // Hàm xử lý thay đổi giá trị
  const handleChangeValue = useCallback(
    (fieldName: string, value: any) => {
      const validationRules: Record<string, ValidationRule> = {
        content: {
          maxLength: MAX_LENGTH_500,
          isRequired: true,
        },
      };

      const newError = cloneDeep(model?.errors) || {};
      const rules = validationRules[fieldName];

      if (rules) {
        newError[fieldName] = null;

        if (rules.isRequired && isEmpty(value)) {
          newError[fieldName] = translate("CM.input_require_validation");
        } else if (!isEmpty(value) && typeof value === "string") {
          // Kiểm tra xem rules có thuộc tính maxLength và regex không bằng Type Guard
          const textRules = rules as TextValidationRule;

          if (textRules.regex && !textRules.regex.test(value)) {
            newError[fieldName] = translate("RG.error_input.invalidCharacters");
          } else if (
            textRules.maxLength &&
            value.length > textRules.maxLength
          ) {
            newError[fieldName] = translate("CM.input_length_validation", {
              maxLength: textRules.maxLength,
            });
          }
        }
      }

      setModel((prev: any) => ({
        ...prev,
        [fieldName]: value,
        errors: newError,
      }));
    },
    [model?.errors, translate]
  );

  // Xác thực tất cả các trường trước khi lưu
  const validateAll = useCallback(() => {
    const requiredFields: (keyof ClarificationDetailModel)[] = ["content"];

    // Tạo một bản sao của errors hoặc một object rỗng nếu errors không tồn tại
    const errors: Record<string, string> = { ...(model?.errors || {}) };

    // Kiểm tra các trường bắt buộc
    requiredFields.forEach((field) => {
      if (isEmpty(model?.[field])) {
        errors[field] = translate("CM.input_require_validation");
      }
    });

    const titleField = model?.title || "";
    const contentField = model?.content || "";

    // Kiểm tra định dạng đầu vào cho tiêu đề
    if (titleField && !NOT_TAB_ENTER_REGEX.test(titleField)) {
      errors.title = translate("RG.error_input.invalidCharacters");
    } else if (titleField && titleField.length > MAX_LENGTH_250) {
      errors.title = translate("CM.input_length_validation", {
        maxLength: MAX_LENGTH_250,
      });
    }

    // Kiểm tra độ dài nội dung
    if (contentField && contentField.length > MAX_LENGTH_500) {
      errors.content = translate("CM.input_length_validation", {
        maxLength: MAX_LENGTH_500,
      });
    }

    const isValidError = Object.values(errors).some((error) => !isEmpty(error));

    if (isValidError) {
      setModel((prev) => ({
        ...prev,
        errors: errors,
      }));
      return false;
    }

    return true;
  }, [model, translate]);

  // Xử lý thay đổi files
  const handleFilesChange = useCallback((files: any[]) => {
    setModel((prev) => ({
      ...prev,
      files,
    }));
  }, []);

  // Xử lý nút Lưu
  const handleSave = useCallback(async () => {
    if (!validateAll()) {
      return;
    }

    const dataSave: ClarificationResponseBody = {
      content: model?.content,
      attachments: model?.files,
    };
    await context?.sendClarificationResponse(dataSave, data?.id || "");
    onClose();
  }, [model, onClose, validateAll]);

  return (
    <Drawer
      size="max"
      visible={visible}
      handleClose={onClose}
      handleSave={handleSave}
      title={
        <strong>
          {translate("PL.details_of_bidding_document_clarification")}
        </strong>
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
      isShowButtonApply={canRespond}
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
      {canRespond && !isView ? (
        <div>
          <div className={styles.line}></div>
          <div>
            <Row gutter={[16, 16]}>
              {/* CBNV MSB yêu cầu - chỉ hiển thị, không sửa */}
              <Col span={24}>
                <InputText
                  isSmall={false}
                  label={translate("PL.txt_msb_staff_responder")}
                  readOnly={true}
                  value={accountRespond?.name}
                  className={"input-text--read-only"}
                />
              </Col>
              {/* Nội dung phản hồi - bắt buộc */}
              <Col span={24}>
                <FormItem
                  validateObject={utilService.getValidateObj(model, "content")}
                >
                  <TextArea
                    isRequired={true}
                    label={translate("PL.clarification_content")}
                    placeHolder={translate(
                      "PL.purchasing_plan_content_placeholder"
                    )}
                    value={model?.content}
                    onChange={(value) => handleChangeValue("content", value)}
                    showCount
                    maxLength={TEXT_AREA_MAX_LENGTH}
                    resize="none"
                    translate={translate}
                  />
                </FormItem>
              </Col>

              {/* File làm rõ - không bắt buộc */}
              <Col span={24}>
                <div className="mb-3">
                  <label className={styles.label_title}>
                    {translate("PL.clarification_file")}
                  </label>
                  <ClarificationFileUpload
                    files={model?.files || []}
                    onChangeFiles={handleFilesChange}
                    isView={false}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        responseFields &&
        size(responseFields) > 0 &&
        status !== RespondStatus.NoRespond && (
          <div>
            <div className={styles.line}></div>
            <Row gutter={[16, 12]}>{renderContent(responseFields)}</Row>
          </div>
        )
      )}
    </Drawer>
  );
};
