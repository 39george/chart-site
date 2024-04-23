import styles from "./EditGenresMoods.module.scss";
import { FC, useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { TiPlus } from "react-icons/ti";
import { FiTrash2 } from "react-icons/fi";
import useAxios from "../Hooks/APIRequests";
import { API_URL, FORBIDDEN_CHARS } from "../config";
import {
  set_genres_changed,
  set_moods_changed,
} from "../state/genres_moods_changed_slice";
import { useDispatch } from "react-redux";
import GeneralErrorModal from "./GeneralErrorModal";

interface EditGenresMoodsProps {
  kind: "genres" | "moods";
  items_list: string[];
  close_window: () => void;
  fetch_genres_error: string;
  fetch_moods_error: string;
  genres_moods_fetching: boolean;
}

const EditGenresMoods: FC<EditGenresMoodsProps> = ({
  kind,
  items_list,
  close_window,
  fetch_genres_error,
  fetch_moods_error,
  genres_moods_fetching,
}) => {
  const [checked_items, set_checked_items] = useState<string[]>([]);
  const [add_modal_visible, set_add_modal_visible] = useState(false);
  const [new_item, set_new_item] = useState<{ item: string }>({
    item: "",
  });
  const [input_empty, set_input_empty] = useState(false);
  const [input_err, set_input_err] = useState("");
  const [fetching_data, set_fetching_data] = useState(false);
  const [fetch_error_modal_visible, set_fetch_error_modal_visible] =
    useState(false);

  const {
    error_data: delete_items_error,
    set_error_data: set_delete_items_error,
    response_status: delete_items_error_response_status,
    set_response_status: set_delete_items_error_response_status,
    fetch_data: delete_items,
  } = useAxios();
  const {
    error_data: add_items_error,
    set_error_data: set_add_items_error,
    response_status: add_items_error_response_status,
    set_response_status: set_add_items_error_response_status,
    fetch_data: add_items,
  } = useAxios();
  const dispatch = useDispatch();

  function handle_checkbox_input_change(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const id = e.target.id;

    if (checked_items.includes(id)) {
      set_checked_items((prev) => prev.filter((item) => item !== id));
    } else {
      set_checked_items((prev) => [...prev, id]);
    }
  }

  function handle_text_input_change(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (!value) {
      set_input_empty(true);
    } else {
      set_input_empty(false);
    }

    if (FORBIDDEN_CHARS.test(value)) {
      set_input_err(
        `Пожалуйста, не используйте символы /()"<>\{};: в полях ввода`
      );
      return;
    } else if (items_list.includes(value)) {
      set_input_err(
        `${
          kind === "genres" ? "Такой жанр" : "Такое настроение"
        } уже существует`
      );
    } else {
      set_input_err("");
    }

    set_new_item({
      item: value,
    });
  }

  function handle_show_modal() {
    set_add_modal_visible(!add_modal_visible);
    set_checked_items([]);
  }

  function handle_cancel_click() {
    set_new_item({ item: "" });
    set_input_err("");
    set_input_empty(false);
    set_add_modal_visible(false);
  }

  function handle_close_error_modal() {
    set_fetch_error_modal_visible(false);
    set_add_items_error("");
    set_delete_items_error("");
  }

  //API requests
  async function try_to_delete() {
    set_fetching_data(true);

    const data = JSON.stringify(checked_items);
    const response = await delete_items({
      method: "DELETE",
      url: `${API_URL}/protected/${kind}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });

    if (response?.status === 200) {
      if (kind === "genres") {
        dispatch(set_genres_changed(true));
      } else {
        dispatch(set_moods_changed(true));
      }

      set_checked_items([]);
      set_fetching_data(false);
    }
  }

  async function try_to_add_item() {
    if (!new_item.item) {
      set_input_empty(true);
      return;
    }

    if (input_err) {
      return;
    }

    set_fetching_data(true);

    set_input_empty(false);
    const new_items: string[] = [new_item.item];

    const response = await add_items({
      method: "POST",
      url: `${API_URL}/protected/${kind}`,
      data: new_items,
    });

    if (response?.status === 201) {
      if (kind === "genres") {
        dispatch(set_genres_changed(true));
      } else {
        dispatch(set_moods_changed(true));
      }

      set_new_item({ item: "" });
      set_add_modal_visible(false);
      set_fetching_data(false);
    }
  }

  // Handle delete errors
  useEffect(() => {
    if (
      delete_items_error_response_status === 403 ||
      delete_items_error_response_status === 422 ||
      delete_items_error_response_status === 500
    ) {
      set_fetch_error_modal_visible(true);
      set_checked_items([]);
      set_delete_items_error_response_status(0);
      set_fetching_data(false);
    }
  }, [delete_items_error_response_status]);

  useEffect(() => {
    if (!delete_items_error_response_status && delete_items_error) {
      set_fetch_error_modal_visible(true);
      set_checked_items([]);
      set_fetching_data(false);
    }
  }, [delete_items_error_response_status, delete_items_error]);

  // Handle add errors
  useEffect(() => {
    if (
      add_items_error_response_status === 403 ||
      add_items_error_response_status === 500
    ) {
      set_fetch_error_modal_visible(true);
      set_new_item({ item: "" });
      set_add_modal_visible(false);
      set_add_items_error_response_status(0);
      set_fetching_data(false);
    }
  }, [add_items_error_response_status]);

  useEffect(() => {
    if (!add_items_error_response_status && add_items_error) {
      set_fetch_error_modal_visible(true);
      set_checked_items([]);
      set_fetching_data(false);
    }
  }, [add_items_error_response_status, add_items_error]);

  return (
    <>
      {fetch_error_modal_visible ? (
        <GeneralErrorModal
          err_message={add_items_error ? add_items_error : delete_items_error}
          close_modal={handle_close_error_modal}
        />
      ) : (
        <div className={styles.edit_window}>
          <div className={styles.content}>
            <div
              className={styles.close_icon_container}
              onClick={close_window}
            >
              <FaXmark className={styles.close_icon} />
            </div>
            {fetch_genres_error || fetch_moods_error ? (
              <div>
                <p className={styles.header}>Ошибка</p>
                <p
                  style={{
                    marginTop: "2rem",
                    marginBottom: "1.25rem",
                    fontSize: ".875rem",
                  }}
                >
                  {kind === "genres" ? fetch_genres_error : fetch_moods_error}
                </p>
              </div>
            ) : (
              <div>
                <p className={styles.header}>
                  Редактирование {kind === "genres" ? "жанров" : "настроений"}
                </p>
                {add_modal_visible ? (
                  <div className={styles.add_modal}>
                    <label
                      htmlFor="new"
                      className={styles.label}
                    >
                      Название {kind === "genres" ? "жанра" : "настроения"}
                    </label>
                    <input
                      type="text"
                      id="new"
                      name={kind}
                      value={new_item.item}
                      autoFocus
                      autoComplete="off"
                      className={styles.input_field}
                      onChange={handle_text_input_change}
                    />
                    {input_empty && (
                      <p className={styles.input_empty}>
                        Поле не должно быть пустым
                      </p>
                    )}
                    {input_err && (
                      <div className={styles.err_message}>{input_err}</div>
                    )}
                  </div>
                ) : (
                  <div className={styles.list_and_options}>
                    {genres_moods_fetching ? (
                      <div className={styles.loader_small}></div>
                    ) : (
                      <>
                        <ul className={styles.list}>
                          {items_list.map((item, idx) => {
                            return (
                              <li
                                key={idx}
                                className={styles.input_options}
                              >
                                <input
                                  type="checkbox"
                                  id={item}
                                  name={
                                    kind === "genres"
                                      ? "primary_genre"
                                      : "moods"
                                  }
                                  checked={checked_items.includes(item)}
                                  onChange={handle_checkbox_input_change}
                                />
                                <label
                                  htmlFor={item}
                                  className={styles.input_option}
                                >
                                  <span
                                    className={styles.custom_checkbox}
                                  ></span>
                                  &nbsp;&nbsp;{item}
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                        <div className={styles.check_options}>
                          <p
                            className={styles.check_all}
                            onClick={() => set_checked_items([...items_list])}
                          >
                            Выбрать все
                          </p>
                          {checked_items.length !== 0 && (
                            <p
                              className={styles.uncheck_all}
                              onClick={() => set_checked_items([])}
                            >
                              Сбросить
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div className={styles.action_buttons}>
                  {fetching_data ? (
                    <div className={styles.loader_small}></div>
                  ) : (
                    <>
                      {!add_modal_visible && checked_items.length === 0 && (
                        <div
                          className={`${styles.action_button} ${styles.add_button}`}
                          onClick={handle_show_modal}
                        >
                          <p>
                            Добавить{" "}
                            {kind === "genres" ? "жанры" : "настроения"}
                          </p>
                          <TiPlus className={styles.action_icon} />
                        </div>
                      )}
                      {add_modal_visible && (
                        <>
                          <div
                            className={`${styles.action_button} ${styles.confirm_button}`}
                            onClick={try_to_add_item}
                          >
                            <p>Добавить</p>
                            <TiPlus className={styles.action_icon} />
                          </div>
                          <div
                            className={`${styles.action_button} ${styles.cancel_button}`}
                            onClick={handle_cancel_click}
                          >
                            <p>Отмена</p>
                            <FaXmark className={styles.action_icon} />
                          </div>
                        </>
                      )}
                      {checked_items.length !== 0 && (
                        <div
                          className={`${styles.action_button} ${styles.delete_button}`}
                          onClick={try_to_delete}
                        >
                          <p>
                            Удалить {kind === "genres" ? "жанры" : "настроения"}
                          </p>
                          <FiTrash2 className={styles.action_icon} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditGenresMoods;
