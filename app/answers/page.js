import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { answers, answerPath } from "@/lib/answers";
import { pageMeta } from "@/lib/og";
import styles from "@/components/AnswerPage.module.css";

export const metadata = pageMeta(
  "Answers",
  "Common questions about running coding agents together, from what a meta-harness is to setting spending limits.",
  { eyebrow: "Answers", path: "/answers" },
);

export default function Page() {
  return (
    <>
      <Nav />
      <main className={`wrap ${styles.page}`}>
        <article className={styles.article} data-pagefind-body>
          <h1>Answers</h1>
          <p>
            Common questions about running coding agents together, from what a
            meta-harness is to setting spending limits.
          </p>
          <ul>
            {answers.map(({ id, question }) => (
              <li key={id}>
                <Link href={answerPath(id)}>{question}</Link>
              </li>
            ))}
          </ul>
        </article>
      </main>
      <Footer />
    </>
  );
}
