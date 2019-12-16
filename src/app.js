const program = require('commander');
const fs = require('fs');
const path = require('path');

program.option('-d, --dir <folder>', 'Folder to be traversed.').parse(process.argv);

const walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if(!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      })
    });
  });

  return results;
}

if(program.dir) {
  const folderPath = path.resolve(program.dir);
  console.info(`Checking the contents of ${folderPath} for files and subfolders!`);
  walk(folderPath, (err, results) => {
    if (err) throw err;
    console.log(results);
  });
} else {
  console.error(program.opts());
}

