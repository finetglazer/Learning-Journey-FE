import { useMemo } from "react";
import { Switch } from "antd";
import {
  Button,
  FormItem,
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { ColumnProps } from "antd/lib/table";
import { useDebounceFn } from "ahooks";

import { utilService } from "core/services/common-services/util-service";
import { useCentralPurchaseUnitDetailHook } from "./CentralPurchaseUnitDetailHook";

import {
  DEBOUNCE_TIME_300,
  numberConstants,
  TABLE_ROW_KEY,
  WIDTH_400,
  WIDTH_800,
} from "core/config/consts";
import CommonFilter from "models/CommonFilter";
import centralPurchaseUnitRepository from "../CentralPurchaseUnitRepository";
import { FilterActionEnum } from "core/services/service-types";
import { EmptyData } from "components";
import { Contact } from "models/CentralPurchaseUnit";

import {
  EmptyContactPerson,
  IcPlusSVG,
  IcSearchSVG,
  TrashIcon,
} from "assets/icons";
import styles from "./CentralPurchaseUnitDetail.module.scss";

export interface CentralPurchaseUnitDetailProps {
  centralPurchaseUnitId?: string;
  dismiss: (shouldReloadList?: boolean) => void;
}

const ICON_SIZE = 16;

enum ColumnKey {
  NAME = "name",
  PHONE_NUMBER = "phoneNumber",
  EMAIL = "email",
}

const columnsWidth = {
  name: 200,
  phoneNumber: 140,
  overflowMenu: 40,
};

export const CentralPurchaseUnitDetail = ({
  centralPurchaseUnitId,
  dismiss,
}: CentralPurchaseUnitDetailProps) => {
  const {
    translate,
    contactPersonList,
    loading,
    loadingContactPerson,
    model,
    modelFilter,
    rowSelection,
    isOpenSearchContact,
    dispatchFilter,
    handleLoadList,
    handleChangeSingleField,
    handleChangeSelectField,
    onSave,
    handleOpenUserModal,
    handleSaveUserModal,
    handleCloseUserModal,
    handleDeleteContent,
    informationReceiversHDs,
    informationReceiverPAMSs,
  } = useCentralPurchaseUnitDetailHook(dismiss, centralPurchaseUnitId);

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: search,
          pageIndex: numberConstants.ONE,
        },
      });
      handleLoadList({ search: search, pageIndex: numberConstants.ONE });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  const selectingContactPersonColumnsColumns: ColumnProps<Contact>[] = useMemo(
    () => [
      {
        title: translate("CPU.txt_central_purchase_unit_contact_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render(_, contact: Contact) {
          return (
            <LayoutCell>
              <div className={styles["name-cell"]}>
                <OneLineText value={contact?.name} />
                {contact?.userName && (
                  <OneLineText
                    className={styles["name-cell-account-text"]}
                    value={contact?.userName}
                  />
                )}
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPU.txt_central_purchase_unit_phone_number"),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        ellipsis: true,
        width: columnsWidth.phoneNumber,
        render(phoneNumber: string) {
          return (
            <LayoutCell>
              <OneLineText value={phoneNumber} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPU.txt_central_purchase_unit_email"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        ellipsis: true,
        render(email: string) {
          return (
            <LayoutCell>
              <OneLineText className={styles["email-cell"]} value={email} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const selectedContractPersonColumns: ColumnProps<Contact>[] = useMemo(
    () => [
      ...selectingContactPersonColumnsColumns,
      {
        title: "",
        width: columnsWidth.overflowMenu,
        render(_, contact: Contact) {
          return (
            <LayoutCell>
              <button
                className={styles["delete-selected-contact-person"]}
                onClick={() => handleDeleteContent("HDReceiver", contact?.id)}
              >
                <TrashIcon fillColor="#C03629" />
              </button>
            </LayoutCell>
          );
        },
      },
    ],
    [handleDeleteContent, selectingContactPersonColumnsColumns]
  );

  const selectedPAMSPersonColumns: ColumnProps<Contact>[] = useMemo(
    () => [
      ...selectingContactPersonColumnsColumns,
      {
        title: "",
        width: columnsWidth.overflowMenu,
        render(_, contact: Contact) {
          return (
            <LayoutCell>
              <button
                className={styles["delete-selected-contact-person"]}
                onClick={() => handleDeleteContent("PAMSReceiver", contact?.id)}
              >
                <TrashIcon fillColor="#C03629" />
              </button>
            </LayoutCell>
          );
        },
      },
    ],
    [handleDeleteContent, selectingContactPersonColumnsColumns]
  );

  const StatusView = () => {
    return (
      <div className={styles["status-wrapper"]}>
        <span className="status-style">
          {translate("CPU.txt_central_purchase_unit")}
        </span>
        <div className="d-flex gap-2">
          <Switch
            className="switch__custom"
            value={model.isActive}
            onChange={(checked) => {
              handleChangeSingleField({
                fieldName: "isActive",
              })(checked);
            }}
          />
          <span className="active-style">
            {translate("CM.txt_status_active")}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        open
        maskClosable={false}
        loading={loading}
        isShowIconBack={false}
        size={WIDTH_800}
        title={
          model?.id
            ? translate("CPU.txt_edit_central_purchase_unit")
            : translate("CPU.txt_create_central_purchase_unit")
        }
        titleButtonApply={translate("CM.txt_save")}
        titleButtonCancel={translate("CM.btn_close")}
        handleSave={onSave}
        handleCancel={dismiss}
      >
        <div className={styles["wrapper"]}>
          <div className="d-flex size-full flex-column gap-3">
            {/* Status */}
            <FormItem
              validateObject={utilService.getValidateObj(model, "isActive")}
            >
              <StatusView />
            </FormItem>
            <div className="d-flex">
              {/* Code */}
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "organizationId"
                )}
              >
                <Select
                  isRequired
                  value={model?.organization}
                  label={translate("CPU.organization")}
                  placeHolder={translate("CPU.placeholder.organization")}
                  getList={centralPurchaseUnitRepository.getListOrganization}
                  classFilter={CommonFilter}
                  isSmall={false}
                  isSearch
                  render={(item) =>
                    item ? `${item?.code} - ${item?.name}` : ""
                  }
                  searchProperty="name"
                  appendToBody
                  isEnumerable={false}
                  onChange={handleChangeSelectField({
                    fieldName: "organization",
                  })}
                />
              </FormItem>
            </div>
          </div>

          <div className={styles["add-contact-person"]}>
            <span className={styles["add-contact-person__heading"]}>
              {translate("CPU.informationReceiversHD")}
              <span className={styles["required"]}>&nbsp;*</span>
            </span>

            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "informationReceiverHDIds"
              )}
            >
              <></>
            </FormItem>
            {informationReceiversHDs?.length > 0 ? (
              <div className={styles["contact-list-section"]}>
                <Button
                  iconPlace="left"
                  icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                  type="secondary"
                  size="lg"
                  onClick={() => handleOpenUserModal("HDReceiver")}
                >
                  {translate("CPU.txt_add_contact_person")}
                </Button>
                <StandardTable
                  rowKey={TABLE_ROW_KEY}
                  isDragable
                  columns={selectedContractPersonColumns}
                  dataSource={informationReceiversHDs}
                  locale={{
                    emptyText: (
                      <EmptyData
                        message={translate("CM.txt_search_no_data")}
                        height={WIDTH_400}
                      />
                    ),
                  }}
                />
              </div>
            ) : (
              <div className={styles["empty-contact-person"]}>
                <div className={styles["empty-contact-person__wrapper"]}>
                  <img
                    src={EmptyContactPerson}
                    alt="empty icon"
                    width={140}
                    height={150}
                  />
                  <div className={styles["empty-contact-person__container"]}>
                    <span className={styles["no-contact-person-text"]}>
                      {translate("CPU.txt_has_no_contact_person")}
                    </span>
                    <Button
                      iconPlace="left"
                      icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                      type="secondary"
                      size="lg"
                      onClick={() => handleOpenUserModal("HDReceiver")}
                    >
                      {translate("CPU.txt_add_contact_person")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles["add-contact-person"]}>
            <span className={styles["add-contact-person__heading"]}>
              {translate("CPU.informationReceiversPAMS")}
              <span className={styles["required"]}>&nbsp;*</span>
            </span>

            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "informationReceiverPAMSIds"
              )}
            >
              <></>
            </FormItem>
            {informationReceiverPAMSs?.length > 0 ? (
              <div className={styles["contact-list-section"]}>
                <Button
                  iconPlace="left"
                  icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                  type="secondary"
                  size="lg"
                  onClick={() => handleOpenUserModal("PAMSReceiver")}
                >
                  {translate("CPU.txt_add_contact_person")}
                </Button>
                <StandardTable
                  rowKey={TABLE_ROW_KEY}
                  isDragable
                  columns={selectedPAMSPersonColumns}
                  dataSource={informationReceiverPAMSs}
                  locale={{
                    emptyText: (
                      <EmptyData
                        message={translate("CM.txt_search_no_data")}
                        height={WIDTH_400}
                      />
                    ),
                  }}
                />
              </div>
            ) : (
              <div className={styles["empty-contact-person"]}>
                <div className={styles["empty-contact-person__wrapper"]}>
                  <img
                    src={EmptyContactPerson}
                    alt="empty icon"
                    width={140}
                    height={150}
                  />
                  <div className={styles["empty-contact-person__container"]}>
                    <span className={styles["no-contact-person-text"]}>
                      {translate("CPU.txt_has_no_contact_person")}
                    </span>
                    <Button
                      iconPlace="left"
                      icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                      type="secondary"
                      size="lg"
                      onClick={() => handleOpenUserModal("PAMSReceiver")}
                    >
                      {translate("CPU.txt_add_contact_person")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        wrapClassName={styles["add-contact-person-modal"]}
        zIndex={9999}
        open={isOpenSearchContact}
        maskClosable={false}
        isShowIconBack={false}
        size={WIDTH_800}
        title={translate("CPU.txt_select_contact_person")}
        titleButtonApply={translate("CM.txt_save")}
        titleButtonCancel={translate("CM.btn_close")}
        handleSave={handleSaveUserModal}
        handleCancel={handleCloseUserModal}
      >
        <div className={styles["select-contact-person-wrapper"]}>
          <InputText
            prefix={<img src={IcSearchSVG} alt="search" width={ICON_SIZE} />}
            value={modelFilter?.search}
            placeHolder={translate("CPU.placeholder_search_contact_person")}
            onChange={run}
            type={numberConstants.ONE}
            isSmall={false}
          />
          <StandardTable
            rowKey={TABLE_ROW_KEY}
            isDragable
            loading={loadingContactPerson}
            columns={selectingContactPersonColumnsColumns}
            dataSource={contactPersonList}
            rowSelection={rowSelection}
            //scroll={{ y: "calc(100vh - 770px)" }}
            locale={{
              emptyText: (
                <div
                  className={styles["select-contact-person-modal__empty-data"]}
                >
                  {translate("CM.txt_search_no_data")}
                </div>
              ),
            }}
          />
        </div>
      </Modal>
    </>
  );
};
