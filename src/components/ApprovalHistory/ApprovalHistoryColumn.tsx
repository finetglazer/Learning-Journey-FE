import { ColumnProps } from "antd/lib/table";
import { STANDARD_DATE_FORMAT_FULL_TIME } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import type { TFunction } from "i18next";
import { Attachment } from "models/Attachment";
import { HistoryModel } from "models/History/HistoryModel";
import { Model } from "react-3layer-common";
import {
  Button,
  LayoutCell,
  OneLineText,
} from "react-components-design-system";

interface ColumnApprovalHistoryTableProps {
  translate: TFunction<"translation", undefined>;
  onClickSignForm?: (signedForm: Attachment) => void;
  model?: Model;
  indexShowButtonViewSignForm?: number;
}

enum ColumnKey {
  PERFORMER = "performer",
  PERFORMER_ROLE = "performerRole",
  ACTION_NAME = "actionName",
  REASON = "reason",
  EXECUTION_TIME = "executionTime",
  SIGNATURE_FILE_LINK = "signatureFileLink",
}

const columnApprovalHistoryTable = ({
  translate,
  onClickSignForm,
  model,
  indexShowButtonViewSignForm,
}: ColumnApprovalHistoryTableProps): ColumnProps<HistoryModel>[] => {
  return [
    {
      title: translate("BG.performer"),
      dataIndex: ColumnKey.PERFORMER,
      key: ColumnKey.PERFORMER,
      width: 300,
      render: (performer) => (
        <LayoutCell>
          <OneLineText className="w-100 performer_text" value={performer} />
        </LayoutCell>
      ),
    },
    {
      title: translate("BG.role"),
      dataIndex: ColumnKey.PERFORMER_ROLE,
      key: ColumnKey.PERFORMER_ROLE,
      width: 200,
      render: (performerRole) => (
        <LayoutCell>
          <OneLineText className="w-100" value={performerRole} />
        </LayoutCell>
      ),
    },
    {
      title: translate("BG.action"),
      dataIndex: ColumnKey.ACTION_NAME,
      key: ColumnKey.ACTION_NAME,
      render: (actionName) => (
        <LayoutCell>
          <OneLineText className="w-100" value={actionName} />
        </LayoutCell>
      ),
    },
    {
      title: translate("CM.txt_reason"),
      dataIndex: ColumnKey.REASON,
      key: ColumnKey.REASON,
      render: (reason) => (
        <LayoutCell>
          <OneLineText className="w-100" value={reason} />
        </LayoutCell>
      ),
    },
    {
      title: translate("BG.time"),
      width: 200,
      dataIndex: ColumnKey.EXECUTION_TIME,
      key: ColumnKey.EXECUTION_TIME,
      render: (executionTime) => (
        <LayoutCell>
          {formatDateTimeToVietnamTimezone(
            executionTime,
            STANDARD_DATE_FORMAT_FULL_TIME
          )}
        </LayoutCell>
      ),
    },
    {
      title: translate("BG.label_signed_file"),
      width: 130,
      dataIndex: ColumnKey.SIGNATURE_FILE_LINK,
      key: ColumnKey.SIGNATURE_FILE_LINK,
      render: (_, __, index) => {
        return (
          <LayoutCell position="center">
            {indexShowButtonViewSignForm === index &&
              !!model?.signedForm?.path && (
                <Button
                  type="secondary"
                  size="lg"
                  onClick={() => onClickSignForm(model?.signedForm)}
                >
                  {translate("CM.viewSignForm")}
                </Button>
              )}
          </LayoutCell>
        );
      },
    },
  ];
};

export default columnApprovalHistoryTable;
