import type { User } from '@/types'

const ACCOUNTS_KEY = 'luz-accounts'

interface StoredAccount extends User {
  passwordHash: string
}

function simpleHash(str: string): string {
  // Not cryptographic — good enough for client-only MVP
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString(36)
}

function getAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function registerUser(params: {
  name: string
  email: string
  password: string
  creci?: string
  phone?: string
}): { user: User } | { error: string } {
  const accounts = getAccounts()
  const exists = accounts.find((a) => a.email.toLowerCase() === params.email.toLowerCase())
  if (exists) return { error: 'Este e-mail já está cadastrado.' }

  const now = new Date().toISOString()
  const trialEnds = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()

  const newAccount: StoredAccount = {
    id: `user_${Date.now()}`,
    name: params.name.trim(),
    email: params.email.toLowerCase().trim(),
    passwordHash: simpleHash(params.password),
    plan: 'free',
    trialEndsAt: trialEnds,
    createdAt: now,
    creci: params.creci || '',
    phone: params.phone || '',
  }

  saveAccounts([...accounts, newAccount])

  const { passwordHash, ...user } = newAccount
  return { user }
}

export function loginUser(email: string, password: string): { user: User } | { error: string } {
  const accounts = getAccounts()
  const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase().trim())

  if (!account) return { error: 'E-mail não encontrado.' }
  if (account.passwordHash !== simpleHash(password)) return { error: 'Senha incorreta.' }

  const { passwordHash, ...user } = account
  return { user }
}

export function updateStoredUser(userId: string, patch: Partial<User>) {
  const accounts = getAccounts()
  const updated = accounts.map((a) => (a.id === userId ? { ...a, ...patch } : a))
  saveAccounts(updated)
}
