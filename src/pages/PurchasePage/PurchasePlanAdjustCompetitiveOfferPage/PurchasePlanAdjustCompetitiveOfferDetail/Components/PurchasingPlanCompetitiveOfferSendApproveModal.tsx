import { MAX_LENGTH_255 } from "core/config/consts";
import { acceptanceUserRepository } from "core/repositories/AcceptanceUserRepository";
import { utilService } from "core/services/common-services/util-service";
import { ModelSelect } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/PurchasingPlanMasterHook";
import { useCallback, useEffect, useState } from "react";
import {
  FormItem,
  Modal,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { proposalRepository } from "../../../ProposalPage/ProposalRepository";
import { Organization } from "models/Organization";
import { validator } from "core/helpers/validator";
import { isEmpty } from "lodash";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";

export enum ConfirmModalType {
  DELETE,
  CANCEL,
  RETURN,
  REJECT,
  SEND_APPROVE,
  SEND_RESULT,
}

interface PurchasePlanConfirmModalProps {
  isLoading: boolean;
  errorMessage?: { [key: string]: string };
  onApply?: () => void;
  onCancel?: () => void;
  setModelSelected?: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  loadingButton?: boolean;
  contextValue?: PurchasePlanAdjustCompetitiveOfferDetailHookContextProps;
}

export interface DataForm {
  email?: string;
  reasonForAdjustment?: string;
  contextValue?: PurchasePlanAdjustCompetitiveOfferDetailHookContextProps;
}

export const PurchasingPlanCompetitiveOfferSendApproveModal = ({
  onApply,
  onCancel,
  contextValue,
}: PurchasePlanConfirmModalProps) => {
  const [translate] = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const { model, handleChangeAllField, handleChangeSingleField } = contextValue;

  const [data, setData] = useState<{
    user: Organization | null;
    reasonForAdjustment: string | null;
    errors?: any;
  }>({
    user: null,
    reasonForAdjustment: null,
  });

  const approveUserId = model?.approveUserId;

  const handleGetDataDetail = () => {
    if (!approveUserId) return;
    setLoading(true);

    acceptanceUserRepository
      .getUserInfo(approveUserId)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (res) => {
          setData({
            user: res,
            reasonForAdjustment: null,
          });
          handleChangeSingleField({
            fieldName: "approveUserId",
          })(res?.id);
        },
      });
  };

  useEffect(() => {
    handleGetDataDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveUserId]);

  const validate = useCallback(() => {
    const fieldsToValidate: {
      name: string;
      maxLength?: number;
      isRequired?: boolean;
    }[] = [
      { name: "user" },
      { name: "reasonForAdjustment", maxLength: MAX_LENGTH_255 },
    ];
    const errors = fieldsToValidate.reduce((acc, field) => {
      const requiredError = validator.required({
        filedValidate: field?.isRequired ? [] : [field.name],
        data,
      });

      const maxLengthError = validator.maxLength({
        filedValidate: [field.name],
        data,
        maxLength: field.maxLength,
      });

      return {
        ...acc,
        ...requiredError,
        ...maxLengthError,
      };
    }, {});

    if (!isEmpty(errors)) {
      setData({
        ...data,
        errors: {
          ...model?.errors,
          ...errors,
        },
      });
      return false;
    }

    return true;
  }, [data, model?.errors]);

  const handleOnApprove = useCallback(() => {
    if (!validate()) {
      return;
    }

    handleChangeAllField({
      ...model,
      approveUserId: data?.user?.id,
    });

    onApply();
    onCancel();
  }, [
    data?.user?.id,
    handleChangeAllField,
    model,
    onApply,
    onCancel,
    validate,
  ]);

  return (
    <Modal
      title={translate(
        "PL.confirmation_of_sending_procurement_plan_adjustment_for_approval"
      )}
      titleButtonApply={translate("PL.bidding.button.send_for_approval")}
      titleButtonCancel={translate("CM.btn_close")}
      className="modal-confirm_purchase-plan"
      handleSave={handleOnApprove}
      handleCancel={onCancel}
      size={600}
      maskClosable={false}
      isShowIconBack={false}
      loading={loading}
      open
    >
      <div className="col-lg-12 p-0">
        <FormItem validateObject={utilService.getValidateObj(data, "user")}>
          <Select
            label={translate("PL.txt_approver")}
            value={data?.user}
            placeHolder={translate("PL.plh_approver")}
            onChange={(_, value: Organization) =>
              setData({ ...data, user: value })
            }
            valueFilter={{
              name: "",
            }}
            searchProperty="name"
            readOnly={data.user?.isActive === true}
            getList={(filter) =>
              proposalRepository.listMasterUser({
                ...filter,
                pageSize: 30,
                pageIndex: 1,
                isActive: true,
                isSupplier: false,
              })
            }
            render={(item) =>
              `${item?.email || ""} - ${item?.name ?? item?.fullName}`
            }
            classFilter={undefined}
            searchType={null}
            isEnumerable={false}
            isSmall={false}
            isSearch
            isRequired
          />
        </FormItem>
      </div>
      <div className="col-lg-12 p-0 mt-4">
        <FormItem
          validateObject={utilService.getValidateObj(
            data,
            "reasonForAdjustment"
          )}
        >
          <TextArea
            maxLength={MAX_LENGTH_255}
            label={translate("PL.txt_purchasing_plan_reason_for_adjustment")}
            placeHolder={translate(
              "PL.plh_purchasing_plan_reason_for_adjustment"
            )}
            value={data?.reasonForAdjustment}
            onChange={(value: string) => {
              setData({ ...data, reasonForAdjustment: value });
              handleChangeSingleField({
                fieldName: "reasonForAdjustment",
              })(value);
            }}
            rows={4}
            translate={translate}
            resize="none"
            showCount
            isRequired
          />
        </FormItem>
      </div>
    </Modal>
  );
};
