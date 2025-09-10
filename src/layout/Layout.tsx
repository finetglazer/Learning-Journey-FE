import { ConfigProvider } from "antd";
import { FC, Fragment, PropsWithChildren } from "react";
import Body from "./Body/Body";
import Header from "./Header/Header";
import "./Layout.scss";

import viVN from "antd/es/locale/vi_VN";
// import dayjs from "dayjs";
// import "dayjs/locale/vi";

// dayjs.locale("vi");

const Layout: FC<PropsWithChildren<unknown>> = (
  props: PropsWithChildren<unknown>
) => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          fontFamily: '"Inter", sans-serif',
        },
      }}
    >
      <Fragment>
        <div className="layout__container">
          <div className="layout-header">
            <Header />
          </div>
          <div className="layout-body">
            <div className="layout-body__main">
              <Body>{props.children}</Body>
            </div>
          </div>
          {/* <div className="layout-footer">
          <Footer></Footer>
        </div> */}
        </div>
      </Fragment>
    </ConfigProvider>
  );
};

export default Layout;
