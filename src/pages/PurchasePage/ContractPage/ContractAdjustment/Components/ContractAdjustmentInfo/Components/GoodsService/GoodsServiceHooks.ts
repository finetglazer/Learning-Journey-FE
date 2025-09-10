import { numberConstants } from "core/config/consts";
import { toFixedByCurrency, toFixedNumber } from "core/helpers/calculator";
import { listService } from "core/services/page-services/list-service";
import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import { isEmpty, isEqual, isNil, isUndefined, lt, round, size } from "lodash";
import {
  ContractAppendixItem,
  RelatedSlipInfoType,
  SelectAdjustableGoodsServicesModel,
} from "models/ContractAnnex";
import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { Dispatch, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { TypeAction } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/ContractTerms/ContractTermsHooks";
import { ContractAdjustmentModel } from "models/ContractAdjustment/ContractAdjustmentModel";
import { v4 as uuidv4 } from "uuid";

interface GoodsServiceHooksParams<T> {
  model: T | any;
  onDispatch?: Dispatch<GeneralAction<ContractAdjustmentModel>>;
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
  const [indexGoodService, setIndexGoodService] = useState<number>(null);

  const { model: modelGoodsService, dispatch: dispatchGoodsService } =
    detailService.useModel<SelectAdjustableGoodsServicesModel>(
      SelectAdjustableGoodsServicesModel
    );

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
  } = fieldService.useField(modelGoodsService, dispatchGoodsService);

  const goodItems: SelectAdjustableGoodsServicesModel[] = useMemo(() => {
    return model?.contractAppendixGoodsItems?.map(
      (goodItem: SelectAdjustableGoodsServicesModel) => ({
        ...goodItem,
      })
    );
  }, [model?.contractAppendixGoodsItems]);

  const goodItemIdSelected = goodItems
    ?.map((item) => ({
      goodsId: item?.contractGoodsItemId,
      unitId: item?.goodUnit?.id,
    }))
    ?.filter((item) => Boolean(item?.goodsId));

  const goodServicesId = useRef<string>(null);

  const currency = useMemo(
    () => model?.contract?.currency,
    [model?.contract?.currency]
  );

  const isTotalRow = useCallback(
    (goodItem: SelectAdjustableGoodsServicesModel) => !goodItem?.goodCategory,
    []
  );

  const data = useMemo(() => {
    const list: SelectAdjustableGoodsServicesModel[] = [];
    goodItems?.forEach((goodItem) => {
      const goodsServicesCategory = goodItem?.goodCategory;
      const index = list.findIndex((item) => {
        const idCategory = item?.id;
        return isEqual(idCategory, goodsServicesCategory?.id);
      });

      if (lt(index, numberConstants.ZERO)) {
        const initGoodsReceiptRequest = {
          ...new SelectAdjustableGoodsServicesModel(),
          id: goodsServicesCategory?.id,
          name: goodItem?.goodCategory?.name,
          taxAmount: toFixedByCurrency(
            goodItem?.taxAmount || numberConstants.ZERO,
            currency
          ),
          totalAmount: toFixedByCurrency(
            goodItem?.totalAmount || numberConstants.ZERO,
            currency
          ),
          totalConvertedAmount: toFixedNumber(
            goodItem?.totalConvertedAmount || numberConstants.ZERO,
            numberConstants.ZERO
          ),
          totalAmountConvert: toFixedNumber(
            goodItem?.totalAmountConvert || numberConstants.ZERO,
            numberConstants.ZERO
          ),
          amount: toFixedByCurrency(
            goodItem?.amount || numberConstants.ZERO,
            currency
          ),
          children: [goodItem],
        };
        list.push(initGoodsReceiptRequest);
      } else {
        const item = list?.[index];
        if (isUndefined(item)) return;

        list.splice(index, numberConstants.ONE, {
          ...item,
          children: [...item.children, goodItem],
          taxAmount: toFixedByCurrency(
            goodItem?.taxAmount + item?.taxAmount,
            currency
          ),
          amount: toFixedByCurrency(goodItem?.amount + item?.amount, currency),
          totalAmount: toFixedByCurrency(
            goodItem?.totalAmount + item?.totalAmount,
            currency
          ),
          totalConvertedAmount: toFixedNumber(
            goodItem?.totalConvertedAmount + item?.totalConvertedAmount
          ),
          totalAmountConvert: toFixedNumber(
            goodItem?.totalAmountConvert + item?.totalAmountConvert
          ),
        });
      }
    });

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
          amount: toFixedByCurrency(acc?.amount + item?.amount, currency),
        };
      },
      {
        ...new GoodsReceiptRequestItem(),
        name: translate("PR.size_type_goods_services", {
          size: size(goodItems),
        }),
        taxAmount: numberConstants.ZERO,
        totalAmount: numberConstants.ZERO,
        totalConvertedAmount: numberConstants.ZERO,
        totalAmountConvert: numberConstants.ZERO,
        amount: numberConstants.ZERO,
      }
    );

    if (isEmpty(list)) {
      return [];
    }

    return [total, ...list];
  }, [currency, goodItems, translate]);

  const handleSave = () => {
    // TODO: handle save
  };

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
    setSelectedRowKeys([]);
    const childrens = goodServices?.reduce<
      SelectAdjustableGoodsServicesModel[]
    >((acc, item) => {
      if (item) {
        item.receiverInfos = [];
      }
      return [
        ...acc,
        ...(item?.childrens && size(item.childrens) > 0
          ? item.childrens
          : [item || []]),
      ];
    }, []);

    const goodItemsSelected = [...childrens, ...goodItems]?.map(
      (goodItem: SelectAdjustableGoodsServicesModel) => {
        return {
          ...goodItem,
          unitPrice:
            !isEmpty(goodItem?.purchaseItemId) &&
            !isEqual(goodItem?.currency, model?.contract?.currency)
              ? null
              : goodItem?.unitPrice,
          currencyRate: isEmpty(model?.contract?.currency)
            ? 1
            : model?.contract?.rate,
          currency: model?.contract?.currency,
          id: `${goodItem?.id}_${uuidv4()}`,
        };
      }
    );

    onDispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        contractAppendixGoodsItems: goodItemsSelected,
        isEditGoods: true,
        contractAppendixGoodsItemsSelected: goodItemsSelected,
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
    let newList: ContractAppendixItem[] = [];
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
        ...model,
        contractAppendixGoodsItems: newList,
        isEditGoods: true,
        contractAppendixGoodsItemsSelected: newList,
      },
    });
    setTypeAction(null);
  };

  const handleAction = (typeAction: null | TypeAction, id: string | null) => {
    goodServicesId.current = id;
    setTypeAction(typeAction);
  };
  const handleOpenGoodsServiceModal = useCallback(
    (item: ContractAppendixItem, index: number) => {
      setIsOpenModal(true);
      setIndexGoodService(index);
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
    handleSave,
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
    indexGoodService,
  };
}
