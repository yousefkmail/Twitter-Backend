const ReadHashtags = (sentence) => {
  let hashtags = sentence.split(" ").filter((v) => v.startsWith("#"));
  return hashtags;
};

module.exports = { ReadHashtags };
