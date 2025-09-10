import { Col, Row, Tooltip } from "antd";
import { utilService } from "core/services/common-services/util-service";
import {
  DatePicker,
  Drawer,
  FormItem,
  InputNumber,
  InputText,
  Select,
  TextArea,
} from "react-components-design-system";
import "./DrawerAssetDetail.scss";
import { useCallback, useContext, useEffect } from "react";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import {
  AssetItems,
  SettlementHookModel,
  SettlementType,
} from "models/Settlement";
import dayjs from "dayjs";
import useDebounceFn from "ahooks/lib/useDebounceFn";
import { settlementRepository } from "pages/SettlementPage/SettlementRepository";
import { AxiosError } from "axios";
import { NUMBER_MAX_13 } from "config/const";

interface Props {
  visible: boolean;
  handleClose: () => void;
  handleSave: () => void;
  recordEdit: AssetItems;
}

const DrawerAssetDetail = ({
  visible,
  handleClose,
  handleSave,
  recordEdit,
}: Props) => {
  const {
    translate,
    model,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeAllField,
  } = useContext<SettlementHookModel>(SettlementHookContext);

  const { run: runAsset } = useDebounceFn(() => getAssetClassifyInfo(), {
    wait: 800,
  });

  useEffect(() => {
    runAsset();
  }, [handleChangeAllField, model.originalPrice, runAsset]);

  const getAssetClassifyInfo = useCallback(() => {
    if (model.originalPrice) {
      settlementRepository
        .getAssetClassifyInfo({
          goodsId: recordEdit?.goods?.id,
          originalCost: model.originalPrice,
        })
        .subscribe({
          next: (data) => {
            handleChangeAllField({
              ...model,
              assetItemDepreciationMonthsDetail: data?.data?.depreciationMonths,
              assetItemClassifyDetail: data?.data?.classify,
            });
          },
          error: (error: AxiosError) => {
            console.log("Error");
          },
        });
    }
  }, [handleChangeAllField, model]);

  useEffect(() => {
    handleChangeAllField({
      ...model,
      assetItemDepreciationMonthsDetail: recordEdit.depreciationMonths,
      assetItemClassifyDetail: recordEdit.classify,
      originalPrice: recordEdit?.originalCost,
      dateOfUse: recordEdit?.usageStartDate,
      startDateDepreciation: recordEdit?.depreciationStartDate,
      noteAssets: recordEdit?.note,
      ownerOrganization: recordEdit?.ownerOrganization,
      ownerOrganizationId: recordEdit?.ownerOrganizationId,
      quantity: recordEdit?.quantity,
      ownerUser: recordEdit?.ownerUser,
      ownerUserId: recordEdit?.ownerUserId,
    });
  }, [recordEdit]);

  return (
    <div>
      <Drawer
        numberButton={"1"}
        visible={visible}
        size={"xl"}
        loading={false}
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.txt_save")}
        handleCancel={handleClose}
        handleClose={handleClose}
        handleSave={handleSave}
        isHaveCloseIcon={true}
        shouldCloseWhenClickOutSide={false}
        hasOverlay={true}
        title={
          <div className="fw-bold">
            <span>{translate("settlement.asset_info_detail_title")}</span>
          </div>
        }
        className="settlement-asset-info-drawer"
      >
        <div>
          <div className="asset-info-container">
            <div className="asset-grid">
              <div className="asset-item highlighted">
                <span className="label">
                  {translate("settlement.goods_services_code")}
                </span>
                <span className="value">{recordEdit?.goods?.code}</span>
              </div>
              <div className="asset-item highlighted">
                <span className="label">
                  {translate("settlement.goods_services_name")}
                </span>
                <Tooltip title={recordEdit?.goods?.name}>
                  <span className="value">{recordEdit?.goods?.name}</span>
                </Tooltip>
              </div>
              <div className="asset-item">
                <span className="label">
                  {translate("settlement.settlement_brand_or_type")}
                </span>
                <span className="value">{recordEdit?.branch?.name}</span>
              </div>
              <div className="asset-item">
                <span className="label">
                  {translate(
                    "settlement.settlement_description_goods_and_services"
                  )}
                </span>
                <Tooltip title={recordEdit?.goodsDescription}>
                  <span className="value">{recordEdit?.goodsDescription}</span>
                </Tooltip>
              </div>
              <div className="asset-item two-thirds">
                <span className="label">
                  {translate("settlement.goods_services_note")}
                </span>
                <Tooltip title={recordEdit?.goodsNote}>
                  <span className="value">{recordEdit?.goodsNote}</span>
                </Tooltip>
              </div>
              <div className="asset-item highlighted">
                <span className="label">
                  {translate("settlement.asset_code")}
                </span>
                <span className="value">{recordEdit?.code}</span>
              </div>
              <div className="asset-item highlighted">
                <span className="label">
                  {translate("settlement.asset_name")}
                </span>
                <span className="value">{recordEdit?.name}</span>
              </div>
              <div className="asset-item highlighted">
                <span className="label">
                  {translate("settlement.serial_number")}
                </span>
                <span className="value">{recordEdit?.serialNumber}</span>
              </div>
            </div>
          </div>
          <div className="p-t--sm">
            <Row gutter={12}>
              <Col lg={4}>
                <InputText
                  label={translate("settlement.settlement_type")}
                  value={
                    recordEdit?.type === 1
                      ? SettlementType?.NEW_PURCHASE
                      : SettlementType?.UPGRADE
                  }
                  readOnly
                  isSmall={false}
                />
              </Col>
              <Col lg={4}>
                <InputText
                  label={translate("settlement.origin_no")}
                  value={recordEdit?.originNo}
                  readOnly
                  isSmall={false}
                />
              </Col>
              <Col lg={8}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "ownerOrganization"
                  )}
                >
                  <Select
                    isRequired
                    isSmall={false}
                    label={translate("settlement.asset_unit_name")}
                    placeHolder={translate(
                      "settlement.placeholder_asset_unit_name"
                    )}
                    searchProperty="name"
                    searchType=""
                    isSearch
                    valueFilter={{
                      name: "",
                      isActive: true,
                    }}
                    getList={settlementRepository.getListOrganization}
                    onChange={(id, value) => {
                      handleChangeAllField({
                        ...model,
                        ownerOrganizationId: id,
                        ownerOrganization: value,
                        errors: {
                          ...model?.errors,
                          ownerOrganization: undefined,
                        },
                        ownerUserId: undefined,
                        ownerUser: undefined,
                      });
                    }}
                    value={model?.ownerOrganization}
                    classFilter={undefined}
                    render={(t) => (t ? t?.name : "")}
                    isEnumerable={false}
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "ownerUser"
                  )}
                >
                  <Select
                    isRequired
                    isSmall={false}
                    label={translate("settlement.asset_person_name")}
                    placeHolder={translate(
                      "settlement.placeholder_asset_person_name"
                    )}
                    searchProperty="name"
                    searchType=""
                    isSearch
                    valueFilter={{
                      name: "",
                      isActive: true,
                      organizationId: model?.ownerOrganization?.id,
                    }}
                    getList={settlementRepository.getListUser}
                    onChange={handleChangeSelectField({
                      fieldName: "ownerUser",
                    })}
                    value={model?.ownerUser}
                    classFilter={undefined}
                    render={(t) => (t ? `${t?.email} - ${t?.name}` : "")}
                    isEnumerable={false}
                    disabled={!model?.ownerOrganization?.id}
                  />
                </FormItem>
              </Col>
            </Row>
          </div>
          <div className="p-t--sm">
            <Row gutter={12}>
              <Col lg={8}>
                <FormItem
                  validateObject={utilService.getValidateObj(model, "quantity")}
                >
                  <InputNumber
                    isRequired
                    label={translate("settlement.settlement_quantity")}
                    placeHolder={translate("settlement.placeholder_quantity")}
                    onChange={handleChangeSingleField({
                      fieldName: "quantity",
                    })}
                    value={model?.quantity}
                    isSmall={false}
                    translate={translate}
                    max={NUMBER_MAX_13}
                    numberType={"LONG"}
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "dateOfUse"
                  )}
                >
                  <DatePicker
                    isRequired
                    label={translate("settlement.settlement_date_of_use")}
                    value={model.dateOfUse ? dayjs(model.dateOfUse) : undefined}
                    placeholder={"DD/MM/YYYY"}
                    size={"middle"}
                    onChange={handleChangeDateField({
                      fieldName: "dateOfUse",
                    })}
                    isSmall={false}
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "startDateDepreciation"
                  )}
                >
                  <DatePicker
                    isRequired
                    label={translate(
                      "settlement.settlement_start_date_depreciation"
                    )}
                    value={
                      model.startDateDepreciation
                        ? dayjs(model.startDateDepreciation)
                        : undefined
                    }
                    placeholder={"DD/MM/YYYY"}
                    size={"middle"}
                    onChange={handleChangeDateField({
                      fieldName: "startDateDepreciation",
                    })}
                    isSmall={false}
                  />
                </FormItem>
              </Col>
            </Row>
          </div>
          <div className="p-t--sm">
            <Row gutter={12}>
              <Col lg={8}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "originalPrice"
                  )}
                >
                  <InputNumber
                    label={translate("settlement.settlement_original_price")}
                    value={model?.originalPrice}
                    isRequired
                    isSmall={false}
                    onChange={handleChangeSingleField({
                      fieldName: "originalPrice",
                    })}
                    translate={translate}
                    suffix={"VND"}
                    max={NUMBER_MAX_13}
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                <InputText
                  label={translate("settlement.settlement_classify")}
                  placeHolder="---"
                  value={model?.assetItemClassifyDetail}
                  readOnly
                  isSmall={false}
                />
              </Col>
              <Col lg={8}>
                <InputNumber
                  label={translate(
                    "settlement.settlement_number_of_months_of_depreciation"
                  )}
                  placeHolder="---"
                  value={model?.assetItemDepreciationMonthsDetail}
                  readOnly
                  isSmall={false}
                />
              </Col>
            </Row>
          </div>
          <div className="p-t--sm">
            <FormItem
              validateObject={utilService.getValidateObj(model, "noteAssets")}
            >
              <TextArea
                label={translate("settlement.asset_note")}
                placeHolder={translate("settlement.asset_note_placeholder")}
                value={model?.noteAssets}
                showCount
                resize="none"
                maxLength={1000}
                onChange={handleChangeSingleField({
                  fieldName: "noteAssets",
                })}
                translate={translate}
              />
            </FormItem>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DrawerAssetDetail;
