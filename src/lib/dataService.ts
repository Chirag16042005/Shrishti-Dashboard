import { supabase } from './supabase';

const LOCAL_STORAGE_KEY_PROJECTS = 'shrish_projects_data';
const LOCAL_STORAGE_KEY_CLIENTS = 'shrish_clients_data';

// Helper to run Supabase calls with a short timeout so placeholder or network delay never hangs the app
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 800): Promise<T | null> {
  let timer: any;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

export async function getClientsData() {
  const localStr = localStorage.getItem(LOCAL_STORAGE_KEY_CLIENTS);
  const localData = localStr ? JSON.parse(localStr) : [];

  // Attempt background sync if configured
  withTimeout((supabase.from('clients') as any).select('*').order('created_at', { ascending: false }))
    .then((res: any) => {
      if (res && !res.error && res.data && res.data.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(res.data));
      }
    })
    .catch(() => {});

  return localData;
}

export async function getProjectsData() {
  const localStr = localStorage.getItem(LOCAL_STORAGE_KEY_PROJECTS);
  const localData = localStr ? JSON.parse(localStr) : [];

  // Attempt background sync if configured
  withTimeout((supabase.from('projects') as any).select('*, clients(name)').order('created_at', { ascending: false }))
    .then((res: any) => {
      if (res && !res.error && res.data) {
        localStorage.setItem(LOCAL_STORAGE_KEY_PROJECTS, JSON.stringify(res.data));
      }
    })
    .catch(() => {});

  return localData;
}

export async function saveProjectData(payload: any, clientName?: string, editingId?: string) {
  // 1. Immediately update Local Storage synchronously for INSTANT response
  const localStr = localStorage.getItem(LOCAL_STORAGE_KEY_PROJECTS);
  let localProjects = localStr ? JSON.parse(localStr) : [];

  const now = new Date().toISOString();
  const clientObj = clientName ? { name: clientName } : { name: 'Client' };

  let targetId = editingId;
  if (editingId) {
    localProjects = localProjects.map((p: any) => 
      p.id === editingId ? { 
        ...p, 
        ...payload, 
        clients: clientName ? { name: clientName } : p.clients, 
        updated_at: now 
      } : p
    );
  } else {
    targetId = 'proj_' + Date.now();
    const newProj = {
      id: targetId,
      created_at: now,
      updated_at: now,
      ...payload,
      clients: clientObj
    };
    localProjects.unshift(newProj);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY_PROJECTS, JSON.stringify(localProjects));

  // Sync clients local storage
  if (clientName) {
    const clientsStr = localStorage.getItem(LOCAL_STORAGE_KEY_CLIENTS);
    let localClients = clientsStr ? JSON.parse(clientsStr) : [];
    if (!localClients.some((c: any) => c.name?.toLowerCase() === clientName.toLowerCase())) {
      localClients.unshift({ id: 'cli_' + Date.now(), name: clientName, created_at: now });
      localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(localClients));
    }
  }

  // 2. Non-blocking background sync with Supabase (fire and forget)
  (async () => {
    try {
      let resolvedClientId = payload.client_id || null;
      if (clientName) {
        const { data: existingClients } = await (supabase.from('clients') as any).select('id, name').ilike('name', clientName);
        if (existingClients && existingClients.length > 0) {
          resolvedClientId = existingClients[0].id;
        } else {
          const { data: newClient } = await (supabase.from('clients') as any).insert([{ name: clientName }]).select('id').single();
          if (newClient) resolvedClientId = newClient.id;
        }
      }

      const projectPayload = {
        ...payload,
        client_id: resolvedClientId
      };

      if (editingId && !editingId.startsWith('proj_')) {
        await (supabase.from('projects') as any).update(projectPayload).eq('id', editingId);
      } else {
        await (supabase.from('projects') as any).insert([projectPayload]);
      }
    } catch (e) {
      console.warn('Background Supabase save skipped:', e);
    }
  })();
}

export async function deleteProjectData(id: string) {
  // 1. Immediately update Local Storage synchronously for INSTANT delete
  const localStr = localStorage.getItem(LOCAL_STORAGE_KEY_PROJECTS);
  if (localStr) {
    const projects = JSON.parse(localStr).filter((p: any) => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  }

  // 2. Non-blocking background sync with Supabase
  if (!id.startsWith('proj_')) {
    (async () => {
      try {
        await (supabase.from('projects') as any).delete().eq('id', id);
      } catch (e) {
        console.warn('Background Supabase delete skipped:', e);
      }
    })();
  }
}

