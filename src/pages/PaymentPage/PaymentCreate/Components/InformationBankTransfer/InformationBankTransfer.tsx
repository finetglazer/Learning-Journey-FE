import { Download, TrashCan } from "@carbon/icons-react";
import { DeleteRoundIcon, IcArrowsCounterClockwise } from "assets/icons";
import listDashes from "assets/icons/listDashes.svg";
import uploadSimple from "assets/icons/uploadSimple.svg";
import checkListImg from "assets/images/chectListImg.svg";

import { ACCOUNT_BANK_REGEX, NAME_BANK_REGEX } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";

import { ModalImportFileError, UploadFileCustom } from "components";
import { isEmpty, isEqual } from "lodash";
import {
  CODE_TYPE_ADVANCE_TUCN,
  CODE_TYPE_DEPOSIT,
  CODE_TYPE_PAYMENT_REQUEST_PER,
  PATH_TEMPLATE_FILE,
  PaymentCreateModel,
  TransferInfoListModel,
  VND_CURRENCY,
} from "models/Payment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  BORDER_TYPE,
  Button,
  Checkbox,
  FormItem,
  InputNumber,
  InputText,
  ModalConfirm,
  Select,
  UploadFile,
} from "react-components-design-system";
import { paymentRepository } from "../../../PaymentRepository";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";

function InformationBankTransfer() {
  const {
    translate,
    model,
    errorsModal,
    handleChangeSelectField,
    handleChangeSingleField,
    dispatchModel,
    setModalType,
    setListInformationTransfer,
    handleUploadFileError,
    handleDownloadFileAttached,
    forceUpdateModal,
    setLoading,
    handleGetTransferInfo,
    setErrorsModal,
    checkInternalAccount,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const renderContentUploadFile = useCallback(() => {
    return (
      <div className="d-flex payment-color_text_label flex-column my-2 payment-custom_transform">
        <span className="fw-semibold my-1">
          {translate("PM.payment_import_transfer_button_label")}
        </span>
        <span>{translate("PM.payment_to_add_transfer_information_label")}</span>
      </div>
    );
  }, []);

  const renderContentButton = useCallback((): any => {
    return (
      <div className="position-relative">
        <div className="p-x--lg position-absolute payment-custom_absolute">
          <img src={checkListImg} alt="" width={150} height={150} />
        </div>
        <span className="p-r--xs">
          <img src={uploadSimple} alt="img" />
        </span>
        {translate("PM.payment_import_transfer_button_label")}
      </div>
    ) as any;
  }, []);

  const handleUpdateLoadFileTransfer = (file: File[] | Blob[]): any => {
    setLoading(true);
    paymentRepository.import(file).subscribe({
      next: (res) => {
        setLoading(false);
        if (res) {
          dispatchModel({
            type: GeneralActionEnum.SET,
            payload: {
              ...model,
              infoFileTransferBank: res as TransferInfoListModel,
            },
          });
        }
      },
      error: (err) => {
        setLoading(false);
        handleUploadFileError(err);
      },
      complete: () => {
        setLoading(false);
      },
    });
  };

  const handleRemoveFile = () => {
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        infoFileTransferBank: null,
      },
    });
    setIsOpenModalConfirmDeleteTransFerList(false);
  };

  const handleOpenModal = () => {
    const infoFileTransferBankList =
      model?.infoFileTransferBank?.transferDetails?.map((item, index) => {
        return { ...item, id: index };
      });
    setListInformationTransfer(infoFileTransferBankList);
    setModalType("OPEN");
    forceUpdateModal();
  };

  const [
    isOpenModalConfirmDeleteTransFerList,
    setIsOpenModalConfirmDeleteTransFerList,
  ] = useState(false);

  const handleDownloadTemplateFile = () => {
    handleDownloadFileAttached({
      path: PATH_TEMPLATE_FILE,
      name: "Temp_Bang_ke_chuyen_khoan_trong_nuoc.xlsx",
    } as any);
  };

  const [isShowCheckedImport, setIsShowCheckedImport] = useState(true);
  useEffect(() => {
    const isVndCurrency =
      model.currency?.code?.toLowerCase() === VND_CURRENCY.toLowerCase();
    const paymentRequestCode = model?.paymentRequestType?.code;

    if (
      (paymentRequestCode === CODE_TYPE_ADVANCE_TUCN && isVndCurrency) ||
      (paymentRequestCode === CODE_TYPE_PAYMENT_REQUEST_PER && isVndCurrency) ||
      paymentRequestCode === CODE_TYPE_DEPOSIT
    ) {
      setIsShowCheckedImport(true);
    } else {
      setIsShowCheckedImport(false);
    }
  }, [model.currency, model.paymentRequestType]);

  const onEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        const value = event.currentTarget.value;
        if (isEmpty(value)) return;
        const code = model?.currency?.code;
        if (!isEqual(code, VND_CURRENCY)) {
          handleGetTransferInfo(
            value,
            model?.receivingBank?.id?.toString(),
            model?.bankName
          );
        } else {
          handleGetTransferInfo(value, model?.receivingBank?.id?.toString());
        }
      }
    },
    [handleGetTransferInfo]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        if (typeof onEnter === "function") {
          onEnter(event);
        }
      }
    },
    [onEnter]
  );

  const isShowButtonCheckAccountNumber =
    model?.receivingBank?.isInternal &&
    !isEmpty(model?.bankAccountNumber) &&
    !isEmpty(model?.nameAccountBank);

  return (
    <div>
      {/*Bank Transfer*/}
      {model.currency?.code?.toLowerCase().toString() ===
        VND_CURRENCY?.toLowerCase().toString() && model?.isCheckImport ? (
        <div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="payment-custom_grid_9"
          >
            <div className="payment-custom_grid_9-col_3">
              <FormItem>
                <InputNumber
                  readOnly={true}
                  label={translate("PM.payment_bank_amount_input_label")}
                  placeHolder={"0"}
                  className="payment-custom_input"
                  isSmall={false}
                  value={Math.max(0, model?.paymentBankAmount)}
                />
              </FormItem>
            </div>
            <div className="payment-custom_grid_9-col_6">
              <div className="d-flex align-items-center h-100 pt-4 justify-content-between">
                <div>
                  {isShowCheckedImport && (
                    <Checkbox
                      label={translate(
                        "PM.payment_transfer_according_to_the_list_label"
                      )}
                      checked={model?.isCheckImport}
                      disabled={!isEmpty(model?.infoFileTransferBank?.fileInfo)}
                      onChange={
                        handleChangeSingleField({
                          fieldName: "isCheckImport",
                        }) as () => (value: boolean) => void
                      }
                    />
                  )}
                </div>
                {model.infoFileTransferBank && (
                  <div className="d-flex justify-content-end">
                    <div className="d-flex gap-2">
                      <Button
                        icon={<img src={listDashes} alt="img" />}
                        iconPlace="left"
                        type="secondary"
                        size="lg"
                        onClick={handleOpenModal}
                      >
                        {translate(
                          "PM.payment_view_the_transfer_detail_list_label_button"
                        )}
                      </Button>
                      <Button
                        icon={<TrashCan />}
                        iconPlace="left"
                        size="lg"
                        type="tertiary"
                        onClick={() =>
                          setIsOpenModalConfirmDeleteTransFerList(true)
                        }
                      >
                        {translate(
                          "PM.payment_delete_the_transfer_detail_list_label_button"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!model.infoFileTransferBank && (
              <div className="payment-custom_grid_9-col_9 position-relative">
                <UploadFileCustom
                  className="secondary payment-color_button"
                  titleButton={renderContentButton()}
                  icon={renderContentUploadFile()}
                  uploadFile={handleUpdateLoadFileTransfer}
                  type={"dragAndDrop"}
                  maximumSize={99999999999}
                />
                <Button
                  className="payment-custom_button_download"
                  type="tertiary"
                  onClick={handleDownloadTemplateFile}
                >
                  <span className="payment-colorTextLabel p-r--2xs">
                    <Download />
                  </span>
                  <span>
                    {translate(
                      "PM.payment_download_template_file_title_button"
                    )}
                  </span>
                </Button>
              </div>
            )}
          </form>
        </div>
      ) : (
        <form className="payment-custom_grid_9">
          {/* Transfer amount */}
          <div className="payment-custom_grid_9-col_3">
            <FormItem>
              <InputNumber
                readOnly={true}
                label={translate("PM.payment_bank_amount_input_label")}
                className="payment-custom_input"
                placeHolder={"0"}
                isSmall={false}
                value={Math.max(0, model?.paymentBankAmount)}
                numberType={"DECIMAL"}
                isReverseSymb
              />
            </FormItem>
          </div>
          <div className="payment-custom_grid_9-col_3 d-flex align-items-center pt-4">
            {isShowCheckedImport && (
              <Checkbox
                label={translate(
                  "PM.payment_transfer_according_to_the_list_label"
                )}
                disabled={!isEmpty(model?.infoFileTransferBank?.fileInfo)}
                checked={model?.isCheckImport}
                onChange={
                  handleChangeSingleField({
                    fieldName: "isCheckImport",
                  }) as () => (value: boolean) => void
                }
              />
            )}
          </div>
          {isShowButtonCheckAccountNumber && (
            <div className="payment-custom_grid_9-col_3 d-flex align-items-center pt-4">
              <Button
                type={"text"}
                className="px-1"
                icon={
                  <img
                    src={IcArrowsCounterClockwise}
                    alt=""
                    width={16}
                    height={16}
                  />
                }
                iconPlace={"left"}
                onClick={() => {
                  checkInternalAccount(
                    model?.bankAccountNumber,
                    model?.nameAccountBank
                  );
                }}
              >
                {translate("PM.check_account_information")}
              </Button>
            </div>
          )}
          {/*Beneficiary Bank*/}
          <div className="payment-custom_grid_9-col_9 payment-custom_grid_9">
            {/*Beneficiary bank Name Bank*/}
            <div className="payment-custom_grid_9-col_3">
              {model?.currency?.code?.toLowerCase().toString() ===
              VND_CURRENCY.toLowerCase().toString() ? (
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "paymentInformation.bankId"
                  )}
                >
                  <Select
                    label={translate(
                      "PM.payment_bank_transfer_beneficiary_bank_input_label"
                    )}
                    isRequired
                    placeHolder={translate(
                      "PM.payment_bank_transfer_beneficiary_bank_placeholder"
                    )}
                    searchProperty="name"
                    searchType=""
                    type={1}
                    valueFilter={{
                      name: "",
                    }}
                    isSmall={false}
                    classFilter={undefined}
                    isSearch
                    getList={paymentRepository.getReceivingBankList}
                    onChange={handleChangeSelectField({
                      fieldName: "receivingBank",
                      errorName: "paymentInformation.bankId",
                    })}
                    isEnumerable={false}
                    render={(t) => t?.name}
                    value={model.receivingBank}
                    readOnly={model.isDetail}
                    allowClear={false}
                  />
                </FormItem>
              ) : (
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "paymentInformation.bankName"
                  )}
                >
                  <InputText
                    isRequired
                    label={translate(
                      "PM.payment_bank_transfer_beneficiary_bank_input_label"
                    )}
                    translate={translate}
                    value={model?.bankName}
                    placeHolder={translate(
                      "PM.payment_bank_transfer_beneficiary_bank_placeholder_input"
                    )}
                    onChange={handleChangeSingleField({
                      fieldName: "bankName",
                      errorName: "paymentInformation.bankName",
                    })}
                    type={BORDER_TYPE.BORDERED}
                    maxLength={150}
                    isSmall={false}
                    regexInput={NAME_BANK_REGEX}
                  />
                </FormItem>
              )}
            </div>
            {/*Beneficiary bank account number and name */}
            <div className="payment-custom_grid_9-col_6 d-flex payment-gap-12">
              {/*number bank*/}
              <div className="w-100">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "paymentInformation.accountNumber"
                  )}
                >
                  <InputText
                    label={translate(
                      "PM.payment_bank_transfer_account_number_input_label"
                    )}
                    className="payment-custom_input"
                    placeHolder={translate(
                      "PM.payment_bank_transfer_account_number_input_placeholder"
                    )}
                    isRequired
                    isSmall={false}
                    onChange={handleChangeSingleField({
                      fieldName: "bankAccountNumber",
                      errorName: "paymentInformation.accountNumber",
                    })}
                    onKeyDown={(event) =>
                      handleKeyDown(
                        event as React.KeyboardEvent<HTMLInputElement>
                      )
                    }
                    value={model.bankAccountNumber}
                    maxLength={150}
                    regexInput={ACCOUNT_BANK_REGEX}
                    translate={translate}
                  />
                </FormItem>
              </div>
              {/*name number*/}
              <div className="w-100">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "paymentInformation.accountName"
                  )}
                >
                  <InputText
                    label={translate(
                      "PM.payment_bank_transfer_account_name_input_label"
                    )}
                    className="payment-custom_input"
                    placeHolder={translate(
                      "PM.payment_bank_transfer_account_name_input_placeholder"
                    )}
                    isRequired
                    isSmall={false}
                    onChange={handleChangeSingleField({
                      fieldName: "nameAccountBank",
                      errorName: "paymentInformation.accountName",
                    })}
                    isByteCheck
                    value={model.nameAccountBank}
                    maxLength={150}
                    translate={translate}
                  />
                </FormItem>
              </div>
            </div>
            {/*Transfer Content*/}
            <div className="payment-custom_grid_9-col_9">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "paymentInformation.description"
                )}
              >
                <InputText
                  label={translate(
                    "PM.payment_bank_transfer_content_input_label"
                  )}
                  isByteCheck
                  value={model.transferContent}
                  placeHolder={translate(
                    "PM.payment_bank_transfer_content_input_placeholder"
                  )}
                  onChange={handleChangeSingleField({
                    fieldName: "transferContent",
                    errorName: "paymentInformation.description",
                  })}
                  type={BORDER_TYPE.BORDERED}
                  isSmall={false}
                  maxLength={150}
                  regexInput={NAME_BANK_REGEX}
                  translate={translate}
                />
              </FormItem>
            </div>
          </div>
        </form>
      )}
      <ModalConfirm
        open={isOpenModalConfirmDeleteTransFerList}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PM.payment_confirm_delete_voucher_title")}
        content={translate("PM.payment_confirm_delete_content")}
        titleButtonCancel={translate("BG.cancel")}
        titleButtonApply={translate("BG.delete")}
        handleSave={() => {
          handleRemoveFile();
        }}
        handleCancel={() => setIsOpenModalConfirmDeleteTransFerList(false)}
      />
      {isEqual(errorsModal?.type, "IMPORT_FAIL") && (
        <ModalImportFileError
          errors={errorsModal?.errors}
          onClose={() => setErrorsModal({ type: "NONE" })}
        />
      )}
    </div>
  );
}

export default InformationBankTransfer;
