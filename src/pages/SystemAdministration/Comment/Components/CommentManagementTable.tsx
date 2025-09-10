import { ColumnProps } from "antd/lib/table";
import { TrashIcon } from "assets/icons";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { tableService } from "core/services/page-services/table-service";
import dayjs from "dayjs";
import { isEmpty, isUndefined } from "lodash";
import { Comment, UserModel } from "models/SystemAdministration";
import { useCallback, useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  STANDARD_TIME_FORMAT,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CommentManagementContext,
  CommentManagementContextProps,
} from "../CommentManagementHook";
import "./CommentManagementTable.scss";
import { SearchEmptyData } from "./SearchEmptyData";

enum CommentTableField {
  COUPON_CODE = "code",
  COMMENT_SENDER = "creator",
  MENTIONED_PERSON = "tagIds",
  CREATED_DATE = "createdDate",
  COMMENT_CONTENT = "content",
}

const TABLE_ROW_KEY = "CommentTableId";
const VIET_NAME_TIMEZONE_OFFSET = 7;
const NON_BREAKING_SPACE_REGEX = /&nbsp;?/g;

export const CommentManagementTable = () => {
  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    handleDeleteComment,
  } = useContext<CommentManagementContextProps>(CommentManagementContext);
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const deleteComment = useCallback(
    (comment: Comment) => {
      if (!isUndefined(handleDeleteComment)) {
        handleDeleteComment(comment);
      }
    },
    [handleDeleteComment]
  );

  const columns: ColumnProps<Comment>[] = useMemo(
    () => [
      // Coupon code
      {
        title: translate("RM.txt_coupon_code"),
        key: CommentTableField.COUPON_CODE,
        dataIndex: CommentTableField.COUPON_CODE,
        width: 200,
        render(item: string) {
          return (
            <LayoutCell>
              <OneLineText value={item} />
            </LayoutCell>
          );
        },
      },
      // Comment sender
      {
        title: translate("RM.txt_comment_sender"),
        key: CommentTableField.COMMENT_SENDER,
        dataIndex: CommentTableField.COMMENT_SENDER,
        width: 200,
        render(item: UserModel) {
          const value = `${item?.email} - ${item?.name}`;
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      // Content of comment
      {
        title: translate("RM.txt_comment_content"),
        key: CommentTableField.COMMENT_CONTENT,
        dataIndex: CommentTableField.COMMENT_CONTENT,
        render(item) {
          return (
            <LayoutCell>
              <div
                className="comment__content"
                dangerouslySetInnerHTML={{
                  __html: item.replace(NON_BREAKING_SPACE_REGEX, " "),
                }}
              />
            </LayoutCell>
          );
        },
      },
      // Time sender
      {
        title: translate("RM.txt_delivery_time"),
        key: CommentTableField.CREATED_DATE,
        dataIndex: CommentTableField.CREATED_DATE,
        width: 200,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(
                  dayjs(item).add(VIET_NAME_TIMEZONE_OFFSET, "hour"),
                  `${STANDARD_DATE_FORMAT_SLASH} ${STANDARD_TIME_FORMAT}`
                )}
              />
            </LayoutCell>
          );
        },
      },
      // Delete button
      {
        title: undefined,
        key: "delete",
        width: 40,
        render(_, row) {
          const FILL_COLOR = "#DA3E33";
          return (
            <div
              className="trash__container"
              onClick={() => deleteComment(row)}
            >
              <TrashIcon fillColor={FILL_COLOR} />
            </div>
          );
        },
      },
    ],
    [deleteComment, translate]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          dataSource={list}
          columns={columns}
          loading={loadingList}
          scroll={{ y: "calc(100vh - 568px)" }}
          onChange={handleTableChange}
          locale={{
            emptyText: <SearchEmptyData />,
          }}
        />
      </div>
      {isEmpty(list) ? null : (
        <div className="page-master__pagination">
          <Pagination
            pageIndex={modelFilter.pageIndex}
            pageSize={modelFilter.pageSize}
            total={count}
            onChange={handlePagination}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>
      )}
    </>
  );
};
