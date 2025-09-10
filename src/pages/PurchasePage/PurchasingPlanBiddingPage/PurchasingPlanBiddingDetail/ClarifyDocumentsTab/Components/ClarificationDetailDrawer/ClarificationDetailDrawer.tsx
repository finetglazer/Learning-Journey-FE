import React, { useCallback, useContext, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { cloneDeep, isEmpty } from "lodash";
import {
  Drawer,
  FormItem,
  InputText,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  MAX_LENGTH_250,
  MAX_LENGTH_500,
  NOT_TAB_ENTER_REGEX,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { formatDate } from "core/helpers/date-time";
import { of } from "rxjs";

import { ClarificationFileUpload } from "./ClarificationFileUpload";
import { ModelFilter } from "react-3layer-common";
import { TEXT_AREA_MAX_LENGTH } from "../../../../../../Catalog/constants";
import styles from "./ClarificationDetailDrawer.module.scss";
import {
  ClarificationDetailDrawerProps,
  ClarificationDetailModel,
  ClarificationType,
  CriteriaType,
  QuotationClarificationRequest,
  TextValidationRule,
  ValidationRule,
} from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "../../../PurchasingPlanBiddingDetailHook";
import { purchasingPlanRepository } from "../../../../../PurchasingPlanPage/PurchasingPlanRepository";
import { useParams } from "react-router-dom";

export const ClarificationDetailDrawer: React.FC<
  ClarificationDetailDrawerProps
> = ({
  visible,
  onClose,
  currentItem,
  onSave,
  isView = false,
  suppliersData = [],
  currentUser,
}) => {
  const context = useContext(PurchasingPlanBiddingDetailHookContext);
  const [translate] = useTranslation();
  const [model, setModel] = useState<any>({
    errors: {},
    files: [],
  });

  // Khởi tạo model khi mở drawer
  useEffect(() => {
    if (visible) {
      if (currentItem) {
        // Nếu đang chỉnh sửa một mục có sẵn
        setModel({
          ...currentItem,
          errors: {},
        });
      } else {
        // Nếu đang tạo mới
        const now = new Date();
        setModel({
          msb_requestor: currentUser?.name || "",
          clarificationDate: formatDate(now),
          errors: {},
          files: [],
        });
      }
    }
  }, [visible, currentItem, currentUser]);

  // Hàm xử lý thay đổi giá trị
  const handleChangeValue = useCallback(
    (fieldName: string, value: any) => {
      const validationRules: Record<string, ValidationRule> = {
        title: {
          maxLength: MAX_LENGTH_250,
          regex: NOT_TAB_ENTER_REGEX,
          isRequired: true,
        },
        content: {
          maxLength: MAX_LENGTH_500,
          isRequired: true,
        },
        clarificationType: {
          isRequired: true,
        },
        supplier: {
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

      setModel((prev) => ({
        ...prev,
        [fieldName]: value,
        errors: newError,
      }));
    },
    [model?.errors, translate]
  );

  // Xác thực tất cả các trường trước khi lưu
  const validateAll = useCallback(() => {
    const requiredFields: (keyof ClarificationDetailModel)[] = [
      "clarificationType",
      "supplier",
      "title",
      "content",
    ];

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

  // Xử lý nút Lưu
  const handleSave = useCallback(async () => {
    const modelMaster = context?.model;
    const quotationRequestId =
      modelMaster?.offerSummary?.offerRequest?.[0]?.quotationRequestId;

    if (!validateAll()) {
      return;
    }

    const body: QuotationClarificationRequest = {
      title: model?.title,
      content: model?.content,
      attachments: model?.files,
      supplierId: model?.supplier?.id,
      classification: model?.clarificationType?.id,
      type: ClarificationType.BidSubmission,
      quotationRequestId: quotationRequestId,
    };

    await context.sendClarificationRequest(body);

    onSave(model);
    onClose();
  }, [model, onClose, onSave, validateAll]);

  // Xử lý thay đổi files
  const handleFilesChange = useCallback((files: any[]) => {
    setModel((prev) => ({
      ...prev,
      files,
    }));
  }, []);

  // Mô hình dữ liệu cho loại yêu cầu làm rõ
  const clarificationTypes = [
    {
      id: CriteriaType.Finance,
      name: translate("PL.txt_review_summary_finance"),
      code: "FINANCIAL",
    },
    {
      id: CriteriaType.TechnicalCompetence,
      name: translate("PL.review_summary.technique"),
      code: "TECHNICAL",
    },
  ];

  const params = useParams();

  return (
    <Drawer
      size="max"
      visible={visible}
      handleClose={onClose}
      title={
        <strong>
          {translate("PL.details_of_bidding_document_clarification")}
        </strong>
      }
      titleButtonApply={translate("CM.txt_save")}
      titleButtonCancel={translate("CM.btn_close")}
      isHaveCloseIcon={true}
      hasOverlay={true}
      visibleFooter={!isView}
      handleSave={handleSave}
      handleCancel={onClose}
      className={styles.drawer}
      isShowButtonCancel={true}
      isShowButtonApply={!isView}
      loading={!!context.loading}
    >
      <div>
        <Row gutter={[16, 16]}>
          {/* CBNV MSB yêu cầu - chỉ hiển thị, không sửa */}
          <Col span={24}>
            <InputText
              isSmall={false}
              label={translate("PL.txt_msb_staff_requestor")}
              readOnly={true}
              value={model?.msb_requestor}
              className={"input-text--read-only"}
            />
          </Col>

          {/* Loại yêu cầu làm rõ - bắt buộc */}
          <Col span={24}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "clarificationType"
              )}
            >
              <Select
                isRequired={true}
                classFilter={ModelFilter}
                label={translate("PL.clarification_request_type")}
                isSmall={false}
                isEnumerable={true}
                placeHolder={translate("PL.select_clarification_request_type")}
                value={model?.clarificationType}
                getList={() => {
                  return of(clarificationTypes);
                }}
                onChange={(_, object) =>
                  handleChangeValue("clarificationType", object)
                }
                disabled={isView}
                isSearch={false}
                appendToBody
              />
            </FormItem>
          </Col>

          {/* Nhà cung cấp phản hồi - bắt buộc */}
          <Col span={24}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "supplier")}
            >
              <Select
                isRequired={true}
                classFilter={ModelFilter}
                label={translate("PL.txt_supplier_responder")}
                isSmall={false}
                isEnumerable={true}
                placeHolder={translate("CLQ.plh_choose_supplier")}
                value={model?.supplier}
                getList={() => {
                  return purchasingPlanRepository?.getListSupplierDropdown({
                    id: (params as any)?.id,
                  });
                }}
                onChange={(_, object) => handleChangeValue("supplier", object)}
                disabled={isView}
                isSearch={false}
                appendToBody
              />
            </FormItem>
          </Col>

          {/* Tiêu đề làm rõ - bắt buộc */}
          <Col span={24}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "title")}
            >
              <InputText
                isSmall={false}
                label={translate("PL.clarification_title")}
                value={model?.title || ""}
                onChange={(value) => handleChangeValue("title", value)}
                disabled={isView}
                isRequired={true}
                placeHolder={translate("PL.enter_clarification_title")}
                maxLength={MAX_LENGTH_250}
              />
            </FormItem>
          </Col>

          {/* Nội dung làm rõ - bắt buộc */}
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
                isView={isView}
              />
            </div>
          </Col>
        </Row>
      </div>
    </Drawer>
  );
};

export default ClarificationDetailDrawer;
