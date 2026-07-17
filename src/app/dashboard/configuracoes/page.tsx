'use client'
import TopBar from '@/components/layout/TopBar'
import { useAppStore } from '@/lib/store'
import { Save, User, Bell, Shield, CreditCard, Eye, EyeOff, Check, X, Globe, Crown, Lock, Copy, CheckCircle, ExternalLink } from 'lucide-react'
import { useState, useRef } from 'react'
import PremiumButton from '@/components/ui/PremiumButton'
import { getEffectivePlan } from '@/lib/blocklist'

export default function ConfiguracoesPage() {
  const { user, setUser } = useAppStore()
  const isPremium = getEffectivePlan(user?.email, user?.plan ?? 'free') === 'premium'

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

  // Domínio
  const [customDomain, setCustomDomain] = useState('')
  const [domainSaved, setDomainSaved] = useState(false)
  const [copiedDns, setCopiedDns] = useState(false)

  const [photo, setPhoto] = useState<string | undefined>(user?.photo)
  const [photoError, setPhotoError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('A foto deve ter no máximo 5MB.')
      return
    }
    if (!file.type.startsWith('image/')) {
      setPhotoError('Selecione um arquivo JPG ou PNG.')
      return
    }
    setPhotoError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setPhoto(dataUrl)
    }
    reader.readAsDataURL(file)
  }

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
    { id: 'domain', label: 'Domínio', icon: Globe },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'billing', label: 'Plano & Pagamento', icon: CreditCard },
  ]
  const [activeTab, setActiveTab] = useState('profile')

  function handleSaveProfile() {
    setUser({ ...user!, name, email, phone, creci, photo })
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

  function handleSaveDomain() {
    setDomainSaved(true)
    setTimeout(() => setDomainSaved(false), 2500)
  }

  function copyDns(text: string) {
    navigator.clipboard.writeText(text)
    setCopiedDns(true)
    setTimeout(() => setCopiedDns(false), 2000)
  }

  const BILLING_FEATURES = [
    'Sites ilimitados',
    'Domínio personalizado',
    'Suporte prioritário',
    'Pixel Meta e GA4',
    'Google Tag Manager',
    'Exportar leads CSV',
    'SEO avançado',
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
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tabs */}
          <div className="md:w-52 flex-shrink-0">
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`nav-item flex-shrink-0 md:w-full ${activeTab === id ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{label}</span>
                  {id === 'domain' && !isPremium && <Crown className="w-3 h-3 text-brand-400 ml-auto" />}
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
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-brand-400/20 flex items-center justify-center text-brand-400 font-black text-2xl flex-shrink-0">
                    {photo
                      ? <img src={photo} alt="Foto de perfil" className="w-full h-full object-cover" />
                      : name.charAt(0)
                    }
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      Alterar foto
                    </button>
                    <p className="text-dark-500 text-xs mt-1">JPG ou PNG. Máx. 5MB.</p>
                    {photoError && <p className="text-red-400 text-xs mt-1">{photoError}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* DOMÍNIO */}
            {activeTab === 'domain' && (
              <div className="space-y-4">
                {!isPremium ? (
                  /* Bloqueado — plano gratuito */
                  <div className="card-dark text-center py-10 px-6">
                    <div className="w-16 h-16 rounded-2xl bg-brand-400/10 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-brand-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Domínio personalizado</h3>
                    <p className="text-dark-400 text-sm mb-6 max-w-sm mx-auto">
                      Conecte um domínio próprio às suas landing pages, como{' '}
                      <span className="text-white font-medium">imoveis.suaempresa.com.br</span>.
                      Disponível apenas no plano Premium.
                    </p>
                    <PremiumButton size="lg" />
                    <div className="mt-6 pt-6 border-t border-dark-800 grid grid-cols-2 gap-2 text-left max-w-xs mx-auto">
                      {['Sites ilimitados', 'Domínio personalizado', 'Pixel Meta & Analytics', 'Exportar leads CSV'].map((f) => (
                        <div key={f} className="flex items-center gap-2 text-xs text-dark-300">
                          <span className="text-brand-400">✓</span> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Premium — configuração de domínio */
                  <>
                    <div className="card-dark space-y-5">
                      <div>
                        <h3 className="font-bold text-white mb-1">Domínio personalizado</h3>
                        <p className="text-dark-400 text-sm">
                          Conecte um domínio ou subdomínio próprio. Ex: <span className="text-white">imoveis.suaempresa.com.br</span>
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-dark-400 block mb-1.5">Seu domínio</label>
                        <div className="flex gap-2">
                          <input
                            className="input-dark flex-1"
                            value={customDomain}
                            onChange={(e) => setCustomDomain(e.target.value.toLowerCase().trim())}
                            placeholder="imoveis.suaempresa.com.br"
                          />
                          <button onClick={handleSaveDomain} className="btn-primary px-4 flex-shrink-0">
                            {domainSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-dark-500 mt-1.5">
                          Use um subdomínio (ex: <code className="text-dark-300">imoveis.</code>) para não afetar seu site principal.
                        </p>
                      </div>

                      {customDomain && (
                        <div className="bg-dark-800 rounded-xl p-4 space-y-3">
                          <p className="text-xs font-semibold text-white">Configure o DNS do seu domínio:</p>
                          <div className="space-y-2">
                            {[
                              { type: 'CNAME', name: customDomain.split('.')[0] || '@', value: 'cname.vercel-dns.com' },
                            ].map((record) => (
                              <div key={record.type} className="flex items-center gap-2 bg-dark-900 rounded-lg p-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-brand-400 bg-brand-400/10 px-2 py-0.5 rounded">{record.type}</span>
                                    <span className="text-xs text-dark-300 font-mono">{record.name}</span>
                                    <span className="text-xs text-dark-500">→</span>
                                    <span className="text-xs text-white font-mono truncate">{record.value}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => copyDns(record.value)}
                                  className="p-1.5 rounded-lg text-dark-500 hover:text-white hover:bg-dark-700 transition-colors flex-shrink-0"
                                  title="Copiar"
                                >
                                  {copiedDns ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-dark-500">
                            Após salvar o DNS, a propagação pode levar até 24h. Acesse{' '}
                            <a href="https://dnschecker.org" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
                              dnschecker.org
                            </a>{' '}
                            para verificar.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="card-dark">
                      <h3 className="font-bold text-white mb-3">Como funciona</h3>
                      <ol className="space-y-3">
                        {[
                          'Digite o domínio ou subdomínio que deseja usar',
                          'Copie o registro CNAME e configure no painel do seu provedor de domínio (Registro.br, GoDaddy, etc.)',
                          'Aguarde a propagação do DNS (até 24h)',
                          'Todas as suas landing pages estarão disponíveis no seu domínio',
                        ].map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-dark-300">
                            <span className="w-6 h-6 rounded-full bg-brand-400/20 text-brand-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </>
                )}
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
                <div className="card-dark space-y-4">
                  <div>
                    <h3 className="font-bold text-white mb-1">Alterar senha</h3>
                    <p className="text-dark-400 text-sm">Use uma senha forte com ao menos 8 caracteres.</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">Senha atual</label>
                    <div className="relative">
                      <input type={showCurrent ? 'text' : 'password'} className="input-dark pr-10" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                      <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">Nova senha</label>
                    <div className="relative">
                      <input type={showNew ? 'text' : 'password'} className="input-dark pr-10" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                      <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {newPassword && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {newPassword.length >= 8
                          ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Tamanho adequado</span></>
                          : <><X className="w-3 h-3 text-red-400" /><span className="text-red-400">Mínimo 8 caracteres</span></>}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">Confirmar nova senha</label>
                    <div className="relative">
                      <input type={showConfirm ? 'text' : 'password'} className="input-dark pr-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                      <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {newPassword === confirmPassword
                          ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Senhas coincidem</span></>
                          : <><X className="w-3 h-3 text-red-400" /><span className="text-red-400">Senhas não coincidem</span></>}
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
                        {!current && <button className="text-xs text-red-400 hover:text-red-300 font-medium">Encerrar</button>}
                      </div>
                    ))}
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
                      <h3 className="font-bold text-white">{isPremium ? 'Plano Premium' : 'Plano Gratuito'}</h3>
                      <p className="text-dark-400 text-sm">{isPremium ? 'R$ 50,00/mês' : 'Trial — 3 dias restantes'}</p>
                    </div>
                    {isPremium
                      ? <span className="text-xs font-bold text-brand-400 bg-brand-400/10 border border-brand-400/20 px-3 py-1 rounded-full">Premium</span>
                      : <span className="text-xs font-bold text-dark-400 bg-dark-700 px-3 py-1 rounded-full">Gratuito</span>
                    }
                  </div>
                  <div className="space-y-2 text-sm text-dark-300 mb-4">
                    {BILLING_FEATURES.map((f) => (
                      <p key={f} className="flex items-center gap-2">
                        <span className={isPremium ? 'text-brand-400' : 'text-dark-600'}>✓</span> {f}
                      </p>
                    ))}
                  </div>
                  {isPremium ? (
                    <button className="btn-secondary w-full justify-center text-sm py-2.5">Gerenciar assinatura</button>
                  ) : (
                    <PremiumButton className="btn-primary w-full justify-center" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
