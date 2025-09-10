import { Col, Row } from "antd";
import { DeleteRoundIcon } from "assets/icons";
import { NUMBER_MAX_13 } from "config/const";
import { detectIntegerCurrency } from "core/helpers/currency";
import { addNumbers, formatNumber, roundTo } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEqual } from "lodash";
import { VND_CURRENCY } from "models/Payment";
import {
  GoodServiceByCategory,
  PurchaseRequestDetailModel,
} from "models/PurchaseRequest";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Drawer,
  FormItem,
  InputNumber,
  InputText,
  ModalConfirm,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import { convertPriceToVND } from "../../helper";
import "./GoodsServiceDrawer.scss";

type Props = {
  visible?: boolean;
  onPressClose?: () => void;
  data?: GoodServiceByCategory;
  onPressSave?: (data: GoodServiceByCategory) => void;
};

// chỉ định thầu không qua thẩm định
const CONTRACTOR_APPOINTMENT_WITHOUT_APPRAISAL = 2;

const GoodsServiceDrawer = ({
  visible,
  onPressClose,
  data,
  onPressSave,
}: Props) => {
  const [translate] = useTranslation();

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const effectRunCount = useRef(0);

  const {
    model: modelMaster,
    exchangeRateNumberType,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  const { model, dispatch } = detailService.useModel<GoodServiceByCategory>(
    GoodServiceByCategory,
    data
  );

  useEffect(() => {
    effectRunCount.current = 0;
    handleChangeAllField(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const currencyCode = modelMaster?.purchaseProposalId?.currency?.code;

  const isRequireBranch =
    modelMaster?.purchaseProposalId?.contractorAppointment
      ?.appointmentMethod === CONTRACTOR_APPOINTMENT_WITHOUT_APPRAISAL;
  const currentRate = useMemo(() => {
    if (isEqual(currencyCode, VND_CURRENCY)) {
      return 1;
    }
    return modelMaster?.purchaseProposalId.rateInfoJson?.rate;
  }, [modelMaster?.purchaseProposalId.rateInfoJson?.rate, currencyCode]);

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
  } = fieldService.useField(model, dispatch);

  useEffect(() => {
    if (effectRunCount.current >= 1) {
      const taxAmount = roundTo(
        (model?.quantity * model?.unitPrice * model?.tax?.rate) / 100,
        2
      );
      handleChangeSingleField({
        fieldName: "taxAmount",
      })(
        !detectIntegerCurrency(currencyCode) ? taxAmount : Math.round(taxAmount)
      );
    }
    effectRunCount.current += 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.quantity, model?.unitPrice, model?.tax]);

  const validate = () => {
    let requiredFields = ["unitPrice"];
    if (isRequireBranch) {
      requiredFields = [...requiredFields, "branch"];
    }
    const errors = requiredFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (!model?.[field]) {
          acc[field] = translate("CM.input_require_validation");
        }
        return acc;
      },
      {}
    );

    // Kiểm tra riêng cho quantity để cho phép giá trị 0
    if (
      isEqual(model?.quantity, undefined) ||
      isEqual(model?.quantity, null) ||
      isEqual(model?.quantity, "")
    ) {
      errors["quantity"] = translate("CM.input_require_validation");
    }
    if (Object.keys(errors).length > 0) {
      handleChangeAllField({
        ...model,
        errors: {
          ...model?.errors,
          ...errors,
        },
      });
      return false;
    }
    const maxLengthFields = ["description", "note"];
    for (const field of maxLengthFields) {
      if (model[field]?.length > 500) {
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }
    const newData = {
      ...model,
      totalAmount: getTotalAmount(),
      totalConvertedAmount: convertPriceToVND(getTotalAmount(), currentRate)
        .value,
    };
    onPressSave(newData);

    onPressClose();
  };

  const getAmountBeforeTax = () => {
    const amountBeforeTax = (model?.unitPrice || 0) * (model?.quantity || 0);
    if (!detectIntegerCurrency(currencyCode)) {
      return roundTo(amountBeforeTax, 2);
    }
    return Math.round(amountBeforeTax);
  };

  const getTotalAmount = () => {
    const totalAmount = addNumbers(
      getAmountBeforeTax(),
      model.taxAmount || 0,
      model.otherAmount || 0
    );
    if (!detectIntegerCurrency(currencyCode)) {
      return roundTo(totalAmount, 4);
    }
    return Math.round(totalAmount);
  };

  const handleDeleteRow = () => {
    const editSelectedGoods = modelMaster?.purchaseItems?.filter(
      (item: GoodServiceByCategory) => !isEqual(item?.id, model?.id)
    );
    handleChangeSingleFieldMaster({
      fieldName: "purchaseItems",
    })(editSelectedGoods);
    onPressClose();
  };

  const renderCreateEdit = () => {
    return (
      <>
        <div className="row g-2">
          <div className="col-4">
            <InputText
              isSmall={false}
              label={translate("PR.drawer_goods_code")}
              value={model?.code}
              readOnly
            />
          </div>
          <div className="col-8 position-relative">
            <InputText
              isSmall={false}
              label={translate("PR.drawer_goods_name")}
              value={model?.name}
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <FormItem
              validateObject={utilService.getValidateObj(model, "branch")}
            >
              <Select
                appendToBody
                isRequired={isRequireBranch}
                isSearch
                searchType=""
                searchProperty="search"
                valueFilter={{
                  name: "",
                }}
                isEnumerable={false}
                isSmall={false}
                label={translate("PR.drawer_manufacturer_or_category")}
                placeHolder={translate("PR.btn_choice")}
                classFilter={undefined}
                getList={proposalRepository.getManufactureList}
                onChange={handleChangeSelectField({
                  fieldName: "branch",
                })}
                value={model?.branch}
              />
            </FormItem>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <FormItem>
              <TextArea
                label={translate("PR.drawer_goods_description")}
                placeHolder={translate("PP.drawer_enter_description")}
                showCount
                maxLength={4000}
                resize="none"
                onChange={handleChangeSingleField({ fieldName: "description" })}
                value={model?.description}
                translate={translate}
              />
            </FormItem>
          </div>
        </div>
        <div className="row g-2">
          <div className="col-4">
            <FormItem
              validateObject={utilService.getValidateObj(model, "quantity")}
            >
              <InputNumber
                isSmall={false}
                isRequired
                label={translate("PR.quantity")}
                numberType={"DECIMAL"}
                max={NUMBER_MAX_13}
                onChange={handleChangeSingleField({ fieldName: "quantity" })}
                value={model?.quantity}
                translate={translate}
              />
            </FormItem>
          </div>
          <div className="col-4">
            <InputText
              isSmall={false}
              label={translate("PR.unit")}
              value={model?.unit?.name}
              readOnly
            />
          </div>
          <div className="col-4">
            <FormItem
              validateObject={utilService.getValidateObj(model, "unitPrice")}
            >
              <InputNumber
                isSmall={false}
                isRequired
                label={translate("PR.unit_price")}
                numberType={exchangeRateNumberType}
                max={NUMBER_MAX_13}
                onChange={handleChangeSingleField({ fieldName: "unitPrice" })}
                value={model?.unitPrice}
                translate={translate}
              />
            </FormItem>
          </div>
        </div>
        <div className="row g-2">
          <div className="col-4">
            <FormItem>
              <Select
                isSearch
                searchProperty="search"
                searchType=""
                valueFilter={{
                  search: "",
                }}
                appendToBody
                isSmall={false}
                isEnumerable={false}
                label={translate("PR.drawer_tax_type")}
                placeHolder={translate("PR.btn_choice")}
                classFilter={undefined}
                getList={proposalRepository.getTypeTaxList}
                onChange={handleChangeSelectField({
                  fieldName: "tax",
                })}
                value={model?.tax}
              />
            </FormItem>
          </div>
          <div className="col-4">
            <FormItem>
              <InputNumber
                disabled={!model?.tax}
                isSmall={false}
                label={translate("PR.drawer_tax_amount")}
                placeHolder={"0"}
                max={NUMBER_MAX_13}
                numberType={exchangeRateNumberType}
                value={model.taxAmount}
                onChange={handleChangeSingleField({
                  fieldName: "taxAmount",
                })}
              />
            </FormItem>
          </div>
          <div className="col-4">
            <FormItem>
              <InputNumber
                isSmall={false}
                label={translate("PR.drawer_other_costs")}
                max={NUMBER_MAX_13}
                numberType={exchangeRateNumberType}
                onChange={handleChangeSingleField({ fieldName: "otherAmount" })}
                value={model?.otherAmount}
              />
            </FormItem>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <FormItem>
              <TextArea
                label={translate("PR.note")}
                placeHolder={translate("PR.enter_note")}
                showCount
                maxLength={500}
                resize="none"
                onChange={handleChangeSingleField({ fieldName: "note" })}
                value={model?.note}
                translate={translate}
              />
            </FormItem>
          </div>
        </div>
      </>
    );
  };

  const renderDetail = () => {
    return (
      <div className="detail_info">
        <Row className="item_row">
          <Col span={16} className="item_col bg_disable">
            <span className="label">{data?.code}</span>
            <span className="value text_blue">{data?.name}</span>
          </Col>
          <Col span={8} className="item_col bg_disable">
            <span className="label">
              {translate("PP.drawer_txt_manufacture")}
            </span>
            <span className="value ">{data?.branch?.name || "---"}</span>
          </Col>
        </Row>
        <Row className="item_row">
          <Col span={8} className="item_col">
            <span className="label">{translate("PP.drawer_txt_amount")}</span>
            <span className="value text_blue">
              {formatNumber(data?.quantity)}
            </span>
          </Col>
          <Col span={8} className="item_col">
            <span className="label">{translate("PP.drawer_txt_unit")}</span>
            <span className="value ">{data?.unit?.name}</span>
          </Col>
          <Col span={8} className="item_col">
            <span className="label">{translate("PP.text_unit_price")}</span>
            <span className="value">
              {formatNumber(data?.unitPrice)}{" "}
              <span className="txt-10-500">{currencyCode}</span>
            </span>
          </Col>
        </Row>
        <Row className="item_row">
          <Col span={8} className="item_col">
            <span className="label">{translate("PP.drawer_txt_tax_type")}</span>
            <span className="value text_blue">{data?.tax?.name ?? "---"}</span>
          </Col>
          <Col span={8} className="item_col">
            <span className="label">
              {translate("PP.drawer_txt_tax_value")}
            </span>
            <span className="value ">
              {formatNumber(data?.taxAmount)}{" "}
              <span className="txt-10-500">{currencyCode}</span>
            </span>
          </Col>
          <Col span={8} className="item_col">
            <span className="label">
              {translate("PP.drawer_txt_other_price")}
            </span>
            <span className="value">
              {formatNumber(data?.otherAmount)}{" "}
              <span className="txt-10-500">{currencyCode}</span>
            </span>
          </Col>
        </Row>
        <Row className="item_row">
          <Col span={24} className="item_col">
            <span className="label">{translate("PP.text_description")}</span>
            <span className="value">{data?.description || "---"}</span>
          </Col>
        </Row>
        <Row className="item_row">
          <Col span={24} className="item_col">
            <span className="label">{translate("PP.drawer_txt_note")}</span>
            <span className="value">{data?.note || "---"}</span>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Drawer
      numberButton={"2"}
      visible={visible}
      size={"2xl"}
      loading={false}
      titleButtonCancel={translate("PR.drawer_btn_delete_goods")}
      titleButtonApply={translate("PR.drawer_btn_save")}
      handleCancel={() => setOpenModalConfirmDeleteAll(true)}
      handleClose={onPressClose}
      handleSave={handleSave}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={false}
      visibleFooter={!modelMaster?.isDetail}
      title={
        <div>
          <span>{translate("PR.drawer_title_detail_goods_services")}</span>
        </div>
      }
    >
      <div className="good-service-drawer-wrapper">
        <div className="d-flex row top g-0">
          <BoxItem
            title={translate("PR.drawer_pre_tax_amount")}
            price={formatNumber(getAmountBeforeTax())}
            currency={currencyCode}
            covertPrice={
              convertPriceToVND(getAmountBeforeTax(), currentRate).display
            }
          />
          <BoxItem
            title={translate("PR.drawer_tax")}
            currency={currencyCode}
            price={formatNumber(
              roundTo(
                model.taxAmount || 0,
                detectIntegerCurrency(currencyCode) ? 0 : 4
              )
            )}
            covertPrice={
              convertPriceToVND(roundTo(model.taxAmount || 0, 0), currentRate)
                .display
            }
          />
          <BoxItem
            title={translate("PR.drawer_total_amount")}
            price={formatNumber(getTotalAmount())}
            currency={currencyCode}
            covertPrice={
              convertPriceToVND(getTotalAmount(), currentRate).display
            }
          />
        </div>
        {modelMaster?.isDetail ? renderDetail() : renderCreateEdit()}
        <ModalConfirm
          open={openModalConfirmDeleteAll}
          icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
          title={translate("PR.confirm_delete_goods_services")}
          content={translate("PR.delete_warning")}
          titleButtonCancel={translate("PM.cancel_btn_label")}
          titleButtonApply={translate("PM.confirm_btn_label")}
          handleSave={handleDeleteRow}
          handleCancel={() => setOpenModalConfirmDeleteAll(false)}
        />
      </div>
    </Drawer>
  );
};

export default GoodsServiceDrawer;

type BoxItemProps = {
  title?: string;
  price?: string;
  covertPrice?: string;
  currency?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const BoxItem: React.FC<BoxItemProps> = ({
  title,
  price,
  covertPrice,
  currency,
  className,
}: BoxItemProps) => {
  return (
    <div className={`col-4 box-item ${className}`}>
      <span className="txt-12-400">{title}</span> <br />
      <span className="txt-14-500">{price}</span>{" "}
      <span className="txt-10-500">{currency}</span>
      <br />
      {covertPrice &&
        !isEqual(currency?.toLowerCase(), VND_CURRENCY.toLowerCase()) && (
          <div>
            <span className="txt-12-400">{covertPrice}</span>{" "}
            <span className="txt-10-500">{VND_CURRENCY}</span>
          </div>
        )}
    </div>
  );
};
