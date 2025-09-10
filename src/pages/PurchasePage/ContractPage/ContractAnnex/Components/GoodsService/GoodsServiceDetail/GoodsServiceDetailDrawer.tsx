import { warningIcon } from "assets/icons";
import { AdvancedCollapseView } from "components";
import {
  MAX_LENGTH_20,
  MAX_LENGTH_255,
  MAX_LENGTH_500,
  NOT_TAB_ENTER_REGEX,
  PHONE_NUMBER_REGEX,
} from "core/config/consts";
import {
  ConfigField,
  FieldValue,
  GeneralAction,
  GeneralActionEnum,
} from "core/services/service-types";
import {
  cloneDeep,
  isEmpty,
  isNaN,
  isNil,
  isNull,
  isUndefined,
  size,
} from "lodash";
import { ReceivedType } from "models/Contract";
import {
  ContractAnnex,
  ReceiverInfo,
  SelectAdjustableGoodsServicesModel,
} from "models/ContractAnnex";
import { TypeAction } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/ContractTerms/ContractTermsHooks";
import { GoodsServiceInfo } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/GoodsService/GoodsServiceDetail/GoodsServiceInfo/GoodsServiceInfo";
import { ReceiveInfo } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/GoodsService/GoodsServiceDetail/ReceiveInfo/ReceiveInfo";
import styles from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/GeneralInformation.module.scss";
import React, { Dispatch, useCallback, useMemo } from "react";
import { Model } from "react-3layer-common";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./GoodServiceDetailDrawer.scss";
import { formatDate } from "core/helpers/date-time";
import appMessageService from "core/services/common-services/app-message-service";

interface GoodsServiceDetailModalProps {
  visible: boolean;
  onClose: () => void;
  currentItem: SelectAdjustableGoodsServicesModel;
  dispatch: Dispatch<GeneralAction<ContractAnnex>>;
  model: ContractAnnex;
  handleChangeSelectFieldGoodsService: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeSingleFieldGoodsService: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleChangeAllFieldGoodsService: (
    data: SelectAdjustableGoodsServicesModel
  ) => void;
  handleAction: (type: TypeAction, id: string) => void;
  handleDeleteGoodServices: () => void;
  isEdit?: boolean;
}

enum CollapseKey {
  ReceiveInfo = "ReceiveInfo",
  GoodsServiceInfo = "GoodsServiceInfo",
}

export const GoodsServiceDetailDrawer: React.FC<
  GoodsServiceDetailModalProps
> = (props) => {
  const { notifyToast } = appMessageService.useCRUDMessage();
  const {
    visible,
    currentItem,
    onClose,
    dispatch: dispatchMaster,
    model: modelMaster,
    handleChangeSelectFieldGoodsService,
    handleChangeSingleFieldGoodsService,
    handleChangeAllFieldGoodsService,
    handleAction,
    handleDeleteGoodServices,
    isEdit,
  } = props;
  const [translate] = useTranslation();

  const shouldShowReceiverInfos = useCallback(() => {
    return modelMaster?.received?.id === ReceivedType.MultipleReceivers;
  }, [modelMaster?.received?.id]);

  const makeCollapseTitle = useCallback(
    (type: CollapseKey, haveWarning?: boolean) => {
      let key = "";
      switch (type) {
        case CollapseKey.GoodsServiceInfo:
          key = "RG.txt_goods_service_info";
          break;
        case CollapseKey.ReceiveInfo:
          key = "RG.txt_receive_info";
          break;
        default:
          key = null;
          break;
      }

      return (
        <div className={styles["collapse-title"]}>
          {translate(key)}
          {haveWarning ? (
            <div className={styles["size-24"]}>
              <img src={warningIcon} alt="img" width={20} height={20} />
            </div>
          ) : null}
        </div>
      );
    },
    [translate]
  );

  const validate = useCallback(() => {
    const requiredFields = ["quantity"];

    if (currentItem.purchaseItemId) {
      requiredFields.push("goodUnit", "unitPrice", "goodBranch");
    }

    const receiverInfosRequiredFields: {
      fieldName: keyof ReceiverInfo;
      isRequired?: boolean;
      maxLength?: number;
      regex?: RegExp;
      isCheckQuantity?: boolean;
      isNote?: boolean;
    }[] = [
      {
        fieldName: "shippingDate",
        isRequired: true,
      },
      {
        fieldName: "quantity",
        isRequired: true,
        isCheckQuantity: true,
      },
      {
        fieldName: "organizationId",
        isRequired: true,
      },
      {
        fieldName: "person",
        isRequired: true,
      },
      {
        fieldName: "phone",
        isRequired: true,
        maxLength: MAX_LENGTH_20,
        regex: PHONE_NUMBER_REGEX,
      },
      {
        fieldName: "address",
        isRequired: true,
        maxLength: MAX_LENGTH_255,
        regex: NOT_TAB_ENTER_REGEX,
        isNote: true,
      },
      {
        fieldName: "note",
        isRequired: false,
        maxLength: MAX_LENGTH_500,
        regex: NOT_TAB_ENTER_REGEX,
        isNote: true,
      },
    ];

    const errors = requiredFields.reduce(
      (acc: { [key: string]: string }, field) => {
        const fieldValue = currentItem?.[field];
        if (
          isUndefined(fieldValue) ||
          isNull(fieldValue) ||
          isNaN(fieldValue)
        ) {
          acc[field] = translate("CM.input_require_validation");
        }
        return acc;
      },
      {}
    );

    function checkQuantity(quantity: number, unitQuantity: number) {
      const result = quantity + unitQuantity;
      if (result >= 0) {
        return undefined;
      } else {
        return translate("RG.error_input.tooMuchQuantity");
      }
    }

    const validateField = (fieldName: string, maxLength: number) => {
      const fieldValue = currentItem?.[fieldName];
      if (fieldValue && fieldValue.length > maxLength) {
        switch (maxLength) {
          case MAX_LENGTH_500: {
            errors[fieldName] = translate("RG.error_input.standardTooLong500");
            break;
          }
          case MAX_LENGTH_255: {
            errors[fieldName] = translate("RG.error_input.standardTooLong255");
          }
        }
      } else if (fieldValue && /[\t\n\r]/.test(fieldValue)) {
        errors[fieldName] = translate("RG.error_input.invalidCharacters");
      }
    };
    validateField("note", MAX_LENGTH_500);
    if (currentItem?.purchaseItemId) {
      validateField("description", MAX_LENGTH_255);
    }

    if (isNil(currentItem?.purchaseItemId) && isEmpty(errors?.quantity)) {
      const { quantity, unitQuantity } = currentItem;
      errors.quantity = checkQuantity(quantity, unitQuantity);
    }

    const receiverInfosErrors: { [key: string]: string } = {};

    if (isEmpty(currentItem?.receiverInfos) && shouldShowReceiverInfos()) {
      receiverInfosErrors[`receiverInfos`] = translate(
        "CA.error_add_delivery_line"
      );
    }

    if (!isEmpty(currentItem?.receiverInfos) && shouldShowReceiverInfos()) {
      const receivedQuantityTotal = currentItem?.receiverInfos?.reduce(
        (total, item) => total + (item?.quantity || 0),
        0
      );

      currentItem?.receiverInfos.forEach((item) => {
        receiverInfosRequiredFields.forEach((field) => {
          const fieldValue = item?.[field?.fieldName] as string;
          if (
            (field?.isRequired && isUndefined(fieldValue)) ||
            isNull(fieldValue) ||
            isNaN(fieldValue)
          ) {
            receiverInfosErrors[
              `receiverInfos.${item.rowId}.${field?.fieldName}`
            ] = translate("CM.input_require_validation");
            return;
          }

          if (fieldValue?.length > field?.maxLength) {
            receiverInfosErrors[
              `receiverInfos.${item.rowId}.${field?.fieldName}`
            ] = translate("CM.input_length_validation", {
              maxLength: field?.maxLength,
            });
            return;
          }

          if (
            field?.regex &&
            !field?.isNote &&
            !field?.regex.test(fieldValue)
          ) {
            receiverInfosErrors[
              `receiverInfos.${item.rowId}.${field?.fieldName}`
            ] = translate("CM.input_regex_validation");
            return;
          }

          if (field?.isNote && field?.regex && !field?.regex.test(fieldValue)) {
            receiverInfosErrors[
              `receiverInfos.${item.rowId}.${field?.fieldName}`
            ] = translate("RG.error_input.invalidCharacters");
            return;
          }

          if (
            field?.isCheckQuantity &&
            receivedQuantityTotal !== currentItem.quantity
          ) {
            receiverInfosErrors[
              `receiverInfos.${item.rowId}.${field?.fieldName}`
            ] = translate(
              "CT.total_delivery_quantity_must_equal_purchase_quantity"
            );
            return;
          }

          if (
            field?.isCheckQuantity &&
            receivedQuantityTotal === currentItem.quantity
          ) {
            delete receiverInfosErrors[
              `receiverInfos.${item.rowId}.${field?.fieldName}`
            ];
          }
        });
      });
    }

    const errorsFilterKey = Object.keys(errors).filter(
      (key) => !isEmpty(errors[key])
    );

    if (size(errorsFilterKey) > 0 || !isEmpty(receiverInfosErrors)) {
      handleChangeAllFieldGoodsService({
        ...currentItem,
        errors: {
          ...errors,
          ...receiverInfosErrors,
        },
      });
      return false;
    }

    handleChangeAllFieldGoodsService({
      ...currentItem,
      errors: {},
    });
    return true;
  }, [
    currentItem,
    handleChangeAllFieldGoodsService,
    shouldShowReceiverInfos,
    translate,
  ]);

  const handleSave = useCallback(() => {
    if (!validate()) {
      return;
    }

    const receiverInfos = currentItem?.receiverInfos || [];
    const receiverInfosUnique: ReceiverInfo[] = [];
    receiverInfos.forEach((item: ReceiverInfo) => {
      const items = {
        shippingDate: formatDate(item?.shippingDate),
        quantity: item?.quantity,
        organizationId: item?.organizationId,
        personId: item?.personId,
        phone: item?.phone,
        address: item?.address,
        note: item?.note,
      };

      const isDuplicate = receiverInfosUnique.some((existingItem) =>
        Object.entries(items).every(
          ([key, value]) => existingItem[key] === value
        )
      );
      if (!isDuplicate) {
        receiverInfosUnique.push(items);
      }
    });

    const isDuplicateReceiverInfos =
      receiverInfosUnique.length !== receiverInfos.length;

    if (isDuplicateReceiverInfos) {
      notifyToast({
        message: translate("CM.message_validate_duplicate_receiver_info"),
        type: "error",
      });
      return;
    }

    currentItem.errors = {};
    const goodsItemClone = cloneDeep(modelMaster?.contractAppendixGoodsItems);
    const itemIndex = goodsItemClone.findIndex((item) =>
      currentItem.id.includes(item.id)
    );
    if (itemIndex !== -1) {
      goodsItemClone[itemIndex] = currentItem;
    }
    dispatchMaster({
      type: GeneralActionEnum.UPDATE,
      payload: {
        contractAppendixGoodsItems: goodsItemClone,
      },
    });
    onClose();
  }, [
    currentItem,
    dispatchMaster,
    modelMaster?.contractAppendixGoodsItems,
    notifyToast,
    onClose,
    translate,
    validate,
  ]);

  const handleDeleteGoodsService = useCallback(() => {
    handleAction(null, currentItem.id);
    handleDeleteGoodServices();
    onClose();
  }, [currentItem.id, handleAction, handleDeleteGoodServices, onClose]);

  const items = useMemo(() => {
    const goodsServiceInfoItems = [
      {
        key: CollapseKey.GoodsServiceInfo,
        label: makeCollapseTitle(CollapseKey.GoodsServiceInfo),
        children: (
          <GoodsServiceInfo
            currentItem={currentItem}
            handleChangeSelectFieldGoodsService={
              handleChangeSelectFieldGoodsService
            }
            handleChangeSingleFieldGoodsService={
              handleChangeSingleFieldGoodsService
            }
            handleChangeAllFieldGoodsService={handleChangeAllFieldGoodsService}
            model={modelMaster}
            isEdit={isEdit}
          />
        ),
      },
    ];

    const receiveInfoItems = [
      {
        key: CollapseKey.ReceiveInfo,
        label: makeCollapseTitle(CollapseKey.ReceiveInfo),
        children: (
          <ReceiveInfo
            model={currentItem}
            handleChangeAllFieldGoodsService={handleChangeAllFieldGoodsService}
            isEdit={isEdit}
          />
        ),
      },
    ];

    if (modelMaster?.received?.id === 0) {
      return goodsServiceInfoItems;
    }
    return [...goodsServiceInfoItems, ...receiveInfoItems];
  }, [
    currentItem,
    handleChangeAllFieldGoodsService,
    handleChangeSelectFieldGoodsService,
    handleChangeSingleFieldGoodsService,
    isEdit,
    makeCollapseTitle,
    modelMaster,
  ]);
  return (
    <>
      <Drawer
        size="xl"
        title={<strong>{translate("RG.goods_service_detail")}</strong>}
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("RG.button.delete")}
        isShowButtonCancel={
          (isEdit && isNull(currentItem?.contractGoodsItemId)) ||
          isUndefined(currentItem?.contractGoodsItemId)
        }
        handleCancel={handleDeleteGoodsService}
        handleClose={onClose}
        handleSave={handleSave}
        className="drawer-header-text-fixed"
        visibleFooter={isEdit}
        visible={visible}
        loading={false}
        isHaveCloseIcon
        hasOverlay
      >
        <AdvancedCollapseView
          items={items}
          defaultActiveKey={items?.map((item) => item?.key)}
          showAll={true}
          className={"collapse-goods-service"}
        />
      </Drawer>
    </>
  );
};
