import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { numberConstants } from "core/config/consts";
import { validator } from "core/helpers/validator";
import appMessageService from "core/services/common-services/app-message-service";
import { filterService } from "core/services/page-services/filter-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterActionEnum } from "core/services/service-types";
import saveAs from "file-saver";
import { useState } from "react";
import { ModelFilter } from "react-3layer-common";
import { Observable } from "rxjs";

interface Params<TFilter extends ModelFilter, TDetail> {
  ModelFilterClass: typeof ModelFilter;
  getDetail: (filter: TFilter) => Observable<TDetail>;
  onExport?: (filter: TFilter) => Observable<AxiosResponse<ArrayBuffer>>;
  validateField?: string[] | ["supplierNameId", "contractId"];
}

export default function useReportDetail<TFilter extends ModelFilter, TDetail>({
  ModelFilterClass,
  getDetail,
  onExport,
  validateField,
}: Params<TFilter, TDetail>) {
  const [isShowResult, setIsShowResult] = useState<boolean>(false);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const baseFilter = {
    ...new ModelFilterClass(),
  };

  const [originFilter, dispatchOriginFilter, _, getModelFilter] =
    queryStringService.useQueryString(ModelFilterClass, baseFilter);

  const { modelFilter, dispatchFilter } = filterService.useModelFilter(
    ModelFilterClass,
    originFilter
  );

  const {
    handleChangeAllFilter,
    handleChangeInputFilter,
    handleChangeMultipleSelectFilter,
    handleChangeDateFilter,
    handleChangeDateRangeFilter,
    handleChangeSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  const handleFilterDetail = () => {
    if (validateField && !validate()) return;
    const filter = {
      ...modelFilter,
      isReloadPage: true,
    } as unknown as TFilter;

    dispatchOriginFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
    handleLoadDetail(filter);
    setIsShowResult(true);
  };

  const handleResetFilterDetail = () => {
    const resetParams = {
      type: FilterActionEnum.SET,
      payload: baseFilter,
    };
    dispatchOriginFilter(resetParams);
    dispatchFilter(resetParams);
    setIsReset(true);
    setIsShowResult(false);
  };

  const validate = () => {
    const errors = {
      ...validator.required({
        filedValidate: validateField,
        data: modelFilter,
      }),
    };
    if (Object.keys(errors).length > numberConstants.ZERO) {
      handleChangeAllFilter({ ...modelFilter, errors });
      return false;
    }
    return true;
  };

  const handleLoadDetail = (filter?: TFilter) => {
    if (!getDetail) return;
    if (validateField && !validate()) return;
    setLoadingDetail(true);
    const currentFilter = filter || (getModelFilter() as TFilter);
    getDetail(currentFilter).subscribe({
      next: (response: TDetail) => {
        setDetail(response);
        setLoadingDetail(false);
      },
      error: (error: AxiosError) => {
        notifyToast({
          message: error?.response?.data?.message || "Error loading detail",
          type: "error",
        });
        setLoadingDetail(false);
      },
    });
  };

  const handleExportFile = (fileName: string) => {
    if (!detail) return;
    onExport(detail?.data?.info?.id).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
      },
      error: (error: AxiosError) => {
        notifyToast({
          message: error?.response?.data?.message,
          type: "error",
        });
      },
    });
  };

  const handleExportFileWithFilter = (fileName: string): any => {
    if (!detail) return;
    onExport(modelFilter as TFilter).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
      },
      error: (error: AxiosError) => {
        notifyToast({
          message: error?.response?.data?.message,
          type: "error",
        });
      },
    });
  };

  return {
    modelFilter: {
      ...modelFilter,
      pageIndex: originFilter.pageIndex,
    } as TFilter,
    detail,
    loadingDetail,
    isReset,
    isShowResult,
    dispatchFilter,
    handleFilterDetail,
    handleResetFilterDetail,
    handleExportFile,
    handleExportFileWithFilter,
    handleLoadDetail,
    handleChangeInputFilter,
    handleChangeDateFilter,
    handleChangeDateRangeFilter,
    handleChangeSelectFilter,
    handleChangeMultipleSelectFilter,
    handleChangeAllFilter,
  };
}
