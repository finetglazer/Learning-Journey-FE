import CollapseView from "components/Collapse/CollapseView";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { NUMBER_MAX_13 } from "config/const";
import { MAX_LENGTH_1000, numberConstants } from "core/config/consts";
import { formatCurrency } from "core/helpers/currency";
import { utilService } from "core/services/common-services/util-service";
import { gt, isEqual } from "lodash";
import { Goods } from "models/ProjectSettlement";
import { useContext } from "react";
import {
  Drawer,
  FormItem,
  InputNumber,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./DrawerInformation.module.scss";
import {
  DrawerInformationContext,
  DrawerInformationHookTye,
  useDrawerInformationHooks,
} from "./DrawerInformationHooks";

const InformationForm = () => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } =
    useContext<DrawerInformationHookTye>(DrawerInformationContext);

  const makeTitleText = (value: string) => {
    const REQUIRE_TEXT = "*";

    return (
      <div className={styles["title-unit"]}>
        <UnitTitle title={value} />
        {/* Require text */}
        <span className={styles["required-text"]}>{REQUIRE_TEXT}</span>
      </div>
    );
  };

  const makeTitle = () => {
    return (
      <tr className={styles["title"]}>
        <th className={styles["w-128"]} />
        <th className={styles["title"]}>
          {makeTitleText(translate("PS.table_asset_value_before_tax"))}
        </th>
        <th className={styles["title"]}>
          {makeTitleText(translate("PS.table_aseet_tax_currency"))}
        </th>
        <th className={styles["title"]}>
          {makeTitleText(translate("PS.table_asset_sum"))}
        </th>
      </tr>
    );
  };

  const makeSpecialText = (value: number) => {
    let className = "";
    const isGreaterThanZero = gt(value, numberConstants.ZERO);

    if (isEqual(value, numberConstants.ZERO)) {
      className = styles.neutral;
    } else {
      className = isGreaterThanZero ? styles.positive : styles.negative;
    }

    const displayValue = isGreaterThanZero
      ? `+${formatCurrency(value || numberConstants?.ZERO)}`
      : formatCurrency(value || numberConstants?.ZERO);

    return (
      <div className={`${styles.number} ${className}`}>{displayValue}</div>
    );
  };

  const makeDifferenceRow = () => {
    const valueBeforeTax =
      model?.settlementBeforeTax - model?.investmentBeforeTax;
    const tax = model?.settlementTax - model?.investmentTax;
    const sum = model?.settlementSum - model?.investmentSum;

    return (
      <tr>
        <th className={styles["normal-text"]}>
          {translate("PS.table_asset_difference_value")}
        </th>
        <th>{makeSpecialText(valueBeforeTax || numberConstants.ZERO)}</th>
        <th>{makeSpecialText(tax || numberConstants.ZERO)}</th>
        <th>{makeSpecialText(sum || numberConstants.ZERO)}</th>
      </tr>
    );
  };

  const makeSettlementRow = () => {
    return (
      <tr className={styles["special-row"]}>
        <th className={styles["normal-text"]}>
          {translate("PS.txt_settlement")}
        </th>
        <th>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "settlementBeforeTax"
            )}
          >
            <InputNumber
              allowClear={false}
              className={styles["input-number-wrapper"]}
              min={numberConstants.ZERO}
              max={NUMBER_MAX_13}
              type={"LONG"}
              allowNegative
              value={model?.settlementBeforeTax || numberConstants.ZERO}
              onChange={(value) => {
                // update tax when change settlementBeforeTax
                const tax =
                  (model?.settlementSum || numberConstants.ZERO) - value;

                handleChangeSingleField({
                  fieldName: "settlementTax",
                })(tax);

                return handleChangeSingleField({
                  fieldName: "settlementBeforeTax",
                })(value);
              }}
            />
          </FormItem>
        </th>
        <th>{formatCurrency(model?.settlementTax || numberConstants.ZERO)}</th>
        <th>{formatCurrency(model?.settlementSum || numberConstants.ZERO)}</th>
      </tr>
    );
  };

  const makeInvestmentRow = () => {
    return (
      <tr>
        <th className={styles["normal-text"]}>
          {translate("PS.txt_investment")}
        </th>
        <th>
          {formatCurrency(model?.investmentBeforeTax || numberConstants.ZERO)}
        </th>
        <th>
          {formatCurrency(
            model?.investmentSum - model?.investmentBeforeTax ||
              numberConstants.ZERO
          )}
        </th>
        <th>{formatCurrency(model?.investmentSum || numberConstants.ZERO)}</th>
      </tr>
    );
  };

  const makeBody = () => {
    return (
      <>
        {/* Settlement */}
        {makeSettlementRow()}
        {/* Investment */}
        {makeInvestmentRow()}
        {/* Difference */}
        {makeDifferenceRow()}
      </>
    );
  };

  return (
    <table className={styles["info-table"]}>
      <tbody>
        {/* title */}
        {makeTitle()}
        {/* body */}
        {makeBody()}
      </tbody>
    </table>
  );
};

interface DrawerInformationProps {
  visible: boolean;
  item?: Goods;
  onDismiss?: () => void;
  onSave?: (item: Goods) => void;
}

export const DrawerInformation = ({
  visible = false,
  item,
  onDismiss,
  onSave,
}: DrawerInformationProps) => {
  const { translate, handleSave, ...contextValue } = useDrawerInformationHooks(
    item,
    onSave
  );

  const getValue = (value?: string) => {
    const DEFAULT_VALUE = "---";
    return value || DEFAULT_VALUE;
  };

  const makeTwoLine = (values: string[]) => {
    return (
      <div className={styles["two-line-wrapper"]}>
        {values.map((value, index) => {
          return (
            <div key={index} className={`${styles[`text-${index}`]}`}>
              {value}
            </div>
          );
        })}
      </div>
    );
  };

  const makeInformation = () => {
    return (
      <table className={styles["table"]}>
        {/* Body */}
        <tbody>
          <tr className={styles["title-wrapper"]}>
            <th className={styles["w-356"]}>
              {makeTwoLine([
                translate("PS.txt_asset_good_service"),
                getValue(item?.goodsCode),
              ])}
            </th>

            <th>
              {makeTwoLine([
                translate("PS.txt_asset_name_good_service"),
                getValue(item?.goodsName),
              ])}
            </th>
          </tr>
          {/* Unit */}
          <tr>
            <th className={styles["w-356"]}>
              {makeTwoLine([
                translate("PS.table_asset_unit"),
                getValue(item?.goodsServiceUnit?.name),
              ])}
            </th>
            <th>
              {makeTwoLine([
                translate("PS.table_asset_description_good_service"),
                getValue(item?.goodsDescription),
              ])}
            </th>
          </tr>

          <tr>
            <th className={styles["w-356"]}>
              {makeTwoLine([
                translate("PS.table_asset_manufacturer"),
                getValue(item?.goodsManufacturer),
              ])}
            </th>
            <th>
              {makeTwoLine([
                translate("PS.table_asset_note"),
                getValue(item?.goodsNote),
              ])}
            </th>
          </tr>
        </tbody>
      </table>
    );
  };

  const makeForm = () => {
    const key = "information_settlement_goods_services";
    return (
      <CollapseView
        defaultActiveKey={key}
        items={[
          {
            key,
            label: translate("PS.txt_information_settlement_goods_services"),
            children: <InformationForm />,
          },
        ]}
      />
    );
  };

  const makeTitle = () => {
    return (
      <div className={styles["title"]}>
        {translate("PS.txt_information_settlement_goods_services")}
      </div>
    );
  };

  return (
    <DrawerInformationContext.Provider value={contextValue}>
      <Drawer
        visible={visible}
        visibleFooter
        loading={false}
        size="2xl"
        className={styles["information-drawer"]}
        title={makeTitle()}
        titleButtonCancel={translate("CM.btn_close")}
        titleButtonApply={translate("CM.txt_save")}
        handleSave={handleSave}
        handleCancel={onDismiss}
        handleClose={onDismiss}
      >
        <div className={styles[""]}>
          {makeInformation()}
          {makeForm()}
          <FormItem
            validateObject={utilService.getValidateObj(
              contextValue?.model,
              "note"
            )}
          >
            <TextArea
              showCount
              resize="none"
              maxLength={MAX_LENGTH_1000}
              label={translate("PS.txt_note_settlement_goods_services")}
              placeHolder={translate(
                "PS.placeholder_note_settlement_goods_services"
              )}
              value={contextValue?.model?.note || ""}
              onChange={contextValue?.handleChangeSingleField({
                fieldName: "note",
              })}
            />
          </FormItem>
        </div>
      </Drawer>
    </DrawerInformationContext.Provider>
  );
};
