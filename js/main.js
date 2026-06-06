// ==========================================
// Seleção de Elementos do DOM
// ==========================================
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');
const painelControle = document.getElementById('painel-controle');
const mensagemLogin = document.getElementById('mensagem-login');

const statusAlerta = document.getElementById('status-alerta');
const tempExterna = document.getElementById('temp-externa');
const listaDetritos = document.getElementById('lista-detritos');
const relogioSistema = document.getElementById('relogio-sistema');

const btnEscanear = document.getElementById('btn-escanear');
const btnEscudo = document.getElementById('btn-escudo');
const logComunicacao = document.getElementById('log-comunicacao');

// Variáveis globais de controle
let intervaloTelemetria;
let escudosAtivados = false;

// ==========================================
// 0. Verificação de Segurança (Proteção de Rotas)
// ==========================================
// BOM: Verifica se o 'crachá' existe na sessão atual
const tripulanteLogado = sessionStorage.getItem('autorizacaoSessao');

// Pega o nome do arquivo atual na URL
const paginaAtual = window.location.pathname;
const ehPaginaInicial = paginaAtual.endsWith('index.html') || paginaAtual === '/' || paginaAtual === '';

// Lógica de bloqueio: Se NÃO tem crachá e NÃO está na Home
if (!tripulanteLogado && !ehPaginaInicial) {
    // BOM: Alerta e redirecionamento forçado para a página de login
    alert("ACESSO NEGADO: Identificação de tripulante necessária para acessar este setor.");
    window.location.href = 'index.html'; 
}

// ==========================================
// 1. Eventos e Lógica Básica (Login)
// ==========================================
if (loginForm) {
    // Se o usuário já estiver logado e voltar para a Home, esconde o login automaticamente
    if (tripulanteLogado === 'true') {
        loginSection.classList.add('oculto');
        dashboard.classList.remove('oculto');
        painelControle.classList.remove('oculto');
        iniciarSistema();
    }

    loginForm.addEventListener('submit', function(evento) {
        evento.preventDefault(); 
    
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
    
        if (usuario === 'admin' && senha === '1234') {
            // NOVO: BOM - Salva o crachá virtual no navegador
            sessionStorage.setItem('autorizacaoSessao', 'true');

            loginSection.classList.add('oculto');
            dashboard.classList.remove('oculto');
            painelControle.classList.remove('oculto');
            
            iniciarSistema();
        } else {
            mensagemLogin.textContent = "Acesso negado. Credenciais inválidas.";
        }
    });
}
// ==========================================
// 2. Uso do BOM (Relógio e Telemetria)
// ==========================================
function iniciarSistema() {
    // BOM: setInterval para atualizar o relógio a cada segundo
    setInterval(() => {
        const agora = new Date();
        relogioSistema.textContent = agora.toLocaleTimeString('pt-BR');
    }, 1000);

    // BOM: setInterval para simular flutuação de temperatura
    setInterval(() => {
        const novaTemp = -120 + Math.floor(Math.random() * 15); // Variação térmica
        tempExterna.textContent = novaTemp;
    }, 3000);
}

if (btnEscanear) {
    btnEscanear.addEventListener('click', function() {
        logComunicacao.textContent = "Estabelecendo comunicação com satélites... aguarde.";
        logComunicacao.style.color = "var(--cor-texto-secundario)";
        btnEscanear.disabled = true;
    
        setTimeout(() => {
            gerarDetritos();
            logComunicacao.textContent = "Escaneamento concluído. Dados atualizados.";
            btnEscanear.disabled = false;
        }, 2500);
    });
}

function gerarDetritos() {
    // Limpa a lista atual
    listaDetritos.innerHTML = '';
    
    // Array simulando dados recebidos do espaço
    const detritosDetectados = [
        { nome: "Satélite Inativo A-9", distancia: 4500 },
        { nome: "Fragmento de Foguete", distancia: Math.floor(Math.random() * 3000) },
        { nome: "Parafuso Orbital", distancia: 1200 },
        { nome: "Lixo Espacial Desconhecido", distancia: Math.floor(Math.random() * 1000) }
    ];

    let perigoIminente = false;

    // Lógica: Laço de repetição (for) para criar os elementos na tela
    for (let i = 0; i < detritosDetectados.length; i++) {
        const detrito = detritosDetectados[i];
        
        // Criando elemento HTML via JS
        const item = document.createElement('li');
        item.textContent = `${detrito.nome} - Distância: ${detrito.distancia} km`;
        
        // Se a distância for menor que 1500km, é considerado perigoso
        if (detrito.distancia < 1500) {
            item.style.color = "var(--cor-perigo)";
            perigoIminente = true;
        }
        
        listaDetritos.appendChild(item);
    }

    // Avalia a situação e modifica o DOM
    if (perigoIminente && !escudosAtivados) {
        statusAlerta.textContent = "PERIGO IMINENTE";
        statusAlerta.className = "status-perigo"; // Modificando CSS via classe
        btnEscudo.disabled = false; // Libera o botão de escudo
        
        // BOM: Alerta do navegador para emergências reais
        alert("ALERTA CRÍTICO: Detritos detectados em rota de colisão!");
    } else {
        statusAlerta.textContent = escudosAtivados ? "Protegido" : "Seguro";
        statusAlerta.className = "status-seguro";
        btnEscudo.disabled = true;
    }
}

// ==========================================
// 4. Eventos e Modificação Visual
// ==========================================
if (btnEscudo) {
    btnEscudo.addEventListener('click', function() {
        escudosAtivados = true;
        
        statusAlerta.textContent = "ESCUDOS ATIVADOS";
        statusAlerta.className = "status-seguro";
        statusAlerta.style.color = "#3b82f6"; 
        
        btnEscudo.textContent = "Energia Estável";
        btnEscudo.disabled = true;
        
        alert("Escudos defletores ativados com sucesso. A estação está segura.");
    });
}
// ==========================================
// 5. Sistema de Reporte Manual (Página Detritos)
// ==========================================
const formReporte = document.getElementById('form-reporte');
const corpoTabelaDetritos = document.getElementById('corpo-tabela-detritos');

// O if previne erros de JS nas páginas que não têm esse formulário
if (formReporte && corpoTabelaDetritos) {
    formReporte.addEventListener('submit', function(evento) {
        evento.preventDefault(); // Impede a página de recarregar

        // 1. Captura os valores inseridos pelo usuário
        const id = document.getElementById('novo-id').value;
        const classificacao = document.getElementById('nova-classificacao').value;
        const altitude = document.getElementById('nova-altitude').value;
        const velocidade = document.getElementById('nova-velocidade').value;
        const risco = document.getElementById('novo-risco').value;

        // 2. Lógica para definir a cor e o estilo baseados no risco
        let classeRisco = '';
        let estiloRisco = '';

        if (risco === 'Alto') {
            classeRisco = 'status-perigo';
        } else if (risco === 'Médio') {
            estiloRisco = 'color: #f59e0b; font-weight: bold;'; // Amarelo/Laranja
        } else {
            classeRisco = 'status-seguro'; // Verde
        }

        // 3. Modificação do DOM: Criando o elemento da nova linha (tr)
        const novaLinha = document.createElement('tr');

        // 4. Inserindo o conteúdo dentro da nova linha
        novaLinha.innerHTML = `
            <td>${id}</td>
            <td>${classificacao}</td>
            <td>${altitude}</td>
            <td>${velocidade}</td>
            <td class="${classeRisco}" style="${estiloRisco}">${risco}</td>
        `;

        // 5. Adicionando a nova linha no final da tabela
        corpoTabelaDetritos.appendChild(novaLinha);

        // 6. Limpando os campos do formulário para o próximo uso
        formReporte.reset();

        // 7. Uso do BOM: Alerta de sucesso
        alert(`Sucesso! O detrito ${id} foi catalogado no sistema orbital.`);
    });
}

// ==========================================
// 6. Protocolo Alerta Vermelho (BOM e DOM)
// ==========================================
const btnAlertaVermelho = document.getElementById('btn-alerta-vermelho');
const painelEvacuacao = document.getElementById('painel-evacuacao');
const contadorEvacuacao = document.getElementById('contador-evacuacao');
const inputAbortar = document.getElementById('codigo-abortar');
const btnAbortar = document.getElementById('btn-abortar');

let intervaloContagem;
let tempoRestante = 60; // Tempo em segundos

if (btnAlertaVermelho) {
    btnAlertaVermelho.addEventListener('click', function() {
        // Modificação visual extrema (DOM/CSS)
        document.body.style.backgroundColor = '#450a0a'; // Fundo vermelho escuro
        document.body.style.transition = 'background-color 0.5s ease';
        
        btnAlertaVermelho.disabled = true;
        painelEvacuacao.classList.remove('oculto');
        
        // BOM: setInterval para contagem regressiva
        intervaloContagem = setInterval(() => {
            tempoRestante--; // Reduz 1 segundo
            contadorEvacuacao.textContent = tempoRestante; // Atualiza a tela

            // Condição: O que acontece quando o tempo acaba?
            if (tempoRestante <= 0) {
                clearInterval(intervaloContagem); // Para o relógio
                
                // BOM: Alerta final
                alert("FALHA CRÍTICA. COLISÃO DETECTADA. SISTEMA OFFLINE.");
                
                // Modificação agressiva do DOM (Simula sistema quebrado)
                document.body.style.backgroundColor = '#000000'; // Tela preta
                document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 20vh; font-family: monospace;">ERRO FATAL: CONEXÃO PERDIDA COM A ESTAÇÃO ORBITAL.</h1>';
            }
        }, 1000); // 1000 milissegundos = 1 segundo
    });

    // Lógica para abortar a sequência
    btnAbortar.addEventListener('click', function() {
        // Pegamos o valor e transformamos em maiúsculo para evitar erro de digitação
        const codigo = inputAbortar.value.trim().toUpperCase();
        
        // Condição: Se a senha for "ABORTAR"
        if (codigo === 'ABORTAR') {
            // BOM: Cancela o setInterval
            clearInterval(intervaloContagem);
            
            // Restaura o DOM e CSS para o estado normal
            document.body.style.backgroundColor = 'var(--cor-fundo)';
            btnAlertaVermelho.disabled = false;
            painelEvacuacao.classList.add('oculto');
            
            // Reseta as variáveis
            tempoRestante = 60;
            contadorEvacuacao.textContent = tempoRestante;
            inputAbortar.value = '';
            
            alert("Protocolo abortado com sucesso. A estação retornou ao status operacional.");
        } else {
            // Caso erre a senha
            alert("CÓDIGO INVÁLIDO! Acesso negado. A contagem regressiva continua.");
            inputAbortar.value = ''; // Limpa o campo para ele tentar de novo
        }
    });
}

// ==========================================
// 7. Terminal de Comando Interativo (Eventos de Teclado)
// ==========================================
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

// O if garante que o código só rode na página que tem o terminal
if (terminalInput && terminalOutput) {
    terminalInput.addEventListener('keydown', function(evento) {
        // Verifica se a tecla pressionada foi o "Enter"
        if (evento.key === 'Enter') {
            // Captura o texto, tira os espaços em branco e converte para minúsculo
            const comando = terminalInput.value.trim().toLowerCase();
            
            // Limpa o campo de texto imediatamente
            terminalInput.value = '';

            // Se o usuário apertou Enter sem digitar nada, apenas ignora
            if (comando === '') return;

            // 1. Imprime na tela o comando que o usuário digitou
            adicionarLinhaTerminal(`admin@orbital:~$ ${comando}`, 'var(--cor-texto-secundario)');

            // 2. Lógica de processamento dos comandos (if / else if)
            if (comando === 'help') {
                adicionarLinhaTerminal('Comandos disponíveis: help, clear, scan --force, status, logout', 'var(--cor-sucesso)');
            } 
            else if (comando === 'clear') {
                // Modificação bruta de DOM para limpar a tela
                terminalOutput.innerHTML = ''; 
            } 
            else if (comando === 'scan --force') {
                adicionarLinhaTerminal('Iniciando varredura profunda de segurança...', '#f59e0b'); // Laranja
                
                // BOM: Simula um atraso no processamento do servidor
                setTimeout(() => {
                    adicionarLinhaTerminal('Varredura concluída. Nenhuma anomalia oculta detectada.', 'var(--cor-sucesso)');
                    rolarTerminalParaBaixo();
                }, 1500);
            } 
            else if (comando === 'status') {
                adicionarLinhaTerminal('Todos os sistemas primários online. Bateria: 98%.', 'var(--cor-sucesso)');
            } 
            else if (comando === 'logout') {
                adicionarLinhaTerminal('Encerrando sessão segura...', '#f59e0b');
                
                setTimeout(() => {
                    // BOM: Remove o crachá da sessão e recarrega a página
                    sessionStorage.removeItem('autorizacaoSessao');
                    window.location.href = 'index.html';
                }, 1500);
            }
            else {
                // Caso digite um comando que não existe
                adicionarLinhaTerminal(`bash: ${comando}: comando não encontrado. Digite 'help'.`, 'var(--cor-perigo)');
            }

            // Garante que o scroll acompanhe as novas mensagens
            rolarTerminalParaBaixo();
        }
    });

    // Função auxiliar para injetar HTML dinâmico no DOM
    function adicionarLinhaTerminal(texto, cor) {
        const novaLinha = document.createElement('p');
        novaLinha.textContent = texto;
        novaLinha.style.color = cor;
        novaLinha.style.marginBottom = '4px';
        
        terminalOutput.appendChild(novaLinha);
    }

    // Função auxiliar para rolar a barra do terminal sempre para o final
    function rolarTerminalParaBaixo() {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}