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

interface ColumnAdjustmentHistoryTableProps {
  translate: TFunction<"translation", undefined>;
  onClickSignForm?: (signedForm: Attachment) => void;
  model?: Model;
  indexShowButtonViewSignForm?: number;
  ticketCodeColumnText?: string;
  navigateToDetail?: (id: string) => void;
}

enum ColumnKey {
  ADJUSTMENT_CODE = "adjustmentCode",
  PERFORMER = "performer",
  PERFORMER_ROLE = "performerRole",
  ACTION_NAME = "actionName",
  EXECUTION_TIME = "executionTime",
  SIGNATURE_FILE_LINK = "signatureFileLink",
}

const columnAdjustmentHistoryTable = ({
  translate,
  ticketCodeColumnText,
  navigateToDetail,
  onClickSignForm,
  model,
  indexShowButtonViewSignForm,
}: ColumnAdjustmentHistoryTableProps): ColumnProps<HistoryModel>[] => {
  return [
    {
      title: ticketCodeColumnText || translate("CM.txt_ticket_code"),
      dataIndex: ColumnKey.ADJUSTMENT_CODE,
      key: ColumnKey.ADJUSTMENT_CODE,
      width: 200,
      render: (adjustmentCode, rowData) => (
        <LayoutCell>
          <div
            className="text-ellipsis"
            onClick={() => {
              navigateToDetail(rowData?.adjustmentSlipId);
            }}
          >
            <OneLineText
              className="text-table-content-primary"
              value={adjustmentCode}
            />
          </div>
        </LayoutCell>
      ),
    },
    {
      title: translate("BG.performer"),
      dataIndex: ColumnKey.PERFORMER,
      key: ColumnKey.PERFORMER,
      render: (performer) => (
        <LayoutCell>
          <OneLineText className="w-100" value={performer} />
        </LayoutCell>
      ),
    },
    {
      title: translate("BG.role"),
      dataIndex: ColumnKey.PERFORMER_ROLE,
      key: ColumnKey.PERFORMER_ROLE,
      width: 150,
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
      width: 200,
      render: (actionName) => (
        <LayoutCell>
          <OneLineText className="w-100" value={actionName} />
        </LayoutCell>
      ),
    },
    {
      title: translate("BG.time"),
      width: 180,
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
      width: 95,
      dataIndex: ColumnKey.SIGNATURE_FILE_LINK,
      key: ColumnKey.SIGNATURE_FILE_LINK,
      render: (_, __, index) => (
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
      ),
    },
  ];
};

export default columnAdjustmentHistoryTable;
