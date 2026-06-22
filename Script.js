// 🛠️ COLOQUE SUA CHAVE NOVA DA GROQ AQUI DENTRO DAS CRASES
const GROQ_API_KEY = `COLOQUE SUA CHAVE AQUI`;

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

const INSTRUCAO_ADOLESCENTE = `
Você é um adolescente brasileiro de 16 anos conversando no WhatsApp/Discord.
Sua personalidade: gente boa, meio preguiçoso, antenado em memes, games e redes sociais.

Regras estritas de comportamento:
1. NUNCA seja formal. Esqueça termos como "Compreendo", "Olá", "Portanto".
2. Use abreviações comuns de chat (vc, tbm, q, n, msm, dps, vdd).
3. Use gírias atuais naturalmente (mano, de boa, brabo, caraca, nao tanko, kkkk, mds, tmj).
4. Escreva tudo em letras minúsculas (caixa baixa).
5. Use emojis naturais (😂, 💀, 😭, 🚀).
6. Suas respostas devem ser curtas e diretas, como uma mensagem de chat real.
`;

async function enviarMensagem() {
    const texto = userInput.value.trim();
    if (!texto) return;

    // REMOVI A TRAVA DO ALERT DAQUI PARA NÃO MENTIR PARA VOCÊ!

    criarMensagemItem(texto, 'user');
    userInput.value = '';
    
    const loadingId = criarMensagemItem('Digitando...', 'ia loading');
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: INSTRUCAO_ADOLESCENTE },
                    { role: 'user', content: texto }
                ],
                temperature: 0.8,
                max_tokens: 150
            })
        });

        const data = await response.json();
        
        const loadEl = document.getElementById(loadingId);
        if(loadEl) loadEl.remove();

        if (response.ok && data.choices && data.choices[0].message) {
            const respostaIA = data.choices[0].message.content;
            criarMensagemItem(respostaIA.trim(), 'ia');
        } else {
            console.error(data);
            // Se der erro de chave inválida, o próprio servidor da Groq vai nos avisar aqui embaixo
            const erroMensagem = data.error ? data.error.message : "Erro desconhecido";
            criarMensagemItem('Ixi mano, a Groq recusou. Motivo: ' + erroMensagem, 'ia');
        }
    } catch (error) {
        const loadEl = document.getElementById(loadingId);
        if(loadEl) loadEl.remove();
        console.error(error);
        criarMensagemItem('Ih mano, deu erro de rede. Cê tá conectado na internet?', 'ia');
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function criarMensagemItem(texto, classe) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${classe}`;
    msgDiv.innerText = texto;
    const idTemp = 'msg-' + Math.random().toString(36).substr(2, 9);
    msgDiv.id = idTemp;
    chatMessages.appendChild(msgDiv);
    return idTemp;
}

sendBtn.addEventListener('click', enviarMensagem);
// 1. Crie essa lista FORA da função enviarMensagem (lá no topo do arquivo)
let historicoConversa = [
    { role: 'system', content: INSTRUCAO_ADOLESCENTE }
];

// 2. Dentro da função enviarMensagem, substitua o bloco do "body" por este:
async function enviarMensagem() {
    const texto = userInput.value.trim();
    if (!texto) return;

    // Adiciona a mensagem do usuário no histórico
    historicoConversa.push({ role: 'user', content: texto });
    criarMensagemItem(texto, 'user');
    userInput.value = '';
    
    const loadingId = criarMensagemItem('Digitando...', 'ia loading');

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: historicoConversa, // <--- Aqui está o segredo: enviamos o histórico todo!
                temperature: 0.8,
                max_tokens: 150
            })
        });

        const data = await response.json();
        if(document.getElementById(loadingId)) document.getElementById(loadingId).remove();

        if (response.ok && data.choices[0].message) {
            const respostaIA = data.choices[0].message.content;
            // Adiciona a resposta da IA no histórico também
            historicoConversa.push({ role: 'assistant', content: respostaIA });
            criarMensagemItem(respostaIA.trim(), 'ia');
        }
    } catch (error) {
        // ... resto do seu código de erro
    }
}

userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') enviarMensagem(); });
