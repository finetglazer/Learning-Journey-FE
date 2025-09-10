import { Col, Row } from "antd";
import dayjs from "dayjs";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { useContext, useState } from "react";
import {
  DatePicker,
  FormItem,
  InputText,
  Modal,
} from "react-components-design-system";
import { useParams } from "react-router-dom";
import { PurchasingPlanDetailHookContext } from "../../../../PurchasingPlanDetail/PurchasingPlanDetailHook";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { finalize } from "rxjs";
import "./ModalExtensionOfTime.scss";

const WIDTH_MODAL = 600;

interface ModalExtensionOfTimeProps {
  visible: boolean;
  handleClose: () => void;
}

const ModalExtensionOfTime = ({
  visible,
  handleClose,
}: ModalExtensionOfTimeProps) => {
  const {
    model,
    translate,
    handleChangeDateField,
    handleChangeSingleField,
    handleChangeAllField,
  } = useContext<PurchasingPlanModel>(PurchasingPlanDetailHookContext);
  const { id: idDetail } = useParams<{ id: string }>();
  const [isLoadingButtonExtensionOfTime, setIsLoadingButtonExtensionOfTime] =
    useState<boolean>(false);

  const handleUpdateExtensionOfTime = () => {
    setIsLoadingButtonExtensionOfTime(true);
    const body = {
      id: idDetail,
      extendTime: model.extendTime ? dayjs(model.extendTime).format() : null,
    };
    purchasingPlanRepository
      .updateExtensionOfTime(body)
      .pipe(finalize(() => setIsLoadingButtonExtensionOfTime(false)))
      .subscribe({
        next: () => {
          handleClose();
          const isLoadData = model.isLoadDataDetail
            ? !model.isLoadDataDetail
            : true;
          handleChangeSingleField({
            fieldName: "isLoadDataDetail",
          })(isLoadData);
        },
        error: (error) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
            });
          }
        },
      });
  };

  return (
    <Modal
      open={visible}
      title={translate("PL.purchasing_plan_extension_of_bid_period")}
      size={WIDTH_MODAL}
      closeIcon={true}
      className="payment-minHeight-500"
      handleSave={handleUpdateExtensionOfTime}
      isShowIconBack={false}
      handleCancel={handleClose}
      titleButtonCancel={translate("PL.cancel_btn_label")}
      titleButtonApply={translate("PL.confirm")}
      disableButtonApply={isLoadingButtonExtensionOfTime}
      rootClassName="supplier-modal-extension-of-time"
    >
      <div>
        <Row gutter={12}>
          <Col lg={12}>
            <InputText
              label={translate("PL.purchasing_plan_start_date_bid_now")}
              readOnly
              isSmall={false}
              value={dayjs(model.startDate).format(STANDARD_DATE_FORMAT_SLASH)}
            />
          </Col>
          <Col lg={12}>
            <InputText
              label={translate("PL.purchasing_plan_end_date_bid_now")}
              readOnly
              isSmall={false}
              value={dayjs(model.endDate).format(STANDARD_DATE_FORMAT_SLASH)}
            />
          </Col>
        </Row>
      </div>
      <div className="p-t--sm">
        <FormItem
          validateObject={utilService.getValidateObj(model, "extendTime")}
        >
          <DatePicker
            label={translate("PL.purchasing_plan_end_date_bid")}
            placeholder={"dd/mm/yyyy"}
            isSmall={false}
            isRequired
            size={"middle"}
            onChange={handleChangeDateField({
              fieldName: "extendTime",
            })}
            value={model.extendTime}
            minDate={dayjs().startOf("day")}
          />
        </FormItem>
      </div>
    </Modal>
  );
};

export default ModalExtensionOfTime;
