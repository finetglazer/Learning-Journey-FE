import { Col, Row } from "antd";
import { DeleteRoundIcon } from "assets/icons";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import CommonFilter from "models/CommonFilter";
import { ContractDetailModel, ContractGoodsServices } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { useContext, useEffect, useState } from "react";
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
import "./GoodsServicesDetailsDrawerPrinciple.scss";
import { formatNumber } from "core/helpers/number";

const GoodsServicesDetailsDrawerPrinciple = () => {
  const [translate] = useTranslation();

  const {
    model: modelMaster,
    selectedDetailGoodsServices,
    selectedDetailGoodsServicesId,
    setSelectedDetailGoodsServicesId,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);
  const {
    model: modelDetailGoodsServices,
    dispatch: dispatchDetailGoodsServices,
  } = detailService.useModel<ContractGoodsServices>(
    ContractGoodsServices,
    selectedDetailGoodsServices
  );

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
  } = fieldService.useField(
    modelDetailGoodsServices,
    dispatchDetailGoodsServices
  );

  useEffect(() => {
    handleChangeAllField(selectedDetailGoodsServices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDetailGoodsServices]);

  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);

  const handleDeleteDetailGoodsServices = () => {
    const newContractGoodsServicesList =
      modelMaster?.contractGoodsServicesList?.filter(
        (item: ContractGoodsServices) => {
          return item?.id !== modelDetailGoodsServices?.id;
        }
      );

    handleChangeSingleFieldMaster({
      fieldName: "contractGoodsServicesList",
    })(newContractGoodsServicesList);
    setIsOpenModalConfirmDelete(false);
    handleCancel();
  };

  const handleCancel = () => {
    setSelectedDetailGoodsServicesId(undefined);
  };

  const validate = () => {
    const maxLengthFields = [
      { field: "description", maxLength: 1000 },
      { field: "note", maxLength: 500 },
    ];

    for (const { field, maxLength } of maxLengthFields) {
      if (modelDetailGoodsServices[field]?.length > maxLength) {
        return false;
      }
    }
    return true;
  };

  const handleSaveGoodsServicesDetailsDrawer = () => {
    if (!validate()) {
      return;
    }
    const newContractGoodsServicesList =
      modelMaster?.contractGoodsServicesList?.map(
        (item: ContractGoodsServices) => {
          if (item?.id === modelDetailGoodsServices?.id) {
            return modelDetailGoodsServices;
          }
          return item;
        }
      );
    handleChangeSingleFieldMaster({
      fieldName: "contractGoodsServicesList",
    })(newContractGoodsServicesList);
    handleCancel();
  };

  if (!selectedDetailGoodsServicesId) return null;

  const renderBodyCreate = () => {
    return (
      <div className="body">
        <Row gutter={12}>
          <Col lg={12}>
            <InputText
              isSmall={false}
              readOnly
              label={translate("CT.create_contract.drawer_goods_code")}
              value={modelDetailGoodsServices?.code}
            />
          </Col>
          <Col lg={12}>
            <InputText
              isSmall={false}
              readOnly
              label={translate("CT.create_contract.drawer_goods_name")}
              value={modelDetailGoodsServices?.name}
            />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={12}>
            <InputText
              isSmall={false}
              readOnly
              label={translate("CT.unit")}
              value={modelDetailGoodsServices?.unit?.name}
            />
          </Col>
          <Col lg={12}>
            <InputText
              isSmall={false}
              readOnly
              label={translate(
                "CT.create_contract.drawer_manufacturer_or_category"
              )}
              value={modelDetailGoodsServices?.branch?.name}
            />
          </Col>
        </Row>
        <Col lg={24}>
          <FormItem>
            <TextArea
              label={translate("CT.description_of_goods_and_services")}
              placeHolder={translate(
                "CT.enter_description_of_goods_and_services"
              )}
              showCount
              maxLength={4000}
              resize="none"
              onChange={handleChangeSingleField({
                fieldName: "description",
              })}
              value={modelDetailGoodsServices?.description}
              translate={translate}
            />
          </FormItem>
        </Col>
        <Col lg={24}>
          <FormItem>
            <InputText
              isSmall={false}
              label={translate("CT.note")}
              placeHolder={translate("CT.enter_note")}
              maxLength={500}
              value={modelDetailGoodsServices?.note}
              onChange={handleChangeSingleField({
                fieldName: "note",
              })}
              translate={translate}
            />
          </FormItem>
        </Col>
        <Row gutter={12}>
          <Col lg={12}>
            <InputNumber
              isSmall={false}
              readOnly
              label={translate("CT.unit_price")}
              value={modelDetailGoodsServices?.unitPrice}
              suffix={modelMaster?.currency}
              numberType={getNumberTypeByCurrency(modelMaster?.currency)}
            />
          </Col>
          <Col lg={12}>
            <Select
              label={translate("CT.create_contract.drawer_tax_rate")}
              placeHolder={translate("CT.select_tax")}
              getList={contractRepository.getTaxList}
              classFilter={CommonFilter}
              isSmall={false}
              isSearch
              appendToBody
              isEnumerable={false}
              value={modelDetailGoodsServices?.tax}
              onChange={handleChangeSelectField({
                fieldName: "tax",
              })}
              render={(tax) => (tax?.id ? `${tax?.code} - ${tax?.name}` : null)}
            />
          </Col>
        </Row>
      </div>
    );
  };

  const renderBodyDetail = () => {
    return (
      <div className="detail_info">
        <Row className="item_row">
          <Col span={8} className="item_col bg_disable">
            <span className="label">
              {translate("CT.create_contract.drawer_goods_code")}
            </span>
            <span className="value">{modelDetailGoodsServices?.name}</span>
          </Col>
          <Col span={8} className="item_col bg_disable">
            <span className="label">
              {translate("CT.create_contract.drawer_goods_name")}
            </span>
            <span className="value ">
              {modelDetailGoodsServices?.name || "---"}
            </span>
          </Col>
          <Col span={8} className="item_col bg_disable">
            <span className="label">
              {translate("PP.drawer_txt_manufacture")}
            </span>
            <span className="value">
              {modelDetailGoodsServices?.branch?.name || "---"}
            </span>
          </Col>
        </Row>
        <Row className="item_row">
          <Col span={8} className="item_col">
            <span className="label">{translate("CT.unit")}</span>
            <span className="value">
              {modelDetailGoodsServices?.unit?.name}
            </span>
          </Col>
          <Col span={16} className="item_col">
            <span className="label">
              {translate("CT.description_of_goods_and_services")}
            </span>
            <span className="value">
              {modelDetailGoodsServices?.description || "---"}
            </span>
          </Col>
        </Row>
        <Row className="item_row">
          <Col span={8} className="item_col bg_disable">
            <span className="label">{translate("CT.unit_price")}</span>
            <span className="value">
              {formatNumber(modelDetailGoodsServices?.unitPrice)}
              <span className="label"> {modelMaster?.currency}</span>
            </span>
          </Col>
          <Col span={16} className="item_col bg_disable">
            <span className="label">
              {translate("CT.create_contract.drawer_tax_rate")}
            </span>
            {modelDetailGoodsServices?.tax?.name ? (
              <span className="value">
                {modelDetailGoodsServices?.tax?.name}{" "}
                <span className="label">%</span>
              </span>
            ) : (
              <span className="value">---</span>
            )}
          </Col>
        </Row>
        <Row className="item_row">
          <Col span={24} className="item_col">
            <span className="label">{translate("CT.note")}</span>
            <span className="value">
              {modelDetailGoodsServices?.note || "---"}
            </span>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <>
      <Drawer
        visible={!!selectedDetailGoodsServicesId}
        size={"2xl"}
        loading={false}
        isHaveCloseIcon={true}
        hasOverlay={true}
        className="goods-services-principle__container"
        visibleFooter={!modelMaster?.isDetail}
        title={
          <div>
            <span className={"fw-semibold"}>
              {translate(
                "CT.create_contract.title.drawer_title_detail_goods_services"
              )}
            </span>
          </div>
        }
        titleButtonCancel={translate(
          "CT.create_contract.drawer_btn_delete_goods"
        )}
        titleButtonApply={translate("CT.create_contract.drawer_btn_save")}
        handleClose={handleCancel}
        handleCancel={() => setIsOpenModalConfirmDelete(true)}
        handleSave={handleSaveGoodsServicesDetailsDrawer}
      >
        <div className="good-service-drawer-wrapper">
          {modelMaster?.isDetail ? renderBodyDetail() : renderBodyCreate()}
        </div>
      </Drawer>
      <ModalConfirm
        open={isOpenModalConfirmDelete}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("CT.confirm_delete_goods_services")}
        content={translate("CT.delete_warning")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => handleDeleteDetailGoodsServices()}
        handleCancel={() => setIsOpenModalConfirmDelete(false)}
      />
    </>
  );
};

export default GoodsServicesDetailsDrawerPrinciple;
