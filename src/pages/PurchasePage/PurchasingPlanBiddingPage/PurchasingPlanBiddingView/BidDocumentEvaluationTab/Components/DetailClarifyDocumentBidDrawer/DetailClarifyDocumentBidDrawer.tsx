import { Drawer, Tag, UploadFile } from "react-components-design-system";
import { isEmpty } from "lodash";

import { getIconFile } from "core/helpers/common";
import { attachmentService } from "core/services/page-services/attachment-service";
import { RequestAttachment } from "models/Contract";
import { classificationMap } from "pages/PurchasePage/PurchasingPlanBiddingPage/constants";

import styles from "./DetailClarifyDocumentBidDrawer.module.scss";

interface DetailClarifyDocumentBidDrawerProps {
  isOpen: boolean;
  data: {
    drawerTitle?: string;
    contentTitle?: string;
    classification?: number;

    dataList?: {
      classificationData: {
        label?: string;
        value?: string;
        fileList?: RequestAttachment[];
      }[];
      responseData: {
        label?: string;
        value?: string;
        fileList?: RequestAttachment[];
      }[];
    };
  };
  handleClose?: () => void;
}

const DetailClarifyDocumentBidDrawer = ({
  isOpen,
  data,
  handleClose,
}: DetailClarifyDocumentBidDrawerProps) => {
  const { handleDownloadFileAttached } = attachmentService.useAttachments();

  const renderFileList = (fileList: RequestAttachment[]) => {
    if (isEmpty(fileList)) return null;

    return fileList.map((item: RequestAttachment, index: number) => {
      return (
        <UploadFile.FileLoadedContent
          className={styles["file-item"]}
          key={index}
          file={item}
          isViewMode
          icon={
            <img
              src={getIconFile(item)}
              alt="File Icon"
              width={24}
              height={24}
            />
          }
          onClickFile={() => handleDownloadFileAttached(item)}
        />
      );
    });
  };

  return (
    <Drawer
      visible={isOpen}
      size={"2xl"}
      loading={false}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={true}
      hasOverlay={true}
      visibleFooter={false}
      className={styles["detail-clarify-document-bid__container"]}
      title={
        <div>
          <span className={styles["drawer-title"]}>{data?.drawerTitle}</span>
        </div>
      }
      handleClose={handleClose}
    >
      <div className={styles["content"]}>
        <div className="d-flex gap-2">
          <span className={styles["content-title"]}>{data?.contentTitle}</span>
          <Tag
            size="md"
            value={classificationMap?.[data?.classification]?.name}
            status={classificationMap?.[data?.classification]?.code}
            isShowDot={false}
          />
        </div>
        <div className={styles["clarification-content"]}>
          {data?.dataList?.classificationData?.map((item) => {
            return (
              <div key={item?.label} className="d-flex gap-3">
                <p className={styles["clarification-content__label"]}>
                  {item?.label || "---"}
                </p>
                {!isEmpty(item?.fileList) ? (
                  <div className="d-flex gap-3 flex-grow-1 flex-wrap">
                    {renderFileList(item?.fileList)}
                  </div>
                ) : (
                  <p className={styles["clarification-content__value"]}>
                    {item?.value || "---"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles["divider"]}></div>
        <div className={styles["response-content"]}>
          {data?.dataList?.responseData?.map((item) => {
            return (
              <div key={item?.label} className="d-flex gap-3">
                <p className={styles["clarification-content__label"]}>
                  {item?.label || "---"}
                </p>
                {!isEmpty(item?.fileList) ? (
                  <div className="d-flex gap-3 flex-grow-1 flex-wrap">
                    {renderFileList(item?.fileList)}
                  </div>
                ) : (
                  <p className={styles["clarification-content__value"]}>
                    {item?.value || "---"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
};

export default DetailClarifyDocumentBidDrawer;
