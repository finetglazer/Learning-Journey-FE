import {
  Close,
  Menu,
  Notification,
  Settings,
  Switcher,
  UserAvatar,
} from "@carbon/icons-react";
import { Badge, Dropdown } from "antd";
import classNames from "classnames";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import SwitcherPanel from "../SwitcherPanel/SwitcherPanel";
import "./Header.scss";
// import InputSearchHeader from "./InputSearchHeader/InputSearchHeader";
import Navbar from "./Navbar/Navbar";
import NotificationDropdown from "./Notification/NotificationDropdown";
import Profile from "./Profile/Profile";
// import { useAppSelector } from "redux/hook";
import { PORTAL_APP_CATALOG_ROUTE } from "config/route-const";
import ConfigStore from "core/config/ConfigStore";
import i18nTranslation from "core/config/i18n";
import { systemConfigurationRepository } from "core/repositories/SystemConfigurationRepository";
import i18next from "i18next";
import iconEn from "../../assets/fonts/flag-icon/us.svg";
import iconVi from "../../assets/fonts/flag-icon/vn.svg";
import procuvaLogo from "../../assets/images/procuva-logo.png";
import ChangePasswordDrawer from "./Profile/ChangePasswordDrawer/ChangePasswordDrawer";
import useNotificationUnreadCountHook from "./Notification/useNotificationUnreadCountHook";
interface HeaderProps {
  isShowNav?: boolean;
  linkLogo?: string;
}

const Header: FC<HeaderProps> = (props: HeaderProps) => {
  const { isShowNav = true, linkLogo = PORTAL_APP_CATALOG_ROUTE } = props;
  // const profile = useAppSelector((state) => state.profile);
  const [toggleNavbar, setToggleNavbar] = React.useState(true);
  const [show, setShow] = React.useState<boolean>(false);
  const [active, setActive] = React.useState<boolean>(false);
  const [activeProfile, setActiveProfile] = React.useState<boolean>(false);
  const [visibleDrawer, setVisibleDrawer] = React.useState<boolean>(false);
  const [logoPath, setLogoPath] = React.useState<string>("");

  const { countUnread, setCountUnread } = useNotificationUnreadCountHook();

  const [selected, setSelected] = React.useState(i18next.language);

  const handleClickFocusNoti = React.useCallback(() => {
    setActive(!active);
    if (activeProfile) setActiveProfile(false);
  }, [active, activeProfile]);

  const handleClickFocusProfile = React.useCallback(() => {
    setActiveProfile(!activeProfile);
    if (active) setActive(false);
  }, [active, activeProfile]);

  const handleShowRightBar = React.useCallback(() => {
    setShow(true);
    if (activeProfile) setActiveProfile(false);
    if (active) setActive(false);
  }, [active, activeProfile]);

  const handleCloseRightBar = React.useCallback(() => {
    setShow(false);
  }, []);

  const handleSetLanguage = (key: "en" | "vi") => {
    localStorage.setItem("I18N_LANGUAGE", key);
    i18nTranslation.changeLanguage(key);
    setSelected(key);
  };

  React.useEffect(() => {
    systemConfigurationRepository.detail().subscribe((res) => {
      const path = res?.data.logoPath;
      if (path) {
        setLogoPath(
          `${ConfigStore.getInstance().get(
            "baseApiUrl"
          )}/share/file/public/download?Path=${path}`
        );
      }
    });
  }, []);

  return (
    <>
      <header className="header-wrapper">
        <div className="header-box">
          <div className="header-box__logo">
            <button
              className="header-box__btn header-box__btn-toggle"
              data-toggle="collapse"
              data-target="#topnav-menu-content"
              onClick={() => setToggleNavbar(!toggleNavbar)}
            >
              <Menu size={20} />
            </button>
            <div className="header-logo">
              <Link to={linkLogo} className="header-logo__link">
                {logoPath ? (
                  <img
                    src={logoPath}
                    alt="logo"
                    className="header-logo__image"
                  />
                ) : (
                  <img
                    src={procuvaLogo}
                    alt="logo"
                    className="header-logo__image"
                  />
                )}
              </Link>
            </div>
            <div className="header_divider" />
          </div>
          <div className="header-navbar d-flex align-items-center">
            {isShowNav && <Navbar isOpen={toggleNavbar} />}
          </div>
        </div>

        <div className="header-action">
          {/* <InputSearchHeader /> */}

          <button className="header-box__btn">
            <Settings size={20} />
          </button>
          <Dropdown
            dropdownRender={() => (
              <div className="lang-dropdown">
                <div
                  onClick={() => handleSetLanguage("vi")}
                  className="lang-dropdown__item m-b--3xs"
                >
                  {" "}
                  <img
                    src={iconVi}
                    width={22}
                    height={16}
                    alt="vi"
                    className="m-r--3xs "
                  />
                  Vietnamese
                </div>
                <div
                  onClick={() => handleSetLanguage("en")}
                  className="lang-dropdown__item"
                >
                  {" "}
                  <img
                    src={iconEn}
                    width={22}
                    height={16}
                    alt="en"
                    className="m-r--3xs "
                  />
                  English (US)
                </div>
              </div>
            )}
            trigger={["click"]}
            placement="bottom"
          >
            <div className="lang p-x--2xs">
              <img
                src={selected === "en" ? iconEn : iconVi}
                width={22}
                height={16}
                alt="language-icon"
              />
              {/* <span className="lang-txt m-l--2xs">{selected}</span> */}
            </div>
          </Dropdown>

          <button
            className={classNames("switcher-box__btn", {
              "header-box__btn-noti": active,
              "": !active,
            })}
            onClick={handleClickFocusNoti}
          >
            <Badge count={countUnread}>
              <Notification size={20} />
            </Badge>
          </button>
          <NotificationDropdown
            setActive={setActive}
            active={active}
            setCountUnread={setCountUnread}
          />
          <Dropdown
            dropdownRender={() => (
              <Profile
                // profile={profile}
                setActiveProfile={setActiveProfile}
                setVisibleDrawer={setVisibleDrawer}
              />
            )}
            trigger={["click"]}
            placement="bottomLeft"
            open={activeProfile}
          >
            <button
              className={classNames("switcher-box__btn", {
                "header-box__btn-profile": activeProfile,
                "": !activeProfile,
              })}
              onClick={handleClickFocusProfile}
            >
              <UserAvatar size={20} />
            </button>
          </Dropdown>

          <Dropdown
            dropdownRender={() => (
              <SwitcherPanel handleCloseRightBar={handleCloseRightBar} />
            )}
            trigger={["click"]}
            placement="bottom"
            open={show}
          >
            {!show ? (
              <button
                className="switcher-box__btn"
                onClick={handleShowRightBar}
              >
                <Switcher size={20} />
              </button>
            ) : (
              <button
                className="switcher-box__btn switcher-box__btn-close"
                onClick={handleCloseRightBar}
              >
                <Close size={20} />
              </button>
            )}
          </Dropdown>
        </div>
      </header>
      <ChangePasswordDrawer
        // profile={profile}
        visible={visibleDrawer}
        setVisible={setVisibleDrawer}
      />
    </>
  );
};

export default Header;
