/* eslint-disable import/no-unresolved */
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
// Constants & Services
import {
  DEFAULT_DATETIME_VALUE,
  TIME_FORMAT,
  WIDTH_1000,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
// UI Components
import { DatePicker, FormItem, Modal } from "react-components-design-system";
// Styles
import styles from "./ModalAddSupplierQuote.module.scss";
import SupplierInformationTable from "./SupplierInformationTable/SupplierInformationTable";
import { Col, Row } from "antd";
import { DATE_FORMAT } from "components/OpinionCollector/Components/CollectOpinionModal/CollectOpinionModal";
import {
  formatDate,
  getDisabledTime,
  getDisabledTimeOpenBid,
  getISOStringDate,
} from "core/helpers/date-time";
import {
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
  SupplierQuotationAction,
} from "models/PurchasingPlan/PurchasingPlan";
import { isEqual } from "lodash";

type Props = {
  open: boolean;
  handleCancel: () => void;
  onPressConfirm?: (model: PurchasingPlanTypeModel) => void;
  titleModel?: string;
  titleList?: string;
  idContainer?: string;
  isNotConfirmDelete?: boolean;
  actionQuote?: SupplierQuotationAction;
  contextValue: PurchasingPlanModel;
  loading?: boolean;
};

const ModalAddSupplierQuote = ({
  open,
  handleCancel,
  onPressConfirm,
  titleModel,
  titleList,
  idContainer,
  isNotConfirmDelete,
  actionQuote,
  contextValue,
  loading,
}: Props) => {
  const [translate] = useTranslation();

  //actionQuote
  const isNegotiationRound = isEqual(
    actionQuote,
    SupplierQuotationAction.AddNegotiationRound
  );
  //data change

  const handleSaveModal = () => onPressConfirm?.(contextValue.model);

  // đây là biến dùng để change data, lưu và submit
  const masterSupplierAddQuote = contextValue?.model?.masterSupplierAddQuote;

  const handleChangeOfferRequestDate = (
    value: dayjs.Dayjs | null,
    field: string
  ) => {
    const dateValue = getISOStringDate(value);
    const fieldMap: Record<string, string> = {
      bidStartDate: "roundStartDate",
      bidEndDate: "roundEndDate",
      openBidDate: "roundOpenDate",
    };
    const nameError = fieldMap[field] || "";

    contextValue.handleChangeAllField({
      ...contextValue?.model,
      errors: {
        ...contextValue?.model?.errors,
        [nameError]: null,
      },
      masterSupplierAddQuote: {
        ...masterSupplierAddQuote,
        [field]: dateValue,
      },
    });
  };

  const now = dayjs();
  const minDate = dayjs.max(now, dayjs(masterSupplierAddQuote?.bidEndDate));

  return (
    <Modal
      open={open}
      title={translate(titleModel)}
      size={WIDTH_1000}
      closeIcon={true}
      isShowIconBack={false}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("PL.confirm")}
      handleCancel={handleCancel}
      handleSave={handleSaveModal}
      key={"modal-add-supplier-quote"}
      className={styles["modal-list-suppliers"]}
      loading={loading}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <FormItem
            validateObject={utilService.getValidateObj(
              contextValue?.model,
              "roundStartDate"
            )}
          >
            <DatePicker
              isRequired
              label={translate("PPA.start_time_of_price_offer")}
              placeholder={translate("PL.txt_enter_time")}
              dateFormat={DATE_FORMAT}
              isSmall={false}
              showTime={{ format: TIME_FORMAT }}
              minDate={dayjs(formatDate(new Date()), DEFAULT_DATETIME_VALUE)}
              disabledTime={getDisabledTime}
              value={
                masterSupplierAddQuote?.bidStartDate
                  ? dayjs(masterSupplierAddQuote?.bidStartDate)
                  : undefined
              }
              onChange={(value) => {
                handleChangeOfferRequestDate(value, "bidStartDate");
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            validateObject={utilService.getValidateObj(
              contextValue?.model,
              "roundEndDate"
            )}
          >
            <DatePicker
              isRequired
              label={translate("PPA.end_time_of_price_offer")}
              placeholder={translate("PL.txt_enter_time")}
              dateFormat={DATE_FORMAT}
              isSmall={false}
              showTime={{ format: TIME_FORMAT }}
              minDate={dayjs(formatDate(new Date()), DEFAULT_DATETIME_VALUE)}
              disabledTime={getDisabledTime}
              value={
                masterSupplierAddQuote?.bidEndDate
                  ? dayjs(masterSupplierAddQuote?.bidEndDate)
                  : undefined
              }
              onChange={(value) => {
                handleChangeOfferRequestDate(value, "bidEndDate");
              }}
            />
          </FormItem>
        </Col>
        {isEqual(actionQuote, SupplierQuotationAction.AddSupplierQuotation) && (
          <Col span={12}>
            <FormItem
              validateObject={utilService.getValidateObj(
                contextValue?.model,
                "roundOpenDate"
              )}
            >
              <DatePicker
                isRequired
                label={translate("PPA.opening_time_of_price_offer")}
                placeholder={translate("PL.txt_enter_time")}
                dateFormat={DATE_FORMAT}
                isSmall={false}
                showTime={{ format: TIME_FORMAT }}
                minDate={minDate}
                disabledTime={(date) =>
                  getDisabledTimeOpenBid(
                    date,
                    dayjs(masterSupplierAddQuote?.bidEndDate)
                  )
                }
                readOnly={
                  !(
                    !!masterSupplierAddQuote?.bidEndDate &&
                    dayjs(masterSupplierAddQuote?.bidEndDate).isValid()
                  )
                }
                value={
                  masterSupplierAddQuote?.openBidDate
                    ? dayjs(masterSupplierAddQuote?.openBidDate)
                    : undefined
                }
                onChange={(value) => {
                  handleChangeOfferRequestDate(value, "openBidDate");
                }}
              />
            </FormItem>
          </Col>
        )}
      </Row>
      <div>
        <div className={styles["title-list"]}>{translate(titleList)}</div>
      </div>

      <SupplierInformationTable
        isDetail={false}
        contextValue={contextValue}
        isView={false}
        idContainer={idContainer}
        isNotConfirmDelete={isNotConfirmDelete}
        isNegotiationRound={isNegotiationRound}
      />
    </Modal>
  );
};

export default ModalAddSupplierQuote;
