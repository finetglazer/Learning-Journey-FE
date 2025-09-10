import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { emptyIcon } from "assets/icons";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import {
  DESCRIPTION_REGEX,
  EMAIL_REGEX,
  PHONE_NUMBER_REGEX,
} from "core/config/consts";
import { GeneralActionEnum } from "core/services/service-types";
import { isEmpty } from "lodash";
import {
  EmailReceiverInformation,
  PurchasingPlanModel,
  SupplierModel,
} from "models/PurchasingPlan";
import React, { useContext, useState } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { PurchasingPlanDetailHookContext } from "../../../PurchasingPlanDetailHook";
import ModalListSuppliers from "../ModalListSuppliers/ModalListSuppliers";
import SupplierInformationDrawer from "../SupplierInformationDrawer/SupplierInformationDrawer";
import "./SupplierInformationTable.scss";

const SupplierInformationTable = () => {
  const { translate, model, dispatchModel } = useContext<PurchasingPlanModel>(
    PurchasingPlanDetailHookContext
  );
  const [openModalSupplier, setOpenModalSupplier] = useState<boolean>(false);
  const [openDrawerSupplier, setOpenDrawerSupplier] = useState<boolean>(false);

  const handleOpenModalSupplier = () => {
    setOpenModalSupplier(true);
  };

  const handleCancelModalSupplier = () => {
    setOpenModalSupplier(false);
  };
  const handleApplySupplier = (dataSupplier: SupplierModel) => {
    const arraySupplier = [
      {
        id: dataSupplier?.id,
        taxCode: dataSupplier?.taxCode,
        name: dataSupplier?.name,
        code: dataSupplier?.code,
        address: dataSupplier?.address,
        type: dataSupplier?.type,
        isActive: dataSupplier?.isActive,
        quoteEmail: dataSupplier?.supplierContacts[0]?.email,
        quoteName: dataSupplier?.supplierContacts[0]?.name,
        phoneNumber: dataSupplier?.supplierContacts[0]?.phone,
        supplierContacts: dataSupplier?.supplierContacts,
      },
    ];
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        supplier: dataSupplier,
        phoneNumber: dataSupplier?.supplierContacts[0]?.phone,
        quoteEmail: dataSupplier?.supplierContacts[0]?.email,
        quoteName: dataSupplier?.supplierContacts[0]?.name,
        listSupplier: arraySupplier,
        supplierContacts: dataSupplier.supplierContacts,
      },
    });
    handleCancelModalSupplier();
  };

  const handleOpenDrawerSupplier = () => {
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        phoneNumber:
          model.listSupplier?.length > 0
            ? model.listSupplier[0]?.phoneNumber
            : model.supplier?.phone,
        quoteEmail:
          model.listSupplier?.length > 0
            ? model.listSupplier[0]?.quoteEmail
            : model.supplier?.email,
        quoteEmailId:
          model.listSupplier?.length > 0
            ? model.listSupplier[0]?.quoteEmailId
            : null,
        quoteName:
          model.listSupplier?.length > 0
            ? model.listSupplier[0]?.quoteName
            : model.supplier?.name,
        listEmailReceiverInformation:
          model.listSupplier[0]?.emailRecipients || [],
        errors: {
          phoneNumber: null,
          quoteEmail: null,
          quoteName: null,
          listEmailReceiverInformation: null,
        },
      },
    });
    setOpenDrawerSupplier(true);
  };

  const handleCloseDrawerSupplier = () => {
    setOpenDrawerSupplier(false);
  };

  const handleSaveDrawerSupplier = () => {
    const phoneNumberLength = 20;
    const errors: any = {};
    if (!model.quoteName) {
      errors["quoteName"] = translate("CM.input_require_validation");
    }
    if (!model.quoteEmail) {
      errors["quoteEmail"] = translate("CM.input_require_validation");
    }
    if (model.listEmailReceiverInformation?.length > 0) {
      model.listEmailReceiverInformation?.forEach(
        (item: EmailReceiverInformation, index: number) => {
          if (!item.email) {
            errors[`listEmailReceiverInformation[${index}].email`] = translate(
              "CM.input_require_validation"
            );
          } else if (!EMAIL_REGEX.test(item.email)) {
            errors[`listEmailReceiverInformation[${index}].email`] = translate(
              "CM.input_regex_validation"
            );
          } else if (item.email.length > 255) {
            errors[`listEmailReceiverInformation[${index}].email`] = translate(
              "CM.input_length_validation",
              { maxLength: 255 }
            );
          } else {
            delete errors[`listEmailReceiverInformation[${index}].email`];
          }
        }
      );
    }

    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        errors,
      },
    });

    if (
      !model.phoneNumber &&
      isEmpty(errors) &&
      EMAIL_REGEX.test(model.quoteEmail) == true &&
      DESCRIPTION_REGEX.test(model.quoteName) == true &&
      model.quoteEmail?.length <= 255 &&
      model.quoteName?.length <= 255
    ) {
      const supplierData = model?.listSupplier?.map((item: SupplierModel) => {
        return {
          ...item,
          quoteEmail: model.quoteEmail,
          quoteName: model.quoteName,
          phoneNumber: model.phoneNumber,
          emailRecipients: model?.listEmailReceiverInformation,
        };
      });
      dispatchModel({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          listSupplier: supplierData,
        },
      });
      setOpenDrawerSupplier(false);
    } else if (
      isEmpty(errors) &&
      EMAIL_REGEX.test(model.quoteEmail) == true &&
      DESCRIPTION_REGEX.test(model.quoteName) == true &&
      PHONE_NUMBER_REGEX.test(model.phoneNumber) == true &&
      model.quoteEmail?.length <= 255 &&
      model.quoteName?.length <= 255 &&
      model.phoneNumber?.length <= phoneNumberLength
    ) {
      const supplierData = model?.listSupplier?.map((item: SupplierModel) => {
        return {
          ...item,
          quoteEmail: model.quoteEmail,
          quoteName: model.quoteName,
          phoneNumber: model.phoneNumber,
          emailRecipients: model?.listEmailReceiverInformation,
        };
      });
      dispatchModel({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          listSupplier: supplierData,
        },
      });
      setOpenDrawerSupplier(false);
    }
  };

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="columns-table">
            <label>{translate("PL.purchasing_plan_supplier_name")}</label>
          </div>
        ),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: 262,
        render: (_text_, record) => {
          return (
            <LayoutCell position="left">
              <Tooltip placement="topLeft" title={<div>{record?.name}</div>}>
                <div
                  className="table__cell-blue fw-semibold cursor-pointer text-truncate"
                  onClick={handleOpenDrawerSupplier}
                >
                  {record?.name}
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="columns-table">
            <label>{translate("PL.purchasing_plan_supplier_tax_code")}</label>
          </div>
        ),
        key: "taxCode",
        dataIndex: "taxCode",
        width: 120,
        ellipsis: true,
        render: (_text_, record) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.taxCode} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="columns-table">
            <label>{translate("PL.purchasing_plan_supplier_address")}</label>
          </div>
        ),
        key: "address",
        dataIndex: "address",
        ellipsis: true,
        render: (_text_, record) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.address} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="columns-table">
            <label>
              {translate(
                "PL.purchasing_plan_supplier_name_of_the_person_quoting_the_price"
              )}
            </label>
          </div>
        ),
        key: "quoteName",
        dataIndex: "quoteName",
        width: 220,
        ellipsis: true,
        render: (_text_, record) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.quoteName} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="columns-table">
            <label>
              {translate(
                "PL.purchasing_plan_supplier_email_of_the_person_quoting_the_price"
              )}
            </label>
          </div>
        ),
        key: "quoteEmail",
        dataIndex: "quoteEmail",
        ellipsis: true,
        render: (_text_, record) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.quoteEmail} />
            </LayoutCell>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model, translate]
  );

  return (
    <div className="supplier-information_table">
      {model.listSupplier.length > 0 && (
        <div className="p-b--xs">
          <Button
            iconPlace="left"
            type="secondary"
            onClick={handleOpenModalSupplier}
          >
            {translate("PL.purchasing_plan_btn_select_supplier")}
          </Button>
        </div>
      )}

      {model.listSupplier.length === 0 ? (
        <EmptyInitializeTable
          textButton={translate("PL.purchasing_plan_btn_select_supplier")}
          content={
            <div className="">
              {translate("PL.purchasing_plan_title_empty_table_supplier")}
            </div>
          }
          icon={<img src={emptyIcon} alt="" />}
          onHandleClickAdd={() => {
            setOpenModalSupplier(true);
          }}
        />
      ) : (
        <StandardTable
          rowKey={"id"}
          columns={columns}
          dataSource={model.listSupplier}
          isDragable={true}
          idContainer="table-id"
          scroll={{ y: "calc(100vh - 320px)" }}
          className="purchasing-plan_supplier"
        />
      )}

      {openModalSupplier && (
        <ModalListSuppliers
          open={openModalSupplier}
          handleCancelModalSupplier={handleCancelModalSupplier}
          handleApplySupplier={handleApplySupplier}
        />
      )}

      {openDrawerSupplier && (
        <SupplierInformationDrawer
          visible={openDrawerSupplier}
          handleClose={handleCloseDrawerSupplier}
          handleSave={handleSaveDrawerSupplier}
        />
      )}
    </div>
  );
};

export default SupplierInformationTable;
