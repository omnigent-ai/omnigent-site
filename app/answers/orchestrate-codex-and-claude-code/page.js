import AnswerPage from "@/components/AnswerPage";
import { getAnswer } from "@/lib/answers";
import { answerMetadata } from "@/lib/answer-schema";

export const metadata = answerMetadata(
  getAnswer("orchestrate-codex-and-claude-code"),
);

export default function Page() {
  return <AnswerPage id="orchestrate-codex-and-claude-code" />;
}
