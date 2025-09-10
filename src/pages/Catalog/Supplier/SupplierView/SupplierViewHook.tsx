/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnProps } from "antd/lib/table";
import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DenySvg from "assets/icons/CostLine/ic_deny.svg";
import type { AxiosResponse } from "axios";
import { getStatus } from "core/helpers/status";
import { detailService } from "core/services/page-services/detail-service";
import saveAs from "file-saver";
import { SupplierPayment } from "models/ContractAnnex";
import { SupplierContact } from "models/PurchasingPlan";
import { Supplier } from "models/Supplier/Supplier";
import React, { createContext } from "react";
import { LayoutCell, OneLineText, Tag } from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import supplierRepository from "../SupplierRepository";

export interface SupplierView {
  model: Supplier;
  contactContents?: SupplierContact[];
  contactContentColumns?: ColumnProps<SupplierContact>[];
  paymentContents?: SupplierPayment[];
  paymentContentColumns?: ColumnProps<SupplierPayment>[];
  handleDownloadFileAttached?: (file?: FileModel) => void;
}

export const SupplierViewContext = createContext<SupplierView>({
  model: new Supplier(),
});

export const useSupplierViewHooks = () => {
  const [translate] = useTranslation();
  const { model, dispatch: dispatchModel } = detailService.useModel<Supplier>(
    Supplier,
    {
      ...new Supplier(),
      isActive: true,
    }
  );

  const { isDetail } = detailService.useGetIsDetail(
    supplierRepository.getDetail,
    dispatchModel
  );

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

  const contactContents = React.useMemo(() => {
    return model?.supplierContacts ? model?.supplierContacts : [];
  }, [model?.supplierContacts]);

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
    ],
    [translate]
  );

  const paymentContents = React.useMemo(() => {
    return model?.supplierPayments ? model?.supplierPayments : [];
  }, [model?.supplierPayments]);

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
    ],
    [translate]
  );

  return {
    model,
    isDetail,
    handleDownloadFileAttached,
    contactContents,
    contactContentColumns,
    paymentContents,
    paymentContentColumns,
  };
};
