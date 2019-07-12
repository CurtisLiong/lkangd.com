const fs = require('fs');
const frontMatter = require('front-matter');
// const marked = require('marked');

// const rendererMD = new marked.Renderer();
// const htmlResult = contentBody => {
//   return marked(contentBody, {
//     renderer: rendererMD,
//     gfm: true,
//     tables: true,
//     breaks: true,
//     pedantic: false,
//     sanitize: false,
//     smartLists: true,
//     smartypants: false,
//   });
// };

module.exports = dirPath => {
  const result = {};
  const walker = (dirPath, result) => {
    const dirList = fs.readdirSync(dirPath);
    dirList.forEach(fileName => {
      // '.XXXXX' exception
      if (/^\./.test(fileName)) return;

      const subDirPath = `${dirPath}/${fileName}`;
      const stat = fs.statSync(subDirPath);
      if (stat.isDirectory()) {
        result[fileName] = [];
        walker(subDirPath, result[fileName]);
      } else {
        const file = fs.readFileSync(subDirPath, 'utf8');
        const post = frontMatter(file);

        // post.body = htmlResult(post.body);
        // post.attributes.link = post.link = `/post/${String(Math.round(Math.random() * 1000000000)).slice(0, 7)}`;
        post.attributes.link = post.link = `/post/${fileName.replace(/\..*$/, '')}`;
        result.push(post);
      }
    });
  };
  walker(dirPath, result);
  return result;
};