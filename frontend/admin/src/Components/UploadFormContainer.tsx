import { FC, useEffect, useState } from "react";
import UploadFormComponent from "./UploadFormComponent";
import { IStep, ISteps, StepName } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { FilesUploaded } from "../state/files_uploaded_slice";
import { ISongData } from "../state/song_data_slice";

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
  const location = useLocation();
  const navigate = useNavigate();
  const files_uploaded = useSelector<RootState, FilesUploaded>(
    (state) => state.files_uploaded
  );
  const song_data = useSelector<RootState, ISongData>(
    (state) => state.song_data
  );

  console.log(song_data.song);

  function handle_change_step(step: IStep) {
    if (!step.active) {
      return;
    }
    set_current_step(step.path);
    navigate(step.path);
  }

  useEffect(() => {
    if (files_uploaded.audio && files_uploaded.img) {
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
  }, [files_uploaded]);

  useEffect(() => {
    if (location.pathname !== "/upload_new_song/step_1") {
      navigate("step_1");
    }
  }, []);

  // FIXME this should be uncommented for dev mode
  // useEffect(() => {
  //   const handle_before_unload = (e: BeforeUnloadEvent) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };

  //   window.addEventListener("beforeunload", handle_before_unload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handle_before_unload);
  //   };
  // }, []);

  return (
    <UploadFormComponent
      state={{
        steps: steps,
        current_step: current_step,
        change_step: handle_change_step,
      }}
    />
  );
};

export default UploadFormContainer;
