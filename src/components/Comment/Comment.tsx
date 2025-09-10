// import IconLoading from "@Components/IconLoading";
import { Collapse, type CollapseProps } from "antd";
import { AttachIcon, IcArrowDown } from "assets/icons";
import AttachIconInComment from "assets/icons/attach_icon_in_comment.svg";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import classNames from "classnames";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { CollapseItem } from "components/Collapse/CollapseView";
import UploadFileCustom from "components/UploadFileCustom/UploadFileCustom";
import { numberConstants } from "core/config/consts";
import { handleError } from "core/helpers/handle-error";
import { CommentModel } from "core/models/Comment";
import appMessageService from "core/services/common-services/app-message-service";
import signalRService, {
  SignalRMethodName,
} from "core/services/common-services/signalr-service";
import { utilService } from "core/services/common-services/util-service";
import { HttpStatusCode } from "core/services/service-types";
import dayjs, { Dayjs } from "dayjs";
import saveAs from "file-saver";
import { t } from "i18next";
import { gt, isEmpty, isEqual, lt } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Model, ModelFilter, OrderType } from "react-3layer-common";
import { FormItem, Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { finalize, forkJoin, Observable } from "rxjs";
import "../Comment/Comment.scss";
import {
  Creator,
  ErrorHandlerProps,
  FileAttachments,
  Message,
} from "./Comment.model";
import { commentRepository } from "./CommentRepository";
import ContentEditable from "./ContentEditable/ContentEditable";
import DOMPurify from "dompurify";
export enum ContractTermsKey {
  CONTRACT_TERMS,
}
export interface CommentProps<TFilter extends ModelFilter> {
  /**Creator of comment*/
  userInfo: Creator;
  /**Option to prevent comment submission*/
  canSend?: boolean;
  /**Placeholder of input comment*/
  placeholder?: string;
  /**Title above of comment component*/
  title?: string;
  /**Id of this discussion*/
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultFilter: TFilter;
  /**Set true to show the title of comment component*/
  isShowHeader: boolean;
  /**Set true to for the new layout*/
  isNewLayoutVersion?: boolean;
  /**ModelFilter of param of API use for get list comment*/
  classFilter?: new () => TFilter;
  /**API get list of comment/chat*/
  getMessages?: (TModelFilter?: TFilter) => Observable<Message[]>;
  /**Render name of comment*/
  renderName?: (creator: Creator) => string;
  /**API get quantity of comment/chat*/
  countMessages?: (TModelFilter?: TFilter) => Observable<number>;
  /**API to submit new comment/chat*/
  postMessage?: (Message: Message) => Observable<Message>;
  /**API for edit a comment existed*/
  updateMessage?: (Message: Message) => Observable<Message>;
  /**Boolean attribute to control editable comment existed*/
  canEditMessage?: boolean;
  /**API use when you what to delete a comment*/
  deleteMessage?: (Message: Message) => Observable<boolean>;
  /**API show list suggest of user when you enter @ and want to tag someone to this comment*/
  suggestList?: (filter: TFilter) => Observable<Model[]>;
  /**API call when you want to save file to server and save it to this comment*/
  attachFile?: (File: File) => Observable<FileAttachments[]>;
  onGetIdTags?: (ids: string[]) => void;
}

const defaultRenderName = (user?: Creator) => user?.name;

export interface filterAction {
  action: string;
  order?: string;
  skip?: number;
  take?: number;
  data?: ModelFilter;
  discussionId?: string;
}

export interface listAction {
  action: "UPDATE" | "CONCAT" | "ADD_SINGLE" | "UPDATE_SINGLE";
  data?: Message[];
  message?: Message;
}

type InitFilterParams = {
  defaultFilter: ModelFilter;
  order: string;
  classFilter?: { new (): ModelFilter };
};

const loading = "";

function formatDateTime(time: Dayjs, dateTimeFormat = "DD-MM-YYYY HH:mm:ss") {
  if (!time) return null;
  if (typeof time === "object" && "format" in time) {
    return time.format(dateTimeFormat);
  }
  return dayjs(time).format(dateTimeFormat);
}

function initFilter(initialValue: InitFilterParams) {
  const { defaultFilter, order, classFilter } = initialValue;
  const filter = classFilter ? new classFilter() : new ModelFilter();
  return {
    ...filter,
    ...defaultFilter,
    order,
  };
}

function updateFilter(
  state: ModelFilter,
  filterAction: filterAction
): ModelFilter {
  switch (filterAction.action) {
    case "RESET":
      return {
        ...filterAction.data,
        orderType: OrderType.ASC,
      };

    case "LOAD_MORE":
      return {
        ...state,
        skip: filterAction.skip,
        take: filterAction.take,
      };

    case "ORDER":
      return {
        ...state,
        order: filterAction.order,
        skip: 0,
        take: 10,
      };
  }
}

function updateList(state: Message[], listAction: listAction) {
  switch (listAction.action) {
    case "UPDATE":
      return [...listAction.data];
    case "CONCAT":
      // eslint-disable-next-line no-case-declarations
      const listIDs = new Set(state.map(({ id }) => id));
      // eslint-disable-next-line no-case-declarations
      const combined = [
        ...state,
        ...listAction.data.filter(({ id }) => !listIDs.has(id)),
      ];
      return combined;
    case "ADD_SINGLE":
      return [listAction.message, ...state];

    case "UPDATE_SINGLE":
      // eslint-disable-next-line no-case-declarations
      const newState = state.map((item) => {
        if (listAction.message.id === item.id) {
          return {
            ...item,
            content: listAction.message.content,
          };
        }
        return item;
      });
      return [...newState];
  }
}

const MAXIMUM_SIZE = 99999999999;
function Comment(props: CommentProps<ModelFilter>) {
  const {
    isShowHeader = false,
    isNewLayoutVersion = false,
    placeholder = t("CM.txt_input_comment"),
    title = t("CM.txt_title_comment"),
    canSend = true,
    userInfo,
    defaultFilter,
    classFilter: ClassFilter,
    getMessages,
    countMessages,
    updateMessage,
    postMessage,
    suggestList,
    onGetIdTags,
    renderName = defaultRenderName,
  } = props;

  const [translate] = useTranslation();

  const [filter, dispatchFilter] = React.useReducer(
    updateFilter,
    {
      defaultFilter,
      orderType: OrderType.ASC,
      classFilter: ClassFilter,
    },
    initFilter
  );

  const containerMessageRef = useRef<HTMLDivElement>(null);

  const [messageCurrentEdit, setMessageCurrentEdit] = React.useState<Message>(
    new Message()
  );

  const [list, dispatchList] = React.useReducer(updateList, []);
  const listMessage = useRef<Message[]>([]);

  const [countMessage, setCountMessage] = React.useState<number>();

  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const [isPreview, setIsPreview] = React.useState<boolean>(false);

  const [imageSrc, setImageSrc] = React.useState<string>();

  const contentEditableRef: React.LegacyRef<HTMLDivElement> =
    React.useRef<HTMLDivElement>();
  const [isLoad, setLoad] = React.useState<boolean>(false);
  const [showAllComments, setShowAllComments] = React.useState(false);

  const handleClosePreview = React.useCallback(() => {
    setIsPreview(false);
  }, []);

  const handleOpenPreview = React.useCallback((event: MouseEvent) => {
    const imgSrc = (event.target as HTMLImageElement).currentSrc;
    setImageSrc(imgSrc);
    setIsPreview(true);
  }, []);

  const bindEventClick = React.useCallback(() => {
    const imageElements = document.getElementsByName("previewImage");
    const nodes = Array.prototype.slice.call(imageElements, 0);
    if (nodes) {
      [...nodes].forEach((current: Node) => {
        current.addEventListener("click", (event) =>
          handleOpenPreview(event as MouseEvent)
        );
      });
    }
  }, [handleOpenPreview]);

  const handleMouseLeave = React.useCallback(() => {
    if (list && list.length > 0) {
      const existPopup = list.filter((currentItem) => {
        return currentItem.isPopup;
      });
      if (existPopup.length > 0) {
        const newListMessages = list.map((currentItem) => {
          currentItem.isPopup = false;
          return currentItem;
        });
        dispatchList({
          action: "UPDATE",
          data: newListMessages,
        });
      } else return;
    }
  }, [list]);

  const getListMessages = React.useCallback(() => {
    if (typeof filter.orderType === "undefined") {
      filter.orderType = OrderType.ASC;
    }
    if (getMessages && countMessages) {
      return forkJoin([getMessages(filter), countMessages(filter)]).subscribe(
        ([list, total]: [Message[], number]) => {
          if (list && total) {
            listMessage.current = [...list].reverse();
            dispatchList({
              action: gt(filter.skip, numberConstants.ZERO)
                ? "CONCAT"
                : "UPDATE",
              data: listMessage.current,
            });
            setTimeout(() => {
              bindEventClick();
            }, 200);
            setCountMessage(total);
          }
        }
      );
    }
    return;
  }, [filter, getMessages, countMessages, bindEventClick]);

  const handleUpdateMessage = React.useCallback(() => {
    const contentConvertEnter = contentEditableRef.current.innerHTML
      .replaceAll(/\n/g, "<br>")
      .replace(/\r/g, "");

    const message: Message = {
      ...messageCurrentEdit,
      content: contentConvertEnter,
    };
    if (message.content !== null) {
      setLoad(true);
      updateMessage(message)
        .pipe(finalize(() => setLoad(false)))
        .subscribe(
          (res: Message) => {
            dispatchList({
              action: "UPDATE_SINGLE",
              message: res,
            });
            setMessageCurrentEdit({
              ...new Message(),
            });
            contentEditableRef.current.innerHTML = "";
            setTimeout(() => {
              bindEventClick();
            }, 200);
            getListMessages();
          },
          () => {
            //
          }
        );
    }
  }, [messageCurrentEdit, updateMessage, getListMessages, bindEventClick]);

  const handeGetIdTag = (): string[] => {
    const content = contentEditableRef.current;
    if (!content) {
      return [];
    }

    const elementsTagName = content.querySelectorAll(".hightlight__text");
    const idTags = Array.from(elementsTagName).map((elementTag) =>
      elementTag.getAttribute("data-id-user")
    );

    return idTags;
  };

  const [errors, setErrors] = useState<ErrorHandlerProps<Model>>();

  const handleCreateMessage = React.useCallback(() => {
    const listIdTagUser = handeGetIdTag();
    const content = contentEditableRef.current.innerText;

    // content = content.replace(
    //   /(<span[^>]*>.*?<\/span>|<a[^>]*>.*?<\/a>)| /g,
    //   (match, tag) => {
    //     return tag ? tag : "&nbsp";
    //   }
    // );

    const updatedAttachments = messageCurrentEdit.commentAttachments?.filter(
      (attachment) => {
        const fileLink = `<a href="${attachment.path}" class="file-item">`;
        return content.includes(fileLink);
      }
    );

    const contentConvertEnter = content
      .replace(/\n/g, "<br>")
      .replace(/\r/g, "");

    const message = new Message({
      content: contentConvertEnter,
      commentAttachments: updatedAttachments || [],
      tagIds: listIdTagUser,
    });

    if (message.content !== "") {
      setLoad(true);
      postMessage(message)
        .pipe(finalize(() => setLoad(false)))
        .subscribe({
          next: () => {
            contentEditableRef.current.innerHTML = "";
            if (!showAllComments) {
              setShowAllComments(true);
            }
            setTimeout(() => {
              bindEventClick();
            }, 200);
            setErrors(null);
            getListMessages();
          },
          error: (error: AxiosError) => {
            handleError({
              errors,
              error,
              handleChangeAllField: setErrors,
            });
          },
        });
    }
  }, [
    messageCurrentEdit.commentAttachments,
    postMessage,
    showAllComments,
    bindEventClick,
  ]);

  const handleSendMessage = React.useCallback(() => {
    if (messageCurrentEdit.id) {
      handleUpdateMessage();
    } else {
      handleCreateMessage();
    }
  }, [handleCreateMessage, handleUpdateMessage, messageCurrentEdit.id]);

  const handleInfiniteLoad = React.useCallback(() => {
    if (countMessage > list.length) {
      dispatchFilter({
        action: "LOAD_MORE",
        skip: filter.skip + 10,
        take: filter.take,
      });
    } else {
      setHasMore(false);
    }
  }, [countMessage, list, filter]);

  const setEndContentEditable = React.useCallback(() => {
    let range, selection;
    if (document.createRange) {
      range = document.createRange();
      range.setStart(
        contentEditableRef.current,
        contentEditableRef.current.childNodes.length
      );
      range.collapse(true);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  const handleDownloadFileAttached = (file?: FileAttachments) => {
    commentRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const shortcutName = React.useCallback((name: string) => {
    return name?.toUpperCase()?.substring(0, 2);
  }, []);

  React.useEffect(() => {
    if (defaultFilter) {
      const subcription = getListMessages();
      return () => {
        subcription.unsubscribe();
      };
    }
  }, [defaultFilter]);

  useEffect(() => {
    signalRService.registerChannel<CommentModel>(
      SignalRMethodName.ReceiveMessageComment,
      ({ datas, isDelete }) => {
        if (isDelete) {
          const newMessage = listMessage.current.filter(({ id }) =>
            lt(
              datas.findIndex((messageDelete) =>
                isEqual(messageDelete?.id, id)
              ),
              numberConstants.ZERO
            )
          );
          dispatchList({
            action: "UPDATE",
            data: newMessage,
          });

          listMessage.current = newMessage;

          return;
        }

        if (!isEqual(datas?.[numberConstants.ZERO]?.topicId, filter?.topicId))
          return;

        const messageList = isEqual(
          listMessage.current.length,
          numberConstants.ZERO
        )
          ? datas
          : datas?.filter((message) =>
              listMessage.current.find(({ id }) => id !== message.id)
            );

        listMessage.current = [...messageList, ...listMessage.current];

        dispatchList({
          action: "UPDATE",
          data: listMessage.current,
        });
      }
    );

    return () =>
      signalRService.offChanel(SignalRMethodName.ReceiveMessageComment);
  }, []);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const handleUploadAttachmentError = (error: AxiosError) => {
    notifyToast({
      message: isEqual(error.response?.status, HttpStatusCode.PAYLOAD_TOO_LARGE)
        ? translate("CM.message__max_file_size")
        : error.response?.data?.message,
      type: "error",
    });
  };

  const handleChangeCollapse = () => {
    setShowAllComments(!showAllComments);
  };

  const collapseItems: CollapseProps["items"] = [
    {
      key: showAllComments ? "1" : undefined,
      label: (
        <div className={classNames(isNewLayoutVersion ? "" : "comment__title")}>
          <span>{title}</span>
        </div>
      ),
      children: (
        <div className="comment__body" id="scrollableDiv">
          <InfiniteScroll
            dataLength={showAllComments ? list.length : 0}
            next={handleInfiniteLoad}
            style={{
              display: "flex",
              flexDirection: "column-reverse",
            }}
            inverse={true}
            hasMore={hasMore}
            loader={loading && list.length > 5}
            scrollableTarget="scrollableDiv"
          >
            {list
              .slice(0, showAllComments ? list.length : 0)
              .map((currentItem, index) => {
                const safeHtml = DOMPurify.sanitize(currentItem?.content);

                return (
                  <div
                    key={index}
                    onMouseLeave={handleMouseLeave}
                    className={classNames("comment__content d-flex")}
                  >
                    <div className="img-cont-msg">
                      {currentItem?.creator?.avatar ? (
                        <img
                          src={currentItem?.creator?.avatar}
                          className="rounded-circle user_img_msg"
                          alt="IMG"
                        />
                      ) : (
                        <div className="rounded-circle user_div">
                          {shortcutName(currentItem?.creator?.name || "N/A")}
                        </div>
                      )}
                    </div>
                    <div className={classNames("msg-container")}>
                      <div className="msg-creator-name">
                        {renderName(currentItem?.creator)}
                        <span className="msg-time">
                          {formatDateTime(currentItem?.createdDate)}
                        </span>
                      </div>

                      <div className="msg-content">
                        <div
                          className="msg-text"
                          dangerouslySetInnerHTML={{
                            __html: safeHtml,
                          }}
                          onClick={(e) => {
                            const target = e.target as HTMLAnchorElement;
                            if (target.tagName === "A" && target.href) {
                              e.preventDefault();
                              const href = target.getAttribute("href");
                              handleDownloadFileAttached({
                                path: href,
                                name: target.innerText,
                                systemFileId: "",
                                contentType: "",
                                size: 0,
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </InfiniteScroll>
        </div>
      ),
    },
  ];

  return (
    <>
      <div
        className={classNames(
          "comment__container",
          isNewLayoutVersion ? "comment_advanced_container" : ""
        )}
        ref={containerMessageRef}
      >
        {isShowHeader &&
          (isNewLayoutVersion ? (
            <AdvancedCollapseView
              items={collapseItems as CollapseItem[]}
              activeKey={showAllComments ? "1" : undefined}
              rootClassName="comment_advanced_collapse"
              isFullView
              onChange={handleChangeCollapse}
            />
          ) : (
            <Collapse
              className="comment__collapse"
              ghost
              items={collapseItems}
              activeKey={showAllComments ? "1" : undefined}
              onChange={handleChangeCollapse}
              expandIconPosition="end"
              expandIcon={({ isActive }) => (
                <div>
                  <img
                    src={IcArrowDown}
                    className={classNames(
                      "invoice-transition",
                      isActive && "invoice-transition_expand"
                    )}
                    alt="Chevron Icon"
                  />
                </div>
              )}
            />
          ))}

        {canSend && (
          <div className="comment__footer">
            <div className="img-cont-msg">
              {userInfo?.avatar ? (
                <img
                  src={userInfo?.avatar}
                  className="rounded-circle user_img_msg"
                  alt="IMG"
                />
              ) : (
                <div className="rounded-circle user_div">
                  {shortcutName(userInfo?.name)}
                </div>
              )}
            </div>

            <FormItem
              validateObject={utilService.getValidateObj(errors, "content")}
            >
              <div className="w-100">
                <ContentEditable
                  ref={contentEditableRef}
                  suggestList={suggestList}
                  sendValue={handleSendMessage}
                  loading={isLoad}
                  placeholder={placeholder}
                  onUpdateIdTag={(ids) => {
                    onGetIdTags(ids);
                  }}
                  className={classNames(
                    !isEmpty(errors) && "content-editable__container--error"
                  )}
                  setErrors={setErrors}
                  maxLength={500}
                />

                <div className="action__attach">
                  <UploadFileCustom
                    uploadFile={commentRepository.importFile}
                    updateList={(newAttachments: FileAttachments[]) => {
                      messageCurrentEdit.commentAttachments = [
                        ...newAttachments,
                        ...(messageCurrentEdit.commentAttachments || []),
                      ];
                      newAttachments.forEach((attachment) => {
                        const hrefItem = `<a href="${attachment.path}" class="file-item"><img src="${AttachIconInComment}" alt="icon" style="width: 16px; height: 8px; margin: 0 2px 2px 0;" />${attachment.name}</a>`;
                        contentEditableRef.current.innerHTML += hrefItem;
                      });
                      setEndContentEditable();
                    }}
                    maximumSize={MAXIMUM_SIZE}
                    onUploadError={handleUploadAttachmentError}
                    isMultiple={true}
                    icon={<AttachIcon />}
                    titleButton=""
                  />
                </div>
              </div>
            </FormItem>
          </div>
        )}
      </div>
      <Modal
        visible={isPreview}
        width={800}
        visibleFooter={false}
        closable={true}
        handleCancel={handleClosePreview}
      >
        <div className="preview-image__container">
          <img alt="img" src={imageSrc}></img>
        </div>
      </Modal>
    </>
  );
}

export default Comment;
