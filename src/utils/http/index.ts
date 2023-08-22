import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CustomParamsSerializer
} from "axios";
import {
  RequestMethods,
  PureHttpRequestConfig,
  PureHttpResponse
} from "./types.d";
import { stringify } from "qs";
import NProgress from "../progress";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

export class PureHttp {
  constructor(initConfig: PureHttpRequestConfig) {
    this.httpInterceptorsRequest();
    PureHttp.initConfig = initConfig ? initConfig : {};
  }

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        //执行访问前的基础配置
        if (typeof config.beforeRequestCallback === "function") {
          config = await config.beforeRequestCallback(config);
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 通用请求工具函数 */
  public async request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    // 开启进度条动画
    NProgress.start();
    let config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;
    //合并配置
    config = Object.assign(config, PureHttp.initConfig);

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then(async (response: PureHttpResponse) => {
          //执行访问前的基础配置
          if (typeof config.beforeResponseCallback === "function") {
            const res = await config.beforeResponseCallback(response);
            resolve(res);
          }
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => {
          NProgress.done();
        });
    });
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }
}

export const http = new PureHttp({});
