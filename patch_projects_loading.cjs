const fs = require('fs');
let code = fs.readFileSync('src/pages/Projects.tsx', 'utf-8');

const loadingOld = `              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-secondary/40">Loading...</td>
                </tr>
              )`;

const loadingNew = `              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6">
                      <div className="h-4 bg-secondary/10 rounded-full w-full"></div>
                    </td>
                  </tr>
                ))
              )`;

code = code.replace(loadingOld, loadingNew);
fs.writeFileSync('src/pages/Projects.tsx', code);
