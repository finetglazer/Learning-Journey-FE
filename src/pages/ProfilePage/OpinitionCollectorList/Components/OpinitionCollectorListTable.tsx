import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";

import { AxiosError } from "axios";
import { formatDateTimeToVietnamTimezone } from "components/OpinionCollector/OpinionCollectorHook";
import {
  ACCEPTANCE_DETAIL_ROUTE,
  ACCOUNTING_ENTRY_DETAIL_ROUTE,
  ADVANCE_DETAIL_ROUTE,
  BUDGET_ADJUST_DETAIL_ROUTE,
  BUDGET_DETAIL_ROUTE,
  CONTRACT_ADJUSTMENT_VIEW_ROUTE,
  CONTRACT_ANNEX_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE,
  CONTRACT_TERMINATION_VIEW_ROUTE,
  DEPOSIT_DETAIL_ROUTE,
  EXPENSE_DETAIL_ROUTE,
  PAYMENT_REQUEST_DETAIL_ROUTE,
  PROJECT_SETTLEMENT_DETAIL_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
  SETTLEMENT_VIEW_ROUTE,
  TEMPORARY_IMPORT_ASSET_VIEW_ROUTE,
} from "config/route-const";
import { TopicType } from "core/models/History";
import appMessageService from "core/services/common-services/app-message-service";
import { isEmpty, isEqual } from "lodash";
import { OpinionFeedback } from "models/OpinionCollectorList/OpinionCollectorList";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import { profileRepository } from "pages/ProfilePage/ProfileRepository";
import { useCallback, useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { finalize } from "rxjs";
import {
  OpinitionCollectorList,
  OpinitionCollectorListContext,
} from "../OpinitionCollectorListHook";
import { VIEW_TOKEN } from "config/const";

const HEIGHT_EMPTY = 376;

const OpinitionCollectorListTable = () => {
  const opinitionCollectorList = useContext<OpinitionCollectorList>(
    OpinitionCollectorListContext
  );

  const history = useHistory();

  const { notifyToast } = appMessageService.useCRUDMessage();

  const {
    list,
    count,
    modelFilter,
    loadingList,
    setLoading,
    handleLoadList,
    dispatchFilter,
    getTagStatus,
    handleOpenFeedbackOpinionModal,
    handleOpenDetailOpinionTicket,
  } = opinitionCollectorList;
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const handleRedirectDetail = useCallback(
    (topicType?: TopicType, topicId?: string, opinionId?: string) => {
      setLoading(true);

      profileRepository
        .getOpinionResponseTopicByType({
          topicType,
          topicId,
        })
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: () => {
            let routerPath = "";
            switch (topicType) {
              case TopicType.AdjustBudget:
                routerPath = BUDGET_ADJUST_DETAIL_ROUTE;
                break;
              case TopicType.BudgetRequest:
                routerPath = BUDGET_DETAIL_ROUTE;
                break;
              case TopicType.PaymentRequest:
                routerPath = PAYMENT_REQUEST_DETAIL_ROUTE;
                break;
              case TopicType.PaymentAdvanceRequest:
                routerPath = ADVANCE_DETAIL_ROUTE;
                break;
              case TopicType.PaymentAccountingRequest:
                routerPath = ACCOUNTING_ENTRY_DETAIL_ROUTE;
                break;
              case TopicType.PurchaseProposal:
                routerPath = PROPOSAL_DETAIL_ROUTE;
                break;
              case TopicType.PurchaseRequest:
                routerPath = ADVANCE_DETAIL_ROUTE;
                break;
              case TopicType.PaymentExpenseRequest:
                routerPath = EXPENSE_DETAIL_ROUTE;
                break;
              case TopicType.PaymentDepositRequest:
                routerPath = DEPOSIT_DETAIL_ROUTE;
                break;
              case TopicType.PurchasePlan:
                routerPath = PURCHASING_PLAN_VIEW_ROUTE;
                break;
              case TopicType.HistoryApproval:
                routerPath = RECEIVING_GOODS_DETAIL_ROUTE;
                break;
              case TopicType.Acceptance:
                routerPath = ACCEPTANCE_DETAIL_ROUTE;
                break;
              case TopicType.ContractSettlement:
                routerPath = SETTLEMENT_VIEW_ROUTE;
                break;
              case TopicType.ProjectSettlement:
                routerPath = PROJECT_SETTLEMENT_DETAIL_ROUTE;
                break;
              case TopicType.TemporaryImportAsset:
                routerPath = TEMPORARY_IMPORT_ASSET_VIEW_ROUTE;
                break;
              case TopicType.ContractLiquidation:
                routerPath = CONTRACT_TERMINATION_VIEW_ROUTE;
                break;
              case TopicType.ContractAdjustment:
                routerPath = CONTRACT_ADJUSTMENT_VIEW_ROUTE;
                break;
              case TopicType.ContractPrincipleAppendix:
                routerPath = CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE;
                break;
              case TopicType.ContractAnnex:
                routerPath = CONTRACT_ANNEX_DETAIL_ROUTE;
                break;
              case TopicType.PurchasingPlanBidding:
                routerPath = PURCHASING_PLAN_BIDDING_VIEW_ROUTE;
                break;
              default:
                routerPath = "";
            }
            history.push(
              `${routerPath}/${topicId}?opinionResponseId=${opinionId}`
            );
          },
          error: (error: AxiosError) => {
            notifyToast({
              message: error?.response?.data?.message,
              type: "error",
            });
          },
        });
    },
    [history, notifyToast, setLoading]
  );

  const menu = useCallback((opinionFeedback: OpinionFeedback) => {
    const listAction: ListOverflowMenu[] = [
      {
        title: translate("OC.txt_view"),
        action: () =>
          handleRedirectDetail(
            opinionFeedback?.topicType,
            opinionFeedback?.topicId,
            opinionFeedback?.id
          ),
        isShow: isEqual(opinionFeedback?.canView, true),
      },
      {
        title: translate("OC.txt_respone"),
        action: () => handleOpenFeedbackOpinionModal(opinionFeedback),
        isShow: isEqual(opinionFeedback?.canResponse, true),
      },
    ];

    if (isEmpty(listAction.filter(({ isShow }) => isShow))) {
      return null;
    }

    return <OverflowMenu list={listAction} />;
  }, []);

  const getViewTokenFromUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      const params = new URLSearchParams(url.search);
      return params.get("viewToken");
    } catch (error) {
      return null;
    }
  };

  const columns: ColumnProps<OpinionFeedback>[] = useMemo(
    () => [
      {
        title: translate("OC.label_code"),
        key: "code",
        dataIndex: "code",
        width: 100,
        render(code: string, record: OpinionFeedback) {
          return (
            <LayoutCell>
              <div
                onClick={() => {
                  handleOpenDetailOpinionTicket(record.id);
                }}
              >
                <OneLineText
                  className="text-table-content-primary"
                  value={code}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("OC.label_requestCode"),
        key: "requestCode",
        dataIndex: "requestCode",
        width: 130,
        render(requestCode: string, record: OpinionFeedback) {
          return (
            <LayoutCell>
              <div
                onClick={() => {
                  if (
                    record?.detailUrl &&
                    record?.detailUrl?.includes("viewToken")
                  ) {
                    localStorage.setItem(
                      VIEW_TOKEN,
                      getViewTokenFromUrl(record?.detailUrl)
                    );
                  }
                }}
              >
                <a href={record?.detailUrl} style={{ textDecoration: "none" }}>
                  <OneLineText
                    className="text-table-content-primary"
                    value={requestCode}
                  />
                </a>
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("OC.opinion_Name"),
        key: "title",
        dataIndex: "title",
        render(title: string) {
          return (
            <LayoutCell>
              <OneLineText value={title} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("OC.opinion_type"),
        key: "isRequired",
        dataIndex: "isRequired",
        width: 122,
        render(isRequired: number) {
          const text = translate(`OC.${isRequired ? "mandatory" : "optional"}`);
          return (
            <LayoutCell>
              <OneLineText value={text} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("OC.sender"),
        key: "createUserDetail",
        dataIndex: "createUserDetail",
        width: 200,
        render(createUserDetail) {
          return (
            <LayoutCell>
              <OneLineText value={createUserDetail?.email} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("OC.response_deadline"),
        key: "responseDueDate",
        dataIndex: "responseDueDate",
        width: 140,
        render(responseDueDate) {
          const date = formatDateTimeToVietnamTimezone(responseDueDate);
          return (
            <LayoutCell>
              <OneLineText value={date} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-nowrap">{translate("OC.response_count")}</div>
        ),
        key: "respondedCount",
        dataIndex: "respondedCount",
        width: 119,
        render(respondedCount) {
          return (
            <LayoutCell>
              <OneLineText value={respondedCount} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.txt_status"),
        key: "responseStatus",
        dataIndex: "responseStatus",
        width: 140,
        render(responseStatus: number) {
          const { name, code } = getTagStatus(responseStatus);
          return (
            <LayoutCell>
              <Tag
                size="md"
                value={name}
                status={code}
                isShowDot={false}
                isShowBorder
              />
            </LayoutCell>
          );
        },
      },
      {
        key: "action",
        dataIndex: "id",
        width: 40,
        render(_, record: OpinionFeedback) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [getTagStatus, handleOpenDetailOpinionTicket, menu, translate]
  );

  return (
    <>
      <StandardTable
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={loadingList}
        onChange={handleTableChange}
        scroll={{ y: "calc(100vh - 360px)" }}
        idContainer="table-id"
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
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={count}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </>
  );
};

export default OpinitionCollectorListTable;
