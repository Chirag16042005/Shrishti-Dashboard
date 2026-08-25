const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

const seedLogic = `
  useEffect(() => {
    async function seedClients() {
      try {
        const { data: clients } = await supabase.from('clients').select('id').limit(1);
        if (!clients || clients.length === 0) {
          // No clients exist, seed some demo clients
          await supabase.from('clients').insert([
            { name: 'Acme Corp', company: 'Acme Corporation', email: 'hello@acme.com' },
            { name: 'Globex', company: 'Globex Inc', email: 'contact@globex.com' }
          ]);
          console.log('Seeded demo clients');
        }
      } catch (e) {
        console.error(e);
      }
    }
    seedClients();
  }, []);
`;

if (!code.includes('seedClients')) {
  code = code.replace("useEffect(() => {\n    fetchDashboardData();\n  }, []);", seedLogic + "\n  useEffect(() => {\n    fetchDashboardData();\n  }, []);");
  fs.writeFileSync('src/pages/Dashboard.tsx', code);
}
