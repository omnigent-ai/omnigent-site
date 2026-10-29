import AnswerPage from "@/components/AnswerPage";
import { getAnswer } from "@/lib/answers";
import { answerMetadata } from "@/lib/answer-schema";

export const metadata = answerMetadata(
  getAnswer("hand-off-a-session-to-a-teammate"),
);

export default function Page() {
  return <AnswerPage id="hand-off-a-session-to-a-teammate" />;
}
