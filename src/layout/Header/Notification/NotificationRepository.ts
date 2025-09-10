/* eslint-disable import/no-unresolved */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { NotificationFilter } from "core/models/Notification/NotificationFilter";
import { ListResult } from "core/services/service-types";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";

export const API_NOTIFICATION_PREFIX = "/share/notification";

export class NotificationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_NOTIFICATION_PREFIX}`;
  }

  public getAll = (
    filter: NotificationFilter
  ): Observable<ListResult<Notification>> => {
    return this.http.post("getAll", filter);
  };

  public read = ({
    ids,
    isReadAll,
  }: {
    ids?: string[];
    isReadAll?: boolean;
  }): Observable<ListResult<boolean>> => {
    return this.http.post("read", {
      ids,
      isReadAll,
    });
  };
}

export const notificationRepository = new NotificationRepository();
