import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'uasprak:local-accounts';

export interface LocalAccount {
  id: number;
  username: string;
  // Demo-only simplification: DummyJSON has no real registration endpoint, so
  // this on-device store is what makes Register -> Login actually work
  // end-to-end. Never store plain-text passwords like this in production.
  password: string;
  name: string;
  email: string;
}

async function readAccounts(): Promise<LocalAccount[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalAccount[]) : [];
  } catch {
    return [];
  }
}

async function writeAccounts(accounts: LocalAccount[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export const localAccountStore = {
  findByUsername: async (username: string): Promise<LocalAccount | undefined> => {
    const accounts = await readAccounts();
    return accounts.find((account) => account.username === username);
  },

  save: async (account: LocalAccount): Promise<void> => {
    const accounts = await readAccounts();
    const withoutExisting = accounts.filter((item) => item.username !== account.username);
    await writeAccounts([...withoutExisting, account]);
  },
};
