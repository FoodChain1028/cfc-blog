const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return "https://foodchain.dev/blogs";
  }
  return "http://localhost:3000";
};

export const siteMetaData = {
  siteName: "Jeff Chung's Blog",
  siteUrl: getBaseUrl(),
  authorName: "Jeff Chung",
  twitterUserName: "@zk_foodchain",
  githubUserName: "FoodChain1028",
  siteDescription: "Jeff Chung's Blog",
};

export const rssData = {
  rssTitle: `${siteMetaData.siteName}`,
  rssDescription: "Jeff Chung's Blog",
  rssFeedUrl: `${siteMetaData.siteUrl}/rss`,
  rssSiteUrl: `${siteMetaData.siteUrl}`,
  rssLanguage: "en",
  rssAuthorName: `${siteMetaData.authorName}`,
  rssCategories: ["Tech", "Programming", "Web Development", "Blockchain"],
};
