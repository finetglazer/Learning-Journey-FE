import { ColumnProps } from "antd/lib/table";
import { TOPIC_TYPE } from "config/const";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { getIconFile } from "core/helpers/common";
import { formatDate } from "core/helpers/date-time";
import { RequestAttachment } from "models/Contract";
import { OpinionTopicFinancial, PurchasingPlan } from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import React, { useContext, useEffect, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

const TechnicalReviewTable = () => {
  const [translate] = useTranslation();

  const { model, handleDownloadFileAttached } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const [dataTopic, setDataTopic] = useState<OpinionTopicFinancial[]>([]);

  useEffect(() => {
    getDataTopic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.id]);

  const getDataTopic = () => {
    purchasingPlanRepository
      .getOpinionTopicFinancial({
        topicType: TOPIC_TYPE.TOPIC_FINANCIAL,
        topicId: model.id,
      })
      .subscribe((res) => {
        setDataTopic(res);
      });
  };

  const columns: ColumnProps<PurchasingPlan>[] = React.useMemo(
    () => [
      {
        title: translate("PL.txt_review_summary_responder"),
        key: "respondent",
        dataIndex: "respondent",
        ellipsis: true,
        render(item) {
          return (
            <LayoutCell>
              <div>
                <OneLineText
                  className="text-table-content-primary"
                  value={item?.name}
                />
              </div>
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_review_summary_response_content"),
        key: "responseContent",
        dataIndex: "responseContent",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_review_summary_response_time"),
        key: "responseTime",
        dataIndex: "responseTime",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  value ? formatDate(value, STANDARD_DATE_FORMAT_SLASH) : "---"
                }
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.txt_review_summary_attached"),
        key: "opinionResponseAttachments",
        dataIndex: "opinionResponseAttachments",
        ellipsis: true,
        align: "start",
        render(value) {
          return (
            <LayoutCell position="right" className="row pt-2">
              {value?.map((item: RequestAttachment, index: number) => {
                return (
                  <UploadFile.FileLoadedContent
                    key={index}
                    file={item}
                    onClickFile={() => handleDownloadFileAttached(item)}
                    isViewMode
                    className="file-attached"
                    icon={
                      <img
                        src={getIconFile(item)}
                        alt="img"
                        width={24}
                        height={20}
                      />
                    }
                  />
                );
              })}
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <>
      <div className="round-get-opinions">
        <StandardTable
          className="table-view-financial"
          rowKey={"id"}
          columns={columns}
          dataSource={dataTopic}
          isDragable={true}
          scroll={{ y: "calc(100vh - 360px)" }}
          idContainer="table-id"
        />
      </div>
    </>
  );
};

export default TechnicalReviewTable;
