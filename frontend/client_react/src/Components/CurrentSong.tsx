import styles from "./CurrentSong.module.scss";
import { BsPlayCircle, BsPauseCircle } from "react-icons/bs";
import { ColorThemes, ISong } from "../types";
import { FC } from "react";
import { RootState } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { set_current_song_playing } from "../state/current_song_data_slice";
import { format_price } from "../helpers";
import BuyWidget from "./BuyWidget";
interface CurrentSongProps {
  song: ISong | undefined;
  hideInfo: (id: null) => void;
}

const img_shadow_rgba = {
  light: "rgba(0, 0, 0, 0.3)",
  dark: "rgba(255, 255, 255, 0.2)",
};

const CurrentSong: FC<CurrentSongProps> = (props) => {
  const color_theme = useSelector<RootState, ColorThemes>(
    (state) => state.color_theme.theme
  );
  const current_song_id = useSelector<RootState, number>(
    (state) => state.current_song_data.id
  );
  const current_song_playing = useSelector<RootState, boolean>(
    (state) => state.current_song_data.is_palying
  );
  const dispatch = useDispatch();

  function lyric_format(lyric: string): string[] {
    return lyric.split("\n");
  }

  function handle_playback_click() {
    dispatch(set_current_song_playing(!current_song_playing));
  }

  return (
    <>
      {!props.song ? (
        ""
      ) : (
        <>
          <div className={styles.current_song_section}>
            <div className={styles.image_section}>
              <div>
                <div
                  className={styles.image_wrapper}
                  style={{
                    boxShadow: `0 0 1rem ${
                      color_theme === "White"
                        ? img_shadow_rgba.light
                        : img_shadow_rgba.dark
                    }`,
                  }}
                >
                  <img
                    src={props.song.cover_url}
                    alt="cover"
                    draggable={false}
                  />
                  {current_song_id === props.song.id && (
                    <>
                      {!current_song_playing ? (
                        <BsPlayCircle
                          className={styles.playpause_icon}
                          onClick={handle_playback_click}
                        />
                      ) : (
                        <BsPauseCircle
                          className={styles.playpause_icon}
                          onClick={handle_playback_click}
                        />
                      )}
                    </>
                  )}
                </div>
                <p className={styles.name}>{props.song.name}</p>
              </div>
              <div className={styles.buy_widget_pos1}>
                <BuyWidget price={props.song.price} />
              </div>
            </div>
            <div className={styles.meta_info}>
              <div className={styles.general}>
                <p className={styles.info_header}>Общая информация</p>
                <div className={styles.stats}>
                  <div className={styles.stat_unit}>
                    <p className={styles.stat_type}>Пол</p>
                    <p className={styles.stat_value}>
                      {props.song.sex === "female" ? "Женский" : "Мужской"}
                    </p>
                  </div>
                  <div className={styles.stat_unit}>
                    <p className={styles.stat_type}>Жанр</p>
                    <p className={styles.stat_value}>
                      {props.song.primary_genre}
                    </p>
                  </div>
                  <div className={styles.stat_unit}>
                    <p className={styles.stat_type}>Настроение</p>
                    <p className={styles.stat_value}>{props.song.moods[0]}</p>
                  </div>
                  <div className={styles.stat_unit}>
                    <p className={styles.stat_type}>Цена</p>
                    <p className={styles.stat_value}>
                      {format_price(props.song.price)}₽
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.text_section}>
                <p className={styles.info_header}>Текст песни</p>
                <div className={`${styles.text}`}>
                  {lyric_format(props.song.lyric).map((s, idx) => {
                    if (s === "") {
                      return <br key={idx} />;
                    }
                    return <p key={idx}>{s}</p>;
                  })}
                </div>
              </div>
              <div className={styles.buy_widget_pos2}>
                <BuyWidget price={props.song.price} />
              </div>
            </div>
          </div>
          <div
            className={styles.hide_button}
            onClick={() => props.hideInfo(null)}
          >
            скрыть подробную инфромацию
          </div>
        </>
      )}
    </>
  );
};

export default CurrentSong;
