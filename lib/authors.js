const AUTHORS = {
  "daniel liden": {
    avatar: "/images/authors/daniel-liden.jpg",
    href: "https://www.linkedin.com/in/danielliden/",
  },
};

export function getAuthorProfile(author) {
  if (!author) return null;
  return AUTHORS[author.trim().toLowerCase()] || null;
}
