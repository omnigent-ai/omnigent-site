import AnswerPage from "@/components/AnswerPage";
import { getAnswer } from "@/lib/answers";
import { answerMetadata } from "@/lib/answer-schema";

export const metadata = answerMetadata(getAnswer("contextual-policy"));

export default function Page() {
  return <AnswerPage id="contextual-policy" />;
}
