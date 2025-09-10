import React from "react";
import classNames from "classnames";
import {
  Button,
  FormItem,
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Select,
  StandardTable,
  Tag,
  TextArea,
} from "react-components-design-system";
import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";

import { useClarifyBiddingDocumentsTableHook } from "./ClarifyBiddingDocumentsTableHook";
import {
  MAX_LENGTH_255,
  MAX_LENGTH_500,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_600,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import Attachments from "components/Attachments/Attachments";
import DetailClarifyDocumentBidDrawer from "../../../DetailClarifyDocumentBidDrawer/DetailClarifyDocumentBidDrawer";
import { ClarificationRequestModel } from "models/PurchasingPlan";
import {
  classificationMap,
  getClarificationRequestTypeList,
  responseStatusList,
} from "pages/PurchasePage/PurchasingPlanBiddingPage/constants";
import { formatDate } from "core/helpers/date-time";
import AssetEmpty from "components/EmptyTable/AssetEmpty";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";

import { IcPlusSVG } from "assets/icons";

enum ColumnKey {
  ORDER_NUMBER = "orderNumber",
  CATEGORY = "category",
  CLARIFICATION_TITLE = "clarificationTitle",
  CLARIFICATION_SUBMISSION_DATE = "clarificationSubmissionDate",
  RESPONDER = "responder",
  VIEW_DETAILS = "viewDetails",
  RESPONSE_STATUS = "responseStatus",
  REQUESTER = "requester",
}

const columnsWidth = {
  orderNumber: 50,
  category: 200,
  clarificationTitle: 40,
  clarificationSubmissionDate: 200,
  responder: 200,
  viewDetailsButton: 120,
  responseStatus: 200,
  requester: 200,
};

interface ClarifyBiddingDocumentsTableProps {
  isClarifyBidProposal?: boolean;
}

const ClarifyBiddingDocumentsTable = ({
  isClarifyBidProposal,
}: ClarifyBiddingDocumentsTableProps) => {
  const {
    translate,
    modelMaster,
    modelClarificationRequest,
    selectedClarificationHistoryDetail,
    bidDocumentListBySupplier,
    bidProposalListBySupplier,
    clarificationHistoryDetailData,
    isOpenAddClarificationRequestModal,
    isLoadingAddClarificationRequest,
    clarificationHistorySupplier,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeListField,
    handleViewClarificationHistoryDetail,
    handleCloseDrawer,
    handleOpenClarificationRequestModal,
    handleAddClarificationRequest,
    handleCloseClarificationRequestModal,
  } = useClarifyBiddingDocumentsTableHook();

  const columns: ColumnProps<ClarificationRequestModel>[] = React.useMemo(
    () => [
      {
        title: translate("PL.txt_stt"),
        key: ColumnKey.ORDER_NUMBER,
        dataIndex: ColumnKey.ORDER_NUMBER,
        ellipsis: true,
        width: columnsWidth.orderNumber,
        render: (_, record, index) => {
          return (
            <LayoutCell>
              <OneLineText value={String(index + 1) || "---"} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.category"),
        key: ColumnKey.CATEGORY,
        dataIndex: ColumnKey.CATEGORY,
        ellipsis: true,
        width: columnsWidth.category,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  classificationMap?.[record?.classification]?.name || "---"
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.clarification_title"),
        key: ColumnKey.CLARIFICATION_TITLE,
        dataIndex: ColumnKey.CLARIFICATION_TITLE,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.title || "---"} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.clarification_submission_date"),
        key: ColumnKey.CLARIFICATION_SUBMISSION_DATE,
        dataIndex: ColumnKey.CLARIFICATION_SUBMISSION_DATE,
        ellipsis: true,
        width: columnsWidth.clarificationSubmissionDate,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  formatDate(record?.createdDate, STANDARD_DATE_FORMAT_SLASH) ||
                  "---"
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_review_summary_responder"),
        key: ColumnKey.RESPONDER,
        dataIndex: ColumnKey.RESPONDER,
        ellipsis: true,
        width: columnsWidth.responder,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.user?.name || "---"} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("CM.view_details"),
        width: columnsWidth.viewDetailsButton,
        render(_, record) {
          return (
            <LayoutCell>
              <Button
                type="secondary"
                size="sm"
                onClick={() => handleViewClarificationHistoryDetail(record)}
              >
                {translate("CM.details")}
              </Button>
            </LayoutCell>
          );
        },
      },
    ],
    [handleViewClarificationHistoryDetail, translate]
  );

  const clarifyBidProposalColumns: ColumnProps<ClarificationRequestModel>[] =
    React.useMemo(
      () => [
        ...columns.slice(0, -2),
        {
          title: translate("CM.response_status"),
          key: ColumnKey.RESPONSE_STATUS,
          dataIndex: ColumnKey.RESPONSE_STATUS,
          ellipsis: true,
          width: columnsWidth.responseStatus,
          render: (_, record) => {
            const item = responseStatusList.find(
              (statusType) => statusType.id === record?.status
            );

            return (
              <LayoutCell>
                {item ? (
                  <Tag
                    size="md"
                    value={item?.name}
                    status={item?.code}
                    isShowDot={false}
                  />
                ) : (
                  "---"
                )}
              </LayoutCell>
            );
          },
        },
        {
          title: translate("CM.requester"),
          key: ColumnKey.REQUESTER,
          dataIndex: ColumnKey.REQUESTER,
          ellipsis: true,
          width: columnsWidth.requester,
          render: (_, record) => {
            return (
              <LayoutCell>
                <OneLineText value={record?.user?.name || "---"} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("CM.view_details"),
          width: columnsWidth.viewDetailsButton,
          render(_, record) {
            return (
              <LayoutCell>
                <Button
                  type="secondary"
                  size="sm"
                  onClick={() =>
                    handleViewClarificationHistoryDetail(record, true)
                  }
                >
                  {translate("CM.details")}
                </Button>
              </LayoutCell>
            );
          },
        },
      ],
      [columns, handleViewClarificationHistoryDetail, translate]
    );

  const bidClarificationList = isClarifyBidProposal
    ? bidProposalListBySupplier
    : bidDocumentListBySupplier;

  const isShowAddClarificationRequestButton =
    modelMaster?.status === PURCHASING_PLAN_STATUS.BIDDING &&
    isClarifyBidProposal;

  return (
    <>
      <div
        className={classNames({
          ["d-flex flex-column gap-3"]: isClarifyBidProposal,
        })}
      >
        {isShowAddClarificationRequestButton && (
          <Button
            disabled={isEmpty(clarificationHistorySupplier)}
            iconPlace="left"
            icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
            type="secondary"
            className="align-self-start"
            onClick={handleOpenClarificationRequestModal}
          >
            {translate("PL.add_clarification_request")}
          </Button>
        )}

        {!isEmpty(bidClarificationList) ? (
          <StandardTable
            rowKey={TABLE_ROW_KEY}
            columns={isClarifyBidProposal ? clarifyBidProposalColumns : columns}
            dataSource={bidClarificationList}
            scroll={{ y: "calc(100vh - 400px)" }}
          />
        ) : (
          <AssetEmpty />
        )}
      </div>

      <Modal
        open={isOpenAddClarificationRequestModal}
        disableButtonApply={isLoadingAddClarificationRequest}
        disableButtonCancel={isLoadingAddClarificationRequest}
        maskClosable={false}
        isShowIconBack={false}
        size={WIDTH_600}
        title={translate("PL.clarification_request")}
        titleButtonCancel={translate("CM.btn_close")}
        titleButtonApply={translate("CM.btn_confirm")}
        handleSave={handleAddClarificationRequest}
        handleCancel={handleCloseClarificationRequestModal}
      >
        <div>
          <div className="d-flex size-full flex-column gap-3">
            <div className="d-flex gap-3">
              {/* Supplier */}
              <FormItem
                validateObject={utilService.getValidateObj(
                  modelClarificationRequest,
                  "supplierId"
                )}
              >
                <InputText
                  readOnly
                  isSmall={false}
                  label={translate("PL.purchasing_plan_supplier_tab")}
                  value={clarificationHistorySupplier?.name}
                />
              </FormItem>

              {/* Type of Clarification Request */}
              <FormItem
                validateObject={utilService.getValidateObj(
                  modelClarificationRequest,
                  "classification"
                )}
              >
                <Select
                  isRequired
                  isSmall={false}
                  label={translate("PL.clarification_request_type")}
                  placeHolder={translate(
                    "PL.select_clarification_request_type"
                  )}
                  valueFilter={{
                    name: "",
                  }}
                  isSearch
                  searchType=""
                  classFilter={undefined}
                  getList={getClarificationRequestTypeList}
                  isEnumerable={false}
                  appendToBody
                  value={modelClarificationRequest?.clarificationRequestType}
                  onChange={handleChangeSelectField({
                    fieldName: "clarificationRequestType",
                  })}
                />
              </FormItem>
            </div>

            {/* Clarification Title */}
            <FormItem
              validateObject={utilService.getValidateObj(
                modelClarificationRequest,
                "title"
              )}
            >
              <InputText
                isRequired
                isSmall={false}
                label={translate("PL.clarification_title")}
                placeHolder={translate("PL.enter_clarification_title")}
                maxLength={MAX_LENGTH_255}
                translate={translate}
                value={modelClarificationRequest?.title}
                onChange={handleChangeSingleField({
                  fieldName: "title",
                })}
              />
            </FormItem>

            {/* Clarification Content */}
            <FormItem
              validateObject={utilService.getValidateObj(
                modelClarificationRequest,
                "content"
              )}
            >
              <TextArea
                showCount
                label={translate("PL.clarification_content")}
                placeHolder={translate(
                  "PL.purchasing_plan_content_placeholder"
                )}
                resize="none"
                rows={3}
                maxLength={MAX_LENGTH_500}
                translate={translate}
                value={modelClarificationRequest?.content}
                onChange={handleChangeSingleField({
                  fieldName: "content",
                })}
              />
            </FormItem>

            <Attachments
              attachments={modelClarificationRequest?.attachments}
              handleUpdate={handleChangeListField({ fieldName: "attachments" })}
            />
          </div>
        </div>
      </Modal>

      <DetailClarifyDocumentBidDrawer
        isOpen={!!selectedClarificationHistoryDetail}
        data={clarificationHistoryDetailData}
        handleClose={handleCloseDrawer}
      />
    </>
  );
};

export default ClarifyBiddingDocumentsTable;
