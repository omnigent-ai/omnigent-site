import AnswerPage from "@/components/AnswerPage";
import { getAnswer } from "@/lib/answers";
import { answerMetadata } from "@/lib/answer-schema";

export const metadata = answerMetadata(
  getAnswer("continue-a-session-on-your-phone"),
);

export default function Page() {
  return <AnswerPage id="continue-a-session-on-your-phone" />;
}
