import { ContractSupplierModel } from "models/Contract";

export const getDataContractSupplier = (data: ContractSupplierModel) => {
  const result: ContractSupplierModel = {
    address: undefined,
    agentPerson: undefined,
    agentPersonPosition: undefined,
    procuration: undefined,
    contactPerson: undefined,
    email: undefined,
    phone: undefined,
    supplierPayments: [],
    supplierPayment: {},
    supplier: {
      id: undefined,
      name: undefined,
      taxCode: undefined,
    },
  };

  if (data) {
    Object.assign(result, {
      ...data,
      supplier: {
        id: data.supplierId,
        name: data.name,
        taxCode: data.taxCode,
      },
      supplierPayment: {
        name: "",
        code: "",
      },
    });
  }

  if (data?.supplierPayments?.[0]?.bankAccountNo) {
    Object.assign(result, {
      supplierPayment: {
        ...data.supplierPayments[0],
        name: data.supplierPayments[0].bankAccountName,
        code: data.supplierPayments[0].bankAccountNo,
      },
    });
  }

  return result;
};
