import { TableRowSelection } from "antd/lib/table/interface";
import { JPY_CURRENCY_UNIT } from "core/config/consts";
import { addNumbers } from "core/helpers/number";
import { listService } from "core/services/page-services/list-service";
import { difference, isEmpty, isEqual, isUndefined } from "lodash";
import { ContractDetailModel, ContractGoodsServices } from "models/Contract";
import { VND_CURRENCY } from "models/Payment";
import { GoodServiceByCategory, GoodsServices } from "models/PurchaseRequest";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { convertData } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestDetail/PurchaseRequestGoodsServicesTab/helper";
import { useContext, useEffect, useState } from "react";
import { Checkbox } from "react-components-design-system";
import { useTranslation } from "react-i18next";

export const useGoodsServicesInfoHook = () => {
  const [translate] = useTranslation();

  const {
    model: modelMaster,
    selectedDetailGoodsServicesId,
    setIsOpenGoodsServicesModal,
    setSelectedDetailGoodsServicesId,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const [deletingGoodsServicesId, setDeletingGoodsServicesId] = useState("");

  const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] =
    useState(false);

  const handleOpenGoodsServicesModal = () => {
    setIsOpenGoodsServicesModal(true);
  };

  useEffect(() => {
    const total = modelMaster?.contractGoodsServicesList?.reduce(
      (prev: number, curr) => {
        return addNumbers(prev, curr.totalAmount || 0);
      },
      0
    );
    handleChangeSingleFieldMaster({
      fieldName: "totalAmountContractGoodsServicesList",
    })(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelMaster?.contractGoodsServicesList]);

  const convertDataByCategory = convertData(
    (modelMaster?.contractGoodsServicesList as []) ?? []
  );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys, setSelectedRow } =
    listService.useRowSelection<GoodsServices>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const rowSelections: TableRowSelection<GoodServiceByCategory> = {
    ...rowSelection,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRow(
        selectedRows.filter(
          (item) => item?.id && isUndefined(item?.category?.id)
        )
      );
    },
    getCheckboxProps: (record: GoodServiceByCategory) => ({
      disabled: record?.isTotal,
    }),
    renderCell: (value: boolean, record: GoodServiceByCategory) => {
      return (
        <div
          className={`${
            record.isTotal ? "d-none" : "d-flex"
          } justify-content-center align-items-center payment-height_40`}
        >
          <Checkbox
            readOnly={record.isTotal}
            checked={value}
            onChange={(e) => {
              if (!record.children) {
                const lsIdSelected = e
                  ? [...selectedRowKeys, record?.id]
                  : difference(selectedRowKeys, [record?.id]);
                const parent = convertDataByCategory.find((item) =>
                  item.children?.some((i) => i.id === record?.id)
                );
                if (
                  parent?.children?.every((child) =>
                    lsIdSelected.includes(child.id)
                  )
                ) {
                  setSelectedRowKeys([...lsIdSelected, parent?.id]);
                } else {
                  const checkParentSelected = selectedRowKeys.includes(
                    parent?.id
                  );
                  setSelectedRowKeys(
                    checkParentSelected
                      ? difference(lsIdSelected, [parent.id])
                      : lsIdSelected
                  );
                }
              } else {
                const idChildSelected = record.children.map((i) => i.id);
                if (e) {
                  setSelectedRowKeys([
                    ...selectedRowKeys,
                    ...idChildSelected,
                    record?.id,
                  ]);
                } else {
                  setSelectedRowKeys(
                    difference(selectedRowKeys, [
                      ...idChildSelected,
                      record?.id,
                    ])
                  );
                }
              }
            }}
          />
        </div>
      );
    },
  };

  const handleCloseDeleteConfirmModal = () => {
    setIsOpenDeleteConfirmModal(false);
    setDeletingGoodsServicesId("");
    setSelectedRowKeys([]);
  };

  const handleDeleteGoodsServicesRows = () => {
    const deletedIds = deletingGoodsServicesId
      ? [deletingGoodsServicesId]
      : selectedRowKeys;

    const newContractGoodsServicesList =
      modelMaster?.contractGoodsServicesList?.filter(
        (item: ContractGoodsServices) => {
          return !deletedIds.includes(item?.id);
        }
      );

    handleChangeSingleFieldMaster({
      fieldName: "contractGoodsServicesList",
    })(newContractGoodsServicesList);

    handleCloseDeleteConfirmModal();
  };

  const shouldDisabledAddGoodsServices = () =>
    !modelMaster?.originalPurchasePlanId ||
    isEmpty(modelMaster?.contractSupplier);

  const currencyCode = modelMaster?.currency || VND_CURRENCY;
  const isVND = isEqual(currencyCode, VND_CURRENCY);
  const isJPY = isEqual(currencyCode, JPY_CURRENCY_UNIT);
  const roundNum = isVND || isJPY ? 0 : 2;

  return {
    translate,
    modelMaster,
    selectedDetailGoodsServicesId,
    convertDataByCategory,
    rowSelections,
    roundNum,
    currencyCode,
    deletingGoodsServicesId,
    isOpenDeleteConfirmModal,
    selectedRowKeys,
    setSelectedRowKeys,
    setDeletingGoodsServicesId,
    setIsOpenDeleteConfirmModal,
    handleDeleteGoodsServicesRows,
    handleCloseDeleteConfirmModal,
    handleOpenGoodsServicesModal,
    setSelectedDetailGoodsServicesId,
    shouldDisabledAddGoodsServices,
  };
};
