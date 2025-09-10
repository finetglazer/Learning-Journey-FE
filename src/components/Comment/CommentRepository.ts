/* eslint-disable import/no-unresolved */

import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import { FileAttachments, Message, UserModel } from "./Comment.model";

export const API_GET_COMMENT = "share/comment";
export const API_MASTER_USER = "auth/user";
export const API_UPLOAD_ATTACHED_FILE = "share/file/uploadMultifile";
export const API_DOWNLOAD_FILE = "share/file/download";

export class CommentRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public listComment = (TModelFilter?: ModelFilter): Observable<Message[]> => {
    return this.http
      .get<{ items: Message[] }>(API_GET_COMMENT, {
        params: {
          topicId: TModelFilter?.topicId,
          topicType: TModelFilter?.topicType,
          pageSize: 1000,
        },
      })
      .pipe(
        map((response) => {
          const messages = response.data.items.map(
            (item: Message) => new Message(item)
          );
          messages.sort((a, b) => {
            if (a.createdDate && b.createdDate) {
              return a.createdDate.valueOf() - b.createdDate.valueOf();
            }
            return 0;
          });
          return messages;
        })
      );
  };

  public listMasterUser = (filter: ModelFilter): Observable<UserModel[]> => {
    return this.http
      .get(API_MASTER_USER, {
        params: {
          search: filter?.name?.contain?.trim(),
          isActive: true,
        },
      })
      .pipe(Repository.responseDataMapper<UserModel[]>());
  };

  public createComment = (message: Message): Observable<Message> => {
    return this.http
      .post<Message>(API_GET_COMMENT, message)
      .pipe(Repository.responseDataMapper<Message>());
  };

  public importFile = (
    file: File[] | Blob[]
  ): Observable<FileAttachments[]> => {
    const formData: FormData = new FormData();
    file.forEach((f) => formData.append("Files", f));
    return this.http
      .post<FileAttachments[]>(API_UPLOAD_ATTACHED_FILE, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe(map((response) => response?.data));
  };

  public downloadFile = (
    Path: string
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer" as "json",
      params: {
        Path,
      },
    });
  };
}

export const commentRepository = new CommentRepository();
