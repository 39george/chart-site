import styles from "./EditGenresMoods.module.scss";
import { FC, useState } from "react";
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

interface EditGenresMoodsProps {
  kind: "genres" | "moods";
  items_list: string[];
  close_window: () => void;
}

const EditGenresMoods: FC<EditGenresMoodsProps> = ({
  kind,
  items_list,
  close_window,
}) => {
  const [checked_items, set_checked_items] = useState<string[]>([]);
  const [add_modal_visible, set_add_modal_visible] = useState(false);
  const [new_item, set_new_item] = useState<{ item: string }>({
    item: "",
  });
  const [input_empty, set_input_empty] = useState(false);
  const [forbidden_chars_err, set_forbidden_chars_err] = useState("");
  const { fetch_data: delete_items } = useAxios();
  const { fetch_data: add_items } = useAxios();
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
      set_forbidden_chars_err(
        `Пожалуйста, не используйте символы /()"<>\{};: в полях ввода`
      );
      return;
    } else {
      set_forbidden_chars_err("");
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
    set_input_empty(false);
    set_add_modal_visible(false);
  }

  //API requests
  async function try_to_delete() {
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
    }
  }

  async function try_to_add_item() {
    if (!new_item.item) {
      set_input_empty(true);
      return;
    }

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
    }
  }

  return (
    <div className={styles.edit_window}>
      <div className={styles.content}>
        <div
          className={styles.close_icon_container}
          onClick={close_window}
        >
          <FaXmark className={styles.close_icon} />
        </div>
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
              <p className={styles.input_empty}>Поле не должно быть пустым</p>
            )}
            {forbidden_chars_err && (
              <div className={styles.err_message}>{forbidden_chars_err}</div>
            )}
          </div>
        ) : (
          <div className={styles.list_and_options}>
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
                      name={kind === "genres" ? "primary_genre" : "moods"}
                      checked={checked_items.includes(item)}
                      onChange={handle_checkbox_input_change}
                    />
                    <span className={styles.custom_checkbox}></span>
                    <label
                      htmlFor={item}
                      className={styles.input_option}
                    >
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
          </div>
        )}
        <div className={styles.action_buttons}>
          {!add_modal_visible && checked_items.length === 0 && (
            <div
              className={`${styles.button} ${styles.add_button}`}
              onClick={handle_show_modal}
            >
              <p>Добавить {kind === "genres" ? "жанры" : "настроения"}</p>
              <TiPlus className={styles.action_icon} />
            </div>
          )}
          {add_modal_visible && (
            <>
              <div
                className={`${styles.button} ${styles.confirm_button}`}
                onClick={try_to_add_item}
              >
                <p>Добавить</p>
                <TiPlus className={styles.action_icon} />
              </div>
              <div
                className={`${styles.button} ${styles.cancel_button}`}
                onClick={handle_cancel_click}
              >
                <p>Отмена</p>
                <FaXmark className={styles.action_icon} />
              </div>
            </>
          )}
          {checked_items.length !== 0 && (
            <div
              className={`${styles.button} ${styles.delete_button}`}
              onClick={try_to_delete}
            >
              <p>Удалить {kind === "genres" ? "жанры" : "настроения"}</p>
              <FiTrash2 className={styles.action_icon} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditGenresMoods;
