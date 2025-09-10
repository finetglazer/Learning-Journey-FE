import { ColumnProps } from "antd/lib/table";
import dayjs from "dayjs";
import { ContractFile, RequestAttachment } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  TwoLineText,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./HistoryFileTable.scss";
import { getIconFile } from "core/helpers/common";

enum ColumnKey {
  ATTACHMENTS = "attachments",
  UPLOADED_DATE = "uploadedDate",
  IS_HISTORY = "isHistory",
  NOTE = "note",
}

const HistoryFileTable = () => {
  const [translate] = useTranslation();

  const { model, handleDownloadFileAttached } = useContext(
    ContractDetailHookContext
  );

  const columns = useMemo(
    (): ColumnProps<ContractFile>[] => [
      {
        title: translate("CT.upload_time"),
        width: 180,
        key: ColumnKey.UPLOADED_DATE,
        dataIndex: ColumnKey.UPLOADED_DATE,
        render(value) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={dayjs(value).format("DD/MM/YYYY")}
                valueLine2={dayjs(value).format("HH:mm")}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.attach_files"),
        key: ColumnKey.ATTACHMENTS,
        dataIndex: ColumnKey.ATTACHMENTS,
        render(value) {
          return (
            <LayoutCell className="row pt-2 g-2">
              {value.map((item: RequestAttachment, index: number) => {
                return (
                  <UploadFile.FileLoadedContent
                    className={"col-4"}
                    key={index}
                    file={item}
                    onClickFile={() => handleDownloadFileAttached(item)}
                    isViewMode
                    icon={
                      <img
                        src={getIconFile(item)}
                        alt="img"
                        width={24}
                        height={24}
                      />
                    }
                  />
                );
              })}
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.note"),
        key: ColumnKey.NOTE,
        dataIndex: ColumnKey.NOTE,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="Histories-file-table">
      <StandardTable
        columns={columns}
        dataSource={model?.contractFileHistories ?? []}
        scroll={{ y: "calc(100vh - 360px)" }}
      />
    </div>
  );
};

export default HistoryFileTable;
