import { ArrowLeftIcon, IcCaretRightSVG } from "assets/icons";
import { IcHouseSVG } from "assets/images";
import classNames from "classnames";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import "./PageHeader.scss";

export interface BreadcrumbInterface {
  name?: string;
  path?: string;
}

export interface PageHeaderProps {
  title?: ReactNode;
  breadcrumbs?: BreadcrumbInterface[];
  children?: ReactNode;
  className?: string;
  theme?: "dark" | "light";
  hasTabs?: boolean;
  rightComponentTitle?: ReactNode;
  leftComponentTitle?: ReactNode;
  isShowBackButton?: boolean;
  route?: string;
  isView?: boolean;
}

const PageHeader = (props: PageHeaderProps) => {
  const {
    title,
    breadcrumbs,
    theme,
    children,
    hasTabs,
    rightComponentTitle,
    isShowBackButton,
    isView,
  } = props;

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div
      className={classNames(
        "page-header",
        {
          "page-header--dark": theme === "dark",
          "has-tabs": hasTabs,
          "is-view": isView,
        },
        props.className
      )}
    >
      <div>
        <div className="p-x--sm p-t--sm p-b--2xs">
          {breadcrumbs && breadcrumbs?.length > 0 && (
            <div className="page-header__breadcrumb m-b--3xs p-t--2xs p-l--2xs">
              <ul className="breadcrumb">
                <img
                  src={IcHouseSVG}
                  alt="ic_house"
                  width={16}
                  className="m-r--3xs"
                />
                {breadcrumbs.map((item: BreadcrumbInterface, index) => (
                  <li key={index}>
                    {item.path ? (
                      <NavLink
                        className={classNames({
                          "breadcrumb-active": index === breadcrumbs.length - 1,
                        })}
                        to={item.path}
                      >
                        {item.name}
                      </NavLink>
                    ) : (
                      <span>{item.name}</span>
                    )}
                    {breadcrumbs.length > 0 &&
                      index < breadcrumbs.length - 1 && (
                        <img
                          className="ic-breadcrumb"
                          width={8}
                          height={8}
                          src={IcCaretRightSVG}
                          alt="img"
                        />
                      )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div
            className={classNames("page-header__title", {
              "p-l--2xs": !isShowBackButton,
            })}
          >
            {isShowBackButton && (
              <div className="page-header__title_back" onClick={handleBack}>
                <img src={ArrowLeftIcon} alt="img" width={16} />
              </div>
            )}
            {title}
            {rightComponentTitle}
          </div>
        </div>
      </div>
      <div className="button-place">{children}</div>
    </div>
  );
};

export default PageHeader;
