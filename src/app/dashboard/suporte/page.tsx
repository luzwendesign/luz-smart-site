'use client'
import TopBar from '@/components/layout/TopBar'
import { Book, Mail, Send, MessageSquare, Zap, CheckCircle, X, ChevronDown, ChevronUp, Clock, RotateCcw, AlertTriangle, XCircle } from 'lucide-react'
import { useState } from 'react'

const ARTICLES = [
  {
    title: 'Como extrair dados de um imóvel',
    time: '2 min',
    category: 'Primeiros passos',
    content: [
      {
        type: 'intro',
        text: 'O Luz Smart Site extrai automaticamente as informações do imóvel a partir do link de qualquer portal imobiliário. Veja como funciona:',
      },
      {
        type: 'steps',
        items: [
          'Acesse "Criar novo site" no menu lateral ou no Dashboard.',
          'Abra o portal imobiliário (Zap Imóveis, Viva Real, OLX, etc.) e copie o link do imóvel que deseja divulgar.',
          'Cole o link no campo indicado e clique em "Gerar landing page".',
          'Aguarde alguns segundos enquanto a IA extrai fotos, preço, descrição e diferenciais do imóvel.',
          'Sua landing page será gerada automaticamente e você poderá personalizá-la no editor.',
        ],
      },
      {
        type: 'tip',
        text: 'Use links de portais reconhecidos como Zap Imóveis e Viva Real para melhores resultados. Links de sites próprios também funcionam.',
      },
    ],
  },
  {
    title: 'Personalizar cores e fontes',
    time: '3 min',
    category: 'Editor',
    content: [
      {
        type: 'intro',
        text: 'Deixe sua landing page com a identidade visual da sua marca ajustando cores, fontes e estilo diretamente no editor.',
      },
      {
        type: 'steps',
        items: [
          'Abra o editor da landing page clicando em "Editar" na lista de sites.',
          'No painel lateral, selecione a aba "Design".',
          'Em "Cor primária", escolha a cor principal da sua marca (usada em botões e destaques).',
          'Em "Cor de destaque", defina a cor secundária para acentos e hovers.',
          'Na seção "Tipografia", selecione a família de fontes (Sans-serif, Serif ou Display).',
          'Ajuste o tamanho dos títulos com o controle deslizante de escala de fonte.',
          'Escolha o estilo dos botões: arredondado, padrão ou quadrado.',
          'Visualize as mudanças em tempo real no preview à direita.',
        ],
      },
      {
        type: 'tip',
        text: 'Use a cor da sua marca como cor primária para criar consistência entre suas landing pages e seu material de divulgação.',
      },
    ],
  },
  {
    title: 'Configurar domínio personalizado',
    time: '5 min',
    category: 'Configurações',
    content: [
      {
        type: 'intro',
        text: 'Com o plano Premium, você pode usar um domínio ou subdomínio próprio para suas landing pages, como imoveis.suaempresa.com.br.',
      },
      {
        type: 'steps',
        items: [
          'Acesse Configurações → aba "Domínio" no menu lateral.',
          'Digite o domínio ou subdomínio desejado (ex: imoveis.suaempresa.com.br).',
          'Copie o registro CNAME exibido na tela.',
          'Acesse o painel do seu provedor de domínio (Registro.br, GoDaddy, Hostgator, etc.).',
          'Crie um registro CNAME apontando para cname.vercel-dns.com.',
          'Salve as alterações e aguarde a propagação do DNS (pode levar até 24 horas).',
          'Use o site dnschecker.org para verificar quando a propagação foi concluída.',
        ],
      },
      {
        type: 'tip',
        text: 'Recomendamos usar um subdomínio (ex: imoveis.) em vez do domínio raiz para não interferir no seu site principal.',
      },
      {
        type: 'note',
        text: 'Recurso disponível apenas no Plano Premium. Acesse Configurações → Plano & Pagamento para fazer upgrade.',
      },
    ],
  },
  {
    title: 'Integrar com Facebook Pixel',
    time: '4 min',
    category: 'Integrações',
    content: [
      {
        type: 'intro',
        text: 'O Facebook Pixel permite rastrear visitantes das suas landing pages e criar anúncios segmentados para pessoas com perfil de comprador.',
      },
      {
        type: 'steps',
        items: [
          'Acesse o Gerenciador de Eventos no Facebook Business Manager (business.facebook.com).',
          'Crie um Pixel ou copie o ID do Pixel existente (formato: 15 dígitos numéricos).',
          'No Luz Smart Site, acesse Integrações no menu lateral.',
          'Cole o ID do Pixel no campo "Facebook Pixel ID" e salve.',
          'O Pixel será inserido automaticamente em todas as suas landing pages.',
          'No Gerenciador de Eventos, verifique se os eventos estão sendo recebidos.',
        ],
      },
      {
        type: 'tip',
        text: 'Configure eventos personalizados como "Lead" para rastrear quando alguém preenche o formulário de contato na sua landing page.',
      },
      {
        type: 'note',
        text: 'Recurso disponível apenas no Plano Premium.',
      },
    ],
  },
  {
    title: 'Exportar leads para CSV',
    time: '2 min',
    category: 'Leads',
    content: [
      {
        type: 'intro',
        text: 'Exporte todos os seus leads para uma planilha CSV e importe no seu CRM, Excel ou Google Sheets.',
      },
      {
        type: 'steps',
        items: [
          'Acesse "Leads" no menu lateral do Dashboard.',
          'Na parte superior da página, clique no botão "Exportar CSV".',
          'O arquivo será baixado automaticamente com todos os seus leads.',
          'Abra o arquivo no Excel, Google Sheets ou importe no seu CRM.',
        ],
      },
      {
        type: 'tip',
        text: 'O arquivo CSV contém: nome, WhatsApp, e-mail, qual imóvel gerou o lead e a data/hora do contato.',
      },
      {
        type: 'note',
        text: 'A exportação CSV está disponível apenas no Plano Premium.',
      },
    ],
  },
  {
    title: 'Configurar WhatsApp no botão CTA',
    time: '2 min',
    category: 'Editor',
    content: [
      {
        type: 'intro',
        text: 'O botão de CTA (Call to Action) da sua landing page pode abrir diretamente uma conversa no WhatsApp com uma mensagem pré-preenchida.',
      },
      {
        type: 'steps',
        items: [
          'Abra o editor da landing page desejada.',
          'No painel lateral, clique na aba "Conteúdo".',
          'Localize o campo "WhatsApp do corretor" e insira seu número com DDD (ex: 11999999999).',
          'Edite o texto do botão CTA se desejar (ex: "Quero visitar este imóvel").',
          'Clique em "Publicar" para salvar as alterações.',
          'Teste clicando no botão CTA no preview — ele deve abrir o WhatsApp com mensagem automática.',
        ],
      },
      {
        type: 'tip',
        text: 'Use uma mensagem personalizada no CTA que mencione o imóvel, como: "Tenho interesse no apartamento de 3 quartos!" para leads mais qualificados.',
      },
    ],
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Primeiros passos': 'text-green-400 bg-green-400/10',
  'Editor': 'text-blue-400 bg-blue-400/10',
  'Configurações': 'text-purple-400 bg-purple-400/10',
  'Integrações': 'text-orange-400 bg-orange-400/10',
  'Leads': 'text-brand-400 bg-brand-400/10',
}

const WHATSAPP_NUMBER = '5511992255538'

export default function SuportePage() {
  const [openArticle, setOpenArticle] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formSubject, setFormSubject] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  function toggleArticle(title: string) {
    setOpenArticle(openArticle === title ? null : title)
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!formName || !formEmail || !formMessage) {
      setError('Preencha nome, e-mail e mensagem.')
      return
    }
    setError('')
    setSending(true)
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
      <div className="p-4 md:p-6 space-y-6 max-w-3xl">

        {/* Canais de contato */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-dark text-center">
            <div className="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-bold text-white mb-1">E-mail</h3>
            <p className="text-dark-400 text-sm mb-4">Respondemos em até 24 horas</p>
            <button onClick={() => { setShowEmailForm(true); setSent(false) }} className="btn-secondary w-full justify-center text-sm py-2.5">
              <Mail className="w-4 h-4" /> Enviar e-mail
            </button>
          </div>

          <div className="card-dark text-center">
            <div className="w-12 h-12 bg-brand-400/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="font-bold text-white mb-1">WhatsApp</h3>
            <p className="text-dark-400 text-sm mb-4">Atendimento rápido via mensagem</p>
            <button onClick={openWhatsApp} className="btn-primary w-full justify-center text-sm py-2.5">
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
                <p className="text-dark-400 text-xs mt-0.5">Sua mensagem será encaminhada para nossa equipe.</p>
              </div>
              <button onClick={() => setShowEmailForm(false)} className="text-dark-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
                <h4 className="font-bold text-white text-lg mb-2">Mensagem enviada!</h4>
                <p className="text-dark-400 text-sm">Seu cliente de e-mail foi aberto com a mensagem preenchida.</p>
                <button onClick={() => { setSent(false); setFormName(''); setFormEmail(''); setFormSubject(''); setFormMessage('') }}
                  className="btn-secondary text-sm py-2.5 px-5 mt-5">
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">Nome *</label>
                    <input className="input-dark" placeholder="Seu nome" value={formName} onChange={(e) => setFormName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dark-400 block mb-1.5">E-mail *</label>
                    <input className="input-dark" type="email" placeholder="seu@email.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-400 block mb-1.5">Assunto</label>
                  <input className="input-dark" placeholder="Qual é o assunto?" value={formSubject} onChange={(e) => setFormSubject(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-400 block mb-1.5">Mensagem *</label>
                  <textarea className="input-dark resize-none" rows={5} placeholder="Descreva sua dúvida em detalhes..." value={formMessage} onChange={(e) => setFormMessage(e.target.value)} />
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
                  <button type="button" onClick={() => setShowEmailForm(false)} className="btn-secondary text-sm py-2.5 px-5">Cancelar</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Política de Reembolso */}
        <div className="card-dark p-0 overflow-hidden">
          <div className="p-4 border-b border-dark-800 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-white">Política de Reembolso</h3>
          </div>
          <div className="p-5 space-y-4">

            {/* Regra principal */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-300 font-semibold text-sm mb-1">Direito de arrependimento — 7 dias corridos</p>
                <p className="text-dark-300 text-sm leading-relaxed">
                  Você tem <strong className="text-white">7 dias corridos</strong> a partir da data do pagamento para solicitar o reembolso integral, sem necessidade de justificativa.
                  Esse direito está garantido pelo Código de Defesa do Consumidor (Art. 49).
                </p>
              </div>
            </div>

            {/* Após 7 dias */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-300 font-semibold text-sm mb-1">Após 7 dias — cancelamento sem reembolso</p>
                <p className="text-dark-300 text-sm leading-relaxed">
                  Passado o prazo de 7 dias, não é possível obter reembolso do valor pago.
                  Você poderá <strong className="text-white">cancelar a assinatura</strong> a qualquer momento, mantendo o acesso Premium até o fim do período pago.
                </p>
              </div>
            </div>

            {/* Como solicitar */}
            <div>
              <p className="text-sm font-semibold text-white mb-3">Como solicitar o reembolso</p>
              <ol className="space-y-2.5">
                {[
                  'Entre em contato pelo WhatsApp ou e-mail de suporte dentro do prazo de 7 dias.',
                  'Informe o nome completo, e-mail da conta e o comprovante de pagamento (ID da transação Pix ou número do pedido).',
                  'Nossa equipe confirmará a solicitação e processará o reembolso via Mercado Pago.',
                  'O valor retorna à sua conta em até 5 dias úteis após a confirmação.',
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

            {/* Não se aplica */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-dark-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-dark-300 font-semibold text-sm mb-1">Casos sem direito a reembolso</p>
                <ul className="space-y-1 text-xs text-dark-400">
                  <li>• Solicitações feitas após 7 dias corridos da data do pagamento.</li>
                  <li>• Contas com uso comprovado dos recursos Premium (criação de mais de 1 site, etc.).</li>
                  <li>• Cancelamentos de renovação de assinatura (aplicam-se à próxima cobrança, não à vigente).</li>
                </ul>
              </div>
            </div>

            <div className="pt-1 border-t border-dark-800 flex items-center gap-3">
              <p className="text-xs text-dark-500 flex-1">Dúvidas sobre reembolso?</p>
              <button onClick={openWhatsApp} className="text-xs text-brand-400 hover:text-brand-300 font-medium">
                Falar com suporte →
              </button>
            </div>
          </div>
        </div>

        {/* Artigos */}
        <div className="card-dark p-0 overflow-hidden">
          <div className="p-4 border-b border-dark-800 flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-white">Artigos mais acessados</h3>
          </div>

          <div className="divide-y divide-dark-800">
            {ARTICLES.map((article) => {
              const isOpen = openArticle === article.title
              return (
                <div key={article.title}>
                  {/* Cabeçalho do artigo */}
                  <button
                    onClick={() => toggleArticle(article.title)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-dark-800/50 transition-colors text-left"
                  >
                    <Book className="w-4 h-4 text-dark-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-dark-200 text-sm font-medium group-hover:text-white">{article.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category] || 'text-dark-400 bg-dark-700'}`}>
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-dark-600">
                          <Clock className="w-3 h-3" /> {article.time} de leitura
                        </span>
                      </div>
                    </div>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-dark-500 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-dark-500 flex-shrink-0" />
                    }
                  </button>

                  {/* Conteúdo expandido */}
                  {isOpen && (
                    <div className="px-4 pb-5 bg-dark-900/50 space-y-4">
                      {article.content.map((block, i) => {
                        if (block.type === 'intro') {
                          return <p key={i} className="text-dark-300 text-sm leading-relaxed pt-1">{block.text}</p>
                        }
                        if (block.type === 'steps') {
                          return (
                            <ol key={i} className="space-y-2.5">
                              {block.items!.map((step, j) => (
                                <li key={j} className="flex items-start gap-3 text-sm text-dark-300">
                                  <span className="w-6 h-6 rounded-full bg-brand-400/20 text-brand-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {j + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          )
                        }
                        if (block.type === 'tip') {
                          return (
                            <div key={i} className="flex items-start gap-2.5 bg-brand-400/5 border border-brand-400/20 rounded-xl p-3">
                              <Zap className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-dark-300"><span className="font-semibold text-brand-400">Dica: </span>{block.text}</p>
                            </div>
                          )
                        }
                        if (block.type === 'note') {
                          return (
                            <div key={i} className="flex items-start gap-2.5 bg-dark-800 border border-dark-700 rounded-xl p-3">
                              <Book className="w-4 h-4 text-dark-400 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-dark-400"><span className="font-semibold text-white">Obs: </span>{block.text}</p>
                            </div>
                          )
                        }
                        return null
                      })}

                      <div className="pt-2 border-t border-dark-800 flex items-center gap-3">
                        <p className="text-xs text-dark-500 flex-1">Este artigo foi útil?</p>
                        <button onClick={openWhatsApp} className="text-xs text-brand-400 hover:text-brand-300 font-medium">
                          Falar com suporte →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
