import { DEFAULT_PAGE_SIZE_OPTION, numberConstants } from "core/config/consts";
import { historyLogRepository } from "core/repositories/HistoryLogRepository";
import { HistoryModel, HistoryRequestModel } from "models/History";
import { useEffect } from "react";
import { listService } from "./list-service";

const BASE_PAGE = {
  pageIndex: numberConstants.ONE,
  pageSize: DEFAULT_PAGE_SIZE_OPTION[numberConstants.FOUR],
};

export const historyLogService = {
  /**
   * react hook for control budget status overview modal
   * @param: topicId: string
   * @param: type: TopicType
   * @param: historyType: HistoryType
   * @return: { list, count, loadingList }
   * */
  useHistoryLog({
    topicId,
    originalId,
    type,
    historyType,
  }: Pick<
    HistoryRequestModel,
    "topicId" | "originalId" | "type" | "historyType"
  >) {
    const { list, count, loadingList, handleLoadList } = listService.useList<
      HistoryModel,
      HistoryRequestModel
    >(
      () =>
        historyLogRepository.getHistory({
          ...BASE_PAGE,
          topicId,
          originalId,
          type,
          historyType,
        }),
      {},
      undefined,
      () => ({})
    );

    useEffect(() => {
      handleLoadList();
    }, [topicId, type]);

    return {
      list,
      count,
      loadingList,
    };
  },
};
