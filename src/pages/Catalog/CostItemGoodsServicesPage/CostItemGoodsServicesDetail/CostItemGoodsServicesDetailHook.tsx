/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEqual } from "lodash";
import { CostItemGoodsServices } from "models/CostItemGoodsServices";
import React, { createContext, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { costItemGoodsServicesRepository } from "../CostItemGoodsServicesRepository";
import { useHistory } from "react-router";
import { COST_ITEM_GOODS_SERVICES_MASTER_ROUTE } from "config/route-const";
import {
  ConfigField,
  FilterActionEnum,
  KeyType as ServiceKeyType,
} from "core/services/service-types";
import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";
import { CostItemGoodsServicesContent } from "models/CostItemGoodsServicesContent";
import { CostItem, CostItemFilter } from "models/CostItem";
import { ColumnProps } from "antd/lib/table";
import { filterService } from "core/services/page-services/filter-service";
import { LayoutCell, OneLineText } from "react-components-design-system";
import { TrashCan } from "@carbon/icons-react";
import { useCostItemGoodsServicesContentList } from "./CostItemGoodsServicesContentModal/CostItemGoodsServicesContentService";
import { tableService } from "core/services/page-services/table-service";
import { listService } from "core/services/page-services/list-service";
import { useDebounceFn } from "ahooks";
import { TableRowSelection } from "antd/lib/table/interface";
import { Switch } from "antd";
import {
  GoodService,
  GoodServiceCategory,
  GoodServiceFilter,
} from "models/Proposal/GoodService";
import { GoodServiceType } from "models/GoodServiceType";
import { GoodsServicesCategory } from "models/GoodsServicesCategory";

export interface CostItemGoodsServicesDetailContextModel {
  //for detail model
  model: CostItemGoodsServices;
  isDetail: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeAllField: (data: CostItemGoodsServices) => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeBoolField: (config: ConfigField) => (value: boolean) => void;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeDateField: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeTreeField: (
    config: ConfigField
  ) => (values: Model[], isMultiple: boolean) => void;
  handleSave: () => void;
  //for content
  contents: CostItemGoodsServicesContent[];
  setContents: (newContents: CostItemGoodsServicesContent[]) => void;
  contentColumns: ColumnProps<CostItem>[];
  //modal select costItem
  costItemFilter: CostItemFilter;
  costItemList: CostItem[];
  costItemCount: number;
  loadingList: boolean;
  setLoadingList: React.Dispatch<React.SetStateAction<boolean>>;
  handleResetList: () => void;
  handleLoadList: (
    filterParam?: CostItemFilter,
    isOverideFilter?: boolean
  ) => void;
  goodsServicesModalColumn: ColumnProps<CostItem>[];
  handleTableChange: any;
  handlePagination: (pageIndex: number, pageSize: number) => void;
  selectedRow: CostItem[];
  rowSelection: TableRowSelection<CostItem>;
  selectedRowKeys: ServiceKeyType[];
  setVisibleCostItem: React.Dispatch<React.SetStateAction<boolean>>;
  visibleCostItem: boolean;
  run: (search: string) => void;
  handleChangeCategoryFilter: (models: Model[], _: boolean) => void;
  handleChangeTypeFilter: (selectedList?: Model[], ids?: []) => void;
  handleOpenGoodsServicesModal: () => void;
  handleCloseGoodsServicesModal: () => void;
  handleSaveGoodsServicesModal: () => void;
}
export const CostItemGoodsServicesDetailContext =
  createContext<CostItemGoodsServicesDetailContextModel>({
    model: null,
    isDetail: null,
    loading: null,
    setLoading: null,
    handleChangeAllField: null,
    handleChangeSingleField: null,
    handleChangeBoolField: null,
    handleChangeSelectField: null,
    handleChangeDateField: null,
    handleChangeTreeField: null,
    handleSave: null,
    contents: null,
    setContents: null,
    contentColumns: null,
    costItemFilter: null,
    costItemList: null,
    costItemCount: null,
    loadingList: null,
    setLoadingList: null,
    handleResetList: null,
    handleLoadList: null,
    goodsServicesModalColumn: null,
    handleTableChange: null,
    handlePagination: null,
    selectedRow: null,
    rowSelection: null,
    selectedRowKeys: null,
    setVisibleCostItem: null,
    visibleCostItem: null,
    run: null,
    handleChangeCategoryFilter: null,
    handleChangeTypeFilter: null,
    handleOpenGoodsServicesModal: null,
    handleCloseGoodsServicesModal: null,
    handleSaveGoodsServicesModal: null,
  });

export function useCostItemGoodsServicesDetailHook() {
  const { model, dispatch: dispatchModel } =
    detailService.useModel<CostItemGoodsServices>(CostItemGoodsServices);

  const history = useHistory();
  const { isDetail } = detailService.useGetIsDetail(
    costItemGoodsServicesRepository.detail,
    dispatchModel
  );

  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
  } = fieldService.useField(model, dispatchModel);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();

  const handleGoMaster = React.useCallback(() => {
    history.push(COST_ITEM_GOODS_SERVICES_MASTER_ROUTE);
  }, [history]);

  const handleSave = React.useCallback(() => {
    setLoading(true);

    const newModel = { ...model };

    costItemGoodsServicesRepository
      .saveCostItemGoodsServices(newModel)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (response: any) => {
          if (isEqual(response?.status, 200)) {
            notifyToast({
              message: translate("CM.updateSuccess"),
            });
            handleGoMaster();
          }
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
              goodsServices: newModel?.goodsServices,
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  }, [handleChangeAllField, handleGoMaster, model, notifyToast, translate]);

  const contents = useMemo(() => {
    return model?.goodServices?.length > 0 ? model.goodServices : [];
  }, [model.goodServices]);

  const setContents = useCallback(
    (newContents: CostItemGoodsServicesContent[]) => {
      handleChangeAllField({
        ...model,
        goodServices: newContents,
      });
    },
    [model, handleChangeAllField]
  );

  const handleChangeActive = useCallback(
    (index: number) => (checked: boolean) => {
      const newContents = [...contents];
      newContents[index] = {
        ...newContents[index],
        isActive: checked,
      };
      setContents(newContents);
    },
    [contents, setContents]
  );

  const handleDeleteContent = useCallback(
    (index: number) => () => {
      const newContents = [...contents];
      newContents.splice(index, 1);
      setContents(newContents);
    },
    [contents, setContents]
  );

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(CostItemFilter, {
      ...new CostItemFilter(),
      pageIndex: 1,
      pageSize: 10,
    });

  const baseFilter = useMemo(() => {
    return {
      ...new CostItemFilter(),
      ignoreIds:
        model?.goodServices?.length > 0
          ? model?.goodServices
              ?.map(
                (item: CostItemGoodsServicesContent) =>
                  item.goodsServicesId || item.id
              )
              ?.filter(
                (current: CostItemGoodsServicesContent) => current !== undefined
              )
          : undefined,
      pageIndex: 1,
      pageSize: 10,
    };
  }, [model?.goodServices]);
  const {
    list,
    count,
    loadingList,
    setLoadingList,
    handleResetList,
    handleLoadList,
  } = useCostItemGoodsServicesContentList<GoodService, GoodServiceFilter>(
    costItemGoodsServicesRepository.getAllGoodsServices,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );
  const {
    selectedRow,
    setSelectedRow,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
  } = listService.useRowSelection<CostItem>("checkbox", [], true);

  const [visibleCostItem, setVisibleCostItem] = useState<boolean>(false);

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: search,
          pageIndex: 1,
          pageSize: 10,
        },
      });
      handleLoadList({ search: search, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  const handleChangeCategoryFilter = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (models: Model[], _: boolean) => {
      const goodsServiceCategories = models as GoodServiceCategory[];
      const listId =
        goodsServiceCategories?.map((org: GoodServiceCategory) => org?.id) ||
        [];
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          goodsServicesCategoryValue: goodsServiceCategories,
          goodsServicesCategoryIds: listId,
          pageIndex: 1,
          pageSize: 10,
        },
      });
      handleLoadList({
        goodsServicesCategoryIds: listId,
        pageIndex: 1,
        pageSize: 10,
      });
    },
    [dispatchFilter, handleLoadList]
  );

  const handleChangeTypeFilter = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (selectedList?: Model[], ids?: []) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          goodsServicesTypeValue: selectedList,
          goodsServicesTypeIds: ids,
          pageIndex: 1,
          pageSize: 10,
        },
      });
      handleLoadList({
        goodsServicesTypeIds: ids,
        pageIndex: 1,
        pageSize: 10,
      });
    },
    [dispatchFilter, handleLoadList]
  );

  const handleOpenGoodsServicesModal = useCallback(() => {
    const newFilter = {
      ...new CostItemFilter(),
      pageIndex: 1,
      pageSize: 10,
      ignoreIds:
        model?.goodServices?.length > 0
          ? model?.goodServices
              ?.map(
                (item: CostItemGoodsServicesContent) =>
                  item.goodsServicesId || item.id
              )
              ?.filter(
                (current: CostItemGoodsServicesContent) => current !== undefined
              )
          : undefined,
    };
    handleLoadList(newFilter, true);
    setSelectedRowKeys([]);
    setSelectedRow([]);
    setVisibleCostItem(true);
  }, [model?.goodServices, handleLoadList, setSelectedRowKeys, setSelectedRow]);

  const handleCloseGoodsServicesModal = useCallback(() => {
    setVisibleCostItem(false);
    setSelectedRowKeys([]);
    setSelectedRow([]);
  }, [setSelectedRow, setSelectedRowKeys]);

  const handleSaveGoodsServicesModal = useCallback(() => {
    const newContents = [
      ...contents,
      ...selectedRow.map((item) => ({
        ...new CostItemGoodsServicesContent(),
        code: item.code,
        name: item.name,
        goodsServicesCategory: item.goodsServicesCategory,
        goodServiceType: item.goodServiceType,
        isActive: true,
        goodsServicesId: item.id, // Ensure the 'id' property is set
      })),
    ];
    setContents(newContents);
    handleCloseGoodsServicesModal();
  }, [contents, selectedRow, setContents, handleCloseGoodsServicesModal]);

  const contentColumns: ColumnProps<CostItem>[] = useMemo(
    () => [
      {
        title: translate("costItemGoodsServices.goodsServices.code"),
        key: "code",
        dataIndex: "code",
        sorter: false,
        render(...params: [string, CostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("costItemGoodsServices.goodsServices.name"),
        key: "name",
        dataIndex: "name",
        sorter: false,
        render(...params: [string, CostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate(
          "costItemGoodsServices.goodsServices.goodsServicesCategory"
        ),
        key: "goodsServicesCategory",
        dataIndex: "goodsServicesCategory",
        sorter: false,
        render(...params: [GoodsServicesCategory, CostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  params[0]?.id
                    ? `${params[0]?.code} - ${params[0]?.name}`
                    : null
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("costItemGoodsServices.goodsServices.goodServiceType"),
        key: "goodServiceType",
        dataIndex: "goodServiceType",
        sorter: false,
        render(...params: [GoodServiceType, CostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  params[0]?.id
                    ? `${params[0]?.code} - ${params[0]?.name}`
                    : null
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("costItemGoodsServices.goodsServices.isActive"),
        key: "isActive",
        dataIndex: "isActive",
        sorter: false,
        width: "200px",
        render(...params: [boolean, CostItem, number]) {
          return (
            <LayoutCell>
              <Switch
                checked={params[0]}
                onChange={(checked) => {
                  handleChangeActive(params[2])(checked);
                }}
                className={"switch_status"}
              />
            </LayoutCell>
          );
        },
      },

      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: 40,
        align: "center",
        render(...params: [boolean, CostItem, number]) {
          return (
            <LayoutCell>
              <div className="payment-trash_icon cursor-pointer btn">
                <TrashCan size={20} onClick={handleDeleteContent(params[2])} />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [handleChangeActive, handleDeleteContent, translate]
  );
  return {
    //detail model
    model,
    isDetail,
    loading,
    setLoading,
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
    handleSave,
    // content
    contents,
    setContents,
    contentColumns,
    //modal select costItem
    costItemFilter: modelFilter,
    costItemList: list,
    costItemCount: count,
    loadingList,
    setLoadingList,
    handleResetList,
    handleLoadList,
    goodsServicesModalColumn: contentColumns?.filter(
      (col: ColumnProps<CostItem>) => {
        return col?.key !== "isActive" && col?.key !== "action";
      }
    ),
    handleTableChange,
    handlePagination,
    selectedRow,
    rowSelection,
    selectedRowKeys,
    setVisibleCostItem,
    visibleCostItem,
    run,
    handleChangeCategoryFilter,
    handleChangeTypeFilter,
    handleOpenGoodsServicesModal,
    handleCloseGoodsServicesModal,
    handleSaveGoodsServicesModal,
  };
}
