import { warningIcon } from "assets/icons";
import { AdvancedCollapseView } from "components";
import {
  MAX_LENGTH_20,
  MAX_LENGTH_255,
  MAX_LENGTH_500,
  NOT_TAB_ENTER_REGEX,
  PHONE_NUMBER_REGEX,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import appMessageService from "core/services/common-services/app-message-service";
import {
  ConfigField,
  FieldValue,
  GeneralAction,
  GeneralActionEnum,
} from "core/services/service-types";
import { cloneDeep, isEmpty, isEqual, isNil, isNumber } from "lodash";
import { ReceivedType } from "models/Contract";
import {
  ContractAnnex,
  ReceiverInfo,
  SelectAdjustableGoodsServicesModel,
} from "models/ContractAnnex";
import { TypeAction } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/ContractTerms/ContractTermsHooks";
import styles from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/GeneralInformation.module.scss";
import React, { Dispatch, useCallback, useMemo } from "react";
import { Model } from "react-3layer-common";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { GoodsServiceInfoView } from "../../../../ContractAdjustmentInfoView/Components/GoodsServiceInfoView";
import stylesGoods from "../GoodsService.module.scss";
import { GoodsServiceInfo } from "./GoodsServiceInfo";
import { ReceiveInfo } from "./ReceiveInfo/ReceiveInfo";

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
  index: number;
  isView?: boolean;
}

enum CollapseKey {
  GoodsServiceInfo = "GoodsServiceInformation",
  ReceiveInfo = "ReceiveInformation",
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
    index,
    isView = false,
  } = props;
  const [translate] = useTranslation();

  const shouldShowReceiverInfos = () => {
    return modelMaster?.received?.id === ReceivedType.MultipleReceivers;
  };

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

  function checkQuantity(quantity: number, unitQuantity: number) {
    const result = quantity + unitQuantity;
    if (result >= 0) {
      return null;
    } else {
      return translate(
        "contractAdjustment.quantity_received_must_be_less_than_quantity"
      );
    }
  }

  const validate = () => {
    const requiredFields = [
      "goodBranch",
      "quantity",
      "unitPrice",
      "goodUnit",
      "taxModel",
    ];
    const receiverInfosRequiredFields: {
      fieldName: keyof ReceiverInfo;
      isRequired?: boolean;
      maxLength?: number;
      regex?: RegExp;
      isCheckQuantity?: boolean;
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
        fieldName: "organization",
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
      },
      {
        fieldName: "note",
        isRequired: false,
        maxLength: MAX_LENGTH_500,
        regex: NOT_TAB_ENTER_REGEX,
      },
    ];

    if (currentItem?.taxModel?.id) {
      requiredFields.push("taxAmount");
    }

    const errors = requiredFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (field === "quantity" && isNil(currentItem?.purchaseItemId)) {
          acc[field] = checkQuantity(
            currentItem?.quantity,
            currentItem?.unitQuantity
          );
        }
        if (isNil(currentItem?.[field])) {
          acc[field] = translate("CM.input_require_validation");
        }
        return acc;
      },
      { ...currentItem?.errors }
    );

    const isEmptyCustom = (value: any) => {
      if (isNumber(value)) return false; // Nếu là số thì luôn trả về false
      return isEmpty(value); // Các kiểu dữ liệu khác dùng isEmpty bình thường
    };

    let updatedReceiverInfos: any = {};
    if (!isEmpty(currentItem?.receiverInfos) && shouldShowReceiverInfos()) {
      const receivedQuantityTotal = currentItem?.receiverInfos?.reduce(
        (total, item) => total + (item?.quantity || 0),
        0
      );

      updatedReceiverInfos = currentItem?.receiverInfos.map((item) => {
        const itemErrors: Record<keyof ReceiverInfo, string> = {} as Record<
          keyof ReceiverInfo,
          string
        >;
        receiverInfosRequiredFields.forEach((field) => {
          const fieldValue = item?.[field?.fieldName] as string;
          if (field?.isRequired && isEmptyCustom(fieldValue)) {
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
              "RG.error_input.invalidCharacters"
            );
          } else if (
            field?.isCheckQuantity &&
            !isEqual(receivedQuantityTotal, currentItem?.quantity)
          ) {
            itemErrors[field?.fieldName] = translate(
              "CT.total_delivery_quantity_must_equal_purchase_quantity"
            );
          }
        });

        return {
          ...item,
          errors: Object.keys(itemErrors).length > 0 ? itemErrors : undefined,
        };
      });
    } else {
      updatedReceiverInfos = currentItem?.receiverInfos;
    }

    const isErrorsReceiverInfosValidation = !!updatedReceiverInfos?.find(
      (item: ReceiverInfo) => {
        const itemErrors = Object.values(item?.errors || {});
        return itemErrors?.some((error) => !isEmpty(error));
      }
    );

    const isValidError = Object.values(errors).some((error) => !isEmpty(error));

    if (isValidError || isErrorsReceiverInfosValidation) {
      currentItem.receiverInfos = updatedReceiverInfos;
      handleChangeAllFieldGoodsService({
        ...currentItem,
        errors: errors,
      });
      return false;
    }
    return true;
  };

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

    const goodsItemClone = cloneDeep(
      modelMaster?.contractAppendixGoodsItems
    )?.map((item) => (isEqual(currentItem?.id, item?.id) ? currentItem : item));

    dispatchMaster({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...modelMaster,
        contractAppendixGoodsItems: goodsItemClone,
        isEditGoods: true,
      },
    });
    onClose();
  }, [
    currentItem,
    dispatchMaster,
    index,
    modelMaster?.contractAppendixGoodsItems,
    onClose,
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
        children: isView ? (
          <GoodsServiceInfoView currentItem={currentItem} />
        ) : (
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
            isView={isView}
            model={currentItem}
            handleChangeAllFieldGoodsService={handleChangeAllFieldGoodsService}
          />
        ),
      },
    ];

    if (modelMaster?.received?.id === ReceivedType.MultipleReceivers) {
      return [...goodsServiceInfoItems, ...receiveInfoItems];
    }
    return goodsServiceInfoItems;
  }, [
    currentItem,
    handleChangeAllFieldGoodsService,
    handleChangeSelectFieldGoodsService,
    handleChangeSingleFieldGoodsService,
    makeCollapseTitle,
    modelMaster?.received?.id,
  ]);

  return (
    <>
      <Drawer
        size={"max"}
        className={stylesGoods["drawer"]}
        visible={visible}
        handleClose={onClose}
        title={<strong>{translate("RG.goods_service_detail")}</strong>}
        titleButtonApply={translate("generalActions.save")}
        titleButtonDelete={translate("RG.button.delete")}
        handleDelete={handleDeleteGoodsService}
        isHaveCloseIcon={true}
        hasOverlay={true}
        visibleFooter={!isView}
        loading={false}
        handleSave={handleSave}
        isShowButtonDelete={!!currentItem.purchaseItemId && !isView}
        isShowButtonCancel={false}
        isShowButtonApply={!isView}
        // loading={loading}
      >
        <AdvancedCollapseView
          items={items}
          defaultActiveKey={Object.values(CollapseKey)}
          showAll={false}
        />
      </Drawer>
    </>
  );
};
