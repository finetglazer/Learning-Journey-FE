import { ColumnProps } from "antd/lib/table";
import { AdvancedCollapseView } from "components";
import { formatNumber } from "core/helpers/number";
import {
  CriteriaType,
  EvaluationGroupResult,
  EvaluationMethod,
  EvaluationResult,
  SupplierEvaluation,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import { useMemo } from "react";
import {
  Drawer,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { getStatusByPassFlag } from "../../helper";
import "./DetailReviewSupplierDrawer.scss";
import { isNil } from "lodash";

type Props = {
  visible?: boolean;
  onPressClose?: () => void;
  data?: EvaluationResult;
};

const DetailReviewSupplierDrawer = ({ onPressClose, data }: Props) => {
  const [translate] = useTranslation();

  const columnsTechnicalCriteria: ColumnProps<SupplierEvaluation>[] = useMemo(
    () => [
      {
        title: translate("PL.txt_stt"),
        key: "index",
        dataIndex: "index",
        sorter: false,
        width: 46,
        render(item, record, index) {
          if (record.isOriginResult) {
            return (
              <OneLineText
                value={translate("PL.txt_origin_result")}
                className="fw-medium"
              />
            );
          }
          return (
            <LayoutCell>
              <OneLineText value={`${index + 1}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_criteria_name"),
        key: "name",
        dataIndex: "name",
        sorter: false,
        render(item) {
          return (
            <LayoutCell>
              <OneLineText value={item} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_evaluator"),
        key: "evaluationUser",
        dataIndex: "evaluationUser",
        sorter: false,
        width: 160,
        align: "end",
        render(item) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className="fw-medium"
                value={item?.name}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_review_summary_assessment_score"),
        key: "passFlag",
        dataIndex: "passFlag",
        sorter: false,
        width: 130,
        align: "end",
        render(item) {
          return (
            <LayoutCell position="right">
              <OneLineText value={getStatusByPassFlag(item)} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const columnsTechnicalScoreCriteria: ColumnProps<SupplierEvaluation>[] =
    useMemo(
      () => [
        {
          title: translate("PL.txt_stt"),
          key: "index",
          dataIndex: "index",
          sorter: false,
          width: 46,
          render(item, record, index) {
            return (
              <LayoutCell>
                <OneLineText value={`${index + 1}`} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("PL.txt_criteria_name"),
          key: "name",
          dataIndex: "name",
          sorter: false,
          render(item) {
            return (
              <LayoutCell>
                <OneLineText value={item} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("PL.txt_review_summary_maximum_score"),
          key: "maximumPointScale",
          dataIndex: "maximumPointScale",
          sorter: false,
          width: 110,
          align: "end",
          render(item) {
            return (
              <LayoutCell position="right">
                <OneLineText value={item} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("PL.txt_review_summary_minimum_passing_score"),
          key: "minimumPointScale",
          dataIndex: "minimumPointScale",
          sorter: false,
          width: 150,
          align: "end",
          render(item) {
            return (
              <LayoutCell position="right">
                <OneLineText value={item} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("PL.txt_evaluator"),
          key: "evaluationUser",
          dataIndex: "evaluationUser",
          sorter: false,
          width: 160,
          align: "end",
          render(item) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="fw-medium"
                  value={item?.name}
                  useTooltip
                />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("PL.txt_review_summary_assessment_score"),
          key: "point",
          dataIndex: "point",
          sorter: false,
          width: 130,
          align: "end",
          render(item) {
            return (
              <LayoutCell position="right">
                <OneLineText value={item} useTooltip />
              </LayoutCell>
            );
          },
        },
      ],
      [translate]
    );

  const renderFooterTechnicalCriteriaScore = (data: EvaluationGroupResult) => {
    return (
      <div>
        <div className="item border_bottom">
          <span className="label">{translate("PL.txt_origin_result")}</span>
          <span className="value">
            {formatNumber(data?.startPoint) ?? "---"}
          </span>
        </div>
        <div className="item">
          <span className="label">{translate("PL.txt_edit_result")}</span>
          <span className="value">
            {formatNumber(data?.editedPoint) ?? "---"}
          </span>
        </div>
      </div>
    );
  };

  const renderFooterTechnicalCriteria = (data: EvaluationGroupResult) => {
    const passFlag = data?.editedPassFlag;
    const status = getStatusByPassFlag(passFlag);

    return (
      <div>
        <div className="item">
          <span className="label">{translate("PL.txt_edit_result")}</span>
          <span className="value">{status}</span>
        </div>
      </div>
    );
  };

  const renderFooterFinancialCriteria = (data: EvaluationGroupResult) => {
    if (data?.evaluationMethod == EvaluationMethod.PassFail) {
      return renderFooterTechnicalCriteria(data);
    }
    return renderFooterTechnicalCriteriaScore(data);
  };

  const getDataTableByCriteriaType = (
    type: CriteriaType,
    technicalCompetenceType?: TechnicalCompetenceType
  ) => {
    return data?.evaluationGroupResult?.find((item) => {
      if (!isNil(technicalCompetenceType)) {
        return (
          item?.criteriaType == type &&
          item?.evaluationMethod == technicalCompetenceType
        );
      }
      return item?.criteriaType == type;
    });
  };

  const FinancialCriteria = () => {
    return (
      <div>
        <StandardTable
          rowKey="id"
          isDragable
          columns={
            getDataTableByCriteriaType(CriteriaType.Finance)
              ?.evaluationMethod == EvaluationMethod.PassFail
              ? columnsTechnicalCriteria
              : columnsTechnicalScoreCriteria
          }
          dataSource={
            getDataTableByCriteriaType(CriteriaType.Finance)
              ?.evaluationItemResult
          }
          scroll={{ y: "calc(100vh - 546px)" }}
          footer={() =>
            renderFooterFinancialCriteria(
              getDataTableByCriteriaType(CriteriaType.Finance)
            )
          }
        />
      </div>
    );
  };

  const TechnicalCriteria = () => {
    return (
      <div>
        <StandardTable
          rowKey="id"
          isDragable
          columns={columnsTechnicalCriteria}
          dataSource={
            getDataTableByCriteriaType(
              CriteriaType.TechnicalCompetence,
              TechnicalCompetenceType.TechnicalCriteriaMet
            )?.evaluationItemResult
          }
          scroll={{ y: "calc(100vh - 546px)" }}
          footer={() =>
            renderFooterTechnicalCriteria(
              getDataTableByCriteriaType(
                CriteriaType.TechnicalCompetence,
                TechnicalCompetenceType.TechnicalCriteriaMet
              )
            )
          }
        />
      </div>
    );
  };

  const TechnicalScoreCriteria = () => {
    return (
      <div>
        <StandardTable
          rowKey="id"
          isDragable
          columns={columnsTechnicalScoreCriteria}
          dataSource={
            getDataTableByCriteriaType(
              CriteriaType.TechnicalCompetence,
              TechnicalCompetenceType.TechnicalScore
            )?.evaluationItemResult
          }
          scroll={{ y: "calc(100vh - 546px)" }}
          footer={() =>
            renderFooterTechnicalCriteriaScore(
              getDataTableByCriteriaType(
                CriteriaType.TechnicalCompetence,
                TechnicalCompetenceType.TechnicalScore
              )
            )
          }
        />
      </div>
    );
  };

  const checkShowFinancial = getDataTableByCriteriaType(CriteriaType.Finance);

  const checkShowTechnical = getDataTableByCriteriaType(
    CriteriaType.TechnicalCompetence,
    TechnicalCompetenceType.TechnicalCriteriaMet
  );

  const checkShowTechnicalScore = getDataTableByCriteriaType(
    CriteriaType.TechnicalCompetence,
    TechnicalCompetenceType.TechnicalScore
  );

  return (
    <Drawer
      size={"xl"}
      loading={false}
      visible={true}
      titleButtonCancel={translate("PR.drawer_btn_delete_goods")}
      titleButtonApply={translate("PR.drawer_btn_save")}
      handleClose={onPressClose}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={false}
      visibleFooter={false}
      className="detail_review_drawer"
      title={
        <div className="fw-bold">
          <span>{translate("PL.txt_supplier_evaluation_information")}</span>
          <span className="txt_blue p-l--3xs">{data?.supplier?.name}</span>
        </div>
      }
    >
      <div className="detail_review_drawer__content">
        {checkShowTechnical && (
          <div className="item_content">
            <AdvancedCollapseView
              items={[
                {
                  key: "1",
                  label: translate("PL.txt_technical_criteria_met"),
                  children: <TechnicalCriteria />,
                },
              ]}
              className="content__collapse"
            />
          </div>
        )}
        {checkShowTechnicalScore && (
          <div className="item_content">
            <AdvancedCollapseView
              defaultActiveKey={["1"]}
              items={[
                {
                  key: "1",
                  label: translate("PL.txt_technical_score_criteria"),
                  children: <TechnicalScoreCriteria />,
                },
              ]}
              className="content__collapse"
            />
          </div>
        )}
        {checkShowFinancial && (
          <div className="item_content">
            <AdvancedCollapseView
              items={[
                {
                  key: "1",
                  label: translate("PL.txt_financial_criteria"),
                  children: <FinancialCriteria />,
                },
              ]}
              className="content__collapse"
            />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default DetailReviewSupplierDrawer;
