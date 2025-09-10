import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import add from "assets/icons/add.svg";
import classNames from "classnames";
import { utilService } from "core/services/common-services/util-service";
import { FieldValue, GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import {
  EmailReceiverInformation,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import React, { Key, useContext, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputText,
  LayoutCell,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";
import { TrashCan } from "@carbon/icons-react";
import { DeleteRoundIcon, emptyIcon } from "assets/icons";
import { DESCRIPTION_REGEX, EMAIL_REGEX } from "core/config/consts";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import "./SupplierInformationTableDrawer.scss";
import { PurchasingPlanPrincipleDetailHookContext } from "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";

const SupplierInformationTableDrawer = () => {
  const { translate, model, handleChangeSingleField, dispatchModel } =
    useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [isOpenModalConfirmDeleteAll, setIsOpenModalConfirmDeleteAll] =
    useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [indexRow, setIndexRow] = useState<number>();

  const typeRowSelection: RowSelectionType = "checkbox";
  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys.filter(Boolean));
    },
    selectedRowKeys,
    type: typeRowSelection,
    renderCell: (value: boolean, record: EmailReceiverInformation) => {
      return (
        <div className="d-flex justify-content-center align-items-center payment-height_40">
          <Checkbox
            checked={value}
            onChange={(e) => {
              if (e) {
                setSelectedRowKeys([...selectedRowKeys, record.id]);
              } else {
                setSelectedRowKeys(
                  selectedRowKeys.filter((key) => key !== record.id)
                );
              }
            }}
          />
        </div>
      );
    },
  };

  const handleAddRow = () => {
    const newEmailReceiverInformationData: EmailReceiverInformation = {
      id: dayjs().valueOf().toString(),
    };
    let emailReceiverInformationData = [];
    if (model.emailRecipients) {
      emailReceiverInformationData = [
        ...model.emailRecipients,
        newEmailReceiverInformationData,
      ];
    } else {
      emailReceiverInformationData = [newEmailReceiverInformationData];
    }
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        emailRecipients: emailReceiverInformationData,
      },
    });
  };

  const handleChangeItemTable = (
    fieldName: string,
    value: FieldValue,
    objectValue: FieldValue,
    id: string,
    fieldNameError: string
  ) => {
    const emailReceiverInformation = model.emailRecipients?.map(
      (item: EmailReceiverInformation) => {
        if (item.id === id) {
          return {
            ...item,
            [fieldName]: objectValue || value,
          };
        }
        return item;
      }
    );

    handleChangeSingleField({
      fieldName: "emailRecipients",
      errorName: fieldNameError,
    })(emailReceiverInformation);
  };

  const handleDeleteRowConfirm = (id: string, index: number) => {
    setIdDelete(id);
    setIndexRow(index);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const emailReceiverInformation = model.emailRecipients?.filter(
      (item: EmailReceiverInformation) => item.id !== idDelete
    );

    handleChangeSingleField({
      fieldName: "emailRecipients",
    })(emailReceiverInformation);
    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleBulkDeleteRow = () => {
    const emailReceiverInformation = model.emailRecipients?.filter(
      (item: EmailReceiverInformation) => !selectedRowKeys.includes(item.id)
    );

    handleChangeSingleField({
      fieldName: "emailRecipients",
    })(emailReceiverInformation);
    setSelectedRowKeys([]);
    setIsOpenModalConfirmDeleteAll(false);
  };

  const columns: ColumnProps<EmailReceiverInformation>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PL.purchasing_plan_email")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "email",
        dataIndex: "email",
        render: (_text_, record) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `emailRecipients[${record?.indexBeforeValidate}].email`
                )}
              >
                <InputText
                  isTableCell
                  isRequired
                  allowClear={true}
                  placeHolder={translate(
                    "PL.purchasing_plan_email_placeholder"
                  )}
                  value={record?.email}
                  onChange={(value: string) => {
                    handleChangeItemTable(
                      "email",
                      value,
                      null,
                      record.id,
                      `emailRecipients[${record?.indexBeforeValidate}].email`
                    );
                  }}
                  isByteCheck
                  maxLength={255}
                  regexInput={EMAIL_REGEX}
                  translate={translate}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PL.purchasing_plan_full_name")}
            </label>
          </div>
        ),
        key: "name",
        dataIndex: "name",
        render: (_text_, record) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `emailRecipients[${record?.indexBeforeValidate}].name`
                )}
              >
                <InputText
                  isTableCell
                  placeHolder={translate(
                    "PL.purchasing_plan_full_name_placeholder"
                  )}
                  value={record?.name}
                  onChange={(value: string) => {
                    handleChangeItemTable(
                      "name",
                      value,
                      null,
                      record.id,
                      `emailRecipients[${record?.indexBeforeValidate}].name`
                    );
                  }}
                  maxLength={255}
                  regexInput={DESCRIPTION_REGEX}
                  translate={translate}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: "action",
        dataIndex: "action",
        width: 40,
        render: (_, record, index) => {
          if (record?.isTotal) return null;
          return (
            <LayoutCell>
              <div className="payment-red cursor-pointer btn">
                <TrashCan
                  size={20}
                  onClick={() => handleDeleteRowConfirm(record.id, index)}
                />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [model, translate]
  );

  return (
    <div className="">
      {model.emailRecipients?.length > 0 && (
        <div className="m-b--2xs">
          <Button
            type={"secondary"}
            icon={<img src={add} alt="" width={12} height={12} />}
            iconPlace={"left"}
            onClick={handleAddRow}
          >
            {translate("PL.purchasing_plane_add_email_receiver")}
          </Button>
        </div>
      )}

      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => setIsOpenModalConfirmDeleteAll(true)}
        >
          {translate("CL.delete_btn")}
        </Button>
      </ActionBarComponent>
      {model.emailRecipients?.length === 0 ? (
        <EmptyInitializeTable
          textButton={translate("PL.purchasing_plane_add_email_receiver")}
          content={
            <div className="">
              {translate("PL.purchasing_plan_add_information_receiver_email")}
            </div>
          }
          icon={<img src={emptyIcon} alt="" />}
          onHandleClickAdd={handleAddRow}
        />
      ) : (
        <StandardTable
          rowKey={"id"}
          columns={columns}
          dataSource={model.emailRecipients}
          isDragable={true}
          rowSelection={rowSelection}
          idContainer="table-id"
          scroll={{ y: 400 }}
        />
      )}

      <ModalConfirm
        rootClassName="supplier-next-round-wrap-modal"
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PL.purchasing_plan_title_delete_drawer")}
        content={translate("PL.purchasing_plan_content_delete_drawer")}
        titleButtonCancel={translate("PL.cancel_btn_label")}
        titleButtonApply={translate("PL.confirm_btn_label")}
        handleSave={() => {
          handleDeleteRow();
        }}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />
      <ModalConfirm
        rootClassName="supplier-next-round-wrap-modal"
        open={isOpenModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PL.purchasing_plan_title_delete_drawer")}
        content={translate("PL.purchasing_plan_content_delete_drawer")}
        titleButtonCancel={translate("PL.cancel_btn_label")}
        titleButtonApply={translate("PL.confirm_btn_label")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setIsOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default SupplierInformationTableDrawer;
