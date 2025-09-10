/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import {
  Button,
  FormItem,
  InputText,
  InputView,
  Radio,
  Tag,
  UploadImage,
  UPLOADTYPE_IMAGE,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { Camera } from "@carbon/icons-react";
import { Col, Row, Space, Switch } from "antd";
import LayoutDetail from "components/LayoutDetail/LayoutDetail";
import { APP_OVERVIEW } from "config/route-const";
import { formatDate } from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import { isEqual } from "lodash";
import React from "react";
import { appUserRepository } from "../AppUserRepository";
import "./AppUserDetail.scss";
import { useAppUserDetailHook } from "./AppUserDetailHook";
import { shareRepository } from "core/repositories/ShareRepository";
import { DeleteIcon } from "assets/icons";

const AppUserDetail = () => {
  const [translate] = useTranslation();
  const {
    model,
    loading,
    handleChangeSingleField,
    handleChangeAllField,
    handleSave,
  } = useAppUserDetailHook();

  const breadcrumbs = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_appuser"),
    },
  ];

  const renderStatusDetail = () => {
    return (
      <Tag
        value={
          isEqual(model?.isActive, true)
            ? translate("appUsers.active")
            : translate("appUsers.inactive")
        }
        className="m-l--2xs"
        size="sm"
        status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
        isShowBorder
        isShowDot={false}
      />
    );
  };

  const [avatar, setAvatar] = React.useState<string>(null);
  const [signature, setSignature] = React.useState<string>(null);

  React.useEffect(() => {
    if (model?.avatarPath) {
      shareRepository
        .downloadFile(null, model?.avatarPath)
        .subscribe((response) => {
          const blob = new Blob([response.data], { type: "image/png" });
          const url = URL.createObjectURL(blob);
          setAvatar(url);
        });
    }
  }, [model?.avatarPath]);

  React.useEffect(() => {
    if (model?.signaturePath) {
      shareRepository
        .downloadFile(null, model?.signaturePath)
        .subscribe((response) => {
          const blob = new Blob([response.data], { type: "image/png" });
          const url = URL.createObjectURL(blob);
          setSignature(url);
        });
    }
  }, [model?.signaturePath]);

  const handleDeleteSignature = () => {
    setSignature(null);
    handleChangeAllField({
      ...model,
      signaturePath: null,
      signatureFileId: null,
    });
  };
  const handleDeleteAvatar = () => {
    setAvatar(null);
    handleChangeAllField({
      ...model,
      avatarPath: null,
      avatarFileId: null,
    });
  };

  return (
    <>
      <div className={classNames("page-content app-user-detail__page")}>
        <PageHeader
          title={translate("appUsers.currentInformation")}
          breadcrumbs={breadcrumbs}
          className="page-header"
          isShowBackButton
          rightComponentTitle={renderStatusDetail()}
        >
          <div className="d-flex">
            <Button
              type="secondary"
              size="lg"
              onClick={() => window.history.back()}
              className="m-r--2xs"
            >
              {translate("generalActions.close")}
            </Button>
            <Button type="primary" size="lg" onClick={() => handleSave()}>
              {translate("generalActions.save")}
            </Button>
          </div>
        </PageHeader>
        <LayoutDetail className="">
          <div className="general-infor">
            <div className="avatar-block">
              <div className="d-flex align-items-center gap-16">
                <div className="title-detail title-detail-image-label">
                  Avatar
                </div>
                <div className="d-flex position-relative">
                  <UploadImage
                    currentAvatar={avatar}
                    className="avatar"
                    type={UPLOADTYPE_IMAGE.AVATAR}
                    uploadAvatar={(file) =>
                      appUserRepository.uploadAvatar(file as File)
                    }
                    updateAvatar={(data) => {
                      handleChangeAllField({
                        ...model,
                        avatarPath: data.path,
                        avatarFileId: data.systemFileId,
                      });
                    }}
                    icon={<Camera size={32} />}
                  />
                  {avatar && (
                    <div onClick={handleDeleteAvatar}>
                      <img src={DeleteIcon} alt="img" className="icon-delete" />
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex align-items-center gap-16">
                <div className="title-detail title-detail-image-label">
                  {translate("appUsers.signature")}
                </div>
                <div className="d-flex position-relative">
                  <UploadImage
                    currentAvatar={signature}
                    className="avatar"
                    type={UPLOADTYPE_IMAGE.AVATAR}
                    uploadAvatar={(file) =>
                      appUserRepository.uploadAvatar(file as File)
                    }
                    updateAvatar={(data) => {
                      handleChangeAllField({
                        ...model,
                        signaturePath: data.path,
                        signatureFileId: data.systemFileId,
                      });
                    }}
                    icon={<Camera size={32} />}
                  />
                  {signature && (
                    <div onClick={handleDeleteSignature}>
                      <img src={DeleteIcon} alt="img" className="icon-delete" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="information-block">
              <Row className="p-l--sm p-r--sm">
                <Col span={8} className="p-r--xs">
                  <InputView
                    label={translate("appUsers.code")}
                    placeHolder={"-"}
                    value={model?.code}
                  />
                </Col>
                <Col span={8} className="p-r--xs">
                  <InputView
                    label={translate("appUsers.userName")}
                    placeHolder={"-"}
                    value={model?.userName}
                  />
                </Col>
                <Col span={8} className="p-r--xs ">
                  <InputView
                    label={translate("appUsers.fullName")}
                    placeHolder={"-"}
                    value={model?.fullName}
                  />
                </Col>
                <Col span={8} className="p-r--xs m-t--xs">
                  <InputView
                    label={translate("appUsers.email")}
                    placeHolder={"-"}
                    value={model?.email}
                  />
                </Col>

                <Col span={8} className="p-r--xs m-t--xs">
                  <InputView
                    label={translate("appUsers.organization")}
                    placeHolder={"-"}
                    value={model?.organization?.name}
                  />
                </Col>
                <Col span={8} className="p-r--xs m-t--xs">
                  <FormItem
                    validateObject={utilService.getValidateObj(
                      model,
                      "phoneNumber"
                    )}
                  >
                    <InputText
                      maxLength={50}
                      label={translate("appUsers.phoneNumber")}
                      placeHolder={translate(
                        "appUsers.placeholder.phoneNumber"
                      )}
                      value={model.phoneNumber}
                      onChange={handleChangeSingleField({
                        fieldName: "phoneNumber",
                      })}
                    />
                  </FormItem>
                </Col>
                <Col span={8} className="p-r--xs m-t--xs">
                  <InputView
                    label={translate("appUsers.address")}
                    placeHolder={"-"}
                    value={model?.address}
                  />
                </Col>
                <Col span={8} className="p-r--xs m-t--xs">
                  <InputView
                    label={translate("appUsers.birthday")}
                    placeHolder={"-"}
                    value={formatDate(model?.birthday)}
                  />
                </Col>
                <Col lg={8} className="m-b--xs">
                  <div className="label-title p-t--sm">
                    {translate("appUsers.gender")}
                  </div>
                  <Radio.Group value={model?.gender}>
                    <Space direction="horizontal">
                      <Radio value={0}>{translate("appUsers.male")}</Radio>
                      <Radio value={1}>{translate("appUsers.female")}</Radio>
                      <Radio value={2}>{translate("appUsers.other")}</Radio>
                    </Space>
                  </Radio.Group>
                </Col>

                <Col lg={8} className="p-r--xs m-t--xs">
                  <div className={"label-title"}>
                    {translate("appUsers.status")}
                  </div>
                  <Switch
                    checked={model.isActive}
                    className={"switch_status"}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </LayoutDetail>
      </div>
      {loading && <LoadingCM />}
    </>
  );
};

export default AppUserDetail;
