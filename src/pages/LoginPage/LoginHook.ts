import { AxiosError } from "axios";
import {
  ACCESS_TOKEN,
  EMAIL,
  PROTECT,
  REFRESH_TOKEN,
  REMEMBER_ME,
} from "config/const";
import { DASHBROAD_ROUTE } from "config/route-const";
import { AESdecrypt, AESencrypt } from "core/helpers/common";
import { getParameterByName } from "core/helpers/query";
import { LoginUser } from "core/models/LoginUser";
import { authenticationRepository } from "core/repositories/AuthenticationRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { HttpStatusCode } from "core/services/service-types";
import { isEmpty, isEqual } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { profileActions } from "rtk/slices";
import { useAppDispatch } from "rtk/useRedux";
export enum LOGIN_STATE {
  LOGIN = "LOGIN",
  FORGOT_PROTECT = "FORGOT_PROTECT",
  GET_OTP = "GET_OTP",
  CHANGE_PROTECT = "CHANGE_PROTECT",
  SUCCESSFUL = "SUCCESSFUL",
}

export default function useLogin() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [loginUser, setLoginUser] = useState<LoginUser>({
    ...new LoginUser(),
    email: "",
    password: "",
  });
  const [loginState, setLoginState] = useState<LOGIN_STATE>(LOGIN_STATE.LOGIN);
  const [email, setEmail] = useState<string>(null);
  const [otp, setOtp] = useState<string>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(
    localStorage.getItem(REMEMBER_ME) === "true" ? true : false
  );
  const [isLoadingButtonSubmit, setIsLoadingButtonSubmit] =
    useState<boolean>(false);

  const [errorMessageUsername, setErrorMessageUsername] =
    useState<string>(null);
  const [errorMessagePass, setErrorMessagePass] = useState<string>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChangeRememberMe = (event: boolean) => {
    setRememberMe(event);
    localStorage.setItem(REMEMBER_ME, JSON.stringify(event));
  };

  const emailLocal = AESdecrypt(localStorage.getItem(EMAIL));
  const protectLocal = AESdecrypt(localStorage.getItem(PROTECT));

  useEffect(() => {
    if (rememberMe) {
      setLoginUser({
        email: emailLocal,
        password: protectLocal,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackToLogin = React.useCallback(() => {
    setLoginState(LOGIN_STATE.LOGIN);
  }, [setLoginState]);

  const handleFakeLogin = React.useCallback(
    (
      event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.MouseEvent<HTMLInputElement>
    ) => {
      event.preventDefault();
      localStorage.setItem(
        "profile",
        JSON.stringify({
          id: 1,
          displayName: "Admin",
          userName: "Administrator",
        })
      );
      window.location.href = DASHBROAD_ROUTE;
    },
    []
  );

  const setUser = useCallback(
    (user: LoginUser, needSetRefreshToken?: boolean) => {
      dispatch(profileActions.businessDepartment(user?.businessDepartment));
      dispatch(
        profileActions.updateAccount({
          email: user?.email,
          name: user?.fullName,
          id: user?.id,
          phoneNumber: user?.phoneNumber,
        })
      );
      dispatch(profileActions.updatePosition(user?.position));
      dispatch(profileActions.updateBusinessUnit(user?.businessUnit));
      dispatch(profileActions.updateBusinessBranch(user?.businessBranch));
      dispatch(profileActions.updateOrganization(user?.organization));
      const redirect = getParameterByName("redirect") ?? DASHBROAD_ROUTE;
      const email = AESencrypt(loginUser.email);
      const protect = AESencrypt(loginUser.password);
      window.location.href = `${redirect}`;
      localStorage.setItem(EMAIL, email);
      localStorage.setItem(PROTECT, protect);
      localStorage.setItem(ACCESS_TOKEN, user?.accessToken);
      if (needSetRefreshToken)
        localStorage.setItem(REFRESH_TOKEN, user?.refreshToken);
    },
    [dispatch, loginUser.email, loginUser.password]
  );

  const handleLoginFailed = (error: AxiosError) => {
    if (isEqual(error?.response?.status, HttpStatusCode.BAD_REQUEST)) {
      const { message } = error?.response?.data || {};
      const { email, password } = error?.response?.data?.errors || {};

      if (email) setErrorMessageUsername(email);
      if (password) setErrorMessagePass(password);
      if (message) setErrorMessagePass(message);
    }
  };

  const handleLogin = useCallback(
    (
      event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.MouseEvent<HTMLInputElement>
    ) => {
      event.preventDefault();
      setIsLoadingButtonSubmit(true);
      const needSetRefreshToken = true;
      authenticationRepository.login(loginUser).subscribe({
        next: (response) => {
          setUser(response, needSetRefreshToken);
          setIsLoadingButtonSubmit(false);
        },
        error: (error: AxiosError) => {
          handleLoginFailed(error);
          setIsLoadingButtonSubmit(false);
        },
      });
    },
    [loginUser, setUser]
  );

  const handleSetValue = useCallback(
    (field: string, value?: string | number | boolean | null) => {
      setLoginUser({
        ...loginUser,
        [field]: value,
        errors: undefined,
      });
      setErrorMessagePass(null);
      setErrorMessageUsername(null);
    },
    [loginUser, setLoginUser, setErrorMessagePass, setErrorMessageUsername]
  );

  const handleChangeField = useCallback(
    (field: string) => {
      return (value: string) => {
        return handleSetValue(field, value);
      };
    },
    [handleSetValue]
  );

  const handleEnter = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === "Enter") {
        handleLogin(ev);
      }
    },
    [handleLogin]
  );

  const handleLoginSSO = () => {
    authenticationRepository.SSOEndpoint().subscribe({
      next: (response: string) => {
        setLoading(true);
        window.location.href = response;
      },
      error: () => {
        setLoading(false);
        notifyToast({
          type: "error",
          message: translate("CM.message_system_error"),
        });
      },
    });
  };

  const getUserInformation = useCallback(
    (accessCode: string) => {
      const needSetRefreshToken = false;
      authenticationRepository.info(accessCode).subscribe({
        next: (user) => setUser(user, needSetRefreshToken),
        error: handleLoginFailed,
        complete: () => setLoading(false),
      });
    },
    [setUser]
  );

  // get access code from url after login by SSO
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ACCESS_CODE = "accessCode";
    const accessCode = searchParams.get(ACCESS_CODE);
    const refreshToken = searchParams.get("refreshToken");
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    if (!isEmpty(accessCode)) {
      getUserInformation(accessCode);
    }
  }, [getUserInformation, location.search]);

  return {
    loginState,
    setLoginState,
    email,
    setEmail,
    handleBackToLogin,
    otp,
    setOtp,
    loginUser,
    errorMessageUsername,
    errorMessagePass,
    handleLogin,
    handleChangeField,
    handleEnter,
    handleFakeLogin,
    showPassword,
    handleShowPassword,
    rememberMe,
    handleChangeRememberMe,
    isLoadingButtonSubmit,
    handleLoginSSO,
    isLoading,
  };
}
