import { absoluteUrl, WEBSITE_ID, ORGANIZATION_ID } from "./structured-data";
import { answerPath, answerText, answerCheckedDate } from "./answers";
import { pageMeta } from "./og";

export function answerMetadata(answer) {
  return pageMeta(answer.title ?? answer.question, answer.summary, {
    eyebrow: "Answers",
    absoluteTitle: Boolean(answer.title),
    path: answerPath(answer.id),
  });
}

export function answerSchema(answer) {
  const url = absoluteUrl(answerPath(answer.id));
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: answer.question,
    description: answer.answer,
    inLanguage: "en",
    dateModified: answer.checkedDate ?? answerCheckedDate,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: answer.question,
      author: { "@id": ORGANIZATION_ID },
      publisher: { "@id": ORGANIZATION_ID },
      dateModified: answer.checkedDate ?? answerCheckedDate,
      description: answer.answer,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      articleBody: answerText(answer),
    },
  };
}
