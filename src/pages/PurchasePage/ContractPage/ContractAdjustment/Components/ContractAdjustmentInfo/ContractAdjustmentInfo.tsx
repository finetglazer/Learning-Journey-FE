import { Tooltip } from "antd";
import { WarningRound } from "assets/icons";
import classNames from "classnames";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { CollapseItem } from "components/Collapse/CollapseView";
import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History/History";
import { isEmpty, isEqual, omit, size } from "lodash";
import {
  ContentInfoModel,
  ContractRequestType,
} from "models/ContractAdjustment";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ContractAdjustmentContext } from "../../ContractAdjustmentDetail/ContractAdjustmentDetailHook";
import { ContractInformation } from "./Components/ContractInformation/ContractInformation";
import { DeliveryInformation } from "./Components/DeliveryInformation/DeliveryInformation";
import GenerationInfo from "./Components/GenerationInfo/GenerationInfo";
import GoodsService from "./Components/GoodsService/GoodsService";
import Insight from "./Components/Insight/Insight";
import ShoppingPlanTable from "./Components/ShoppingPlanTable/ShoppingPlanTable";
import styles from "./ContractAdjustmentInfo.module.scss";
import { ReceivedType } from "models/Contract";
import { ContractAppendixItem, ReceiverInfo } from "models/ContractAnnex";
import dayjs from "dayjs";

enum InformationSectionKey {
  GENERATION_INFORMATION = "GENERATION_INFORMATION",
  SHOPPING_PLAN = "SHOPPING_PLAN",
  CONTRACT_INFORMATION = "CONTRACT_INFORMATION",
  INFO_BUYER = "INFO_BUYER",
  INFO_SELLER = "INFO_SELLER",
  GOOD_SERVICE_CHANGE = "GOOD_SERVICE_CHANGE",
  DELIVERY_INFORMATION = "DELIVERY_INFORMATION",
}

export const ContractAdjustmentInfo = () => {
  const [translate] = useTranslation();
  const { model, dispatch } = useContext(ContractAdjustmentContext);
  const typeContract = model?.contract?.contractRequestType;
  const contractSupplier = model?.contract?.contractSupplier;
  const legalEntity = model?.contract?.legalEntity;
  const contentBuyer: ContentInfoModel[] = [
    {
      label: translate("CA.txt_buyer_name"),
      value: legalEntity?.name,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("AC.txt_tax_id"),
      value: legalEntity?.taxCode,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("AC.txt_address"),
      value: legalEntity?.address,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("CA.txt_buyer_representative"),
      value: "---",
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: true,
      isShow: true,
    },
    {
      label: translate("RG.txt_sender_position"),
      value: "---",
      colSpan: 16,
      isShowTag: false,
      textTag: "",
      isNotBorder: true,
      isShow: true,
    },
  ];
  const contentSeller: ContentInfoModel[] = [
    {
      label: translate("CT.txt_supplier"),
      value: contractSupplier?.supplierName,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("PL.purchasing_plan_supplier_tax_code"),
      value: contractSupplier?.taxCode,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("RG.txt_address"),
      value: contractSupplier?.address,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("AC.txt_representative"),
      value: contractSupplier?.agentPerson,
      colSpan: 8,
      isShowTag: model?.contract?.isEmpower,
      textTag: translate("CA.txt_seller_authorized"),
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("RG.txt_sender_position"),
      value: contractSupplier?.agentPersonPosition,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("LE.txt_legal_entity_authorized_letter"),
      value: contractSupplier?.procuration,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: model?.contract?.isEmpower,
    },
    {
      label: translate("CPU.txt_contact_person"),
      value: contractSupplier?.contactPerson,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("CPU.txt_central_purchase_unit_email"),
      value: contractSupplier?.email,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("CA.txt_seller_phone_number"),
      value: contractSupplier?.phone,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
    },
    {
      label: translate("CA.txt_seller_bank_account_number"),
      value: contractSupplier?.supplierPayment?.bankAccountNo,
      colSpan: 8,
      isShowTag: !isEmpty(contractSupplier?.supplierPayment?.bankAccountNo),
      textTag: contractSupplier?.supplierPayment?.isIsDomestic
        ? translate("CA.txt_seller_domestic_transfer")
        : translate("contractAdjustment.txt_bank_transfer"),
      isNotBorder: true,
      isShow: true,
    },
    {
      label: translate("CA.txt_seller_account_name"),
      value: contractSupplier?.supplierPayment?.bankAccountName,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: true,
      isShow: true,
    },
    {
      label: translate("CA.txt_seller_bank_name"),
      value: contractSupplier?.supplierPayment?.bank?.name,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: true,
      isShow: true,
    },
  ];

  const renderIcon = () => {
    return (
      <Tooltip placement="topLeft" title={translate("CA.txt_adjusted")}>
        <span className="d-flex align-items-start">
          <img src={WarningRound} alt="" />
        </span>
      </Tooltip>
    );
  };

  const renderTitle = (title: string, isShowIcon: boolean) => {
    return (
      <div className="d-flex gap-2 align-items-center">
        <span>{title}</span>
        {isShowIcon && renderIcon()}
      </div>
    );
  };

  const checkShowDeliveryInformation = (modelPass: Record<string, any>) => {
    const {
      contract,
      received,
      receivedDepartment,
      receivedPerson,
      receivedPhoneNumber,
      receiverInfos,
      contractAppendixGoodsItems,
      contractAppendixGoodsItemsSelected,
    } = modelPass;
    const { receiverInfo } = contract || {};
    const isSameReceivedType = isEqual(received?.id, contract?.receivedType);

    // If received type has changed, delivery information has changed
    if (!isSameReceivedType) {
      return true;
    }

    if (
      size(
        contractAppendixGoodsItems?.filter(
          (item: any) => !isEmpty(item?.purchaseItemId)
        )
      ) > 0
    ) {
      return true;
    }

    if (
      size(contractAppendixGoodsItemsSelected) > 0 &&
      size(contractAppendixGoodsItems) > 0 &&
      isEqual(contract?.receivedType, ReceivedType?.MultipleReceivers)
    ) {
      const receivedItems = contractAppendixGoodsItems?.reduce(
        (acc: ContractAppendixItem[], item: ContractAppendixItem) => {
          if (item && item.receiverInfos && size(item.receiverInfos) > 0) {
            const sanitizedInfos = item.receiverInfos.map((info) =>
              omit(info, ["errors"])
            );
            acc.push(...sanitizedInfos);
          }
          return acc;
        },
        []
      );

      const receivedItemsSelected = contractAppendixGoodsItemsSelected?.reduce(
        (acc: ContractAppendixItem[], item: ContractAppendixItem) => {
          if (item && item.receiverInfos && size(item.receiverInfos) > 0) {
            acc.push(...item.receiverInfos);
          }
          return acc;
        },
        []
      );

      return !isEqual(receivedItemsSelected, receivedItems);
    }

    const receiverInfosNotErrors = receiverInfos?.map((info: ReceiverInfo) => {
      const cleanInfo = omit(info, ["errors"]);
      // Format shipping date fields if they exist
      if (cleanInfo.shippingDate) {
        cleanInfo.shippingDate = dayjs(cleanInfo.shippingDate).date();
      }
      return cleanInfo;
    });

    const receiverInfoDetails = receiverInfo?.receiverInfoDetails?.map(
      (info: ReceiverInfo) => {
        const cleanInfo = omit(info, ["errors"]);
        // Format shipping date fields if they exist
        if (cleanInfo.shippingDate) {
          cleanInfo.shippingDate = dayjs(cleanInfo.shippingDate).date();
        }
        return cleanInfo;
      }
    );

    // Compare receiver information before and after
    return !isEqual(
      {
        organizationId: receiverInfo?.organizationId,
        personId: receiverInfo?.personId,
        phone: receiverInfo?.phone,
        receiverInfoDetails: receiverInfoDetails,
      },
      {
        organizationId: receivedDepartment?.id,
        personId: receivedPerson?.id,
        phone: receivedPhoneNumber,
        receiverInfoDetails: receiverInfosNotErrors,
      }
    );
  };

  const itemsCollapse = useMemo<CollapseItem[]>(
    () =>
      [
        {
          key: InformationSectionKey.GENERATION_INFORMATION,
          label: translate("CM.tab_general_information"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <GenerationInfo />
            </div>
          ),
        },
        {
          key: InformationSectionKey.SHOPPING_PLAN,
          label: translate("CA.txt_grounds"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <ShoppingPlanTable />
            </div>
          ),
        },
        {
          key: InformationSectionKey.CONTRACT_INFORMATION,
          label: renderTitle(
            translate("CA.txt_contract_information", {
              type: isEqual(typeContract, ContractRequestType.Contract)
                ? translate("CA.txt_contract")
                : translate("CA.txt_order"),
            }),
            model?.contract?.isChangeGeneral ||
              !isEqual(
                model?.contract?.organizationId,
                model?.managerOrganization?.id
              ) ||
              !isEqual(
                model?.contract?.managerObj?.id,
                model?.managerPerson?.id
              )
          ),
          children: (
            <div className={classNames("p-t--3xs")}>
              <ContractInformation />
            </div>
          ),
        },
        {
          key: InformationSectionKey.INFO_BUYER,
          label: translate("CA.txt_buyer_information"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <Insight content={contentBuyer} />
            </div>
          ),
        },
        {
          key: InformationSectionKey.INFO_SELLER,
          label: translate("CT.create_contract.seller_information"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <Insight content={contentSeller} />
            </div>
          ),
        },
        {
          key: InformationSectionKey.GOOD_SERVICE_CHANGE,
          label: renderTitle(
            translate("CA.txt_goods_services_change_information"),
            size(model?.contractAppendixGoodsItems) > 0
          ),
          children: (
            <div className={classNames("p-t--3xs")}>
              <GoodsService dispatch={dispatch} model={model} isEdit={true} />
            </div>
          ),
        },
        size(model?.contractAppendixGoodsItems) > 0 && {
          key: InformationSectionKey.DELIVERY_INFORMATION,
          label: renderTitle(
            translate("CA.txt_delivery_information"),
            checkShowDeliveryInformation(model)
          ),
          children: (
            <div className={classNames("p-t--3xs")}>
              <DeliveryInformation />
            </div>
          ),
        },
      ].filter(Boolean),
    [translate, model]
  );

  const idContractAdjustment = model?.contract?.id;

  return (
    <div className={styles["collapse--title_custom"]}>
      <AdvancedCollapseView
        items={itemsCollapse}
        showAll={false}
        defaultActiveKey={[
          InformationSectionKey.GENERATION_INFORMATION,
          InformationSectionKey.CONTRACT_INFORMATION,
          InformationSectionKey.GOOD_SERVICE_CHANGE,
          InformationSectionKey.DELIVERY_INFORMATION,
        ]}
      />
      {Boolean(idContractAdjustment) && (
        <div className="px-3 pb-3">
          <Comments
            topicId={idContractAdjustment}
            topicType={TopicType.ContractAdjustment}
            isNewLayoutVersion
          />
        </div>
      )}
    </div>
  );
};
