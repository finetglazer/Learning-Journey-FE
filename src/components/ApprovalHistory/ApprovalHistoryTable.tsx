import classNames from "classnames";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import CollapseView from "components/Collapse/CollapseView";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import { historyLogService } from "core/services/page-services/history-service";
import { isEmpty, isEqual, isUndefined } from "lodash";
import { HistoryProps, HistoryRequestModel } from "models/History";
import SignProcessDownload from "pages/SignProcess/SignProcessDownload";
import { Model } from "react-3layer-common";
import { StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ApprovalHistory.scss";
import columnHistoryTable from "./ApprovalHistoryColumn";
import useSignProcessViewHook from "./SignProcessViewHook";
import { TABLE_ROW_KEY } from "core/config/consts";

const HEIGHT_EMPTY = 248;

export enum KeyTabHistoryTable {
  HISTORY_APPROVAL_TABLE = "history_approval",
}

interface ApprovalHistoryTableProps extends HistoryProps {
  useCollapse?: boolean;
  isNewLayoutVersion?: boolean;
  showAll?: boolean;
  model: Model;
  classNameCollapseView?: string;
}

function ApprovalHistoryTable({
  hasBorder = true,
  defaultActiveKey = [KeyTabHistoryTable.HISTORY_APPROVAL_TABLE],
  useCollapse = true,
  isNewLayoutVersion = false,
  showAll,
  model,
  classNameCollapseView,
  ...props
}: ApprovalHistoryTableProps) {
  const [translate] = useTranslation();
  const { list } = historyLogService.useHistoryLog({
    ...props,
  } as Pick<HistoryRequestModel, "topicId" | "type" | "historyType">);

  const { isOpen, currentFile, handleOpen, handleClose } =
    useSignProcessViewHook();

  const indexShowButtonViewSignForm = list?.findIndex(
    (item) =>
      item?.actionName === "Phê duyệt" ||
      item?.actionName === "Approve" ||
      item?.actionName === "Gửi duyệt" ||
      item?.actionName === "Send to approve"
  );

  const tableContent = (
    <>
      {isEmpty(list) ? (
        <CloudyEmpty content={translate("CM.empty.no_data_recorded")} />
      ) : (
        <StandardTable
          className="table-history-approval"
          rowKey={TABLE_ROW_KEY}
          dataSource={list}
          scroll={{ y: HEIGHT_EMPTY }}
          columns={columnHistoryTable({
            translate,
            onClickSignForm: handleOpen,
            model,
            indexShowButtonViewSignForm,
          })}
          isDragable
        />
      )}
      {isOpen && (
        <>
          <SignProcessDownload
            signedForm={currentFile}
            open={isOpen}
            handleClose={() => handleClose()}
          />
        </>
      )}
    </>
  );

  if (isUndefined(props?.topicId)) return null;

  if (isEqual(useCollapse, false)) {
    return (
      <div className="section_body-history">
        <span className="history-title">{translate("BG.history")}</span>
        {tableContent}
      </div>
    );
  }

  const items = [
    {
      key: KeyTabHistoryTable.HISTORY_APPROVAL_TABLE,
      label: translate("OC.approval_history"),
      children: tableContent,
    },
  ];

  if (isNewLayoutVersion) {
    return (
      <AdvancedCollapseView
        items={items}
        showAll={showAll}
        isFullView
        className={classNames(
          "approval-history-advanced-collapse",
          classNameCollapseView
        )}
      />
    );
  }

  return (
    <CollapseView
      items={items}
      defaultActiveKey={defaultActiveKey}
      className={classNames(
        hasBorder
          ? "collapse__container__overflow"
          : "collapse__container--not-border"
      )}
    />
  );
}

export default ApprovalHistoryTable;
