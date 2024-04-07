import styles from "./EditGenresMoods.module.scss";
import { FC, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { TiPlus } from "react-icons/ti";
import { FiTrash2 } from "react-icons/fi";
import useAxios from "../Hooks/APIRequests";
import { RequestMethods } from "../types";
import { API_URL } from "../config";
import axios from "axios";

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
  // const { error_data, fetch_data: delete_items } = useAxios();

  function handle_input_change(e: React.ChangeEvent<HTMLInputElement>) {
    const id = e.target.id;

    if (checked_items.includes(id)) {
      set_checked_items((prev) => prev.filter((item) => item !== id));
    } else {
      set_checked_items((prev) => [...prev, id]);
    }
  }

  async function try_to_delete() {
    // const data = JSON.stringify(checked_items);
    // const response = await delete_items(
    //   RequestMethods.Delete,
    //   `${API_URL}/protected/${kind}`,
    //   data
    // );
    // if (response?.status === 200) {
    //   console.log(response);
    // }
    try {
      const response = await axios.delete(`${API_URL}/protected/${kind}`, {
        data: JSON.stringify(checked_items),
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
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
                  onChange={handle_input_change}
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
        <div className={styles.action_buttons}>
          <div className={`${styles.button} ${styles.add_button}`}>
            <p>Добавить {kind === "genres" ? "жанры" : "настроения"}</p>
            <TiPlus className={styles.action_icon} />
          </div>
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
