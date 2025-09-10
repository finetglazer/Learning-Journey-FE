/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import {
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { Col, Row } from "antd";
import LayoutDetail from "components/LayoutDetail/LayoutDetail";
import { isEqual } from "lodash";

import { ColumnProps } from "antd/lib/table";
import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DenySvg from "assets/icons/CostLine/ic_deny.svg";
import { formatNumber } from "core/helpers/number";
import { Currency, GoodsServices } from "models/PurchaseRequest";
import { goodsManagementBreadcrumb } from "pages/Catalog/constants";
import { useMemo } from "react";
import AttachedFileView from "../Component/AttachedFileView/AttachedFileView";
import "./GoodsServicesPreview.scss";
import { useGoodsServicesPreviewHook } from "./GoodsServicesPreviewHook";

const GoodsServicesPreview = () => {
  const [translate] = useTranslation();
  const { model, loading, handleGoMaster, renderUOMGroup } =
    useGoodsServicesPreviewHook();

  const breadcrumbs = [
    ...goodsManagementBreadcrumb,
    {
      name: translate("goodsServices.breadcrumbs.goodsServices"),
    },
  ];

  const referencePriceColumn: ColumnProps<GoodsServices>[] = useMemo(
    () => [
      {
        title: translate("goodsServices.txt_stt"),
        key: "index",
        dataIndex: "index",
        width: "80px",
        sorter: true,
        render(...params: [string, GoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[2] + 1)} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("goodsServices.referencePrice"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        render(...params: [string, GoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${params[1]?.referencePriceMin} - ${params[1]?.referencePriceMax}`}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("goodsServices.currency"),
        key: "currency",
        dataIndex: "currency",
        sorter: true,
        render(...params: [Currency, GoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[1]?.currency?.code} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

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

  return (
    <>
      <div className={classNames("page-content goods-services-detail")}>
        <PageHeader
          title={translate("goodsServices.preview")}
          breadcrumbs={breadcrumbs}
          className="page-header"
          isShowBackButton
          rightComponentTitle={renderStatusDetail()}
        >
          <div className="d-flex">
            <Button
              type="secondary"
              className="m-r--xs"
              onClick={handleGoMaster}
            >
              {translate("generalActions.close")}
            </Button>
          </div>
        </PageHeader>
        <LayoutDetail className="">
          <div className="title-detail m-b--xl">
            {translate("CM.tab_general_information")}
          </div>
          <Row className="p-l--sm p-r--sm">
            <Col span={8}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.code")}
                </span>
                <span className="goods-services__item-description">
                  {model?.code}
                </span>
              </div>
            </Col>
            <Col span={8}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.name")}
                </span>
                <span className="goods-services__item-description">
                  {model?.name}
                </span>
              </div>
            </Col>

            <Col span={8}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.goodsServiceCategory")}
                </span>
                <span className="goods-services__item-description">
                  {model?.goodsServicesCategory?.name}
                </span>
              </div>
            </Col>

            <Col span={8}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.goodsServicesType")}
                </span>
                <span className="goods-services__item-description">
                  {model?.goodServiceType?.name}
                </span>
              </div>
            </Col>
            <Col span={8}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.manufacturer")}
                </span>
                <span className="goods-services__item-description">
                  {model?.manufacturer?.name}
                </span>
              </div>
            </Col>
            <Col span={8}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.unitOfMeasure")}
                </span>
                <span className="goods-services__item-description">
                  {model?.unitOfMeasure?.name}
                </span>
              </div>
            </Col>
            <Col span={8}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.unitOfMeasureGroup")}
                </span>
                <span className="goods-services__item-description">
                  {model?.unitOfMeasureGroup?.name}
                </span>
              </div>
            </Col>
            <Col span={8}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.unitOfMeasureGroup")}
                </span>
                <span className="goods-services__item-description">
                  {renderUOMGroup}
                </span>
              </div>
            </Col>
            <Col span={8}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.currency")}
                </span>
                <span className="goods-services__item-description">
                  {model?.currency?.name}
                </span>
              </div>
            </Col>
            <Col span={8}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.referencePrice")}
                </span>
                <span className="goods-services__item-description">
                  {`${formatNumber(model?.referencePriceMin)} - ${formatNumber(
                    model?.referencePriceMax
                  )}`}
                </span>
              </div>
            </Col>
            <Col span={16}>
              <div className="goods-services__item">
                <span className="goods-services__item-label">
                  {translate("goodsServices.description")}
                </span>
                <span className="goods-services__item-description">
                  {model?.description}
                </span>
              </div>
            </Col>
            <Col span={8}>
              <Row>
                <Col lg={8}>
                  <div className="goods-services__item">
                    <span className="bank__item-label">
                      {translate("goodsServices.isChecked")}
                    </span>
                    <img
                      src={model?.isChecked ? ActiveSvg : DenySvg}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>
                </Col>
                <Col lg={8}>
                  <div className="goods-services__item">
                    <span className="bank__item-label">
                      {translate("goodsServices.isImported")}
                    </span>
                    <img
                      src={model?.isImported ? ActiveSvg : DenySvg}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>
                </Col>
                <Col lg={8}>
                  <div className="goods-services__item">
                    <span className="bank__item-label">
                      {translate("goodsServices.isAsset")}
                    </span>
                    <img
                      src={model?.isAsset ? ActiveSvg : DenySvg}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col lg={4}>
              <div className="goods-services__item">
                <span className="bank__item-label">
                  {translate("goodsServices.visible")}
                </span>
                <img
                  src={model?.assetType === 0 ? ActiveSvg : DenySvg}
                  alt=""
                  width={20}
                  height={20}
                />
              </div>
            </Col>

            <Col lg={4}>
              <div className="goods-services__item">
                <span className="bank__item-label">
                  {translate("goodsServices.invisible")}
                </span>
                <img
                  src={model?.assetType === 1 ? ActiveSvg : DenySvg}
                  alt=""
                  width={20}
                  height={20}
                />
              </div>
            </Col>

            <Col lg={4}>
              <div className="goods-services__item">
                <span className="bank__item-label">
                  {translate("goodsServices.fixedAssetDepreciationPeriod")}
                </span>
                <span className="goods-services__item-description">
                  {model?.fixedAssetDepreciationPeriod &&
                    `${model?.fixedAssetDepreciationPeriod} tháng`}
                </span>
              </div>
            </Col>
            <Col lg={4}>
              <div className="goods-services__item">
                <span className="bank__item-label">
                  {translate("goodsServices.toolsDepreciationPeriod")}
                </span>
                <span className="goods-services__item-description">
                  {model?.toolsDepreciationPeriod &&
                    `${model?.toolsDepreciationPeriod} tháng`}
                </span>
              </div>
            </Col>
          </Row>
          <div className="title-detail m-t--xl m-b--xl">
            {translate("goodsServices.attachment")}
          </div>

          {model?.attachmentFiles && model?.attachmentFiles?.length > 0 && (
            <Row className="p-l--sm p-r--sm">
              <AttachedFileView
                files={model?.attachmentFiles}
                isViewMode={true}
                handleDeleteFile={undefined}
              />
            </Row>
          )}

          <div className="title-detail m-t--xl m-b--xl">
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
        </LayoutDetail>
      </div>

      {loading && <LoadingCM />}
    </>
  );
};

export default GoodsServicesPreview;
