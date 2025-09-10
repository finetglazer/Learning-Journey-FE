import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE } from "config/route-const";
import { historyLogService } from "core/services/page-services/history-service";
import { isEmpty, isEqual, isUndefined } from "lodash";
import { HistoryProps, HistoryRequestModel } from "models/History";
import { useCallback } from "react";
import { StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "./ApprovalHistoryAdjust.scss";
import columnHistoryTable from "./ApprovalHistoryAdjustColumn";
import useSignProcessViewHook from "components/ApprovalHistory/SignProcessViewHook";
import SignProcessDownload from "pages/SignProcess/SignProcessDownload";
import { Model } from "react-3layer-common";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { emptyCloudIcon } from "assets/icons";

const HEIGHT_EMPTY = 248;

export enum KeyTabHistoryTable {
  HISTORY_APPROVAL_TABLE = "history_approval",
}

interface ApprovalHistoryAdjustTableProps extends HistoryProps {
  useCollapse?: boolean;
  model: Model;
}

function ApprovalHistoryAdjustTable({
  useCollapse = true,
  model,
  ...props
}: ApprovalHistoryAdjustTableProps) {
  const [translate] = useTranslation();
  const { list } = historyLogService.useHistoryLog({
    ...props,
  } as Pick<HistoryRequestModel, "topicId" | "type" | "historyType">);

  const history = useHistory();

  const navigateToDetail = (id: string) => {
    history.push(`${PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE}/${id}`);
  };

  const { isOpen, currentFile, handleOpen, handleClose } =
    useSignProcessViewHook();

  const indexShowButtonViewSignForm = list?.findIndex(
    (item) =>
      item?.actionName === "Phê duyệt" ||
      item?.actionName === "Approve" ||
      item?.actionName === "Gửi duyệt" ||
      item?.actionName === "Send to approve"
  );

  const tableContent = useCallback(
    () => (
      <>
        {isEmpty(list) ? (
          <EmptyItemTable
            icon={<img src={emptyCloudIcon} alt="" />}
            content={translate("CM.empty.no_data_recorded")}
          />
        ) : (
          <StandardTable
            rowKey="id"
            dataSource={list}
            scroll={{ y: HEIGHT_EMPTY }}
            columns={columnHistoryTable({
              translate,
              navigateToDetail,
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
    ),
    [list, translate]
  );

  if (isUndefined(props?.topicId)) return null;

  if (isEqual(useCollapse, false)) {
    return (
      <div className="section_body-history">
        <span className="history-title">{translate("BG.history")}</span>
        {tableContent()}
      </div>
    );
  }

  const items = [
    {
      key: KeyTabHistoryTable.HISTORY_APPROVAL_TABLE,
      label: translate("PL.txt_adjust_plan_history"),
      children: tableContent(),
    },
  ];

  return (
    <AdvancedCollapseView
      items={items}
      showAll
      isFullView
      className="approval_history_advanced_collapse"
    />
  );
}

export default ApprovalHistoryAdjustTable;
