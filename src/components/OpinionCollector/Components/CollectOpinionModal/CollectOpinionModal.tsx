import { Col, Row } from "antd";
import { opinionCollectorRepository } from "components/OpinionCollector/OpinionCollectorRepository";
import { utilService } from "core/services/common-services/util-service";
import dayjs, { Dayjs } from "dayjs";
import { isEqual } from "lodash";
import { ResponderFilter, UserModel } from "models/OpinionCollector";
import { useContext } from "react";
import {
  Checkbox,
  DatePicker,
  FormItem,
  Modal,
  MultipleSelect,
  TextArea,
  ValidateStatus,
} from "react-components-design-system";
import {
  ModalType,
  OpinionCollectorContext,
  OpinionCollectorContextType,
} from "../../OpinionCollectorHook";

export const DATE_FORMAT = [
  "DD/MM/YYYY HH:mm",
  "DDMMYYYY HH:mm",
  "DD-MM-YYYY HH:mm",
];
const MODAL_WIDTH = 600;
const TIME_FORMAT = "HH:mm";
const TEXT_AREA_MAX_LENGTH = 1000;

const CollectOpinionModal = () => {
  const {
    translate,
    modalState,
    opinionCollectorModel,
    isSendingForm,
    handleCloseModal,
    handleSendOpinionCollectorTicket,
    handleChangeMultipleSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeBoolField,
  } = useContext<OpinionCollectorContextType>(OpinionCollectorContext);

  const getDisabledDate = (current: Dayjs | null): boolean =>
    !!current && current.isBefore(dayjs().startOf("day"));

  const getDisabledTime = (selectedDate: Dayjs | null) => {
    if (selectedDate && selectedDate.isSame(dayjs(), "day")) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();

      return {
        disabledHours: () =>
          Array.from({ length: currentHour }, (_, hourIndex) => hourIndex),
        disabledMinutes: (selectedHour: number) =>
          selectedHour === currentHour
            ? Array.from(
                { length: currentMinute },
                (_, minuteIndex) => minuteIndex
              )
            : [],
      };
    }
    return {};
  };

  return (
    <Modal
      open={isEqual(modalState, ModalType.COLLECT_OPINION)}
      title={translate("OC.collect_opinion")}
      titleButtonApply={translate("OC.send")}
      titleButtonCancel={translate("OC.cancel")}
      handleSave={handleSendOpinionCollectorTicket}
      handleCancel={handleCloseModal}
      size={MODAL_WIDTH}
      isShowIconBack={false}
      className="collect-opinion-modal"
      disableButtonApply={isSendingForm}
    >
      <Row gutter={[16, 16]}>
        <Col span={15}>
          <FormItem
            validateObject={utilService.getValidateObj(
              opinionCollectorModel,
              "responseBys"
            )}
          >
            <MultipleSelect
              label={translate("OC.responder")}
              placeHolder={translate("OC.select_opinion_requester")}
              isRequired
              values={opinionCollectorModel?.responseBys || []}
              getList={(filter) =>
                opinionCollectorRepository.getListUser({
                  ...filter,
                  isActive: true,
                  isSupplier: false,
                  pageSize: 30,
                })
              }
              classFilter={ResponderFilter}
              searchProperty={"name"}
              render={(item: UserModel) => `${item?.name} - ${item?.email}`}
              onChange={handleChangeMultipleSelectField({
                fieldName: "responseBys",
              })}
              appendToBody
            />
          </FormItem>
        </Col>
        <Col span={9}>
          <FormItem
            validateObject={utilService.getValidateObj(
              opinionCollectorModel,
              "responseDueDate"
            )}
          >
            <DatePicker
              label={translate("OC.response_deadline_time_label")}
              placeholder={translate("OC.response_deadline_time_placeholder")}
              value={opinionCollectorModel?.responseDueDate as Dayjs}
              showTime={{ format: TIME_FORMAT }}
              dateFormat={DATE_FORMAT}
              onChange={handleChangeDateField({ fieldName: "responseDueDate" })}
              disabledDate={getDisabledDate}
              disabledTime={getDisabledTime}
              isRequired
            />
          </FormItem>
        </Col>

        <Col span={24}>
          <FormItem
            validateObject={utilService.getValidateObj(
              opinionCollectorModel,
              "title"
            )}
          >
            <TextArea
              label={translate("OC.opinion_content")}
              placeHolder={translate("OC.enter_opinion_content")}
              value={opinionCollectorModel?.title}
              onChange={handleChangeSingleField({ fieldName: "title" })}
              isRequired
              showCount
              maxLength={TEXT_AREA_MAX_LENGTH}
              translate={translate}
              resize="none"
            />
          </FormItem>
          <FormItem
            message={translate("OC.opinion_content_warning")}
            validateStatus={ValidateStatus.warning}
          >
            <></>
          </FormItem>
        </Col>

        <Col>
          <Checkbox
            label={translate("OC.mandatory")}
            checked={opinionCollectorModel?.isRequired}
            onChange={handleChangeBoolField({
              fieldName: "isRequired",
            })}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default CollectOpinionModal;
