import { FC, useState } from "react";
import UploadFormComponent from "./UploadFormComponent";
import { CurrentStep } from "../types";

const UploadFormContainer: FC = () => {
  const [current_step, set_current_step] = useState<CurrentStep>(
    CurrentStep.Step_1
  );

  function handle_change_step(step: CurrentStep) {
    set_current_step(step);
  }

  return (
    <UploadFormComponent
      state={{ current_step: current_step, change_step: handle_change_step }}
    />
  );
};

export default UploadFormContainer;
