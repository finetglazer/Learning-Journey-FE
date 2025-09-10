import { AxiosError } from "axios";
import { APP_OVERVIEW } from "config/route-const";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction } from "core/services/service-types";
import { Comment, CommentFilter } from "models/SystemAdministration";
import { createContext, Dispatch, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import commentManagementRepository from "./CommentManagementRepository";
import { finalize } from "rxjs";

export interface CommentManagementContextProps {
  modelFilter: CommentFilter;
  list: Comment[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<CommentFilter>>;
  handleLoadList: (filterParam?: CommentFilter) => void;
  handleResetList: () => void;
  handleDeleteComment?: (comment?: Comment) => void;
}

export const CommentManagementContext =
  createContext<CommentManagementContextProps>({
    modelFilter: new CommentFilter(),
    list: [],
    count: numberConstants.ZERO,
    countFilter: numberConstants.ZERO,
    loadingList: false,
    dispatchFilter: null,
    handleLoadList: null,
    handleResetList: null,
  });

export const useCommentManagementHook = () => {
  const [translate] = useTranslation();
  const [deleteComment, setDeleteComment] = useState<Comment | undefined>(
    undefined
  );
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

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
        name: translate("CM.menu_title_comment_management"),
      },
    ],
    [translate]
  );

  // Setup filter
  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      CommentFilter,
      {
        ...new CommentFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: CommentFilter = useMemo(() => {
    return {
      ...new CommentFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
      isReset: modelFilter?.isReset,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<Comment, CommentFilter>(
      commentManagementRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  // Handle delete comment when click on delete icon
  const handleDeleteComment = (comment?: Comment) => {
    setDeleteComment(comment);
  };

  // Process delete comment action from modal
  const processDeleteComment = () => {
    setLoadingModal(true);
    commentManagementRepository.delete(deleteComment).subscribe({
      next: () => {
        setDeleteComment(undefined);
        notifyToast();
      },
      error: (error: AxiosError) => {
        const message = error?.response?.data?.message;
        setLoadingModal(false);
        notifyToast({
          message: message,
          type: "error",
        });
        setDeleteComment(undefined);
        handleLoadList();
      },
      complete: () => {
        setLoadingModal(false);
        setDeleteComment(undefined);
        handleLoadList();
      },
    });
  };

  useEffect(() => {
    if (handleLoadList) {
      handleLoadList();
    }
  }, [handleLoadList]);

  return {
    list,
    count,
    countFilter,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    loadingList,
    handleDeleteComment,

    // non-context
    translate,
    breadcrumbs,
    deleteComment,
    processDeleteComment,
    loadingModal,
  };
};
