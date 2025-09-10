/* eslint-disable @typescript-eslint/no-explicit-any */
import { detailService } from "core/services/page-services/detail-service";
import {
  ConfigField,
  FieldValue,
  GeneralActionEnum,
  HttpStatusCode,
} from "core/services/service-types";
import { Nation, Supplier } from "models/Supplier/Supplier";
import React, { createContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Model } from "react-3layer-common";
import { useTranslation } from "react-i18next";
import supplierRepository from "../SupplierRepository";
import { Dayjs } from "dayjs";
import { fieldService } from "core/services/page-services/field-service";
import appMessageService from "core/services/common-services/app-message-service";
import { SUPPLIER_MASTER_ROUTE } from "config/route-const";
import { finalize } from "rxjs";
import _, { isEqual } from "lodash";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { SupplierContact } from "models/PurchasingPlan";
import { ColumnProps } from "antd/lib/table";
import { LayoutCell, OneLineText, Tag } from "react-components-design-system";
import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DenySvg from "assets/icons/CostLine/ic_deny.svg";
import { v4 as uuidv4 } from "uuid";
import { TrashCan } from "@carbon/icons-react";
import { IcPencilSvg } from "assets/icons";
import { SupplierPayment } from "models/ContractAnnex";
import { getStatus } from "core/helpers/status";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import saveAs from "file-saver";
import { error } from "console";
import { nationRepository } from "pages/Catalog/NationPage/NationRepository";

export interface SupplierDetail {
  model: Supplier;
  isDetail?: boolean;
  loading?: boolean;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleChangeBoolField?: (config: ConfigField) => (value: boolean) => void;

  handleChangeAllField?: (value: Supplier) => void;
  handleChangeSelectField?: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeMultipleSelectField?: (
    config: ConfigField
  ) => (values: Model[]) => void;
  handleChangeDateField?: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleActionSupplierApproval?: (modal: null | Supplier) => void;
  existMessage?: string;
  handleChangeTreeField?: (
    config: ConfigField
  ) => (values: Model[], isMultiple: boolean) => void;
  handleSave?: () => void;
  handleUploadAttachmentError?: (error: any) => void;
  handleDownloadFileAttached?: (file?: FileModel) => void;

  //for contact contents
  contactContents?: SupplierContact[];
  visibleContactModal?: boolean;
  targetContact?: SupplierContact;
  handleChangeSimpleFieldContact?: (
    fieldName: keyof SupplierContact
  ) => (value: string | boolean) => void;
  handleAddContact?: () => void;
  handleSaveContactModal?: (contact: SupplierContact) => void;
  handleCancelContactModal?: () => void;
  contactContentColumns?: ColumnProps<SupplierContact>[];

  //for payment contents
  paymentContents?: SupplierPayment[];
  visiblePaymentModal?: boolean;
  targetPayment?: SupplierPayment;
  setTargetPayment?: React.Dispatch<React.SetStateAction<SupplierPayment>>;
  handleChangeSimpleFieldPayment?: (
    fieldName: keyof SupplierPayment
  ) => (value: string | boolean) => void;
  handleAddPayment?: () => void;
  handleSavePaymentModal?: (payment: SupplierPayment) => void;
  handleCancelPaymentModal?: () => void;
  paymentContentColumns?: ColumnProps<SupplierPayment>[];
}

export const SupplierDetailContext = createContext<SupplierDetail>({
  model: new Supplier(),
});

export enum SupplierApprovalModal {
  "APPROVE",
  "REJECT",
}

const CONTACT_REQUIRE_FIELD = ["name", "phone", "email"];

const DOMESTIC_PAYMENT_REQUIRE_FIELD = [
  "bank",
  "bankAccountNo",
  "bankAccountName",
];

const NON_DOMESTIC_PAYMENT_REQUIRE_FIELD = [
  "bankForeignName",
  "bankAccountNo",
  "bankAccountName",
  "swiftCode",
];

// const DEFAULT_NATION: Nation = {
//   code: "VN",
//   name: "Việt Nam",
//   id: "bf1baecc-04be-4250-b5e3-a32f8f0cae1e",
// };

export const useSupplierDetailHooks = () => {
  const [translate] = useTranslation();
  const { model, dispatch: dispatchModel } = detailService.useModel<Supplier>(
    Supplier,
    {
      ...new Supplier(),
      isActive: true,
    }
  );

  const url = window.location.href;
  const isApprove = url.includes("approve");

  const { isDetail } = detailService.useGetIsDetail(
    supplierRepository.getDetail,
    dispatchModel
  );

  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeMultipleSelectField,
    handleChangeDateField,
    handleChangeTreeField,
  } = fieldService.useField(model, dispatchModel);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const history = useHistory();

  const [modal, setModal] = useState<SupplierApprovalModal | null>(null);

  const [existMessage, setExistMessage] = useState<string>("");

  const handleActionSupplierApproval = (modal: SupplierApprovalModal) => {
    if (modal === SupplierApprovalModal.APPROVE) {
      setLoading(true);
      const emails = model?.supplierContacts?.map(
        (contact: { email: string }) => contact?.email
      );
      supplierRepository.checkExistAccount(emails).subscribe(
        (res) => {
          setLoading(false);
          setModal(modal);
        },
        (error: AxiosError) => {
          setExistMessage(error?.response?.data?.message);
          setModal(modal);
          setLoading(false);
        }
      );
    }
  };

  const firstLoad = React.useRef<boolean>(true);

  React.useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      nationRepository
        .getAll({
          code: "VN",
        })
        .subscribe((res) => {
          const data = res?.data?.items;
          if (data?.length === 1) {
            handleChangeAllField({
              ...model,
              nation: data[0],
              nationId: data[0]?.id,
            });
          }
        });
    }
  }, [handleChangeAllField, model]);

  const handleGoMaster = React.useCallback(() => {
    history.push(SUPPLIER_MASTER_ROUTE);
  }, [history]);

  const handleCloseModal = () => {
    if (isEqual(modal, SupplierApprovalModal.REJECT)) {
      dispatchModel({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          errors: undefined,
        },
      });
    }
    setModal(null);
  };

  const handleApprove = () => {
    handleCloseModal();
    setLoading(true);
    supplierRepository
      .approval(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  };

  const handleReject = () => {
    setLoading(true);
    supplierRepository
      .reject(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          handleCloseModal();
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  };

  const handleSave = React.useCallback(() => {
    setLoading(true);
    supplierRepository
      .save(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (response: any) => {
          if (isEqual(response?.status, 200)) {
            notifyToast({
              message: translate("CM.updateSuccess"),
            });
            handleGoMaster();
          }
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
            });

            notifyToast({
              message: error.response?.data?.errors?.supplierContacts || "",
              type: "error",
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  }, [handleChangeAllField, handleGoMaster, model, notifyToast, translate]);

  const handleUploadAttachmentError = (error: AxiosError) => {
    if (isEqual(error.response?.status, HttpStatusCode.PAYLOAD_TOO_LARGE)) {
      notifyToast({
        message: translate("BG.multiple_max_file_size"),
        type: "error",
      });
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleDownloadFileAttached = (file?: FileModel) => {
    supplierRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const handleValidateContent = React.useCallback(
    (
      content: SupplierContact | SupplierPayment,
      requireFields: (keyof SupplierContact)[] | (keyof SupplierPayment)[]
    ) => {
      const validatedContent = _.cloneDeep(content);
      let check = true;
      requireFields?.forEach((field) => {
        if (
          validatedContent[`${field}`] === undefined ||
          validatedContent[`${field}`] === null ||
          validatedContent[`${field}`] === ""
        ) {
          validatedContent.errors = {
            ...validatedContent?.errors,
            [`${field}`]: translate("CM.required_message"),
          };
          check = false;
        }
        if (field === "email" && validatedContent?.email) {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!regex.test(validatedContent?.email)) {
            validatedContent.errors = {
              ...validatedContent?.errors,
              email: translate("CM.input_regex_validation"),
            };
            check = false;
          }
        }
        if (
          field === "bankAccountNo" &&
          validatedContent?.bankAccountNo &&
          !/^[0-9]+$/.test(validatedContent?.bankAccountNo)
        ) {
          validatedContent.errors = {
            ...validatedContent?.errors,
            bankAccountNo: translate("CM.input_numeric_validation"),
          };
          check = false;
        }
      });

      return {
        canUpdate: check,
        validatedContent: validatedContent,
      };
    },
    [translate]
  );

  const contactContents = React.useMemo(() => {
    return model?.supplierContacts ? model?.supplierContacts : [];
  }, [model?.supplierContacts]);

  const setContactContents = React.useCallback(
    (values: SupplierContact[]) => {
      handleChangeAllField({ ...model, supplierContacts: values });
    },
    [handleChangeAllField, model]
  );

  const handleDeleteContact = React.useCallback(
    (index: number) => {
      const newContacts = [...contactContents];
      newContacts.splice(index, 1);
      setContactContents(newContacts);
    },
    [contactContents, setContactContents]
  );

  const [targetContactIndex, setTargetContactIndex] =
    React.useState<number>(undefined);

  const [targetContact, setTargetContact] = React.useState<SupplierContact>(
    new SupplierContact()
  );

  const handleSaveContact = React.useCallback(
    (contact: SupplierContact, index: number) => {
      const newContacts = [...contactContents];
      newContacts[index] = contact;
      setContactContents(newContacts);
    },
    [contactContents, setContactContents]
  );

  const handleChangeSimpleFieldContact = React.useCallback(
    (fieldName: keyof SupplierContact) => (value: string | boolean) => {
      setTargetContact({ ...targetContact, [fieldName]: value });
    },
    [targetContact]
  );

  const [visibleContactModal, setVisibleContactModal] =
    React.useState<boolean>(false);

  const handleEditContact = React.useCallback(
    (contact: SupplierContact, index: number) => {
      setTargetContactIndex(index);
      setTargetContact(contact);
      setVisibleContactModal(true);
    },
    []
  );

  const handleAddContact = React.useCallback(() => {
    setTargetContactIndex(undefined);
    if (!contactContents || contactContents?.length === 0) {
      setTargetContact({
        ...new SupplierContact(),
        isDefault: true,
        isCreateAccount: true,
      });
    } else {
      setTargetContact(new SupplierContact());
    }

    setVisibleContactModal(true);
  }, [contactContents]);

  const handleSaveContactModal = React.useCallback(
    (contact: SupplierContact) => {
      const { validatedContent, canUpdate } = handleValidateContent(
        contact,
        CONTACT_REQUIRE_FIELD
      );
      if (canUpdate) {
        if (targetContactIndex !== undefined) {
          handleSaveContact(contact, targetContactIndex);
        } else {
          setContactContents([
            ...contactContents,
            { ...contact, id: uuidv4() },
          ]);
        }
        setVisibleContactModal(false);
      } else {
        setTargetContact(validatedContent as SupplierContact);
      }
    },
    [
      contactContents,
      handleSaveContact,
      handleValidateContent,
      setContactContents,
      targetContactIndex,
    ]
  );

  const handleCancelContactModal = React.useCallback(() => {
    setVisibleContactModal(false);
    setTargetContact(new SupplierContact());
  }, []);

  const contactContentColumns: ColumnProps<SupplierContact>[] = React.useMemo(
    () => [
      {
        title: translate("SL.supplierContacts.name"),
        key: "name",
        dataIndex: "name",
        sorter: false,
        render(...params: [string, SupplierContact, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.contactModal.position"),
        key: "position",
        dataIndex: "position",
        sorter: false,
        render(...params: [string, SupplierContact, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.supplierContacts.phone"),
        key: "phone",
        dataIndex: "phone",
        sorter: false,
        render(...params: [string, SupplierContact, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.supplierContacts.email"),
        key: "email",
        dataIndex: "email",
        sorter: false,
        render(...params: [string, SupplierContact, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.supplierContacts.isDefault"),
        key: "isDefault",
        dataIndex: "isDefault",
        sorter: false,
        width: 150,
        render(...params: [boolean, SupplierContact, number]) {
          return (
            <LayoutCell>
              <img
                src={params[0] ? ActiveSvg : DenySvg}
                alt=""
                width={20}
                height={20}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.supplierContacts.isCreateAccount"),
        key: "isCreateAccount",
        dataIndex: "isCreateAccount",
        sorter: false,
        width: 200,
        render(...params: [boolean, SupplierContact, number]) {
          return (
            <LayoutCell>
              <img
                src={params[0] ? ActiveSvg : DenySvg}
                alt=""
                width={20}
                height={20}
              />
            </LayoutCell>
          );
        },
      },
      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: 80,
        align: "center",
        render(...params: [boolean, SupplierContact, number]) {
          return (
            <LayoutCell>
              <div
                className="payment-red cursor-pointer btn m-l--xs"
                onClick={() => handleEditContact(params[1], params[2])}
              >
                <img
                  src={IcPencilSvg}
                  alt="edit"
                  width={20}
                  height={20}
                  className="m-r--sm"
                />
              </div>
              <div className="payment-trash_icon cursor-pointer btn">
                <TrashCan
                  size={20}
                  onClick={() => handleDeleteContact(params[2])}
                />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [handleDeleteContact, handleEditContact, translate]
  );

  const paymentContents = React.useMemo(() => {
    return model?.supplierPayments ? model?.supplierPayments : [];
  }, [model?.supplierPayments]);

  const setPaymentContents = React.useCallback(
    (values: SupplierPayment[]) => {
      handleChangeAllField({ ...model, supplierPayments: values });
    },
    [handleChangeAllField, model]
  );

  const handleDeletePayment = React.useCallback(
    (index: number) => {
      const newPayments = [...paymentContents];
      newPayments.splice(index, 1);
      setPaymentContents(newPayments);
    },
    [paymentContents, setPaymentContents]
  );

  const [targetPaymentIndex, setTargetPaymentIndex] =
    React.useState<number>(undefined);

  const [targetPayment, setTargetPayment] = React.useState<SupplierPayment>(
    new SupplierPayment()
  );

  const handleSavePayment = React.useCallback(
    (contact: SupplierPayment, index: number) => {
      const newPayments = [...contactContents];
      newPayments[index] = contact;
      setPaymentContents(newPayments);
    },
    [contactContents, setPaymentContents]
  );

  const handleChangeSimpleFieldPayment = React.useCallback(
    (fieldName: keyof SupplierPayment) => (value: string | boolean) => {
      if (fieldName === "isIsDomestic") {
        setTargetPayment({
          ...new SupplierPayment(),
          id: targetPayment?.id,
          isActive: targetPayment?.isActive,
          [fieldName]: value,
        });
      } else {
        setTargetPayment({
          ...targetPayment,
          [fieldName]: value,
          errors: {
            ...targetPayment?.errors,
            [fieldName]: null,
          },
        });
      }
    },
    [targetPayment]
  );

  const [visiblePaymentModal, setVisiblePaymentModal] =
    React.useState<boolean>(false);

  const handleEditPayment = React.useCallback(
    (payment: SupplierPayment, index: number) => {
      setTargetPaymentIndex(index);
      setTargetPayment(payment);
      setVisiblePaymentModal(true);
    },
    []
  );

  const handleAddPayment = React.useCallback(() => {
    setTargetPaymentIndex(undefined);
    setTargetPayment({
      ...new SupplierPayment(),
      isActive: true,
      isIsDomestic: true,
    });
    setVisiblePaymentModal(true);
  }, []);

  const handleSavePaymentModal = React.useCallback(
    (payment: SupplierPayment) => {
      const { validatedContent, canUpdate } = handleValidateContent(
        payment,
        payment?.isIsDomestic
          ? DOMESTIC_PAYMENT_REQUIRE_FIELD
          : NON_DOMESTIC_PAYMENT_REQUIRE_FIELD
      );
      if (canUpdate) {
        if (targetPaymentIndex !== undefined) {
          handleSavePayment(payment, targetPaymentIndex);
        } else {
          setPaymentContents([
            ...paymentContents,
            { ...payment, id: uuidv4() },
          ]);
        }
        setVisiblePaymentModal(false);
      } else {
        setTargetPayment(validatedContent as SupplierPayment);
      }
    },
    [
      handleValidateContent,
      targetPaymentIndex,
      handleSavePayment,
      setPaymentContents,
      paymentContents,
    ]
  );

  const handleCancelPaymentModal = React.useCallback(() => {
    setVisiblePaymentModal(false);
    setTargetPayment(new SupplierPayment());
    setTargetPaymentIndex(undefined);
  }, []);

  const paymentContentColumns: ColumnProps<SupplierPayment>[] = React.useMemo(
    () => [
      {
        title: translate("SL.supplierPayments.bank"),
        key: "bank",
        dataIndex: "bank",
        sorter: false,
        render(...params: [string, SupplierPayment, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  params[1]?.isIsDomestic
                    ? params[1]?.bank?.name
                    : params[1]?.bankForeignName
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      // {
      //   title: translate("SL.supplierPayments.branchName"),
      //   key: "branchName",
      //   dataIndex: "branchName",
      //   sorter: false,
      //   render(...params: [string, SupplierPayment, number]) {
      //     return (
      //       <LayoutCell>
      //         <OneLineText value={params[0]} useTooltip />
      //       </LayoutCell>
      //     );
      //   },
      // },
      {
        title: translate("SL.supplierPayments.bankAccountNo"),
        key: "bankAccountNo",
        dataIndex: "bankAccountNo",
        sorter: false,
        render(...params: [string, SupplierPayment, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("SL.supplierPayments.bankAccountName"),
        key: "bankAccountName",
        dataIndex: "bankAccountName",
        sorter: false,
        render(...params: [string, SupplierPayment, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.txt_status"),
        key: "isActive",
        dataIndex: "isActive",
        render(status: boolean) {
          const value = getStatus(status);
          return (
            <LayoutCell>
              <Tag
                size="md"
                value={translate(value.keyI18n)}
                status={value.type}
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
        fixed: "right",
        width: 80,
        align: "center",
        render(...params: [boolean, SupplierPayment, number]) {
          return (
            <LayoutCell>
              <div
                className="payment-red cursor-pointer btn m-l--xs"
                onClick={() => handleEditPayment(params[1], params[2])}
              >
                <img
                  src={IcPencilSvg}
                  alt="edit"
                  width={20}
                  height={20}
                  className="m-r--sm"
                />
              </div>
              <div className="payment-trash_icon cursor-pointer btn">
                <TrashCan
                  size={20}
                  onClick={() => handleDeletePayment(params[2])}
                />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [handleDeletePayment, handleEditPayment, translate]
  );

  return {
    model,
    isDetail,
    loading,
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeMultipleSelectField,
    handleChangeDateField,
    handleChangeTreeField,
    handleSave,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
    //for contact contents
    contactContents,
    visibleContactModal,
    targetContact,
    handleChangeSimpleFieldContact,
    handleAddContact,
    handleSaveContactModal,
    handleCancelContactModal,
    contactContentColumns,
    //for payment contents
    paymentContents,
    visiblePaymentModal,
    targetPayment,
    setTargetPayment,
    handleChangeSimpleFieldPayment,
    handleAddPayment,
    handleSavePaymentModal,
    handleCancelPaymentModal,
    paymentContentColumns,
    //non context
    modal,
    isApprove,
    existMessage,
    handleActionSupplierApproval,
    handleCloseModal,
    handleApprove,
    handleReject,
  };
};
