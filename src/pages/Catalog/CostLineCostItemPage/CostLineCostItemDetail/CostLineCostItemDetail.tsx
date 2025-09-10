/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import { OpinionCollectorIcon } from "assets/icons";
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import {
  Button,
  FormItem,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { Col, Row } from "antd";
import LayoutDetail from "components/LayoutDetail/LayoutDetail";
import { utilService } from "core/services/common-services/util-service";
import "./CostLineCostItemDetail.scss";
import {
  CostLineCostItemDetailContext,
  useCostLineCostItemDetailHook,
} from "./CostLineCostItemDetailHook";

import { Add } from "@carbon/icons-react";
import { isEmpty } from "lodash";
import { CostLineFilter } from "models/CostLine";
import { budgetManagementBreadcrumb } from "pages/Catalog/constants";
import { useMemo } from "react";
import { costLineCostItemRepository } from "../CostLineCostItemRepository";
import { CostItemSelectModal } from "./CostLineCostItemContentModal/CostLineCostItemContentModal";

const CostLineCostItemDetail = () => {
  const [translate] = useTranslation();
  const { ...context } = useCostLineCostItemDetailHook();

  const title = useMemo(
    () =>
      !context.model?.id
        ? translate("costLineCostItems.create")
        : translate("costLineCostItems.update"),
    [context.model?.id, translate]
  );

  const breadcrumbs = [
    ...budgetManagementBreadcrumb,
    {
      name: title,
    },
  ];

  return (
    <>
      <CostLineCostItemDetailContext.Provider value={context}>
        <div className={classNames("page-content cost-line-cost-item-detail")}>
          <PageHeader
            title={title}
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
            <Row className="p-l--sm p-r--sm">
              <Col lg={24} className="m-b--sm d-flex">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    context.model,
                    "costLineId"
                  )}
                >
                  <Select
                    label={translate("costLineCostItems.costLine")}
                    placeHolder={translate(
                      "costLineCostItems.placeholder.costLine"
                    )}
                    isRequired
                    getList={costLineCostItemRepository.getDropdown}
                    value={
                      context.model?.costLine?.id
                        ? context.model?.costLine
                        : context.model?.costLineId
                        ? {
                            id: context.model?.costLineId,
                            name: context.model?.costLineName,
                            code: context.model?.costLineCode,
                          }
                        : undefined
                    }
                    classFilter={CostLineFilter}
                    onChange={context.handleChangeSelectField({
                      fieldName: "costLine",
                    })}
                    isSearch
                    searchProperty="search"
                    searchType={null}
                    isEnumerable={false}
                    render={(costLine) => {
                      return costLine?.id
                        ? `${costLine?.code} - ${costLine?.name}`
                        : null;
                    }}
                  />
                </FormItem>
              </Col>
            </Row>
            <div className="title-detail m-b--md">
              {translate("costLineCostItems.costItemsTab")}
            </div>
            <Row className="p-l--sm p-r--sm">
              <Col lg={24} className="m-b--sm">
                {isEmpty(context.contents) ? (
                  <div className="empty_data_section">
                    <img src={OpinionCollectorIcon} alt="Icon" />
                    <div className="body">
                      <span>
                        {translate("costLineCostItems.emptyDataCostItem")}
                      </span>
                      <Button
                        size="lg"
                        className="btn-opinion"
                        type="secondary"
                        icon={<Add />}
                        iconPlace="left"
                        onClick={context.handleOpenCostItemModal}
                      >
                        {translate("costLineCostItems.addCostItem")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      type="tertiary"
                      icon={<Add />}
                      iconPlace="left"
                      className="m-b--sm"
                      onClick={context.handleOpenCostItemModal}
                    >
                      {translate("costLineCostItems.addCostItem")}
                    </Button>
                    <StandardTable
                      rowKey="costItemId"
                      isDragable
                      loading={context.loadingList}
                      columns={context.contentColumns}
                      dataSource={context.contents}
                      scroll={{ y: "calc(100vh - 326px)" }}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </LayoutDetail>
        </div>
        <CostItemSelectModal />
        {context.loading && <LoadingCM />}
      </CostLineCostItemDetailContext.Provider>
    </>
  );
};

export default CostLineCostItemDetail;
