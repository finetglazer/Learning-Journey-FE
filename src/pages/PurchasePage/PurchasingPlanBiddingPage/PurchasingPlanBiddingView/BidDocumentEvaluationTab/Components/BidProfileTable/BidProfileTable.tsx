import { useContext, useMemo } from "react";
import { ColumnProps } from "antd/lib/table";
import classNames from "classnames";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { STANDARD_DATE_FORMAT_HAVE_CLOCK } from "core/config/consts";
import { getIconFile } from "core/helpers/common";
import { RequestAttachment } from "models/Proposal";
import {
  ColumnKey,
  CriteriaType,
  FinancialProfile,
  TechnicalCompetencyProfile,
} from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";

import { CheckedGreen, CheckedDisable } from "assets/icons";
import styles from "./BidProfileTable.module.scss";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";

type Props = {
  data: TechnicalCompetencyProfile[] | FinancialProfile[];
  type?: CriteriaType;
  handleViewQuote?: () => void;
};

const BidProfileTable = ({ data, type, handleViewQuote }: Props) => {
  const [translate] = useTranslation();

  const { handleDownloadFileAttached } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const columns: ColumnProps<TechnicalCompetencyProfile | FinancialProfile>[] =
    useMemo(
      () => [
        {
          title: translate("PL.txt_stt"),
          key: ColumnKey.INDEX,
          dataIndex: ColumnKey.INDEX,
          sorter: false,
          width: 50,
          render(_item, _record, index) {
            return (
              <LayoutCell>
                <OneLineText
                  value={`${index + 1}`}
                  className={styles["vertical_baseline"]}
                />
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
          render(item, record) {
            return (
              <LayoutCell>
                <div
                  className="truncate"
                  onClick={() => {
                    if (!record?.quotationId) return;
                    handleViewQuote();
                  }}
                >
                  <OneLineText
                    value={
                      record?.quotationId
                        ? translate("PL.quotation_step_text")
                        : item ?? "---"
                    }
                    useTooltip
                    className={classNames(styles["vertical_baseline"], {
                      [styles["text-blue"]]: record?.quotationId,
                    })}
                  />
                </div>
              </LayoutCell>
            );
          },
        },
        {
          title: translate("PL.bidding.title.is_required"),
          key: ColumnKey.IS_IMPERATIVE,
          dataIndex: ColumnKey.IS_IMPERATIVE,
          sorter: false,
          width: 80,
          align: "center",
          render(item) {
            return (
              <LayoutCell position="center">
                <img
                  src={item ? CheckedGreen : CheckedDisable}
                  alt="CheckedGreen"
                  width={13}
                  height={13}
                  className={styles["vertical_baseline"]}
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
                          STANDARD_DATE_FORMAT_HAVE_CLOCK
                        )
                      : "---"
                  }
                  useTooltip
                  className={styles["vertical_baseline"]}
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
          width: 348,
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
          width: 178,
          render(item) {
            return (
              <LayoutCell>
                <OneLineText
                  value={item || "---"}
                  useTooltip
                  className={styles["vertical_baseline"]}
                />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("PL.txt_supplier_document"),
          key: ColumnKey.QUOTATION_SUBMISSION_ATTACHMENTS,
          dataIndex: ColumnKey.QUOTATION_SUBMISSION_ATTACHMENTS,
          sorter: false,
          width: 384,
          render(_, record) {
            return (
              <div className="payment-custom_grid_12 p-1 gap-1">
                {record?.attachments?.map(
                  (item: RequestAttachment, index: number) => {
                    return (
                      <UploadFile.FileLoadedContent
                        isViewMode
                        key={index}
                        file={{ ...item, id: item.systemFileId }}
                        onClickFile={() => handleDownloadFileAttached(item)}
                        className={classNames(
                          "file-loaded-item w-100 payment-custom_grid_9-col_6",
                          {
                            "file-loaded-item-4": true,
                          }
                        )}
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
        className={styles["supplier-document-table"]}
      />
    </div>
  );
};

export default BidProfileTable;
