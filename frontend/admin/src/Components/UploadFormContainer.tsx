import { FC, useEffect, useState } from "react";
import UploadFormComponent from "./UploadFormComponent";
import { IStep, ISteps, StepName, SubmitSong, SubmitStatus } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { ISongData } from "../state/song_data_slice";
import useAxios from "../Hooks/APIRequests";
import { API_URL } from "../config";
import { set_song_submit_status } from "../state/song_submit_data_slice";

const UploadFormContainer: FC = () => {
  const [steps, set_steps] = useState<ISteps>({
    step_1: {
      active: true,
      path: "step_1",
    },
    step_2: {
      active: false,
      path: "step_2",
    },
    step_3: {
      active: false,
      path: "step_3",
    },
    step_4: {
      active: false,
      path: "step_4",
    },
  });
  const [current_step, set_current_step] = useState<StepName>("step_1");
  console.log(current_step);
  const audio_url = useSelector<RootState, string>(
    (state) => state.files_url.audio
  );
  const img_url = useSelector<RootState, string>(
    (state) => state.files_url.img
  );
  const song_data = useSelector<RootState, ISongData>(
    (state) => state.song_data
  );
  const song_submit_status = useSelector<RootState, SubmitStatus>(
    (state) => state.song_submit_data.submit_status
  );
  const { fetch_data: submit_song } = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handle_change_step(step: IStep) {
    if (!step.active) {
      return;
    }
    set_current_step(step.path);
    navigate(step.path);
  }

  function fields_not_empty(song: SubmitSong): boolean {
    return Object.values(song).every((value) => value !== "");
  }

  async function try_to_submit() {
    dispatch(set_song_submit_status("pending"));

    const data = JSON.stringify(song_data.song);

    const response = await submit_song({
      method: "POST",
      url: `${API_URL}/protected/song`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });

    if (response?.status === 201) {
      dispatch(set_song_submit_status("success"));
    } else {
      dispatch(set_song_submit_status("error"));
    }
  }

  console.log(song_data.song);

  useEffect(() => {
    if (audio_url && img_url) {
      set_steps((prev) => ({
        ...prev,
        step_2: {
          ...prev.step_2,
          active: true,
        },
        step_3: {
          ...prev.step_3,
          active: true,
        },
      }));
    }
  }, [audio_url, img_url]);

  useEffect(() => {
    if (fields_not_empty(song_data.song)) {
      set_steps((prev) => ({
        ...prev,
        step_4: {
          ...prev.step_4,
          active: true,
        },
      }));
    } else {
      set_steps((prev) => ({
        ...prev,
        step_4: {
          ...prev.step_4,
          active: false,
        },
      }));
    }
  }, [song_data.song]);

  useEffect(() => {
    if (location.pathname !== "/upload_new_song/step_1") {
      navigate("step_1");
    }
  }, []);

  useEffect(() => {
    const handle_before_unload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handle_before_unload);

    return () => {
      window.removeEventListener("beforeunload", handle_before_unload);
    };
  }, []);

  return (
    <UploadFormComponent
      state={{
        steps: steps,
        current_step: current_step,
        change_step: handle_change_step,
        fields_not_empty: fields_not_empty,
        song: song_data.song,
        submit_song: try_to_submit,
        song_submit_status: song_submit_status,
      }}
    />
  );
};

export default UploadFormContainer;
