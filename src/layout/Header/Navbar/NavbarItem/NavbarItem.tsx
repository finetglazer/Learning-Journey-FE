import { ChevronDown } from "@carbon/icons-react";
import classNames from "classnames";
import { Menu } from "config/config-type";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

interface NavbarItemProps {
  item?: Menu;
  index?: number;
}

const isMobile = () => window.screen.availWidth <= 995;

const NavbarItem = ({ item, index }: NavbarItemProps) => {
  const [translate] = useTranslation();
  const [menuItems, setMenuItems] = React.useState<{ [key: string]: unknown }>(
    {}
  );
  const [expanded, setExpand] = React.useState(false);

  const handleToggleMenu = React.useCallback(
    (menu: Menu) => (event: React.MouseEvent) => {
      event.preventDefault();
      setExpand((prev) => !prev);

      if (isMobile()) {
        const key = translate(menu.name as string);
        setMenuItems((prevItems) => ({
          ...prevItems,
          [key]: prevItems[key] !== undefined ? !prevItems[key] : true,
        }));
      }
    },
    [menuItems, translate]
  );

  const renderMenuChildren = (children: Menu[]) => {
    return children.map((child, idx) =>
      !child.show ? null : child.children ? (
        <div key={idx} className="nav-dropdown">
          {renderMenu(child, idx)}
        </div>
      ) : (
        <NavLink key={idx} to={child.link} className="navbar-dropdown__item">
          {translate(child.name as string)}
        </NavLink>
      )
    );
  };

  const renderToggle = (menu: Menu, itemType?: string) => (
    <NavLink
      to={menu.link}
      className={classNames("navbar-dropdown__toggle", {
        "navbar-dropdown__item": !itemType,
      })}
      onClick={handleToggleMenu(menu)}
      aria-expanded={expanded}
    >
      {itemType === "nav" ? (
        <div className="d-flex align-items-center">
          {menu.icon && <span className="m-r--2xs">{menu.icon}</span>}
          <span>{translate(menu.name as string)}</span>
        </div>
      ) : (
        translate(menu.name as string)
      )}
      <div className="p-l--2xs">
        <div className="navbar-dropdown__item-icon">
          <ChevronDown size={16} />
        </div>
      </div>
    </NavLink>
  );

  const renderMenu = (menu: Menu, key: number, itemType?: string) => (
    <React.Fragment key={key}>
      {menu.children
        ? menu.show && (
            <>
              {renderToggle(menu, itemType)}
              <div className="navbar-dropdown__menu">
                {renderMenuChildren(menu.children)}
              </div>
            </>
          )
        : menu.show && (
            <NavLink className="navbar-dropdown__item m-r--2xs" to={menu.link}>
              {translate(menu.name as string)}
            </NavLink>
          )}
    </React.Fragment>
  );

  if (!item?.show) return null;

  return (
    <>
      {item.children ? (
        <li key={index} className="nav-item nav-dropdown">
          {renderMenu(item, index!, "nav")}
        </li>
      ) : (
        <li className="nav-item nav-dropdown" key={index}>
          <NavLink to={item.link} className="navbar-dropdown__toggle">
            <div className="d-flex align-items-center">
              {item.icon && <span className="m-r--2xs">{item.icon}</span>}
              <span>{translate(item.name as string)}</span>
            </div>
          </NavLink>
        </li>
      )}
    </>
  );
};

export default NavbarItem;
