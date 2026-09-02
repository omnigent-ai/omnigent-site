const AUTHORS = {
  "daniel liden": {
    avatar: "/images/authors/daniel-liden.jpg",
    href: "https://www.linkedin.com/in/danielliden/",
  },
  "yuan tang": {
    avatar: "https://github.com/terrytangyuan.png",
    href: "https://github.com/terrytangyuan",
  },
};

export function getAuthorProfile(author) {
  if (!author) return null;
  return AUTHORS[author.trim().toLowerCase()] || null;
}
