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
import { PurchasingPlanDetailHookContext } from "../../../PurchasingPlanDetailHook";
import { TrashCan } from "@carbon/icons-react";
import { DeleteRoundIcon, emptyIcon } from "assets/icons";
import { DESCRIPTION_REGEX, EMAIL_REGEX } from "core/config/consts";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";

const SupplierInformationTableDrawer = () => {
  const { translate, model, handleChangeSingleField, dispatchModel } =
    useContext<PurchasingPlanModel>(PurchasingPlanDetailHookContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
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
    if (model.listEmailReceiverInformation) {
      emailReceiverInformationData = [
        ...model.listEmailReceiverInformation,
        newEmailReceiverInformationData,
      ];
    } else {
      emailReceiverInformationData = [newEmailReceiverInformationData];
    }
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        listEmailReceiverInformation: emailReceiverInformationData,
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
    const emailReceiverInformation = model.listEmailReceiverInformation?.map(
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
      fieldName: "listEmailReceiverInformation",
      errorName: fieldNameError,
    })(emailReceiverInformation);
  };

  const handleDeleteRowConfirm = (id: string, index: number) => {
    setIdDelete(id);
    setIndexRow(index);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const emailReceiverInformation = model.listEmailReceiverInformation?.filter(
      (item: EmailReceiverInformation) => item.id !== idDelete
    );

    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        listEmailReceiverInformation: emailReceiverInformation,
        errors: {
          ...model.errors,
          [`listEmailReceiverInformation[${indexRow}].email`]: null,
        },
      },
    });
    const ids = selectedRowKeys.filter((id) => id !== idDelete);
    setSelectedRowKeys(ids);
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleBulkDeleteRow = () => {
    const emailReceiverInformation = model.listEmailReceiverInformation?.filter(
      (item: EmailReceiverInformation) => !selectedRowKeys.includes(item.id)
    );
    const errors = model.listEmailReceiverInformation?.reduce(
      (
        acc: { [key: string]: null },
        item: EmailReceiverInformation,
        index: number
      ) => {
        if (selectedRowKeys.includes(item.id)) {
          acc[`listEmailReceiverInformation[${index}].email`] = null;
        }
        return acc;
      },
      {}
    );

    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        listEmailReceiverInformation: emailReceiverInformation,
        errors: {
          ...model.errors,
          ...errors,
        },
      },
    });
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
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
        render: (_text_, record, index) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `listEmailReceiverInformation[${index}].email`
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
                      `listEmailReceiverInformation[${index}].email`
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
        render: (_text_, record, index) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `listEmailReceiverInformation[${index}].name`
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
                      `listEmailReceiverInformation[${index}].name`
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
      {model.listEmailReceiverInformation?.length > 0 && (
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
          onClick={() => setOpenModalConfirmDeleteAll(true)}
        >
          {translate("CL.delete_btn")}
        </Button>
      </ActionBarComponent>
      {model.listEmailReceiverInformation?.length === 0 ? (
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
          dataSource={model.listEmailReceiverInformation}
          isDragable={true}
          rowSelection={rowSelection}
          idContainer="table-id"
          scroll={{ y: 400 }}
        />
      )}

      <ModalConfirm
        wrapClassName="payment-wrap-modal"
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
        wrapClassName="payment-wrap-modal"
        open={openModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PL.purchasing_plan_title_delete_drawer")}
        content={translate("PL.purchasing_plan_content_delete_drawer")}
        titleButtonCancel={translate("PL.cancel_btn_label")}
        titleButtonApply={translate("PL.confirm_btn_label")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default SupplierInformationTableDrawer;
