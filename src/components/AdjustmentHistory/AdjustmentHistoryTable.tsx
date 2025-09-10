import { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import CollapseView from "components/Collapse/CollapseView";
import { HistoryType } from "core/models/History";
import { historyLogService } from "core/services/page-services/history-service";
import { isEmpty, uniqueId } from "lodash";
import { HistoryProps, HistoryRequestModel } from "models/History";
import { StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import columnHistoryTable from "./AdjustmentHistoryColumn";
import "./AdjustmentHistory.scss";
import classNames from "classnames";
import useSignProcessViewHook from "components/ApprovalHistory/SignProcessViewHook";
import SignProcessDownload from "pages/SignProcess/SignProcessDownload";
import { Model } from "react-3layer-common";

const HEIGHT_EMPTY = 248;
const ID = "id";

interface AdjustmentHistoryTableProps extends HistoryProps {
  title: string;
  ticketCodeColumnText?: string;
  viewAdjustmentNavigatePath?: string;
  model: Model;
}

function AdjustmentHistoryTable({
  title,
  ticketCodeColumnText,
  viewAdjustmentNavigatePath,
  hasBorder = true,
  model,
  ...props
}: AdjustmentHistoryTableProps) {
  const [translate] = useTranslation();
  const history = useHistory();

  const { list } = historyLogService.useHistoryLog({
    ...props,
    historyType: HistoryType.AdjustmentHistory,
  } as Pick<HistoryRequestModel, "topicId" | "originalId" | "type" | "historyType">);

  const { isOpen, currentFile, handleOpen, handleClose } =
    useSignProcessViewHook();

  const indexShowButtonViewSignForm = list?.findIndex(
    (item) =>
      item?.actionName === "Phê duyệt" ||
      item?.actionName === "Approve" ||
      item?.actionName === "Gửi duyệt" ||
      item?.actionName === "Send to approve"
  );

  const navigateToDetail = useCallback(
    (id: string) => {
      if (!id || !viewAdjustmentNavigatePath) return;
      history.push(`${viewAdjustmentNavigatePath}/${id}`);
    },
    [viewAdjustmentNavigatePath, history]
  );

  const items = useMemo(
    () => [
      {
        key: uniqueId(),
        label: title,
        children: (
          <div className="section_body">
            <StandardTable
              rowKey={ID}
              dataSource={list}
              scroll={{ y: HEIGHT_EMPTY }}
              columns={columnHistoryTable({
                translate,
                ticketCodeColumnText,
                navigateToDetail,
                onClickSignForm: handleOpen,
                model,
                indexShowButtonViewSignForm,
              })}
              isDragable
            />

            {isOpen && (
              <>
                <SignProcessDownload
                  signedForm={currentFile}
                  open={isOpen}
                  handleClose={() => handleClose()}
                />
              </>
            )}
          </div>
        ),
      },
    ],
    [
      title,
      list,
      translate,
      ticketCodeColumnText,
      navigateToDetail,
      handleOpen,
      model,
      indexShowButtonViewSignForm,
      isOpen,
      currentFile,
      handleClose,
    ]
  );

  if (isEmpty(list)) return null;

  return (
    <CollapseView
      items={items}
      className={classNames(
        hasBorder
          ? "collapse__container__overflow"
          : "collapse__container--not-border"
      )}
    />
  );
}

export default AdjustmentHistoryTable;
