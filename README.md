#  Projeto Desenvolvido por Julio Cesar,Pedro Provadelli e Vitor Louzano.
#  Space Guardian - Rastreador de Detritos

Este projeto é um protótipo funcional de Front-End desenvolvido para simular um sistema espacial de rastreamento de detritos e monitoramento de frota de satélites. O sistema foca em interatividade de interface, proteção de rotas e simulações em tempo real.

##  Sobre o Projeto
O Centro de Comando Orbital foi projetado com uma arquitetura modular que separa rigorosamente a estrutura (HTML), a estilização com design tokens (CSS) e a interatividade lógica (JavaScript puro). A aplicação não utiliza frameworks, garantindo o domínio dos fundamentos web.

---

##  Usuário e Tarefa Crítica
* **Usuário Definido:** Tripulante / Operador Técnico de Comando em estações espaciais ou bases na Terra. Uma pessoa que precisa tomar decisões rápidas em situações de alta pressão.
* **Tarefa Crítica:** Monitorar ameaças de detritos em tempo real, gerenciar alertas do sistema e executar protocolos de emergência (como ativação de escudos defletores ou evacuação) para garantir a integridade da estação orbital.

##  Justificativa da Direção Visual
A interface adota um tema escuro (*Dark Mode* profundo) intencional. Em ambientes de monitoramento contínuo, fundos escuros reduzem o cansaço visual do operador. A paleta de cores é inteiramente gerenciada por *Design Tokens* (variáveis CSS) e baseia-se na semântica universal de sistemas de controle:
* **Azul Espacial (Primária):** Elementos de navegação e ações padrão.
* **Verde (Sucesso):** Status operacional e sistemas seguros.
* **Amarelo/Laranja (Atenção):** Avisos e anomalias médias.
* **Vermelho (Perigo):** Alertas críticos, detritos em rota de colisão e botões de protocolo de evacuação.

Toda a estrutura visual prioriza interfaces organizadas com componentes reutilizáveis (como *cards* e botões padronizados) e menus com ícones de navegação claros, garantindo que a informação seja escaneada rapidamente pelo usuário.

##  Visão Geral das Telas
O sistema é modular e dividido em 4 visões principais:
1. **Painel Principal (`index.html`):** Hub central. Exige autenticação. Contém o radar de telemetria, controles de escudos, painel de evacuação de emergência e um terminal S.O. interativo.
2. **Catálogo de Detritos (`detritos.html`):** Tabela de dados de monitoramento e um formulário para inserção manual de novos fragmentos rastreados pelo radar.
3. **Registro de Alertas (`alertas.html`):** Feed cronológico com o histórico de anomalias (tempestades solares, manobras evasivas).
4. **Frota de Satélites (`satelites.html`):** Dashboard com a integridade, marca, modelo e status da bateria dos satélites aliados.

##  Decisões de Responsividade e Acessibilidade
* **Responsividade:** O layout foi construído de forma fluida (Mobile-First adaptado) utilizando `Flexbox` e `CSS Grid`. Através de *breakpoints* definidos (`@media`), o cabeçalho e os grids de cards se reorganizam automaticamente para oferecer uma boa experiência desde telas de dispositivos móveis (celulares) até monitores *ultra-wide* de centros de comando.
* **Acessibilidade:** * Alto contraste entre o texto claro e o fundo escuro.
  * Utilização estrita de HTML semântico (`<header>`, `<main>`, `<nav>`, `<section>`, `<table>`).
  * Inclusão de atributos ARIA (`aria-label` para menus, `aria-live="polite"` para que leitores de tela anunciem mensagens de login ou logs dinâmicos de radar, e `aria-hidden="true"` para ocultar ícones puramente decorativos).
  * Todos os campos de formulário estão corretamente conectados aos seus rótulos via atributos `for` e `id`.

##  Manual de Interatividade (Passo a Passo)
Este guia detalha o que o sistema espera e como ele reage a cada interação do usuário.

### 1. Acesso ao Sistema (Página Inicial)
* **Ação:** Inserir credenciais (`admin` e `1234`) e clicar em **"Autenticar Sistema"**.
* **Resultado:** O sistema valida os dados, oculta a tela de login, revela o Dashboard Principal e gera um "crachá" de sessão (`sessionStorage`) para liberar a navegação entre as páginas. Credenciais erradas geram uma mensagem de erro em vermelho na tela.

### 2. Ações de Emergência (Dashboard Principal)
* **Botão "Escanear Setor":** * Ao clicar, o botão é desabilitado temporariamente para evitar cliques duplos. 
  * O sistema aguarda 2.5 segundos (`setTimeout`) simulando a busca. 
  * Em seguida, gera uma lista dinâmica de detritos. Se algum detrito estiver a menos de 1500km, o painel pisca em vermelho ("PERIGO IMINENTE"), um alerta de navegador (`alert`) é disparado e o botão de Escudos é liberado.
* **Botão "Ativar Escudos Defletores":** * Só pode ser clicado após uma ameaça ser detectada.
  * Ao clicar, o status da estação muda para "ESCUDOS ATIVADOS" (azul), a interface volta ao estado seguro e um `alert` confirma o sucesso da operação.

### 3. Protocolo de Evacuação (Dashboard Principal)
* **Botão "INICIAR ALERTA VERMELHO":**
  * Altera drasticamente o CSS global, deixando o fundo da tela vermelho escuro.
  * Revela o painel de evacuação e inicia um cronômetro regressivo de 60 segundos (`setInterval`).
  * Se o tempo chegar a `0`, a tela fica inteiramente preta com uma mensagem de "ERRO FATAL".
* **Campo de Código + "Confirmar Cancelamento":**
  * Se o usuário digitar a palavra exata `ABORTAR` e confirmar, o cronômetro para, a contagem é reiniciada e a tela retorna à cor padrão. Códigos errados geram um alerta de "Acesso Negado".

### 4. Terminal S.O. (Dashboard Principal)
Um terminal interativo oculto que processa comandos ao pressionar a tecla **"Enter"**:
* para usar posicione o mouse na frente de "admin@orbital:~$" e clique, após isso digite o comando desejado.
* `help`: Lista todos os comandos disponíveis no sistema.
* `scan --force`: Exibe uma mensagem em laranja e aguarda 1.5s antes de retornar uma confirmação de varredura concluída.
* `status`: Exibe o nível fictício de bateria e operação (98%).
* `clear`: Limpa todo o histórico da tela do terminal.
* `logout`: Encerra a sessão do usuário, apaga o `sessionStorage` e o redireciona de volta para a tela de login.
* *Qualquer outro comando:* Retorna um erro simulado em vermelho ("comando não encontrado").

### 5. Reporte Manual de Radar (Catálogo de Detritos)
* **Ação:** Preencher os campos (ID, Classificação, Altitude, Velocidade), selecionar um Nível de Risco e clicar em **"Adicionar ao Catálogo"**.
* **Resultado:** O evento de `submit` é interceptado, a página não recarrega. Os dados são capturados e o JavaScript constrói dinamicamente uma nova linha (`<tr>`) que é anexada ao final da tabela. A cor da classificação na tabela adapta-se ao risco selecionado (Verde para Baixo, Laranja para Médio e Vermelho para Alto). O formulário é esvaziado automaticamente para um novo uso.

### 6. Sistema de Segurança Global (Catraca de Rotas)
* **Ação:** Tentar acessar qualquer página (como `detritos.html`) copiando a URL e colando em uma nova aba anônima (sem ter feito o login).
* **Resultado:** O script verifica a ausência do `sessionStorage`, bloqueia o carregamento do conteúdo, exibe um alerta de acesso negado e redireciona o usuário compulsoriamente para o `index.html`.

---

##  Resumo de Requisitos Técnicos Cumpridos

* **HTML/CSS:** Semântica estrutural, Tokens, Componentização e Responsividade em todas as páginas.
* **Manipulação de DOM:** Injeção de nós HTML via JS (`createElement`), alteração de classes CSS, edição de textos internos e ocultação de seções.
* **Uso do BOM:** Implementação de `setTimeout`, `setInterval`, `clearInterval`, `alert`, `window.location` e `sessionStorage`.
* **Lógica Avançada:** Uso encadeado de blocos `if/else`, laços de repetição `for`, e captura precisa de eventos (`submit`, `click`, `keydown`).

##  Estrutura de Arquivos

```text
/
├── index.html        # Painel Principal e Autenticação
├── detritos.html     # Catálogo com tabela interativa e inserção de dados
├── alertas.html      # Feed de registro de ocorrências
├── satelites.html    # Monitoramento de status da frota
├── style.css         # Folha de estilos unificada
├── script.js         # Lógica centralizada de validação, DOM e BOM
└── assets/
    ├── icons/        # Ícones de navegação
    └── images/       # Logo do sistema e favicon