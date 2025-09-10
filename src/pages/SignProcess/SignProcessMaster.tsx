import { Col, Modal, Radio, Row, Space, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import {
  InfoAttachmentAndCreatorSign,
  RequestFormConfiguration,
} from "models/RequestFormConfiguration";
import React, { createContext, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs/operators";
import "./SignProcessMaster.scss";

import appMessageService from "core/services/common-services/app-message-service";

import { RadioChangeEvent } from "antd/lib";
import { AcceptanceRepository } from "core/repositories/AcceptanceRepository";
import { ProjectSettlementRepository } from "core/repositories/ProjectSettlementRepository";
import { templateFormRepository } from "core/repositories/TemplateFormRepository";
import { isUndefined } from "lodash";
import { SignedFormTypeRequirement } from "models/SignedFormTypeRequirement";
import { BudgetRepository } from "pages/BudgetPage/BudgetRepository";
import { BudgetSettlementRepository } from "pages/BudgetPage/BudgetSettlementCreate/BudgetSettlementRepository";
import DigitalSignatureLogin from "pages/DigitalSignatureLogin/DigitalSignatureLogin";
import { PaymentRepository } from "pages/PaymentPage/PaymentRepository";
import { ContractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { ContractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { ContractPrincipleRepository } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleRepository";
import { ContractTerminationRepository } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationRepository";
import { ProposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { PurchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { ReceivedGoodsRepository } from "pages/PurchasePage/ReceivingGoods/ReceivedGoodRepository";
import { TemporaryImportAssetRepository } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetRepository";
import { SettlementRepository } from "pages/SettlementPage/SettlementRepository";
import { Button } from "react-components-design-system";
import SignReportConfirm from "./SignReportConfirm/SignReportConfirm";
import SignReportPage from "./SignReportPage/SignReportPage";
import SignReportUpload from "./SignReportUpload/SignReportUpload";
import { FileTemplateInput } from "models/FileTemplate";
import type { AxiosResponse } from "axios";
import { WorkflowState } from "models/WorkflowState";
import { RequestFormConfigurationContent } from "models/RequestFormConfigurationContent";
import { PurchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import { ContractAdjustmentRepository } from "../PurchasePage/ContractPage/ContractAdjustment/ContractAdjustmentRepository";

const typeReportOption = [
  {
    type: "signReports.signReportUpload.defaultReport",
    value: 1,
  },
  {
    type: "signReports.signReportUpload.manualReport",
    value: 2,
  },
];

interface SignProcessModalProps {
  isOpen: boolean;
  loadingSend: boolean;
  onCancel: () => void;
  requestId: string;
  requestField: string;
  sendRequest: () => void;
  repository:
    | ProposalRepository
    | PaymentRepository
    | PurchasingPlanRepository
    | BudgetRepository
    | ContractPrincipleRepository
    | ContractRepository
    | BudgetSettlementRepository
    | ReceivedGoodsRepository
    | ContractAnnexRepository
    | AcceptanceRepository
    | TemporaryImportAssetRepository
    | SettlementRepository
    | ProjectSettlementRepository
    | ContractTerminationRepository
    | PurchaseRequestRepository
    | ContractAdjustmentRepository;
  redirectPath?: string;
  haveDigitalSigining?: boolean;
  haveNotForm?: boolean;
  searchParams?: string;
  tempateType: string;
}

export interface SignProcessModalAction {
  type: string;
  payload?: RequestFormConfiguration;
}

export interface SignProcessModalContextInt {
  model: RequestFormConfiguration;
  dispatch: React.Dispatch<SignProcessModalAction>;
  requestId: string;
  requestField: string;
  repository:
    | ProposalRepository
    | PaymentRepository
    | PurchasingPlanRepository
    | BudgetRepository
    | ContractPrincipleRepository
    | ContractRepository
    | BudgetSettlementRepository
    | ReceivedGoodsRepository
    | ContractAnnexRepository
    | AcceptanceRepository
    | TemporaryImportAssetRepository
    | SettlementRepository
    | ProjectSettlementRepository
    | ContractTerminationRepository
    | PurchaseRequestRepository
    | ContractAdjustmentRepository;
  errorMessage: string[];
  setErrorMessage: React.Dispatch<string[]>;
  haveDigitalSigining: boolean;
  typeRequirement: SignedFormTypeRequirement;
  infoAttachmentAndCreatorSign?: InfoAttachmentAndCreatorSign;
  setInfoAttachmentAndCreatorSign?: React.Dispatch<InfoAttachmentAndCreatorSign>;
  setListSignature: (list: WorkflowState[]) => void;
}

function signProcessModalReducer(
  state: RequestFormConfiguration,
  action: SignProcessModalAction
) {
  switch (action.type) {
    case "SET":
      return { ...action.payload };
    case "NEXT_STEP":
      return {
        ...state,
        formConfigurationStep: state.formConfigurationStep + 1,
      };
    case "BACK_STEP":
      return {
        ...state,
        formConfigurationStep: state.formConfigurationStep - 1,
      };
    case "UPDATE_SIZE_DIMENSION":
      return {
        ...state,
        elementHeight: action.payload.elementHeight,
        elementWidth: action.payload.elementWidth,
      };
    case "ADD_CONTENT": {
      const signatureConfigurations = [...state.signatureConfigurations];
      signatureConfigurations.push(action.payload.signatureConfigurations[0]);
      return {
        ...state,
        signatureConfigurations,
      };
    }
    case "REMOVE_CONTENT": {
      const signatureConfiguration = action.payload.signatureConfigurations[0];
      const signatureConfigurations = [...state.signatureConfigurations];
      let pageIndex: number;
      if (signatureConfiguration.id) {
        pageIndex = signatureConfigurations.findIndex(
          (item) => item.id === signatureConfiguration.id
        );
      } else {
        pageIndex = signatureConfigurations.findIndex(
          (item) => item.rowId === signatureConfiguration.rowId
        );
      }
      signatureConfigurations.splice(pageIndex, 1);
      return {
        ...state,
        signatureConfigurations,
      };
    }
    case "UPDATE_CONTENT": {
      const signatureConfiguration = action.payload.signatureConfigurations[0];
      const signatureConfigurations = [...state.signatureConfigurations];
      let pageIndex: number;
      if (signatureConfiguration.id) {
        pageIndex = signatureConfigurations.findIndex(
          (item) => item.id === signatureConfiguration.id
        );
      } else {
        pageIndex = signatureConfigurations.findIndex(
          (item) => item.rowId === signatureConfiguration.rowId
        );
      }
      signatureConfigurations[pageIndex] = {
        ...signatureConfiguration,
      };
      return {
        ...state,
        signatureConfigurations,
      };
    }
    case "UPDATE":
      return { ...state, ...action.payload };

    case "UPDATE_AND_NEXT_STEP":
      return {
        ...state,
        ...action.payload,
        formConfigurationStep: state.formConfigurationStep + 1,
      };
  }
}

export const SignProcessModalContext =
  createContext<SignProcessModalContextInt>({
    model: {},
    dispatch: null,
    requestId: null,
    requestField: null,
    errorMessage: [],
    setErrorMessage: null,
    repository: null,
    haveDigitalSigining: true,
    typeRequirement: null,
    infoAttachmentAndCreatorSign: null,
    setInfoAttachmentAndCreatorSign: null,
    setListSignature: null,
  });

const SignProcessModal: React.FC<SignProcessModalProps> = ({
  isOpen,
  haveNotForm,
  onCancel,
  requestId,
  requestField,
  sendRequest,
  repository,
  // redirectPath,
  loadingSend,
  haveDigitalSigining = true,
  tempateType,
  // searchParams,
}) => {
  const [translate] = useTranslation();
  const { t } = useTranslation();

  // const history = useHistory();

  const [model, dispatch] = React.useReducer<
    React.Reducer<RequestFormConfiguration, SignProcessModalAction>
  >(signProcessModalReducer, new RequestFormConfiguration());
  const [errorMessage, setErrorMessage] = React.useState<string[]>([]);

  const [visibleSigningInfo, setVisibleSigningInfo] = React.useState(false);

  const [infoAttachmentAndCreatorSign, setInfoAttachmentAndCreatorSign] =
    React.useState<InfoAttachmentAndCreatorSign>(null);

  const [typeRequirement, setTypeRequirement] =
    React.useState<SignedFormTypeRequirement>(null);

  const { notifyUpdateItemSuccess, notifyUpdateItemError } =
    appMessageService.useCRUDMessage();

  const [listSignature, setListSignature] = React.useState<WorkflowState[]>([]);

  const handleSaveFileTemplate = React.useCallback(() => {
    setLoading(true);
    const { fileTemplate, creatorSignAttachment } =
      infoAttachmentAndCreatorSign;

    const queryParams = requestId ? requestId : undefined;
    const inputs: any = {};
    fileTemplate?.templateInputs?.forEach((input: FileTemplateInput) => {
      inputs[input.code] = input.value;
    });
    repository
      .dynamicTemplatePreview({
        queryParams,
        template: fileTemplate,
        inputs,
      })
      .subscribe({
        next: (response: AxiosResponse<any>) => {
          const file = new Blob([response.data], {
            type: "application/pdf",
          });
          const fileName = response.headers["content-disposition"]
            .split(";")
            .find((n: string) => n.includes("filename="))
            .replace("filename=", "")
            .replace(/"/gi, "")
            .trim();
          templateFormRepository
            .uploadFile(file, fileName, creatorSignAttachment)
            .subscribe({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              next: (res: any) => {
                if (res) {
                  notifyUpdateItemSuccess();
                  dispatch({
                    type: "UPDATE_AND_NEXT_STEP",
                    payload: {
                      ...model,
                      attachment: res?.data,
                      signatureConfigurations: [],
                      dynamicTemplate: { ...fileTemplate },
                    },
                  });
                  setErrorMessage([]);
                }
              },
              error: () => {
                notifyUpdateItemError();
              },
              complete: () => {
                setLoading(false);
              },
            });
        },
      });
  }, [
    infoAttachmentAndCreatorSign,
    requestId,
    repository,
    notifyUpdateItemSuccess,
    model,
    notifyUpdateItemError,
  ]);
  const handleSaveFileUpload = React.useCallback(() => {
    setLoading(true);
    const { fileBlob, fileName, fileTemplate, creatorSignAttachment } =
      infoAttachmentAndCreatorSign;

    templateFormRepository
      .uploadFile(fileBlob, fileName, creatorSignAttachment)
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (res: any) => {
          if (res) {
            notifyUpdateItemSuccess();
            dispatch({
              type: "UPDATE_AND_NEXT_STEP",
              payload: {
                ...model,
                attachment: res?.data,
                signatureConfigurations: [],
                dynamicTemplate: { ...fileTemplate },
              },
            });
            setErrorMessage([]);
          }
        },
        error: () => {
          notifyUpdateItemError();
        },
        complete: () => {
          setLoading(false);
        },
      });
  }, [
    infoAttachmentAndCreatorSign,
    notifyUpdateItemSuccess,
    model,
    notifyUpdateItemError,
  ]);

  const validateSignatureTypeConsistency = (
    signatureConfigurations: RequestFormConfigurationContent[]
  ): { isValid: boolean; conflictingActors: string[] } => {
    const groupedByTransition: { [key: string]: any[] } = {};
    const conflictingActors: string[] = [];

    const validConfigurations = signatureConfigurations.filter(
      (item) =>
        item.approvalTransitionId !== undefined &&
        item.approvalTransitionId !== null
    );
    validConfigurations.forEach((item) => {
      const transitionId = item.approvalTransitionId;
      if (!groupedByTransition[transitionId]) {
        groupedByTransition[transitionId] = [];
      }
      groupedByTransition[transitionId].push(item);
    });

    for (const transitionId in groupedByTransition) {
      const group = groupedByTransition[transitionId];
      if (group.length > 1) {
        const signatureTypes = new Set(group.map((item) => item.signatureType));
        if (signatureTypes.size > 1) {
          const actorNames = group
            .map((item) => item.actorDisplayName || "Unknown")
            .filter((name) => name !== "Unknown")
            .join(", ");

          if (actorNames) {
            conflictingActors.push(actorNames);
          }
        }
      }
    }

    return {
      isValid: conflictingActors.length === 0,
      conflictingActors,
    };
  };

  const validateTransitionId = () => {
    const listSignatureNoSelect = listSignature.filter((item) => {
      const arr =
        model?.signatureConfigurations?.filter((itemSelect) => {
          return itemSelect.key === item.key;
        }) || [];

      return arr.length === 0;
    });
    const listTransitionId: any[] = [];
    const hasInvalid = listSignatureNoSelect.some((itemNoSelect) => {
      const list = model?.signatureConfigurations?.filter(
        (item) =>
          item.approvalTransitionId === itemNoSelect.workflowTransitionId
      );
      if (list && list.length > 0) {
        listTransitionId.push(list[0].approvalTransitionId);
      }
      return list && list.length > 0;
    });
    const listName: string[] = [];
    listTransitionId.forEach((itemTransitionId) => {
      const arr: string[] = [];
      listSignature.forEach((itemSignature) => {
        if (itemTransitionId === itemSignature.workflowTransitionId) {
          arr.push(itemSignature?.actorDisplayName);
        }
      });
      if (arr) {
        listName.push(arr.join(", "));
      }
    });

    return {
      isValid: !hasInvalid,
      conflictingActors: listName,
    };
  };

  // Kiểm tra chữ ký ảnh không được đặt sau chữ ký số
  const validateNoImageSignAfterDigitalSign = () => {
    // lấy ra các chữ ký đã ký
    const validConfigurations = model?.signatureConfigurations?.filter(
      (item) =>
        item.approvalTransitionId !== undefined &&
        item.approvalTransitionId !== null
    );
    // sắp xếp tăng dần theo orderIndex đại diện cho thứ tự ký trong workflow
    validConfigurations.sort((a, b) => a.orderIndex - b.orderIndex);

    // tìm chữ ký đầu tiên có signatureType = 2
    const firstDigitalSign = validConfigurations.findIndex(
      (item) => item.signatureType === 2
    );
    let isValid = true;
    const conflictingActors: string[] = [];
    // nếu không tìm thấy chữ ký số nào thì không cần kiểm tra
    if (firstDigitalSign === -1) {
      return {
        isValid,
        conflictingActors,
      };
    } else {
      // nếu tìm thấy chữ ký số thì kiểm tra các chữ ký sau nó
      // nếu có chữ ký ảnh nào sau chữ ký số thì không hợp lệ
      validConfigurations.forEach((item, index) => {
        if (index > firstDigitalSign) {
          if (item.signatureType === 1) {
            isValid = false;
            conflictingActors.push(item.actorDisplayName);
          }
        }
      });
    }
    return {
      isValid,
      conflictingActors,
    };
  };

  const validateSignatureRequirements = (
    model: RequestFormConfiguration,
    typeRequirement: SignedFormTypeRequirement,
    translate: (key: string) => string
  ): string[] => {
    const errors: string[] = [];

    // kiểm tra bắt buộc chữ ký pháp nhân
    if (typeRequirement?.legalEntitySignatureRequirement === 2) {
      if (
        model?.signatureConfigurations?.findIndex(
          (item) => item.signatureType === 3
        ) === -1
      ) {
        errors.push(
          translate(
            "signReports.signReportPage.errorMessage.legalSignIsRequire"
          )
        );
      }
    }
    // Kiểm tra bắt buộc chữ ký cá nhân
    if (typeRequirement?.personalSignatureRequirement === 2) {
      if (
        model?.signatureConfigurations?.findIndex(
          (item) => item.signatureType === 2
        ) === -1
      ) {
        errors.push(
          translate(
            "signReports.signReportPage.errorMessage.personSignIsRequire"
          )
        );
      }
    }

    const validateSignatureType = validateSignatureTypeConsistency(
      model?.signatureConfigurations || []
    );
    if (!validateSignatureType.isValid) {
      validateSignatureType.conflictingActors.forEach((actor) => {
        errors.push(
          t("signReports.signReportPage.errorMessage.displayName", {
            actorDisplayName: actor,
          })
        );
      });
    }
    const transitionResult = validateTransitionId();
    if (!transitionResult.isValid) {
      transitionResult.conflictingActors.forEach((actor) => {
        errors.push(
          t("signReports.signReportPage.errorMessage.displayName", {
            actorDisplayName: actor,
          })
        );
      });
    }

    const validateNoImageSignAfterDigitalSignResult =
      validateNoImageSignAfterDigitalSign();
    if (!validateNoImageSignAfterDigitalSignResult.isValid) {
      const actors =
        validateNoImageSignAfterDigitalSignResult.conflictingActors?.join(", ");
      errors.push(
        t(
          "signReports.signReportPage.errorMessage.noImageSignAfterDigitalSign",
          {
            actorDisplayName: actors,
          }
        )
      );
    }

    return errors;
  };

  const next = React.useCallback(() => {
    if (model?.formConfigurationStep === 0 && model?.formType === 1) {
      handleSaveFileTemplate();
    } else if (model?.formConfigurationStep === 0 && model?.formType === 2) {
      handleSaveFileUpload();
    } else if (model?.formConfigurationStep === 1) {
      const signatureErrors = validateSignatureRequirements(
        model,
        typeRequirement,
        translate
      );

      if (signatureErrors.length > 0) {
        setErrorMessage(signatureErrors);
      } else {
        dispatch({
          type: "NEXT_STEP",
        });
        setErrorMessage([]);
      }
    } else {
      dispatch({
        type: "NEXT_STEP",
      });
      setErrorMessage([]);
    }
  }, [
    handleSaveFileTemplate,
    handleSaveFileUpload,
    model?.formConfigurationStep,
    model?.formType,
    model?.signatureConfigurations,
    translate,
    typeRequirement?.legalEntitySignatureRequirement,
    typeRequirement?.personalSignatureRequirement,
  ]);

  const prev = React.useCallback(() => {
    if (model?.formConfigurationStep === 1) {
      setInfoAttachmentAndCreatorSign({
        ...infoAttachmentAndCreatorSign,
        creatorSignAttachment: null,
      });
    }
    dispatch({
      type: "BACK_STEP",
    });
    setErrorMessage([]);
  }, [infoAttachmentAndCreatorSign, model?.formConfigurationStep]);

  const formConfigurationSteps = React.useMemo(() => {
    return [
      {
        key: 1,
        title: translate("signReports.title.signReportUpload"),
        content: <SignReportUpload />,
      },
      {
        key: 2,
        title: translate("signReports.title.signReportPage"),
        content: <SignReportPage />,
      },
      {
        key: 3,
        title: translate("signReports.title.signReportConfirm"),
        content: <SignReportConfirm />,
      },
    ];
  }, [translate]);

  const handleCancel = React.useCallback(() => {
    setErrorMessage([]);
    onCancel();
  }, [onCancel]);

  const handleSaveDraft = React.useCallback(() => {
    model[requestField] = model[requestField] ?? requestId;

    repository.saveFormConfiguration(requestId, model).subscribe({
      next: (res: RequestFormConfiguration) => {
        if (res) {
          notifyUpdateItemSuccess();
          dispatch({
            type: "SET",
            payload: res,
          });
          handleCancel();
        }
      },
      error: (error) => {
        if (error?.response?.status === 400) {
          notifyUpdateItemError({ message: error?.response?.data?.message });
        }
        let generalError = error.response?.data?.generalErrors || [];
        generalError = Array.from(new Set(generalError));
        setErrorMessage(generalError);
      },
    });
  }, [
    model,
    requestField,
    requestId,
    repository,
    notifyUpdateItemSuccess,
    handleCancel,
  ]);

  const [loading, setLoading] = React.useState<boolean>(false);
  const handleSendRequest = React.useCallback(() => {
    setLoading(true);
    model[requestField] = model[requestField] ?? requestId;
    const signatureConfigurations = model?.signatureConfigurations?.map(
      (item) => ({
        ...item,
        xCoordinate: Math.trunc(item?.xCoordinate),
        yCoordinate: Math.trunc(item?.yCoordinate),
      })
    );

    const modelBodyRequest: RequestFormConfiguration = {
      ...model,
      signatureConfigurations,
    };

    repository
      .saveFormConfiguration(requestId, modelBodyRequest)
      .pipe(
        finalize(() => {
          setLoading(false);
          onCancel();
        })
      )
      .subscribe({
        next: (res: RequestFormConfiguration) => {
          if (res) {
            sendRequest();
          }
        },
        error: (error) => {
          if (error?.response?.status === 400) {
            notifyUpdateItemError({ message: error?.response?.data?.message });
          }

          const generalError = error.response.data.generalErrors || [];
          setErrorMessage(generalError);
        },
      });
  }, [model, onCancel, repository, requestField, requestId, sendRequest]);

  const onChangeOptionReport = React.useCallback(
    (e: RadioChangeEvent) => {
      dispatch({
        type: "UPDATE",
        payload: {
          formType: e.target.value,
          attachment: null,
          signatureConfigurations: [],
        },
      });
      setInfoAttachmentAndCreatorSign(null);
    },
    [dispatch]
  );

  React.useEffect(() => {
    if (haveNotForm) {
      dispatch({
        type: "UPDATE",
        payload: {
          formType: 2,
        },
      });
    }
  }, [dispatch, haveNotForm]);

  const TitleModal = React.useCallback(() => {
    return (
      <>
        <Title level={3}>{translate("signReports.signProcess.title")}</Title>
        {model.formConfigurationStep === 0 && (
          <div className="d-flex align-items-center">
            <div className="m-r--2xs">
              <div className="radio-option-title">
                {translate("signReports.signReportUpload.title")}:
              </div>
            </div>
            <Radio.Group value={model.formType} onChange={onChangeOptionReport}>
              <Space direction="horizontal" size={20}>
                {typeReportOption.map((item, index) => (
                  <Radio
                    key={item.value}
                    value={item.value}
                    disabled={index === 0 && haveNotForm}
                  >
                    <div className="radio-option-text">
                      {translate(item.type)}
                    </div>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        )}
      </>
    );
  }, [
    haveNotForm,
    model.formConfigurationStep,
    model.formType,
    onChangeOptionReport,
    translate,
  ]);

  React.useEffect(() => {
    if (requestId && requestId !== "00000000-0000-0000-0000-000000000000") {
      repository.getFormConfiguration(requestId).subscribe({
        next: (res: RequestFormConfiguration) => {
          if (res) {
            dispatch({
              type: "SET",
              payload: res,
            });
          }
        },
      });
      templateFormRepository.getTypeRequirement(tempateType).subscribe({
        next: (res: SignedFormTypeRequirement) => {
          if (res) {
            setTypeRequirement(res?.data);
          }
        },
      });
    }
  }, [repository, requestId, tempateType]);

  const unselectedAllSignImage = React.useMemo(() => {
    let unselectedAll = false;
    if (
      model?.signatureConfigurations &&
      model?.signatureConfigurations.length > 0
    ) {
      model?.signatureConfigurations.forEach((item) => {
        // pháp nhân signatureType = 3 thì không cần chọn người ký
        if (isUndefined(item.approvalActorId) && item.signatureType !== 3) {
          unselectedAll = true;
        }
      });
    }
    return unselectedAll;
  }, [model?.signatureConfigurations]);

  return (
    <>
      <Modal
        open={isOpen}
        destroyOnClose={true}
        onCancel={handleCancel}
        title={<TitleModal />}
        className="sign-process__modal"
        footer={
          <div className="d-flex justify-content-end">
            <Button
              type="primary"
              size="lg"
              key="saveDraft"
              disabled={!infoAttachmentAndCreatorSign?.fileBlob || loading}
              onClick={handleSaveDraft}
              className="m-r--3xs"
            >
              <span>{translate("CM.saveDraftTemplate")}</span>
            </Button>
            <Button
              type="secondary"
              size="lg"
              key="back"
              disabled={model.formConfigurationStep === 0 || loading}
              onClick={prev}
              className="m-r--3xs"
            >
              <span>{translate("CM.back")}</span>
            </Button>
            <Button
              type="secondary"
              size="lg"
              key="submit"
              disabled={
                !infoAttachmentAndCreatorSign?.fileBlob ||
                (model.formConfigurationStep === 2 &&
                  (loading || loadingSend)) ||
                (model.formConfigurationStep === 1 && unselectedAllSignImage)
              }
              onClick={
                model.formConfigurationStep === 2 ? handleSendRequest : next
              }
            >
              <span>
                {" "}
                {model.formConfigurationStep === 2
                  ? translate("CM.sendToApprove")
                  : translate("CM.next")}
              </span>
            </Button>
          </div>
        }
        width={1200}
        centered
      >
        <Row>
          <Col span={24}>
            {model.formConfigurationStep === 2 && (loading || loadingSend) ? (
              <div
                style={{
                  height: "calc(100vh - 240px)",
                  width: "100%",
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Spin
                  size="large"
                  tip=" Loading..."
                  style={{ marginTop: "25%" }}
                />
              </div>
            ) : (
              <SignProcessModalContext.Provider
                value={{
                  model,
                  dispatch,
                  requestId: requestId,
                  requestField,
                  repository,
                  errorMessage,
                  setErrorMessage,
                  haveDigitalSigining,
                  typeRequirement,
                  infoAttachmentAndCreatorSign,
                  setInfoAttachmentAndCreatorSign,
                  setListSignature,
                }}
              >
                <Suspense
                  fallback={
                    <Space size="large">
                      {" "}
                      <Spin size="large" />
                    </Space>
                  }
                >
                  {formConfigurationSteps[model.formConfigurationStep].content}
                </Suspense>
              </SignProcessModalContext.Provider>
            )}
          </Col>
        </Row>
      </Modal>
      <DigitalSignatureLogin
        visible={visibleSigningInfo}
        setVisible={setVisibleSigningInfo}
      />
    </>
  );
};

export default SignProcessModal;
