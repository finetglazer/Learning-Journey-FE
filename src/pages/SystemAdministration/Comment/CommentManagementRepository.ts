import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { isEmpty, isEqual, isUndefined } from "lodash";
import { Comment, CommentFilter, UserModel } from "models/SystemAdministration";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const SYSTEM_ADMINISTRATION_API = "/share/comment";
const AUTH_USER = "auth/user";

class CommentManagementRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${SYSTEM_ADMINISTRATION_API}`;
  }

  public getAll = (filter: CommentFilter): Observable<ListResult<Comment>> => {
    const greaterEqualDate = filter?.startDate?.greaterEqual
      ? dayjs(filter.startDate.greaterEqual).toDate().toISOString()
      : undefined;

    const lessEqualDate = filter?.startDate?.lessEqual
      ? dayjs(filter.startDate.lessEqual).toDate().toISOString()
      : undefined;

    const isReset = isEqual(filter?.isReset, true)
      ? filter.isReset
      : isEmpty(filter?.code);

    const creatorIds: string[] = filter?.creatorIdsValue?.map(
      (item: UserModel) => item?.id
    );

    const params = {
      code: filter?.code?.trim() || "",
      content: filter?.content?.trim() || "",
      creatorIds,
      tagIds: filter?.tagIdsValue?.map((item: UserModel) => item?.id),
      startDate: greaterEqualDate,
      endDate: lessEqualDate,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      isReset,
    };

    return this.http.get(nameof(this.getAll), {
      params,
      paramsSerializer: (params) => {
        const queryString = new URLSearchParams();
        for (const key in params) {
          if (Array.isArray(params[key])) {
            params[key].forEach((value) => queryString.append(key, value));
          } else if (!isUndefined(params[key])) {
            queryString.append(key, params[key]);
          }
        }
        return queryString.toString();
      },
    });
  };

  // get all users have status online
  public getUsers = (filter: ModelFilter): Observable<UserModel[]> => {
    const params = { search: filter?.name?.contain?.trim(), isActive: true };

    return this.http
      .get("", {
        params,
        baseURL: new URL(AUTH_USER, ConfigStore.getInstance().get("baseApiUrl"))
          .href,
      })
      .pipe(Repository.responseMapToList<UserModel>(UserModel));
  };

  // delete comment
  public delete = (comment: Comment): Observable<string> => {
    const ids = [comment.id];
    return this.http
      .delete<string>("", { data: { ids } })
      .pipe(Repository.responseDataMapper<string>());
  };
}

const commentManagementRepository = new CommentManagementRepository();

export default commentManagementRepository;
