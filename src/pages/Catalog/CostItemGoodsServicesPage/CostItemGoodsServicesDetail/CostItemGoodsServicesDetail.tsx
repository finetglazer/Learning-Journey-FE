/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import { OpinionCollectorIcon } from "assets/icons";
import PageHeader from "components/PageHeader/PageHeader";
import {
  Button,
  FormItem,
  InputText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { Col, Row } from "antd";
import LayoutDetail from "components/LayoutDetail/LayoutDetail";
import {
  APP_OVERVIEW,
  COST_ITEM_GOODS_SERVICES_MASTER_ROUTE,
} from "config/route-const";
import { utilService } from "core/services/common-services/util-service";
import "./CostItemGoodsServicesDetail.scss";
import {
  CostItemGoodsServicesDetailContext,
  useCostItemGoodsServicesDetailHook,
} from "./CostItemGoodsServicesDetailHook";

import { GoodsServicesSelectModal } from "./CostItemGoodsServicesContentModal/CostItemGoodsServicesContentModal";
import { Add } from "@carbon/icons-react";
import { isEmpty } from "lodash";
import { CostItemFilter } from "models/CostItem";
import { costItemRepository } from "pages/Catalog/CostItemPage/CostItemRepository";

const CostItemGoodsServicesDetail = () => {
  const [translate] = useTranslation();
  const { ...context } = useCostItemGoodsServicesDetailHook();

  const breadcrumbs = [
    {
      name: translate("costItemGoodsServices.breadcrumbs.home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate(
        "costItemGoodsServices.breadcrumbs.costItemGoodsServices"
      ),
      path: COST_ITEM_GOODS_SERVICES_MASTER_ROUTE,
    },
  ];

  return (
    <>
      <CostItemGoodsServicesDetailContext.Provider value={context}>
        <div className={classNames("page-content cost-line-cost-item-detail")}>
          <PageHeader
            title={
              !context.model?.id
                ? translate("costItemGoodsServices.create")
                : translate("costItemGoodsServices.update")
            }
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
          >
            <div className="d-flex">
              <Button
                type="secondary"
                className="m-r--xs"
                onClick={() => window.history.back()}
              >
                {translate("generalActions.close")}
              </Button>
              <Button
                type="primary"
                size="lg"
                onClick={() => context.handleSave()}
              >
                {translate("generalActions.save")}
              </Button>
            </div>
          </PageHeader>
          <LayoutDetail className="">
            <div className="title-detail m-b--xl">
              {translate("CM.tab_general_information")}
            </div>
            <Row className="p-l--sm">
              <Col lg={11} className="m-b--sm d-flex">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    context.model,
                    "costItem"
                  )}
                >
                  <Select
                    label={translate("costItemGoodsServices.costItemCode")}
                    placeHolder={translate(
                      "costItemGoodsServices.placeholder.costItem"
                    )}
                    isRequired
                    getList={costItemRepository.getDropdown}
                    value={
                      context.model?.costItem?.id
                        ? context.model?.costItem
                        : context.model?.costItemId
                        ? {
                            id: context.model?.costItemId,
                            name: context.model?.costItemName,
                            code: context.model?.costItemCode,
                          }
                        : undefined
                    }
                    classFilter={CostItemFilter}
                    onChange={context.handleChangeSelectField({
                      fieldName: "costItem",
                    })}
                    isSearch
                    searchProperty="search"
                    searchType={null}
                    isEnumerable={false}
                    render={(costItem) => {
                      return costItem?.id ? `${costItem?.code} ` : null;
                    }}
                    valueFilter={{
                      ...new CostItemFilter(),

                      pageIndex: 1,
                      pageSize: 20,
                    }}
                  />
                </FormItem>
              </Col>
              <Col lg={12} className="m-b--sm m-l--sm">
                <InputText
                  label={translate("costItemGoodsServices.costItemName")}
                  placeHolder={"--"}
                  value={
                    context.model?.costItem?.id
                      ? context.model?.costItem?.name
                      : context.model?.costItemName
                      ? context.model?.costItemName
                      : null
                  }
                  disabled
                />
              </Col>
            </Row>
            <div className="title-detail m-b--md">
              {translate("costItemGoodsServices.goodsServicesTab")}
            </div>
            <Row className="p-l--sm p-r--sm">
              <Col lg={24} className="m-b--sm">
                {!isEmpty(context.contents) ? (
                  <Button
                    type="tertiary"
                    icon={<Add />}
                    iconPlace="left"
                    onClick={context.handleOpenGoodsServicesModal}
                  >
                    {translate("costItemGoodsServices.addGoodsServices")}
                  </Button>
                ) : null}
              </Col>

              <Col lg={24} className="m-b--sm p-r--3xl">
                {isEmpty(context.contents) ? (
                  <div className="empty_data_section">
                    <img src={OpinionCollectorIcon} alt="Icon" />
                    <div className="body">
                      <span>
                        {translate(
                          "costItemGoodsServices.emptyDataGoodsServices"
                        )}
                      </span>
                      <Button
                        size="lg"
                        className="btn-opinion"
                        type="secondary"
                        icon={<Add />}
                        iconPlace="left"
                        onClick={context.handleOpenGoodsServicesModal}
                      >
                        {translate("costItemGoodsServices.addGoodsServices")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <StandardTable
                    rowKey="goodsServicesId"
                    isDragable
                    loading={context.loadingList}
                    columns={context.contentColumns}
                    dataSource={context.contents}
                  />
                )}
              </Col>
            </Row>
          </LayoutDetail>
        </div>
        <GoodsServicesSelectModal />
        {context.loading && <LoadingCM />}
      </CostItemGoodsServicesDetailContext.Provider>
    </>
  );
};

export default CostItemGoodsServicesDetail;
