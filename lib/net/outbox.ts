/**
 * A durable queue of API writes that couldn't be sent.
 *
 * Finishing a lesson underground used to be a POST into the void. The write now
 * lands here instead and is replayed, in order, when the network comes back.
 *
 * IndexedDB rather than localStorage because this has to survive the app being
 * backgrounded and killed on the walk home, and because the queue can hold a
 * whole session's writes rather than a few keys.
 *
 * Ordering matters: progress writes build on each other, so the queue drains
 * strictly oldest-first and STOPS at the first failure rather than skipping
 * ahead. A permanently poisoned entry is dropped after MAX_ATTEMPTS so one bad
 * write can't wedge the queue forever.
 */

const DB_NAME = 'chesspath-offline';
const STORE = 'outbox';
const DB_VERSION = 1;
const MAX_ATTEMPTS = 5;

export interface OutboxEntry {
  id?: number;
  url: string;
  method: string;
  body: string | null;
  headers: Record<string, string>;
  queuedAt: number;
  attempts: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const request = run(db.transaction(STORE, mode).objectStore(STORE));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      })
  );
}

export async function enqueue(entry: Omit<OutboxEntry, 'id' | 'attempts'>): Promise<void> {
  try {
    await tx('readwrite', (s) => s.add({ ...entry, attempts: 0 }));
  } catch {
    // A full or unavailable IndexedDB must not take the app down mid-lesson.
  }
}

export async function peekAll(): Promise<OutboxEntry[]> {
  try {
    const all = await tx<OutboxEntry[]>('readonly', (s) => s.getAll() as IDBRequest<OutboxEntry[]>);
    return all.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  } catch {
    return [];
  }
}

export async function remove(id: number): Promise<void> {
  try {
    await tx('readwrite', (s) => s.delete(id) as unknown as IDBRequest<undefined>);
  } catch {
    /* nothing useful to do */
  }
}

/** Returns true when the entry has failed too many times and should be dropped. */
export async function recordFailure(entry: OutboxEntry): Promise<boolean> {
  const attempts = entry.attempts + 1;
  if (attempts >= MAX_ATTEMPTS) {
    if (entry.id != null) await remove(entry.id);
    return true;
  }
  try {
    await tx('readwrite', (s) => s.put({ ...entry, attempts }));
  } catch {
    /* nothing useful to do */
  }
  return false;
}

export async function pendingCount(): Promise<number> {
  return (await peekAll()).length;
}
