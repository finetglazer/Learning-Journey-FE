import classNames from "classnames";
import React, {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { StringFilter } from "react-3layer-advance-filters";
import { Model, ModelFilter } from "react-3layer-common";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "rtk/useRedux";
import type { Observable } from "rxjs";
import { ErrorHandlerProps, UserModel } from "../Comment.model";
import "./ContentEditable.scss";
import { Tooltip } from "antd";
import { intersection } from "lodash";

export interface contentAction {
  action: string;
  data: string;
}

function updateContent(state: string, contentAction: contentAction) {
  switch (contentAction.action) {
    case "UPDATE":
      return contentAction.data;
    default:
      return state;
  }
}

export interface ContentEditableProps<TFilter extends ModelFilter> {
  suggestList?: (filter: TFilter) => Observable<Model[]>;
  sendValue?: () => void;
  loading?: boolean;
  placeholder?: string;
  idTagCurrent?: string[];
  onUpdateIdTag?: (id: string[]) => void;
  className?: string;
  setErrors: React.Dispatch<React.SetStateAction<ErrorHandlerProps<Model>>>;
  maxLength?: number;
}

const ContentEditable = forwardRef<
  HTMLDivElement,
  ContentEditableProps<ModelFilter>
>(
  (
    props: ContentEditableProps<ModelFilter>,
    contentEditableRef: ForwardedRef<HTMLDivElement>
  ) => {
    const {
      suggestList,
      sendValue,
      loading,
      className,
      onUpdateIdTag,
      setErrors,
    } = props;
    const [savedSelection, setSavedSelection] = useState(window.getSelection());
    const [userList, setUserList] = React.useState<UserModel[]>([]);
    const [showSuggestList, setShowSuggestList] =
      React.useState<boolean>(false);
    const [contentEditable, dispatchContentEditable] = React.useReducer(
      updateContent,
      ""
    );
    const [isTriggeringSuggestion, setIsTriggeringSuggestion] =
      React.useState(false);
    const profile = useAppSelector((state) => state.profile);
    const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);
    const [translate] = useTranslation();
    const [selectedUserIndex, setSelectedUserIndex] = React.useState<number>(0);
    const [positionModalUserLeft, setPositionModalUserLeft] =
      React.useState<number>(0);
    const suggestListRef = React.useRef<HTMLDivElement | null>(null);
    const selectedUserIndexRef = React.useRef<number>(selectedUserIndex);
    const userListRef = React.useRef<UserModel[]>(userList);
    const contentDiv = contentEditableRef as MutableRefObject<HTMLDivElement>;
    const isSelectingUserRef = React.useRef(false);

    const setEndContentEditable = React.useCallback(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = document.createRange();
      const content = contentDiv.current;
      range.selectNodeContents(content);
      range.collapse(false); // Đặt con trỏ cuối nội dung
      selection.removeAllRanges();
      selection.addRange(range);
    }, []);

    const functionSaveSelection = () => {
      const currentSelection = window.getSelection();
      setSavedSelection(currentSelection);
    };

    const getCursorIndexIncludingHTML = useCallback(
      (editableDiv: HTMLElement, selection: Selection) => {
        if (!selection || !selection.rangeCount) return -1;

        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();

        // Thiết lập phạm vi từ đầu `editableDiv` đến vị trí con trỏ
        preCaretRange.selectNodeContents(editableDiv);
        preCaretRange.setEnd(range.startContainer, range.startOffset);

        // Lấy nội dung trước con trỏ (bao gồm cả HTML)
        const tempDiv = document.createElement("div");
        tempDiv.appendChild(preCaretRange.cloneContents());

        // Tính chiều dài toàn bộ HTML + text trước con trỏ
        return tempDiv.innerHTML.length;
      },
      []
    );

    const handleBackspace = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
      const parentEl = startNode.parentElement;

      const atIndex = getCursorIndexIncludingHTML(parentEl, selection);
      if (atIndex === -1) return;

      const beforeAt = parentEl.innerHTML.substring(0, atIndex);
      const parser = new DOMParser();
      const newDom = parser.parseFromString(beforeAt, "text/html");

      const highlights = newDom.querySelectorAll(".hightlight__text");
      const lastHighlight = highlights[highlights.length - 1];
      if (!lastHighlight) return;

      const allHighlightInStartNode =
        parentEl.querySelectorAll(".hightlight__text");
      if (allHighlightInStartNode.length === 0) return;
      allHighlightInStartNode.forEach((el) => {
        if (
          el.getAttribute("data-id-user") !==
            lastHighlight.getAttribute("data-id-user") ||
          lastHighlight.previousSibling?.nodeName !== "BR"
        )
          return;

        const indexOfElInBeforeAt = beforeAt.indexOf(el.outerHTML);
        const dataRedundant = beforeAt.substring(
          indexOfElInBeforeAt + el.outerHTML.length
        );

        if (
          dataRedundant.indexOf("<br></") === 0 ||
          dataRedundant.indexOf("</div>") === 0
        ) {
          el.remove();
        }
      });

      if (parentEl?.classList.contains("hightlight__text")) {
        const removedUserId = parentEl.dataset.idUser;
        parentEl.remove();

        setSelectedUserIds((prevIds) =>
          prevIds.filter((id) => id !== removedUserId)
        );

        // Tìm user bị xóa và thêm lại vào userList
        const removedUser = userList.find((user) => user.id === removedUserId);

        if (removedUser) {
          setUserList((prevList) => [...prevList, removedUser]);
        }

        setEndContentEditable();
      }
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.ctrlKey || event.metaKey) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        const parentDiv = contentDiv.current;

        const isEndOfContent =
          getCursorIndexIncludingHTML(parentDiv, selection) ===
          parentDiv.innerHTML.length;

        if (!parentDiv.innerText.trim() || isEndOfContent) {
          document.execCommand("insertHTML", false, "<br><br>");
          return;
        }

        const br = document.createElement("br");
        range.insertNode(br);

        const newRange = document.createRange();
        newRange.setStartAfter(br);
        newRange.collapse(true);

        const newSelection = window.getSelection();
        newSelection?.removeAllRanges();
        newSelection?.addRange(newRange);

        return;
      }

      if (!showSuggestList && !isTriggeringSuggestion) {
        if (loading) return;

        // Kiểm tra nếu vừa chọn user thì không gửi ngay
        if (isSelectingUserRef.current) {
          isSelectingUserRef.current = false;
          return;
        }

        sendValue?.();
        setSelectedUserIds([]);
      }
    };

    const handleShowSuggestList = (
      event: React.KeyboardEvent<HTMLDivElement>
    ) => {
      if (showSuggestList && userList.length > 0) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          setSelectedUserIndex((prevIndex) => {
            const newIndex =
              event.key === "ArrowDown"
                ? (prevIndex + 1) % userList.length
                : prevIndex === 0
                ? userList.length - 1
                : prevIndex - 1;
            scrollToSelectedUser(newIndex);
            return newIndex;
          });
          return;
        }
      }
    };

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        handleShowSuggestList(event);
        if (showSuggestList && userList.length <= 0 && event.key === "Enter") {
          sendValue?.();
          setShowSuggestList(false);
          setSelectedUserIds([]);
          setErrors(undefined);
        }

        if (event.key === "Backspace") {
          handleBackspace();
          return;
        }

        if (event.key === "@") {
          event.preventDefault();
          const selection = window.getSelection();
          const range = selection?.getRangeAt(0);

          if (range) {
            const atNode = document.createTextNode("@");
            const positionLeft =
              range.getBoundingClientRect().left - 220 >= 0
                ? range.getBoundingClientRect().left - 220
                : 0;
            setPositionModalUserLeft(positionLeft);
            range.insertNode(atNode);
            range.setStartAfter(atNode);
            range.setEndAfter(atNode);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }

          setShowSuggestList(true);
          setIsTriggeringSuggestion(true);
          dispatchContentEditable({ action: "UPDATE", data: "" });

          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          handleEnter(event);
        }
      },

      [
        showSuggestList,
        userList,
        sendValue,

        setEndContentEditable,
        isTriggeringSuggestion,
        contentDiv,
        getCursorIndexIncludingHTML,
        loading,
      ]
    );

    const handleChangeSearchTag = useCallback(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
      const currentContent = startNode.textContent;
      const afterAtText = currentContent.substring(0, range.startOffset);
      const atIndex = afterAtText.lastIndexOf("@");
      const indexCurrentContext = currentContent.lastIndexOf("@");
      const contextAfterAt = currentContent.substring(indexCurrentContext + 1);
      const textWithoutAt = afterAtText.substring(1);

      if (
        !contentDiv.current.innerHTML ||
        contentDiv.current.innerHTML === "<br>"
      ) {
        contentDiv.current.innerHTML = ""; // Xóa hoàn toàn nếu chỉ còn <br>
      }

      if (
        (atIndex < 0 &&
          indexCurrentContext < 0 &&
          textWithoutAt !== contextAfterAt) ||
        contentDiv.current.innerHTML.length === 0
      ) {
        setIsTriggeringSuggestion(false);
        setShowSuggestList(false);
        dispatchContentEditable({
          action: "UPDATE",
          data: "",
        });
        // Đảm bảo danh sách gợi ý hiển thị khi có @
        return;
      }

      if (
        atIndex >= 0 &&
        textWithoutAt === contextAfterAt &&
        textWithoutAt.length >= 0
      ) {
        setIsTriggeringSuggestion(true);
        setShowSuggestList(true);
        dispatchContentEditable({
          action: "UPDATE",
          data: textWithoutAt,
        });
        return;
      }
    }, [contentDiv]);

    // --- Helper Functions ---
    function isEnterWithModifier(event: React.KeyboardEvent) {
      return event.key === "Enter" && (event.ctrlKey || event.metaKey);
    }

    function isArrowKey(event: React.KeyboardEvent) {
      return event.key === "ArrowLeft" || event.key === "ArrowRight";
    }

    function isBackspaceOrDelete(event: React.KeyboardEvent) {
      return event.key === "Backspace" || event.key === "Delete";
    }

    function handleEnterWithModifier() {
      if (!showSuggestList) return;

      const lastElementChild = contentDiv.current.lastElementChild;
      if (lastElementChild) {
        const contentText = lastElementChild.textContent;
        contentDiv.current.removeChild(lastElementChild);
        contentDiv.current.innerHTML += contentText || "";
      }

      setShowSuggestList(false);
    }

    function handleBackspaceOrDelete() {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
      const parentEl = startNode.parentElement;
      const listUserDifferent: string[] = [];
      const allHighlightText = parentEl.querySelectorAll(".hightlight__text");
      allHighlightText.forEach((el) => {
        if (el.getAttribute("data-id-user")) {
          listUserDifferent.push(el.getAttribute("data-id-user"));
        }
      });

      let dataSame = listUserDifferent;
      if (listUserDifferent.length > 0) {
        dataSame = intersection(selectedUserIds, listUserDifferent);
      }

      setSelectedUserIds(dataSame);
      handleChangeSearchTag();
    }

    const handleKeyUp = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (isEnterWithModifier(event)) {
          handleEnterWithModifier();
          return;
        }

        if (event.ctrlKey || event.metaKey) return;

        if (isArrowKey(event)) {
          handleChangeSearchTag();
          return;
        }

        if (isBackspaceOrDelete(event)) {
          handleBackspaceOrDelete();
          return;
        }

        handleChangeSearchTag();
      },
      [handleChangeSearchTag, showSuggestList, contentDiv, selectedUserIds]
    );

    const handlePaste = React.useCallback(
      (event: React.ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        const clipboardData = event.clipboardData;
        if (!clipboardData) return;

        const pastedText = clipboardData.getData("text/plain"); // Lấy dữ liệu dạng text
        // Lấy vị trí con trỏ hiện tại
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        range.deleteContents(); // Xóa nội dung đã chọn (nếu có)

        // Chèn nội dung vào vị trí con trỏ
        const textNode = document.createTextNode(pastedText);
        range.insertNode(textNode);

        // Đưa con trỏ ra sau phần nội dung vừa dán
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      },
      []
    );

    const handleInput = React.useCallback(() => {
      const currentContent = contentDiv.current.innerText;
      if (!currentContent.trim()) {
        setSelectedUserIds([]);
        setUserList([]);
        setShowSuggestList(false);
        setIsTriggeringSuggestion(false);
        setErrors(undefined);
        return;
      }

      if (props.maxLength && currentContent.length > props.maxLength) {
        setErrors({
          errors: {
            content: translate("CM.input_length_validation", {
              maxLength: props?.maxLength,
            }),
          },
        });
        return;
      }

      setErrors(undefined);
    }, [contentDiv, props.maxLength, setErrors, translate]);

    const selectUser = React.useCallback(
      (currentUser: UserModel, isOnClick: boolean) => {
        isSelectingUserRef.current = true;
        setShowSuggestList(false);
        setIsTriggeringSuggestion(false);

        setSelectedUserIds((prevIds) => [...prevIds, currentUser.id]);

        if (onUpdateIdTag) {
          onUpdateIdTag([...selectedUserIds, currentUser.id]);
        }

        setUserList((prevUserList) =>
          prevUserList.filter((user) => user.id !== currentUser.id)
        );

        const userTag = `<span class="hightlight__text" data-id-user="${currentUser.id}" contentEditable="false">${currentUser.name}</span>`;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const parentDiv = contentDiv.current;
        // contextAfterAt: Nội dung phía sau chữ @

        if (!parentDiv) return;
        // Tìm @ gần nhất trong nội dung
        const contentText = parentDiv.innerHTML;

        const atIndex = getCursorIndexIncludingHTML(
          document.getElementById("content-message"),
          !isOnClick ? selection : savedSelection
        );

        if (atIndex !== -1) {
          const beforeAt = contentText.substring(0, atIndex);
          const afterAt = contentText.substring(atIndex);

          // Last index @
          const lastIndexAtOnBefore = beforeAt.lastIndexOf("@");
          const beforeAtData = beforeAt.substring(0, lastIndexAtOnBefore);
          // Chỉ thay thế phần văn bản, giữ lại các thẻ HTML
          const newContent = beforeAtData + userTag + afterAt;
          parentDiv.innerHTML = newContent;
        }

        dispatchContentEditable({ action: "UPDATE", data: "" });
        setEndContentEditable();
        setErrors(undefined);
      },
      [
        onUpdateIdTag,
        contentDiv,
        getCursorIndexIncludingHTML,
        savedSelection,
        setEndContentEditable,
        setErrors,
        selectedUserIds,
      ]
    );

    const shortcutName = React.useCallback((name: string) => {
      return name?.toUpperCase()?.substring(0, 2);
    }, []);

    const scrollToSelectedUser = (index: number) => {
      const suggestListEl = suggestListRef.current;
      if (!suggestListEl) return;

      const selectedUserEl =
        suggestListEl.querySelectorAll(".list-group-item")[index];
      if (selectedUserEl) {
        selectedUserEl.scrollIntoView({
          block: "nearest", // Giữ phần tử được chọn trong phạm vi có thể nhìn thấy
          behavior: "smooth", // Cuộn mượt mà
        });
      }
    };

    useEffect(() => {
      selectedUserIndexRef.current = selectedUserIndex;
      userListRef.current = userList;
    }, [selectedUserIndex, userList]);

    const handleKeyDownDirectly = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (showSuggestList && userListRef.current.length > 0) {
          const selectedUser =
            userListRef.current[selectedUserIndexRef.current];

          if (selectedUser) {
            selectUser(selectedUser, false);
          } else {
            console.warn("No user selected!");
          }
        }
      }

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        functionSaveSelection();
      }
    };

    useEffect(() => {
      const contentEl = (contentEditableRef as MutableRefObject<HTMLDivElement>)
        .current;
      if (contentEl) {
        contentEl.addEventListener("keydown", handleKeyDownDirectly);
      }

      return () => {
        if (contentEl) {
          contentEl.removeEventListener("keydown", handleKeyDownDirectly);
        }
      };
    }, [showSuggestList]);

    useEffect(() => {
      if (showSuggestList) {
        setSelectedUserIndex(userList.length > 0 ? 0 : -1);
      }
    }, [userList, showSuggestList]);

    useEffect(() => {
      if (typeof suggestList === "function" && isTriggeringSuggestion) {
        const filter = new ModelFilter();
        filter.name = new StringFilter({ contain: contentEditable });

        const subscription = suggestList(filter).subscribe((res: Model[]) => {
          if (res) {
            const filteredUserList = res.filter((user) => {
              const userName = user.name?.trim().toLowerCase();
              const profileName = profile.account.name?.trim().toLowerCase();
              const userId = user.id;

              return (
                userName !== profileName && !selectedUserIds.includes(userId)
              );
            });

            setUserList(filteredUserList as UserModel[]);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    }, [
      contentEditable,
      isTriggeringSuggestion,
      profile.account.name,
      selectedUserIds,
      suggestList,
    ]);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof HTMLElement &&
        (event.target.classList.contains("text-ellipsis") ||
          event.target.classList.contains("list-group-item"))
      ) {
        event.preventDefault();
        return;
      }

      const content = contentDiv.current;
      if (
        (contentEditableRef as MutableRefObject<HTMLDivElement>).current &&
        !(
          contentEditableRef as MutableRefObject<HTMLDivElement>
        ).current.contains(event.target as Node) &&
        !suggestListRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestList(false);
        if (!content.innerText.trim()) {
          content.innerHTML = "";
        }
      }

      if (functionSaveSelection) {
        functionSaveSelection();
      }
    };

    React.useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleClickOutsideMouseUp = (event: any) => {
        if (
          event.target instanceof HTMLElement &&
          (event.target.classList.contains("text-ellipsis") ||
            event.target.classList.contains("list-group-item"))
        ) {
          event.preventDefault();
          return;
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("mouseUp", handleClickOutsideMouseUp);
      document.addEventListener("click", handleClickOutsideMouseUp);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("mouseUp", handleClickOutsideMouseUp);
        document.removeEventListener("click", handleClickOutsideMouseUp);
      };
    }, [contentDiv, contentEditableRef]);

    return (
      <div
        className={classNames("content-editable__container", className)}
        id="container-message"
      >
        <div
          id="content-message"
          className="content-editable__comment"
          ref={contentEditableRef}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPaste={handlePaste}
          contentEditable={true}
          data-text={props.placeholder}
        />
        {showSuggestList && userList.length > 0 && (
          <div
            className="content-editable__suggest-list"
            ref={suggestListRef}
            style={{ left: `${positionModalUserLeft}px` }}
          >
            <div className="list-group">
              {userList.map((currentUser, index) => {
                const isSelected = index === selectedUserIndex;
                return (
                  <Tooltip key={currentUser.id} title={currentUser?.name}>
                    <div
                      key={currentUser.id}
                      className={`list-group-item ${
                        isSelected ? "selected-user" : ""
                      }`}
                      onClick={() => {
                        selectUser(currentUser, true);
                        isSelectingUserRef.current = false;
                      }}
                    >
                      <div className="user-avatar-name">
                        {shortcutName(currentUser?.name)}
                      </div>
                      <OneLineText
                        value={currentUser?.name}
                        useTooltip={false}
                      />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ContentEditable.displayName = "ContentEditable";
export default ContentEditable;
