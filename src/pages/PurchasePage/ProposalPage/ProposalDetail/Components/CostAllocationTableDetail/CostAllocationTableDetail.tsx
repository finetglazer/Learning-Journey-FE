import { ColumnProps } from "antd/lib/table";
import { IcArrowDown, ViewBudgetIcon } from "assets/icons";
import classNames from "classnames";
import { addNumbers, formatNumber } from "core/helpers/number";
import { CostAllocation, ProposalCreateModel } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import React, { useContext, useState } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./CostAllocationTableDetail.scss";
import ModalBudgetStatus from "components/ModalBudgetStatus/ModalBudgetStatus";
import { VND_CURRENCY } from "models/Payment";
const CostAllocationTableDetail = () => {
  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const [translate] = useTranslation();
  const [isOpenModalBudgetOverView, setIsOpenModalBudgetOverView] =
    useState(false);
  const [collapse, setCollapse] = useState<boolean>(true);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  const columns: ColumnProps<CostAllocation>[] = React.useMemo(
    () => [
      {
        title: (
          <div className="columns-table">
            <label className={classNames("component__title")}>
              {translate("PP.branch_office")}
            </label>
          </div>
        ),
        key: "businessBranchId",
        dataIndex: "businessBranchId",
        width: 200,
        render: (businessBranchId, record: CostAllocation) => {
          if (record.isTotal) {
            return (
              <label className="fw-bold p-x--2xs">
                {translate("PP.total")}
              </label>
            );
          }
          return (
            <LayoutCell>
              <OneLineText
                className="data-column"
                value={`${record?.businessBranchId?.code} - ${record?.businessBranchId?.name}`}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <div className="columns-table">
            <label className={classNames("component__title")}>
              {translate("PP.department_block")}
            </label>
          </div>
        ),
        width: 200,
        key: "businessUnitId",
        dataIndex: "businessUnitId",
        render: (text, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="data-column"
                value={`${record?.businessUnitId?.code} - ${record?.businessUnitId?.name}`}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="columns-table">
            <label className={classNames("component__title")}>
              {translate("PP.sub_department")}
            </label>
          </div>
        ),
        width: 200,
        key: "businessDepartmentId",
        dataIndex: "businessDepartmentId",
        render: (text, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="data-column"
                value={`${record?.businessDepartmentId?.code} - ${record?.businessDepartmentId?.name}`}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="columns-table">
            <label
              style={{ textAlign: "right" }}
              className={classNames("component__title")}
            >
              {translate("PP.estimated_amount")}
            </label>
            <span className="columns-table__vnd">{model?.currency?.code}</span>
          </div>
        ),
        width: 200,
        key: "estimateAmount",
        dataIndex: "estimateAmount",
        render: (text, record: CostAllocation) => {
          if (record.isTotal)
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column-total"
                  value={formatNumber(
                    model.costAllocation.reduce(
                      (total: number, item: { estimateAmount: number }) =>
                        addNumbers(total || 0, item?.estimateAmount || 0),
                      0
                    )
                  )}
                />
              </LayoutCell>
            );
          return (
            <LayoutCell position="right">
              <OneLineText
                className="data-column"
                value={formatNumber(addNumbers(record?.estimateAmount))}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="columns-table">
            <label
              style={{ textAlign: "right" }}
              className={classNames("component__title")}
            >
              {translate("PP.reserve_amount")}
            </label>
            <span className="columns-table__vnd">{model?.currency?.code}</span>
          </div>
        ),
        width: 200,
        key: "contingencyAmount",
        render: (record: CostAllocation) => {
          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="data-column-total"
                  value={formatNumber(
                    model.costAllocation.reduce(
                      (total: number, item: { contingencyAmount: number }) =>
                        addNumbers(total || 0, item?.contingencyAmount || 0),
                      0
                    )
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className="data-column"
                value={formatNumber(addNumbers(record?.contingencyAmount))}
              />
            </LayoutCell>
          );
        },
      },

      ...(model.status !== 1 || model.isAdjust
        ? [
            {
              title: () => (
                <div className="columns-table">
                  <label
                    style={{ textAlign: "right" }}
                    className={classNames("component__title")}
                  >
                    {translate("PP.used_amount")}
                  </label>
                  <span className="columns-table__vnd">
                    {model?.currency?.code}
                  </span>
                </div>
              ),
              width: 200,
              key: "usedAmount",
              render: (record: CostAllocation) => {
                if (record?.isTotal) {
                  return (
                    <LayoutCell position="right">
                      <OneLineText
                        className="data-column-total"
                        value={formatNumber(
                          model.costAllocation.reduce(
                            (total: number, item: { usedAmount: number }) =>
                              (total || 0) + (item?.usedAmount || 0),
                            0
                          )
                        )}
                      />
                    </LayoutCell>
                  );
                }
                return (
                  <LayoutCell position="right">
                    <OneLineText
                      className="data-column"
                      value={formatNumber(addNumbers(record?.usedAmount || 0))}
                    />
                  </LayoutCell>
                );
              },
            },
          ]
        : []),

      {
        title: () => (
          <div className="columns-table">
            <label className={classNames("component__title")}>
              {translate("PM.project_budget_item")}
            </label>
          </div>
        ),
        width: 200,
        key: "projectId",
        render: (record) => {
          if (record?.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="data-column"
                value={`${record.projectId?.code} - ${record.projectId?.name}`}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="columns-table">
            <label className={classNames("component__title")}>
              {translate("PM.cost_line")}
            </label>
          </div>
        ),
        width: 200,
        key: "costLineId",
        render: (record) => {
          if (record?.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="data-column"
                value={record.costLineId?.name}
              />
            </LayoutCell>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model, translate]
  );

  return (
    <>
      <div className="collapse-table" onClick={handleChangeCollapse}>
        <img
          className={classNames("cursor-pointer", {
            "rotate-180": collapse,
            "rotate-0": !collapse,
          })}
          src={IcArrowDown}
          alt="img"
          width={16}
          height={16}
        />
      </div>
      {collapse && (
        <div className="cost-allocation-detail">
          <Button
            icon={<img src={ViewBudgetIcon} alt="img" width={16} height={16} />}
            iconPlace="left"
            type="text"
            onClick={() => {
              setIsOpenModalBudgetOverView(true);
            }}
            className="btn-budget"
          >
            {translate("PM.view_budget_status")}
          </Button>
          <div className="cost-allocation-detail-content">
            <StandardTable
              rowKey={"id"}
              columns={columns}
              dataSource={[
                ...model.costAllocation,
                {
                  isTotal: true,
                },
              ]}
              isDragable={true}
              idContainer="table-id"
              rowClassName="cost-allocation-row"
              scroll={{ y: "calc(100vh - 320px)" }}
              className="cost-allocation-row_selection row-height-64px"
            />
          </div>
          {isOpenModalBudgetOverView && (
            <ModalBudgetStatus
              costAllocation={model?.costAllocation}
              purposeOfPurchase={model?.procurementPurpose}
              handleCancelModalBudgetStatus={() => {
                setIsOpenModalBudgetOverView(false);
              }}
              open
              isProposal={true}
              rate={
                model.currency?.code != VND_CURRENCY
                  ? model?.rateInfo?.rate
                  : null
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default CostAllocationTableDetail;
