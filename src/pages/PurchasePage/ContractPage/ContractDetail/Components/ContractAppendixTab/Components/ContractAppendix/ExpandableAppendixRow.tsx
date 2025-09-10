/* eslint-disable import/named */
import { Col, Row, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import CollapseView from "components/Collapse/CollapseView";
import { TFunction } from "i18next";
import { AppendixTerm, ContractAppendix } from "models/Contract";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

type ExpandableAppendixRowProps = {
  data?: ContractAppendix;
};

enum ExpandableAppendixSectionKey {
  GENERAL_INFO = "GENERAL_INFO",
  APPENDIX_TERMS = "APPENDIX_TERMS",
}

const ExpandableAppendixRow = ({ data }: ExpandableAppendixRowProps) => {
  const [translate] = useTranslation();

  const collapseItems = useMemo(
    () => [
      {
        key: ExpandableAppendixSectionKey.GENERAL_INFO,
        label: translate("CT.create_contract.general_information"),
        children: <GeneralInfo data={data} translate={translate} />,
      },
      {
        key: ExpandableAppendixSectionKey.APPENDIX_TERMS,
        label: translate("CT.contract_appendix.appendix_term"),
        children: <AppendixTermComponent data={data} translate={translate} />,
      },
    ],
    [data, translate]
  );

  return (
    <div className="expandable-appendix-wrapper">
      <CollapseView
        className={classNames("collapse__container--not-border")}
        items={collapseItems}
        defaultActiveKey={[
          ExpandableAppendixSectionKey.GENERAL_INFO,
          ExpandableAppendixSectionKey.APPENDIX_TERMS,
        ]}
        expandIconPosition="end"
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
      />
    </div>
  );
};

type GeneralInfoProps = ExpandableAppendixRowProps & {
  translate: TFunction<"translation", undefined>;
};

const GeneralInfo = ({ data, translate }: GeneralInfoProps) => {
  return (
    <div className="general-info">
      <Row className="item_row row_top">
        <Col span={12} className="item_col">
          <span className="label">
            {translate("CT.contract_appendix.appendix_number")}
          </span>
          <span className="value">{data?.code}</span>
        </Col>
        <Col span={12} className="item_col">
          <span className="label">
            {translate("CT.contract_appendix.appendix_name")}
          </span>
          <span className="value">{data?.name}</span>
        </Col>
      </Row>
      <Row className="item_row">
        <Col span={24} className="item_col">
          <span className="label">{translate("CM.txt_description")}</span>
          <span className="value">{data?.description}</span>
        </Col>
      </Row>
    </div>
  );
};

const AppendixTermComponent = ({ data, translate }: GeneralInfoProps) => {
  const columns: ColumnProps<AppendixTerm>[] = useMemo(
    () => [
      {
        title: translate("CT.contract_appendix.column_term"),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: 300,
        render(val: AppendixTerm["code"]) {
          return (
            <LayoutCell>
              <OneLineText value={val} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_appendix.column_description"),
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        render(val: ContractAppendix["description"]) {
          return (
            <LayoutCell>
              <Tooltip
                title={val}
                placement="topLeft"
                overlayStyle={{ maxWidth: 1000, whiteSpace: "normal" }}
              >
                <div className="text-in-table-cell">
                  <div className="w100pc">
                    <div className="text-ellipsis">{val}</div>
                  </div>
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <div>
      <StandardTable
        rowKey="id"
        isDragable
        columns={columns}
        dataSource={data?.appendixTerms}
        idContainer="contract-appendix__table-row"
        scroll={{ y: "calc(100vh - 430px)" }}
        className="contract-appendix__table_row"
      />
    </div>
  );
};

export default ExpandableAppendixRow;
