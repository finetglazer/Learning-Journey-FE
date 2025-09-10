import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import {
  DEFAULT_PAGE_SIZE,
  numberConstants,
  STANDARD_DATE_FORMAT_US,
  STANDARD_TIME_FORMAT_MM_YYYY,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { ErrorType } from "core/helpers/handle-error";
import {
  ConfigurationUnitImport,
  ConfigurationUnitImportType,
} from "core/models/ConfigurationUnitImport/ConfigurationUnitImport";
import { HandleLoadList } from "core/models/Filter/Filter";
import {
  configurationUnitRepository,
  NAME_AREA_CONFIG_EXPORT,
  NAME_AREA_CONFIG_TEMPLATE,
} from "core/repositories/ConfigurationUnitRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import {
  FilterAction,
  HttpStatusCode,
  KeyType,
} from "core/services/service-types";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { isEqual, isNil } from "lodash";
import { AreaUnitCode } from "models/AreaUnitCode/AreaUnitCode";
import { AreaUnitCodeFilter } from "models/AreaUnitCode/AreaUnitCodeFilter";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { finalize, Observable } from "rxjs";
import { organizationManagementBaseBreadcrumb } from "../constants";
import areaUnitCodeRepository from "./AreaUnitCodeRepository";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export enum AreaUnitCodeModal {
  "DETAIL",
  "CREATE",
  "DELETE",
  "EDIT",
  "ERROR",
}

export interface AreaUnitCodeMaster {
  modelFilter: AreaUnitCodeFilter;
  list: AreaUnitCode[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  rowSelection: TableRowSelection<AreaUnitCode>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<AreaUnitCodeFilter>>;
  handleLoadList: HandleLoadList<AreaUnitCodeFilter>;
  handleResetList: () => void;
  handleImport: (file: Blob[] | File[]) => Observable<any>;
  handleDownloadTemplate: () => void;
  handleExport: () => void;
  setModal?: Dispatch<SetStateAction<boolean>>;
  handleActionAreaUnitCode?: (params: {
    modal: AreaUnitCodeModal;
    id?: string;
  }) => void;
  validAction: (action: string) => boolean;
}

export const AreaUnitCodeMasterContext = createContext<AreaUnitCodeMaster>({
  modelFilter: new AreaUnitCodeFilter(),
  list: [],
  count: numberConstants.ZERO,
  countFilter: numberConstants.ZERO,
  loadingList: false,
  rowSelection: undefined,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  handleActionAreaUnitCode: null,
  handleImport: null,
  handleDownloadTemplate: null,
  handleExport: null,
  validAction: null,
});

export const useAreaUnitCodeMasterHooks = () => {
  const [translate] = useTranslation();
  const areaUnitCodeIdSelected = useRef<string | null>(null);
  const [modal, setModal] = useState<AreaUnitCodeModal | null>(null);
  const [importError, setImportError] = useState<string[]>([]);
  const { notifyToast } = appMessageService.useCRUDMessage();
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_COSTCENTERALLOCATION
  );

  const breadcrumb = useMemo(
    () => [
      ...organizationManagementBaseBreadcrumb,
      {
        name: translate("CM.menu_title_area_unit_code"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      AreaUnitCodeFilter,
      {
        ...new AreaUnitCodeFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search", "date"]
    );

  const baseFilter: AreaUnitCodeFilter = useMemo(() => {
    return {
      ...new AreaUnitCodeFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
      date: modelFilter?.date || formatDate(dayjs(), STANDARD_DATE_FORMAT_US),
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<AreaUnitCode, AreaUnitCodeFilter>(
      areaUnitCodeRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<AreaUnitCode>("checkbox", [], true);

  const handleActionAreaUnitCode = useCallback(
    ({ modal, id }: { modal: AreaUnitCodeModal; id?: string }) => {
      areaUnitCodeIdSelected.current = id;
      setModal(modal);
    },
    []
  );

  const handleCloseModal = useCallback(
    (shouldReloadList?: boolean) => {
      areaUnitCodeIdSelected.current = null;
      setModal(null);
      if (isEqual(shouldReloadList, true)) {
        handleLoadList();
      }
    },
    [handleLoadList]
  );

  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);

  const handleDeleteRecord = () => {
    setLoadingModal(true);
    const id = areaUnitCodeIdSelected.current;
    let ids = [];
    if (isNil(id)) {
      ids = selectedRowKeys as string[];
    } else {
      ids = [id];
    }

    areaUnitCodeRepository
      .delete(ids)
      .pipe(finalize(() => setLoadingModal(false)))
      .subscribe({
        next: () => {
          handleCloseModal();
          setSelectedRowKeys([]);
          handleLoadList();
          notifyToast({
            type: "success",
            message: translate("CM.txt_update_success"),
          });
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });

          handleCloseModal();
        },
      });
  };

  const handleErrors = (error: AxiosError) => {
    if (isEqual(error.response.status, HttpStatusCode.BAD_REQUEST)) {
      type ErrorType = {
        type: string;
        message?: string;
        sheetErrors?: string[];
      };
      const data = error?.response.data as ErrorType;
      switch (data?.type) {
        case ErrorType.BAD_REQUEST:
          notifyToast({
            type: "error",
            message: data?.message,
          });
          break;
        case ErrorType.SYSTEM_ERROR:
          setImportError(data?.sheetErrors);
          setModal(AreaUnitCodeModal.ERROR);
          break;
        default:
          break;
      }
    }
  };

  const handleImport = (file: Blob[] | File[]) => {
    const formData: ConfigurationUnitImport = {
      file,
      templateType: ConfigurationUnitImportType.ByArea,
      date: modelFilter?.date,
    };
    return configurationUnitRepository.import(formData).subscribe({
      next: () => {
        handleLoadList();
        setSelectedRowKeys([]);
        notifyToast({
          type: "success",
          message: translate("AUC.msg_area_config_success", {
            date: formatDate(
              modelFilter?.date || dayjs(),
              STANDARD_TIME_FORMAT_MM_YYYY
            ),
          }),
        });
      },
      error: (error: AxiosError) => {
        handleErrors(error);
      },
    });
  };

  const handleDownloadTemplate = () => {
    configurationUnitRepository
      .downloadTemplate(ConfigurationUnitImportType.ByArea)
      .subscribe({
        next: (response: AxiosResponse<ArrayBuffer>) => {
          const blob = new Blob([response.data], {
            type: response?.headers?.["content-type"],
          });
          saveAs(blob, NAME_AREA_CONFIG_TEMPLATE);
        },
      });
  };

  const handleExport = () => {
    configurationUnitRepository
      .exportFile({
        date: modelFilter?.date,
        templateType: ConfigurationUnitImportType.ByArea,
      })
      .subscribe({
        next: (response: AxiosResponse<ArrayBuffer>) => {
          const blob = new Blob([response.data], {
            type: response?.headers?.["content-type"],
          });
          saveAs(blob, NAME_AREA_CONFIG_EXPORT);
        },
      });
  };

  const handleCloseModalError = () => {
    setModal(null);
    setImportError([]);
  };

  useEffect(() => {
    handleLoadList();
  }, []);

  return {
    list,
    count,
    countFilter,
    modelFilter,
    loadingList,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    areaUnitCodeIdSelected: areaUnitCodeIdSelected.current,
    handleActionAreaUnitCode,
    handleImport,
    handleDownloadTemplate,
    handleExport,
    validAction,
    // non-context
    handleCloseModal,
    isLoadingModal,
    translate,
    breadcrumb,
    modal,
    setModal,
    importError,
    handleDeleteRecord,
    handleCloseModalError,
  };
};
