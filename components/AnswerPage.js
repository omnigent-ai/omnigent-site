import Link from "next/link";
import Nav from "./Nav";
import Footer from "./Footer";
import JsonLd from "./JsonLd";
import { getAnswer, answerCheckedLabel } from "@/lib/answers";
import { answerSchema } from "@/lib/answer-schema";
import styles from "./AnswerPage.module.css";

export function AnswerArticle({ answer }) {
  if (answer.sections) return <RichAnswerArticle answer={answer} />;
  return (
    <article className={styles.article} data-pagefind-body>
      <JsonLd data={answerSchema(answer)} />
      <h1>{answer.question}</h1>
      <p className={styles.freshness}>
        {answer.checkedLabel ?? answerCheckedLabel}
      </p>
      <p className={styles.opener}>{answer.answer}</p>
      <p>{answer.explanation}</p>
      {answer.steps && (
        <section aria-labelledby="steps">
          <h2 id="steps">Steps</h2>
          <ol>
            {answer.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}
      <section aria-labelledby="example">
        <h2 id="example">Example</h2>
        <p>{answer.example}</p>
      </section>
      <section aria-labelledby="boundaries">
        <h2 id="boundaries">Boundaries</h2>
        <p>{answer.boundary}</p>
      </section>
      <section aria-labelledby="read-more">
        <h2 id="read-more">Read more</h2>
        <ul>
          {answer.links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export default function AnswerPage({ id, answer }) {
  const selectedAnswer = answer ?? getAnswer(id);
  return (
    <>
      <Nav />
      <main className={`wrap ${styles.page}`}>
        {selectedAnswer.sections ? (
          <nav aria-label="Answer library" className={styles.breadcrumb}>
            <Link href="/answers">All answers</Link>
          </nav>
        ) : (
          <p>
            <Link href="/answers">All answers</Link>
          </p>
        )}
        <AnswerArticle answer={selectedAnswer} />
      </main>
      <Footer />
    </>
  );
}

function AnswerBlock({ block }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "code":
      return (
        <pre>
          <code className={`language-${block.language}`}>{block.text}</code>
        </pre>
      );
    case "links":
      return (
        <ul className={styles.sources}>
          {block.items.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div
          className={styles.tableWrap}
          role="region"
          aria-label="Orchestration approaches compared"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                {block.headers.map((cell) => (
                  <th scope="col" key={cell}>
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map(([label, ...cells]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {cells.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      throw new Error(`Unknown answer block: ${block.type}`);
  }
}

function RichAnswerArticle({ answer }) {
  return (
    <article className={styles.article} data-pagefind-body>
      <JsonLd data={answerSchema(answer)} />
      <h1>{answer.question}</h1>
      <p className={styles.opener}>{answer.answer}</p>
      <p className={styles.freshness}>{answer.checkedLabel}</p>
      {answer.introduction.map((block, i) => (
        <AnswerBlock key={i} block={block} />
      ))}
      {answer.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.question}</h2>
          {section.blocks.map((block, i) => (
            <AnswerBlock key={i} block={block} />
          ))}
        </section>
      ))}
    </article>
  );
}
