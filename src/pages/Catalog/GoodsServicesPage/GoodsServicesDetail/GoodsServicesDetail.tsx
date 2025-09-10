/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import {
  Button,
  Checkbox,
  FormItem,
  InputNumber,
  InputText,
  Radio,
  Select,
  StandardTable,
  Tag,
  TextArea,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { Col, Row, Space, Switch } from "antd";
import LayoutDetail from "components/LayoutDetail/LayoutDetail";
import { utilService } from "core/services/common-services/util-service";
import _, { isEqual } from "lodash";
import { GoodsServicesFilter } from "models/GoodsServices";

import { GoodsServicesCategoryFilter } from "models/GoodsServicesCategory";
import "./GoodsServicesDetail.scss";
import { useGoodsServicesDetailHook } from "./GoodsServicesDetailHook";

import { UploadIcon } from "assets/icons";
import { CurrencyFilter } from "models/Currency";
import { ManufacturerFilter } from "models/Manufacturer";
import { UnitOfMeasure, UnitOfMeasureFilter } from "models/UnitOfMeasure";
import { UnitOfMeasureGroupFilter } from "models/UnitOfMeasureGroup";
import { goodsManagementBreadcrumb } from "pages/Catalog/constants";
import React, { useCallback, useMemo } from "react";
import AttachedFileView from "../Component/AttachedFileView/AttachedFileView";
import { goodsServicesRepository } from "../GoodsServicesRepository";

const GoodsServicesDetail = () => {
  const [translate] = useTranslation();
  const {
    isDetail,
    model,
    loading,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    handleSave,
    referencePriceColumn,
  } = useGoodsServicesDetailHook();

  const handleUpdateListFile = (listFile: any[]) => {
    const newListFiles = [...(model?.attachmentFiles || []), ...listFile];
    handleChangeSingleField({
      fieldName: "attachmentFiles",
    })(newListFiles);
  };

  const handleDeleteFile = useCallback(
    (fileId: string | number) => {
      const newListFiles: any[] = model?.attachmentFiles || [];
      handleChangeSingleField({
        fieldName: "attachmentFiles",
      })(
        newListFiles?.filter((file: { systemFileId: string | number }) => {
          return file?.systemFileId !== fileId;
        })
      );
    },
    [handleChangeSingleField, model?.attachmentFiles]
  );

  const title = useMemo(
    () =>
      !model?.id
        ? translate("goodsServices.create")
        : translate("goodsServices.update"),
    [model?.id, translate]
  );

  const breadcrumbs = [
    ...goodsManagementBreadcrumb,
    {
      name: title,
    },
  ];

  const renderStatusDetail = () => {
    return (
      <Tag
        value={
          isEqual(model?.isActive, true)
            ? translate("goodsServices.active")
            : translate("goodsServices.inactive")
        }
        className="m-l--2xs"
        size="sm"
        status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
        isShowBorder
        isShowDot={false}
      />
    );
  };

  const [renderUOMGroup, setRenderUOMGroup] = React.useState<string>("--");

  React.useEffect(() => {
    if (model?.unitOfMeasureGroupId) {
      goodsServicesRepository
        .getUnitOfMeasure(model?.unitOfMeasureGroupId)
        .subscribe((res) => {
          setRenderUOMGroup(res?.toString());
        });
    }
  }, [model?.unitOfMeasureGroupId]);

  const handleChangeUnitOfMeasure = React.useCallback(
    (id: number, unitOfMeasure?: UnitOfMeasure) => {
      const newModel = _.cloneDeep(model);
      if (
        id &&
        (!newModel?.unitOfMeasureId ||
          (newModel?.unitOfMeasureId && newModel?.unitOfMeasureId !== id))
      ) {
        handleChangeAllField({
          ...newModel,
          unitOfMeasureId: id,
          unitOfMeasure: unitOfMeasure,
          unitOfMeasureGroup: undefined,
          unitOfMeasureGroupId: undefined,
        });
        setRenderUOMGroup("--");
      }
    },
    [handleChangeAllField, model]
  );

  return (
    <>
      <div className={classNames("page-content goods-services-detail")}>
        <PageHeader
          title={title}
          breadcrumbs={breadcrumbs}
          className="page-header"
          isShowBackButton
          rightComponentTitle={renderStatusDetail()}
        >
          <div className="d-flex">
            <Button
              type="secondary"
              className="m-r--xs"
              onClick={() => window.history.back()}
            >
              {translate("generalActions.close")}
            </Button>
            <Button type="primary" size="lg" onClick={() => handleSave()}>
              {translate("generalActions.save")}
            </Button>
          </div>
        </PageHeader>
        <LayoutDetail className="">
          <div className="title-detail m-b--xl">
            {translate("CM.tab_general_information")}
          </div>
          <Row className="p-l--sm p-r--sm">
            <Col lg={24} className="m-b--sm d-flex">
              <div className={"label-title m-r--xs"}>
                {translate("goodsServices.status")}
              </div>
              <Switch
                checked={model.isActive}
                onChange={(checked) => {
                  handleChangeSingleField({
                    fieldName: "isActive",
                  })(checked);
                }}
                className={"switch_status"}
              />
              <span className="m-l--xs">
                {translate("goodsServices.active")}
              </span>
            </Col>
            <Col span={8} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(model, "code")}
              >
                <InputText
                  isRequired
                  maxLength={500}
                  label={translate("goodsServices.code")}
                  placeHolder={translate("goodsServices.placeholder.code")}
                  value={model.code}
                  onChange={handleChangeSingleField({
                    fieldName: "code",
                  })}
                />
              </FormItem>
            </Col>
            <Col span={8} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(model, "name")}
              >
                <InputText
                  isRequired
                  maxLength={500}
                  label={translate("goodsServices.name")}
                  placeHolder={translate("goodsServices.placeholder.name")}
                  value={model.name}
                  onChange={handleChangeSingleField({
                    fieldName: "name",
                  })}
                />
              </FormItem>
            </Col>
            <Col span={8} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "goodsServicesCategoryId"
                )}
              >
                <Select
                  label={translate("goodsServices.goodsServiceCategory")}
                  placeHolder={translate(
                    "goodsServices.placeholder.goodsServiceCategory"
                  )}
                  isSearch
                  searchProperty="search"
                  searchType={null}
                  isEnumerable={false}
                  isRequired
                  classFilter={GoodsServicesCategoryFilter}
                  valueFilter={{
                    ...new GoodsServicesCategoryFilter(),
                    isLeafNode: true,
                  }}
                  getList={
                    goodsServicesRepository.getDropdownGoodsServicesCategory
                  }
                  value={model.goodsServicesCategory}
                  onChange={handleChangeSelectField({
                    fieldName: "goodsServicesCategory",
                  })}
                  render={(category) => {
                    return category?.id
                      ? `${category?.code} - ${category?.name}`
                      : null;
                  }}
                />
              </FormItem>
            </Col>

            <Col span={8} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "goodServiceTypeId"
                )}
              >
                <Select
                  label={translate("goodsServices.goodsServicesType")}
                  placeHolder={translate(
                    "goodsServices.placeholder.goodsServicesType"
                  )}
                  searchProperty="search"
                  searchType={null}
                  isEnumerable={false}
                  isRequired
                  isSearch
                  classFilter={GoodsServicesFilter}
                  getList={goodsServicesRepository.getDropdownGoodServiceType}
                  value={model.goodServiceType}
                  onChange={handleChangeSelectField({
                    fieldName: "goodServiceType",
                  })}
                />
              </FormItem>
            </Col>

            <Col span={8} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "manufacturerId"
                )}
              >
                <Select
                  isRequired
                  label={translate("goodsServices.manufacturer")}
                  placeHolder={translate(
                    "goodsServices.placeholder.manufacturer"
                  )}
                  getList={goodsServicesRepository.getDropdownManufacturer}
                  classFilter={ManufacturerFilter}
                  onChange={handleChangeSelectField({
                    fieldName: "manufacturer",
                  })}
                  value={model?.manufacturer}
                  isEnumerable={false}
                  isSearch
                  searchProperty="search"
                  searchType={null}
                />
              </FormItem>
            </Col>

            <Col span={8} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "unitOfMeasureId"
                )}
              >
                <Select
                  label={translate("goodsServices.unitOfMeasure")}
                  placeHolder={translate(
                    "goodsServices.placeholder.unitOfMeasure"
                  )}
                  searchProperty="search"
                  searchType={null}
                  isSearch
                  isEnumerable={false}
                  isRequired
                  classFilter={UnitOfMeasureFilter}
                  getList={goodsServicesRepository.getDropdownUnitOfMeasure}
                  value={model.unitOfMeasure}
                  onChange={handleChangeUnitOfMeasure}
                />
              </FormItem>
            </Col>
            <Col span={8} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "unitOfMeasureGroupId"
                )}
              >
                <Select
                  label={translate("goodsServices.unitOfMeasureGroup")}
                  placeHolder={translate(
                    "goodsServices.placeholder.unitOfMeasureGroup"
                  )}
                  searchProperty="search"
                  searchType={null}
                  isSearch
                  isEnumerable={false}
                  classFilter={UnitOfMeasureGroupFilter}
                  valueFilter={{
                    ...new UnitOfMeasureGroupFilter(),
                    unitOfMeasureIds: [...[], model?.unitOfMeasureId],
                  }}
                  getList={
                    goodsServicesRepository.getDropdownUnitOfMeasureGroup
                  }
                  value={model.unitOfMeasureGroup}
                  onChange={handleChangeSelectField({
                    fieldName: "unitOfMeasureGroup",
                  })}
                  disabled={!model?.unitOfMeasureId}
                />
              </FormItem>
            </Col>

            <Col span={8} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "unitOfMeasureGroupId"
                )}
              >
                <InputText
                  label={translate("goodsServices.convertUOMs")}
                  placeHolder={translate(
                    "goodsServices.placeholder.unitOfMeasureGroup"
                  )}
                  value={renderUOMGroup}
                  disabled
                />
              </FormItem>
            </Col>

            <Col span={8} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(model, "currencyId")}
              >
                <Select
                  label={translate("goodsServices.currency")}
                  placeHolder={translate("goodsServices.placeholder.currency")}
                  searchProperty="search"
                  searchType={null}
                  isSearch
                  isEnumerable={false}
                  classFilter={CurrencyFilter}
                  getList={goodsServicesRepository.getDropdownCurrency}
                  value={model.currency}
                  onChange={handleChangeSelectField({
                    fieldName: "currency",
                  })}
                  render={(curency) => {
                    return curency?.id
                      ? `${curency?.code} - ${curency?.name}`
                      : null;
                  }}
                />
              </FormItem>
            </Col>
            <Col span={8} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "referencePriceMin"
                )}
              >
                <InputNumber
                  label={translate("goodsServices.referencePrice")}
                  placeHolder={translate(
                    "goodsServices.placeholder.referencePriceMin"
                  )}
                  value={model.referencePriceMin}
                  onChange={handleChangeSingleField({
                    fieldName: "referencePriceMin",
                  })}
                  disabled={isDetail}
                />
              </FormItem>
            </Col>
            <Col span={8} className="p-r--xs p-b--xs m-t--lg">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "referencePriceMax"
                )}
              >
                <InputNumber
                  placeHolder={translate(
                    "goodsServices.placeholder.referencePriceMax"
                  )}
                  value={model.referencePriceMax}
                  onChange={handleChangeSingleField({
                    fieldName: "referencePriceMax",
                  })}
                  disabled={isDetail}
                />
              </FormItem>
            </Col>
            <Col lg={8}></Col>
            <Col span={24} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "description"
                )}
              >
                <TextArea
                  maxLength={500}
                  label={translate("goodsServices.description")}
                  placeHolder={translate(
                    "goodsServices.placeholder.description"
                  )}
                  value={model.description}
                  onChange={handleChangeSingleField({
                    fieldName: "description",
                  })}
                  showCount
                  translate={translate}
                />
              </FormItem>
            </Col>

            <Col span={24} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(model, "isChecked")}
              >
                <Checkbox
                  label={translate("goodsServices.isChecked")}
                  checked={model?.isChecked}
                  onChange={handleChangeSingleField({
                    fieldName: "isChecked",
                  })}
                />
              </FormItem>
            </Col>
            <Col span={24} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(model, "isImported")}
              >
                <Checkbox
                  label={translate("goodsServices.isImported")}
                  checked={model?.isImported}
                  onChange={handleChangeSingleField({
                    fieldName: "isImported",
                  })}
                />
              </FormItem>
            </Col>
            <Col span={24} className="p-r--xs p-b--xs">
              <FormItem
                validateObject={utilService.getValidateObj(model, "isAsset")}
              >
                <Checkbox
                  label={translate("goodsServices.isAsset")}
                  checked={model?.isAsset}
                  onChange={handleChangeSingleField({
                    fieldName: "isAsset",
                  })}
                />
              </FormItem>
            </Col>

            {model?.isAsset ? (
              <>
                <Col span={4} className="p-r--xs p-b--xs m-l--xs">
                  <FormItem
                    validateObject={utilService.getValidateObj(
                      model,
                      "assetTypeId"
                    )}
                  >
                    <Radio.Group
                      onChecked={(value) => {
                        handleChangeSingleField({
                          fieldName: "assetType",
                        })(value);
                      }}
                      value={model?.assetType}
                    >
                      <Space direction="vertical">
                        <Radio value={0}>
                          {translate("goodsServices.visible")}
                        </Radio>
                        <Radio value={1}>
                          {translate("goodsServices.invisible")}
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </FormItem>
                </Col>
                <Col span={9} className="p-r--xs p-b--xs">
                  <FormItem
                    validateObject={utilService.getValidateObj(
                      model,
                      "ccdcTime"
                    )}
                  >
                    <InputNumber
                      isRequired
                      label={translate(
                        "goodsServices.fixedAssetDepreciationPeriod"
                      )}
                      placeHolder={translate(
                        "goodsServices.placeholder.fixedAssetDepreciationPeriod"
                      )}
                      value={model.ccdcTime}
                      onChange={handleChangeSingleField({
                        fieldName: "fixedAssetDepreciationPeriod",
                      })}
                      suffix={"Tháng"}
                    />
                  </FormItem>
                </Col>
                <Col span={9} className="p-r--xs p-b--xs">
                  <FormItem
                    validateObject={utilService.getValidateObj(
                      model,
                      "toolsDepreciationPeriod"
                    )}
                  >
                    <InputNumber
                      isRequired
                      label={translate("goodsServices.toolsDepreciationPeriod")}
                      placeHolder={translate(
                        "goodsServices.placeholder.toolsDepreciationPeriod"
                      )}
                      value={model.toolsDepreciationPeriod}
                      onChange={handleChangeSingleField({
                        fieldName: "toolsDepreciationPeriod",
                      })}
                      suffix={"Tháng"}
                    />
                  </FormItem>
                </Col>
              </>
            ) : null}
          </Row>

          <div className="title-detail m-b--xl m-t--xs">
            {translate("goodsServices.attachment")}
          </div>

          <Row className="p-l--sm p-r--sm">
            <Col span={24} className="p-r--xs p-b--xs">
              <div className="d-flex">
                <UploadFile
                  uploadFile={goodsServicesRepository.importFile}
                  updateList={handleUpdateListFile}
                  isMultiple={false}
                  type="dragAndDrop"
                  uploadContent="Drag and drop files here or upload"
                  textHint={translate("BG.multiple_files_upload")}
                  titleButton={translate("BG.upload")}
                  icon={<img src={UploadIcon} alt="img" />}
                  maximumSize={99999999999}
                  className="w-100 m-r--md"
                  //setListFileLoading={setFileLoading}
                ></UploadFile>
                {model?.attachmentFiles &&
                  model?.attachmentFiles?.length > 0 && (
                    <AttachedFileView
                      files={model?.attachmentFiles}
                      isViewMode={false}
                      handleDeleteFile={handleDeleteFile}
                    />
                  )}
              </div>
            </Col>
          </Row>
          {isDetail && (
            <>
              <div className="title-detail m-b--xl m-t--xs">
                {translate("goodsServices.referencePriceTable")}
              </div>
              <Row className="p-l--sm p-r--sm">
                <Col lg={24}>
                  <StandardTable
                    rowKey="id"
                    isDragable
                    columns={referencePriceColumn}
                    dataSource={[...[], model]}
                  />
                </Col>
              </Row>
            </>
          )}
        </LayoutDetail>
      </div>
      {loading && <LoadingCM />}
    </>
  );
};

export default GoodsServicesDetail;
