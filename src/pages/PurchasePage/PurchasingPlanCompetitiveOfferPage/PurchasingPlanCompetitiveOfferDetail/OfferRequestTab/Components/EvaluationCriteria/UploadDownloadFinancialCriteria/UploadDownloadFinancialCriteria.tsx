import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import saveAs from "file-saver";
import { useCallback, useMemo, useRef } from "react";
import appMessageService from "core/services/common-services/app-message-service";
import { v4 as uuidv4 } from "uuid";
import { isArray, isEmpty, multiply } from "lodash";
import {
  EvaluationCriteriaType,
  EvaluationUserRoleEnum,
} from "models/PurchasingPlan";
import { Button } from "react-components-design-system";
import { DownloadIconC, UploadIconC } from "assets/icons";
import { useTranslation } from "react-i18next";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { ModelFilter } from "react-3layer-common";
import { useHistory } from "react-router";
import { PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE } from "config/route-const";

/**
 * =======================================
 * CONSTANTS & CONFIGURATION
 * =======================================
 */

// File upload constraints and validation rules
const FILE_UPLOAD_CONFIG = {
  MAX_SIZE_MB: 30, // Maximum file size in megabytes
  BYTE_VALUE: 1024, // Standard byte conversion value
  get MEGABYTE() {
    return multiply(this.BYTE_VALUE, this.BYTE_VALUE); // Calculate megabyte value (1024 * 1024)
  },
  ACCEPTED_FORMATS: ".xls,.xlsx", // Only allow Excel files

  // User roles allowed to perform financial evaluation
  ALLOWED_FINANCIAL_ROLES: [
    EvaluationUserRoleEnum.FinancialEvaluator,
    EvaluationUserRoleEnum.FinancialLeader,
  ],
} as const;

// Template download configuration
const TEMPLATE_CONFIG = {
  FILE_NAME: "Template_Evaluation.xlsx",
  MIME_TYPE:
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  CRITERIA_TYPE: EvaluationCriteriaType.FinancialCriteria,
} as const;

/**
 * =======================================
 * TYPE DEFINITIONS
 * =======================================
 */

type Props = {
  contextValue?: any; // Main model context containing all purchasing plan data
  columnKeyPassFail?: string; // Column key for pass/fail evaluation
  columnKeyScoring?: string; // Column key for scoring evaluation
  fieldName?: string; // Field name for form binding
  isDetail?: boolean; // Flag to determine if component is in detail/view mode
  paramsDownload?: ModelFilter; // Parameters for template download
  evaluationMethod?: number; // Evaluation method type (scoring/pass-fail)
  isSecondary?: boolean; // UI styling flag for secondary button appearance
};

/**
 * =======================================
 * MAIN COMPONENT
 * =======================================
 *
 * UploadDownloadFinancialCriteria Component
 *
 * MAIN FEATURES:
 * 1. Upload Excel files containing financial evaluation criteria
 * 2. Download Excel templates for data entry
 * 3. Validate uploaded data and handle errors
 * 4. Support both normal bidding and price adjustment flows
 */
const UploadDownloadFinancialCriteria = ({
  contextValue,
  isDetail = false,
  paramsDownload,
  evaluationMethod,
  isSecondary = false,
}: Props) => {
  /**
   * =======================================
   * HOOKS & CONTEXT SETUP
   * =======================================
   */

  const [translate] = useTranslation(); // Hook for internationalization
  const history = useHistory(); // Hook for routing history
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to hidden file input
  const { notifyToast } = appMessageService.useCRUDMessage(); // Toast notification service

  console.log("contextValue", contextValue);

  // Extract context values for better code readability
  const {
    model, // Main purchasing plan model
    handleChangeSingleField, // Function to update single field in model
    handleChangeAllField, // Function to update multiple fields in model
    setErrorsModal, // Function to display validation errors modal
  } = contextValue;

  /**
   * =======================================
   * COMPUTED VALUES & MEMOIZATION
   * =======================================
   */

  /**
   * LOGIC: Determine bidding flow type based on URL
   * Check if in price adjustment mode or normal bidding mode
   */
  const isAdjustBid = useMemo(() => {
    return history.location.pathname.includes(
      PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_DETAIL_ROUTE
    );
  }, [history.location.pathname]);

  /**
   * COMPLEX LOGIC: Extract User IDs from evaluation team
   *
   * Processing flow:
   * 1. Determine team data source based on flow type (normal/adjustment)
   * 2. Filter members with financial evaluation permissions
   * 3. Extract User IDs to send to server
   */
  const evaluationTeamUserIds = useMemo(() => {
    // Select appropriate team data source based on flow type
    const dataEvaluationTeam = isAdjustBid
      ? model?.organizationGeneral?.personInChargeInfos?.map((person: any) => {
          return {
            user: {
              id: person?.pic?.id,
            },
          };
        }) || []
      : model?.evaluationTeams; // CHANGED from evaluationTeam to evaluationTeams

    // Validate team data availability
    if (!isArray(dataEvaluationTeam)) {
      return [];
    }

    const userIds = dataEvaluationTeam
      ?.map((teamMember) => {
        const userId = teamMember?.user?.id;
        return userId;
      })
      .filter(Boolean);

    return userIds;
  }, [isAdjustBid, model?.evaluationTeams, model?.evaluationTeamDetails]);

  /**
   * =======================================
   * VALIDATION FUNCTIONS
   * =======================================
   */

  /**
   * Validate all required data before upload
   */

  /**
   * Validate all required data before upload
   */
  const validateUploadData = useCallback(() => {
    const errors = [];

    if (evaluationMethod === null || evaluationMethod === undefined) {
      errors.push("Missing evaluation method");
    }

    return errors;
  }, [evaluationMethod, evaluationTeamUserIds]);

  const validateFileSize = useCallback(
    (file: File): boolean => {
      const maxSizeBytes =
        FILE_UPLOAD_CONFIG.MAX_SIZE_MB * FILE_UPLOAD_CONFIG.MEGABYTE;

      if (file.size > maxSizeBytes) {
        notifyToast({
          message: translate("CM.input_file_size_validation", {
            maxSize: FILE_UPLOAD_CONFIG.MAX_SIZE_MB,
          }),
          type: "error",
        });
        return false;
      }

      return true;
    },
    [notifyToast, translate]
  );

  /**
   * =======================================
   * DATA PROCESSING FUNCTIONS
   * =======================================
   */

  /**
   * COMPLEX LOGIC: Process data from uploaded file
   *
   * Processing flow:
   * 1. Get current financial data from model
   * 2. Process and format new data from server response
   * 3. Merge old and new data
   * 4. Update model
   */
  const processUploadedFinancialData = useCallback(
    (serverResponse: any[]) => {
      // Step 2: Process new data from server
      if (serverResponse && isArray(serverResponse)) {
        if (isAdjustBid) {
          // Get existing evaluation criterias
          const existingCriterias =
            model?.offerRequest?.evaluationCriteriaGroup?.evaluationCriterias ||
            [];

          // Case: isAdjustBid = true - Map data theo cấu trúc assessment table
          const formattedNewData = serverResponse.map((item, index) => {
            const {
              name,
              technicalRequirement,
              description,
              evaluationUser,
              evaluationUserId,
              email,
              note,
              pointRate,
              minimumPointScale,
              maximumPointScale,
              evaluationMethod,
            } = item;

            // Create standardized data structure for assessment table
            return {
              rowKeyId: uuidv4(), // Generate unique ID for table row
              id: uuidv4(),
              name: name,
              isDefault: false,
              criteriaItemSelected: {
                technicalRequirement: description || "",
              },
              criteriaItems: existingCriterias?.[0]?.criteriaItems || [],
              description: description,
              pointRate: pointRate,
              evaluationUserSelected: {
                email,
                code: email,
                name: evaluationUser,
                id: evaluationUserId,
              },
              note: note || "",
              maximumPointScaleSelected: {
                id: uuidv4(),
                score: maximumPointScale,
              },
              minimumPointScaleSelected: {
                id: uuidv4(),
                score: minimumPointScale,
              },
              evaluationMethod: evaluationMethod,
              user: {
                email,
                code: email,
                name: evaluationUser,
                id: evaluationUserId,
              },
              // Preserve original data
              ...item,
            };
          });

          // Merge existing and new data
          const mergedCriterias = [...existingCriterias, ...formattedNewData];

          // Update model for adjustment bid
          handleChangeSingleField({
            fieldName: "offerRequest",
          })({
            ...model?.offerRequest,
            evaluationCriteriaGroup: {
              ...model?.offerRequest?.evaluationCriteriaGroup,
              evaluationCriterias: mergedCriterias,
            },
          });
        } else {
          // Case: Normal bidding flow
          const processedData = model?.evaluationCriteriaGroup || [];

          const formattedNewData = serverResponse.map((item) => {
            // Extract necessary fields from response
            const {
              id,
              evaluationUser,
              evaluationUserId,
              email,
              note,
              description,
            } = item;

            // Create standardized data structure for frontend
            return {
              ...item,
              id: id || uuidv4(),
              email,
              technicalRequirement: description,
              user: {
                email,
                code: email,
                name: evaluationUser,
                id: evaluationUserId,
              },
            };
          });

          processedData.push(formattedNewData);

          // Step 3: Flatten and update model
          const flattenedData = processedData.flatMap(
            (dataArray: any) => dataArray
          );

          handleChangeSingleField({
            fieldName: "evaluationCriteriaGroup",
          })(flattenedData);
        }
      }
    },
    [
      model?.evaluationCriteriaGroup,
      model?.offerRequest,
      handleChangeSingleField,
      isAdjustBid,
      translate,
    ]
  );

  /**
   * =======================================
   * ERROR HANDLING FUNCTIONS
   * =======================================
   */

  /**
   * COMPLEX LOGIC: Handle different types of upload errors
   *
   * Error types handled:
   * 1. Data validation errors (400 - Validate)
   * 2. Other server errors (400 - Other)
   * 3. Network/server errors (500+)
   * 4. System errors (500 - NullReferenceException)
   */
  const handleUploadError = useCallback(
    (error: AxiosError) => {
      const errorData = error.response?.data as any;

      // Handle System Error (NullReferenceException from server)
      if (errorData?.type === "System Error") {
        return;
      }

      // Check error type and handle accordingly
      if (error.response?.status === 400 && setErrorsModal) {
        if (errorData?.type === "Validate") {
          // CASE 1: Data validation errors in Excel file
          // Prepare data with index for validation
          const dataWithIndex = convertDataToHaveIndexBeforeValidate(
            model,
            [],
            model
          );

          // Update model with error information
          handleChangeAllField({
            ...dataWithIndex,
            errors: errorData.errors,
            errorTabs: errorData.tabs,
          });

          // Display detailed error modal
          setErrorsModal({
            type: "SUBMIT_FAIL",
            errors: errorData.sheetErrors || [],
          });
        } else {
          // CASE 2: Other server errors (not validation)
          notifyToast({
            message: errorData.message || "Upload failed. Please try again.",
            type: "error",
          });
        }
      } else {
        // CASE 3: Network or other errors
        notifyToast({
          message:
            "Network error occurred. Please check your connection and try again.",
          type: "error",
        });
      }
    },
    [setErrorsModal, handleChangeAllField, model, notifyToast]
  );

  /**
   * =======================================
   * MAIN UPLOAD FUNCTION
   * =======================================
   */

  /**
   * MAIN FEATURE: Handle Excel file upload
   *
   * Upload process:
   * 1. Validate file (size, format)
   * 2. Validate required data
   * 3. Create FormData with necessary parameters
   * 4. Send request to server
   * 5. Handle successful response or errors
   * 6. Reset input to allow re-upload
   */
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      contextValue?.setLoading(true); // Set loading state for UI feedback
      const selectedFile = event.target.files?.[0];

      // Function to reset input for next upload
      const resetFileInput = () => {
        event.target.value = "";
      };

      // STEP 1: Check if file is selected
      if (!selectedFile) {
        console.log("File2 selection cancelled or no file selected");
        return;
      }

      // STEP 2: Validate file size
      if (!validateFileSize(selectedFile)) {
        resetFileInput();
        return;
      }

      // STEP 3: Validate required data before upload
      const validationErrors = validateUploadData();
      if (validationErrors.length > 0) {
        notifyToast({
          message: `Upload failed: ${validationErrors.join(", ")}`,
          type: "error",
        });
        resetFileInput();
        return;
      }

      // STEP 4: Prepare upload data according to server specification
      const uploadFormData = new FormData();

      // Server expects "File" field name (case-sensitive)
      uploadFormData.append("File", selectedFile);

      // Server expects "EvaluationMethod" field name
      const evaluationMethodValue =
        evaluationMethod !== null && evaluationMethod !== undefined
          ? evaluationMethod.toString()
          : "1";
      uploadFormData.append("EvaluationMethod", evaluationMethodValue);

      // Server expects "EvaluationTeamUserIds" as JSON string
      const validUserIds = evaluationTeamUserIds.filter(
        (id) => id !== null && id !== undefined && id !== ""
      );
      uploadFormData.append(
        "EvaluationTeamUserIds",
        JSON.stringify(validUserIds)
      );

      // STEP 5: Send upload request
      purchasingPlanRepository
        .uploadFileTemplateEvaluation(uploadFormData)
        .subscribe({
          next: (response) => {
            contextValue?.setLoading(false); // Reset loading state
            if (response && Array.isArray(response)) {
              processUploadedFinancialData(response);
            }
          },
          error: (error: AxiosError) => {
            handleUploadError(error);
            contextValue?.setLoading(false);
          },
        });

      // STEP 6: Reset input
      resetFileInput();
    },
    [
      evaluationMethod,
      evaluationTeamUserIds,
      validateFileSize,
      validateUploadData,
      processUploadedFinancialData,
      handleUploadError,
      notifyToast,
      translate,
      contextValue?.setLoading,
    ]
  );

  /**
   * =======================================
   * TEMPLATE DOWNLOAD FUNCTION
   * =======================================
   */

  /**
   * FEATURE: Download Excel template for data entry
   *
   * Download process:
   * 1. Send request with necessary parameters
   * 2. Receive ArrayBuffer from server
   * 3. Create Blob with Excel format
   * 4. Trigger file download
   */
  const handleDownloadTemplate = useCallback(() => {
    // Send template download request
    purchasingPlanRepository
      .downloadFileTemplateEvaluation(
        paramsDownload,
        TEMPLATE_CONFIG.CRITERIA_TYPE,
        evaluationTeamUserIds,
        evaluationMethod
      )
      .subscribe({
        next: (response: AxiosResponse<ArrayBuffer>) => {
          // Create Blob from ArrayBuffer response
          const fileBlob = new Blob([response.data], {
            type: TEMPLATE_CONFIG.MIME_TYPE,
          });
          // Trigger download file
          saveAs(fileBlob, TEMPLATE_CONFIG.FILE_NAME);
        },
        error: (err: any) => {
          notifyToast({
            type: "error",
            message: err?.response?.data?.message,
          });
        },
      });
  }, [
    paramsDownload,
    evaluationTeamUserIds,
    evaluationMethod,
    notifyToast,
    translate,
  ]);

  /**
   * =======================================
   * UI INTERACTION FUNCTIONS
   * =======================================
   */

  /**
   * FEATURE: Trigger click on hidden file input
   * Simulate clicking file input to open file selection dialog
   */
  const triggerFileSelection = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * =======================================
   * COMPONENT RENDER
   * =======================================
   */

  return (
    <div className="d-flex justify-content-between align-items-end gap-12">
      {/* SECTION: Upload Button */}
      <div className="btn-left">
        <Button
          icon={<UploadIconC />}
          iconPlace="left"
          type={isSecondary ? "secondary" : "tertiary"}
          size="lg"
          onClick={triggerFileSelection}
          disabled={isDetail}
        >
          {translate("BG.upload")}
        </Button>
      </div>

      {/* SECTION: Download Button */}
      <div className="btn-right">
        <Button
          type="tertiary"
          icon={<DownloadIconC />}
          iconPlace="left"
          onClick={handleDownloadTemplate}
          disabled={isDetail}
        >
          {translate("PL.txt_download_template")}
        </Button>
      </div>

      {/* SECTION: Hidden File Input */}
      {/* Hidden input used to trigger file selection dialog */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
        accept={FILE_UPLOAD_CONFIG.ACCEPTED_FORMATS}
        aria-label={translate("PL.txt_upload_criteria")}
      />
    </div>
  );
};

export default UploadDownloadFinancialCriteria;
