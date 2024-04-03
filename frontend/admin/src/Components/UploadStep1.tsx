import styles from "./UploadStep1.module.scss";
import React, { FC, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { PiFileAudioFill, PiFileImageFill } from "react-icons/pi";

enum FileInputNames {
  Audio = "audio",
  Img = "img",
}

interface SelectedFiles {
  audio: File | null;
  img: File | null;
}

interface Dragging {
  [FileInputNames.Audio]: boolean;
  [FileInputNames.Img]: boolean;
}

interface ErrorMessages {
  [FileInputNames.Audio]: string;
  [FileInputNames.Img]: string;
}

const UploadStep1: FC = () => {
  const [submit_buttons_visible, set_submit_buttons_visible] = useState({
    audio_button: false,
    img_button: false,
  });
  const [dragging, set_dragging] = useState<Dragging>({
    audio: false,
    img: false,
  });
  const [selected_files, set_selected_files] = useState<SelectedFiles>({
    audio: null,
    img: null,
  });
  const [err_messages, set_err_messages] = useState<ErrorMessages>({
    audio: "",
    img: "",
  });

  function handle_input_chage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    const name: FileInputNames = e.target.name as FileInputNames;

    if (files) {
      switch_input_name(name, files[0]);
    }
  }

  function handle_drag_over(
    e: React.DragEvent<HTMLLabelElement>,
    input_name: FileInputNames
  ) {
    e.preventDefault();
    set_dragging((prev) => ({
      ...prev,
      [input_name]: true,
    }));
  }

  function handle_drag_leave(
    e: React.DragEvent<HTMLLabelElement>,
    input_name: FileInputNames
  ) {
    e.preventDefault();
    set_dragging((prev) => ({
      ...prev,
      [input_name]: false,
    }));
  }

  function handle_file_drop(
    e: React.DragEvent<HTMLLabelElement>,
    input_name: FileInputNames
  ) {
    e.preventDefault();
    set_dragging((prev) => ({
      ...prev,
      [input_name]: false,
    }));
    const file = e.dataTransfer?.files[0];

    // Handle unexpted error on failing to read file
    if (!file) {
      alert(
        "Что-то пошло не так, попробуйте обновить страницу и попробовать еще раз"
      );
    }

    // Handle wrong input file type
    if (input_name === "audio" && file.type !== "audio/mpeg") {
      set_err_messages((prev) => ({
        ...prev,
        [input_name]: "Неверный формат аудио. Пожалуйста, выберите файл .mp3",
      }));
    } else if (input_name === "img" && file.type !== "image/jpeg") {
      set_err_messages((prev) => ({
        ...prev,
        [input_name]:
          "Неверный формат изображения. Пожалуйста, выберите файл .jpeg",
      }));
    } else {
      set_err_messages((prev) => ({
        ...prev,
        [input_name]: "",
      }));
      switch_input_name(input_name, file);
    }
  }

  // Helper switching input name func
  function switch_input_name(input_name: FileInputNames, file: File) {
    switch (input_name) {
      case FileInputNames.Audio:
        set_submit_buttons_visible((prev) => ({
          ...prev,
          audio_button: true,
        }));
        set_selected_files((prev) => ({
          ...prev,
          audio: file,
        }));
        break;
      case FileInputNames.Img:
        set_submit_buttons_visible((prev) => ({
          ...prev,
          img_button: true,
        }));
        set_selected_files((prev) => ({
          ...prev,
          img: file,
        }));
        break;
      default:
        alert(
          "Что-то пошло не так, попробуйте обновить страницу и попробовать еще раз"
        );
    }
  }

  return (
    <div className={styles.step_1}>
      <div className={styles.upload_auido}>
        <p className={styles.input_name}>Трек одним файлом в формате .mp3</p>
        <p className={styles.input_description}>
          Master файл, который будет отображаться на основной странице. Файл
          должен быть в формате mp3, 44100 hz, 320 kbps и весить не более 15MB
        </p>
        <form className={`${styles.form} ${styles.form_audio}`}>
          <label
            htmlFor="audio_input"
            className={`${styles.custom_input} ${styles.custom_input_audio} ${
              dragging[FileInputNames.Audio] && styles.custom_input_dragging
            } ${
              selected_files.audio && styles.custom_input_file_selected_audio
            }`}
            onDragOver={(e) => handle_drag_over(e, FileInputNames.Audio)}
            onDragLeave={(e) => handle_drag_leave(e, FileInputNames.Audio)}
            onDrop={(e) => handle_file_drop(e, FileInputNames.Audio)}
          >
            {selected_files.audio ? (
              <>
                <PiFileAudioFill className={styles.icon_audio} />
                <p>{selected_files.audio.name}</p>
              </>
            ) : (
              <>
                <p>
                  {dragging[FileInputNames.Audio]
                    ? "Бросайте здесь!"
                    : "Перетащите или выберите аудио"}
                </p>
                <FaCirclePlus className={styles.plus_icon} />
              </>
            )}
          </label>
          <input
            id="audio_input"
            name={FileInputNames.Audio}
            type="file"
            accept=".mp3"
            style={{
              display: "none",
            }}
            onChange={handle_input_chage}
          />
          {submit_buttons_visible.audio_button && (
            <button
              type="submit"
              className={styles.submit_button}
            >
              Загрузить аудио
            </button>
          )}
        </form>
        {err_messages[FileInputNames.Audio] && (
          <p className={styles.err_message}>
            {err_messages[FileInputNames.Audio]}
          </p>
        )}
      </div>
      <div className={styles.upload_cover}>
        <p className={styles.input_name}>Обложка трека в формате .jpeg</p>
        <p className={styles.input_description}>
          Обложка вашего трека. Файл должен быть в формате .jpeg. Минимальный
          размер обложки - 600 x 600, максимальный размер файла - 2MB
        </p>
        <form className={`${styles.form} ${styles.form_audio}`}>
          <label
            htmlFor="img_input"
            className={`${styles.custom_input} ${styles.custom_input_img} ${
              dragging[FileInputNames.Img] && styles.custom_input_dragging
            } ${selected_files.img && styles.custom_input_file_selected_img}`}
            onDragOver={(e) => handle_drag_over(e, FileInputNames.Img)}
            onDragLeave={(e) => handle_drag_leave(e, FileInputNames.Img)}
            onDrop={(e) => handle_file_drop(e, FileInputNames.Img)}
          >
            {selected_files.img ? (
              <>
                <PiFileImageFill className={styles.icon_img} />
                <p>{selected_files.img.name}</p>
              </>
            ) : (
              <>
                <p>
                  {dragging[FileInputNames.Img]
                    ? "Бросайте здесь!"
                    : "Перетащите или выберите изображение"}
                </p>
                <FaCirclePlus className={styles.plus_icon} />
              </>
            )}
          </label>
          <input
            id="img_input"
            name={FileInputNames.Img}
            type="file"
            accept=".jpeg"
            style={{
              display: "none",
            }}
            onChange={handle_input_chage}
          />
          {submit_buttons_visible.img_button && (
            <button
              type="submit"
              className={styles.submit_button}
            >
              Загрузить изображение
            </button>
          )}
        </form>
        {err_messages[FileInputNames.Img] && (
          <p className={styles.err_message}>
            {err_messages[FileInputNames.Img]}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadStep1;
