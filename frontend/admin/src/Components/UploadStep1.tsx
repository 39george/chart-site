import styles from "./UploadStep1.module.scss";
import React, { FC, FormEvent, useRef, useState } from "react";
import { FaCirclePlus, FaRegCircleCheck, FaXmark } from "react-icons/fa6";
import { PiFileAudioFill, PiFileImageFill } from "react-icons/pi";
import { API_URL } from "../config";
import { FileParams, PresignedPostForm } from "../types";
import { bytes_to_mb, fileToBlob, transliterate } from "../helpers";
import useAxios from "../Hooks/APIRequests";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { ISongData, set_song_data } from "../state/song_data_slice";
import { set_audio_url, set_img_url } from "../state/files_url_slice";
import {
  set_chosen_audio_params,
  set_chosen_img_params,
} from "../state/chosen_files_slice";

// ───── Custom types ─────────────────────────────────────────────────────── //

enum FileInputNames {
  Audio = "audio",
  Img = "img",
}

interface PresignedForms {
  [FileInputNames.Audio]: PresignedPostForm;
  [FileInputNames.Img]: PresignedPostForm;
}

interface UploadData {
  [FileInputNames.Audio]: {
    file_selecting: boolean;
    selected_file: File | null;
    upload_button_visible: boolean;
    progress_bar_visible: boolean;
    upload_progress: number;
  };
  [FileInputNames.Img]: {
    file_selecting: boolean;
    selected_file: File | null;
    upload_button_visible: boolean;
    progress_bar_visible: boolean;
    upload_progress: number;
  };
}

interface Dragging {
  [FileInputNames.Audio]: boolean;
  [FileInputNames.Img]: boolean;
}

interface ErrorMessages {
  [FileInputNames.Audio]: string;
  [FileInputNames.Img]: string;
}

// ───── Component ────────────────────────────────────────────────────────── //

const UploadStep1: FC = () => {
  // Consts declarations
  const [upload_data, set_upload_data] = useState<UploadData>({
    audio: {
      file_selecting: false,
      selected_file: null,
      upload_button_visible: false,
      progress_bar_visible: false,
      upload_progress: 0,
    },
    img: {
      file_selecting: false,
      selected_file: null,
      upload_button_visible: false,
      progress_bar_visible: false,
      upload_progress: 0,
    },
  });
  const [dragging, set_dragging] = useState<Dragging>({
    audio: false,
    img: false,
  });
  const [err_messages, set_err_messages] = useState<ErrorMessages>({
    audio: "",
    img: "",
  });
  const presigned_post_forms = useRef<PresignedForms>({
    audio: {
      url: "",
      fields: {
        policy: "",
        "X-Amz-Credential": "",
        "X-Amz-Date": "",
        "X-Amz-Algorithm": "",
        success_action_status: "",
        bucket: "",
        key: "",
        "Content-Type": "",
        "X-Amz-Signature": "",
        "Content-Disposition": "",
      },
    },
    img: {
      url: "",
      fields: {
        policy: "",
        "X-Amz-Credential": "",
        "X-Amz-Date": "",
        "X-Amz-Algorithm": "",
        success_action_status: "",
        bucket: "",
        key: "",
        "Content-Type": "",
        "X-Amz-Signature": "",
        "Content-Disposition": "",
      },
    },
  });
  const audio_input_ref = useRef<HTMLInputElement>(null);
  const img_input_ref = useRef<HTMLInputElement>(null);

  const audio_params = useSelector<RootState, FileParams>(
    (state) => state.chosen_file.audio
  );
  const img_params = useSelector<RootState, FileParams>(
    (state) => state.chosen_file.img
  );
  const audio_url = useSelector<RootState, string>(
    (state) => state.files_url.audio
  );
  const img_url = useSelector<RootState, string>(
    (state) => state.files_url.img
  );

  const song_data = useSelector<RootState, ISongData>(
    (state) => state.song_data
  );

  const { fetch_data: fetch_upload_form } = useAxios();
  const { fetch_data: fetch_presigned_post_form } = useAxios();
  const dispatch = useDispatch();

  // Handle input change
  function handle_input_chage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    const name: FileInputNames = e.target.name as FileInputNames;

    // Reset previous error message and upload data
    set_err_messages((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (files?.length === 0) {
      return;
    }

    if (files) {
      // Showing loader while file is uploading to borwser
      set_upload_data((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          file_selecting: true,
        },
      }));

      // Handling multiple chosen files
      if (files.length > 1) {
        set_err_messages((prev) => ({
          ...prev,
          [name]: "Пожалуйста, выберите один файл",
        }));

        return;
      }

      // Handling single file
      const file = files[0];

      if (check_file_size(name, file)) {
        // Setting upload data
        set_upload_data((prev) => ({
          ...prev,
          [name]: {
            ...prev[name],
            file_selecting: false,
            selected_file: file,
            upload_button_visible: true,
          },
        }));
        // Setting file params
        switch (name) {
          case FileInputNames.Audio:
            dispatch(
              set_chosen_audio_params({
                media_type: file.type,
                file_name: transliterate(file.name),
              })
            );
            break;
          case FileInputNames.Img:
            dispatch(
              set_chosen_img_params({
                media_type: file.type,
                file_name: transliterate(file.name),
              })
            );
            break;
        }
      }
    } else {
      // Hiding loader if browser wasn't able to read the files
      set_upload_data((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          file_selecting: false,
        },
      }));
      alert(
        "Что-то пошло не так, попробуйте обновить страницу и попробовать еще раз"
      );
    }
  }

  // Drag and drop logic
  // TODO check strange behaviour of drag over event (many rerenderes)
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
    // TODO handle multiple files drop
    const file = e.dataTransfer?.files[0];

    // Handle unexpected error on failing to read file
    if (!file) {
      alert(
        "Что-то пошло не так, попробуйте обновить страницу и попробовать еще раз"
      );
    }

    // Handle wrong input file type
    if (check_file_type_correctness(input_name, file)) {
      if (check_file_size(input_name, file)) {
        // Setting upload data
        set_upload_data((prev) => ({
          ...prev,
          [input_name]: {
            ...prev[input_name],
            file_selecting: false,
            selected_file: file,
            upload_button_visible: true,
          },
        }));
        // Setting file params
        switch (input_name) {
          case FileInputNames.Audio:
            dispatch(
              set_chosen_audio_params({
                media_type: file.type,
                file_name: transliterate(file.name),
              })
            );
            break;
          case FileInputNames.Img:
            dispatch(
              set_chosen_img_params({
                media_type: file.type,
                file_name: transliterate(file.name),
              })
            );
            break;
        }
      }
    }
  }

  // Checking for a correct dropped file type
  function check_file_type_correctness(
    input_name: FileInputNames,
    file: File
  ): boolean {
    if (input_name === "audio" && file.type !== "audio/mpeg") {
      set_err_messages((prev) => ({
        ...prev,
        [input_name]: "Неверный формат аудио. Пожалуйста, выберите файл .mp3",
      }));
      return false;
    } else if (input_name === "img" && file.type !== "image/jpeg") {
      set_err_messages((prev) => ({
        ...prev,
        [input_name]:
          "Неверный формат изображения. Пожалуйста, выберите файл .jpeg",
      }));
      return false;
    } else {
      set_err_messages((prev) => ({
        ...prev,
        [input_name]: "",
      }));
      return true;
    }
  }

  // Check file size func
  function check_file_size(input_name: FileInputNames, file: File): boolean {
    if (input_name === "img" && bytes_to_mb(file) > 2) {
      set_err_messages((prev) => ({
        ...prev,
        [input_name]: "Файл должен быть не больше 2 MB",
      }));
      set_upload_data((prev) => ({
        ...prev,
        [input_name]: {
          ...prev[input_name],
          file_selecting: false,
        },
      }));
      return false;
    } else if (input_name === "audio" && bytes_to_mb(file) > 15) {
      set_err_messages((prev) => ({
        ...prev,
        [input_name]: "Файл должен быть не больше 15 MB",
      }));
      set_upload_data((prev) => ({
        ...prev,
        [input_name]: {
          ...prev[input_name],
          file_selecting: false,
        },
      }));
      return false;
    }
    return true;
  }

  // Helper func to check if values not empty
  function values_not_empty(obj: FileParams): boolean {
    return Object.values(obj).every((val) => val !== "");
  }

  // Handle unselect file
  function unselect_file(e: React.MouseEvent, name: FileInputNames) {
    e.preventDefault();
    // Reset file input value
    switch (name) {
      case FileInputNames.Audio:
        if (audio_input_ref.current) {
          audio_input_ref.current.value = "";
        }
        dispatch(set_audio_url(""));
        dispatch(
          set_chosen_audio_params({
            media_type: "",
            file_name: "",
          })
        );
        break;
      case FileInputNames.Img:
        if (img_input_ref.current) {
          img_input_ref.current.value = "";
        }
        dispatch(set_img_url(""));
        dispatch(
          set_chosen_img_params({
            media_type: "",
            file_name: "",
          })
        );
        break;
    }
    // Reset data state
    set_upload_data((prev) => ({
      ...prev,
      [name]: {
        file_selecting: false,
        selected_file: null,
        upload_button_visible: false,
        progress_bar_visible: false,
        upload_progress: 0,
      },
    }));
  }

  // API requests
  async function submit_data(
    e: FormEvent<HTMLFormElement>,
    name: FileInputNames
  ) {
    e.preventDefault();

    await fetch_data(name);

    let form_data = new FormData();
    for (let key in presigned_post_forms.current[name].fields) {
      form_data.append(
        key,
        presigned_post_forms.current[name].fields[
          key as keyof PresignedPostForm["fields"]
        ]
      );
    }

    const blob = await fileToBlob(upload_data[name].selected_file as File);
    form_data.append("file", blob);

    await post_data(form_data, name);
  }

  async function fetch_data(name: FileInputNames) {
    let search_params: string = "";
    switch (name) {
      case FileInputNames.Audio:
        search_params = new URLSearchParams(audio_params).toString();
        break;
      case FileInputNames.Img:
        search_params = new URLSearchParams(img_params).toString();
        break;
    }
    // new URLSearchParams(file_params.current[name]).toString();
    const response = await fetch_upload_form({
      method: "GET",
      url: `${API_URL}/protected/upload_form?${search_params}`,
    });
    if (response?.status === 200) {
      presigned_post_forms.current = {
        ...presigned_post_forms.current,
        [name]: {
          ...response?.data,
        },
      };
    }
  }

  async function post_data(form_data: FormData, name: FileInputNames) {
    // Set progress bar visible
    set_upload_data((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        progress_bar_visible: true,
        upload_button_visible: false,
      },
    }));

    const response = await fetch_presigned_post_form({
      method: "POST",
      url: presigned_post_forms.current[name].url,
      data: form_data,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          set_upload_data((prev) => ({
            ...prev,
            [name]: {
              ...prev[name],
              upload_progress: progress,
            },
          }));
        }
      },
    });

    if (response?.status === 200) {
      switch (name) {
        case FileInputNames.Audio:
          dispatch(
            set_song_data({
              ...song_data.song,
              audio_object_key: presigned_post_forms.current[name].fields.key,
            })
          );
          dispatch(
            set_audio_url(URL.createObjectURL(form_data.get("file") as Blob))
          );
          break;
        case FileInputNames.Img:
          dispatch(
            set_song_data({
              ...song_data.song,
              cover_object_key: presigned_post_forms.current[name].fields.key,
            })
          );
          dispatch(
            set_img_url(URL.createObjectURL(form_data.get("file") as Blob))
          );
          break;
      }
    }
  }

  // TODO Setting error messages based on api response
  // useEffect(() => {}, [upload_form_error, presigned_post_form_error]);

  // Rendering component
  return (
    <div className={styles.step_1}>
      <div className={styles.upload_auido}>
        <p className={styles.input_name}>Трек одним файлом в формате .mp3</p>
        <p className={styles.input_description}>
          Master файл, который будет отображаться на основной странице. Файл
          должен быть в формате mp3, 44100 hz, 320 kbps и весить не более 15MB
        </p>
        <form
          onSubmit={(e) => submit_data(e, FileInputNames.Audio)}
          className={`${styles.form} ${styles.form_audio}`}
        >
          <label
            htmlFor="audio_input"
            className={`${styles.custom_input} ${styles.custom_input_audio} ${
              dragging[FileInputNames.Audio] && styles.custom_input_dragging
            } ${
              values_not_empty(audio_params) &&
              styles.custom_input_file_selected_audio
            }`}
            onDragOver={(e) => handle_drag_over(e, FileInputNames.Audio)}
            onDragLeave={(e) => handle_drag_leave(e, FileInputNames.Audio)}
            onDrop={(e) => handle_file_drop(e, FileInputNames.Audio)}
          >
            {values_not_empty(audio_params) ? (
              <>
                <FaXmark
                  onClick={(e) => unselect_file(e, FileInputNames.Audio)}
                  className={styles.unselect_file_icon}
                />
                <PiFileAudioFill className={styles.icon_audio} />
                <p>{audio_params.file_name}</p>
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
            ref={audio_input_ref}
            id="audio_input"
            name={FileInputNames.Audio}
            type="file"
            accept=".mp3"
            disabled={values_not_empty(audio_params)}
            style={{
              display: "none",
            }}
            onChange={handle_input_chage}
          />
          {upload_data.audio.file_selecting && (
            <div className={styles.loader_small}></div>
          )}
          {upload_data.audio.upload_button_visible && (
            <button
              type="submit"
              className={styles.submit_button}
            >
              Загрузить аудио
            </button>
          )}
          {upload_data.audio.progress_bar_visible && (
            <div className={styles.upload_info}>
              <div>
                <p
                  className={styles.upload_status}
                >{`Загружено ${upload_data.audio.upload_progress}%`}</p>
                <div className={styles.progress_bar_track}>
                  <div
                    className={styles.progress_bar_thumb}
                    style={{
                      width: `${upload_data.audio.upload_progress}%`,
                    }}
                  ></div>
                </div>
              </div>
              {upload_data.audio.upload_progress === 100 && (
                <FaRegCircleCheck className={styles.checkmark} />
              )}
            </div>
          )}
          {audio_url && (
            <audio
              controls
              className={styles.audio_player}
              src={audio_url}
            />
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
        <form
          onSubmit={(e) => submit_data(e, FileInputNames.Img)}
          className={`${styles.form} ${styles.form_img}`}
        >
          <label
            htmlFor="img_input"
            className={`${styles.custom_input} ${styles.custom_input_img} ${
              dragging[FileInputNames.Img] && styles.custom_input_dragging
            } ${
              values_not_empty(img_params) &&
              styles.custom_input_file_selected_img
            } ${img_url && styles.custom_input_image_uploaded}`}
            onDragOver={(e) => handle_drag_over(e, FileInputNames.Img)}
            onDragLeave={(e) => handle_drag_leave(e, FileInputNames.Img)}
            onDrop={(e) => handle_file_drop(e, FileInputNames.Img)}
          >
            {img_url && (
              <div className={styles.image_wrapper}>
                <img
                  src={img_url}
                  alt="cover"
                />
              </div>
            )}
            {values_not_empty(img_params) ? (
              <>
                <FaXmark
                  onClick={(e) => unselect_file(e, FileInputNames.Img)}
                  className={styles.unselect_file_icon}
                />
                <PiFileImageFill className={styles.icon_img} />
                <p>{img_params.file_name}</p>
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
            ref={img_input_ref}
            id="img_input"
            name={FileInputNames.Img}
            type="file"
            accept=".jpg"
            disabled={values_not_empty(img_params)}
            style={{
              display: "none",
            }}
            onChange={handle_input_chage}
          />
          {upload_data.img.file_selecting && (
            <div className={styles.loader_small}></div>
          )}
          {upload_data.img.upload_button_visible && (
            <button
              type="submit"
              className={styles.submit_button}
            >
              Загрузить изображение
            </button>
          )}
          {upload_data.img.progress_bar_visible && (
            <div className={styles.upload_info}>
              <div>
                <p
                  className={styles.upload_status}
                >{`Загружено ${upload_data.img.upload_progress}%`}</p>
                <div className={styles.progress_bar_track}>
                  <div
                    className={styles.progress_bar_thumb}
                    style={{
                      width: `${upload_data.img.upload_progress}%`,
                    }}
                  ></div>
                </div>
              </div>
              {upload_data.img.upload_progress === 100 && (
                <FaRegCircleCheck className={styles.checkmark} />
              )}
            </div>
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
