/**
 * Emails bloqueados do plano Premium (reembolso concedido ou fraude).
 * Adicionar o email aqui força o plano para 'free' em todo o app,
 * independente do que estiver salvo no localStorage do usuário.
 * Após adicionar, fazer commit + push para o Vercel aplicar.
 */
const BLOCKED_EMAILS: string[] = [
  'sahecorretoradeimoveis@gmail.com',
]

export function isEmailBlocked(email: string | undefined): boolean {
  if (!email) return false
  return BLOCKED_EMAILS.includes(email.trim().toLowerCase())
}

/** Retorna o plano efetivo do usuário, respeitando o bloqueio. */
export function getEffectivePlan(email: string | undefined, plan: 'free' | 'premium'): 'free' | 'premium' {
  if (isEmailBlocked(email)) return 'free'
  return plan
}
