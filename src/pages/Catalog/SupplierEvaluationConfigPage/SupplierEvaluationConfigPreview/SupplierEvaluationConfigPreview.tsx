/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { Button, StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { Collapse, Table } from "antd";
import LayoutDetail from "components/LayoutDetail/LayoutDetail";

import { IcArrowDown } from "assets/icons";
import { supplierManagementBreadcrumb } from "pages/Catalog/constants";
import GeneralInforView from "./GeneralInforView/GeneralInforView";
import "./SupplierEvaluationConfigPreview.scss";
import { useSupplierEvaluationConfigPreviewHook } from "./SupplierEvaluationConfigPreviewHook";

const SupplierEvaluationConfigPreview = () => {
  const [translate] = useTranslation();
  const {
    model,
    loading,
    handleGoMaster,
    evaluationItemColumns,
    evaluationResultColumns,
  } = useSupplierEvaluationConfigPreviewHook();

  const breadcrumbs = [
    ...supplierManagementBreadcrumb,
    {
      name: translate(
        "supplierEvaluationConfigs.breadcrumbs.supplierEvaluationConfig"
      ),
    },
  ];

  const collapseItems = [
    {
      key: "1",
      label: (
        <div className="title-detail ">
          {translate("CM.tab_general_information")}
        </div>
      ),
      children: <GeneralInforView model={model} />,
    },

    {
      key: "2",
      label: (
        <div className="title-detail">
          {translate("supplierEvaluationConfigs.evaluationItem")}
        </div>
      ),
      children: (
        <StandardTable
          rowKey="id"
          isDragable
          columns={evaluationItemColumns}
          dataSource={model.evaluationItems}
          scroll={{ y: "calc(100vh - 100px)" }}
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
                    colSpan={2}
                    className="text-bold"
                  >
                    {translate("supplierEvaluationConfigs.totalWeight")}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={1} className="text-bold">
                    <div>{totalWeight}</div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      ),
    },
    {
      key: "3",
      label: (
        <div className="title-detail">
          {translate("supplierEvaluationConfigs.evaluationResult")}
        </div>
      ),
      children: (
        <StandardTable
          rowKey="id"
          isDragable
          columns={evaluationResultColumns}
          dataSource={model.evaluationResults}
          scroll={{ y: "calc(100vh - 300px)" }}
        />
      ),
    },
  ];

  return (
    <>
      <div className={classNames("page-content goods-services-detail")}>
        <PageHeader
          title={translate("supplierEvaluationConfigs.preview")}
          breadcrumbs={breadcrumbs}
          className="page-header"
          isShowBackButton
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
          <Collapse
            ghost
            className="collage_custom collage_custom_border"
            expandIconPosition="end"
            defaultActiveKey={["1", "2", "3"]}
            expandIcon={({ isActive }) => (
              <div>
                <img
                  src={IcArrowDown}
                  className={classNames(
                    "invoice-transition",
                    isActive && "invoice-transition_expand"
                  )}
                  alt=""
                />
              </div>
            )}
            items={collapseItems}
          />
        </LayoutDetail>
      </div>

      {loading && <LoadingCM />}
    </>
  );
};

export default SupplierEvaluationConfigPreview;
