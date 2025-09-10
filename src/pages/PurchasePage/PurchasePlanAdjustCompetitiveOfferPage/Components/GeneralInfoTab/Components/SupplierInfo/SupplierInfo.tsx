import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
} from "react-components-design-system";

import { SupplierGenerals } from "models/PurchasingPlan";
import ModalListSuppliers from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/GenerationInfoTab/Components/SupplierInformation/Components/ModalListSuppliers/ModalListSuppliers";
import { useSupplierInfoHook } from "./SupplierInfoHook";

import { TableColumnsType } from "antd/lib";
import { AddIcon, TrashIcon } from "assets/icons";
import classNames from "classnames";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { isNull } from "lodash";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";
import ViewSupplierInformationDrawer from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/GenerationInfoTab/Components/SupplierInformation/Components/ViewSupplierInformationDrawer/ViewSupplierInformationDrawer";
import { useTranslation } from "react-i18next";
import styles from "./SupplierInfo.module.scss";
import { FC, useMemo } from "react";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";

export interface IProps {
  contextValue:
    | PurchasePlanAdjustCompetitiveOfferDetailHookContextProps
    | PurchasePlanAdjustBidDetailHookContextProps;
  isDetail: boolean;
  isNegotiating?: boolean;
}

const SupplierInfo: FC<IProps> = (props: IProps) => {
  const { contextValue, isDetail = false, isNegotiating = false } = props;
  const [translate] = useTranslation();
  const {
    model,
    isOpenConfirmDeleteModal,
    rowSelection,
    selectedRowKeys,
    openModalListSuppliers,
    selectedSupplier,
    setSelectedSupplier,
    setSelectedRowKeys,
    setIsOpenConfirmDeleteModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteSuppliers,
    handleOpenModalListSuppliers,
    handleCloseModalListSuppliers,
    handleSelectSuppliers,
    handleCloseSupplierInfoModal,
    handleUpdateSupplierInfo,
    handleUpdateSupplierInfoSelected,
  } = useSupplierInfoHook({
    contextValue,
    isDetail: false,
  });

  const canEdit = isDetail;

  const columns: TableColumnsType<SupplierGenerals> = [
    {
      title: translate("PL.purchasing_plan_supplier_tab"),
      key: "name",
      dataIndex: "name",
      ellipsis: true,
      render: (value: string, record) => {
        return (
          <LayoutCell>
            <div
              className={classNames("text-ellipsis", styles["button"])}
              onClick={() => {
                setSelectedSupplier({
                  ...record,
                  supplierContactSelected: record.supplierContacts.find(
                    (el) => el.id === record.quoteId
                  ),
                });
              }}
            >
              <OneLineText
                className="text-table-content-primary"
                value={value}
              />
            </div>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.purchasing_plan_supplier_tax_code"),
      key: "taxCode",
      dataIndex: "taxCode",
      width: 180,
      render: (value: string) => {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.purchasing_plan_supplier_address"),
      key: "address",
      dataIndex: "address",
      render: (value) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate(
        "PL.purchasing_plan_supplier_name_of_the_person_quoting_the_price"
      ),
      key: "quoteName",
      dataIndex: "quoteName",
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate(
        "PL.purchasing_plan_supplier_email_of_the_person_quoting_the_price"
      ),
      key: "quoteEmail",
      dataIndex: "quoteEmail",
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate("PL.drawer_phone_number_supplier"),
      key: "phoneNumber",
      dataIndex: "phoneNumber",
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      key: "id",
      width: 40,
      fixed: "right",
      render(record) {
        return (
          <LayoutCell>
            <button
              className={styles["delete-row-btn"]}
              onClick={() => handleOpenDeleteModal(record?.id)}
            >
              <TrashIcon fillColor="#C03629" />
            </button>
          </LayoutCell>
        );
      },
      hidden: !canEdit,
    },
  ];

  const dataSource = useMemo(
    () => model?.supplierPurchasePlans,
    [model?.supplierPurchasePlans]
  );

  const renderButtonAddSupplier = () => {
    return (
      <Button
        icon={<img src={AddIcon} alt="img" width={14} height={14} />}
        iconPlace="left"
        type="secondary"
        className="w-fit"
        onClick={handleOpenModalListSuppliers}
        disabled={!canEdit}
      >
        {translate("PPA.add_supplier")}
      </Button>
    );
  };

  return (
    <>
      <div className={styles["supplier-information-table"]}>
        <TableWithEmpty
          list={dataSource}
          columns={columns}
          actionBarComponent={
            canEdit && (
              <>
                {renderButtonAddSupplier()}
                <div className="mt-2">
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
                </div>
              </>
            )
          }
          emptyExtra={
            <CloudyEmpty content={translate("CA.msg_empty_data_in_system")}>
              {renderButtonAddSupplier()}
            </CloudyEmpty>
          }
          rowSelection={canEdit ? rowSelection : undefined}
          modelValidate={model}
          fieldValidate="supplierPurchasePlans"
        />
      </div>

      <DeleteRecordModal
        title={translate("PL.modal_delete_supplier_competitive_offer.title")}
        content={translate(
          "PL.modal_delete_supplier_competitive_offer.content_other"
        )}
        handleConfirm={handleDeleteSuppliers}
        handleCancel={handleCloseDeleteModal}
        open={isOpenConfirmDeleteModal}
      />
      <ModalListSuppliers
        handleCancelModalSupplier={handleCloseModalListSuppliers}
        handleApplySupplier={handleSelectSuppliers}
        supplierGenerals={dataSource}
        open={openModalListSuppliers}
        contextValue={contextValue}
        isNegotiating={isNegotiating}
      />
      {!isNull(selectedSupplier) && (
        <ViewSupplierInformationDrawer
          modelValidate={model}
          fieldValidate={`supplierPurchasePlans[${dataSource?.findIndex(
            (el) => el?.id === selectedSupplier?.id
          )}].quoteEmail`}
          selectedSupplier={selectedSupplier}
          onCancel={handleCloseSupplierInfoModal}
          onSave={handleUpdateSupplierInfo}
          onChangeData={handleUpdateSupplierInfoSelected}
          isDetail={!canEdit}
        />
      )}
    </>
  );
};

export default SupplierInfo;
