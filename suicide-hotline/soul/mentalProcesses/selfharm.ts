import { html } from "common-tags";
import { ChatMessageRoleEnum, externalDialog, mentalQuery } from "socialagi";
import { MentalProcess, useActions, useProcessManager } from "soul-engine";
import initialProcess from "../initialProcess.js";

const selfharm: MentalProcess = async ({ step: initialStep }) => {
  const { speak, log } = useActions()
  const { setNextProcess } = useProcessManager()

  const { stream, nextStep } = await initialStep.next(
    externalDialog(html`
      - I will not abandon the user
      - I will keep them company until help comes 
      - I will provide them with important resources such as the Suicide Prevention Lifeline at 1-800-273-8255
      - I will encourage them to talk to an adult they trust
    `),
    { stream: true, model: "quality" }
  );
  speak(stream);

  const lastStep = await nextStep
  return lastStep
}

export default selfharm
