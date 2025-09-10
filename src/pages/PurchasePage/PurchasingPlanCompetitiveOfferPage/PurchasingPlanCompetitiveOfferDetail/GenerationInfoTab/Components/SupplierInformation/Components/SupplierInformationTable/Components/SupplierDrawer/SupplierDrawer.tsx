import React, { useCallback, useMemo } from "react";
import { Drawer } from "react-components-design-system";
import { ReceiverInfo } from "models/ContractAnnex";
import { useTranslation } from "react-i18next";
import { isEmpty, isNil, size } from "lodash";
import styles from "./SupplierDrawer.module.scss";
import { TypeAction } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/ContractTerms/ContractTermsHooks";
import {
  EMAIL_REGEX,
  MAX_LENGTH_255,
  NOT_TAB_ENTER_REGEX,
} from "core/config/consts";
import { ReceiveInfo } from "./ReceiveInfo/ReceiveInfo";
import { SupplierInfo } from "./SupplierInfo/SupplierInfo";
import {
  HandleChangeAllField,
  PurchasingPlanTypeModel,
  SupplierModel,
} from "models/PurchasingPlan/PurchasingPlan";
import CollapseView from "components/Collapse/CollapseView";
import classNames from "classnames";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";

interface SupplierDetailModalProps {
  visible: boolean;
  onClose: () => void;
  currentItem: SupplierModel;
  handleAction: (type: TypeAction, currentItem: SupplierModel) => void;
  isView?: boolean;
  handleChangeAllFields: HandleChangeAllField;
  handleChangeAllFieldSupplier: HandleChangeAllField;
  model: PurchasingPlanTypeModel;
}

enum CollapseKey {
  ReceiveInfo = "ReceiveInformation",
  SupplierInfo = "SupplierInformation",
}

export const SupplierDrawer: React.FC<SupplierDetailModalProps> = (props) => {
  const {
    visible,
    currentItem,
    onClose,
    model: modelMaster,
    handleAction,
    isView = false,
    handleChangeAllFieldSupplier,
  } = props;
  const [translate] = useTranslation();

  const validate = () => {
    const requiredFields = ["quoteEmail"];
    const receiverInfosRequiredFields: {
      fieldName: keyof ReceiverInfo;
      isRequired?: boolean;
      maxLength?: number;
      regex?: RegExp;
      isCheckQuantity?: boolean;
    }[] = [
      {
        fieldName: "email",
        isRequired: true,
        maxLength: MAX_LENGTH_255,
        regex: EMAIL_REGEX,
      },
      {
        fieldName: "name",
        isRequired: false,
        maxLength: MAX_LENGTH_255,
        regex: NOT_TAB_ENTER_REGEX,
      },
    ];

    const errors = requiredFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (isNil(currentItem?.[field])) {
          acc[field] = translate("CM.input_require_validation");
        }
        return acc;
      },
      { ...currentItem?.errors }
    );

    let updatedReceiverInfos: any = {};
    if (
      !isEmpty(currentItem?.emailReceiverInfo) &&
      size(currentItem?.emailReceiverInfo) > 0
    ) {
      updatedReceiverInfos = currentItem?.emailReceiverInfo?.map((item) => {
        const itemErrors: Record<keyof ReceiverInfo, string> = {} as Record<
          keyof ReceiverInfo,
          string
        >;
        receiverInfosRequiredFields.forEach((field) => {
          const fieldValue = item?.[field?.fieldName] as string;
          if (field?.isRequired && isEmpty(fieldValue)) {
            itemErrors[field?.fieldName] = translate(
              "CM.input_require_validation"
            );
          } else if (fieldValue?.length > field?.maxLength) {
            itemErrors[field?.fieldName] = translate(
              "CM.input_length_validation",
              {
                maxLength: field?.maxLength,
              }
            );
          } else if (field?.regex && !field?.regex.test(fieldValue)) {
            itemErrors[field?.fieldName] = translate(
              "CM.input_regex_validation"
            );
          }
        });

        return {
          ...item,
          errors: Object.keys(itemErrors).length > 0 ? itemErrors : undefined,
        };
      });
    } else {
      updatedReceiverInfos = currentItem?.emailReceiverInfo;
    }

    const isErrorsReceiverInfosValidation = !!updatedReceiverInfos?.find(
      (item: ReceiverInfo) => {
        const itemErrors = Object.values(item?.errors || {});
        return itemErrors?.some((error) => !isEmpty(error));
      }
    );

    const isValidError = Object.values(errors).some((error) => !isEmpty(error));

    if (isValidError || isErrorsReceiverInfosValidation) {
      handleChangeAllFieldSupplier({
        ...currentItem,
        emailReceiverInfo: updatedReceiverInfos,
        errors: {
          ...currentItem?.errors,
          ...errors,
        },
      } as SupplierModel);
      return false;
    }
    return true;
  };

  const handleSave = useCallback(() => {
    if (!validate()) {
      return;
    }
    handleAction(TypeAction.EDIT, currentItem);

    onClose();
  }, [currentItem, modelMaster, onClose, validate]);

  const items = useMemo(() => {
    let infoItems = [];
    const receiveInfoItems = [
      {
        key: CollapseKey.ReceiveInfo,
        label: translate("PL.purchasing_plan_email_receiver_information"),
        children: (
          <ReceiveInfo
            isView={isView}
            currentItem={currentItem}
            handleChangeAllFieldSupplier={handleChangeAllFieldSupplier}
          />
        ),
      },
    ];
    if (isView) {
      return [
        {
          key: CollapseKey.SupplierInfo,
          label: translate("PL.purchasing_plan_general_information_tab"),
          children: (
            <SupplierInfo
              currentItem={currentItem}
              isView={isView}
              model={modelMaster as any}
              handleChangeAllFieldSupplier={handleChangeAllFieldSupplier}
            />
          ),
        },
        ...receiveInfoItems,
      ];
    } else {
      infoItems = receiveInfoItems;
    }
    return infoItems;
  }, [
    currentItem,
    translate,
    currentItem?.emailReceiverInfo,
    isView,
    handleChangeAllFieldSupplier,
  ]);

  return (
    <>
      <Drawer
        size={"max"}
        className={styles["drawer"]}
        visible={visible}
        handleClose={onClose}
        title={
          <strong>
            {translate("PL.purchasing_plan_supplier_information")}
          </strong>
        }
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("CM.btn_close")}
        isHaveCloseIcon={true}
        hasOverlay={true}
        visibleFooter={true}
        loading={false}
        handleSave={handleSave}
        isShowButtonDelete={false}
        isShowButtonCancel={!isView}
        isShowButtonApply={!isView}
        handleCancel={onClose}
      >
        {!isView ? (
          <div>
            <div className="p-3">
              <SupplierInfo
                currentItem={currentItem}
                isView={isView}
                handleChangeAllFieldSupplier={handleChangeAllFieldSupplier}
                visible={visible}
              />
            </div>

            <div className={classNames(styles["drawer-border-top"])}></div>
            <div
              className={classNames(
                styles["collapse__container__overflow_supplier"]
              )}
            >
              <CollapseView
                items={items}
                defaultActiveKey={[CollapseKey.ReceiveInfo]}
                className={classNames(styles["collapse__container_over"])}
              />
            </div>
          </div>
        ) : (
          <AdvancedCollapseView
            items={items}
            showAll={false}
            defaultActiveKey={[
              CollapseKey.ReceiveInfo,
              CollapseKey.SupplierInfo,
            ]}
          />
        )}
      </Drawer>
    </>
  );
};
