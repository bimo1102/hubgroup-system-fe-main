import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import StatusResponseEnum from "./../../enums/status-response.enum";
import { LoginTypeEnum } from "../../enums/account.enum";

let instances: { [key in string]: AxiosInstance } = {};

export const controller = new AbortController();
export default function axiosClient(
  baseUrl = process.env.BASE_API_URL,
  options: {
    withCredentials?: boolean;
  } = {}
) {
  if (!instances) instances = {};
  const keyInstant = baseUrl + JSON.stringify(options);

  if (!instances[keyInstant]) {
    instances[keyInstant] = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 120000,
      paramsSerializer: {
        // serialize: params => queryString.stringify(params),
      },
      signal: controller.signal,
      ...options,
    });

    instances[keyInstant].interceptors.request.use(
      (config) => {
        const authLocalStorageToken = `${process.env.APP_VERSION}-${process.env.USERDATA_KEY}`;
        const token = localStorage.getItem(authLocalStorageToken);

        if (token) {
          (config.headers as Partial<InternalAxiosRequestConfig["headers"]>) = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'application/json',
          };
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    instances[keyInstant].interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: any) => {
        if (error instanceof AxiosError) {
          if (error.status === StatusResponseEnum.UNAUTHORIZED) {
            console.error("Unauthorized...");
            const tokenKey = `${process.env.APP_VERSION}-${process.env.USERDATA_KEY}`;
            const refreshTokenKey = `rf-${process.env.APP_VERSION}-${process.env.USERDATA_KEY}`;
            const refreshTokenValue = localStorage.getItem(refreshTokenKey);
            if (refreshTokenValue) {
              const response = await axios.post(
                process.env.SSO_API_URL + "/Account/RefreshToken",
                {
                  RefreshToken: refreshTokenValue,
                  AccountType: LoginTypeEnum.CustomerApp,
                  DeviceInfo: "DeviceLoginInfo",
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              );
              if (response?.data?.data) {
                const tokenResponse = response?.data?.data?.token;
                const refreshTokenResponse = response?.data?.data?.refreshToken;
                if (tokenResponse && refreshTokenResponse) {
                  localStorage.setItem(tokenKey, tokenResponse);
                  localStorage.setItem(refreshTokenKey, refreshTokenResponse);
                  if (error.config) {
                    error.config.headers.Authorization = `Bearer ${tokenResponse}`;
                    return axios(error.config);
                  }
                }
              }
              localStorage.removeItem(tokenKey);
              localStorage.removeItem(refreshTokenKey);
            }
          }

          if (
            [
              StatusResponseEnum.UNAUTHORIZED,
              0,
              StatusResponseEnum.FORBIDDEN,
            ].includes(error.status)
          ) {
            let errObject;
            switch (error.status) {
              case 0:
                {
                  errObject = {
                    status: false,
                    messages: ["Can't connect to server"],
                    responseStatus: error.status,
                    error: error,
                  };
                }
                break;
              case StatusResponseEnum.UNAUTHORIZED:
                {
                  errObject = {
                    status: false,
                    messages: ["Unauthorized"],
                    responseStatus: error.status,
                    error: error,
                  };
                }
                break;
              case StatusResponseEnum.FORBIDDEN:
                {
                  errObject = {
                    status: false,
                    messages: ["Permission denied"],
                    responseStatus: error.status,
                    error: error,
                  };
                }
                break;
            }
            return Promise.reject({ data: errObject });
          } else if (error.message) {
            return Promise.reject({
              data: {
                status: false,
                messages: [error.message],
                responseStatus:
                  error.code === "ERR_NETWORK"
                    ? StatusResponseEnum.NET_CONNECT_ERROR
                    : error.status,
                error: error,
              },
            });
          }
        }
        return Promise.reject(error);
      }
    );
  }

  return instances[keyInstant];
}
