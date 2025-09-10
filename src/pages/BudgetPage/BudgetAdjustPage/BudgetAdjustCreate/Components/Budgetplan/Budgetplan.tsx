import {
  ChevronDown,
  ChevronRight,
  Download,
  TrashCan,
} from "@carbon/icons-react";
import { Tooltip } from "antd";
import { DeleteRoundIcon, Extend, Shorten } from "assets/icons";
import classNames from "classnames";
import { STANDARD_TIME_FORMAT_MM_YYYY } from "core/config/consts";
import { formatTime } from "core/helpers/date-time";
import { addNumbers, formatNumber } from "core/helpers/number";
import { Dayjs } from "dayjs";
import { isEmpty, isNull } from "lodash";
import { BusinessBranch, CostLine, Project } from "models/CostOwner/BudgetPlan";
import { useContext, useEffect, useMemo, useState } from "react";
import { Button, ModalConfirm } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { BudgetAdjust, BudgetAdjustContext } from "../../BudgetAdjustHook";
import "./Budgetplan.scss";

const BudgetPlan = ({ data }: { data: BusinessBranch[] }) => {
  const {
    handleDownloadFileBudget,
    handleDownloadFileTemplate,
    model,
    handleToggleModalRemoveFileBudgetPlan,
    handleRemoveFileBudgetPlan,
  } = useContext<BudgetAdjust>(BudgetAdjustContext);
  const [translate] = useTranslation();
  const [extend, setShowExtend] = useState(0);
  const [shorten, setShowShorten] = useState(0);

  const onToggleExtend = () => {
    setShowExtend((prev) => prev + 1);
  };

  const onToggleShorten = () => {
    setShowShorten((prev) => prev + 1);
  };

  const calculateTotalAmountC1 = (): number => {
    return data.reduce((total, item) => addNumbers(total, item?.total), 0);
  };

  const calculateTotalReallocateAmount = (): number => {
    return data.reduce(
      (total, item) => addNumbers(total, item?.reallocateAmount),
      0
    );
  };

  const renderItemTable = (item: BusinessBranch) => {
    return (
      <RenderItemTable
        key={item.id}
        item={item}
        extend={extend}
        shorten={shorten}
      />
    );
  };

  const handleOnDownloadFileBudget = () => {
    handleDownloadFileBudget();
  };

  return (
    <div className="wrapper_adjust">
      <div className="budget-plan__header">
        <div className="budget-plan__header__item">
          <Button
            icon={<Download />}
            iconPlace="left"
            type="secondary"
            onClick={handleOnDownloadFileBudget}
          >
            {translate("BG.download_budget_adjustment_file")}
          </Button>
          {!model?.isDetail && (
            <Button
              type="tertiary"
              icon={<Download />}
              iconPlace="left"
              onClick={handleDownloadFileTemplate}
            >
              {translate("BG.download_template_file")}
            </Button>
          )}
          {!model?.isDetail && (
            <Button
              type="tertiary"
              icon={<TrashCan />}
              iconPlace="left"
              onClick={handleToggleModalRemoveFileBudgetPlan}
            >
              {translate("BG.delete_all")}
            </Button>
          )}
        </div>
        <div className="budget-plan__header__item">
          <Button
            type="tertiary"
            icon={<Extend />}
            iconPlace="left"
            onClick={onToggleExtend}
          >
            {translate("BG.expand_all")}
          </Button>
          <Button
            type="tertiary"
            icon={<Shorten />}
            iconPlace="left"
            onClick={onToggleShorten}
          >
            {translate("BG.collapse_all")}
          </Button>
        </div>
      </div>
      <div className="budget-plan__table">
        <div className="table__header">
          <div className="table__header__item_first">
            <span>{translate("BG.cost_owner")}</span>
          </div>
          <div className="table__header__item_first">
            <span>{translate("BG.cost_line")}</span>
          </div>
          <div className="table__header__item_last">
            <div className="d-flex flex-column">
              {translate("BG.current_total_budget")}
            </div>
          </div>
          <div className="table__header__item_last">
            <div className="d-flex flex-column">
              {translate("BG.requested_adjustment_amount")}
            </div>
          </div>
          <div className="table__header__item_last">
            <div className="d-flex flex-column">
              {translate("BG.adjusted_budget")}
            </div>
          </div>
        </div>
        <div className="table__content">
          <div className="table__content__total">
            <div className="table__header__item_first">
              {translate("BG.total")}
            </div>
            <div className="table__header__item_first"></div>
            <div className="table__header__item_last">
              {formatNumber(calculateTotalAmountC1())}
            </div>
            <div
              className={classNames("table__header__item_last", {
                text__red: calculateTotalReallocateAmount() < 0,
                text__blue: calculateTotalReallocateAmount() >= 0,
              })}
            >
              {calculateTotalReallocateAmount() > 0 ? "+" : ""}
              {formatNumber(calculateTotalReallocateAmount())}
            </div>
            <div className="table__header__item_last">
              {formatNumber(
                addNumbers(
                  calculateTotalAmountC1(),
                  calculateTotalReallocateAmount()
                ) || 0
              )}
              {}
            </div>
          </div>
          {data?.map(renderItemTable)}
        </div>
      </div>
      <ModalConfirm
        open={model.isConfirmDeleteBudgetPlan}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("BG.confirm_delete_budget_adjustment")}
        content={translate("BG.delete_warning_budget_adjustment")}
        titleButtonCancel={translate("BG.cancel")}
        titleButtonApply={translate("BG.delete")}
        handleSave={() => {
          handleRemoveFileBudgetPlan();
        }}
        handleCancel={() => {
          handleToggleModalRemoveFileBudgetPlan();
        }}
      />
    </div>
  );
};

export default BudgetPlan;

const RenderItemTable = ({
  item,
  shorten,
  extend,
}: {
  item: BusinessBranch;
  shorten: number;
  extend: number;
}) => {
  const [isShowSubItem, setIsShowSubItem] = useState(false);

  const onToggleSubItem = () => {
    setIsShowSubItem(!isShowSubItem);
  };

  useEffect(() => {
    if (shorten) {
      setIsShowSubItem(false);
    }
  }, [shorten]);

  useEffect(() => {
    if (extend) {
      setIsShowSubItem(true);
    }
  }, [extend]);

  return (
    <>
      <div className="table__content__item">
        <div className="table__content__item__first" onClick={onToggleSubItem}>
          {!isShowSubItem ? (
            <ChevronRight width={30} />
          ) : (
            <ChevronDown width={30} />
          )}
          <div className="flex-1">
            <Tooltip
              placement="top"
              title={`${item?.businessBranch?.code} – ${item?.businessBranch?.name}`}
            >
              {`${item?.businessBranch?.code} – ${item?.businessBranch?.name}`}
            </Tooltip>
            <br />
            <Tooltip
              placement="top"
              title={`${item?.businessDepartment?.code} – ${item?.businessDepartment?.name}`}
            >
              {`${item?.businessDepartment?.code} – ${item?.businessDepartment?.name}`}{" "}
            </Tooltip>
            <br />
            {item?.position && item?.position?.name}
          </div>
        </div>
        <div className="table__content__item__first"></div>
        <div className="table__content__item__last">
          {formatNumber(item.total || 0)}
        </div>
        <div
          className={classNames("table__content__item__last", {
            text__red: item.reallocateAmount < 0,
            text__blue: item.reallocateAmount >= 0,
          })}
        >
          {item.reallocateAmount > 0 ? "+" : ""}
          {formatNumber(item.reallocateAmount || 0)}
        </div>
        <div className="table__content__item__last">
          {formatNumber(
            addNumbers(item.total || 0, item.reallocateAmount) || 0
          )}
        </div>
      </div>
      {isShowSubItem &&
        item?.projects.map((subItem: Project, index: number) => {
          return (
            <RenderItemSubTable
              key={index}
              item={subItem}
              extend={extend}
              shorten={shorten}
            />
          );
        })}
    </>
  );
};

const RenderItemSubTable = ({
  item,
  shorten,
  extend,
}: {
  item: Project;
  shorten: number;
  extend: number;
}) => {
  const [isShowSubItem, setIsShowSubItem] = useState(false);

  const costLines = useMemo(() => {
    return item?.costLines.filter(Boolean);
  }, [item]);

  useEffect(() => {
    if (shorten) {
      setIsShowSubItem(false);
    }
  }, [shorten]);

  useEffect(() => {
    if (extend) {
      setIsShowSubItem(true);
    }
  }, [extend]);

  const onToggleSubItem = () => {
    setIsShowSubItem(!isShowSubItem);
  };

  const formatTimeMMYYYY = (time: Dayjs) => {
    return formatTime(time, STANDARD_TIME_FORMAT_MM_YYYY);
  };

  const _renderChevronIcon = () => {
    if (isEmpty(costLines)) return <div style={{ width: 30 }} />;

    return !isShowSubItem ? (
      <ChevronRight width={30} />
    ) : (
      <ChevronDown width={30} />
    );
  };

  return (
    <>
      <div className="table__content__item_sub" onClick={onToggleSubItem}>
        <div className="table__content__item__first">
          <div className="w_24" />
          {_renderChevronIcon()}
          <div className="flex-1">
            <Tooltip
              placement="top"
              title={`${item?.project?.code} – ${item?.project?.name}`}
            >
              {`${item?.project?.code} – ${item?.project?.name}`}
            </Tooltip>
            <br />
            {item?.project?.startTime &&
              `${formatTimeMMYYYY(
                item?.project?.startTime
              )} – ${formatTimeMMYYYY(item?.project?.endTime)}`}
          </div>
        </div>
        <div className="table__content__item__first"></div>
        <div className="table__content__item__last">
          {formatNumber(item.total || 0)}
        </div>
        <div
          className={classNames("table__content__item__last", {
            text__red: item.reallocateAmount < 0,
            text__blue: item.reallocateAmount >= 0,
          })}
        >
          {item.reallocateAmount > 0 ? "+" : ""}
          {formatNumber(item.reallocateAmount || 0)}
        </div>
        <div className="table__content__item__last">
          {formatNumber(
            addNumbers(item.total || 0, item.reallocateAmount || 0) || 0
          )}
        </div>
      </div>
      {isShowSubItem &&
        costLines?.map((subItem: CostLine, index: number) => {
          if (isNull(subItem)) return null;

          return (
            <div className="table__content__item_sub" key={index}>
              <div className="table__content__item__first"></div>
              <div className="table__content__item__first">
                <Tooltip
                  placement="top"
                  title={`${subItem?.code} – ${subItem?.name}, ${subItem?.budgetPeriod}, ${subItem?.budgetCalculationMethod}`}
                >
                  {`${subItem?.code} – ${subItem?.name}`}
                </Tooltip>
              </div>
              <div
                className={classNames("table__content__item__last", "font_400")}
              >
                {formatNumber(subItem.total || 0)}
              </div>
              <div
                className={classNames(
                  "table__content__item__last",
                  "font_400",
                  {
                    text__red: subItem?.reallocateAmount < 0,
                    text__blue: subItem?.reallocateAmount >= 0,
                  }
                )}
              >
                {subItem.reallocateAmount > 0 ? "+" : ""}
                {formatNumber(subItem.reallocateAmount || 0)}
              </div>
              <div
                className={classNames("table__content__item__last", "font_400")}
              >
                {formatNumber(
                  addNumbers(
                    subItem.total || 0,
                    subItem.reallocateAmount || 0
                  ) || 0
                )}
              </div>
            </div>
          );
        })}
    </>
  );
};
