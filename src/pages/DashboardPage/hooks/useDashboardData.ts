import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DateRange } from "../types";
import utc from "dayjs/plugin/utc";

export const useDashboardData = () => {
  const defaultFrom = dayjs().startOf("month").utc().toISOString();
  const defaultTo = dayjs().endOf("month").utc().toISOString();

  const [chartDateRange, setChartDateRange] = useState<DateRange>({
    from: defaultFrom,
    to: defaultTo,
  });

  const urlConfig = {
    "9": "portal/payment/deposit-view/{id}?isView=true",
    "16": "portal/purchase/contract/contract-adjustment/contract-adjustment-view/{id}/?isView=true",
    "5": "portal/budget/budget-adjust-detail/{id}?isViewWaitingApprove=false",
    "26": "portal/purchase/purchase-plan-adjust-competitive-offer/purchase-plan-adjust-competitive-offer-view/{id}?isViewWaitingApprove=true",
    "29": "portal/purchase/purchase-plan-adjust-bid/purchase-plan-adjust-bid-view/{id}",
    "12": "portal/purchase/proposal/proposal-adjust-view/{id}",
    "13": "portal/purchase/purchase-request/purchase-request-adjust-view/{id}",
    "7": "portal/payment/expense-view/{id}?isView=true",
    "8": "portal/payment/accounting-entry-view/{id}?isView=true",
    "18": "portal/purchase/contract-principle/contract-principle-view/{id}",
    "11": "portal/purchase/contract/contract-view/{id}",
    "1": "portal/budget/budget-detail/{id}?isViewWaitingApprove=false",
    "19": "portal/purchase/acceptance/acceptance-detail/{id}?isView=true",
    "15": "portal/purchase/receiving-goods/receiving-goods-detail/{id}?isView=true",
    "28": "portal/purchase/purchase-plan-competitive-offer/purchase-plan-competitive-offer-view/{id}?isViewWaitingApprove=false",
    "14": "portal/purchase/purchasing-plan/purchase-plan-view/{id}?isViewWaitingApprove=false",
    "23": "portal/purchase/purchase-plan-bidding/purchase-plan-bidding-view/{id}?isViewWaitingApprove=false",
    "27": "portal/purchase/contract-principle/appendix-detail/{id}?isView=true",
    "24": "portal/purchase/contract/annex-detail/{id}?isView=true",
    "22": "portal/purchase/project-settlement/project-settlement-detail/{id}?isView=true",
    "21": "portal/purchase/settlement/settlement-view/{id}?isView=true",
    "17": "portal/purchase/temporary-import-asset/temporary-import-asset-view/{id}?isViewWaitingApprove=false",
    "6": "portal/payment/advance-view/{id}?isView=true",
    "25": "portal/purchase/contract-termination/contract-termination-view/{id}",
    "2": "portal/payment/payment-request-view/{id}?isView=true",
    "4": "portal/purchase/proposal/proposal-detail/{id}",
    "3": "portal/purchase/purchase-request/purchase-request-view/{id}",
    "10": "portal/catalog/supplier-management/supplier/supplier-view/{id}",
  };

  const [advanceChartYear, setAdvanceChartYear] = useState<number>(
    dayjs().year()
  );

  return {
    chartDateRange,
    setChartDateRange,
    advanceChartYear,
    setAdvanceChartYear,
  };
};
