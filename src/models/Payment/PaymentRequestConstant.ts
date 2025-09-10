import { t } from "i18next";
import {
  AttachDocumentModel,
  PurchasingDocumentAttachModel,
  PurchasingDocumentsModel,
} from "./PaymentRequestModel";

export enum TYPE_OF_PAYMENT_TYPE {
  PAYMENT = "/payment-detail", //Đề nghị Thanh toán
  ADVANCE = "/payment-advance-detail", //Đề nghị Tạm ứng
  EXPENSE = "/payment-expense-detail", //Đề nghị Dự chi
  ACCOUNTING_ENTRY = "/payment-accounting-entry-detail", //Đề nghị Hạch toán
  DEPOSIT = "/payment-deposit-detail", //Đề nghị Đặt cọc
}

export enum TYPE_OF_TABS {
  GENERAL_INFORMATION = 0, //Thông tin chung
  LIST_INVOICE = 1, //Danh sách hóa đơn
  COST_ALLOCATION = 2, //Phân bổ chi phí
  REIMBURSEMENT_EXPENSE_REVERSAL = 3, //hoàn ứng / thoái dự chi
}

export enum STATUS_PAYMENT_REQUEST {
  DRAFT = 0, //Nháp
  WAITING_FOR_APPROVAL = 1, //Chờ duyệt
  APPROVED = 2, //Đã duyệt
  REJECTED = 3, //Từ chối
  CANCELED = 4, //Hủy
}

export enum TYPE_OF_PAYMENT_DETAIL_TYPE {
  PAYMENT = "/payment-request-view", //Đề nghị Thanh toán
  ADVANCE = "/advance-view", //Đề nghị Tạm ứng
  EXPENSE = "/expense-view", //Đề nghị Dự chi
  ACCOUNTING_ENTRY = "/accounting-entry-view", //Đề nghị Hạch toán
  DEPOSIT = "/deposit-view", //Đề nghị Đặt cọc
}

export enum PAYMENT_METHOD_TYPE {
  Payment = 0,
  Advance = 1,
  PlanToSpend = 2,
  Accounting = 3,
  Deposit = 4,
}

export enum PAYMENT_REQUEST_TYPE {
  PAYMENT,
  ADVANCE,
  EXPENSE,
  ACCOUNTING_ENTRY,
  DEPOSIT,
}

export enum TOPIC_TYPE {
  PAYMENT = 0,
  ADVANCE = 1,
  EXPENSE = 2,
}

export enum TAX_TYPE_ENUM {
  VAT = 0, //Thuế GTGT
  PERSONAL_INCOME = 1, //Thuế thu nhập cá nhân
  CONTRACTOR = 2, //Thuế nhà thầu
  NO_TAX = 3, //Không thuế
}

export const LIST_TAX = [
  {
    id: TAX_TYPE_ENUM.VAT,
    name: t("PM.vat_tax"),
  },
  {
    id: TAX_TYPE_ENUM.PERSONAL_INCOME,
    name: t("PM.personal_income_tax"),
  },
  {
    id: TAX_TYPE_ENUM.CONTRACTOR,
    name: t("PM.contractor_tax"),
  },
  {
    id: TAX_TYPE_ENUM.NO_TAX,
    name: t("PM.no_tax"),
  },
];

export enum TYPE_OF_PROPOSAL {
  PAYMENT = 0,
  ADVANCE = 1,
  EXPENSE = 2,
  ACCOUNTING_ENTRY = 3,
  DEPOSIT = 4,
}

export enum SHOPPING_PURPOSES {
  OTHER = 0,
  NORMAL_SHOPPING = 1,
  PROMOTION_PROGRAM = 2,
  REPAIR_MAINTENANCE = 3,
  ACCORDING_PROJECT = 4,
  STORAGE_PURCHASING,
  FINANCIAL_LEASE,
  OPERATING_LEASE,
  SOFTWARE_LEASE,
  NOT_PROMOTIONAL_PURCHASING,
  UNIFORM_PURCHASING,
}

export const emptyText = "---";

export const PATH_TEMPLATE_FILE =
  "eprocurement/template/Temp_Bang_ke_chuyen_khoan_trong_nuoc.xlsx";

export enum TypeOfInvoice {
  OLD_INVOICE = 0,
  NEW_INVOICE = 1,
}

export const TYPE_OF_INVOICES = [
  // khi kế thừa từ mua sắm thì mới có 2 giá tri
  {
    name: t("PM.old_invoice"),
    id: TypeOfInvoice.OLD_INVOICE,
  },
  {
    name: t("PM.new_invoice"),
    id: TypeOfInvoice.NEW_INVOICE,
  },
];

export const TYPE_OF_SUPPLIER = [
  {
    name: t("PM.payment_personal_title"),
    id: 0,
  },
  {
    name: t("PM.payment_organization_title"),
    id: 1,
  },
];

export enum COST_PERIODS_ENUM {
  ONCE = 0,
  ONE_MONTH = 1,
  THREE_MONTH = 2,
  SIX_MONTH = 6,
  NINE_MONTH = 7,
  TWELVE_MONTH = 8,
  TWENTY_FOUR_MONTH = 9,
  THIRTY_SIX_MONTH = 10,
}

export const COST_PERIODS = [
  {
    name: "1 " + t("PM.number_time_label"),
    id: COST_PERIODS_ENUM.ONCE,
  },
  {
    name: "1 " + t("PM.time_month_label"),
    id: COST_PERIODS_ENUM.ONE_MONTH,
  },
  {
    name: "3 " + t("PM.time_month_label"),
    id: COST_PERIODS_ENUM.THREE_MONTH,
  },
  {
    name: "6 " + t("PM.time_month_label"),
    id: COST_PERIODS_ENUM.SIX_MONTH,
  },
  {
    name: "9 " + t("PM.time_month_label"),
    id: COST_PERIODS_ENUM.NINE_MONTH,
  },
  {
    name: "12 " + t("PM.time_month_label"),
    id: COST_PERIODS_ENUM.TWELVE_MONTH,
  },
  {
    name: "24 " + t("PM.time_month_label"),
    id: COST_PERIODS_ENUM.TWENTY_FOUR_MONTH,
  },
  {
    name: "36 " + t("PM.time_month_label"),
    id: COST_PERIODS_ENUM.THIRTY_SIX_MONTH,
  },
];

export enum PAYMENT_METHOD_ENUM {
  BANK_TRANSFER,
  BANK_TRANSFER_REIMBURSEMENT,
  BANK_REIMBURSEMENT,
  NO_PAYMENT,
}

export const PAYMENT_METHOD_TYPES = [
  {
    name: t("PM.txt_bank_transfer"),
    id: PAYMENT_METHOD_ENUM.BANK_TRANSFER,
  },
  {
    name: t("PM.txt_bank_transfer_reimbursement"),
    id: PAYMENT_METHOD_ENUM.BANK_TRANSFER_REIMBURSEMENT,
  },
  {
    name: t("PM.txt_bank_reimbursement"),
    id: PAYMENT_METHOD_ENUM.BANK_REIMBURSEMENT,
  },
  {
    name: t("PM.no_payment"),
    id: PAYMENT_METHOD_ENUM.NO_PAYMENT,
  },
];

export enum COST_DRIVER_TYPE {
  COST_DRIVER_ABSOLUTE_AMOUNT = "ABSOLUTEAMOUNT",
  COST_DRIVER_AREA = "AREA",
  COST_DRIVER_EMPLOYEE_QUANTITY = "EMPLOYEEQUANTITY",
  COST_DRIVER_PERCENTAGE = "PERCENTAGE",
  COST_DRIVER_QUANTITY = "QUANTITY",
}

export const PURPOSE_OF_PURCHASE_TYPES = [
  {
    id: SHOPPING_PURPOSES.NORMAL_SHOPPING,
    code: "RegularPurchasing",
    name: t("PM.txt_regular_purchasing"),
  },
  {
    id: SHOPPING_PURPOSES.PROMOTION_PROGRAM,
    code: "PromotionalPurchasing",
    name: t("PM.txt_promotional_purchasing"),
  },
  {
    id: SHOPPING_PURPOSES.REPAIR_MAINTENANCE,
    code: "RepairAndMaintenance",
    name: t("PM.txt_repair_maintenance"),
  },

  {
    id: SHOPPING_PURPOSES.ACCORDING_PROJECT,
    code: "ProjectBased",
    name: t("PM.txt_project_based"),
  },

  {
    id: SHOPPING_PURPOSES.STORAGE_PURCHASING,
    code: "StoragePurchasing",
    name: t("PM.txt_buy_stock_storage"),
  },
  {
    id: SHOPPING_PURPOSES.FINANCIAL_LEASE,
    code: "AssetLease",
    name: t("PM.txt_finance_lease"),
  },

  { id: SHOPPING_PURPOSES.OTHER, code: "Other", name: t("PM.txt_other") },
];

export const listPuchasingDocumentInitial: PurchasingDocumentsModel[] = [
  {
    id: "1",
    attachedDoc: [
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
    ],
    totalAmount: "1000",
    typeOfVoucher: "Invoice",
    voucherCode: "INV001",
    voucherContent: "Payment for services",
  },
  {
    id: "2",
    attachedDoc: [
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
    ],
    totalAmount: "2000",
    typeOfVoucher: "Receipt",
    voucherCode: "REC002",
    voucherContent: "Advance payment",
  },
  {
    id: "3",
    attachedDoc: [
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
    ],
    totalAmount: "1500",
    typeOfVoucher: "Invoice",
    voucherCode: "INV003",
    voucherContent: "Payment for goods",
  },
];

export const listAttachDocumentInitial: AttachDocumentModel[] = [
  {
    id: "1",
    attachedDoc: [
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
    ],
    typeDoc: "Chủ trương",
    descriptionDoc: "Nâng cấp hệ thống ERP",
  },
  {
    id: "2",
    attachedDoc: [
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
    ],
    typeDoc: "Chủ trương",
    descriptionDoc: "Yêu cầu nâng cấp hệ thống ERP",
  },
  {
    id: "3",
    attachedDoc: [
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
      {
        contentType: "application/pdf",
        name: "InvoiceSample (2).pdf",
        path: "eprocurement/20241112095525/InvoiceSample (2).pdf",
        size: 381709,
        systemFileId: "1bf64e21-598c-4829-9c80-47e0579294a9",
      },
    ],
    typeDoc: "Chủ trương",
    descriptionDoc: "Hợp đồng nâng cấp hệ thống ERP",
  },
];

export const PurchasingDocumentAttachInitial: PurchasingDocumentAttachModel[] =
  [];
export const acceptFile = ".xlsx,.xls";
export const VND_CURRENCY = "VND";
export const JPY_CURRENCY = "JPY";
export const CODE_TYPE_PAYMENT_REQUEST_PER = "02_TTCN";
export const CODE_TYPE_PAYMENT_REQUEST_CORP = "01_TTNCC";
export const CODE_TYPE_EXPENSE_DCNCC = "05_DCNCC";
export const CODE_TYPE_EXPENSE_DCCN = "06_DCCN";
export const CODE_TYPE_ACCOUNTING_ENTRY = "08_HT";
export const CODE_ABSOLUTEAMOUNT = "ABSOLUTEAMOUNT";
export const CODE_TYPE_ADVANCE_TUNCC = "03_TUNCC";
export const CODE_TYPE_ADVANCE_TUCN = "04_TUCN";
export const CODE_TYPE_DEPOSIT = "07_DC";

export enum PAYMENT_DETAIL_TAB {
  GENERAL_INFORMATION_TAB = "0",
  INVOICES_TAB = "1",
  COST_ALLOCATION_TAB = "2",
  EXPENSE_REVERSAL_TAB = "3",
  ERP_INTEGRATION_TAB = "4",
  ECM_INTEGRATION_TAB = "5",
}

export enum PAYMENT_METHOD {
  BANK_TRANSFER = 0,
  BANK_TRANSFER_REIMBURSEMENT = 1,
  BANK_REIMBURSEMENT = 2,
  NO_PAYMENT = 3,
}

export enum TYPE_CREATE_PAYMENT_INHERITANCE {
  TTNCC = 1,
  TUNCC = 3,
  DCNCC = 5,
  HT,
  DC,
}

export enum PAYMENT_INHERITANCE_TYPE_SUBMIT {
  INHERITED_FROM_PROPOSAL = 0,
  INHERITED_FROM_PO = 1,
}

export enum TYPE_PAYMENT_REQUEST_CONTRACT {
  PAYMENT, //Thanh toán
  ADVANCE, //Tạm ứng
  SPENDING, //Dự chi
  DEPOSIT, //Đặt cọc
}

export enum TicketTypePayment {
  PurchasePlan, // Phương án mua sắm
  PurchaseProposal, // Chủ trương
  PurchaseRequest, // Yêu cầu mua sắm
  ContractPrinciple, // Hợp đồng nguyên tắc
  ContractSettlement, // Quyết toán hợp đồng
  Liquidation, // Thanh lý
  Acceptance, // Nghiệm thu
  ProjectSettlement, // Quyết toán dự án
  ContractLiquidation, // Thanh lý hợp đồng
  GoodsReceiptRequest, // Phiếu nhận hàng
  Contract, // Hợp đồng
  Order, // Đơn đặt hàng
}

export enum STATUS_INTEGRATE_ERP {
  FINAL = "Final ERP",
  PENDING = "Pending ERP",
  ERROR = "Error ERP",
  REJECT = "Reject ERP",
  PROCESSING = "Processing ERP",
  NOT_EXISTED = "Not Existed ERP",
  NULL = "Null",
}

export enum STATUS_INTEGRATE {
  FINAL,
  PENDING,
  ERROR,
  REJECT,
  PROCESSING,
  NOT_EXISTED,
  NULL,
}

export enum MatchStatus {
  FULL_MATCH,
  PARTIAL_MATCH,
  NO_MATCH,
}

export const statusMatchInvoices = [
  {
    id: MatchStatus.FULL_MATCH,
    name: t("PM.txt_matching_full"),
    code: "SUCCESS",
  },
  {
    id: MatchStatus.PARTIAL_MATCH,
    name: t("PM.txt_matching_partial"),
    code: "IN_PROGRESS",
  },
  {
    id: MatchStatus.NO_MATCH,
    name: t("PM.txt_matching_no"),
    code: "ERROR",
  },
];
