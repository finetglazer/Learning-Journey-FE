import { useDebounceFn } from "ahooks";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg, IcSearchSVG } from "assets/icons";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  TABLE_ROW_KEY,
  WIDTH_1000,
} from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { ConfigField, FilterActionEnum } from "core/services/service-types";
import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  BORDER_TYPE,
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { PurchasingPlanPrincipleDetailHookContext } from "../../../PurchasingPlanPrincipleDetailHook";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { formatNumber } from "core/helpers/number";
import { GoodsServicesByPrincipleContractFilter } from "models/PurchasingPlan/PurchasingPlanFilter";
import { GoodsServices } from "models/PurchaseRequest";
import { filterService } from "core/services/page-services/filter-service";
import { cloneDeep, isEmpty } from "lodash";

type ModalListGoodsServicesProps = {
  open: boolean;
  modelDetailSupplier: SupplierModel;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleCancelModalGoodsService: () => void;
};

enum ColumnKey {
  NAME = "name",
  BRANCH = "branch",
  DESCRIPTION = "description",
  NOTE = "note",
  UNIT = "unit",
  REQUEST_QUANTITY = "requestQuantity",
  REMAINING_QUANTITY = "remainingQuantity",
}

const columnsWidth = {
  name: 140,
  branch: 140,
  description: 200,
  note: 180,
  unit: 120,
  requestQuantity: 140,
  remainingQuantity: 140,
};

const ModalListGoodsServices = ({
  open,
  modelDetailSupplier,
  handleChangeSingleField,
  handleCancelModalGoodsService,
}: ModalListGoodsServicesProps) => {
  const { translate, model } = useContext<PurchasingPlanModel>(
    PurchasingPlanPrincipleDetailHookContext
  );

  const [isFirstSearchGoodsServices, setIsFirstSearchGoodsServices] =
    useState(true);
  const initialGoodsServicesList = useRef<GoodsServices[]>(null);

  const supplierId = modelDetailSupplier?.supplierId;
  const contractId = modelDetailSupplier?.contractId;
  const purchasePlanId = model?.id;
  const selectedGoods = modelDetailSupplier?.contractGoodsItems;
  const supplierPrincipleContracts = model?.supplierPrincipleContracts;

  const baseFilter = React.useMemo(() => {
    return {
      ...new GoodsServicesByPrincipleContractFilter(),
      pageIndex: 1,
      pageSize: 10,
      supplierId,
      contractId,
      purchasePlanId,
      selectedGoods,
      supplierPrincipleContracts,
    };
  }, [
    contractId,
    purchasePlanId,
    supplierPrincipleContracts,
    selectedGoods,
    supplierId,
  ]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(
      GoodsServicesByPrincipleContractFilter,
      baseFilter
    );

  const {
    list: goodsServicesList,
    count,
    handleLoadList,
    loadingList,
  } = listService.useList<
    GoodsServices,
    GoodsServicesByPrincipleContractFilter
  >(
    purchasingPlanRepository.getGoodsServicesByPrincipleContractList,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<GoodsServices>(
      "checkbox",
      [],
      true,
      "manual",
      true
    );

  const mergeAndSumQuantities = (
    arr1: GoodsServices[],
    arr2: GoodsServices[]
  ) => {
    const map = new Map(arr1.map((item) => [item.id, item]));

    arr2.forEach((item) => {
      if (map.has(item.id)) {
        map.get(item.id).quantity += item.remainingQuantity || 0;
      } else {
        map.set(item.id, { ...item, quantity: item.remainingQuantity });
      }
    });

    return Array.from(map.values());
  };

  const handleSelectGoodsServices = () => {
    const selectingGoodsServices = (
      (!isEmpty(initialGoodsServicesList?.current) &&
        initialGoodsServicesList?.current) ||
      goodsServicesList
    ).filter((goodsServicesItem) =>
      selectedRowKeys.includes(goodsServicesItem?.id)
    );
    if (isEmpty(selectingGoodsServices)) return;

    const currentContractGoodsItems = cloneDeep(
      modelDetailSupplier?.contractGoodsItems
    );

    const newContractGoodsItems = mergeAndSumQuantities(
      currentContractGoodsItems,
      selectingGoodsServices
    );

    handleChangeSingleField({
      fieldName: "contractGoodsItems",
    })(newContractGoodsItems);

    handleCloseModalGoodsService();
  };

  const handleCloseModalGoodsService = () => {
    setSelectedRowKeys([]);
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...baseFilter,
        pageSize: modelFilter.pageSize,
      },
    });
    handleCancelModalGoodsService();
  };

  const { run } = useDebounceFn(
    (search: string) => {
      if (isFirstSearchGoodsServices) {
        initialGoodsServicesList.current = goodsServicesList;
        setIsFirstSearchGoodsServices(false);
      }

      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search,
          supplierId,
          contractId,
          purchasePlanId,
          selectedGoods,
          supplierPrincipleContracts,
          pageIndex: 1,
        },
      });
      handleLoadList({
        supplierId,
        contractId,
        purchasePlanId,
        selectedGoods,
        supplierPrincipleContracts,
        search,
        pageIndex: 1,
      });
    },
    {
      wait: 300,
    }
  );

  const columns: ColumnProps<GoodsServices>[] = React.useMemo(
    () => [
      {
        title: translate("PL.goods_services_text"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        width: columnsWidth.name,
        render: (_, record) => (
          <LayoutCell>
            <TwoLineText
              classNameFirstLine="text-table-content-primary"
              classNameSecondLine="text-second__style"
              valueLine1={record?.name}
              valueLine2={record?.code}
              useTooltip
            />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.manufacturer"),
        key: ColumnKey.BRANCH,
        dataIndex: ColumnKey.BRANCH,
        width: columnsWidth.branch,
        render: (_, record) => (
          <LayoutCell>
            <OneLineText value={record?.branch?.name} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.description_goods_services"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
        width: columnsWidth.description,
        render: (description) => (
          <LayoutCell>
            <OneLineText value={description} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.note_label"),
        key: ColumnKey.NOTE,
        width: columnsWidth.note,
        dataIndex: ColumnKey.NOTE,
        render: (note) => (
          <LayoutCell>
            <OneLineText value={note} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.purchasing_plan_unit"),
        key: ColumnKey.UNIT,
        dataIndex: ColumnKey.UNIT,
        width: columnsWidth.unit,
        render: (_, record) => (
          <LayoutCell>
            <OneLineText value={record?.unit?.name} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="text-end">
            <label>{translate("PL.purchasing_plan_request_quantity")}</label>
          </div>
        ),
        key: ColumnKey.REQUEST_QUANTITY,
        dataIndex: ColumnKey.REQUEST_QUANTITY,
        width: columnsWidth.requestQuantity,
        render: (requestQuantity) => (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(requestQuantity)} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="text-end">
            <label>{translate("PL.purchasing_plan_remaining_quantity")}</label>
          </div>
        ),
        key: ColumnKey.REMAINING_QUANTITY,
        dataIndex: ColumnKey.REMAINING_QUANTITY,
        width: columnsWidth.remainingQuantity,
        render: (remainingQuantity) => (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(remainingQuantity)} />
          </LayoutCell>
        ),
      },
    ],
    [translate]
  );

  useEffect(() => {
    if (open) {
      handleLoadList({
        supplierId,
        contractId,
        selectedGoods,
      });
    }
  }, [selectedGoods, baseFilter, handleLoadList, open, supplierId, contractId]);

  return (
    <Modal
      open={open}
      title={translate("PL.select_goods_services")}
      size={WIDTH_1000}
      closeIcon={true}
      isShowIconBack={false}
      disableButtonApply={isEmpty(selectedRowKeys)}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={handleCloseModalGoodsService}
      handleSave={handleSelectGoodsServices}
    >
      <div>
        <div className="p-b--2xs">
          <div className="align-items-center d-flex gap-3">
            <div className="flex-grow-1 pt-1">
              <InputText
                isSmall={false}
                type={BORDER_TYPE.BORDERED}
                prefix={<img src={IcSearchSVG} alt="search icon" width={16} />}
                placeHolder={translate("PL.search_name_code_goods_services")}
                value={modelFilter.search}
                onChange={run}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="page-master__table">
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          loading={loadingList}
          columns={columns}
          dataSource={goodsServicesList}
          isDragable={true}
          rowSelection={{
            ...rowSelection,
          }}
          scroll={{ y: 414 }}
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.txt_search_no_data")}
                isFilter
                icon={IcEmptySearchSvg}
                height={500}
              />
            ),
          }}
        />
        <div className="page-master__pagination">
          <Pagination
            pageIndex={modelFilter.pageIndex}
            pageSize={modelFilter.pageSize}
            total={count}
            onChange={handlePagination}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalListGoodsServices;
