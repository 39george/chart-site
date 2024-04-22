import { useState } from "react";
import { MAX_RETRIES, RETRY_DELAY_MS } from "../config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { wait } from "../helpers";

const useAxios = () => {
  const [error_data, set_error_data] = useState<string>("");

  const fetch_data = async (
    config: AxiosRequestConfig,
    attempts: number = 1
  ) => {
    let response: AxiosResponse;
    try {
      switch (config.method) {
        case "GET":
          response = await axios.get(config.url || "");
          return response;
        case "POST":
          response = await axios.post(config.url || "", config.data, config);
          return response;
        case "DELETE":
          response = await axios.delete(config.url || "", config);
          return response;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              console.error("Bad request:", error.response);
              break;
            case 401:
              console.error("Unathorized: ", error.response);
              set_error_data(
                "Запрос запрещен. Пожалуйста, авторизуйтесь и попробуйте еще раз"
              );
              break;
            case 403:
              console.error("Forbidden:", error.response);
              set_error_data(
                "Запрос запрещен. У вас нет прав для выполнения данного запроса"
              );
              break;
            case 404:
              console.error(
                "Not found, check the request: ",
                error.config?.url,
                error.response
              );
              break;
            case 415:
              console.error("Unsupported media type: ", error.response);
              break;
            case 422:
              console.error(
                "Trying to delete data used somewhere: ",
                error.response
              );
              set_error_data(
                "Вы пытаетесь удалить данные, которые используются в загруженных песнях. Пожалуйста, сначала поменяйте данные в песне или удалите её."
              );
              break;
            case 500:
              if (attempts < MAX_RETRIES) {
                await wait(RETRY_DELAY_MS);
                fetch_data(config, attempts + 1);
              } else {
                console.error("Server error:", error.response);
                set_error_data(
                  "На нашем сервере произошла ошибка. Мы делаем всё возможное, чтобы её исправить. Пожалуйста, повторите ваш запрос позднее"
                );
              }
              break;
            default:
              console.error(
                "API error: ",
                error.response.status,
                error.response.data
              );
              set_error_data(
                `Error status: ${error.status}, Error: ${error.response}`
              );
          }
        } else if (error.request) {
          if (attempts < MAX_RETRIES) {
            await wait(RETRY_DELAY_MS);
            fetch_data(config, attempts + 1);
          } else {
            console.error("Server is not responding: ", error.message);
            set_error_data(
              "Сервер не отвечает, пожалуйста, обновите страницу и попробуйте еще раз"
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
