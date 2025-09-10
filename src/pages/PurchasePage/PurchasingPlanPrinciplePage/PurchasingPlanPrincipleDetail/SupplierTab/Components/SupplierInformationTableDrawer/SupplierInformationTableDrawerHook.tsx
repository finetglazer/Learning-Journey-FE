import { TableRowSelection } from "antd/lib/table/interface";
import { difference, isUndefined } from "lodash";
import { useContext, useEffect, useState } from "react";
import { Checkbox } from "react-components-design-system";

import { VND_CURRENCY_UNIT } from "core/config/consts";
import { detectIntegerCurrency } from "core/helpers/currency";
import { listService } from "core/services/page-services/list-service";
import { ConfigField } from "core/services/service-types";
import { GoodServiceByCategory, GoodsServices } from "models/PurchaseRequest";
import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import { convertData } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestDetail/PurchaseRequestGoodsServicesTab/helper";
import { PurchasingPlanPrincipleDetailHookContext } from "../../../PurchasingPlanPrincipleDetailHook";

export const useSupplierInformationTableDrawerHook = (
  modelDetailSupplier: SupplierModel,
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void
) => {
  const {
    translate,
    model: modelMaster,
    selectedDetailSupplier,
    selectedDetailSupplierId,
    setSelectedDetailSupplierId,

    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);

  const [isOpenModalGoodsService, setIsOpenModalGoodsService] =
    useState<boolean>(false);

  const currencyCode = modelDetailSupplier?.currency || VND_CURRENCY_UNIT;

  const roundNum = detectIntegerCurrency(currencyCode) ? 0 : 2;

  const convertDataByCategory = convertData(
    modelDetailSupplier?.contractGoodsItems ?? []
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

  const handleDeleteSingleGoodsServices = (id?: string) => {
    let newContractGoodsItems = [];

    if (id) {
      newContractGoodsItems = modelDetailSupplier?.contractGoodsItems?.filter(
        (item: GoodsServices) => item?.id !== id
      );
    } else {
      newContractGoodsItems = modelDetailSupplier?.contractGoodsItems?.filter(
        (item: GoodsServices) => !selectedRowKeys.includes(item?.id)
      );
    }

    setSelectedRowKeys([]);
    handleChangeSingleField({
      fieldName: "contractGoodsItems",
    })(newContractGoodsItems);
  };

  useEffect(() => {
    if (!selectedDetailSupplierId) {
      setSelectedRowKeys([]);
    }
  }, [selectedDetailSupplierId, setSelectedRowKeys]);

  return {
    translate,
    modelMaster,
    roundNum,
    rowSelections,
    selectedRowKeys,
    selectedDetailSupplier,
    selectedDetailSupplierId,
    isOpenModalGoodsService,
    convertDataByCategory,
    setIsOpenModalGoodsService,
    setSelectedDetailSupplierId,
    setSelectedRowKeys,
    handleChangeSingleFieldMaster,
    handleDeleteSingleGoodsServices,
  };
};
