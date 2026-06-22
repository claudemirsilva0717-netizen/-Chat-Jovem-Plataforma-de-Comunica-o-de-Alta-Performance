​⚡ DropIn | A IA que te entende
​Frontend Dinâmico integrado à API da Groq (Llama 3.3 70B) com Engenharia de Prompt para Alinhamento de Persona
​O DropIn é uma aplicação web de chat interativa projetada para o público jovem. Rompendo com o padrão formal de assistentes virtuais tradicionais, o projeto utiliza técnicas avançadas de System Prompting para alinhar uma Persona ultra-realista baseada no vocabulário da Geração Z, simulando a dinâmica de conversas de plataformas como Discord e WhatsApp.
​🛠️ Diferenciais Técnicos do Projeto
​Persistência de Memória Contextual: O motor em JavaScript gerencia um array dinâmico (historicoConversa) que anexa as interações passadas a cada nova requisição HTTP via fetch. Isso garante que o modelo mantenha o contexto e a linha de raciocínio da conversa sem perder o histórico recente.
​Engenharia de Prompt Avançada:
O comportamento do agente é ditado por um conjunto restrito de diretrizes no nível do sistema (INSTRUCAO_ADOLESCENTE), forçando o modelo LLM a adotar caixa baixa, gírias atuais brasileiras, emojis naturais e respostas curtas de alta velocidade.
​Frontend Minimalista e Responsivo:
Interface moderna desenvolvida puramente com HTML5 e CSS3, utilizando variáveis globais (:root) para gerenciamento de temas escuros, grid layout para adaptabilidade móvel e transições assíncronas suaves de feedback ("Digitando...").
​📊 Arquitetura de Fluxo de Dados
[Usuário Digita] ➔ [Anexa ao Histórico] ➔ [POST Request HTTP para Groq API]
                                                      │
[Renderiza Resposta Realista] 🡨 [Consome JSON da IA] 🡨┘

Stack Tecnológica Empregada
​Linguagens: HTML5, CSS3 (Custom Properties, Flexbox, Grid) e JavaScript (ES6+).
​Consumo de API: Fetch API (Assíncrona com async/await).
​Inteligência Artificial: Modelo llama-3.3-70b-versatile rodando na infraestrutura de ultra-baixa latência da Groq.
​🚀 Código-Fonte em Destaque (Injeção de Histórico)
​O trecho abaixo demonstra o coração lógico do script, onde o estado da conversa é atualizado dinamicamente antes de disparar o pacote para a rede:
// Gerenciamento de estado global para persistência de contexto
let historicoConversa = [
    { role: 'system', content: INSTRUCAO_ADOLESCENTE }
];

async function enviarMensagem() {
    const texto = userInput.value.trim();
    if (!texto) return;

    // Atualização síncrona do histórico do cliente
    historicoConversa.push({ role: 'user', content: texto });
    
    // Disparo assíncrono para o endpoint da Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: historicoConversa, // Persistência ativa de contexto
            temperature: 0.8,
            max_tokens: 150
        })
    });
    // ... Tratamento do retorno e renderização em tela
}

🏃 Como Executar a Aplicação Localmente
​Clone este repositório ou baixe os arquivos fonte.
​Certifique-se de que o seu token de autorização da Groq está configurado na variável GROQ_API_KEY dentro do arquivo script.js.
​Abra o arquivo index.html diretamente em qualquer navegador moderno.

​⚙️ Configuração da API
⚠️ Importante: Para rodar o projeto localmente, substitua o valor da constante GROQ_API_KEY no seu arquivo script.js pela sua própria chave gerada no painel da Groq:
const GROQ_API_KEY = `SUA_CHAVE_AQUI`;
