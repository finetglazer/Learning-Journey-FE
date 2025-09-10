export interface DashboardPermission {
  menuCode: string;
  permission: string;
}

export interface DashboardItem {
  id: string;
  code: string;
  name: string;
  menuZone: number;
  menuZoneCode: string;
  isSelected: boolean;
  hasPermission: boolean;
  orderDisplay: number;
  additionalConfiguration: null | any;
}

export interface DashboardDataByCodeRequest {
  code: string;
  chartDateRange: DateRange | null;
  year: number | null;
}

export interface SummaryDashboardRequest {
  code: string;
}

export interface ChartDashboardRequest {
  code: string;
  chartDateRange: DateRange;
}

export interface DateRange {
  from: string;
  to: string;
}
