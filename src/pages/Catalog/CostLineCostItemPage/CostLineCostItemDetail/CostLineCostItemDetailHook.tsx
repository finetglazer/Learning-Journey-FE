/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrashCan } from "@carbon/icons-react";
import { useDebounceFn } from "ahooks";
import { Switch } from "antd";
import { ColumnProps } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { COST_LINE_COST_ITEM_MASTER_ROUTE } from "config/route-const";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import {
  ConfigField,
  FilterActionEnum,
  KeyType as ServiceKeyType,
} from "core/services/service-types";
import { Dayjs } from "dayjs";
import { isEqual } from "lodash";
import { CostItem, CostItemFilter } from "models/CostItem";
import { CostLineCostItem } from "models/CostLineCostItem";
import { CostLineCostItemContent } from "models/CostLineCostItemContent";
import { CostType } from "models/Proposal";
import React, { createContext, useCallback, useMemo, useState } from "react";
import { Model } from "react-3layer-common";
import { LayoutCell, OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize } from "rxjs";
import { costLineCostItemRepository } from "../CostLineCostItemRepository";
import { useCostLineCostItemContentList } from "./CostLineCostItemContentModal/CostLineCostItemContentService";

export interface CostLineCostItemDetailContextModel {
  //for detail model
  model: CostLineCostItem;
  isDetail: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeAllField: (data: CostLineCostItem) => void;
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
  contents: CostLineCostItemContent[];
  setContents: (newContents: CostLineCostItemContent[]) => void;
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
  costItemModalColumn: ColumnProps<CostItem>[];
  handleTableChange: any;
  handlePagination: (pageIndex: number, pageSize: number) => void;
  selectedRow: CostItem[];
  rowSelection: TableRowSelection<CostItem>;
  selectedRowKeys: ServiceKeyType[];
  setVisibleCostItem: React.Dispatch<React.SetStateAction<boolean>>;
  visibleCostItem: boolean;
  run: (search: string) => void;
  handleOpenCostItemModal: () => void;
  handleCloseCostItemModal: () => void;
  handleSaveCostItemModal: () => void;
}
export const CostLineCostItemDetailContext =
  createContext<CostLineCostItemDetailContextModel>({
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
    costItemModalColumn: null,
    handleTableChange: null,
    handlePagination: null,
    selectedRow: null,
    rowSelection: null,
    selectedRowKeys: null,
    setVisibleCostItem: null,
    visibleCostItem: null,
    run: null,
    handleOpenCostItemModal: null,
    handleCloseCostItemModal: null,
    handleSaveCostItemModal: null,
  });

export function useCostLineCostItemDetailHook() {
  const { model, dispatch: dispatchModel } =
    detailService.useModel<CostLineCostItem>(CostLineCostItem);

  const history = useHistory();
  const { isDetail } = detailService.useGetIsDetail(
    costLineCostItemRepository.detail,
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
    history.push(COST_LINE_COST_ITEM_MASTER_ROUTE);
  }, [history]);

  const handleSave = React.useCallback(() => {
    setLoading(true);

    const newModel = { ...model };

    costLineCostItemRepository
      .saveCostLineCostItem(newModel)
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
              costItems: newModel?.costItems,
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
    return model?.costItems?.length > 0 ? model.costItems : [];
  }, [model.costItems]);

  const setContents = useCallback(
    (newContents: CostLineCostItemContent[]) => {
      handleChangeAllField({
        ...model,
        costItems: newContents,
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
        model?.costItems?.length > 0
          ? model?.costItems
              ?.map((item) => item.costItemId || item.id)
              ?.filter((item) => item !== undefined)
          : undefined,
      pageIndex: 1,
      pageSize: 10,
    };
  }, [model?.costItems]);
  const {
    list,
    count,
    loadingList,
    setLoadingList,
    handleResetList,
    handleLoadList,
  } = useCostLineCostItemContentList<CostItem, CostItemFilter>(
    costLineCostItemRepository.getAllCostItem,
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

  const handleOpenCostItemModal = useCallback(() => {
    const newFilter = {
      ...new CostItemFilter(),
      pageIndex: 1,
      pageSize: 10,
      ignoreIds:
        model?.costItems?.length > 0
          ? model?.costItems
              ?.map((item) => item.costItemId || item.id)
              ?.filter((item) => item !== undefined)
          : undefined,
    };

    handleLoadList(newFilter, true);
    setSelectedRowKeys([]);
    setSelectedRow([]);
    setVisibleCostItem(true);
  }, [model?.costItems, handleLoadList, setSelectedRowKeys, setSelectedRow]);

  const handleCloseCostItemModal = useCallback(() => {
    setVisibleCostItem(false);
    setSelectedRowKeys([]);
    setSelectedRow([]);
  }, [setSelectedRow, setSelectedRowKeys]);

  const handleSaveCostItemModal = useCallback(() => {
    const newContents = [
      ...contents,
      ...selectedRow.map((item) => ({
        ...new CostLineCostItemContent(),
        code: item.code,
        name: item.name,
        description: item.description,
        maximumScore: item.maximumScore,
        costType: item.costType,
        isActive: true,
        costItemId: item.id, // Ensure the 'id' property is set
      })),
    ];
    setContents(newContents);
    handleCloseCostItemModal();
  }, [contents, selectedRow, setContents, handleCloseCostItemModal]);

  const contentColumns: ColumnProps<CostItem>[] = useMemo(
    () => [
      {
        title: translate("costLineCostItems.costItems.code"),
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
        title: translate("costLineCostItems.costItems.name"),
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
        title: translate("costLineCostItems.costItems.costType"),
        key: "costType",
        dataIndex: "costType",
        sorter: false,
        render(...params: [CostType, CostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  params[0]?.id ? `${params[0]?.code}-${params[0]?.name}` : null
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("costLineCostItems.costItems.isActive"),
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
    costItemModalColumn: contentColumns?.filter(
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
    handleOpenCostItemModal,
    handleCloseCostItemModal,
    handleSaveCostItemModal,
  };
}
