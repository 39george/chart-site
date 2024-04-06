import { useState } from "react";
import { MAX_RETRIES, RETRY_DELAY_MS } from "../config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { wait } from "../helpers";
import { RequestMethods } from "../types";

const useAxios = () => {
  const [error_data, set_error_data] = useState<string | undefined>();

  const fetch_data = async (
    method: RequestMethods,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    attempts: number = 1
  ) => {
    let response: AxiosResponse;
    try {
      switch (method) {
        case RequestMethods.Get:
          response = await axios.get(url);
          return response;
        case RequestMethods.Post:
          response = await axios.post(url, data, config);
          return response;
        case RequestMethods.Put:
          break;
        case RequestMethods.Delete:
          break;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          //TODO Process all the error cases
          switch (error.response.status) {
            case 400:
              console.error("Bad request:", error.response);
              break;
            case 404:
              console.error(
                "Not found, check the request: ",
                error.config?.url,
                error.response
              );
              break;
            case 500:
              if (attempts < MAX_RETRIES) {
                await wait(RETRY_DELAY_MS);
                fetch_data(method, url, data, config, attempts + 1);
              } else {
                set_error_data(
                  "Что-то не так с нашим сервером, мы уже работаем над этим. Пожалуйста, попробуйте обновить страницу"
                );
              }
              break;
            default:
              console.error(
                "API error: ",
                error.response.status,
                error.response.data
              );
          }
        } else if (error.request) {
          if (attempts < MAX_RETRIES) {
            await wait(RETRY_DELAY_MS);
            fetch_data(method, url, data, config, attempts + 1);
          } else {
            console.error(
              "Сервер не отвечает, пожалуйста, обновите страницу и попробуйте еще раз",
              error.message
            );
          }
        } else {
          console.error("API Error: Reqest setup error:", error.message);
        }
      } else {
        console.error("Non-Axios:", error);
      }
    }
  };

  return { error_data, fetch_data };
};

export default useAxios;
