import { Col, Row } from "antd";
import { DeleteRoundIcon, IcArrowsCounterClockwise } from "assets/icons";
import { NUMBER_MAX_13 } from "config/const";
import { VND_CURRENCY_UNIT } from "core/config/consts";
import { toFixedByCurrency } from "core/helpers/calculator";
import { addNumbers, formatNumber, roundTo } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEqual } from "lodash";
import { JPY_CURRENCY, VND_CURRENCY } from "models/Payment";
import { ProposalCreateModel, RateInfoModel } from "models/Proposal";
import { GoodServiceExtend } from "models/Proposal/GoodService";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { InventoryCheckingContentfilter } from "pages/PurchasePage/ProposalPage/ProposalDetail/Components/InventoryCheckingModal/InventoryCheckingModalHook";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Drawer,
  FormItem,
  InputNumber,
  InputText,
  ModalConfirm,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  calculate,
  convertPriceToVND,
  formatNumberToCurrency,
} from "../../../../helper";
import { ROUND_NUM_CALCULATE_NOT_VND, ROUND_NUM_NOT_VND } from "../../helper";
import "./GoodServiceDrawer.scss";

type Props = {
  visible?: boolean;
  onPressClose?: () => void;
  data?: GoodServiceExtend;
  onPressSave?: (data: GoodServiceExtend) => void;
  rateInfo?: RateInfoModel;
  handleLoadListContent?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    goodService?: any,
    filterParam?: InventoryCheckingContentfilter
  ) => void;
};

const GoodServiceDrawer = ({
  visible,
  onPressClose,
  data,
  onPressSave,
  handleLoadListContent,
}: Props) => {
  const [translate] = useTranslation();

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);

  const effectRunCount = useRef(0);

  const {
    model: modelMaster,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const { model, dispatch } =
    detailService.useModel<GoodServiceExtend>(GoodServiceExtend);

  const isVND = isEqual(modelMaster?.currency?.code, VND_CURRENCY);

  const isJYPCurrency = useMemo(
    () => isEqual(modelMaster?.currency?.code, JPY_CURRENCY),
    [modelMaster?.currency?.code]
  );

  const roundNum = isVND || isJYPCurrency ? 0 : ROUND_NUM_NOT_VND;

  const roundNumCalculate =
    isVND || isJYPCurrency ? 0 : ROUND_NUM_CALCULATE_NOT_VND;

  const numberType = isVND || isJYPCurrency ? "LONG" : "DECIMAL";

  const currentRate = useMemo(() => {
    if (isVND) {
      return 1;
    }
    return modelMaster?.rateInfo?.rate;
  }, [isVND, modelMaster?.rateInfo?.rate]);

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
  } = fieldService.useField(model, dispatch);

  useEffect(() => {
    if (effectRunCount.current >= 1) {
      const taxAmount = roundTo(
        calculate(
          [model?.tax?.rate / 100, model?.quantity, model?.unitPrice],
          roundNumCalculate
        )?.value,
        roundNumCalculate
      );
      handleChangeSingleField({
        fieldName: "taxAmount",
      })(taxAmount);
    }
    effectRunCount.current += 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.quantity, model?.unitPrice, model?.tax]);

  useEffect(() => {
    effectRunCount.current = 0;
    handleChangeAllField({
      ...data,
      unitPrice: roundTo(data?.unitPrice, roundNum),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (effectRunCount.current >= 1) {
      const unitPrice = roundTo(model?.unitPrice, roundNum);
      handleChangeSingleField({
        fieldName: "unitPrice",
      })(unitPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelMaster?.currency?.code]);

  const validate = () => {
    if (
      !model?.unitPrice ||
      !model?.quantity ||
      // !model?.manufacturer ||
      !model?.goodsServiceUnit
    ) {
      handleChangeAllField({
        ...model,
        errors: {
          ...model.errors,
          unitPrice: model?.unitPrice
            ? undefined
            : translate("CM.input_require_validation"),
          quantity: model?.quantity
            ? undefined
            : translate("CM.input_require_validation"),
          manufacturer: model?.manufacturer
            ? undefined
            : translate("CM.input_require_validation"),
          goodsServiceUnit: model?.goodsServiceUnit
            ? undefined
            : translate("CM.input_require_validation"),
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
    onPressSave?.({
      ...model,
      amountBeforeTax: roundTo(amountBeforeTax?.value, roundNumCalculate),
      totalAmount: totalAmount,
    });
    onPressClose();
  };

  const amountBeforeTax = calculate(
    [model?.unitPrice, model?.quantity],
    roundNumCalculate
  );

  const convertedAmountBeforeTax = convertPriceToVND(
    amountBeforeTax?.value,
    currentRate
  );

  const taxConvertedAmount = convertPriceToVND(
    roundTo(model?.taxAmount, roundNum),
    currentRate
  );

  const totalAmount = addNumbers(
    roundTo(amountBeforeTax?.value, roundNumCalculate),
    model?.taxAmount || 0,
    model?.otherAmount || 0
  );

  // update from develop
  const totalConvertedAmount = formatNumber(
    Math.round(
      (amountBeforeTax?.value || 0) * currentRate +
        toFixedByCurrency(
          (model?.taxAmount || 0) * currentRate,
          VND_CURRENCY_UNIT
        ) +
        toFixedByCurrency(
          (model?.otherAmount || 0) * currentRate,
          VND_CURRENCY_UNIT
        )
    )
  );

  const handleDeleteRow = () => {
    const editSelectedGoods = modelMaster?.selectedListGoodsServices?.filter(
      (item: GoodServiceExtend) => !isEqual(item?.renderId, model?.renderId)
    );
    handleChangeSingleFieldMaster({
      fieldName: "selectedListGoodsServices",
    })(editSelectedGoods);
    onPressClose();
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
            <span className="value ">{data?.manufacturer?.name ?? "---"}</span>
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
            <span className="value ">{data?.goodsServiceUnit?.name}</span>
          </Col>
          <Col span={8} className="item_col">
            <span className="label">{translate("PP.text_unit_price")}</span>
            <span className="value">
              {formatNumber(data?.unitPrice)}{" "}
              <span className="txt-10-500">{modelMaster?.currency?.code}</span>
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
              <span className="txt-10-500">{modelMaster?.currency?.code}</span>
            </span>
          </Col>
          <Col span={8} className="item_col">
            <span className="label">
              {translate("PP.drawer_txt_other_price")}
            </span>
            <span className="value">
              {formatNumber(data?.otherAmount)}{" "}
              <span className="txt-10-500">{modelMaster?.currency?.code}</span>
            </span>
          </Col>
        </Row>
        <Row className="item_row">
          <Col span={24} className="item_col">
            <span className="label">{translate("PP.text_description")}</span>
            <span className="value">{data?.description}</span>
          </Col>
        </Row>
        <Row className="item_row">
          <Col span={24} className="item_col">
            <span className="label">{translate("PP.drawer_txt_note")}</span>
            <span className="value">{data?.note}</span>
          </Col>
        </Row>
      </div>
    );
  };

  const renderCreateEdit = () => {
    return (
      <>
        <div className="row g-2">
          <div className="col-4">
            <InputText
              isSmall={false}
              label={translate("PP.drawer_txt_good_code")}
              value={model?.code}
              readOnly
            />
          </div>
          <div className="col-8 position-relative">
            {data?.isChecked ? (
              <Button
                className={"btn-check-asset"}
                type={"text"}
                icon={
                  <img
                    src={IcArrowsCounterClockwise}
                    alt=""
                    width={16}
                    height={16}
                  />
                }
                iconPlace={"left"}
                onClick={() =>
                  handleLoadListContent(
                    {
                      categoryCode: data?.code,
                      quantity: model?.quantity || 0,
                    },
                    new InventoryCheckingContentfilter()
                  )
                }
              >
                {translate("PP.txt_btn_check_asset")}
              </Button>
            ) : null}
            <InputText
              isSmall={false}
              label={translate("PP.drawer_txt_good_name")}
              value={model?.name}
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <FormItem
            // validateObject={utilService.getValidateObj(model, "manufacturer")}
            >
              <Select
                appendToBody
                // isRequired
                isSearch
                searchProperty="search"
                valueFilter={{
                  search: "",
                  isActive: true,
                }}
                isSmall={false}
                searchType=""
                isEnumerable={false}
                label={translate("PP.drawer_txt_manufacture")}
                placeHolder={translate("PP.drawer_txt_choose")}
                classFilter={undefined}
                getList={proposalRepository.getManufactureList}
                onChange={(_, record) => {
                  handleChangeSingleField({
                    fieldName: "manufacturer",
                  })(record);
                }}
                value={model?.manufacturer}
              />
            </FormItem>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <FormItem>
              <TextArea
                label={translate("PP.drawer_txt_description")}
                placeHolder={translate("PP.drawer_enter_description")}
                showCount
                maxLength={4000}
                resize="none"
                onChange={handleChangeSingleField({
                  fieldName: "description",
                })}
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
                label={translate("PP.drawer_txt_amount")}
                placeHolder={translate("PP.drawer_txt_enter_amount")}
                numberType={"DECIMAL"}
                max={NUMBER_MAX_13}
                onChange={handleChangeSingleField({ fieldName: "quantity" })}
                value={model?.quantity}
                translate={translate}
              />
            </FormItem>
          </div>
          <div className="col-4">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "goodsServiceUnit"
              )}
            >
              <Select
                isRequired
                isSearch
                searchProperty="search"
                valueFilter={{
                  search: "",
                  isActive: true,
                }}
                isSmall={false}
                searchType=""
                isEnumerable={false}
                label={translate("PP.drawer_txt_unit")}
                placeHolder={translate("PP.drawer_txt_choose_unit")}
                classFilter={undefined}
                getList={proposalRepository.getUnitList}
                onChange={(_, record) => {
                  handleChangeSingleField({
                    fieldName: "goodsServiceUnit",
                  })(record);
                }}
                value={model?.goodsServiceUnit}
              />
            </FormItem>
          </div>
          <div className="col-4">
            <FormItem
              validateObject={utilService.getValidateObj(model, "unitPrice")}
            >
              <InputNumber
                isSmall={false}
                isRequired
                label={translate("PP.drawer_txt_unit_price")}
                placeHolder={translate("PP.drawer_txt_enter_unit_price")}
                numberType={numberType}
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
                valueFilter={{
                  search: "",
                }}
                appendToBody
                isSmall={false}
                searchType=""
                isEnumerable={false}
                label={translate("PP.drawer_txt_tax_type")}
                placeHolder={translate("PP.drawer_txt_choose_tax_type")}
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
                label={translate("PP.drawer_txt_tax_value")}
                placeHolder={"0"}
                max={NUMBER_MAX_13}
                numberType={numberType}
                value={model?.taxAmount}
                onChange={handleChangeSingleField({
                  fieldName: "taxAmount",
                })}
                translate={translate}
              />
            </FormItem>
          </div>
          <div className="col-4">
            <FormItem>
              <InputNumber
                isSmall={false}
                label={translate("PP.drawer_txt_other_price")}
                placeHolder={translate("PP.drawer_txt_enter_other_price")}
                max={NUMBER_MAX_13}
                numberType={numberType}
                onChange={handleChangeSingleField({
                  fieldName: "otherAmount",
                })}
                value={model?.otherAmount}
              />
            </FormItem>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <FormItem>
              <TextArea
                label={translate("PP.drawer_txt_note")}
                placeHolder={translate("PP.drawer_enter_txt_note")}
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

  return (
    <Drawer
      visible={visible}
      size={"2xl"}
      loading={false}
      titleButtonCancel={translate("PP.drawer_btn_delete_goods")}
      titleButtonApply={translate("PP.drawer_btn_save")}
      handleCancel={() => setOpenModalConfirmDeleteAll(true)}
      handleClose={onPressClose}
      handleSave={handleSave}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={false}
      visibleFooter={!modelMaster?.isDetail}
      disableButtonCancel={data?.notEdit}
      title={
        <div>
          <span>{translate("PP.drawer_title_detail_goods_services")}</span>
        </div>
      }
    >
      <div className="good-service-drawer-wrapper">
        <div className="d-flex row top g-0">
          <BoxItem
            title={translate("PP.drawer_txt_become_price_before_tax")}
            price={amountBeforeTax.display}
            currency={modelMaster?.currency?.code}
            covertPrice={convertedAmountBeforeTax?.display}
          />
          <BoxItem
            title={translate("PP.drawer_txt_tax")}
            price={formatNumberToCurrency(model?.taxAmount, roundNum)}
            currency={modelMaster?.currency?.code}
            covertPrice={taxConvertedAmount?.display}
          />
          <BoxItem
            title={translate("PP.drawer_txt_total")}
            price={formatNumberToCurrency(totalAmount, roundNum)}
            currency={modelMaster?.currency?.code}
            covertPrice={totalConvertedAmount}
          />
        </div>
        {modelMaster?.isDetail ? renderDetail() : renderCreateEdit()}
        <ModalConfirm
          open={openModalConfirmDeleteAll}
          icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
          title={translate("PP.modal_confirm_title")}
          content={translate("PP.modal_confirm_content")}
          titleButtonCancel={translate("PM.cancel_btn_label")}
          titleButtonApply={translate("PM.confirm_btn_label")}
          handleSave={handleDeleteRow}
          handleCancel={() => setOpenModalConfirmDeleteAll(false)}
        />
      </div>
    </Drawer>
  );
};

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
        !isEqual(currency?.toLowerCase(), VND_CURRENCY?.toLowerCase()) && (
          <div>
            <span className="txt-12-400">{covertPrice}</span>{" "}
            <span className="txt-10-500">{VND_CURRENCY}</span>
          </div>
        )}
    </div>
  );
};

export default GoodServiceDrawer;
