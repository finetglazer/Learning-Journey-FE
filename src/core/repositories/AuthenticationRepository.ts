import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { LoginUser } from "core/models/LoginUser";
import kebabCase from "lodash/kebabCase";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";
import { Permission } from "../services/service-types";

interface OTPParam {
  email: string;
  otpCode: string;
}

interface RecoveryPasswordParam {
  password: string;
  email: string;
  otpCode: string;
}

export const API_AUTHENTICATION_PREFIX = "/auth/user/";

export class AuthenticationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_AUTHENTICATION_PREFIX}`;
  }

  public login = (user: LoginUser): Observable<LoginUser> => {
    return this.http
      .post<LoginUser>(kebabCase(nameof(this.login)), user)
      .pipe(Repository.responseMapToModel<LoginUser>(LoginUser));
  };

  public logout = (): Observable<unknown> => {
    return this.http.post<unknown>(kebabCase(nameof(this.logout)), {});
  };

  public loginByGmail = (user: LoginUser): Observable<LoginUser> => {
    return this.http
      .post<LoginUser>(kebabCase(nameof(this.loginByGmail)), user)
      .pipe(Repository.responseMapToModel<LoginUser>(LoginUser));
  };

  public get = (): Observable<LoginUser> => {
    return this.http
      .post<LoginUser>(kebabCase(nameof(this.get)))
      .pipe(Repository.responseMapToModel<LoginUser>(LoginUser));
  };

  public forgotPassword = (email: string): Observable<LoginUser> => {
    return this.http
      .post<LoginUser>(kebabCase(nameof(this.forgotPassword)), { email })
      .pipe(Repository.responseMapToModel<LoginUser>(LoginUser));
  };

  public verifyOtpCode = (obj: OTPParam): Observable<LoginUser> => {
    return this.http
      .post<LoginUser>(kebabCase(nameof(this.verifyOtpCode)), obj)
      .pipe(Repository.responseMapToModel<LoginUser>(LoginUser));
  };

  public recoveryPassword = (
    obj: RecoveryPasswordParam
  ): Observable<LoginUser> => {
    return this.http
      .post<LoginUser>(kebabCase(nameof(this.recoveryPassword)), obj)
      .pipe(Repository.responseMapToModel<LoginUser>(LoginUser));
  };

  public refreshToken = (): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.refreshToken)))
      .pipe(Repository.responseDataMapper<number>());
  };

  public SSOEndpoint = (): Observable<string> => {
    return this.http
      .get<string>(nameof(this.SSOEndpoint))
      .pipe(Repository.responseDataMapper<string>());
  };

  public info = (accessCode: string): Observable<LoginUser> => {
    const headers = {
      Authorization: `Bearer ${accessCode}`,
    };

    return this.http
      .get<LoginUser>(nameof(this.info), {
        headers: headers,
      })
      .pipe(Repository.responseMapToModel<LoginUser>(LoginUser));
  };

  public getUserPermission = (): Observable<Permission[]> => {
    return this.http
      .get<Permission[]>(nameof(this.getUserPermission), {})
      .pipe(Repository.responseDataMapper<Permission[]>());
  };
}

export const authenticationRepository = new AuthenticationRepository();
