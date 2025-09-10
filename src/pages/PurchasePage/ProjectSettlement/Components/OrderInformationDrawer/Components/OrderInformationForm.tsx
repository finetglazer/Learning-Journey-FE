/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounceFn } from "ahooks";
import { numberConstant, numberConstants } from "core/config/consts";
import { goodsServicesRepository } from "core/repositories/GoodsServicesRepository";
import { manufacturersRepository } from "core/repositories/ManufacturersRepository";
import { organizationRepository } from "core/repositories/OrganizationRepository";
import { utilService } from "core/services/common-services/util-service";
import _, { isUndefined, uniqueId } from "lodash";
import { OptionBaseModel } from "models/Common/Common";
import CommonFilter from "models/CommonFilter";
import { AssetClassifyResponse } from "models/ProjectSettlement";
import OrderInformationGeneral from "pages/PurchasePage/ProjectSettlement/Components/OrderInformationDrawer/Components/OrderInformationGeneral";
import { useOrderInformationContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/context/OrderInformationContext";
import { ItemTable } from "pages/PurchasePage/ReceivingGoods/Components/ItemTable/ItemTable";
import { receivedGoodsRepository } from "pages/PurchasePage/ReceivingGoods/ReceivedGoodRepository";
import { settlementRepository } from "pages/SettlementPage/SettlementRepository";
import { useCallback, useEffect, useState } from "react";
import {
  FormItem,
  InputText,
  OneLineText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../OrderInformationDrawer.module.scss";
import { CheckIconT } from "assets/icons";
import { projectSettlementTypeList } from "../../constant";
import { of } from "rxjs";
import { Col, Row } from "antd";

const OrderInformationForm = () => {
  const [translate] = useTranslation();
  const { assetItemSelected: data, setAssetItemSelected } =
    useOrderInformationContext();

  const [isDepreciationEditable, setIsDepreciationEditable] =
    useState<boolean>(false);

  const [assetExist, setAssetExist] = useState<boolean>(!!data?.name);
  useEffect(() => {
    if (data?.goods) {
      setIsDepreciationEditable(true);
    } else {
      setIsDepreciationEditable(false);
    }
    if (data?.name) {
      setAssetExist(true);
    } else {
      setAssetExist(false);
    }
  }, [data?.goods, data?.name]);

  const columnsHeader = [
    {
      title: translate("PS.txt_asset_good_service"),
      content: data?.goods?.code,
    },
    {
      title: translate("PS.txt_asset_goods_name"),
      content: <OneLineText value={data?.goods?.name} />,
    },
    {
      title: translate("PS.txt_asset_manufacturer_type"),
      content: data?.branch?.name,
    },
  ];

  const updateNestedField = (
    obj: any,
    path: string,
    value: number | string | OptionBaseModel | null
  ) => {
    const keys = path.split(".");
    let current = obj;

    keys.slice(numberConstants.ZERO, -numberConstant.ONE).forEach((key) => {
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    });

    current[keys[keys.length - numberConstant.ONE]] = value;
  };

  const checkStatus = !isUndefined(data?.id);

  useEffect(() => {
    if (data?.goods) {
      setIsDepreciationEditable(true);
    } else {
      setIsDepreciationEditable(false);
    }
  }, [data?.goods]);

  const getAssetClassifyInfo = useCallback(() => {
    if (data?.goods?.id && data?.originalCost) {
      settlementRepository
        .getAssetClassifyInfo({
          goodsId: data?.goods?.id,
          originalCost: data?.originalCost,
        })
        .pipe()
        .subscribe({
          next: (response: AssetClassifyResponse) => {
            setAssetItemSelected((prevData) => ({
              ...prevData,
              classify: response?.data?.classify,
              depreciationMonths: response?.data?.depreciationMonths,
            }));
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }, [data?.goods?.id, data?.originalCost, setAssetItemSelected]);

  const { run: runAsset } = useDebounceFn(() => getAssetClassifyInfo(), {
    wait: 300,
  });

  useEffect(() => {
    runAsset();
  }, [runAsset]);

  const handleUpdateField = useCallback(
    (value: number | string | OptionBaseModel | null, fieldName: string) => {
      const updatedData = _.cloneDeep(data);
      updateNestedField(updatedData, fieldName, value);
      updatedData.errors = { ...data.errors, [fieldName]: undefined };
      if (fieldName === "goods") {
        runAsset();
      }
      if (
        fieldName === "ownerOrganization" &&
        typeof value === "object" &&
        value?.id !== data?.ownerOrganization?.id
      ) {
        updateNestedField(updatedData, "ownerUser", undefined);
      }

      setAssetItemSelected(updatedData);
    },
    [data, runAsset, setAssetItemSelected]
  );

  const handleCheckAsset = useCallback(() => {
    settlementRepository.checkAsset([...[], data?.code]).subscribe({
      next: (response: any) => {
        const assets = response?.data?.LIST_ASSET_INFO;
        if (assets && assets.length > 0) {
          const updatedData = _.cloneDeep(data);
          updatedData.name = assets[0].ASSET_NAME;
          updatedData.originNo = assets[0].ORIGIN_NO;
          updatedData.originalCost = assets[0].ORIGINAL_PRICE;
          updatedData.serialNumber = assets[0].SERIAL_NUMBER;
          updatedData.errors = {
            ...updatedData?.errors,
            code: undefined,
          };
          setAssetItemSelected(updatedData);
          setAssetExist(true);
        } else {
          setAssetItemSelected({
            ...data,
            name: undefined,
            serialNumber: undefined,
            originalCost: undefined,
            originNo: undefined,
            errors: {
              ...data?.errors,
              code: translate("CM.error_exist_asset"),
            },
          });
          setAssetExist(false);
        }
      },
      error: () => {
        setAssetItemSelected({
          ...data,
          name: undefined,
          serialNumber: undefined,
          originalCost: undefined,
          originNo: undefined,
          errors: {
            ...data?.errors,
            code: translate("CM.error_exist_asset"),
          },
        });
        setAssetExist(false);
      },
    });
  }, [data, setAssetItemSelected, translate]);

  return (
    <>
      {checkStatus ? (
        <div className={styles["form-container"]}>
          <table className={styles["table"]}>
            <tbody>
              <tr className={styles["bg-grey"]}>
                {columnsHeader.map((props) => (
                  <ItemTable key={uniqueId()} {...props} />
                ))}
              </tr>
              <tr>
                <ItemTable
                  title={translate(
                    "settlement.settlement_description_goods_and_services"
                  )}
                  content={data?.goodsDescription}
                />
                <ItemTable
                  title={translate("PS.txt_asset_note_good_service")}
                  colSpan={numberConstants.TWO}
                  content={data?.goodsNote}
                />
              </tr>

              <tr>
                <ItemTable
                  title={translate("PP.asset_code")}
                  content={data?.code}
                />
                <ItemTable
                  title={translate("PP.asset_name")}
                  content={data?.asset?.name}
                />
                <ItemTable
                  title={translate("PP.asset_serialNumber")}
                  content={data?.asset?.serialNumber}
                />
              </tr>
            </tbody>
          </table>
          <Row gutter={12} className="w-100">
            <Col lg={4}>
              <FormItem
                validateObject={utilService.getValidateObj(data, "type")}
              >
                <Select
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
                  getList={() => of(projectSettlementTypeList)}
                  onChange={(_, option) => {
                    handleUpdateField(option, "type");
                  }}
                  value={data?.type}
                  classFilter={undefined}
                  render={(t) => (t ? t?.name : "")}
                  isEnumerable={false}
                  readOnly
                />
              </FormItem>
            </Col>
            <Col lg={4}>
              <FormItem
                validateObject={utilService.getValidateObj(data, "originNo")}
              >
                <InputText
                  label={translate("TIA.txt_asset_origin_no")}
                  placeHolder={translate("TIA.txt_asset_origin_no")}
                  value={data?.originNo}
                  onChange={(value) => handleUpdateField(value, "originNo")}
                  isSmall={false}
                  readOnly
                />
              </FormItem>
            </Col>
            <Col lg={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  data,
                  "ownerOrganization"
                )}
              >
                <Select
                  label={translate("PS.txt_asset_unit_name")}
                  placeHolder={translate("PS.txt_asset_placeholder_unit_name")}
                  classFilter={CommonFilter}
                  searchProperty="name"
                  searchType=""
                  valueFilter={{
                    name: "",
                    isActive: true,
                  }}
                  value={data?.ownerOrganization}
                  getList={organizationRepository.getListOrganization}
                  onChange={(_, option) =>
                    handleUpdateField(option, "ownerOrganization")
                  }
                  isEnumerable={false}
                  isSmall={false}
                  appendToBody
                  isSearch={true}
                  allowClear={false}
                  isRequired
                  readOnly
                />
              </FormItem>
            </Col>
            <Col lg={8}>
              <FormItem
                validateObject={utilService.getValidateObj(data, "ownerUser")}
              >
                <Select
                  label={translate("RG.txt_person_charge")}
                  placeHolder={translate("PS.txt_asset_person_charge")}
                  classFilter={CommonFilter}
                  searchProperty="name"
                  searchType=""
                  isSearch={true}
                  valueFilter={{
                    name: "",
                    isActive: true,
                    organizationId: data?.ownerOrganization?.id,
                  }}
                  value={data?.ownerUser}
                  getList={receivedGoodsRepository.getListUser}
                  onChange={(_, option) =>
                    handleUpdateField(option, "ownerUser")
                  }
                  isEnumerable={false}
                  isSmall={false}
                  appendToBody
                  render={(t) => (t ? `${t?.email} - ${t?.name}` : "")}
                  allowClear={false}
                  isRequired
                  disabled={!data?.ownerOrganization?.id}
                  readOnly
                />
              </FormItem>
            </Col>
          </Row>
          <OrderInformationGeneral
            runAsset={runAsset}
            isDepreciationEditable={isDepreciationEditable}
          />
        </div>
      ) : (
        <>
          <div className={styles["form-container"]}>
            <div className={styles["form-item__width-full"]}>
              <FormItem
                validateObject={utilService.getValidateObj(data, "goods")}
              >
                <Select
                  label={translate("PS.txt_asset_good_service")}
                  placeHolder={translate(
                    "PS.txt_asset_placeholder_good_service"
                  )}
                  classFilter={CommonFilter}
                  searchProperty="name"
                  searchType=""
                  isSearch={true}
                  valueFilter={{
                    name: "",
                    isActive: true,
                  }}
                  render={(option: OptionBaseModel) =>
                    option?.id ? `${option?.code} - ${option?.name}` : null
                  }
                  value={data?.goods}
                  getList={goodsServicesRepository.getDropdown}
                  onChange={(_, option) => handleUpdateField(option, "goods")}
                  isEnumerable={false}
                  isSmall={false}
                  appendToBody
                  allowClear={false}
                  isRequired
                />
              </FormItem>
            </div>

            <div className={styles["form-item__width"]}>
              <FormItem
                validateObject={utilService.getValidateObj(data, "branch")}
              >
                <Select
                  label={translate("PS.txt_asset_manufacturer_type")}
                  placeHolder={translate(
                    "PS.txt_asset_placeholder_manufacturer_type"
                  )}
                  classFilter={CommonFilter}
                  searchProperty="name"
                  searchType=""
                  isSearch={true}
                  valueFilter={{
                    name: "",
                  }}
                  value={data?.branch}
                  getList={(filter) =>
                    manufacturersRepository.getDropdown({
                      ...filter,
                      IsActive: true,
                    })
                  }
                  onChange={(_, option) => handleUpdateField(option, "branch")}
                  isEnumerable={false}
                  isSmall={false}
                  appendToBody
                  allowClear={false}
                  isRequired
                />
              </FormItem>
            </div>
            <div className={styles["form-item__width-full"]}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  data,
                  "goodsDescription"
                )}
              >
                <InputText
                  label={translate("PS.txt_asset_good_service_description")}
                  placeHolder={translate(
                    "PS.txt_asset_placeholder_good_service_description"
                  )}
                  value={data?.goodsDescription}
                  onChange={(value) =>
                    handleUpdateField(value, "goodsDescription")
                  }
                  isSmall={false}
                />
              </FormItem>
            </div>
            <div className={styles["form-item__width"]}>
              <FormItem
                validateObject={utilService.getValidateObj(data, "goodsNote")}
              >
                <InputText
                  label={translate("PS.txt_asset_note_good_service")}
                  placeHolder={translate(
                    "PS.txt_asset_placeholder_note_good_service"
                  )}
                  value={data?.goodsNote}
                  onChange={(value) => handleUpdateField(value, "goodsNote")}
                  isSmall={false}
                />
              </FormItem>
            </div>
            <div className={styles["form-item__width"]}>
              <FormItem
                validateObject={utilService.getValidateObj(data, "code")}
              >
                <InputText
                  label={translate("PP.asset_code")}
                  placeHolder={translate("PP.enter_asset_code")}
                  value={data?.code}
                  onChange={(value) => handleUpdateField(value, "code")}
                  isSmall={false}
                  isRequired
                  action={
                    {
                      action: handleCheckAsset,
                      name: (
                        <button
                          className="p-0 m-0 check_asset"
                          disabled={!data?.code}
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
              </FormItem>
            </div>
            <div className={styles["form-item__width"]}>
              <FormItem
                validateObject={utilService.getValidateObj(data, "name")}
              >
                <InputText
                  label={translate("PP.asset_name")}
                  placeHolder={translate("PP.enter_asset_name")}
                  value={data?.name}
                  onChange={(value) => handleUpdateField(value, "name")}
                  isSmall={false}
                  disabled
                />
              </FormItem>
            </div>
            {assetExist && (
              <>
                <div className={styles["form-item__width"]}>
                  <FormItem
                    validateObject={utilService.getValidateObj(
                      data,
                      "serialNumber"
                    )}
                  >
                    <InputText
                      label={translate("PP.asset_serialNumber")}
                      placeHolder={translate("PP.enter_asset_serialNumber")}
                      value={data?.serialNumber}
                      onChange={(value) =>
                        handleUpdateField(value, "serialNumber")
                      }
                      isSmall={false}
                    />
                  </FormItem>
                </div>

                <div className={styles["form-item__width-small"]}>
                  <FormItem
                    validateObject={utilService.getValidateObj(data, "type")}
                  >
                    <Select
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
                      getList={() => of(projectSettlementTypeList)}
                      onChange={(_, option) => {
                        handleUpdateField(option, "type");
                      }}
                      value={data?.type}
                      classFilter={undefined}
                      render={(t) => (t ? t?.name : "")}
                      isEnumerable={false}
                    />
                  </FormItem>
                </div>
                <div className={styles["form-item__width-small"]}>
                  <FormItem
                    validateObject={utilService.getValidateObj(
                      data,
                      "originNo"
                    )}
                  >
                    <InputText
                      label={translate("TIA.txt_asset_origin_no")}
                      placeHolder={translate("TIA.txt_asset_origin_no")}
                      value={data?.originNo}
                      onChange={(value) => handleUpdateField(value, "originNo")}
                      isSmall={false}
                    />
                  </FormItem>
                </div>

                <div className={styles["form-item__width"]}>
                  <FormItem
                    validateObject={utilService.getValidateObj(
                      data,
                      "ownerOrganization"
                    )}
                  >
                    <Select
                      label={translate("PS.txt_asset_unit_name")}
                      placeHolder={translate(
                        "PS.txt_asset_placeholder_unit_name"
                      )}
                      classFilter={CommonFilter}
                      searchProperty="name"
                      searchType=""
                      valueFilter={{
                        name: "",
                        isActive: true,
                      }}
                      value={data?.ownerOrganization}
                      getList={organizationRepository.getListOrganization}
                      onChange={(_, option) =>
                        handleUpdateField(option, "ownerOrganization")
                      }
                      isEnumerable={false}
                      isSmall={false}
                      appendToBody
                      isSearch={true}
                      allowClear={false}
                      isRequired
                    />
                  </FormItem>
                </div>
                <div className={styles["form-item__width"]}>
                  <FormItem
                    validateObject={utilService.getValidateObj(
                      data,
                      "ownerUser"
                    )}
                  >
                    <Select
                      label={translate("RG.txt_person_charge")}
                      placeHolder={translate("PS.txt_asset_person_charge")}
                      classFilter={CommonFilter}
                      searchProperty="name"
                      searchType=""
                      isSearch={true}
                      valueFilter={{
                        name: "",
                        isActive: true,
                        organizationId: data?.ownerOrganization?.id,
                      }}
                      value={data?.ownerUser}
                      getList={receivedGoodsRepository.getListUser}
                      onChange={(_, option) =>
                        handleUpdateField(option, "ownerUser")
                      }
                      isEnumerable={false}
                      isSmall={false}
                      appendToBody
                      allowClear={false}
                      isRequired
                      render={(t) => (t ? `${t?.email} - ${t?.name}` : "")}
                      disabled={!data?.ownerOrganization?.id}
                    />
                  </FormItem>
                </div>
              </>
            )}
          </div>
          {assetExist && (
            <OrderInformationGeneral
              runAsset={runAsset}
              isDepreciationEditable={isDepreciationEditable}
            />
          )}
        </>
      )}
    </>
  );
};

export default OrderInformationForm;
