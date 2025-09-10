import React, { createContext, useCallback, useMemo, useState } from "react";
import { TableRowSelection } from "antd/lib/table/interface";
import { useTranslation } from "react-i18next";
import appMessageService from "../../../core/services/common-services/app-message-service";
import { APP_OVERVIEW } from "../../../config/route-const";
import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import { listService } from "core/services/page-services/list-service";
import { Currency } from "models/Currency";
import { ReportTemplate, ReportTemplateFilter } from "models/ReportTemplate";
import { queryStringService } from "core/services/page-services/query-string-service";
import { reportTemplateRepository } from "pages/SystemAdministration/ReportTemplate/ReportTemplateRepository";
import { detailService } from "core/services/page-services/detail-service";
import saveAs from "file-saver";
import { finalize } from "rxjs";
import { AxiosError } from "axios";
import dayjs from "dayjs";

export interface ReportTemplateManagementContextProps {
  modelFilter: ReportTemplateFilter;
  list: ReportTemplate[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  dispatchFilter: React.Dispatch<ReportTemplateFilter>;
  handleLoadList: (filterParam?: ReportTemplateFilter) => void;
  handleResetList: () => void;
  notifyToast: any;
  //for context content in detail modal
  detailModel: ReportTemplate;
  dispatchDetailModel: React.Dispatch<GeneralAction<ReportTemplate>>;
  handleDeleteRecord?: (record?: ReportTemplate) => void;
  rowSelection: TableRowSelection<ReportTemplate>;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
  isOpenModal: boolean;
  isOpenPreviewModal: boolean;
  handleOpenModal: (id?: string, type?: "detail" | "preview") => void;
  handleCloseModal: (type: "detail" | "preview") => void;
  handleDownloadFile: (data: ReportTemplate) => void;
  isOpenModalDelete: boolean;
  handleOpenModalDelete: (model?: ReportTemplate) => void;
  deleteType: "Single" | "Bulk";
  handleCloseModalDelete: () => void;
  handleDelete: () => void;
  handleBulkDelete: () => void;
}

export const ReportTemplateManagementContext =
  createContext<ReportTemplateManagementContextProps>({
    modelFilter: {},
    list: [],
    count: 0,
    countFilter: 0,
    loadingList: false,
    dispatchFilter: null,
    handleLoadList: null,
    handleResetList: null,
    handleDeleteRecord: null,
    rowSelection: {} as TableRowSelection<any>,
    notifyToast: null,
    detailModel: null,
    dispatchDetailModel: null,
    selectedRowKeys: [],
    setSelectedRowKeys: null,
    isOpenModal: false,
    isOpenPreviewModal: false,
    handleDownloadFile: null,
    handleOpenModal: null,
    handleCloseModal: null,
    isOpenModalDelete: false,
    handleOpenModalDelete: null,
    deleteType: "Single",
    handleCloseModalDelete: null,
    handleDelete: null,
    handleBulkDelete: null,
  });

export function useReportTemplateManagementHooks() {
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenPreviewModal, setIsOpenPreviewModal] = useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ReportTemplateFilter,
      {
        ...new ReportTemplateFilter(),
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "search"]
    );

  const breadcrumbs = useMemo(
    () => [
      {
        name: translate("CM.menu_title_home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.menu_title_system_administration"),
      },
      {
        name: translate("CM.menu_title_report_template_management"),
      },
    ],
    [translate]
  );

  const baseFilter: ReportTemplateFilter = React.useMemo(() => {
    return {
      ...new ReportTemplateFilter(),
      pageIndex: 1,
      pageSize: 10,

      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const {
    list,
    count,
    loadingList,
    setLoadingList,
    handleResetList,
    handleLoadList,
  } = listService.useList<ReportTemplate, ReportTemplateFilter>(
    reportTemplateRepository.getAll,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  // for context content value detail

  const { model: detailModel, dispatch: dispatchDetailModel } =
    detailService.useModel<ReportTemplate>(ReportTemplate);

  const [deleteType, setDeleteType] = React.useState<"Bulk" | "Single">(
    "Single"
  );

  const handleOpenModalDelete = useCallback(
    (model?: Currency) => {
      if (!isOpenModalDelete) {
        setIsOpenModalDelete(true);
        if (model?.id) {
          dispatchDetailModel({
            type: GeneralActionEnum.SET,
            payload: model,
          });
          setDeleteType("Single");
        } else {
          setDeleteType("Bulk");
        }
      }
    },
    [dispatchDetailModel, isOpenModalDelete]
  );

  const handleCloseModalDelete = useCallback(() => {
    if (isOpenModalDelete) {
      setIsOpenModalDelete(false);
      dispatchDetailModel({
        type: GeneralActionEnum.SET,
        payload: { ...new Currency() },
      });
    }
  }, [dispatchDetailModel, isOpenModalDelete]);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<ReportTemplate>("checkbox", [], true);

  const handleDelete = () => {
    setLoadingList(true);
    reportTemplateRepository
      .delete([...[], detailModel?.id])
      .pipe(finalize(() => setLoadingList(false)))
      .subscribe({
        next: () => {
          setIsOpenModalDelete(false);
          handleLoadList();
          notifyToast({
            message: translate("CM.updateSuccess"),
            placement: "topRight",
          });
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
          setIsOpenModalDelete(false);
        },
      });
  };

  const handleBulkDelete = () => {
    setLoadingList(true);
    const ids = selectedRowKeys?.map((item) => item?.toString());
    reportTemplateRepository
      .delete(ids)
      .pipe(finalize(() => setLoadingList(false)))
      .subscribe({
        next: () => {
          setIsOpenModalDelete(false);
          setSelectedRowKeys([]);
          handleLoadList();
          notifyToast({
            message: translate("CM.updateSuccess"),
            placement: "topRight",
          });
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
          setIsOpenModalDelete(false);
        },
      });
  };

  const handleOpenModal = useCallback(
    (id?: string, type?: "preview" | "detail") => {
      if (id) {
        reportTemplateRepository.detail(id).subscribe((res: ReportTemplate) => {
          dispatchDetailModel({
            type: GeneralActionEnum.SET,
            payload: {
              ...res?.data,
            },
          });
        });
      } else {
        dispatchDetailModel({
          type: GeneralActionEnum.SET,
          payload: {
            ...new ReportTemplate(),
            status: true,
          },
        });
      }

      if (!isOpenModal && type === "detail") {
        setIsOpenModal(true);
      }
      if (!isOpenPreviewModal && type === "preview") {
        setIsOpenPreviewModal(true);
      }
    },
    [dispatchDetailModel, isOpenModal, isOpenPreviewModal]
  );
  const handleCloseModal = useCallback(
    (type: "preview" | "detail") => {
      if (isOpenModal && type === "detail") {
        setIsOpenModal(false);
        dispatchDetailModel({
          type: GeneralActionEnum.SET,
          payload: { ...new ReportTemplate() },
        });
      }

      if (isOpenPreviewModal && type === "preview") {
        setIsOpenPreviewModal(false);
        dispatchDetailModel({
          type: GeneralActionEnum.SET,
          payload: { ...new ReportTemplate() },
        });
      }
    },
    [dispatchDetailModel, isOpenModal, isOpenPreviewModal]
  );
  const handleDownloadFile = (data: ReportTemplate) => {
    reportTemplateRepository.downloadTemplate(data.id).subscribe({
      next: (response: any) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, data.code + `_${dayjs().format("DDMMYYYY HHmm")}`);
      },
    });
  };

  return {
    //context value for master
    list,
    count,
    loadingList,
    handleResetList,
    handleLoadList,
    breadcrumbs,
    //
    //
    modelFilter,
    dispatchFilter,
    countFilter,
    notifyToast,
    translate,
    detailModel,
    dispatchDetailModel,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleDownloadFile,
    isOpenModal,
    isOpenPreviewModal,
    isOpenModalDelete,
    handleOpenModal,
    handleCloseModal,
    handleDelete,
    handleBulkDelete,
    deleteType,
    handleCloseModalDelete,
    handleOpenModalDelete,
  };
}
