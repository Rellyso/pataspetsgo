# 06 — Admin Foundation

Objetivo

- Definir a fundação da área administrativa do MVP: autenticação, autorização, proteção de rotas, shell do admin, navegação principal e comportamento básico de sessão.

Contexto

- O admin do PatasGo existe para operação interna simples, não como backoffice complexo.
- Haverá poucos operadores internos no MVP.
- A área administrativa deve priorizar clareza, densidade operacional e velocidade de uso.
- Esta spec deve seguir `specs/00-product-vision.md`, `specs/01-technical-architecture.md`, `specs/03-design-system.md`, `specs/04-public-browsing.md` e `specs/05-cart-and-checkout.md`.

Escopo coberto por esta spec

- Login do admin
- Proteção de rotas administrativas
- Autorização por role `admin`
- Shell visual da área protegida
- Navegação principal do admin
- Estado inicial do dashboard
- Comportamento de sessão e logout
- Estados de loading, erro e acesso negado da área protegida

Fora de escopo desta spec

- CRUDs de catálogo
- CRUD de banners
- Gestão de pedidos detalhada
- Configurações da loja detalhadas
- Permissões avançadas com múltiplos papéis
- Recuperação avançada de senha e fluxos complexos de segurança

Princípios da área admin

- O admin deve ser simples de acessar para operadores autorizados e impossível de usar para visitantes públicos.
- A interface deve ser mais densa e silenciosa que a área pública.
- A navegação deve reduzir cliques desnecessários.
- A segurança deve ser consistente entre middleware, servidor e banco.
- O MVP deve evitar complexidade de permissões além do papel único `admin`.

Modelo de autenticação e autorização

- Autenticação via Supabase Auth com email e senha.
- Autorização baseada em `profiles.role = 'admin'`.
- A existência de sessão autenticada não é suficiente para liberar a área.
- O sistema deve validar também a role `admin` no servidor.

Rotas envolvidas

- `/admin` — entrada principal da área protegida
- `/auth/login` ou rota equivalente de login do admin
- subrotas administrativas futuras sob `/admin/*`

Fluxo de acesso

1. Usuário acessa `/admin`.
2. Se não houver sessão, o sistema redireciona para a tela de login.
3. Se houver sessão mas não houver role `admin`, o sistema bloqueia o acesso.
4. Se houver sessão válida com role `admin`, o sistema renderiza o shell administrativo.

Proteção de rota

- O `middleware` deve verificar existência de sessão para rotas `/admin`.
- A verificação final de autorização deve ocorrer no servidor, dentro do layout e das rotas/actions protegidas.
- A área admin não pode depender apenas de guard client-side.
- Se usuário autenticado sem role `admin` tentar acessar a área, deve receber bloqueio consistente e não ver conteúdo protegido parcialmente renderizado.

Tela de login

- A tela de login deve ser simples, direta e claramente separada da navegação pública.
- Campos mínimos:
- email
- senha
- Deve existir CTA primário para entrar.
- O formulário deve mostrar erro simples em caso de credenciais inválidas.
- Não é necessário criar onboarding, cadastro público de admin ou fluxo de convite no MVP.

Validações do login

- Email obrigatório com validação básica de formato.
- Senha obrigatória.
- Mensagens de erro devem ser curtas e não revelar informação desnecessária sobre existência do usuário.

Comportamento após login

- Login bem-sucedido leva o usuário para `/admin` ou para a rota protegida originalmente solicitada, se fizer sentido manter esse redirect.
- Se já houver sessão válida de admin e o usuário acessar a tela de login, o sistema pode redirecionar diretamente para `/admin`.

Shell do admin

- O shell administrativo é a moldura base das páginas protegidas.
- Deve conter, no mínimo:
- cabeçalho ou barra superior com contexto da área
- navegação principal
- área de conteúdo
- ação de logout acessível
- O shell deve ser reaproveitável para dashboard, listas e formulários administrativos.

Navegação principal do admin

- Estrutura mínima recomendada no MVP:
- Dashboard
- Produtos
- Categorias
- Marcas
- Banners
- Pedidos
- Configurações da loja
- A navegação deve deixar claro onde o operador está.
- O item ativo deve ter destaque visual discreto, porém evidente.

Dashboard inicial

- O dashboard do MVP não precisa ser analítico ou avançado.
- Ele deve funcionar como página inicial operacional da área protegida.
- Pode conter:
- resumo simples com atalhos para os módulos principais
- cards operacionais básicos
- contexto de uso da área
- Se dados reais ainda não estiverem implementados, a estrutura do dashboard pode começar com placeholders úteis sem simular métricas falsas.

Logout e sessão

- O logout deve estar sempre acessível no shell administrativo.
- Após logout, o usuário deve perder acesso às rotas protegidas e retornar ao fluxo público ou à tela de login.
- Expiração de sessão deve resultar em redirecionamento limpo para autenticação, sem estado quebrado da interface.

Estados da área protegida

- Loading:
- estado breve para checagem de sessão/autorização quando necessário
- placeholders coerentes no shell durante carregamento inicial
- Acesso negado:
- mensagem clara para usuário sem permissão
- sem exposição de conteúdo administrativo
- Erro:
- falha simples e recuperável para carregamento da área
- CTA para tentar novamente ou voltar ao login

Comportamento visual

- O admin deve compartilhar a mesma família visual do público, mas com menos ornamentação.
- A densidade deve favorecer leitura de tabelas, listas e formulários.
- O uso de cor deve ser mais contido que na vitrine pública.
- O layout deve evitar distrações visuais que prejudiquem operação.

Responsividade

- O admin também deve funcionar em mobile, mas com prioridade funcional e não ornamental.
- Em telas menores, a navegação pode colapsar para drawer ou menu compacto.
- A estrutura deve continuar utilizável por operadores em celular, mesmo que a melhor experiência permaneça em telas maiores.

Acessibilidade

- Login e navegação principal devem ser plenamente operáveis por teclado.
- Estados de foco devem ser visíveis.
- Erros de autenticação devem ser perceptíveis e compreensíveis.
- A navegação não deve depender apenas de cor para indicar item ativo.

Observabilidade

- Eventos críticos da área protegida devem poder ser rastreados por logs básicos no servidor, especialmente falhas de autenticação e tentativas de acesso não autorizado quando relevante.
- Logs não devem expor senha nem dados sensíveis desnecessários.

Critérios de aceite

- Usuário sem sessão é redirecionado ao login ao tentar acessar `/admin`.
- Usuário autenticado sem role `admin` não acessa conteúdo protegido.
- Usuário com role `admin` acessa a área protegida com shell administrativo funcional.
- Login com email e senha funciona com feedback coerente para sucesso e erro.
- Logout encerra a sessão e remove acesso às rotas protegidas.
- O shell do admin oferece navegação principal para os módulos do MVP.
- A área protegida funciona de forma utilizável em mobile e desktop.
