import styles from "./UploadStep4.module.scss";
import { FC, useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { format_price } from "../helpers";
import { ISongData } from "../state/song_data_slice";
import { RootState } from "../state/store";
import { useSelector } from "react-redux";

interface UploadStep4Props {
  song_data: ISongData;
}
function lyric_format(lyric: string): string[] {
  return lyric.split("\n");
}

const UploadStep4: FC<UploadStep4Props> = ({ song_data }) => {
  const [expanded, set_expanded] = useState(false);
  const img_url = useSelector<RootState, string>(
    (state) => state.files_url.img
  );

  return (
    <div className={styles.upload_step_4}>
      <p className={styles.header}>Предпросмотр</p>
      <div className={styles.content}>
        <div className={styles.img_and_price}>
          <div className={styles.image_wrapper}>
            <img
              src={img_url}
              alt="cover"
              draggable={false}
            />
          </div>
          <div className={styles.price}>
            {format_price(song_data.song.price)}₽
          </div>
        </div>
        <div className={styles.main_meta}>
          <p className={styles.name}>{song_data.song.name}</p>
          <div className={styles.stats}>
            <div className={styles.main_stats}>
              <div className={styles.stat_unit}>
                <p className={styles.stat_type}>Пол:&nbsp;&nbsp;</p>
                <p className={styles.stat_value}>
                  {song_data.song.sex === "male" ? "Мужской" : "Женский"}
                </p>
              </div>
              <div className={styles.stat_unit}>
                <p className={styles.stat_type}>Жанр:&nbsp;&nbsp;</p>
                <p className={styles.stat_value}>
                  {song_data.song.primary_genre}
                </p>
              </div>
              <div className={styles.stat_unit}>
                <p className={styles.stat_type}>Настроение:&nbsp;&nbsp;</p>
                <p className={styles.stat_value}>{song_data.song.moods[0]}</p>
              </div>
            </div>
            {song_data.song.rating && (
              <div className={styles.stat_unit}>
                <p className={styles.stat_type}>Рейтинг:&nbsp;&nbsp;</p>
                <p className={styles.stat_value}>{song_data.song.rating}</p>
              </div>
            )}
          </div>
          <div className={styles.text_section}>
            <p className={styles.text_header}>Текст песни</p>
            <div
              className={`${styles.text} ${expanded && styles.text_expanded}`}
            >
              {lyric_format(song_data.song.lyric).map((line, idx) => {
                if (line === "") {
                  return <br key={idx} />;
                } else {
                  return <p key={idx}>{line}</p>;
                }
              })}
            </div>
            <div
              className={`${styles.expand_button} ${
                expanded && styles.button_expanded
              }`}
              onClick={() => set_expanded(!expanded)}
            >
              <p>{!expanded ? "развернуть" : "свернуть"}</p>
              <HiOutlineChevronDown className={styles.chevron} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStep4;
