import { AdminShell } from "@/components/layout/admin-shell";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterChip } from "@/components/shared/filter-chip";
import { PriceDisplay } from "@/components/shared/price-display";
import { SearchInput } from "@/components/shared/search-input";
import { SectionTitle } from "@/components/shared/section-title";
import { WhatsappButton } from "@/components/shared/whatsapp-button";

const colorTokens = [
  { name: "Primary", className: "bg-primary", value: "#00A9C8" },
  { name: "Primary Dark", className: "bg-primary-dark", value: "#0088A3" },
  { name: "Primary Light", className: "bg-primary-light", value: "#D9F7FC" },
  { name: "Secondary", className: "bg-secondary", value: "#F6B800" },
  { name: "Secondary Light", className: "bg-secondary-light", value: "#FFF3C4" },
  { name: "Accent", className: "bg-accent", value: "#FF7A00" },
  { name: "Success", className: "bg-success", value: "#22C55E" },
  { name: "Warning", className: "bg-warning", value: "#F59E0B" },
  { name: "Error", className: "bg-error", value: "#EF4444" },
  { name: "Info", className: "bg-info", value: "#0EA5E9" },
];

export default function DesignPage() {
  return (
    <Container className="flex flex-col gap-8">
      <section className="rounded-card border border-default bg-surface p-6 shadow-soft sm:p-8">
        <SectionTitle
          as="h1"
          subtitle="Contrato visual vivo da fundação. Catálogo e admin final entram depois, sem reabrir tokens ou hierarquia base."
          title="Design system base"
        />
      </section>

      <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <SectionTitle
          subtitle="Use esta página para validar decisões de base antes de entrar em catálogo real ou superfície operacional final."
          title="Mapa da fundação"
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Fundações", "Tokens, tipografia e ritmo."],
            ["Inputs e ações", "Busca, chips, CTA e preço."],
            ["Feedback", "Loading, vazio, erro e sucesso."],
            ["Shell público", "Leitura leve para descoberta."],
            ["Shell admin", "Base densa para operação futura."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-card border border-default bg-background p-4">
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
          <SectionTitle
            subtitle="Tipografia limpa, local e confiável. Público respira mais. Admin fica mais denso e silencioso."
            title="Direção"
          />
          <div className="mt-6 space-y-3">
            <p className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Aqui eu resolvo rápido, com confiança.
            </p>
            <p className="max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Base visual do PatasGo para descoberta rápida, conversão por WhatsApp e operação
              interna sem ruído.
            </p>
          </div>
        </article>

        <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold text-foreground">Estados base</h2>
          <div className="mt-5 flex flex-col gap-3">
            <div className="rounded-card border border-default bg-background px-4 py-3 text-sm text-foreground">
              Padrão pronto para leitura rápida.
            </div>
            <div className="rounded-card border border-primary bg-primary-light px-4 py-3 text-sm text-foreground">
              Foco visível, sem depender só de cor forte.
            </div>
            <div className="rounded-card border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground">
              Loading e feedback entram desde fundação.
            </div>
            <button
              className="min-h-11 cursor-not-allowed rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white opacity-60"
              disabled
              type="button"
            >
              Botão desabilitado
            </button>
          </div>
        </article>
      </section>

      <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <SectionTitle
          subtitle="Neutros dominam. Cor entra onde orienta, confirma ou converte."
          title="Tokens"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {colorTokens.map((token) => (
            <div key={token.name} className="rounded-card border border-default bg-background p-3">
              <div className={`h-20 rounded-card ${token.className}`} />
              <div className="mt-3 space-y-1">
                <p className="text-sm font-semibold text-foreground">{token.name}</p>
                <p className="font-mono text-xs text-muted">{token.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
          <SectionTitle subtitle="Mesmo sistema. Ritmos diferentes." title="Ações e inputs" />
          <div className="mt-6 flex flex-col gap-5">
            <div className="flex flex-wrap gap-3">
              <WhatsappButton size="large">Falar no WhatsApp</WhatsappButton>
              <button
                className="min-h-11 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
                type="button"
              >
                Ação primária
              </button>
              <button
                className="min-h-11 rounded-full border border-default bg-surface px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-primary-light"
                type="button"
              >
                Ação secundária
              </button>
            </div>

            <SearchInput label="Buscar produtos" placeholder="Ração premium, tapete higiênico..." />

            <div className="flex flex-wrap gap-3">
              <FilterChip active>Promoções</FilterChip>
              <FilterChip>Cachorro</FilterChip>
              <FilterChip>Gato</FilterChip>
              <span className="chip-category">Filhotes</span>
              <span className="badge-promo">Oferta</span>
            </div>

            <div className="rounded-card border border-default bg-background p-4">
              <p className="text-sm font-medium text-muted">Preço com hierarquia promocional</p>
              <div className="mt-2">
                <PriceDisplay price={89.9} promotionalPrice={69.9} size="large" />
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
          <SectionTitle subtitle="Estados vazios, claros, sem tom técnico." title="Feedback" />
          <div className="mt-6 flex flex-col gap-4">
            <EmptyState
              action={<WhatsappButton>Falar com loja</WhatsappButton>}
              description="Quando catálogo ou busca ainda não tem dado útil, sistema continua orientando usuário sem tela morta."
              title="Nada por aqui ainda"
            />
            <div className="rounded-card border border-error/20 bg-error/8 p-4 text-sm leading-6 text-foreground">
              Erro: mensagem curta, recuperável, sem linguagem técnica.
            </div>
            <div className="rounded-card border border-success/20 bg-success/10 p-4 text-sm leading-6 text-foreground">
              Sucesso: confirmação clara, sem fogos de artifício.
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <SectionTitle
          subtitle="Shell público já está ativo nesta rota. Bloco abaixo mostra leitura do shell admin sem puxar sidebar nem dashboard final."
          title="Shells"
        />
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <article className="rounded-card border border-default bg-background p-5 shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground">Shell público</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Header, busca, CTA e footer com leitura leve. Base para home, catálogo e pedido.
            </p>
          </article>

          <div className="rounded-card border border-default bg-background p-3">
            <AdminShell
              actions={
                <button
                  className="min-h-11 rounded-full border border-default px-4 py-3 text-sm font-semibold text-foreground"
                  type="button"
                >
                  Sair
                </button>
              }
              description="Preview visual. Auth real continua no layout admin."
              embedded
              eyebrow="Admin base"
              meta="Ritmo mais denso, mais quieto, mais operacional."
              title="AdminShell"
            >
              <section className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-card border border-default bg-surface p-5 shadow-soft">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Leitura operacional
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Sem sidebar agora. Sem tabela agora. Só base estrutural compartilhável.
                  </p>
                </article>
                <article className="rounded-card border border-default bg-surface p-5 shadow-soft">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Pronto para Fase 7
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Módulos operacionais entram depois sobre mesmo shell, sem refazer visual base.
                  </p>
                </article>
              </section>
            </AdminShell>
          </div>
        </div>
      </section>
    </Container>
  );
}
