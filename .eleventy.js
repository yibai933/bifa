module.exports = function (eleventyConfig) {
  // 静态资源直通：CSS / JS / 图片等原样复制到 _site
  eleventyConfig.addPassthroughCopy({ "src/css": "css", "src/js": "js", "src/assets": "assets" });

  // 文章集合：src/articles/*.md，按日期倒序
  eleventyConfig.addCollection("articles", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/articles/*.md")
      .sort((a, b) => (b.data.date || 0) - (a.data.date || 0));
  });

  // 技能集合：src/skills/*.md，按文件顺序
  eleventyConfig.addCollection("skills", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/skills/*.md");
  });

  // 按分类统计文章数（用于"写作方法"目录的每模块计数）
  eleventyConfig.addFilter("countByCategory", function (articles, cat) {
    return articles.filter((a) => a.data.category === cat).length;
  });

  // 按分类筛选文章
  eleventyConfig.addFilter("filterByCategory", function (articles, cat) {
    return articles.filter((a) => a.data.category === cat);
  });

  // 通用按字段筛选：arr | where("featured", true)
  eleventyConfig.addFilter("where", function (arr, key, val) {
    return arr.filter((x) => x.data[key] === val);
  });

  // 取前 N 项
  eleventyConfig.addFilter("limit", function (arr, n) {
    return arr.slice(0, n);
  });

  // 数字千分位（练习人次等）
  eleventyConfig.addFilter("thousands", function (n) {
    return Number(n || 0).toLocaleString("zh-CN");
  });

  // 日期格式化为 YYYY-MM-DD
  eleventyConfig.addFilter("dateFilter", function (d) {
    if (!d) return "";
    var dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt)) return "";
    var y = dt.getFullYear();
    var m = String(dt.getMonth() + 1).padStart(2, "0");
    var day = String(dt.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
