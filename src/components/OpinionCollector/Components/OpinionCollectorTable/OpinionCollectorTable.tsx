import { ColumnProps } from "antd/lib/table";
import { OpinionCollectorIcon, PlusIcon } from "assets/icons";
import classNames from "classnames";
import { Dayjs } from "dayjs";
import { isEmpty, isEqual } from "lodash";
import {
  OpinionCollector,
  OpinionResponse,
  RequesterDetail,
  ResponderDetail,
} from "models/OpinionCollector";
import { CircleStatus } from "pages/Catalog/CostLine/CostLineMaster/CircleStatus";
import { useCallback, useContext, useMemo } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
  Tag,
  TwoLineText,
} from "react-components-design-system";
import { RootState } from "rtk";
import { useAppSelector } from "rtk/useRedux";
import {
  formatDateTimeToVietnamTimezone,
  getTagStatus,
  OpinionCollectorContext,
  OpinionCollectorContextType,
} from "../../OpinionCollectorHook";
import { EmptyDataSection } from "../EmptyDataSection/EmptyDataSection";

enum OpinionCollectorTableFields {
  REQUEST_ID = "id",
  CONTENT = "title",
  RESPONSE_REASON = "opinionResponse",
  REQUESTER = "createUserDetail",
  RESPONDER = "responseByDetail",
  RESPONSE_TIME = "responseTime",
  RESPONSE_DEADLINE = "responseDueDate",
  STATUS = "responseStatusText",
  MANDATORY = "isRequired",
  ACTION = "action",
}

const ONE = 1;

const COLUMN_WIDTHS = {
  LARGE: 191,
  MEDIUM_LARGE: 160,
  MEDIUM: 140,
  SMALL: 96,
  EXTRA_SMALL: 76,
};
const TABLE_SCROLL_HEIGHT = "248px";
const TABLE_PAGE_SCROLL_HEIGHT = "calc(100vh - 353px)";
const PLUS_ICON_SIZE = 16;

interface TwoLineTextCustomProps {
  valueLine1?: string;
  valueLine2?: string;
}

const TwoLineTextCustom = ({
  valueLine1 = "",
  valueLine2 = "",
}: TwoLineTextCustomProps) => (
  <LayoutCell>
    <TwoLineText
      valueLine1={valueLine1}
      valueLine2={valueLine2}
      classNameFirstLine={"table_text"}
      classNameSecondLine={"table_sub_text"}
    />
  </LayoutCell>
);

interface OneLineTextCustomProps {
  content?: string;
  className?: string;
}

const OneLineTextCustom = ({
  content = "",
  className,
}: OneLineTextCustomProps) => (
  <LayoutCell className={classNames(className)}>
    <OneLineText value={content} />
  </LayoutCell>
);

interface OpinionCollectorTableProps {
  isPage?: boolean;
  disabledButtonOpinion?: boolean;
}

const OpinionCollectorTable = ({
  isPage,
  disabledButtonOpinion,
}: OpinionCollectorTableProps) => {
  const {
    translate,
    opinionCollectorData,
    opinionCollectorLoading,
    handleOpenCollectOpinionModal,
    handleOpenFeedbackOpinionModal,
    handleOpenDetailOpinionTicket,
  } = useContext<OpinionCollectorContextType>(OpinionCollectorContext);

  const currentUser = useAppSelector(
    (state: RootState) => state?.profile?.account
  );

  const isActionButtonDisabled = useCallback(
    (record: OpinionCollector): boolean => {
      return (
        !isEqual(
          currentUser?.email?.toLowerCase(),
          record?.responseByDetail?.email?.toLowerCase()
        ) ||
        isEqual(record?.canResponse, false) ||
        disabledButtonOpinion
      );
    },
    [currentUser?.email, disabledButtonOpinion]
  );

  const handleResponseOpinion = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement>,
      selectedOpinion: OpinionCollector
    ) => {
      event.stopPropagation();
      if (isActionButtonDisabled(selectedOpinion)) return;

      handleOpenFeedbackOpinionModal(selectedOpinion);
    },
    [handleOpenFeedbackOpinionModal, isActionButtonDisabled]
  );

  const handleOnRowActions = (record: OpinionCollector) => {
    return {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        handleOpenDetailOpinionTicket(record);
      },
      className: "clickable_row",
    };
  };

  const columns: ColumnProps<OpinionCollector>[] = useMemo(
    () => [
      {
        title: translate("OC.opinion_request_content"),
        key: OpinionCollectorTableFields.CONTENT,
        dataIndex: OpinionCollectorTableFields.CONTENT,
        width: COLUMN_WIDTHS.LARGE,
        render: (title, record) => (
          <TwoLineTextCustom valueLine1={title} valueLine2={record.code} />
        ),
      },
      {
        title: (
          <div className="text-break-line">
            {translate("OC.response_reason")}
          </div>
        ),
        key: OpinionCollectorTableFields.RESPONSE_REASON,
        dataIndex: OpinionCollectorTableFields.RESPONSE_REASON,
        width: COLUMN_WIDTHS.LARGE,
        render: (opinionResponse: OpinionResponse) => (
          <OneLineTextCustom
            content={opinionResponse?.responseContent}
            className="text-base-line"
          />
        ),
      },
      {
        title: translate("OC.opinion_requester"),
        key: OpinionCollectorTableFields.REQUESTER,
        dataIndex: OpinionCollectorTableFields.REQUESTER,
        width: COLUMN_WIDTHS.MEDIUM_LARGE,
        render: (requester: RequesterDetail) => (
          <TwoLineTextCustom
            valueLine1={requester?.name}
            valueLine2={requester?.email}
          />
        ),
      },
      {
        title: translate("OC.responder"),
        key: OpinionCollectorTableFields.RESPONDER,
        dataIndex: OpinionCollectorTableFields.RESPONDER,
        width: COLUMN_WIDTHS.MEDIUM_LARGE,
        render: (responder: ResponderDetail) => (
          <TwoLineTextCustom
            valueLine1={responder?.name}
            valueLine2={responder?.email}
          />
        ),
      },
      {
        title: (
          <div className="text-nowrap d-flex align-items-center">
            {translate("OC.response_time")}
          </div>
        ),
        key: OpinionCollectorTableFields.RESPONSE_TIME,
        dataIndex: OpinionCollectorTableFields.RESPONSE_TIME,
        width: COLUMN_WIDTHS.MEDIUM,
        render: (_, record: OpinionCollector) => (
          <LayoutCell className="text-base-line">
            {formatDateTimeToVietnamTimezone(
              record?.opinionResponse?.createdDate
            )}
          </LayoutCell>
        ),
      },
      {
        title: translate("OC.response_deadline"),
        key: OpinionCollectorTableFields.RESPONSE_DEADLINE,
        dataIndex: OpinionCollectorTableFields.RESPONSE_DEADLINE,
        width: COLUMN_WIDTHS.MEDIUM,
        render: (responseDeadline: Dayjs) => (
          <LayoutCell className="text-base-line">
            {formatDateTimeToVietnamTimezone(responseDeadline)}
          </LayoutCell>
        ),
      },
      {
        title: translate("OC.status"),
        key: OpinionCollectorTableFields.STATUS,
        dataIndex: OpinionCollectorTableFields.STATUS,
        width: COLUMN_WIDTHS.MEDIUM,
        render: (status, record) => (
          <LayoutCell className="text-base-line text-base-line--smaller">
            <Tag
              size="md"
              value={status}
              status={getTagStatus(record?.responseStatus)}
              isShowDot={false}
              isShowBorder
            />
          </LayoutCell>
        ),
      },
      {
        title: (
          <div className="center_table_item">{translate("OC.mandatory")}</div>
        ),
        key: OpinionCollectorTableFields.MANDATORY,
        dataIndex: OpinionCollectorTableFields.MANDATORY,
        width: COLUMN_WIDTHS.EXTRA_SMALL,
        render: (isRequired) => (
          <LayoutCell className="icon-base-line">
            <CircleStatus active={isEqual(isRequired, true)} />
          </LayoutCell>
        ),
      },
      {
        title: "",
        key: OpinionCollectorTableFields.ACTION,
        dataIndex: OpinionCollectorTableFields.ACTION,
        width: COLUMN_WIDTHS.SMALL,
        render: (_, record) => (
          <LayoutCell className="text-base-line text-base-line--smaller">
            <div className="center_table_item">
              <Button
                type="secondary"
                size="sm"
                disabled={isActionButtonDisabled(record)}
                onClick={(event) => handleResponseOpinion(event, record)}
              >
                {translate("OC.feedback")}
              </Button>
            </div>
          </LayoutCell>
        ),
      },
    ],
    [handleResponseOpinion, isActionButtonDisabled, translate]
  );

  return isEmpty(opinionCollectorData) && !opinionCollectorLoading ? (
    <EmptyDataSection
      icon={OpinionCollectorIcon}
      iconButton={
        <img
          src={PlusIcon}
          alt="add-icon"
          width={PLUS_ICON_SIZE}
          height={PLUS_ICON_SIZE}
        />
      }
      title={translate("OC.empty_section_title")}
      titleButton={translate("OC.add_opinion")}
      disabledButtonOpinion={disabledButtonOpinion}
      handleClick={handleOpenCollectOpinionModal}
    />
  ) : (
    <StandardTable
      rowKey={OpinionCollectorTableFields.REQUEST_ID}
      columns={columns}
      dataSource={opinionCollectorData}
      loading={opinionCollectorLoading}
      onRow={handleOnRowActions}
      scroll={{ y: isPage ? TABLE_PAGE_SCROLL_HEIGHT : TABLE_SCROLL_HEIGHT }}
    />
  );
};

export default OpinionCollectorTable;
