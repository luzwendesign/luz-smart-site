'use client'
import { useState } from 'react'
import {
  Home, Image, Palette, Type, MousePointer, Globe, Code,
  BarChart2, ChevronDown, ChevronUp, Sparkles, Loader2,
  Eye, EyeOff, GripVertical, Plus, Trash2, Share2, Copy, CheckCircle, ExternalLink
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'property', label: 'Imóvel', icon: Home },
  { id: 'gallery', label: 'Galeria', icon: Image },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'fonts', label: 'Tipografia', icon: Type },
  { id: 'buttons', label: 'Botões', icon: MousePointer },
  { id: 'sections', label: 'Seções', icon: Eye },
  { id: 'share', label: 'Compartilhar', icon: Share2 },
  { id: 'seo', label: 'SEO', icon: Globe },
  { id: 'integrations', label: 'Pixel & Scripts', icon: Code },
  { id: 'stats', label: 'Stats', icon: BarChart2 },
]

const SECTION_LABELS: Record<string, string> = {
  hero:      'Hero Principal',
  features:  'Características',
  gallery:   'Galeria de Fotos',
  price_box: 'Preço + WhatsApp',
  about:     'Sobre o Imóvel',
  amenities: 'Itens Disponíveis',
  highlights:'Diferenciais',
  cta_mid:   'Chamada para Ação',
  location:  'Localização',
  agent:     'Corretor',
  contact:   'Formulário de Contato',
  footer:    'Rodapé',
}

export default function EditorPanel() {
  const { editorTab, setEditorTab, currentLP, updateCurrentLP, updatePropertyData } = useAppStore()
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic'])
  const [aiLoading, setAiLoading] = useState<string | null>(null)

  const lp = currentLP
  if (!lp) return null
  const { propertyData: p } = lp

  function toggleSection(id: string) {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  async function improveWithAI(field: string, value: string) {
    setAiLoading(field)
    try {
      const res = await fetch('/api/ai-improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value }),
      })
      const { improved } = await res.json()
      if (field === 'title') updatePropertyData({ title: improved })
      if (field === 'description') updatePropertyData({ description: improved })
      toast.success('Texto melhorado pela IA!')
    } catch {
      toast.error('Erro ao processar com IA')
    } finally {
      setAiLoading(null)
    }
  }

  return (
    <div className="flex flex-col h-full bg-dark-950 editor-panel w-[380px] flex-shrink-0">
      {/* Tab bar */}
      <div className="border-b border-dark-800 overflow-x-auto">
        <div className="flex px-2 pt-2 gap-0.5 min-w-max">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setEditorTab(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all whitespace-nowrap',
                editorTab === id
                  ? 'bg-dark-800 text-brand-400 border-t border-x border-dark-700'
                  : 'text-dark-500 hover:text-dark-300'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto">
        {editorTab === 'property' && <PropertyTab lp={lp} p={p} toggleSection={toggleSection} expandedSections={expandedSections} updatePropertyData={updatePropertyData} improveWithAI={improveWithAI} aiLoading={aiLoading} />}
        {editorTab === 'gallery' && <GalleryTab p={p} updatePropertyData={updatePropertyData} />}
        {editorTab === 'design' && <DesignTab lp={lp} updateCurrentLP={updateCurrentLP} />}
        {editorTab === 'fonts' && <FontsTab lp={lp} updateCurrentLP={updateCurrentLP} />}
        {editorTab === 'buttons' && <ButtonsTab lp={lp} updateCurrentLP={updateCurrentLP} />}
        {editorTab === 'sections' && <SectionsTab lp={lp} updateCurrentLP={updateCurrentLP} />}
        {editorTab === 'share' && <ShareTab lp={lp} updateCurrentLP={updateCurrentLP} />}
        {editorTab === 'seo' && <SEOTab p={p} updatePropertyData={updatePropertyData} />}
        {editorTab === 'integrations' && <IntegrationsTab lp={lp} updateCurrentLP={updateCurrentLP} />}
        {editorTab === 'stats' && <StatsTab lp={lp} />}
      </div>
    </div>
  )
}

// ─── Property Tab ─────────────────────────────────────────────────────────────
function PropertyTab({ lp, p, toggleSection, expandedSections, updatePropertyData, improveWithAI, aiLoading }: any) {
  return (
    <div className="p-4 space-y-3">
      <Section id="basic" title="Informações Gerais" expanded={expandedSections.includes('basic')} onToggle={() => toggleSection('basic')}>
        {/* Hero — cabeçalho do site */}
        <div className="bg-brand-400/5 border border-brand-400/20 rounded-xl p-3 mb-1 space-y-3">
          <p className="text-xs font-semibold text-brand-400 uppercase tracking-wide">Cabeçalho do site (Hero)</p>
          <Field label="Chamada principal">
            <div className="relative">
              <input
                className="input-dark pr-10"
                placeholder={p.title || 'Ex: Seu novo lar te espera em Pinheiros'}
                value={p.heroHeadline || ''}
                onChange={(e) => updatePropertyData({ heroHeadline: e.target.value })}
              />
              <AIButton field="title" value={p.heroHeadline || p.title} loading={aiLoading} onImprove={async (field, val) => {
                const res = await fetch('/api/ai-improve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value: val }) })
                const { improved } = await res.json()
                updatePropertyData({ heroHeadline: improved })
              }} />
            </div>
            <p className="text-xs text-dark-600 mt-1">Título de impacto exibido no topo da página. Se vazio, usa o título do imóvel.</p>
          </Field>
          <Field label="Subtítulo / Tagline">
            <input
              className="input-dark"
              placeholder="Ex: Localização privilegiada com acabamento premium"
              value={p.heroSubtitle || ''}
              onChange={(e) => updatePropertyData({ heroSubtitle: e.target.value })}
            />
            <p className="text-xs text-dark-600 mt-1">Frase curta abaixo do título. Se vazio, usa trecho da descrição.</p>
          </Field>
        </div>

        {/* Dados do imóvel */}
        <Field label="Título interno do imóvel">
          <div className="relative">
            <input
              className="input-dark pr-10"
              value={p.title}
              onChange={(e) => updatePropertyData({ title: e.target.value })}
            />
            <AIButton field="title" value={p.title} loading={aiLoading} onImprove={improveWithAI} />
          </div>
          <p className="text-xs text-dark-600 mt-1">Usado em listas, SEO e como fallback do hero.</p>
        </Field>
        <Field label="Descrição completa do imóvel">
          <div className="relative">
            <textarea
              className="input-dark resize-none"
              rows={5}
              value={p.description}
              onChange={(e) => updatePropertyData({ description: e.target.value })}
            />
            <AIButton field="description" value={p.description} loading={aiLoading} onImprove={improveWithAI} bottom />
          </div>
          <p className="text-xs text-dark-600 mt-1">Texto completo exibido na seção "Sobre o Imóvel".</p>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Preço do imóvel">
            <input className="input-dark" value={p.priceFormatted} onChange={(e) => updatePropertyData({ priceFormatted: e.target.value })} />
          </Field>
          <Field label="Área privativa">
            <input className="input-dark" value={`${p.area} m²`} onChange={(e) => updatePropertyData({ area: e.target.value.replace(/\D/g,'') })} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Condomínio">
            <input className="input-dark" placeholder="R$ 850/mês" value={p.condoFee || ''} onChange={(e) => updatePropertyData({ condoFee: e.target.value })} />
          </Field>
          <Field label="IPTU">
            <input className="input-dark" placeholder="R$ 1.200/ano" value={p.iptu || ''} onChange={(e) => updatePropertyData({ iptu: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quartos">
            <Select value={String(p.bedrooms)} options={['0','1','2','3','4','5','6']} onChange={(v) => updatePropertyData({ bedrooms: Number(v) })} />
          </Field>
          <Field label="Banheiros">
            <Select value={String(p.bathrooms)} options={['1','2','3','4','5']} onChange={(v) => updatePropertyData({ bathrooms: Number(v) })} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vagas de garagem">
            <Select value={String(p.parking)} options={['0','1','2','3','4','5']} onChange={(v) => updatePropertyData({ parking: Number(v) })} />
          </Field>
          <Field label="Suíte">
            <Select value={String(p.suites)} options={['0','1','2','3','4']} onChange={(v) => updatePropertyData({ suites: Number(v) })} />
          </Field>
        </div>
      </Section>

      <Section id="highlights" title="Destaques do imóvel" expanded={expandedSections.includes('highlights')} onToggle={() => toggleSection('highlights')}>
        <div className="space-y-2">
          {p.highlights.map((h: string, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-brand-400"
              />
              <input
                className="input-dark flex-1"
                value={h}
                onChange={(e) => {
                  const newH = [...p.highlights]
                  newH[i] = e.target.value
                  updatePropertyData({ highlights: newH })
                }}
              />
            </div>
          ))}
          <button
            onClick={() => updatePropertyData({ highlights: [...p.highlights, 'Novo destaque'] })}
            className="text-brand-400 text-sm flex items-center gap-1 hover:text-brand-300"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar destaque
          </button>
        </div>
      </Section>

      <Section id="amenities" title="Itens do imóvel" expanded={expandedSections.includes('amenities')} onToggle={() => toggleSection('amenities')}>
        <p className="text-xs text-dark-500 mb-2">Liste o que está disponível e o que não está no imóvel.</p>

        <div className="mb-3">
          <label className="text-xs font-semibold text-green-400 flex items-center gap-1 mb-2">
            ✓ Itens disponíveis
          </label>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {(p.availableItems || []).map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input-dark flex-1 text-sm py-2"
                  value={item}
                  onChange={(e) => {
                    const arr = [...(p.availableItems || [])]
                    arr[i] = e.target.value
                    updatePropertyData({ availableItems: arr })
                  }}
                />
                <button
                  onClick={() => {
                    const arr = [...(p.availableItems || [])]
                    arr.splice(i, 1)
                    updatePropertyData({ availableItems: arr })
                  }}
                  className="p-1.5 text-dark-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => updatePropertyData({ availableItems: [...(p.availableItems || []), ''] })}
            className="text-green-400 text-xs flex items-center gap-1 hover:text-green-300 mt-2"
          >
            <Plus className="w-3 h-3" /> Adicionar item disponível
          </button>
        </div>

        <div className="border-t border-dark-800 pt-3">
          <label className="text-xs font-semibold text-dark-500 flex items-center gap-1 mb-2">
            ✕ Itens indisponíveis
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {(p.unavailableItems || []).map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input-dark flex-1 text-sm py-2 opacity-60"
                  value={item}
                  onChange={(e) => {
                    const arr = [...(p.unavailableItems || [])]
                    arr[i] = e.target.value
                    updatePropertyData({ unavailableItems: arr })
                  }}
                />
                <button
                  onClick={() => {
                    const arr = [...(p.unavailableItems || [])]
                    arr.splice(i, 1)
                    updatePropertyData({ unavailableItems: arr })
                  }}
                  className="p-1.5 text-dark-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => updatePropertyData({ unavailableItems: [...(p.unavailableItems || []), ''] })}
            className="text-dark-500 text-xs flex items-center gap-1 hover:text-dark-400 mt-2"
          >
            <Plus className="w-3 h-3" /> Adicionar item indisponível
          </button>
        </div>
      </Section>

      <Section id="contact" title="Corretor / Contato" expanded={expandedSections.includes('contact')} onToggle={() => toggleSection('contact')}>
        <Field label="Nome do corretor">
          <input className="input-dark" value={p.agentName} onChange={(e) => updatePropertyData({ agentName: e.target.value })} />
        </Field>
        <Field label="Nome da imobiliária">
          <input className="input-dark" value={p.agencyName} onChange={(e) => updatePropertyData({ agencyName: e.target.value })} />
        </Field>
        <Field label="CRECI">
          <input className="input-dark" value={p.agentCRECI || ''} onChange={(e) => updatePropertyData({ agentCRECI: e.target.value })} />
        </Field>
        <Field label="Telefone">
          <input className="input-dark" value={p.phone} onChange={(e) => updatePropertyData({ phone: e.target.value })} />
        </Field>
        <Field label="WhatsApp (com DDI: 55 + DDD + número)">
          <input className="input-dark" placeholder="5511999999999" value={p.whatsapp} onChange={(e) => updatePropertyData({ whatsapp: e.target.value })} />
        </Field>
        <Field label="E-mail">
          <input className="input-dark" value={p.email} onChange={(e) => updatePropertyData({ email: e.target.value })} />
        </Field>
      </Section>

      <Section id="social" title="Redes Sociais" expanded={expandedSections.includes('social')} onToggle={() => toggleSection('social')}>
        <p className="text-xs text-dark-500 mb-1">Aparecem no rodapé do site. Deixe em branco para ocultar.</p>
        <Field label="Instagram">
          <div className="flex items-center gap-2">
            <span className="text-dark-500 text-sm font-semibold flex-shrink-0">@</span>
            <input
              className="input-dark flex-1"
              placeholder="seuperfil"
              value={(p.instagram || '').replace(/^@/, '')}
              onChange={(e) => updatePropertyData({ instagram: e.target.value ? `@${e.target.value.replace(/^@/, '')}` : '' })}
            />
          </div>
        </Field>
        <Field label="TikTok">
          <div className="flex items-center gap-2">
            <span className="text-dark-500 text-sm font-semibold flex-shrink-0">@</span>
            <input
              className="input-dark flex-1"
              placeholder="seuperfil"
              value={(p.tiktok || '').replace(/^@/, '')}
              onChange={(e) => updatePropertyData({ tiktok: e.target.value ? `@${e.target.value.replace(/^@/, '')}` : '' })}
            />
          </div>
        </Field>
        <Field label="Facebook">
          <div className="flex items-center gap-2">
            <span className="text-dark-500 text-xs text-dark-400 flex-shrink-0 whitespace-nowrap">facebook.com/</span>
            <input
              className="input-dark flex-1"
              placeholder="suapagina"
              value={(p.facebook || '').replace(/^facebook\.com\//, '').replace(/^https?:\/\/(www\.)?facebook\.com\//, '')}
              onChange={(e) => updatePropertyData({ facebook: e.target.value })}
            />
          </div>
        </Field>
      </Section>

      <Section id="location" title="Localização" expanded={expandedSections.includes('location')} onToggle={() => toggleSection('location')}>
        <Field label="CEP">
          <CepField value={p.zipCode || ''} onUpdate={updatePropertyData} />
        </Field>
        <Field label="Endereço">
          <input className="input-dark" value={p.address} onChange={(e) => updatePropertyData({ address: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bairro">
            <input className="input-dark" value={p.neighborhood} onChange={(e) => updatePropertyData({ neighborhood: e.target.value })} />
          </Field>
          <Field label="Cidade">
            <input className="input-dark" value={p.city} onChange={(e) => updatePropertyData({ city: e.target.value })} />
          </Field>
        </div>
        <Field label="Estado (UF)">
          <input className="input-dark" maxLength={2} value={p.state} onChange={(e) => updatePropertyData({ state: e.target.value.toUpperCase() })} placeholder="SP" />
        </Field>
      </Section>
    </div>
  )
}

// ─── Gallery Tab ──────────────────────────────────────────────────────────────
function GalleryTab({ p, updatePropertyData }: any) {
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (ev) => resolve(ev.target?.result as string)
          reader.readAsDataURL(file)
        })
    )
    Promise.all(readers).then((dataUrls) => {
      updatePropertyData({ images: [...p.images, ...dataUrls] })
    })
    // reset input so same file can be picked again
    e.target.value = ''
  }

  function moveImage(from: number, to: number) {
    const imgs = [...p.images]
    const [moved] = imgs.splice(from, 1)
    imgs.splice(to, 0, moved)
    updatePropertyData({ images: imgs })
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-400">
          <span className="text-white font-semibold">{p.images.length}</span> foto{p.images.length !== 1 ? 's' : ''}
          {p.images.length > 0 && ' · arraste para reordenar'}
        </p>
        <label className="btn-primary text-xs py-2 px-3 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Adicionar fotos
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {p.images.length === 0 ? (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-dark-700 rounded-2xl p-10 text-center cursor-pointer hover:border-brand-400/50 hover:bg-brand-400/5 transition-all">
          <Image className="w-10 h-10 text-dark-600 mb-3" />
          <p className="text-dark-400 text-sm font-medium mb-1">Clique para adicionar fotos</p>
          <p className="text-dark-600 text-xs">JPG, PNG, WEBP — múltiplas fotos permitidas</p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {p.images.map((img: string, i: number) => (
            <div key={i} className="relative group rounded-xl overflow-hidden bg-dark-800" style={{ aspectRatio: '4/3' }}>
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23334155" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2364748b" font-size="12">Sem foto</text></svg>' }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i > 0 && (
                  <button
                    onClick={() => moveImage(i, i - 1)}
                    className="p-1.5 bg-dark-700 rounded-lg text-white text-xs font-bold"
                    title="Mover para esquerda"
                  >←</button>
                )}
                <button
                  onClick={() => {
                    const imgs = [...p.images]
                    imgs.splice(i, 1)
                    updatePropertyData({ images: imgs })
                  }}
                  className="p-2 bg-red-500 rounded-lg text-white"
                  title="Remover foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {i < p.images.length - 1 && (
                  <button
                    onClick={() => moveImage(i, i + 1)}
                    className="p-1.5 bg-dark-700 rounded-lg text-white text-xs font-bold"
                    title="Mover para direita"
                  >→</button>
                )}
              </div>
              <div className="absolute top-2 left-2 w-6 h-6 bg-dark-900/80 rounded-lg flex items-center justify-center text-xs text-dark-300 font-semibold">
                {i + 1}
              </div>
              {i === 0 && (
                <div className="absolute bottom-2 left-2 bg-brand-400 text-dark-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Capa
                </div>
              )}
            </div>
          ))}

          {/* Add more tile */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-dark-700 rounded-xl cursor-pointer hover:border-brand-400/50 hover:bg-brand-400/5 transition-all" style={{ aspectRatio: '4/3' }}>
            <Plus className="w-6 h-6 text-dark-500 mb-1" />
            <span className="text-xs text-dark-500">Adicionar</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      <p className="text-xs text-dark-600 text-center">
        A primeira foto será usada como imagem de capa da landing page
      </p>
    </div>
  )
}

// ─── Design Tab ───────────────────────────────────────────────────────────────
const THEMES = [
  { id: 'modern',  label: 'Moderno',     desc: 'Dark + Âmbar',    primary: '#f59e0b', accent: '#fbbf24', bg: '#0f172a', previewBg: '#1e293b' },
  { id: 'clean',   label: 'Clean',       desc: 'Branco puro',     primary: '#0ea5e9', accent: '#38bdf8', bg: '#ffffff', previewBg: '#f8fafc' },
  { id: 'luxury',  label: 'Luxo',        desc: 'Escuro + Dourado', primary: '#d4af37', accent: '#f5d76e', bg: '#0a0a0a', previewBg: '#111111' },
  { id: 'minimal', label: 'Minimalista', desc: 'Neutro suave',    primary: '#334155', accent: '#64748b', bg: '#f8fafc', previewBg: '#f1f5f9' },
]

function DesignTab({ lp, updateCurrentLP }: any) {
  function applyTheme(t: typeof THEMES[0]) {
    updateCurrentLP({ theme: t.id, primaryColor: t.primary, accentColor: t.accent })
  }

  return (
    <div className="p-4 space-y-5">
      <div>
        <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 block">Tema</label>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => applyTheme(t)}
              className={cn(
                'p-3 rounded-xl border-2 text-left transition-all',
                lp.theme === t.id ? 'border-brand-400 bg-brand-400/10' : 'border-dark-700 hover:border-dark-600'
              )}
            >
              <div className="w-full h-10 rounded-lg mb-2 relative overflow-hidden" style={{ background: t.previewBg }}>
                <div className="absolute bottom-1 left-2 right-2 h-2 rounded" style={{ background: t.primary }} />
              </div>
              <p className="text-sm font-semibold text-white">{t.label}</p>
              <p className="text-xs text-dark-400">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 block">Cor Principal</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={lp.primaryColor}
            onChange={(e) => updateCurrentLP({ primaryColor: e.target.value })}
            className="w-12 h-12 rounded-xl cursor-pointer border border-dark-700 bg-transparent"
          />
          <input
            className="input-dark flex-1"
            value={lp.primaryColor}
            onChange={(e) => updateCurrentLP({ primaryColor: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 block">Cor de Destaque</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={lp.accentColor}
            onChange={(e) => updateCurrentLP({ accentColor: e.target.value })}
            className="w-12 h-12 rounded-xl cursor-pointer border border-dark-700 bg-transparent"
          />
          <input
            className="input-dark flex-1"
            value={lp.accentColor}
            onChange={(e) => updateCurrentLP({ accentColor: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 block">Arredondamento dos botões</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'none',   label: 'Zero',  className: 'rounded-none' },
            { id: 'small',  label: 'Suave', className: 'rounded' },
            { id: 'medium', label: 'Médio', className: 'rounded-lg' },
            { id: 'large',  label: 'Grande',className: 'rounded-xl' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => updateCurrentLP({ borderRadius: r.id })}
              className={cn(
                'py-2 text-xs font-medium border-2 transition-all',
                r.className,
                lp.borderRadius === r.id ? 'border-brand-400 text-brand-400 bg-brand-400/10' : 'border-dark-700 text-dark-400 hover:border-dark-500'
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        {/* Preview dos botões com arredondamento atual */}
        <div className="mt-3 p-3 bg-dark-800 rounded-xl">
          <p className="text-xs text-dark-500 mb-2">Preview</p>
          <div
            className={cn('py-2 px-4 text-center text-xs font-bold text-dark-950',
              lp.borderRadius === 'none' ? 'rounded-none' :
              lp.borderRadius === 'small' ? 'rounded' :
              lp.borderRadius === 'medium' ? 'rounded-lg' : 'rounded-xl'
            )}
            style={{ background: lp.primaryColor }}
          >
            Agendar Visita
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Fonts Tab ────────────────────────────────────────────────────────────────
const GOOGLE_FONTS = [
  { id: 'plus-jakarta', label: 'Plus Jakarta Sans', url: 'Plus+Jakarta+Sans:wght@400;500;600;700;800;900', stack: "'Plus Jakarta Sans', sans-serif", category: 'Moderno' },
  { id: 'inter',        label: 'Inter',             url: 'Inter:wght@300;400;500;600;700;800',             stack: "'Inter', sans-serif",             category: 'Moderno' },
  { id: 'poppins',      label: 'Poppins',           url: 'Poppins:wght@300;400;500;600;700;800',           stack: "'Poppins', sans-serif",           category: 'Moderno' },
  { id: 'montserrat',   label: 'Montserrat',        url: 'Montserrat:wght@300;400;500;600;700;800',        stack: "'Montserrat', sans-serif",        category: 'Moderno' },
  { id: 'raleway',      label: 'Raleway',           url: 'Raleway:wght@300;400;500;600;700;800',           stack: "'Raleway', sans-serif",           category: 'Elegante' },
  { id: 'nunito',       label: 'Nunito',            url: 'Nunito:wght@300;400;500;600;700;800',            stack: "'Nunito', sans-serif",            category: 'Amigável' },
  { id: 'lato',         label: 'Lato',              url: 'Lato:wght@300;400;700;900',                      stack: "'Lato', sans-serif",              category: 'Clássico' },
  { id: 'roboto',       label: 'Roboto',            url: 'Roboto:wght@300;400;500;700;900',                stack: "'Roboto', sans-serif",            category: 'Clássico' },
  { id: 'oswald',       label: 'Oswald',            url: 'Oswald:wght@300;400;500;600;700',                stack: "'Oswald', sans-serif",            category: 'Impacto' },
  { id: 'playfair',     label: 'Playfair Display',  url: 'Playfair+Display:wght@400;500;600;700;800',      stack: "'Playfair Display', serif",       category: 'Luxo/Serif' },
  { id: 'merriweather', label: 'Merriweather',      url: 'Merriweather:wght@300;400;700;900',              stack: "'Merriweather', serif",           category: 'Luxo/Serif' },
  { id: 'dm-sans',      label: 'DM Sans',           url: 'DM+Sans:wght@300;400;500;600;700',               stack: "'DM Sans', sans-serif",           category: 'Minimalista' },
]

const FONT_SIZES = [
  { id: 'small',  label: 'Pequeno',  scale: 0.9 },
  { id: 'normal', label: 'Normal',   scale: 1.0 },
  { id: 'large',  label: 'Grande',   scale: 1.1 },
  { id: 'xlarge', label: 'Enorme',   scale: 1.2 },
]

function FontsTab({ lp, updateCurrentLP }: any) {
  const currentFont = lp.fontFamily || 'plus-jakarta'
  const currentSize = lp.fontSize || 'normal'
  const grouped = GOOGLE_FONTS.reduce((acc: any, f) => {
    if (!acc[f.category]) acc[f.category] = []
    acc[f.category].push(f)
    return acc
  }, {} as Record<string, typeof GOOGLE_FONTS>)

  return (
    <div className="p-4 space-y-5">
      <div>
        <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-1 block">Fonte principal</label>
        <p className="text-xs text-dark-500 mb-3">Google Fonts carregadas automaticamente</p>
        {Object.entries(grouped).map(([category, fonts]) => (
          <div key={category} className="mb-4">
            <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">{category}</p>
            <div className="space-y-1.5">
              {(fonts as typeof GOOGLE_FONTS).map((font) => (
                <button
                  key={font.id}
                  onClick={() => updateCurrentLP({ fontFamily: font.id })}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left',
                    currentFont === font.id
                      ? 'border-brand-400 bg-brand-400/10'
                      : 'border-dark-700 hover:border-dark-600 bg-dark-800/50'
                  )}
                >
                  <span
                    className="text-base text-white"
                    style={{ fontFamily: font.stack }}
                  >
                    {font.label}
                  </span>
                  {currentFont === font.id && (
                    <span className="text-xs text-brand-400 font-semibold">✓ Ativa</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 block">Tamanho dos textos</label>
        <div className="grid grid-cols-4 gap-2">
          {FONT_SIZES.map((s) => (
            <button
              key={s.id}
              onClick={() => updateCurrentLP({ fontSize: s.id })}
              className={cn(
                'py-2 text-xs font-medium border-2 rounded-xl transition-all',
                currentSize === s.id ? 'border-brand-400 text-brand-400 bg-brand-400/10' : 'border-dark-700 text-dark-400 hover:border-dark-500'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-dark-800 rounded-xl p-4">
        <p className="text-xs text-dark-500 mb-3">Preview da tipografia</p>
        {(() => {
          const f = GOOGLE_FONTS.find((x) => x.id === currentFont) || GOOGLE_FONTS[0]
          const sz = FONT_SIZES.find((x) => x.id === currentSize) || FONT_SIZES[1]
          return (
            <div style={{ fontFamily: f.stack, zoom: sz.scale }}>
              <p className="text-white font-bold text-xl mb-1">Apartamento no Centro</p>
              <p className="text-dark-400 text-sm">Localização privilegiada e acabamento premium</p>
              <p className="font-bold text-lg mt-2" style={{ color: lp.primaryColor }}>R$ 620.000,00</p>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// ─── Buttons Tab ──────────────────────────────────────────────────────────────
function ButtonsTab({ lp, updateCurrentLP }: any) {
  return (
    <div className="p-4 space-y-4">
      <Field label="Botão principal (CTA)">
        <input
          className="input-dark"
          value={lp.ctaPrimary}
          onChange={(e) => updateCurrentLP({ ctaPrimary: e.target.value })}
        />
      </Field>
      <Field label="Botão WhatsApp">
        <input
          className="input-dark"
          value={lp.ctaSecondary}
          onChange={(e) => updateCurrentLP({ ctaSecondary: e.target.value })}
        />
      </Field>
      <Field label="Número WhatsApp (com DDI)">
        <input
          className="input-dark"
          placeholder="5511999999999"
          value={lp.propertyData.whatsapp}
          onChange={(e) => updateCurrentLP({ propertyData: { ...lp.propertyData, whatsapp: e.target.value } })}
        />
      </Field>
      <div className="card-dark">
        <p className="text-xs text-dark-400 mb-2">Preview dos botões</p>
        <div className="flex flex-col gap-2">
          <div
            className="py-3 px-5 text-center rounded-xl font-bold text-dark-950 text-sm"
            style={{ background: `linear-gradient(135deg, ${lp.primaryColor}, ${lp.accentColor})` }}
          >
            {lp.ctaPrimary}
          </div>
          <div className="py-3 px-5 text-center rounded-xl font-bold text-white text-sm bg-green-600">
            {lp.ctaSecondary}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sections Tab ─────────────────────────────────────────────────────────────
function SectionsTab({ lp, updateCurrentLP }: any) {
  function toggleSectionEnabled(id: string) {
    const sections = lp.sections.map((s: any) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    )
    updateCurrentLP({ sections })
  }

  return (
    <div className="p-4 space-y-2">
      <p className="text-xs text-dark-400 mb-3">Ative/desative seções da landing page</p>
      {lp.sections.sort((a: any, b: any) => a.order - b.order).map((s: any) => (
        <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800 border border-dark-700">
          <GripVertical className="w-4 h-4 text-dark-600 cursor-grab" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{SECTION_LABELS[s.type] || s.type}</p>
          </div>
          <button
            onClick={() => toggleSectionEnabled(s.id)}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              s.enabled ? 'text-brand-400 bg-brand-400/10' : 'text-dark-600 bg-dark-700'
            )}
          >
            {s.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── SEO Tab ──────────────────────────────────────────────────────────────────
function SEOTab({ p, updatePropertyData }: any) {
  return (
    <div className="p-4 space-y-4">
      <div className="card-dark text-xs text-dark-400 space-y-1">
        <p className="font-semibold text-white text-sm">Preview Google</p>
        <p className="text-brand-400 truncate">{p.slug ? `luzsmartsite.com.br/${p.slug}` : 'seu-dominio.com.br/slug'}</p>
        <p className="text-blue-400 font-medium">{p.seoTitle || p.title}</p>
        <p className="text-dark-300 line-clamp-2">{p.seoDescription}</p>
      </div>
      <Field label="Slug (URL)">
        <input className="input-dark" value={p.slug || ''} onChange={(e) => updatePropertyData({ slug: e.target.value })} placeholder="apartamento-centro-sp" />
      </Field>
      <Field label="Meta Title">
        <input className="input-dark" value={p.seoTitle || ''} onChange={(e) => updatePropertyData({ seoTitle: e.target.value })} />
        <p className="text-xs text-dark-500 mt-1">{(p.seoTitle || '').length}/60 caracteres</p>
      </Field>
      <Field label="Meta Description">
        <textarea className="input-dark resize-none" rows={3} value={p.seoDescription || ''} onChange={(e) => updatePropertyData({ seoDescription: e.target.value })} />
        <p className="text-xs text-dark-500 mt-1">{(p.seoDescription || '').length}/160 caracteres</p>
      </Field>
    </div>
  )
}

// ─── Integrations Tab ─────────────────────────────────────────────────────────
function IntegrationsTab({ lp, updateCurrentLP }: any) {
  return (
    <div className="p-4 space-y-4">
      <Field label="Pixel Meta / Facebook">
        <input className="input-dark" value={lp.pixelMeta || ''} onChange={(e) => updateCurrentLP({ pixelMeta: e.target.value })} placeholder="123456789012345" />
      </Field>
      <Field label="Google Analytics (ID)">
        <input className="input-dark" value={lp.googleAnalytics || ''} onChange={(e) => updateCurrentLP({ googleAnalytics: e.target.value })} placeholder="G-XXXXXXXXXX" />
      </Field>
      <Field label="Google Tag Manager (ID)">
        <input className="input-dark" value={lp.googleTagManager || ''} onChange={(e) => updateCurrentLP({ googleTagManager: e.target.value })} placeholder="GTM-XXXXXXX" />
      </Field>
      <Field label="Scripts personalizados">
        <textarea className="input-dark font-mono text-xs resize-none" rows={5} value={lp.customScripts || ''} onChange={(e) => updateCurrentLP({ customScripts: e.target.value })} placeholder="<!-- Seu script aqui -->" />
      </Field>
    </div>
  )
}

// ─── Domain Tab ───────────────────────────────────────────────────────────────
function DomainTab({ lp, updateCurrentLP }: any) {
  return (
    <div className="p-4 space-y-4">
      <div className="card-dark">
        <p className="text-sm font-semibold text-white mb-1">Subdomínio gratuito</p>
        <p className="text-xs text-dark-400 mb-3">Disponível no plano gratuito</p>
        <div className="flex items-center gap-2">
          <input
            className="input-dark flex-1"
            value={lp.subdomain || ''}
            onChange={(e) => updateCurrentLP({ subdomain: e.target.value })}
            placeholder="meu-imovel"
          />
          <span className="text-dark-400 text-sm whitespace-nowrap">.luzsite.com.br</span>
        </div>
      </div>
      <div className="card-dark border-brand-500/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-premium">Premium</span>
          <p className="text-sm font-semibold text-white">Domínio personalizado</p>
        </div>
        <p className="text-xs text-dark-400 mb-3">Aponte seu domínio próprio para a landing page</p>
        <input
          className="input-dark"
          value={lp.domain || ''}
          onChange={(e) => updateCurrentLP({ domain: e.target.value })}
          placeholder="www.seudominio.com.br"
          disabled={!lp.isPremium}
        />
        {!lp.isPremium && (
          <p className="text-xs text-brand-400 mt-2">Upgrade para Premium para usar domínio próprio</p>
        )}
      </div>
    </div>
  )
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────
function StatsTab({ lp }: any) {
  const stats = [
    { label: 'Visualizações', value: '—', sub: 'Publique o site para ver' },
    { label: 'Leads captados', value: '0', sub: 'Formulários enviados' },
    { label: 'Cliques WhatsApp', value: '—', sub: 'Botões clicados' },
    { label: 'Taxa de conversão', value: '—', sub: 'Leads / Visualizações' },
  ]
  return (
    <div className="p-4 space-y-4">
      <div className="card-dark text-center py-3">
        <p className="text-xs text-dark-400 mb-1">Status do site</p>
        <span className={`text-sm font-bold ${lp.published ? 'text-green-400' : 'text-dark-500'}`}>
          {lp.published ? '● Publicado' : '○ Não publicado'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card-dark text-center">
            <p className="text-2xl font-black text-white mb-0.5">{s.value}</p>
            <p className="text-xs font-semibold text-dark-300">{s.label}</p>
            <p className="text-xs text-dark-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="card-dark">
        <p className="text-xs font-semibold text-dark-400 mb-2">Informações do site</p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-dark-300">
            <span>Criado em</span>
            <span>{new Date(lp.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex justify-between text-dark-300">
            <span>Última atualização</span>
            <span>{new Date(lp.updatedAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex justify-between text-dark-300">
            <span>Seções ativas</span>
            <span>{(lp.sections || []).filter((s: any) => s.enabled).length} de {(lp.sections || []).length}</span>
          </div>
          <div className="flex justify-between text-dark-300">
            <span>Fotos</span>
            <span>{(lp.propertyData?.images || []).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Section({ id, title, expanded, onToggle, children }: any) {
  return (
    <div className="editor-section rounded-xl overflow-hidden border border-dark-800">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-dark-800/50 transition-colors"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
      </button>
      {expanded && <div className="p-3.5 pt-0 space-y-3 bg-dark-900/30">{children}</div>}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-dark-400">{label}</label>
      {children}
    </div>
  )
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select
      className="input-dark"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

function CepField({ value, onUpdate }: { value: string; onUpdate: (patch: any) => void }) {
  const [cep, setCep] = useState(value)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  async function fetchCep(rawCep: string) {
    const digits = rawCep.replace(/\D/g, '')
    if (digits.length !== 8) return
    setLoading(true)
    setStatus('idle')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (data.erro) { setStatus('error'); return }
      onUpdate({
        zipCode: digits,
        address: data.logradouro ? `${data.logradouro}, ${data.complemento || ''}`.trim().replace(/,\s*$/, '') : '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      })
      setStatus('ok')
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  function formatCep(v: string) {
    const d = v.replace(/\D/g, '').substring(0, 8)
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        className="input-dark flex-1"
        placeholder="00000-000"
        value={formatCep(cep)}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, '')
          setCep(v)
          setStatus('idle')
          if (v.length === 8) fetchCep(v)
        }}
        maxLength={9}
      />
      {loading && <Loader2 className="w-4 h-4 text-brand-400 animate-spin flex-shrink-0" />}
      {status === 'ok' && <span className="text-green-400 text-xs font-semibold flex-shrink-0">✓ OK</span>}
      {status === 'error' && <span className="text-red-400 text-xs flex-shrink-0">CEP inválido</span>}
    </div>
  )
}

// ─── Share Tab ────────────────────────────────────────────────────────────────
function ShareTab({ lp, updateCurrentLP }: any) {
  const [slug, setSlug] = useState(lp.customSlug || '')
  const [copied, setCopied] = useState(false)
  const [slugError, setSlugError] = useState('')

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://luz-smart-site.vercel.app'
  const shareUrl = slug ? `${baseUrl}/p/${slug}` : null
  const previewUrl = `${baseUrl}/preview/${lp.id}`

  function sanitizeSlug(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // remove acentos
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function handleSlugChange(value: string) {
    const clean = sanitizeSlug(value)
    setSlug(clean)
    setSlugError('')
  }

  function saveSlug() {
    if (!slug) { setSlugError('Digite um link personalizado.'); return }
    if (slug.length < 3) { setSlugError('Mínimo 3 caracteres.'); return }
    updateCurrentLP({ customSlug: slug })
    toast.success('Link personalizado salvo!')
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link copiado!')
  }

  return (
    <div className="p-4 space-y-4">
      {/* Link personalizado */}
      <div className="card-dark p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Share2 className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-bold text-white">Link personalizado</span>
        </div>
        <p className="text-xs text-dark-400">
          Crie um link amigável para compartilhar com seus clientes.
        </p>

        <div>
          <label className="block text-xs font-semibold text-dark-400 mb-1.5">Seu link</label>
          <div className="flex items-center gap-1.5 bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-xs">
            <span className="text-dark-500 whitespace-nowrap">{baseUrl}/p/</span>
            <input
              className="flex-1 bg-transparent text-white focus:outline-none min-w-0"
              placeholder="meu-apartamento-centro"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
            />
          </div>
          {slugError && <p className="text-red-400 text-xs mt-1">{slugError}</p>}
          <p className="text-dark-600 text-xs mt-1">Só letras, números e hífens. Sem espaço.</p>
        </div>

        <button onClick={saveSlug} className="btn-primary w-full justify-center text-xs py-2.5">
          Salvar link
        </button>
      </div>

      {/* Link amigável gerado */}
      {shareUrl && (
        <div className="card-dark p-4 space-y-3">
          <p className="text-xs font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" /> Link para compartilhar
          </p>
          <div className="bg-dark-800 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <span className="text-xs text-brand-400 flex-1 truncate">{shareUrl}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => copyUrl(shareUrl)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-brand-400/10 text-brand-400 hover:bg-brand-400/20 text-xs font-semibold transition-colors"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar link'}
            </button>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-dark-700 text-dark-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Ver
            </a>
          </div>
        </div>
      )}

      {/* Link de preview interno */}
      <div className="card-dark p-4 space-y-3">
        <p className="text-xs font-bold text-white">Link de preview (interno)</p>
        <p className="text-xs text-dark-400">Use para visualizar antes de compartilhar.</p>
        <div className="bg-dark-800 rounded-xl px-3 py-2.5 flex items-center gap-2">
          <span className="text-xs text-dark-400 flex-1 truncate">{previewUrl}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => copyUrl(previewUrl)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-dark-700 text-dark-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copiar
          </button>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-dark-700 text-dark-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Abrir
          </a>
        </div>
      </div>

      {/* Dica de compartilhamento */}
      <div className="bg-brand-400/5 border border-brand-400/20 rounded-xl p-4">
        <p className="text-xs font-semibold text-brand-400 mb-2">💡 Como compartilhar</p>
        <ul className="text-xs text-dark-400 space-y-1.5">
          <li>• Copie o link personalizado acima</li>
          <li>• Envie pelo WhatsApp, Instagram ou e-mail</li>
          <li>• O cliente abre no celular sem precisar baixar nada</li>
          <li>• Funciona em qualquer dispositivo</li>
        </ul>
      </div>
    </div>
  )
}

function AIButton({ field, value, loading, onImprove, bottom = false }: any) {
  return (
    <button
      onClick={() => onImprove(field, value)}
      disabled={loading === field}
      className={cn(
        'absolute right-2 p-1.5 rounded-lg bg-brand-400/10 text-brand-400 hover:bg-brand-400/20 transition-colors',
        bottom ? 'bottom-2' : 'top-1/2 -translate-y-1/2'
      )}
      title="Melhorar com IA"
    >
      {loading === field ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
    </button>
  )
}
