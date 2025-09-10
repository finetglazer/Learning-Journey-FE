/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import {
  ActionBarComponent,
  Button,
  FormItem,
  InputNumber,
  InputText,
  StandardTable,
  Tag,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { Col, Row, Switch, Table } from "antd";
import LayoutDetail from "components/LayoutDetail/LayoutDetail";
import { utilService } from "core/services/common-services/util-service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isEmpty, isEqual } from "lodash";

import "./SupplierEvaluationConfigDetail.scss";
import {
  SupplierEvaluationConfigDetailContext,
  useSupplierEvaluationConfigDetailHook,
} from "./SupplierEvaluationConfigDetailHook";

import { Add } from "@carbon/icons-react";
import { OpinionCollectorIcon } from "assets/icons";
import { supplierManagementBreadcrumb } from "pages/Catalog/constants";
import { useMemo } from "react";
import { EvaluationItemModalModal } from "./ContentModal/EvaluationItemModal";
import { EvaluationResultModalModal } from "./ContentModal/EvaluationResultModal";
import { EvaluationItem } from "models/EvaluationItem";

const SupplierEvaluationConfigDetail = () => {
  const [translate] = useTranslation();
  const { ...context } = useSupplierEvaluationConfigDetailHook();

  const title = useMemo(
    () =>
      !context?.model?.id
        ? translate("supplierEvaluationConfigs.create")
        : translate("supplierEvaluationConfigs.update"),
    [context?.model?.id, translate]
  );

  const breadcrumbs = [
    ...supplierManagementBreadcrumb,
    {
      name: translate(
        "supplierEvaluationConfigs.breadcrumbs.supplierEvaluationConfig"
      ),
    },
  ];

  const renderStatusDetail = () => {
    return (
      <Tag
        value={
          isEqual(context?.model?.isActive, true)
            ? translate("supplierEvaluationConfigs.active")
            : translate("supplierEvaluationConfigs.inactive")
        }
        className="m-l--2xs"
        size="sm"
        status={isEqual(context?.model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
        isShowBorder
        isShowDot={false}
      />
    );
  };

  const totalWeight = (items: EvaluationItem[]) => {
    let total = 0;
    items.forEach((item) => {
      total += item.weight;
    });
    return total;
  };

  return (
    <>
      <SupplierEvaluationConfigDetailContext.Provider value={context}>
        <div
          className={classNames(
            "page-content supplier-evaluation-config-detail"
          )}
        >
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
                <div className={"label-title m-r--xs"}>
                  {translate("supplierEvaluationConfigs.status")}
                </div>
                <Switch
                  checked={context.model.isActive}
                  onChange={(checked) => {
                    context.handleChangeSingleField({
                      fieldName: "isActive",
                    })(checked);
                  }}
                  className={"switch_status"}
                />
                <span className="m-l--xs">
                  {translate("supplierEvaluationConfigs.active")}
                </span>
              </Col>
              <Col span={8} className="p-r--xs p-b--xs">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    context.model,
                    "code"
                  )}
                >
                  <InputText
                    isRequired
                    maxLength={500}
                    label={translate("supplierEvaluationConfigs.code")}
                    placeHolder={translate(
                      "supplierEvaluationConfigs.placeholder.code"
                    )}
                    value={context.model.code}
                    onChange={context.handleChangeSingleField({
                      fieldName: "code",
                    })}
                  />
                </FormItem>
              </Col>
              <Col span={16} className="p-r--xs p-b--xs">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    context.model,
                    "name"
                  )}
                >
                  <InputText
                    isRequired
                    maxLength={500}
                    label={translate("supplierEvaluationConfigs.name")}
                    placeHolder={translate(
                      "supplierEvaluationConfigs.placeholder.name"
                    )}
                    value={context.model.name}
                    onChange={context.handleChangeSingleField({
                      fieldName: "name",
                    })}
                  />
                </FormItem>
              </Col>

              <Col span={24} className="p-r--xs p-b--xs">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    context.model,
                    "maximumScore"
                  )}
                >
                  <InputNumber
                    isRequired
                    label={translate("supplierEvaluationConfigs.maximumScore")}
                    placeHolder={translate(
                      "supplierEvaluationConfigs.placeholder.maximumScore"
                    )}
                    value={context.model.maximumScore}
                    onChange={context.handleChangeSingleField({
                      fieldName: "maximumScore",
                    })}
                    disabled
                  />
                </FormItem>
              </Col>

              <Col span={24} className="p-r--xs p-b--xs">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    context.model,
                    "description"
                  )}
                >
                  <TextArea
                    maxLength={500}
                    label={translate("supplierEvaluationConfigs.description")}
                    placeHolder={translate(
                      "supplierEvaluationConfigs.placeholder.description"
                    )}
                    value={context.model.description}
                    onChange={context.handleChangeSingleField({
                      fieldName: "description",
                    })}
                    showCount
                    translate={translate}
                  />
                </FormItem>
              </Col>
            </Row>

            <div className="title-detail m-b--xl m-t--xs">
              {translate("supplierEvaluationConfigs.evaluationItem")}
            </div>

            <Row className="p-l--sm p-r--sm">
              <Col span={24} className="p-r--xs p-b--xs">
                {!isEmpty(context.evaluationItems) ? (
                  <Button
                    type="tertiary"
                    icon={<Add />}
                    iconPlace="left"
                    onClick={() => context.handleAddNewContent("Item")}
                    disabled={totalWeight(context.evaluationItems) >= 100}
                  >
                    {translate("supplierEvaluationConfigs.addItem")}
                  </Button>
                ) : null}
              </Col>
              <Col lg={24} className="m-b--sm">
                {isEmpty(context.evaluationItems) ? (
                  <div className="empty_data_section">
                    <img src={OpinionCollectorIcon} alt="Icon" />
                    <div className="body">
                      <span>
                        {translate(
                          "supplierEvaluationConfigs.emptyEvaluationItem"
                        )}
                      </span>
                      <Button
                        size="lg"
                        className="btn-opinion"
                        type="secondary"
                        icon={<Add />}
                        iconPlace="left"
                        onClick={() => context.handleAddNewContent("Item")}
                        disabled={totalWeight(context.evaluationItems) >= 100}
                      >
                        {translate("supplierEvaluationConfigs.addItem")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <ActionBarComponent
                      selectedRowKeys={context.selectedEvaluationItemRowKeys}
                      setSelectedRowKeys={
                        context.setSelectedEvaluationItemRowKeys
                      }
                    >
                      <Button
                        type="secondary"
                        size="sm"
                        onClick={() =>
                          context.handleBulkDeleteContent(
                            "Item",
                            context.selectedEvaluationItemRowKeys
                          )
                        }
                      >
                        {translate("CM.txt_delete")}
                      </Button>
                    </ActionBarComponent>
                    <StandardTable
                      rowKey="id"
                      isDragable
                      loading={context.loadingContent}
                      columns={context.evaluationItemColumns}
                      dataSource={context.evaluationItems}
                      rowSelection={context.evaluationItemRowSelection}
                      scroll={{ y: "calc(100vh - 320px)" }}
                      summary={(pageData) => {
                        let totalWeight = 0;

                        pageData.forEach(({ weight }) => {
                          totalWeight += weight;
                        });

                        return (
                          <>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={0}
                                colSpan={3}
                                className="text-bold"
                              >
                                {translate(
                                  "supplierEvaluationConfigs.totalWeight"
                                )}
                              </Table.Summary.Cell>

                              <Table.Summary.Cell
                                index={1}
                                className="text-bold"
                              >
                                <div>{totalWeight}</div>
                                <div className="text-danger">
                                  {context?.model?.errors?.evaluationItems}
                                </div>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          </>
                        );
                      }}
                    />
                  </>
                )}
              </Col>
            </Row>

            <div className="title-detail m-b--xl m-t--xs">
              {translate("supplierEvaluationConfigs.evaluationResult")}
            </div>

            <Row className="p-l--sm p-r--sm">
              <Col span={24} className="p-r--xs p-b--xs">
                {!isEmpty(context.evaluationResults) ? (
                  <Button
                    type="tertiary"
                    icon={<Add />}
                    iconPlace="left"
                    onClick={() => context.handleAddNewContent("Result")}
                  >
                    {translate("supplierEvaluationConfigs.addResult")}
                  </Button>
                ) : null}
              </Col>
              <Col lg={24} className="m-b--sm">
                {isEmpty(context.evaluationResults) ? (
                  <div className="empty_data_section">
                    <img src={OpinionCollectorIcon} alt="Icon" />
                    <div className="body">
                      <span>
                        {translate("supplierEvaluationConfigs.emptyDataResult")}
                      </span>
                      <Button
                        size="lg"
                        className="btn-opinion"
                        type="secondary"
                        icon={<Add />}
                        iconPlace="left"
                        onClick={() => context.handleAddNewContent("Result")}
                      >
                        {translate("supplierEvaluationConfigs.addResult")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <ActionBarComponent
                      selectedRowKeys={context.selectedEvaluationResultRowKeys}
                      setSelectedRowKeys={
                        context.setSelectedEvaluationResultRowKeys
                      }
                    >
                      <Button
                        type="secondary"
                        size="sm"
                        onClick={() =>
                          context.handleBulkDeleteContent(
                            "Result",
                            context.selectedEvaluationResultRowKeys
                          )
                        }
                      >
                        {translate("CM.txt_delete")}
                      </Button>
                    </ActionBarComponent>

                    <StandardTable
                      rowKey="id"
                      isDragable
                      loading={context.loadingContent}
                      columns={context.evaluationResultColumns}
                      dataSource={context.evaluationResults}
                      rowSelection={context.evaluationResultRowSelection}
                      scroll={{ y: "calc(100vh - 100px)" }}
                    />
                  </>
                )}
              </Col>
            </Row>
          </LayoutDetail>
        </div>
        {context.loading && <LoadingCM />}
        <EvaluationItemModalModal />
        <EvaluationResultModalModal />
      </SupplierEvaluationConfigDetailContext.Provider>
    </>
  );
};

export default SupplierEvaluationConfigDetail;
