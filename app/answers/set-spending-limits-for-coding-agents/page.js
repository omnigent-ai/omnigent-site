import AnswerPage from "@/components/AnswerPage";
import { getAnswer } from "@/lib/answers";
import { answerMetadata } from "@/lib/answer-schema";

const answer = getAnswer("set-spending-limits-for-coding-agents");
export const metadata = answerMetadata(answer);

export default function Page() {
  return <AnswerPage answer={answer} />;
}
