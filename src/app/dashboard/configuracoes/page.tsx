'use client'
import TopBar from '@/components/layout/TopBar'
import { useAppStore } from '@/lib/store'
import { Save, User, Bell, Shield, CreditCard, Eye, EyeOff, Check, X } from 'lucide-react'
import { useState } from 'react'

export default function ConfiguracoesPage() {
  const { user, setUser } = useAppStore()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [creci, setCreci] = useState(user?.creci || '')
  const [saved, setSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const [notifs, setNotifs] = useState({
    newLead: true,
    weeklyReport: true,
    trialExpire: true,
    pagePublished: true,
    productUpdates: false,
    marketing: false,
  })

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'billing', label: 'Plano & Pagamento', icon: CreditCard },
  ]
  const [activeTab, setActiveTab] = useState('profile')

  function handleSaveProfile() {
    setUser({ ...user!, name, email, phone, creci })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleSavePassword() {
    setPasswordError('')
    if (!currentPassword) { setPasswordError('Digite a senha atual.'); return }
    if (newPassword.length < 8) { setPasswordError('A nova senha deve ter ao menos 8 caracteres.'); return }
    if (newPassword !== confirmPassword) { setPasswordError('As senhas não coincidem.'); return }
    setPasswordSaved(true)
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    setTimeout(() => setPasswordSaved(false), 2500)
  }

  const BILLING_FEATURES = [
    'Páginas ilimitadas',
    'Suporte prioritário',
    'Pixel Meta e GA4',
    'Google Tag Manager',
    'Exportar leads CSV',
    'SEO avançado',
    'Scripts personalizados',
  ]

  const NOTIF_OPTIONS = [
    { key: 'newLead', label: 'Novo lead recebido', desc: 'Notifica sempre que alguém preencher o formulário.' },
    { key: 'weeklyReport', label: 'Relatório semanal', desc: 'Resumo de visualizações e leads toda segunda-feira.' },
    { key: 'trialExpire', label: 'Aviso de vencimento do trial', desc: 'Alerta 3 e 1 dias antes do trial expirar.' },
    { key: 'pagePublished', label: 'Página publicada com sucesso', desc: 'Confirmação ao publicar ou atualizar uma landing page.' },
    { key: 'productUpdates', label: 'Atualizações de produto', desc: 'Novidades e melhorias no Luz Smart Site.' },
    { key: 'marketing', label: 'Dicas e conteúdo', desc: 'Artigos e dicas para converter mais leads.' },
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar title="Configurações" />
      <div className="p-6">
        <div className="flex gap-6">
          {/* Tabs */}
          <div className="w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`nav-item w-full ${activeTab === id ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-xl">

            {/* PERFIL */}
            {activeTab === 'profile' && (
              <div className="card-dark space-y-5">
                <h3 className="font-bold text-white">Informações do Perfil</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-400/20 flex items-center justify-center text-brand-400 font-black text-2xl">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <button className="btn-secondary text-sm py-2 px-4">Alterar foto</button>
                    <p className="text-dark-500 text-xs mt-1">JPG ou PNG. Máx. 5MB.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">Nome completo</label>
                    <input className="input-dark" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">CRECI</label>
                    <input className="input-dark" value={creci} onChange={(e) => setCreci(e.target.value)} placeholder="CRECI-SP 000000-F" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-400 block mb-1.5">E-mail</label>
                  <input className="input-dark" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-400 block mb-1.5">Telefone / WhatsApp</label>
                  <input className="input-dark" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
                </div>
                <button onClick={handleSaveProfile} className="btn-primary text-sm py-2.5">
                  {saved ? <><Check className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar alterações</>}
                </button>
              </div>
            )}

            {/* NOTIFICAÇÕES */}
            {activeTab === 'notifications' && (
              <div className="card-dark space-y-6">
                <div>
                  <h3 className="font-bold text-white mb-1">Preferências de notificação</h3>
                  <p className="text-dark-400 text-sm">Escolha quais alertas deseja receber por e-mail.</p>
                </div>
                <div className="space-y-4">
                  {NOTIF_OPTIONS.map(({ key, label, desc }) => (
                    <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-dark-800 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-white">{label}</p>
                        <p className="text-xs text-dark-400 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                        className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative mt-0.5 ${notifs[key as keyof typeof notifs] ? 'bg-brand-400' : 'bg-dark-700'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow ${notifs[key as keyof typeof notifs] ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="btn-primary text-sm py-2.5">
                  <Save className="w-4 h-4" /> Salvar preferências
                </button>
              </div>
            )}

            {/* SEGURANÇA */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                {/* Alterar senha */}
                <div className="card-dark space-y-4">
                  <div>
                    <h3 className="font-bold text-white mb-1">Alterar senha</h3>
                    <p className="text-dark-400 text-sm">Use uma senha forte com ao menos 8 caracteres.</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">Senha atual</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        className="input-dark pr-10"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">Nova senha</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        className="input-dark pr-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {newPassword && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {newPassword.length >= 8
                          ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Tamanho adequado</span></>
                          : <><X className="w-3 h-3 text-red-400" /><span className="text-red-400">Mínimo 8 caracteres</span></>
                        }
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">Confirmar nova senha</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className="input-dark pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {newPassword === confirmPassword
                          ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Senhas coincidem</span></>
                          : <><X className="w-3 h-3 text-red-400" /><span className="text-red-400">Senhas não coincidem</span></>
                        }
                      </div>
                    )}
                  </div>

                  {passwordError && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-2.5 rounded-xl border border-red-400/20">
                      <X className="w-4 h-4 flex-shrink-0" /> {passwordError}
                    </div>
                  )}

                  <button onClick={handleSavePassword} className="btn-primary text-sm py-2.5">
                    {passwordSaved ? <><Check className="w-4 h-4" /> Senha alterada!</> : <><Shield className="w-4 h-4" /> Alterar senha</>}
                  </button>
                </div>

                {/* Sessões ativas */}
                <div className="card-dark">
                  <h3 className="font-bold text-white mb-4">Sessões ativas</h3>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome — Windows 10', location: 'São Paulo, SP', current: true },
                      { device: 'Safari — iPhone 14', location: 'São Paulo, SP', current: false },
                    ].map(({ device, location, current }) => (
                      <div key={device} className="flex items-center justify-between py-2.5 border-b border-dark-800 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-white">{device}</p>
                          <p className="text-xs text-dark-500">{location} {current && <span className="text-green-400 ml-1">• Sessão atual</span>}</p>
                        </div>
                        {!current && (
                          <button className="text-xs text-red-400 hover:text-red-300 font-medium">Encerrar</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2FA */}
                <div className="card-dark">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white mb-1">Autenticação em dois fatores</h3>
                      <p className="text-dark-400 text-sm">Adicione uma camada extra de segurança à sua conta.</p>
                    </div>
                    <button className="btn-secondary text-sm py-2 px-4 flex-shrink-0">Ativar</button>
                  </div>
                </div>
              </div>
            )}

            {/* PLANO & PAGAMENTO */}
            {activeTab === 'billing' && (
              <div className="space-y-4">
                <div className="card-dark border-brand-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-white">Plano Premium</h3>
                      <p className="text-dark-400 text-sm">R$ 50,00/mês</p>
                    </div>
                    <span className="badge-premium">Ativo</span>
                  </div>
                  <div className="space-y-2 text-sm text-dark-300 mb-4">
                    {BILLING_FEATURES.map((f) => (
                      <p key={f} className="flex items-center gap-2">
                        <span className="text-brand-400">✓</span> {f}
                      </p>
                    ))}
                  </div>
                  <button className="btn-secondary w-full justify-center text-sm py-2.5">
                    Gerenciar assinatura
                  </button>
                </div>

                <div className="card-dark">
                  <h3 className="font-bold text-white mb-4">Histórico de pagamentos</h3>
                  <div className="space-y-2">
                    {[
                      { date: '01/07/2026', value: 'R$ 50,00', status: 'Pago' },
                      { date: '01/06/2026', value: 'R$ 50,00', status: 'Pago' },
                    ].map(({ date, value, status }) => (
                      <div key={date} className="flex items-center justify-between py-2.5 border-b border-dark-800 last:border-0">
                        <p className="text-sm text-dark-300">{date}</p>
                        <p className="text-sm font-medium text-white">{value}</p>
                        <span className="text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full font-semibold">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
