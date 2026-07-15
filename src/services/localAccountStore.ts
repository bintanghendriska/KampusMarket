import AsyncStorage from '@react-native-async-storage/async-storage';
import { sha256 } from '../utils/crypto';

const STORAGE_KEY = 'uasprak:local-accounts';

export interface LocalAccount {
  id: number;
  username: string;
  // Hashed password
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
    const normalized = username.trim().toLowerCase();
    return accounts.find((account) => account.username.trim().toLowerCase() === normalized);
  },

  save: async (account: LocalAccount): Promise<void> => {
    const accounts = await readAccounts();
    const normalized = account.username.trim().toLowerCase();
    const withoutExisting = accounts.filter(
      (item) => item.username.trim().toLowerCase() !== normalized
    );
    
    // Hash password before saving to local storage
    const hashedAccount: LocalAccount = {
      ...account,
      username: normalized,
      password: sha256(account.password),
    };
    
    await writeAccounts([...withoutExisting, hashedAccount]);
  },
};
