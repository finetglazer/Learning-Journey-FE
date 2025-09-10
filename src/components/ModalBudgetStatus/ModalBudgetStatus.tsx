import { IcEmptySearchSvg } from "assets/icons";
import { DEFAULT_PAGE_SIZE_OPTION, MODAL_WIDTH_1100 } from "core/config/consts";
import EmptyDataCM from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/component/EmptyDataCM";
import {
  Modal,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { listBudgetStatusService } from "core/services/page-services/list-budget-status-service";
import columnBudgetStatus from "./ColumnBudgetStatus";
import { CostAllocation, PaymentModel } from "models/Payment";
import { useMemo } from "react";
import { isEmpty, isNil } from "lodash";

interface ModalBudgetStatusProps {
  open: boolean;
  handleCancelModalBudgetStatus: () => void;
  costAllocation?: CostAllocation[];
  purposeOfPurchase: PaymentModel;
  ids?: string[];
  rate?: number;
  isProposal?: boolean;
  proposalId?: string;
}

const HEIGHT_EMPTY = 500;
const TIMEOUT = 100;

function ModalBudgetStatus({
  open,
  costAllocation,
  purposeOfPurchase,
  handleCancelModalBudgetStatus,
  ids,
  rate,
  isProposal,
  proposalId,
}: ModalBudgetStatusProps) {
  const {
    list,
    count,
    translate,
    modelFilter,
    isOverBudget,
    isShowReallocateAmount,
    handlePagination,
    handleCloseModal,
  } = listBudgetStatusService.useBudgetStatusOverview({
    costAllocation,
    purposeOfPurchase,
    ids,
    rate,
    isProposal,
    proposalId,
  });

  const statusBudget = useMemo(
    () => ({
      tagName: isOverBudget
        ? translate("PM.budget_over_title")
        : translate("PM.budget_not_over_title"),
      status: isOverBudget ? "ERROR" : "SUCCESS",
    }),
    [isOverBudget, translate]
  );

  const handleCancel = () => {
    handleCloseModal();
    setTimeout(() => handleCancelModalBudgetStatus(), TIMEOUT);
  };

  return (
    <Modal
      open={open}
      isShowIconBack={false}
      isShowButtonApply={false}
      isShowButtonCancel={false}
      size={MODAL_WIDTH_1100}
      title={translate("PM.budgets_view_overview_page_title")}
      handleCancel={handleCancel}
      closeIcon
    >
      <div className="pb-2 d-flex gap-2 align-items-center">
        <div className="fs-5 fw-semibold payment-text_normal">
          {translate("PM.budget_status_title_table")}
        </div>
        <Tag
          size="sm"
          isShowDot={false}
          value={statusBudget.tagName}
          status={statusBudget.status}
          isShowBorder
        />
      </div>
      <div className="page-master__table">
        <StandardTable
          className="payment-custom_table"
          idContainer="budget-status"
          rowKey="id"
          dataSource={list}
          scroll={{ y: "calc(100vh - 470px)" }}
          columns={columnBudgetStatus({
            translate,
            isShowReallocateAmount,
          })}
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.txt_search_no_data")}
                icon={IcEmptySearchSvg}
                height={HEIGHT_EMPTY}
                isFilter
              />
            ),
          }}
          isDragable
        />
        <div className="page-master__pagination">
          <Pagination
            total={count}
            pageIndex={modelFilter.pageIndex}
            pageSize={modelFilter.pageSize}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
            onChange={handlePagination}
            showCurrentRecordsNumber
          />
        </div>
      </div>
    </Modal>
  );
}

export default ModalBudgetStatus;
