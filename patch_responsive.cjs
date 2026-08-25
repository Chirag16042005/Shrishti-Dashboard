const fs = require('fs');

let dashCode = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');
dashCode = dashCode.replace(
  /<div className="flex-1">\s*<table/g,
  '<div className="flex-1 overflow-x-auto">\n            <table'
);
fs.writeFileSync('src/pages/Dashboard.tsx', dashCode);

let projCode = fs.readFileSync('src/pages/Projects.tsx', 'utf-8');
projCode = projCode.replace(
  /<div className="">\s*<table/g,
  '<div className="overflow-x-auto">\n          <table'
);
fs.writeFileSync('src/pages/Projects.tsx', projCode);

