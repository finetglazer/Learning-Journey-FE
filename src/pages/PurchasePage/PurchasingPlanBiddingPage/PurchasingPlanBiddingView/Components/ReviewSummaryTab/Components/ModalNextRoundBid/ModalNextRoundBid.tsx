/* eslint-disable import/no-unresolved */
import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { DeleteRoundIcon } from "assets/icons";
import add from "assets/icons/add.svg";
import classNames from "classnames";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { listService } from "core/services/page-services/list-service";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { LastRoundSupplier } from "models/PurchasingPlan";
import { EmptyView } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/Components/EmptyView";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { DELETE_ICON_SIZE } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetDetail/TemporaryImportAssetDetailHook";
import React, { useContext, useState } from "react";
import {
  ActionBarComponent,
  Button,
  DatePicker,
  FormItem,
  LayoutCell,
  Modal,
  ModalConfirm,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Observable } from "rxjs";
import { NextRoundBidModel } from "./helper";
import styles from "./ModalNextRoundBid.module.scss";

type Props = {
  open: boolean;
  handleCancel: () => void;
  onPressConfirm?: () => void;
};

const ModalNextRoundBid = ({ open, handleCancel, onPressConfirm }: Props) => {
  const { model: modelMaster, ...contextMaster } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);

  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const { model, dispatch } =
    detailService.useModel<NextRoundBidModel>(NextRoundBidModel);

  const { handleChangeSingleField, handleChangeDateField } =
    fieldService.useField(model, dispatch);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<LastRoundSupplier>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const [translate] = useTranslation();

  const handleSaveModal = () => {
    contextMaster.handleCreateNextRoundBid({
      roundStartDate: model?.roundStartDate?.format(),
      roundEndDate: model?.roundEndDate?.format(),
      supplierIds: model?.listSupplier?.map((item) => item?.id),
    });
    onPressConfirm && onPressConfirm();
  };

  const handleAddRow = () => {
    const newRow = new LastRoundSupplier();

    handleChangeSingleField({ fieldName: "listSupplier" })([
      ...(model?.listSupplier ?? []),
      newRow,
    ]);
  };

  const handleBulkDeleteRow = () => {
    handleChangeSingleField({ fieldName: "listSupplier" })(
      model?.listSupplier?.filter((_, index) => {
        return !selectedRowKeys.includes(index);
      })
    );
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleDeleteRow = () => {
    handleChangeSingleField({ fieldName: "listSupplier" })(
      model?.listSupplier?.filter((_, index) => index !== indexDelete)
    );
    setIsOpenModelConfirmDeleteRow(false);
  };

  const [indexDelete, setIndexDelete] = useState<number>();

  const handleDeleteRowConfirm = (idx: number) => {
    setIndexDelete(idx);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const getSupplierLastRound = (): Observable<LastRoundSupplier[]> => {
    return new Observable<LastRoundSupplier[]>((observer) => {
      const subscription = purchasingPlanRepository
        .getSupplierLastRound(modelMaster?.id)
        .subscribe({
          next(res) {
            observer.next(res);
            observer.complete();
          },
          error(err) {
            observer.error(err);
          },
        });

      return () => subscription.unsubscribe();
    });
  };

  const columns: ColumnProps<LastRoundSupplier>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PP.supplier_name_title")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "supplier",
        dataIndex: "supplier",
        width: 250,
        render: (text, record, idx) => (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `supplierIds[${record?.index}]`
              )}
            >
              <Select
                isRequired
                searchProperty="name"
                searchType=""
                type={1}
                appendToBody={true}
                valueFilter={{
                  name: "",
                }}
                isSmall={true}
                classFilter={undefined}
                onChange={(value, objectValue) => {
                  handleChangeSingleField({ fieldName: "listSupplier" })(
                    model?.listSupplier?.map((item, index) => {
                      if (index === idx) {
                        return {
                          ...objectValue,
                        };
                      }
                      return item;
                    })
                  );
                }}
                getList={getSupplierLastRound}
                isEnumerable={false}
                render={(t) => t?.name}
                value={record}
                allowClear={false}
              />
            </FormItem>
          </LayoutCell>
        ),
      },
      {
        title: translate("PP.tax_code_title"),
        key: "taxCode",
        dataIndex: "taxCode",
        ellipsis: true,
        width: 270,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_evaluate_criterial"),
        key: "evaluationPoint",
        dataIndex: "evaluationPoint",
        ellipsis: true,
        width: 160,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_review_summary_conversion_point"),
        key: "convertPoint",
        dataIndex: "convertPoint",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: "action",
        dataIndex: "action",
        width: 40,
        render: (_, record, index) => (
          <LayoutCell>
            <div className="payment-trash_icon cursor-pointer btn">
              <TrashCan
                size={DELETE_ICON_SIZE}
                onClick={() => handleDeleteRowConfirm(index)}
              />
            </div>
          </LayoutCell>
        ),
      },
    ],
    [model, translate]
  );

  return (
    <Modal
      open={open}
      title={translate("PL.review_summary.confirm_select_supplier")}
      size={1000}
      closeIcon={true}
      handleSave={handleSaveModal}
      isShowIconBack={false}
      handleCancel={handleCancel}
      titleButtonCancel={translate("CT.contract_file.cancel")}
      titleButtonApply={translate("PL.btn_confirm")}
      className={styles["modal_next_round_bid"]}
    >
      <div className="d-flex flex-column">
        <div className="row flex-1 g-3">
          <div className="col-6">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "roundStartDate"
              )}
            >
              <DatePicker
                label={translate("PL.purchasing_plan_bidding_start_time")}
                placeholder={translate("PL.txt_enter_time")}
                isRequired
                isSmall={false}
                format={STANDARD_DATE_FORMAT_SLASH}
                value={
                  model?.roundStartDate
                    ? dayjs(model?.roundStartDate)
                    : undefined
                }
                onChange={handleChangeDateField({
                  fieldName: "roundStartDate",
                })}
              />
            </FormItem>
          </div>
          <div className="col-6">
            <FormItem
              validateObject={utilService.getValidateObj(model, "roundEndDate")}
            >
              <DatePicker
                label={translate("PL.purchasing_plan_bidding_end_time")}
                placeholder={translate("PL.txt_enter_time")}
                isRequired
                isSmall={false}
                format={STANDARD_DATE_FORMAT_SLASH}
                value={
                  model?.roundEndDate ? dayjs(model?.roundEndDate) : undefined
                }
                onChange={handleChangeDateField({
                  fieldName: "roundEndDate",
                })}
              />
            </FormItem>
          </div>
        </div>
        <div className="pt-2 pb-2">
          <span className={styles["modal_next_round_bid__title_style"]}>
            {translate("PL.txt_confirm_next_round_bid")}
          </span>
        </div>
        <div className="pb-2">
          <Button
            type={"secondary"}
            icon={<img src={add} alt="" width={12} height={12} />}
            iconPlace={"left"}
            onClick={handleAddRow}
          >
            {translate("PPA.add_supplier")}
          </Button>
        </div>
        <ActionBarComponent
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        >
          <Button type="secondary" size="sm" onClick={handleBulkDelete}>
            {translate("CL.delete_btn")}
          </Button>
        </ActionBarComponent>
        {isEmpty(model?.listSupplier) ? (
          <EmptyView />
        ) : (
          <StandardTable
            rowKey={(_, index) => index}
            columns={columns}
            dataSource={model?.listSupplier}
            isDragable={true}
            rowSelection={rowSelection}
            idContainer="table-id"
            rowClassName="payment-row"
            scroll={{ x: "max-content", y: "calc(100vh - 320px)" }}
            className="payment-row_selection"
          />
        )}
      </div>
      <ModalConfirm
        open={openModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PM.payment_confirm_delete_document_title")}
        content={translate("PM.payment_confirm_delete_document_content")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
        getContainer={false}
      />

      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PM.payment_confirm_delete_document_title")}
        content={translate("PM.payment_confirm_delete_document_content")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleDeleteRow();
        }}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
        getContainer={false}
      />
    </Modal>
  );
};

export default ModalNextRoundBid;
