/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import {
  DatePicker,
  FormItem,
  InputText,
  Modal,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Col, Row, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import "./RankDetail.scss";

import {
  RankMasterContext,
  RankMasterContextModel,
} from "../RankMaster/RankMasterHook";
import { useRankDetailHook } from "./RankDetailHook";
import dayjs from "dayjs";

const RankDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<RankMasterContextModel>(RankMasterContext);

  const {
    loading,
    handleChangeSingleField,
    handleChangeDateField,
    handleSave,
  } = useRankDetailHook(model, dispatchModel, handleCloseModal, handleLoadList);

  return (
    <>
      <Modal
        open={isOpenModal}
        title={
          model?.id
            ? `${translate("ranks.update")}`
            : `${translate("ranks.create")}`
        }
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("detail")}
        onCancel={() => handleCloseModal("detail")}
        handleSave={handleSave}
        loading={loading}
        isShowIconBack={false}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
          <Col lg={24} className="m-b--sm d-flex">
            <div className={"label-title m-r--xs"}>
              {translate("ranks.status")}
            </div>
            <Switch
              checked={model.isActive}
              onChange={(checked) => {
                handleChangeSingleField({
                  fieldName: "isActive",
                })(checked);
              }}
              className={"switch_status"}
            />
            <span className="m-l--xs">{translate("ranks.active")}</span>
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("ranks.code")}
                placeHolder={translate("ranks.placeholder.code")}
                value={model.code}
                onChange={handleChangeSingleField({
                  fieldName: "code",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "name")}
            >
              <InputText
                isRequired
                maxLength={500}
                label={translate("ranks.name")}
                placeHolder={translate("ranks.placeholder.name")}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "effectiveDate"
              )}
            >
              <DatePicker
                label={translate("ranks.effectiveDate")}
                value={
                  model.effectiveDate
                    ? dayjs(model.effectiveDate).utc(true)
                    : null
                }
                placeholder={"dd/mm/yyyy"}
                isSmall={false}
                size={"small"}
                onChange={handleChangeDateField({
                  fieldName: "effectiveDate",
                })}
              />
            </FormItem>
          </Col>
        </Row>
      </Modal>
      {loading && <LoadingCM />}
    </>
  );
};

export default RankDetail;
