import { useDebounceFn, useUpdateEffect } from "ahooks";
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
import {
  ConvertibleGoodsItems,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import React, { useEffect, useMemo } from "react";
import {
  BORDER_TYPE,
  InputText,
  LayoutCell,
  Modal,
  MultipleSelect,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { GoodsServices } from "models/PurchaseRequest";
import { filterService } from "core/services/page-services/filter-service";
import { isEmpty } from "lodash";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { GoodServiceFilter } from "models/Proposal/GoodService";
import { v4 as uuidv4 } from "uuid";
import { childText } from "models/PurchasingPlan/PurchasingPlanConstant";

type ModalListGoodsServicesProps = {
  open: boolean;
  listServicePicked: GoodsServices[];
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleCancelModalGoodsService: () => void;
  handleAddNewDataTable: (data: ConvertibleGoodsItems) => void;
  contextValue: PurchasingPlanModel;
};

enum ColumnKey {
  NAME = "name",
  CODE = "code",
  CATEGORY = "category",
  UNIT = "unit",
}

const columnsWidth = {
  code: 160,
  name: 402,
  category: 250,
  unit: 100,
};

const ModalListGoodsServices = ({
  open,
  listServicePicked,
  handleChangeSingleField,
  handleCancelModalGoodsService,
  handleAddNewDataTable,
  contextValue,
}: ModalListGoodsServicesProps) => {
  const { translate, model } = contextValue;

  const baseFilter = useMemo(() => {
    return {
      ...new GoodServiceFilter(),
      pageIndex: 1,
      pageSize: 10,
      isGetForProposal: false,
    };
  }, []);

  const currentItem = useMemo(() => {
    return model?.currentSelectSupplier;
  }, [model?.currentSelectSupplier]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(GoodServiceFilter, baseFilter);

  const {
    list: goodsServicesList,
    count,
    handleLoadList,
    loadingList,
  } = listService.useList<GoodsServices, GoodServiceFilter>(
    purchasingPlanRepository.getGoodServicesListByModal,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const {
    handleChangeMultipleSelectFilter,
    handleChangeInputFilter,
    handleChangeAllFilter,
  } = filterService.useFilter<GoodServiceFilter>(modelFilter, dispatchFilter);

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const {
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRowKeys,
    setSelectedRow,
  } = listService.useRowSelection<GoodsServices>(
    "checkbox",
    [],
    true,
    "manual",
    true
  );

  const handleSelectGoodsServices = () => {
    let selectingGoodsServices = goodsServicesList.filter((el) =>
      selectedRowKeys.includes(el?.id)
    );

    if (listServicePicked?.length > 0) {
      const oldData = [...currentItem.convertibleGoodsItems];
      const dataExceptListServicePicked = [...selectingGoodsServices]
        .filter((el) => {
          const listGoodIds = listServicePicked.map((el2) => el2.goodsId);
          return !listGoodIds.includes(el.id);
        })
        ?.map((item, index) => {
          return {
            ...item,
            id: item.id && item.goodsId ? item.id : `${uuidv4()}${childText}`,
            goodsId: item.id,
            tax: item?.tax
              ? item.tax
              : oldData[index]?.tax
              ? oldData[index].tax
              : currentItem?.tax,
            unit: item?.unit || item?.unitOfMeasure,
            unitId: item?.unitOfMeasure?.id,
            branch: item?.branch || item?.manufacturer,
            branchId: item?.manufacturer?.id,
          };
        });

      selectingGoodsServices = [
        ...listServicePicked,
        ...dataExceptListServicePicked,
      ];
    }

    if (isEmpty(selectingGoodsServices)) return;
    handleAddNewDataTable(selectingGoodsServices);

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
      handleChangeInputFilter({ fieldName: "search" })(search);
    },
    {
      wait: 300,
    }
  );

  const columns: ColumnProps<GoodsServices>[] = React.useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_goods_services_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        width: columnsWidth.code,
        render: (value, record) => (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.purchasing_plan_goods_services_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        width: columnsWidth.name,
        render: (value, record) => (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.purchasing_plan_goods_services_category"),
        key: ColumnKey.CATEGORY,
        dataIndex: ColumnKey.CATEGORY,
        width: columnsWidth.category,
        render: (_, record) => (
          <LayoutCell>
            <OneLineText value={record?.goodsServicesCategoryName} />
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
            <OneLineText
              value={
                record?.unitOfMeasure?.name || record?.unitOfMeasureGroup?.name
              }
            />
          </LayoutCell>
        ),
      },
    ],
    [translate]
  );

  useUpdateEffect(() => {
    handleLoadList(modelFilter);
  }, [modelFilter]);

  useEffect(() => {
    if (open) {
      handleChangeAllFilter({
        ...baseFilter,
      });
      setSelectedRowKeys(
        model?.currentSelectSupplier?.convertibleGoodsItems?.map(
          (item: ConvertibleGoodsItems) => item.goodsId
        )
      );
    }
  }, [
    baseFilter,
    handleChangeAllFilter,
    model?.currentSelectSupplier?.convertibleGoodsItems,
    open,
    setSelectedRowKeys,
  ]);

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
            <div className="flex-3 pt-1">
              <InputText
                isSmall={false}
                type={BORDER_TYPE.BORDERED}
                prefix={<img src={IcSearchSVG} alt="search icon" width={16} />}
                label={translate("PL.txt_search_modal")}
                placeHolder={translate(
                  "PL.purchasing_plan_enter_goods_services_code_or_name"
                )}
                value={modelFilter.search}
                onChange={run}
              />
            </div>
            <div className="flex-1 pt-1 overflow-hidden">
              <MultipleSelect
                searchProperty="search"
                valueFilter={{
                  search: "",
                  isActive: true,
                }}
                label={translate(
                  "PL.purchasing_plan_goods_services_category_label"
                )}
                placeHolder={translate("PL.purchasing_plan_select_category")}
                appendToBody={true}
                classFilter={undefined}
                searchType=""
                type={BORDER_TYPE.BORDERED}
                isSmall={false}
                getList={proposalRepository.getGoodCategoryList}
                isEnumerable={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "goodsServicesCategory",
                })}
                values={modelFilter?.goodsServicesCategoryValue ?? []}
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
          rowSelection={rowSelection}
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
