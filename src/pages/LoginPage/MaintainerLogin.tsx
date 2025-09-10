import { Eye, EyeClosed } from "assets/icons";
import { LoginGraphic } from "assets/images";
import { LoadingCM } from "components";
import { Button, FormItem, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import nameof from "ts-nameof.macro";
import msbLogo from "../../assets/images/msb-logo.png";
import "./Login.scss";
import useLogin from "./LoginHook";

function MaintainerLogin() {
  const [translate] = useTranslation();

  const {
    loginUser,
    errorMessageUsername,
    errorMessagePass,
    handleChangeField,
    handleEnter,
    showPassword,
    handleShowPassword,
    handleLogin,
    isLoadingButtonSubmit,
    isLoading,
  } = useLogin();

  return (
    <>
      <div className="login-page">
        <div className="login-page__bg">
          <img src={LoginGraphic} alt="Login_Graphic" />
        </div>
        <div className="login-page__content">
          <div className="login-page__content--logo">
            <img src={msbLogo} alt="logo" />
            <p className="login-page__content--logo-title">
              {translate("CM.title_logo")}
            </p>
          </div>

          <div className="login-page__content--form">
            <p className="login-page__content--form-title">
              {translate("LG.title")}
            </p>

            <div>
              <form onSubmit={() => handleLogin}>
                <div className="m-b--xl">
                  <FormItem
                    message={errorMessageUsername}
                    validateStatus={
                      errorMessageUsername ? "error" : "validating"
                    }
                  >
                    <InputText
                      isSmall={false}
                      label={translate("LG.username")}
                      typeInput="text"
                      placeHolder={translate("LG.placeholder_username")}
                      value={loginUser.email}
                      onChange={handleChangeField(nameof(loginUser.email))}
                      onEnter={() => handleEnter}
                      isShowTooltip={false}
                    />
                  </FormItem>
                </div>
                <FormItem
                  message={errorMessagePass}
                  validateStatus={errorMessagePass ? "error" : "validating"}
                >
                  <InputText
                    label={translate("LG.password")}
                    isSmall={false}
                    isShowTooltip={false}
                    typeInput={showPassword ? "text" : "password"}
                    placeHolder={translate("LG.placeholder_password")}
                    value={loginUser.password}
                    onChange={handleChangeField(nameof(loginUser.password))}
                    onEnter={() => handleEnter}
                    suffix={
                      showPassword ? (
                        <div
                          className="cursor-pointer"
                          onClick={handleShowPassword}
                        >
                          <img src={Eye} alt="eye" />
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer"
                          onClick={handleShowPassword}
                        >
                          <img src={EyeClosed} alt="eye_closed" />
                        </div>
                      )
                    }
                  />
                </FormItem>
                <Button
                  type="primary"
                  size="lg"
                  className="login-page__content--form-button-login m-t--xl"
                  onClick={handleLogin}
                  htmlType="submit"
                  loading={isLoadingButtonSubmit}
                >
                  {translate("LG.btn_submit")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? <LoadingCM /> : null}
    </>
  );
}

export default MaintainerLogin;
