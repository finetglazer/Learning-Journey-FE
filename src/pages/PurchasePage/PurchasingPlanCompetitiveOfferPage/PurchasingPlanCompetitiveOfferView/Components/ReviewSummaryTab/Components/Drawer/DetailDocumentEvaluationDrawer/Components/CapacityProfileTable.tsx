import { ColumnProps } from "antd/lib/table";
import { IcNoRequire, IcRequire } from "assets/icons";
import classNames from "classnames";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { getIconFile } from "core/helpers/common";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { RequestAttachment } from "models/Proposal";
import {
  ColumnKey,
  CriteriaType,
  FinancialProfile,
} from "models/PurchasingPlan";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./CapacityProfileTable.module.scss";

type Props = {
  data: FinancialProfile[];
  type?: CriteriaType;
};

const CapacityProfileTable = ({ data, type }: Props) => {
  const [translate] = useTranslation();

  const { handleDownloadFileAttached } = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );

  const columns: ColumnProps<FinancialProfile>[] = useMemo(
    () => [
      {
        title: translate("PL.txt_stt"),
        key: ColumnKey.INDEX,
        dataIndex: ColumnKey.INDEX,
        sorter: false,
        width: 50,
        render(item, record, index) {
          return (
            <LayoutCell>
              <OneLineText value={`${index + 1}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.bidding.title.profile_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        sorter: false,
        width: type === CriteriaType.Finance ? 145 : 218,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.bidding.title.is_required"),
        key: ColumnKey.IS_IMPERATIVE,
        dataIndex: ColumnKey.IS_IMPERATIVE,
        sorter: false,
        width: 130,
        align: "center",
        render(item) {
          return (
            <LayoutCell position="center">
              <img
                src={item ? IcRequire : IcNoRequire}
                alt="CheckedGreen"
                width={24}
                height={24}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_submission_time"),
        key: ColumnKey.SUBMITTED_DATE,
        dataIndex: ColumnKey.SUBMITTED_DATE,
        sorter: false,
        width: 150,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  item
                    ? formatDateTimeToVietnamTimezone(
                        item,
                        STANDARD_DATE_FORMAT_SLASH
                      )
                    : "---"
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_file_document"),
        key: ColumnKey.ATTACHMENTS,
        dataIndex: ColumnKey.ATTACHMENTS,
        sorter: false,
        width: 238,
        render(_, record) {
          return (
            <LayoutCell>
              <div className={styles["file-loaded"]}>
                {record?.attachments?.map(
                  (item: RequestAttachment, index: number) => {
                    return (
                      <UploadFile.FileLoadedContent
                        isViewMode
                        key={index}
                        file={{ ...item, id: item.systemFileId }}
                        onClickFile={() => handleDownloadFileAttached(item)}
                        className={classNames("file-loaded-item authorizers")}
                        icon={
                          <img
                            src={getIconFile(item)}
                            alt="img"
                            width={14}
                            height={24}
                          />
                        }
                      />
                    );
                  }
                )}
              </div>
            </LayoutCell>
          );
        },
      },
      ...(type === CriteriaType.Finance
        ? [
            {
              title: translate("PL.purchasing_plan_quote_code"),
              key: ColumnKey.QUOTATION_CODE,
              dataIndex: ColumnKey.QUOTATION_CODE,
              sorter: false,
              width: 145,
              render(item: string) {
                return (
                  <LayoutCell>
                    <OneLineText
                      value={item}
                      useTooltip
                      className={classNames(styles["text-blue"], "fw-bold")}
                    />
                  </LayoutCell>
                );
              },
            },
          ]
        : []),
      {
        title: translate("PL.txt_note"),
        key: ColumnKey.NOTE,
        dataIndex: ColumnKey.NOTE,
        sorter: false,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item || "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [handleDownloadFileAttached, translate, type]
  );

  return (
    <div>
      <StandardTable
        rowKey={ColumnKey.TECHNICAL_REQUIREMENT}
        isDragable
        columns={columns}
        dataSource={data || []}
        scroll={{ y: "calc(100vh - 546px)" }}
      />
    </div>
  );
};

export default CapacityProfileTable;
