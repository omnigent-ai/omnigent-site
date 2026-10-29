import AnswerPage from "@/components/AnswerPage";
import { getAnswer } from "@/lib/answers";
import { answerMetadata } from "@/lib/answer-schema";

export const metadata = answerMetadata(
  getAnswer("schedule-recurring-agent-tasks"),
);

export default function Page() {
  return <AnswerPage id="schedule-recurring-agent-tasks" />;
}
