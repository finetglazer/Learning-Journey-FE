import { LoginGraphic } from "assets/images";
import { LoadingCM } from "components";
import { useTranslation } from "react-i18next";
import msbLogo from "../../assets/images/msb-icon.png";
import "./Login.scss";
import useLogin from "./LoginHook";
import useHandleLoginSsoError from "./hooks/useHandleLoginSsoError";
import { LOGIN_MAINTAINER_ROUTE } from "core/config/consts";

function Login() {
  const [translate] = useTranslation();

  const { errorMessageUsername, errorMessagePass, handleLoginSSO, isLoading } =
    useLogin();

  useHandleLoginSsoError();

  const handleGoMaintainerLogin = () => {
    window.open(LOGIN_MAINTAINER_ROUTE, "_self");
  };

  return (
    <>
      <div className="login-page">
        <div className="login-page__bg">
          <img src={LoginGraphic} alt="Login_Graphic" />
        </div>
        <div className="login-page__content">
          <div
            className="login-page__content--logo"
            onClick={handleGoMaintainerLogin}
          >
            <img
              src={msbLogo}
              alt="logo"
              style={{
                width: "200px",
                height: "50px",
              }}
            />
          </div>
          <div className="title-content mt-1">Eprocurement</div>
          <div className="m-t--xl">
            <div className="login-content">
              {/* errors */}

              <div className="login d-flex float-left">
                <button
                  className="btn btn-primary btn-sm btn-login"
                  onClick={handleLoginSSO}
                  disabled={
                    errorMessagePass !== null || errorMessageUsername !== null
                  }
                >
                  {translate("LG.btn_submit_sso")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? <LoadingCM /> : null}
    </>
  );
}

export default Login;
