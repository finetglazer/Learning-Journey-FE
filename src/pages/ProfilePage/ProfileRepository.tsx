import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { isNil, isNumber, isUndefined } from "lodash";
import { OpinionCollector } from "models/OpinionCollector";
import { OpinionFeedback } from "models/OpinionCollectorList/OpinionCollectorList";
import { OpinionCollectorListFilter } from "models/OpinionCollectorList/OpinionCollectorListFilter";
import { join } from "path";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";

const BASE_PROFILE_ENDPOINT = "/share/opinion";
const OPINION_ENDPOINT = join(BASE_PROFILE_ENDPOINT, "/list");
const OPINION_RESPONSE_ENDPOINT = "/share/opinionResponse";
const OPINION_GET_TOPIC_BY_TYPE_ENDPOINT = join(
  OPINION_RESPONSE_ENDPOINT,
  "/getTopicByType"
);

export class ProfileRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getOpinionList = (
    filter: OpinionCollectorListFilter
  ): Observable<ListResult<OpinionFeedback>> => {
    const type =
      isNumber(filter?.opinionTypeValue?.id) ||
      isUndefined(filter?.opinionTypeValue?.id)
        ? filter?.opinionTypeValue?.id
        : Number(filter?.opinionTypeValue?.id);
    const body = {
      search: filter?.search?.trim(),
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      code: filter?.code?.trim(),
      status: isNil(filter?.statusId?.status)
        ? undefined
        : Number(filter?.statusId?.status),
      creator: filter?.creatorId,
      type,
      responseDueDateFrom: filter?.responseDueDate?.greaterEqual,
      responseDueDateTo: filter?.responseDueDate?.lessEqual,
    };

    return this.http.post(OPINION_ENDPOINT, body);
  };

  public getOpinionResponseTopicByType = (
    filter: Pick<OpinionCollector, "topicId" | "topicType">
  ): Observable<ListResult<OpinionFeedback>> => {
    const params = {
      topicId: filter?.topicId,
      topicType: filter?.topicType,
    };

    return this.http.get(OPINION_GET_TOPIC_BY_TYPE_ENDPOINT, { params });
  };
}

export const profileRepository = new ProfileRepository();
