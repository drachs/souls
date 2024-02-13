import { externalDialog, mentalQuery } from "socialagi";
import { MentalProcess, useActions, useProcessManager } from "soul-engine";
import shouts from "./mentalProcesses/shouts.js";
import selfharm from "./mentalProcesses/selfharm.js";

const gainsTrustWithTheUser: MentalProcess = async ({ step: initialStep }) => {
  const { speak, log } = useActions()
  const { setNextProcess } = useProcessManager()

  const { stream, nextStep } = await initialStep.next(
    externalDialog("Talk to the user trying to gain trust and learn about their inner world."),
    { stream: true, model: "quality" }
  );
  speak(stream);

  const lastStep = await nextStep
  
  let shouldEngageSelfHarmModePromise = lastStep.compute(
    mentalQuery("The user expressed a desire to hurt themselves?  Not merely sadness, or depression, but a suicidal ideation."),
    { model: "quality" }
  )

  const shouldEngageSelfHarmMode = await shouldEngageSelfHarmModePromise

  log("Self Harm detected?", shouldEngageSelfHarmMode)
  if (shouldEngageSelfHarmMode) {
      log("Informing oncall triage staff of possible self harm ideation")
    setNextProcess(selfharm)
  }
  return lastStep
}

export default gainsTrustWithTheUser
