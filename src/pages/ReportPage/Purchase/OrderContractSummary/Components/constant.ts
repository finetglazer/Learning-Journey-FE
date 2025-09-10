export const contractStatuses = [
  { id: 0, code: "Draft", name: "Nháp" },
  { id: 1, code: "WaitingForApprove", name: "Chờ duyệt" },
  { id: 2, code: "Approved", name: "Đã duyệt" },
  { id: 3, code: "Declined", name: "Từ chối" },
  { id: 4, code: "Canceled", name: "Hủy" },
  { id: 5, code: "Termination", name: "Đã thanh lý" },
  { id: 6, code: "Closed", name: "Đóng" },
];

export enum TabKey {
  CONTRACT_INFORMATION = "0",
  CONTRACT_ANNEX_INFORMATION = "1",
  CONTRACT_GUARANTEE = "2",
  CONTRACT_WARRANTY = "3",
}
