import React, { useCallback, useMemo } from "react";
import { ColumnProps } from "antd/lib/table";

import { TrashRoundIcon } from "assets/icons";
import { TABLE_ROW_KEY } from "core/config/consts";
import { SupplierModel } from "models/PurchasingPlan";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import ModalBidderInformation from "../ModalBidderInformation/ModalBidderInformation";
import { useBidderInformationTableHook } from "./BidderInformationTableHook";
import { BidderInformationProps } from "../../BidderInformation";

import { useAppSelector } from "rtk/useRedux";
import {
  ColumnKey,
  PersonInChargeModel,
} from "models/PurchasingPlan/PurchasingPlanBidder";

const columnsWidth = {
  name: 220,
  taxCode: 140,
  address: 245,
  personInCharge: 200,
  email: 160,
  phone: 160,
  role: 160,
};

const BidderInformationTable = (props: BidderInformationProps) => {
  const { isDetail, contextValue, titleModal, titleNameProperty } = props;

  const { translate, model, handleChangeSingleField } = contextValue;

  const {
    isOpenConfirmDeleteModal,
    selectedRowKeys,
    openModalBidder,
    setOpenModalBidder,
    setIsOpenConfirmDeleteModal,
    setSelectedRowKeys,
    handleDeletePrincipleContracts,
    handleCloseDeleteModal,
  } = useBidderInformationTableHook(contextValue);

  const profile = useAppSelector((state) => state.profile);

  const dataBidderInformation = useMemo(() => {
    if (model?.organizationGeneral && model?.userOrganization) {
      return [
        {
          ...model.userOrganization?.[0],
          organizationGeneral: [
            {
              name: model.organizationGeneral?.personInChargeInfos?.[0]?.pic
                ?.name,
              email: model.organizationGeneral?.personInChargeInfos?.[0]?.email,
              phoneNumber:
                model.organizationGeneral?.personInChargeInfos?.[0]
                  ?.phoneNumber,
              role: model.organizationGeneral?.personInChargeInfos?.[0]?.role,
            },
          ],
        },
      ];
    }
    return [
      {
        ...profile.organization,
        organizationGeneral: model?.organizationGeneral,
      },
    ];
  }, [model.organizationGeneral, model.userOrganization, profile.organization]);

  const handleCancelModal = useCallback(() => {
    setOpenModalBidder(false);
  }, [setOpenModalBidder]);

  const handleApplyPersonInCharge = useCallback(
    (data: PersonInChargeModel) => {
      handleChangeSingleField({
        fieldName: ColumnKey.ORGANIZATION_GENERAL,
      })({
        personInChargeInfos: data,
      });
      handleCancelModal();
    },
    [handleCancelModal, handleChangeSingleField]
  );

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(
    () => [
      {
        title: titleNameProperty || translate("PL.bidding.title.name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render: (value) => {
          return (
            <LayoutCell>
              <div
                className="hyperlink text-ellipsis"
                onClick={() => setOpenModalBidder(true)}
              >
                {value}
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_supplier_tax_code"),
        key: ColumnKey.TAX_CODE,
        dataIndex: ColumnKey.TAX_CODE,
        ellipsis: true,
        width: columnsWidth.taxCode,
        render: (value) => {
          return (
            <LayoutCell>
              <div className="text-ellipsis">
                <OneLineText value={value} />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_supplier_address"),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        width: columnsWidth.address,
        ellipsis: true,
        render: (value) => {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.bidding.title.person_in_charge"),
        width: columnsWidth.personInCharge,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.organizationGeneral?.[0]?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.drawer_email"),
        width: columnsWidth.email,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.organizationGeneral?.[0]?.email} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.phone_number"),
        width: columnsWidth.phone,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText
                value={record?.organizationGeneral?.[0]?.phoneNumber}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PM.role"),
        width: columnsWidth.role,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.organizationGeneral?.[0]?.role} />
            </LayoutCell>
          );
        },
      },
    ],
    [setOpenModalBidder, titleNameProperty, translate]
  );

  return (
    <div className={"supplier-information-table"}>
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => setIsOpenConfirmDeleteModal(true)}
        >
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>
      <StandardTable
        isDragable={true}
        loading={false}
        rowKey={TABLE_ROW_KEY}
        columns={columns}
        dataSource={dataBidderInformation}
        scroll={{ y: "calc(100vh - 320px)" }}
      />

      <ModalConfirm
        open={isOpenConfirmDeleteModal}
        loading={false}
        maskClosable={false}
        icon={<img src={TrashRoundIcon} alt="Trash icon" />}
        title={translate("PL.confirm_delete_principle_contract")}
        content={translate("PL.warning_delete_principle_contract")}
        titleButtonApply={translate("CM.btn_confirm")}
        titleButtonCancel={translate("CM.btn_close")}
        handleSave={handleDeletePrincipleContracts}
        handleCancel={handleCloseDeleteModal}
      />

      <ModalBidderInformation
        open={openModalBidder}
        handleCancelModal={handleCancelModal}
        handleApplyPersonInCharge={handleApplyPersonInCharge}
        contextValue={contextValue}
        isDetail={isDetail}
        title={titleModal}
        {...props}
      />
    </div>
  );
};

export default BidderInformationTable;
