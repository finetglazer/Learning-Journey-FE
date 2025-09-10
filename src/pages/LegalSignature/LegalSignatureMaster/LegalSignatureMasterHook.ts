/* eslint-disable @typescript-eslint/no-unused-vars */
import { listService } from "core/services/page-services/list-service";
import { useTranslation } from "react-i18next";
import { numberConstants } from "core/config/consts";
import { queryStringService } from "core/services/page-services/query-string-service";
import {
  isArrayBuffer,
  isEmpty,
  isEqual,
  isString,
  isTypedArray,
  lte,
} from "lodash";
import { useEffect, useMemo, useState } from "react";
import { TagFilterEnum, TagFilterList } from "../constants";
import {
  masterService,
  RepoState,
} from "core/services/page-services/master-service";
import appMessageService from "core/services/common-services/app-message-service";
import LegalSignatureTab from "./LegalSignatureTab/LegalSignatureTab";
import { detailService } from "core/services/page-services/detail-service";
import {
  Legal,
  LegalSignatureFilter,
  LegalSignatureModel,
} from "models/LegalSignature";
import { fieldService } from "core/services/page-services/field-service";
import { legalSignatureRepository } from "../LegalSignatureRepository";
import { ModelFilter } from "react-3layer-common";

export function useLegalSignatureMasterHook() {
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();
  const [loading, setLoading] = useState(false);
  const { model, dispatch: dispatchModel } =
    detailService.useModel<LegalSignatureModel>(LegalSignatureModel);
  const { handleChangeAllField } = fieldService.useField(model, dispatchModel);
  const tabRepositories = useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: "0",
        tabTitle: translate("contractAdjustment.tab_title"),
        children: LegalSignatureTab,
        list: (filter?: ModelFilter) =>
          legalSignatureRepository.getAll(filter as LegalSignatureFilter),
      },
    ];
  }, [translate]);
  const tabFilterRepository = useMemo<TagFilterList[]>(() => {
    return [
      {
        title: translate("CM.tab_all"),
        value: TagFilterEnum.ALL?.toString(),
      },
      {
        title: translate("legalSignature.waiting_for_signature"),
        value: TagFilterEnum.WAIT_SIGNE?.toString(),
      },
      {
        title: translate("legalSignature.signed"),
        value: TagFilterEnum.SIGNED?.toString(),
      },
    ];
  }, [translate]);

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      LegalSignatureFilter,
      {
        ...new LegalSignatureFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: numberConstants.TEN,
      },
      ["orderBy", "orderType", "tab", "tabKey", "search"]
    );

  const { repo, handleChangeTab } = masterService.useTabRepository(
    tabRepositories,
    dispatchFilter
  );

  const baseFilter = useMemo(() => {
    return {
      ...new LegalSignatureFilter(),
      tab: modelFilter?.tab,
      signatureStatuses: modelFilter?.signatureStatuses,
      pageIndex: numberConstants.ONE,
      pageSize: modelFilter?.pageSize,
      search: modelFilter?.search,
      tabKey: repo.tabKey,
    };
  }, [modelFilter, repo.tabKey]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<Legal, LegalSignatureFilter>(
      repo.list,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  const calculatedFilterCount = useMemo(() => {
    let count = countFilter;
    if (
      modelFilter?.totalAmountFrom?.equal &&
      modelFilter?.totalAmountTo?.equal
    ) {
      count -= numberConstants.ONE;
    }
    if (modelFilter?.contractFrom?.equal && modelFilter?.contractTo?.equal) {
      count -= numberConstants.ONE;
    }

    return count;
  }, [countFilter, modelFilter]);

  const getEmptyData = () =>
    isEqual(
      modelFilter?.tab,
      tabFilterRepository[numberConstants.ZERO].value
    ) &&
    isEmpty(modelFilter?.search) &&
    isEmpty(list) &&
    lte(calculatedFilterCount, numberConstants.ZERO);

  const [loadingPreview, setLoadingPreview] = useState(false);

  const handlePreview = async (record: Legal) => {
    //fake
    setLoadingPreview(true);
    try {
      legalSignatureRepository.getFile(record.fileId).subscribe({
        next: (response) => {
          const blobUrl = handlePdfResponse(response);
          handleChangeAllField({
            ...model,
            fileUrl: blobUrl,
            code: record.code,
            status: record.status,
          });
          setLoadingPreview(false);
        },
        error: (errors: any) => {
          setLoadingPreview(false);
          handleErrors(errors);
          handleChangeAllField({
            ...model,
            fileUrl: null,
            code: null,
            status: null,
          });
        },
        complete: () => {
          setLoadingPreview(false);
        },
      });
    } catch (error) {
      setLoadingPreview(false);
      notifyToast({
        type: "error",
        message: translate("CM.message_system_error"),
      });
    }
  };

  const handleErrors = (error: any) => {
    if (isEmpty(error)) {
      notifyToast({
        type: "error",
        message: translate("CM.message_system_error"),
      });
    } else {
      notifyToast({
        type: "error",
        message: error?.message,
      });
    }
  };

  function handlePdfResponse(response: any) {
    // Check nhị phân
    if (isArrayBuffer(response.data) || isTypedArray(response.data)) {
      // Convert ArrayBuffer -> Blob
      const file = new Blob([response.data], { type: "application/pdf" });
      return URL.createObjectURL(file);
    }
    // Check base64 dạng string
    if (isString(response?.data)) {
      const base64String = response?.data?.replace(
        "data:application/pdf;base64,",
        ""
      );
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } else {
      console.error("error");
    }
  }

  const handleSignature = async (record: Legal[]) => {
    console.log("record", record);
  };

  return {
    repo,
    list,
    count,
    translate,
    modelFilter,
    loadingList,
    tabRepositories,
    tabFilterRepository,
    calculatedFilterCount,
    countFilter,
    getEmptyData,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleChangeTab,
    loadingPreview,
    handlePreview,
    model,
    handleChangeAllField,
    setLoading,
    loading,
    handleSignature,
  };
}
