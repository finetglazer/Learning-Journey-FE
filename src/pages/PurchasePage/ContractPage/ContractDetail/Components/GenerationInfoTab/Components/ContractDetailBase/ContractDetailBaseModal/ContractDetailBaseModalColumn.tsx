import { ColumnProps } from "antd/lib/table";
import { ColumnKey, Contract } from "models/Contract";
import { LayoutCell, OneLineText, Radio } from "react-components-design-system";
import { listMenuShoppingType } from "config/const";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import classNames from "classnames";
import { Organization } from "models/Organization";

type props = {
  translate: (key: string) => string;
  onChangeShoppingPlan: (value: string) => void;
  shoppingPlanValue: string;
};

const ContractDetailBaseModalColumn = ({
  translate,
  onChangeShoppingPlan,
  shoppingPlanValue,
}: props): ColumnProps<Contract>[] => {
  return [
    {
      title: "",
      dataIndex: ColumnKey.ID,
      key: ColumnKey.ID,
      width: 40,
      render: (id) => {
        return (
          <LayoutCell>
            <Radio
              checked={shoppingPlanValue === id}
              onChange={() => onChangeShoppingPlan(id)}
              value={id}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          <div className={classNames("component__title text-nowrap")}>
            {typeof translate === "function" &&
              translate("CT.contract_plan.code")}
          </div>
        </div>
      ),
      dataIndex: ColumnKey.CODE,
      key: ColumnKey.CODE,
      width: 140,
      render: (text) => (
        <LayoutCell>
          <OneLineText value={text} useTooltip />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" &&
              translate("CT.contract_plan.form")}
          </div>
        </div>
      ),
      dataIndex: ColumnKey.PURCHASE_PLAN_TYPE,
      key: ColumnKey.PURCHASE_PLAN_TYPE,
      ellipsis: true,
      width: 160,
      render(status: number) {
        const nameFollowStatus = listMenuShoppingType.find(
          (item) => item.code === status
        )?.name;

        return (
          <LayoutCell>
            <OneLineText value={nameFollowStatus} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" &&
              translate("CT.contract_plan.name_short")}
          </div>
        </div>
      ),
      dataIndex: ColumnKey.NAME,
      key: ColumnKey.NAME,
      ellipsis: true,
      render: (text) => (
        <LayoutCell>
          <OneLineText value={text} useTooltip />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" &&
              translate("CT.contract_plan.create_unit")}
          </div>
        </div>
      ),
      dataIndex: ColumnKey.ORGANIZATION,
      key: ColumnKey.ORGANIZATION,
      ellipsis: true,
      render: (organization: Organization) => {
        let value = "";
        if (organization) {
          value = organization.name;
        }
        return (
          <LayoutCell>
            <OneLineText value={value} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" &&
              translate("CT.contract_plan.create_person")}
          </div>
        </div>
      ),
      ellipsis: true,
      key: ColumnKey.CREATE_PERSON,
      dataIndex: ColumnKey.CREATE_PERSON,
      render(createUser: string, record) {
        const createUserAndName = `${createUser} - ${record?.approveUserName}`;
        return (
          <LayoutCell>
            <OneLineText value={createUserAndName} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          {typeof translate === "function" &&
            translate("CT.contract_plan.approve_person")}
        </div>
      ),
      ellipsis: true,
      key: ColumnKey.APPROVE_PERSON,
      dataIndex: ColumnKey.APPROVE_PERSON,
      render(approveUser: string, record) {
        const approveUserAndName = `${approveUser} - ${record?.approveUserName}`;
        return (
          <LayoutCell>
            <OneLineText value={approveUserAndName} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <div className={classNames("component__title ")}>
            {typeof translate === "function" &&
              translate("CT.contract_plan.approve_date")}
          </div>
        </div>
      ),
      key: ColumnKey.CREATE_DATE,
      dataIndex: ColumnKey.CREATE_DATE,
      ellipsis: true,
      render(createdDate: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={formatDate(createdDate, STANDARD_DATE_FORMAT_SLASH)}
            />
          </LayoutCell>
        );
      },
    },
  ];
};

export default ContractDetailBaseModalColumn;
