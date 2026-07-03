'use client'
import TopBar from '@/components/layout/TopBar'
import { Book, Mail, Send, MessageSquare, Zap, CheckCircle, X } from 'lucide-react'
import { useState } from 'react'

const DOCS = [
  { title: 'Como extrair dados de um imóvel', time: '2 min' },
  { title: 'Personalizar cores e fontes', time: '3 min' },
  { title: 'Configurar domínio personalizado', time: '5 min' },
  { title: 'Integrar com Facebook Pixel', time: '4 min' },
  { title: 'Exportar leads para CSV', time: '2 min' },
  { title: 'Configurar WhatsApp no botão CTA', time: '2 min' },
]

const WHATSAPP_NUMBER = '5511992255538'

export default function SuportePage() {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formSubject, setFormSubject] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!formName || !formEmail || !formMessage) {
      setError('Preencha nome, e-mail e mensagem.')
      return
    }
    setError('')
    setSending(true)

    // Abre cliente de e-mail do usuário com os dados preenchidos
    const mailto = `mailto:atendimentofdconsultoria@gmail.com?subject=${encodeURIComponent(formSubject || 'Suporte - Luz Smart Site')}&body=${encodeURIComponent(
      `Nome: ${formName}\nE-mail: ${formEmail}\n\n${formMessage}`
    )}`
    window.location.href = mailto

    await new Promise((r) => setTimeout(r, 800))
    setSending(false)
    setSent(true)
  }

  function openWhatsApp() {
    const text = encodeURIComponent('Olá! Preciso de suporte com o Luz Smart Site.')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar title="Suporte" subtitle="Estamos aqui para ajudar" />
      <div className="p-6 space-y-6 max-w-4xl">

        {/* Contact cards — sem Chat ao vivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* E-mail */}
          <div className="card-dark text-center">
            <div className="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-bold text-white mb-1">E-mail</h3>
            <p className="text-dark-400 text-sm mb-4">Respondemos em até 24 horas</p>
            <button
              onClick={() => { setShowEmailForm(true); setSent(false) }}
              className="btn-secondary w-full justify-center text-sm py-2.5"
            >
              <Mail className="w-4 h-4" /> Enviar e-mail
            </button>
          </div>

          {/* WhatsApp */}
          <div className="card-dark text-center">
            <div className="w-12 h-12 bg-brand-400/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="font-bold text-white mb-1">WhatsApp</h3>
            <p className="text-dark-400 text-sm mb-4">Atendimento rápido via mensagem</p>
            <button
              onClick={openWhatsApp}
              className="btn-primary w-full justify-center text-sm py-2.5"
            >
              <Send className="w-4 h-4" /> Chamar no WhatsApp
            </button>
          </div>
        </div>

        {/* Formulário de e-mail */}
        {showEmailForm && (
          <div className="card-dark">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-white">Enviar mensagem</h3>
                <p className="text-dark-400 text-xs mt-0.5">Sua mensagem será encaminhada para nossa equipe de suporte.</p>
              </div>
              <button onClick={() => setShowEmailForm(false)} className="text-dark-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
                <h4 className="font-bold text-white text-lg mb-2">Mensagem enviada!</h4>
                <p className="text-dark-400 text-sm">Seu cliente de e-mail foi aberto com a mensagem preenchida. Confirme o envio lá.</p>
                <button onClick={() => { setSent(false); setFormName(''); setFormEmail(''); setFormSubject(''); setFormMessage('') }}
                  className="btn-secondary text-sm py-2.5 px-5 mt-5">
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">Nome *</label>
                    <input
                      className="input-dark"
                      placeholder="Seu nome"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">E-mail *</label>
                    <input
                      className="input-dark"
                      type="email"
                      placeholder="seu@email.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-400 block mb-1.5">Assunto</label>
                  <input
                    className="input-dark"
                    placeholder="Qual é o assunto?"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-400 block mb-1.5">Mensagem *</label>
                  <textarea
                    className="input-dark resize-none"
                    rows={5}
                    placeholder="Descreva sua dúvida ou problema em detalhes..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-2.5 rounded-xl border border-red-400/20">
                    <X className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={sending} className="btn-primary text-sm py-2.5 px-6 disabled:opacity-60">
                    {sending ? 'Abrindo e-mail...' : <><Send className="w-4 h-4" /> Enviar mensagem</>}
                  </button>
                  <button type="button" onClick={() => setShowEmailForm(false)} className="btn-secondary text-sm py-2.5 px-5">
                    Cancelar
                  </button>
                </div>
                <p className="text-dark-600 text-xs">
                  Ao enviar, seu cliente de e-mail será aberto com os dados preenchidos para confirmar o envio.
                </p>
              </form>
            )}
          </div>
        )}

        {/* Docs */}
        <div className="card-dark">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-400" /> Artigos mais acessados
          </h3>
          <div className="space-y-1">
            {DOCS.map(({ title, time }) => (
              <div key={title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800 transition-colors cursor-pointer group">
                <Book className="w-4 h-4 text-dark-500 flex-shrink-0" />
                <span className="text-dark-300 text-sm group-hover:text-white transition-colors flex-1">{title}</span>
                <span className="text-xs text-dark-600">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
