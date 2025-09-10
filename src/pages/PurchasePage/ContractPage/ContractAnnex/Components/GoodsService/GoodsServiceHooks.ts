import { toFixedByCurrency, toFixedNumber } from "core/helpers/calculator";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { listService } from "core/services/page-services/list-service";
import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import { isEmpty, isEqual, isNil, size, uniqBy, uniqueId } from "lodash";
import {
  ContractAnnex,
  RelatedSlipInfoType,
  SelectAdjustableGoodsServicesModel,
} from "models/ContractAnnex";
import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { Dispatch, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TypeAction } from "../ContractTerms/ContractTermsHooks";
import { useGroupGoodServicesByCategory } from "../hooks/useGroupGoodServicesByCategory";

interface GoodsServiceHooksParams<T> {
  model: T | any;
  onDispatch?: Dispatch<GeneralAction<ContractAnnex>>;
}

export default function useGoodsServiceHooks<T>({
  model,
  onDispatch,
}: GoodsServiceHooksParams<T>) {
  const [translate] = useTranslation();
  const [isContract, setIsContract] = useState<boolean | null>(null);
  const proposalId = model?.relatedSlipInfos?.find((relatedSlipInfo: any) =>
    isEqual(relatedSlipInfo?.type, RelatedSlipInfoType.PurchaseProposal)
  )?.id;

  const [typeAction, setTypeAction] = useState<TypeAction | null>(null);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { model: modelGoodsService, dispatch: dispatchGoodsService } =
    detailService.useModel<SelectAdjustableGoodsServicesModel>(
      SelectAdjustableGoodsServicesModel
    );

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
  } = fieldService.useField(modelGoodsService, dispatchGoodsService);

  const goodItems: SelectAdjustableGoodsServicesModel[] = useMemo(
    () =>
      model?.contractAppendixGoodsItems?.map(
        (goodItem: SelectAdjustableGoodsServicesModel) => {
          const goodItemId = goodItem?.id;
          const hasUnderscore = Boolean(goodItemId?.split("_")?.[1]);

          return {
            ...goodItem,
            id: hasUnderscore
              ? goodItemId
              : `${goodItemId}_${goodItem?.goodUnit?.code}_${
                  goodItem?.goodBranch?.code
                }_${
                  goodItem?.contractGoodsItemId || goodItem?.purchaseItemId
                }_${uniqueId("good-service")}`,
            receiverInfos: goodItem?.receiverInfos?.map((item) => ({
              ...item,
              rowId: item.id,
            })),
          };
        }
      ),
    [model?.contractAppendixGoodsItems]
  );

  const goodItemIdSelected = goodItems
    ?.map((item) => {
      if (!item) return null;
      return {
        goodsId: item.contractGoodsItemId,
        unitId: item.goodUnit?.id,
        isContract: Boolean(item.contractGoodsItemId),
      };
    })
    ?.filter((item) => Boolean(item?.goodsId));

  const goodServicesId = useRef<string>(null);

  const currency = useMemo(
    () => model?.contractInfo?.currency,
    [model?.contractInfo?.currency]
  );

  const isTotalRow = useCallback(
    (goodItem: SelectAdjustableGoodsServicesModel) => !goodItem?.goodCategory,
    []
  );

  const { handleGroupGoodServicesByCategory } =
    useGroupGoodServicesByCategory(currency);

  const data = useMemo(() => {
    const { list } = handleGroupGoodServicesByCategory(goodItems);

    const total = goodItems?.reduce(
      (acc, item) => {
        return {
          ...acc,
          taxAmount: toFixedByCurrency(
            acc?.taxAmount + item?.taxAmount,
            currency
          ),
          totalAmount: toFixedByCurrency(
            acc?.totalAmount + item?.totalAmount,
            currency
          ),
          totalConvertedAmount: toFixedNumber(
            acc?.totalConvertedAmount + item?.totalConvertedAmount
          ),
          totalAmountConvert: toFixedNumber(
            acc?.totalAmountConvert + item?.totalAmountConvert
          ),
        };
      },
      {
        ...new GoodsReceiptRequestItem(),
        name: translate("PR.size_type_goods_services", {
          size: size(goodItems),
        }),
        taxAmount: 0,
        totalAmount: 0,
        totalConvertedAmount: 0,
        totalAmountConvert: 0,
      }
    );

    if (isEmpty(list)) {
      return [];
    }

    return [total, ...list];
  }, [currency, goodItems, handleGroupGoodServicesByCategory, translate]);

  const {
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    setSelectedRow,
  } = listService.useRowSelection<SelectAdjustableGoodsServicesModel>(
    "checkbox",
    [],
    false,
    "auto",
    true
  );

  const handleAddGoodService = (
    goodServices: SelectAdjustableGoodsServicesModel[]
  ) => {
    const goodServicesMapping = goodServices.map((item) => ({
      ...item,
      receiverInfos: item?.receiverInfo ? [item?.receiverInfo] : [],
    }));
    onDispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        contractAppendixGoodsItems: [...goodServicesMapping, ...goodItems],
        isAdjustedGoodsItem: true,
      },
    });
    setIsContract(null);
  };

  const handleClose = () => {
    goodServicesId.current = null;
    setTypeAction(null);
  };

  const handleDeleteGoodServices = () => {
    const id = goodServicesId.current;
    let newList: SelectAdjustableGoodsServicesModel[] = [];
    let remainIds: string[] = [];
    if (isNil(id)) {
      newList = goodItems.filter(
        (item) => !selectedRowKeys?.includes(item?.id)
      );
      remainIds = newList.reduce<string[]>((acc, item) => {
        if (selectedRowKeys.includes(item?.id)) {
          return [...acc, item.id];
        }
        return acc;
      }, []);
    } else {
      newList = goodItems.filter((item) => item?.id !== id);
      remainIds = selectedRowKeys?.filter(
        (itemId) => itemId !== id
      ) as string[];
      goodServicesId.current = null;
    }

    setSelectedRowKeys(remainIds);
    onDispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        contractAppendixGoodsItems: newList,
        isAdjustedGoodsItem: newList?.length,
      } as T,
    });

    setTypeAction(null);
  };

  const handleAction = (typeAction: null | TypeAction, id: string | null) => {
    goodServicesId.current = id;
    setTypeAction(typeAction);
  };

  const handleOpenGoodsServiceModal = useCallback(
    (item: SelectAdjustableGoodsServicesModel) => {
      setIsOpenModal(true);
      handleChangeAllField(item);
    },
    [handleChangeAllField]
  );

  const handleCloseGoodsServiceModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  return {
    proposalId,
    typeAction,
    translate,
    isContract,
    currency,
    data,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    goodItemIdSelected,
    setSelectedRowKeys,
    isTotalRow,
    setSelectedRow,
    isOpenModal,
    currentGoodsServices: modelGoodsService,
    handleAction,
    setIsContract,
    handleAddGoodService,
    setTypeAction,
    handleDeleteGoodServices,
    handleClose,
    handleChangeSingleFieldGoodsService: handleChangeSingleField,
    handleChangeSelectFieldGoodsService: handleChangeSelectField,
    handleChangeAllFieldGoodsService: handleChangeAllField,
    handleOpenGoodsServiceModal,
    handleCloseGoodsServiceModal,
  };
}
