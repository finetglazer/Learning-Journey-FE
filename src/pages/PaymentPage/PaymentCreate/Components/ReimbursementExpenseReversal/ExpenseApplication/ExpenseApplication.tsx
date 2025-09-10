import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import {
  PaymentTypeApplicationModel,
  PaymentCreateModel,
  PaymentTypeApplicationFilter,
  AccountInfoModel,
} from "models/Payment/PaymentRequestModel";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import React, { useContext, useEffect, useState } from "react";
import { DeleteRoundIcon, emptyExpensePayment } from "assets/icons";
import { Button, ModalConfirm } from "react-components-design-system";
import add from "assets/icons/add.svg";
import {
  CODE_TYPE_EXPENSE_DCCN,
  CODE_TYPE_EXPENSE_DCNCC,
  CODE_TYPE_PAYMENT_REQUEST_CORP,
  CODE_TYPE_PAYMENT_REQUEST_PER,
  TYPE_OF_PROPOSAL,
} from "models/Payment";
import PaymentApplicationTable from "../PaymentApplicationTable/PaymentApplicationTable";
import useReducerFilter from "../ModalApplicationType/useReducerFilter/useReducerFilter";
import ModalApplicationType from "../ModalApplicationType/ModalApplicationType";
import useColumnApplicationType from "../ModalApplicationType/useColumnApplicationType/useColumnApplicationType";
import { listService } from "core/services/page-services/list-service";
import { isEmpty } from "lodash";
import { useAppSelector } from "rtk/useRedux";

function ExpenseApplication() {
  const account = useAppSelector(
    (state) => state.profile?.account
  ) as AccountInfoModel;
  const {
    translate,
    model,
    handleChangeSingleField,
    formatNumberToCurrency,
    handleChangeAllField,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);
  const [openModal, setOpenModal] = useState(false);
  const handleApply = (data: PaymentTypeApplicationModel[]) => {
    setOpenModal(false);
    handleChangeSingleField({
      fieldName: "expenseApplicationList",
    })(data);
  };
  const [isDisableButton, setIsDisableButton] = useState(false);

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const { filterExpenseExtend } = useReducerFilter({ translate });
  const { columnModalApplicationPayment, columnsExpense } =
    useColumnApplicationType({
      translate,
      formatNumberToCurrency,
      expenseApplicationList: model?.expenseApplicationList,
      handleDeleteRowConfirm,
    });

  const [searchParams, setSearchParams] =
    useState<PaymentTypeApplicationFilter>({
      paymentRequestTypeGroup: TYPE_OF_PROPOSAL.EXPENSE,
      currencyId: model?.currency?.id?.toString() || "",
      supplierId: model?.supplier?.id || "",
      ids: [],
      paymentRequestTypeId: model.paymentRequestType?.id,
      createUsers: model?.requester?.email ? [model?.requester?.email] : [],
      requesterValue: isEmpty(model?.requester)
        ? [account]
        : [model?.requester],
      paymentInheritanceType: model?.paymentInheritanceType,
      paymentInheritanceId: model?.paymentInheritanceId,
    });

  useEffect(() => {
    switch (model?.paymentRequestType?.code) {
      case CODE_TYPE_PAYMENT_REQUEST_PER:
      case CODE_TYPE_EXPENSE_DCCN:
        setSearchParams((pre) => ({
          ...pre,
          supplierId: "",
          paymentRequestTypeGroup: TYPE_OF_PROPOSAL.EXPENSE,
          currencyId: model?.currency?.id || "",
          ids: [],
        }));
        break;
      case CODE_TYPE_PAYMENT_REQUEST_CORP:
      case CODE_TYPE_EXPENSE_DCNCC:
        setSearchParams((pre) => ({
          ...pre,
          supplierId: model?.supplier?.id || "",
          paymentRequestTypeGroup: TYPE_OF_PROPOSAL.EXPENSE,
          currencyId: model?.currency?.id || "",
          ids: [],
        }));
        if (!model?.supplier?.id) {
          handleChangeSingleField({
            fieldName: "expenseApplicationList",
          })([]);
          setIsDisableButton(true);
        }
        break;

      default:
        break;
    }
  }, [
    model?.supplier?.id,
    model?.currency?.id,
    model?.paymentRequestType,
    model?.expenseApplicationList,
  ]);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<PaymentTypeApplicationModel>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const [idDelete, setIdDelete] = useState("");
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const handleDeleteRow = () => {
    const rowDataEdit = model?.expenseApplicationList?.filter(
      (item: PaymentTypeApplicationModel) => item.id !== idDelete
    );
    handleChangeAllField({
      ...model,
      expenseApplicationList: rowDataEdit,
    });

    const ids = selectedRowKeys.filter((id) => id !== idDelete);
    setSelectedRowKeys(ids);
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleBulkDeleteRow = () => {
    const rowsDataEdit = model?.expenseApplicationList?.filter(
      (item: PaymentTypeApplicationModel) => !selectedRowKeys.includes(item.id)
    );
    handleChangeAllField({
      ...model,
      expenseApplicationList: rowsDataEdit,
    });

    const ids = selectedRowKeys.filter((id) => !selectedRowKeys.includes(id));
    setSelectedRowKeys(ids);
    setOpenModalConfirmDeleteAll(false);
  };

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  return (
    <div>
      <div>
        <div>
          {model?.expenseApplicationList?.length > 0 && (
            <Button
              icon={<img src={add} alt="img" width={12} height={12} />}
              iconPlace="left"
              type="secondary"
              onClick={() => {
                setOpenModal(true);
              }}
              disabled={isDisableButton}
            >
              {translate("PM.payment_add_expense_reversal")}
            </Button>
          )}
        </div>
        {model.expenseApplicationList.length === 0 ? (
          <EmptyInitializeTable
            textButton={translate("PM.payment_add_expense_reversal")}
            content={
              <div className="reimbursement-width_content_empty">
                {`${translate(
                  "PM.payment_advance_payment_application_content_empty"
                )}`}
              </div>
            }
            icon={<img src={emptyExpensePayment} alt="" />}
            onHandleClickAdd={() => {
              setOpenModal(true);
            }}
            disableButton={isDisableButton}
          />
        ) : (
          <div className="mt-2">
            <PaymentApplicationTable
              idContainer="ExpenseList"
              columns={columnsExpense}
              translate={translate}
              selectedRowKeys={selectedRowKeys as KeyType[]}
              setSelectedRowKeys={setSelectedRowKeys}
              handleBulkDelete={handleBulkDelete}
              list={model.expenseApplicationList}
              rowSelection={rowSelection}
            />
          </div>
        )}
      </div>
      {openModal && (
        <ModalApplicationType
          handleCancel={() => setOpenModal(false)}
          open={openModal}
          extendFilterReducer={filterExpenseExtend}
          handleApply={handleApply}
          columns={columnModalApplicationPayment}
          title={translate("PM.payment_title_modal_add_expense")}
          searchParams={searchParams}
          modelRowSelected={model.expenseApplicationList}
        />
      )}
      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PM.payment_title_Expense_application_modal_title")}
        content={translate(
          "PM.payment_title_Expense_application_modal_content"
        )}
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
        title={translate("PM.payment_title_Expense_application_modal_title")}
        content={translate(
          "PM.payment_title_Expense_application_modal_content"
        )}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
}

export default ExpenseApplication;
