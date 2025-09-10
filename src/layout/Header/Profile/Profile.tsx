import { Button } from "antd";
import {
  FileArrowDownIcon,
  GlobeSimpleIcon,
  LeftIcon,
  LockIcon,
  LogOutIcon,
  UserIcon,
} from "assets/icons";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "config/const";
import { PORTAL_APP_USER_ROUTE, PROFILE_ROUTE } from "config/route-const";
import { LOGIN_ROUTE } from "core/config/consts";
import { authenticationRepository } from "core/repositories/AuthenticationRepository";
import { utilService } from "core/services/common-services/util-service";
import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "rtk/useRedux";
import "./Profile.scss";
import { OneLineText } from "react-components-design-system";
import { useHistory } from "react-router-dom";

interface ProfileProps {
  setActiveProfile?: Dispatch<SetStateAction<boolean>>;
  setVisibleDrawer?: Dispatch<SetStateAction<boolean>>;
}

const Profile = (props: ProfileProps) => {
  const { setActiveProfile, setVisibleDrawer } = props;
  const profile = useAppSelector((state) => state.profile);
  const [translate] = useTranslation();
  const ref = useRef<HTMLDivElement>();
  const history = useHistory();

  const handleGoDetail = useCallback(() => {
    window.location.href = `${PORTAL_APP_USER_ROUTE}/app-user-detail/${profile.account.id}`;
  }, [profile]);

  const handleShowDrawer = useCallback(() => {
    setActiveProfile(false);
    setVisibleDrawer(true);
  }, [setActiveProfile, setVisibleDrawer]);

  const handleLogout = useCallback(() => {
    authenticationRepository.logout().subscribe({
      next: () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem("profile");
        window.location.href = LOGIN_ROUTE;
      },
    });
  }, []);

  const handleChangeActiveProfile = useCallback(() => {
    setActiveProfile(false);
  }, [setActiveProfile]);

  utilService.useClickOutside(ref, handleChangeActiveProfile);

  const shortcutName = useCallback((name: string) => {
    return name?.toUpperCase()?.substring(0, 2);
  }, []);

  const handleGoOpinionCollector = useCallback(() => {
    setActiveProfile(false);
    history.push(PROFILE_ROUTE);
  }, []);

  return (
    <div className="header-user__menu" ref={ref}>
      <Button type="text" className="header-user__menu__profile">
        <div className="header-user__menu__profile__image">
          {shortcutName(profile?.account?.name)}
        </div>
        <div className="header-user__menu__profile__content">
          <div className="header-user__menu__profile__name">
            <OneLineText value={profile?.account?.name} />
          </div>
          <div className="header-user__menu__profile__position">
            <OneLineText value={profile?.position?.name} />
          </div>
        </div>
        <img src={LeftIcon} alt="LeftIcon" />
      </Button>
      <Button
        type="link"
        className="header-user__menu__button"
        onClick={handleGoOpinionCollector}
        icon={<img src={FileArrowDownIcon} alt="FileArrowDownIcon" />}
      >
        {translate("CM.btn_opinion_list")}
      </Button>
      <Button
        type="text"
        className="header-user__menu__button"
        onClick={handleGoDetail}
        icon={<img src={UserIcon} alt="UserIcon" />}
      >
        {translate("PF.button_personal_info")}
      </Button>
      <Button
        type="text"
        className="header-user__menu__button"
        onClick={handleShowDrawer}
        icon={<img src={LockIcon} alt="LockIcon" />}
      >
        {translate("PF.button_change_password")}
      </Button>
      <Button
        type="text"
        className="header-user__menu__button"
        icon={<img src={GlobeSimpleIcon} alt="GlobeSimpleIcon" />}
      >
        {translate("PF.button_change_language")}
      </Button>
      <Button
        type="text"
        className="header-user__menu__button"
        onClick={handleLogout}
        icon={<img src={LogOutIcon} alt="SignOutIcon" />}
      >
        {translate("PF.button_logout")}
      </Button>
    </div>
  );
};

export default Profile;
