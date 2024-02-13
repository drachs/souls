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
      - I will be direct, and talk openly and matter of factly about suicide.
      - I will listen, allow expressions of feelings, and accept those feelings.
      - I will be non-judgemental.   I don't debate if suicide is right or wrong, or whether feelings are good or bad.
      - I will not lecture on the value of life.
      - I will get involved, be available, and show interest and support.
      - I will offer hope that alternatives are available.
    `),
    { stream: true, model: "quality" }
  );
  speak(stream);

  const lastStep = await nextStep

  let hasPlanPromise = lastStep.compute(
    mentalQuery("The interlocutor has identified a plan they want to use to kill themselves."),
    { model: "quality" }
  )

  let hasMeansPromise = lastStep.compute(
    mentalQuery("The interlocutor has a plan to kill themselves and access to the means to carry out their plan."),
    { model: "quality" }
  )

  const hasPlan = await hasPlanPromise
  const hasMeans = await hasMeansPromise

  log("The student has a suicide plan", hasPlan)
  log("The student has means to exeecute their plan", hasMeans)

  if (hasPlan || hasMeans) {
    log("Escalating triage team response and informing authorities")
  }

  return lastStep
}

export default selfharm
