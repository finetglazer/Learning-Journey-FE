/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row } from "antd";
import { utilService } from "core/services/common-services/util-service";
import {
  Button,
  DatePicker,
  Drawer,
  FormItem,
  InputNumber,
  InputText,
  Select,
  TextArea,
} from "react-components-design-system";
import "./DrawerCreateAsset.scss";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { AssetItems, SettlementHookModel } from "models/Settlement";
import { settlementRepository } from "pages/SettlementPage/SettlementRepository";
import { AxiosError } from "axios";
import { of } from "rxjs";
import { useDebounceFn } from "ahooks";
import { NUMBER_MAX_13 } from "config/const";
import dayjs from "dayjs";
import { CheckIconT } from "assets/icons";

interface Props {
  visible: boolean;
  handleClose: () => void;
  handleSave: () => void;
  handleDelete: () => void;
  recordEdit: AssetItems;
}

const DrawerCreateAsset = ({
  visible,
  handleClose,
  handleSave,
  handleDelete,
  recordEdit,
}: Props) => {
  const {
    translate,
    model,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeSelectField,
    handleChangeAllField,
  } = useContext<SettlementHookModel>(SettlementHookContext);

  const types = useMemo(
    () => [
      {
        id: 1,
        name: translate("settlement.txt_settlement_type_new_purchase"),
      },
      {
        id: 2,
        name: translate("settlement.txt_settlement_type_upggrade"),
      },
    ],
    [translate]
  );

  const getAssetClassifyInfo = () => {
    if (model?.assetItemOriginalCost >= 0 && model?.assetItemGoodsId) {
      settlementRepository
        .getAssetClassifyInfo({
          goodsId: model?.assetItemGoodsId?.id,
          originalCost: model?.assetItemOriginalCost,
        })
        .pipe()
        .subscribe({
          next: (data) => {
            handleChangeAllField({
              ...model,
              assetItemDepreciationMonths: data?.data?.depreciationMonths,
              assetItemClassify: data?.data?.classify,
              classifyType: data?.data?.classifyType,
            });
          },
          error: (error: AxiosError) => {
            console.log("Error");
          },
        });
    } else {
      handleChangeAllField({
        ...model,
        assetItemDepreciationMonths: undefined,
        assetItemClassify: undefined,
        classifyType: undefined,
      });
    }
  };

  const { run: runAsset } = useDebounceFn(() => getAssetClassifyInfo(), {
    wait: 500,
  });

  const [assetExist, setAssetExist] = useState<boolean>(!!recordEdit?.name);

  useEffect(() => {
    runAsset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.assetItemOriginalCost, model?.assetItemGoodsId]);

  useEffect(() => {
    if (recordEdit) {
      handleChangeAllField({
        ...model,
        assetItemCode: recordEdit?.code,
        assetItemName: recordEdit?.name,
        assetItemGoodsId: recordEdit?.goods,
        assetItemBranchId: recordEdit?.branch,
        assetItemGoodsDescription: recordEdit?.goodsDescription,
        assetItemGoodsNote: recordEdit?.goodsNote,
        ownerOrganization: recordEdit?.ownerOrganization,
        ownerUser: recordEdit?.ownerUser,
        assetItemOriginalCost: recordEdit?.originalCost,
        assetItemClassify: recordEdit?.classify,
        assetItemDepreciationMonths: recordEdit?.depreciationMonths,
        assetItemType: types.find((t) => t.id === recordEdit?.type),
        assetItemUsageStartDate: recordEdit?.usageStartDate,
        assetItemDepreciationStartDate: recordEdit?.depreciationStartDate,
        assetItemNote: recordEdit?.note,
        quantity: recordEdit?.quantity,
      });
    }
  }, [recordEdit]);

  useEffect(() => {
    if (model?.ownerOrganization) {
      const isHasOrganizationId =
        model?.ownerUser?.organizationId === model.ownerOrganization.id;
      if (!isHasOrganizationId) {
        handleChangeAllField({
          ...model,
          ownerUser: undefined,
        });
      }
    }
  }, [model?.ownerOrganization]);

  const handleCheckAsset = useCallback(() => {
    settlementRepository.checkAsset([...[], model.assetItemCode]).subscribe({
      next: (response: any) => {
        const assets = response?.data?.LIST_ASSET_INFO;
        if (assets && assets.length > 0) {
          const assetName = assets[0].ASSET_NAME;

          handleChangeAllField({
            ...model,
            assetItemName: assetName,
            serialNumber: assets[0].SERIAL_NUMBER,
            originNo: assets[0].ORIGIN_NO,
            assetItemOriginalCost: assets[0].ORIGINAL_PRICE,
            errors: {
              ...model?.errors,
              assetItemCode: undefined,
            },
          });
          setAssetExist(true);
        } else {
          handleChangeAllField({
            ...model,
            assetItemName: undefined,
            serialNumber: undefined,
            originNo: undefined,
            assetItemOriginalCost: undefined,
            errors: {
              ...model?.errors,
              assetItemCode: translate("CM.error_exist_asset"),
            },
          });
          setAssetExist(false);
        }
      },
      error: () => {
        handleChangeAllField({
          ...model,
          assetItemName: undefined,
          serialNumber: undefined,
          originNo: undefined,
          assetItemOriginalCost: undefined,
          errors: {
            ...model?.errors,
            assetItemCode: translate("CM.error_exist_asset"),
          },
        });
        setAssetExist(false);
      },
    });
  }, [handleChangeAllField, model, translate]);

  return (
    <div>
      <Drawer
        numberButton={"1"}
        visible={visible}
        size={"xl"}
        loading={false}
        handleClose={handleClose}
        isHaveCloseIcon={true}
        shouldCloseWhenClickOutSide={false}
        hasOverlay={true}
        title={
          <div className="fw-bold">
            <span>{translate("settlement.asset_info_detail_title")}</span>
          </div>
        }
        className="settlement-asset-info-drawer"
        footer={
          <footer>
            {recordEdit && (
              <Button type="text" onClick={handleDelete}>
                {translate("settlement.btn_delete_asset")}
              </Button>
            )}
            <Button type="secondary" onClick={handleClose}>
              {translate("CM.btn_cancel")}
            </Button>
            <Button type="primary" onClick={handleSave}>
              {translate("CM.txt_save")}
            </Button>
          </footer>
        }
      >
        <div className="settlement-asset-info-drawer-content">
          <Row gutter={12}>
            <Col lg={16}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "assetItemGoodsId"
                )}
              >
                <Select
                  isRequired
                  isSmall={false}
                  label={translate("settlement.goods_services_code")}
                  placeHolder={translate("settlement.plh_goods_services")}
                  searchProperty="name"
                  searchType=""
                  isSearch
                  valueFilter={{
                    name: "",
                    isActive: true,
                  }}
                  getList={settlementRepository.getGoodServicesList}
                  onChange={handleChangeSelectField({
                    fieldName: "assetItemGoodsId",
                  })}
                  value={model?.assetItemGoodsId}
                  classFilter={undefined}
                  render={(t) => {
                    return t ? `${t?.code} - ${t?.name}` : "";
                  }}
                  isEnumerable={false}
                />
              </FormItem>
            </Col>

            <Col lg={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "assetItemBranchId"
                )}
              >
                <Select
                  isRequired
                  isSmall={false}
                  label={translate("settlement.settlement_brand_or_type")}
                  placeHolder={translate(
                    "settlement.placeholder_brand_or_type"
                  )}
                  searchProperty="name"
                  searchType=""
                  isSearch
                  valueFilter={{
                    name: "",
                    isActive: true,
                  }}
                  getList={settlementRepository.getDropdownManufacturer}
                  onChange={handleChangeSelectField({
                    fieldName: "assetItemBranchId",
                  })}
                  value={model?.assetItemBranchId}
                  classFilter={undefined}
                  render={(t) => (t ? t?.name : "")}
                  isEnumerable={false}
                />
              </FormItem>
            </Col>
          </Row>

          <div className="p-t--sm">
            <Row gutter={12}>
              <Col lg={16}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "assetItemGoodsDescription"
                  )}
                >
                  <InputText
                    label={translate(
                      "settlement.settlement_description_goods_and_services"
                    )}
                    placeHolder={translate(
                      "settlement.placeholder_description_goods_and_services"
                    )}
                    isSmall={false}
                    onChange={handleChangeSingleField({
                      fieldName: "assetItemGoodsDescription",
                    })}
                    value={model?.assetItemGoodsDescription}
                    maxLength={1000}
                    translate={translate}
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "assetItemGoodsNote"
                  )}
                >
                  <InputText
                    label={translate("settlement.goods_services_note")}
                    placeHolder={translate(
                      "settlement.placeholder_goods_services_note"
                    )}
                    isSmall={false}
                    onChange={handleChangeSingleField({
                      fieldName: "assetItemGoodsNote",
                    })}
                    value={model?.assetItemGoodsNote}
                    maxLength={500}
                    translate={translate}
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
                    "assetItemCode"
                  )}
                >
                  <div className="flex-1">
                    <InputText
                      label={translate("settlement.asset_code")}
                      placeHolder={translate(
                        "settlement.placeholder_asset_code"
                      )}
                      onChange={handleChangeSingleField({
                        fieldName: "assetItemCode",
                      })}
                      value={model?.assetItemCode}
                      isRequired
                      isSmall={false}
                      translate={translate}
                      maxLength={255}
                      action={
                        {
                          action: handleCheckAsset,
                          name: (
                            <button
                              className="p-0 m-0 check_asset"
                              disabled={!model?.assetItemCode}
                            >
                              <span>
                                <CheckIconT />
                              </span>
                              <span>{translate("PP.check_asset")}</span>
                            </button>
                          ),
                        } as unknown
                      }
                    />
                  </div>
                </FormItem>
              </Col>
              <Col lg={8}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "assetItemName"
                  )}
                >
                  <InputText
                    label={translate("settlement.asset_name")}
                    placeHolder={translate("settlement.placeholder_asset_name")}
                    onChange={handleChangeSingleField({
                      fieldName: "assetItemName",
                    })}
                    value={model?.assetItemName}
                    isRequired
                    isSmall={false}
                    translate={translate}
                    maxLength={255}
                    disabled
                  />
                </FormItem>
              </Col>
              {assetExist && (
                <>
                  <Col lg={8}>
                    <FormItem
                      validateObject={utilService.getValidateObj(
                        model,
                        "serialNumber"
                      )}
                    >
                      <InputText
                        label={translate("settlement.serial_number")}
                        placeHolder={translate(
                          "settlement.placeholder_serial_number"
                        )}
                        onChange={handleChangeSingleField({
                          fieldName: "serialNumber",
                        })}
                        value={model?.serialNumber}
                        isSmall={false}
                        translate={translate}
                        maxLength={255}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={4} className="m-t--xs">
                    <FormItem
                      validateObject={utilService.getValidateObj(
                        model,
                        "assetItemType"
                      )}
                    >
                      <Select
                        isRequired
                        isSmall={false}
                        label={translate("settlement.settlement_type")}
                        placeHolder={translate(
                          "settlement.placeholder_settlement_type"
                        )}
                        searchProperty="name"
                        searchType=""
                        valueFilter={{
                          name: "",
                          isActive: true,
                        }}
                        getList={() => of(types)}
                        onChange={handleChangeSelectField({
                          fieldName: "assetItemType",
                        })}
                        value={model?.assetItemType}
                        classFilter={undefined}
                        render={(t) => (t ? t?.name : "")}
                        isEnumerable={false}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={4} className="m-t--xs">
                    <FormItem
                      validateObject={utilService.getValidateObj(
                        model,
                        "originNo"
                      )}
                    >
                      <InputText
                        label={translate("settlement.origin_no")}
                        placeHolder={translate(
                          "settlement.placeholder_origin_no"
                        )}
                        onChange={handleChangeSingleField({
                          fieldName: "originNo",
                        })}
                        value={model?.originNo}
                        isSmall={false}
                        translate={translate}
                        maxLength={255}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={8} className="m-t--xs">
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
                        onChange={handleChangeSelectField({
                          fieldName: "ownerOrganization",
                        })}
                        value={model?.ownerOrganization}
                        classFilter={undefined}
                        render={(t) => (t ? t?.name : "")}
                        isEnumerable={false}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={8} className="m-t--xs">
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
                </>
              )}
            </Row>
          </div>
          {assetExist && (
            <>
              <div className="p-t--sm">
                <Row gutter={12}>
                  <Col lg={8}>
                    <FormItem
                      validateObject={utilService.getValidateObj(
                        model,
                        "quantity"
                      )}
                    >
                      <InputNumber
                        label={translate("settlement.settlement_quantity")}
                        placeHolder={translate(
                          "settlement.placeholder_quantity"
                        )}
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
                        "assetItemUsageStartDate"
                      )}
                    >
                      <DatePicker
                        isRequired
                        label={translate("settlement.settlement_date_of_use")}
                        value={
                          model.assetItemUsageStartDate
                            ? dayjs(model.assetItemUsageStartDate)
                            : undefined
                        }
                        placeholder={"dd/mm/yyyy"}
                        size={"middle"}
                        onChange={handleChangeDateField({
                          fieldName: "assetItemUsageStartDate",
                        })}
                        isSmall={false}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={8}>
                    <FormItem
                      validateObject={utilService.getValidateObj(
                        model,
                        "assetItemDepreciationStartDate"
                      )}
                    >
                      <DatePicker
                        isRequired
                        label={translate(
                          "settlement.settlement_start_date_depreciation"
                        )}
                        value={
                          model.assetItemDepreciationStartDate
                            ? dayjs(model.assetItemDepreciationStartDate)
                            : undefined
                        }
                        placeholder={"dd/mm/yyyy"}
                        size={"middle"}
                        onChange={handleChangeDateField({
                          fieldName: "assetItemDepreciationStartDate",
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
                        "assetItemOriginalCost"
                      )}
                    >
                      <InputNumber
                        label={translate(
                          "settlement.settlement_original_price"
                        )}
                        placeHolder={translate(
                          "settlement.placeholder_original_price"
                        )}
                        onChange={handleChangeSingleField({
                          fieldName: "assetItemOriginalCost",
                        })}
                        value={model?.assetItemOriginalCost}
                        isRequired
                        isSmall={false}
                        suffix={"VND"}
                        translate={translate}
                        max={NUMBER_MAX_13}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={8}>
                    <FormItem>
                      <InputText
                        label={translate("settlement.settlement_classify")}
                        value={model?.assetItemClassify}
                        readOnly
                        placeHolder="---"
                        isSmall={false}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={8}>
                    <FormItem>
                      <InputNumber
                        label={translate(
                          "settlement.settlement_number_of_months_of_depreciation"
                        )}
                        placeHolder="---"
                        readOnly
                        isSmall={false}
                        value={model?.assetItemDepreciationMonths}
                        translate={translate}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </div>

              <div className="p-t--sm">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "assetItemNote"
                  )}
                >
                  <TextArea
                    label={translate("settlement.asset_note")}
                    placeHolder={translate("settlement.asset_note_placeholder")}
                    value={model?.assetItemNote}
                    showCount
                    resize="none"
                    maxLength={1000}
                    onChange={handleChangeSingleField({
                      fieldName: "assetItemNote",
                    })}
                    translate={translate}
                  />
                </FormItem>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default DrawerCreateAsset;
