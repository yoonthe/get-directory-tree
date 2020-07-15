#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const gitIgnore = require('dotgitignore')();

const pwd = process.cwd();
const dirName = path.basename(pwd);

const defaultFilters = ['.git', '.gitignore'];

const logDir = (name, dir, blank) => {
  return `${name}
${fs.readdirSync(path.join(pwd, dir), { withFileTypes: true })
      .filter(d => {
        if (defaultFilters.includes(d.name)) {
          return false;
        }
        const filename = path.join(dir, d.name).replace(/\\/g, '/');
        if (d.isFile()) {
          return !gitIgnore.ignore(filename);
        }
        if (d.isDirectory()) {
          return !gitIgnore.ignore(filename + '/') && !gitIgnore.ignore(filename);
        }
        return false;
      })
      .map((dirent, index, arr) => {
        const isLast = index === arr.length - 1;
        return `${blank}${isLast ? '└' : '├'} ${dirent.isFile() ? dirent.name : logDir(dirent.name, path.join(dir, dirent.name), `${blank}${isLast ? ' ' : '│'}  `)}`;
      }).join('\n')}`
};
// logDir(dirName, '', '')
console.log(`
----------------------------------------
${logDir(dirName, '', '')}
----------------------------------------
`);
