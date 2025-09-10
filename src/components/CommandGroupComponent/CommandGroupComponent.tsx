import {
  ApproveIcon,
  ApproveRoundIcon,
  RejectIcon,
  RejectRoundIcon,
  ReturnIcon,
  ReturnRoundIcon,
} from "assets/icons";
import { LoadingCM } from "components";
import ApprovalPreviewSignForm from "components/PreviewSignForm/ApprovalPreviewForm";
import { REFRESH_TOKEN } from "config/const";
import appMessageService from "core/services/common-services/app-message-service";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField } from "core/services/service-types";
import { WorkflowCommand } from "models/WorkflowCommand";
import { appUserRepository } from "pages/AppUserPage/AppUserRepository";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import React, { useEffect } from "react";
import { Model } from "react-3layer-common";
import {
  Button,
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";
import { Observable } from "rxjs";
import "./CommandGroupComponent.scss";

const getIconModal = (type?: string) => {
  switch (type) {
    case "RETURN":
      return ReturnRoundIcon;
    case "REJECT":
      return RejectRoundIcon;
    case "APPROVE":
      return ApproveRoundIcon;
    default:
      return ApproveRoundIcon;
  }
};
const getTypeButtonApply = (type?: string) => {
  switch (type) {
    case "RETURN":
      return "danger";
    case "REJECT":
      return "danger";
    case "APPROVE":
      return "primary";
    default:
      return "primary";
  }
};
const getIconButton = (type?: string) => {
  switch (type) {
    case "RETURN":
      return ReturnIcon;
    case "REJECT":
      return RejectIcon;
    case "APPROVE":
      return ApproveIcon;
    default:
      return ApproveIcon;
  }
};

const getTitleModal = (type?: string) => {
  switch (type) {
    case "RETURN":
      return "CM.return";
    case "REJECT":
      return "CM.reject";
    case "APPROVE":
      return "CM.approve";
    default:
      return "CM.approve";
  }
};

const getWarningModal = (type?: string) => {
  switch (type) {
    case "RETURN":
      return "CM.returnWarning";
    case "REJECT":
      return "CM.rejectWarning";
    case "APPROVE":
      return "CM.approveWarning";
    default:
      return "CM.approveWarning";
  }
};
const getRequireReason = (type?: string) => {
  switch (type) {
    case "RETURN":
      return true;
    case "REJECT":
      return true;
    case "APPROVE":
      return false;
    default:
      return false;
  }
};

interface CommandGroupComponentProps<T extends Model> {
  model: T;
  handleChangeSingleField: (config: ConfigField) => (data?: string) => void;
  handleActions: (data?: T) => Observable<T>;
  handleGoMaster?: () => void;
  menu: string;
  hideButtonApprove?: boolean;
  reasonOutModel?: string;
  repository?: any;
}

const CommandGroupComponent = (props: CommandGroupComponentProps<Model>) => {
  const {
    model,
    handleChangeSingleField,
    handleActions,
    handleGoMaster,
    menu,
    hideButtonApprove,
    reasonOutModel,
    repository,
  } = props;
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [currentCommand, setCurrentCommand] =
    React.useState<WorkflowCommand>(undefined);

  const [currentSigningToken, setCurrentSigningToken] =
    React.useState<string>(null);

  const [translate] = useTranslation();

  const handlePressButton = React.useCallback((item: WorkflowCommand) => {
    setIsOpen(true);
    setCurrentCommand(item);
  }, []);

  const [loadingApprovePopup, setLoadingApprovePopup] =
    React.useState<boolean>(false);

  const [visibleSignedFormApproval, setVisibleSignedFormApproval] =
    React.useState(false);

  const refreshToken = localStorage.getItem(REFRESH_TOKEN);

  const handleOpenSignFormApproval = React.useCallback(
    (item: WorkflowCommand) => {
      // nếu bước hiện tại phải ký số thì gọi API lấy TOKEN ký số để gửi vào api actions để phê duyệt
      if (model?.signatureType === 2) {
        appUserRepository.getSigningToken(refreshToken).subscribe(
          (res) => {
            setCurrentSigningToken(res?.data);
            setVisibleSignedFormApproval(true);
            setCurrentCommand(item);
          },
          (error) => {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        );
      } else {
        setVisibleSignedFormApproval(true);
        setCurrentCommand(item);
      }
    },
    [model?.signatureType, notifyToast, refreshToken]
  );

  const handleCloseSignFormApproval = React.useCallback(() => {
    setVisibleSignedFormApproval(false);
    // window.location.reload();
  }, []);

  const onSave = React.useCallback(() => {
    setLoadingApprovePopup(true);
    handleActions({
      id: model?.id,
      requestTaskId: currentCommand?.requestTaskId,
      commandCode: currentCommand?.commandCode,
      reason: model?.reason || reasonOutModel,
      signingToken: currentSigningToken,
    }).subscribe(
      () => {
        setIsOpen(false);
        notifyToast();
        handleGoMaster();
        setLoadingApprovePopup(false);
      },
      (error) => {
        notifyToast({
          message: error.response?.data?.errors?.actions,
          type: "error",
        });
        setLoadingApprovePopup(false);
      }
    );
  }, [
    currentCommand?.commandCode,
    currentCommand?.requestTaskId,
    currentSigningToken,
    handleActions,
    handleGoMaster,
    model?.id,
    model?.reason,
    notifyToast,
    reasonOutModel,
  ]);

  const onDismiss = () => {
    setIsOpen(false);
    handleChangeSingleField({
      fieldName: "reason",
    })(null);
  };

  useEffect(() => {
    if (isOpen) {
      handleChangeSingleField({
        fieldName: "reason",
      })(null);
    }
  }, [handleChangeSingleField, isOpen]);

  return model?.commands?.length ? (
    <div className="command-group-action">
      {model?.commands?.map((p: WorkflowCommand, index: number) => {
        return (
          <Button
            key={index}
            type={p.buttonStyle}
            size="lg"
            icon={<img src={getIconButton(p?.icon)} alt="img" />}
            onClick={
              p?.icon === "APPROVE"
                ? () => handleOpenSignFormApproval(p)
                : () => handlePressButton(p)
            }
            iconPlace="left"
            className={
              p?.icon === "APPROVE" && hideButtonApprove ? "hidden" : ""
            }
          >
            {p?.commandName}
          </Button>
        );
      })}

      <ModalConfirm
        centered
        open={isOpen}
        titleButtonApply={translate("CM.btn_confirm")}
        titleButtonCancel={translate("CM.btn_close")}
        handleCancel={onDismiss}
        handleSave={onSave}
        typeButtonApply={getTypeButtonApply(currentCommand?.icon)}
        icon={
          <img
            src={getIconModal(currentCommand?.icon)}
            alt=""
            width={72}
            height={72}
          />
        }
        title={translate(getTitleModal(currentCommand?.icon), { menu })}
        content={
          <Trans
            i18nKey={getWarningModal(currentCommand?.icon)}
            values={{
              code: model.code,
              menu: menu,
            }}
          />
        }
      >
        <FormItem validateObject={utilService.getValidateObj(model, "reason")}>
          <TextArea
            showCount
            isRequired={getRequireReason(currentCommand?.icon)}
            label={translate("CM.reason")}
            placeHolder={translate("CM.input_reason")}
            maxLength={500}
            onChange={handleChangeSingleField({
              fieldName: "reason",
            })}
            value={model.reason}
            className="m-t--lg"
            resize="none"
          />
        </FormItem>
        {loadingApprovePopup && !visibleSignedFormApproval && <LoadingCM />}
      </ModalConfirm>

      {model && model.id && (
        <ApprovalPreviewSignForm
          loading={loadingApprovePopup}
          request={model}
          previewSignedForm={
            repository
              ? repository?.previewSignedForm
              : proposalRepository.previewSignedForm
          }
          handleApprove={onSave}
          handleClose={handleCloseSignFormApproval}
          visiblePreview={visibleSignedFormApproval}
        />
      )}
    </div>
  ) : (
    <></>
  );
};

export default CommandGroupComponent;
