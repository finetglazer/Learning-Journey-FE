import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PurchasingPlanBiddingDetailHookContext } from "../../../PurchasingPlanBiddingDetailHook";
import { Key, RowSelectionType } from "antd/lib/table/interface";
import { EvaluationRole } from "models/PurchasingPlan";
import { indexOf, isEmpty } from "lodash";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";
import { AddIcon, DeleteRoundIcon } from "assets/icons";
import EmptyData from "../EmptyData/EmptyData";
import { columns } from "./helper";
import { childText } from "models/PurchasingPlan/PurchasingPlanConstant";
import { utilService } from "core/services/common-services/util-service";

const Role = () => {
  const [translate] = useTranslation();
  const [idDelete, setIdDelete] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);
  const { model, handleChangeSingleField, handleChangeAllField } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const handleAddNewRole = () => {
    const newEvaluationRole: EvaluationRole = {
      id: `${Date.now().toString()}${childText}`,
    };

    handleChangeSingleField({ fieldName: "evaluationRoles" })([
      ...(model?.evaluationRoles ?? []),
      newEvaluationRole,
    ]);
  };

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleBulkDeleteRow = () => {
    const evaluationRoles = model?.evaluationRoles?.filter(
      (item: EvaluationRole) => !selectedRowKeys.includes(item?.id)
    );

    const indexOfDeletedFiles = model?.evaluationRoles
      .filter((item: EvaluationRole) => selectedRowKeys.includes(item?.id))
      .map((item: EvaluationRole) => indexOf(model?.evaluationRoles, item));

    const errors = indexOfDeletedFiles.reduce(
      (acc: { [key: string]: string }, index: number) => {
        acc[`evaluationRoles[${index}].user.name`] = undefined;
        acc[`evaluationRoles[${index}].user.email`] = undefined;
        acc[`evaluationRoles[${index}].role`] = undefined;
        acc[`evaluationRoles[${index}].note`] = undefined;
        return acc;
      },
      {}
    );

    handleChangeAllField({
      ...model,
      evaluationRoles: evaluationRoles,
      errors: { ...model?.errors, ...errors },
    });

    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const evaluationRoles = model?.evaluationRoles?.filter(
      (item: EvaluationRole) => item?.id !== idDelete
    );

    const indexOfDeletedFile = model?.evaluationRoles?.findIndex(
      (item: EvaluationRole) => item?.id === idDelete
    );

    handleChangeAllField({
      ...model,
      evaluationRoles: evaluationRoles,
      errors: {
        ...model?.errors,
        [`evaluationRoles[${indexOfDeletedFile}].name`]: undefined,
        [`evaluationRoles[${indexOfDeletedFile}].technicalRequirement`]:
          undefined,
        [`evaluationRoles[${indexOfDeletedFile}].user.name`]: undefined,
        [`evaluationRoles[${indexOfDeletedFile}].user.email`]: undefined,
        [`evaluationRoles[${indexOfDeletedFile}].note`]: undefined,
      },
    });

    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: "checkbox" as RowSelectionType,
    renderCell: (value: boolean, record: EvaluationRole) => {
      return (
        <div className="d-flex justify-content-center align-items-center pt-2 payment-height_40">
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

  useEffect(() => {
    if (model?.evaluationCriteriaSummary?.evaluationRoles) {
      handleChangeSingleField({
        fieldName: "evaluationRoles",
      })(model?.evaluationCriteriaSummary?.evaluationRoles);
    }
  }, [
    handleChangeSingleField,
    model?.evaluationCriteriaSummary?.evaluationRoles,
  ]);

  return (
    <div>
      <div className="pass-fail-method pb-3">
        {isEmpty(model?.evaluationRoles) ? (
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "evaluationCriteriaSummary.evaluationRoles"
            )}
          >
            <EmptyData
              addNew={handleAddNewRole}
              buttonLabel="PL.txt_add_member"
            />
          </FormItem>
        ) : (
          <div>
            <div className="header-tech-criteria">
              <Button
                icon={<img src={AddIcon} alt="img" width={14} height={14} />}
                iconPlace="left"
                type="secondary"
                className="mb-2"
                onClick={handleAddNewRole}
              >
                {translate("PL.txt_add_member")}
              </Button>
            </div>
            <ActionBarComponent
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            >
              <Button type="secondary" size="sm" onClick={handleBulkDelete}>
                {translate("CL.delete_btn")}
              </Button>
              <Button
                type="secondary"
                size="sm"
                onClick={() => setSelectedRowKeys([])}
              >
                {translate("CM.txt_status_close")}
              </Button>
            </ActionBarComponent>
            <StandardTable
              rowKey={"id"}
              columns={columns({
                translate,
                model,
                handleChangeSingleField,
                handleDeleteRowConfirm,
              })}
              dataSource={model.evaluationRoles}
              rowSelection={rowSelection}
              idContainer="table-id"
              rowClassName="payment-row"
              scroll={{ x: "max-content", y: "calc(100vh - 320px)" }}
              className="cost-allocation-row_selection"
            />
          </div>
        )}
      </div>

      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PP.confirm_delete_base")}
        content={translate("PL.bidding.title.delete_selected_warning")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleDeleteRow();
        }}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />
      <ModalConfirm
        open={openModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PP.confirm_delete_base")}
        content={translate("PL.bidding.title.delete_selected_warning")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default Role;
