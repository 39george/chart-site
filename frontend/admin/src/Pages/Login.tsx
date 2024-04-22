import { useDispatch } from "react-redux";
import styles from "./Login.module.scss";
import { FC, FormEvent, useState } from "react";
import useAxios from "../Hooks/APIRequests";
import { API_URL } from "../config";
import { set_permissions } from "../state/permissions_slice";

const Login: FC = () => {
  const [form_data, set_form_data] = useState({
    username: "",
    password: "",
  });
  const [err_msg, set_err_msg] = useState("");
  const [logging, set_logging] = useState(false);
  const dispatch = useDispatch();
  const { error_data: login_error, fetch_data: login } = useAxios();

  function handle_input_change(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    set_form_data((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handle_submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    set_err_msg("");
    set_logging(true);
    const data = JSON.stringify(form_data);

    const response = await login({
      method: "POST",
      url: `${API_URL}/login`,
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200) {
      dispatch(set_permissions(true));
      set_logging(false);
    } else if (response?.status === 500) {
      set_err_msg(login_error);
      set_logging(false);
    } else {
      set_err_msg("Неверный логин или пароль");
      set_logging(false);
    }
  }

  return (
    <div className={styles.login_window}>
      <div className={styles.content}>
        <p className={styles.header}>Авторизуйтесь, чтобы продолжить</p>
        <form
          onSubmit={handle_submit}
          className={styles.input_form}
        >
          <div className={styles.input_container}>
            <div className={styles.label_and_counter}>
              <label
                htmlFor="username"
                className={styles.label}
              >
                Логин
              </label>
            </div>
            <input
              type="text"
              name="username"
              id="username"
              className={styles.input_field}
              onChange={handle_input_change}
              autoComplete="off"
              autoFocus
            />
          </div>
          <div className={styles.input_container}>
            <div className={styles.label_and_counter}>
              <label
                htmlFor="password"
                className={styles.label}
              >
                Пароль
              </label>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              className={styles.input_field}
              onChange={handle_input_change}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className={styles.submit_button}
            disabled={logging}
          >
            {logging ? (
              <div className={styles.loader_small}></div>
            ) : (
              "Авторизоваться"
            )}
          </button>
        </form>
        {err_msg && <div className={styles.err_msg}>{err_msg}</div>}
      </div>
    </div>
  );
};

export default Login;
