/**
 * Initial Seed Question Bank for Figures of Speech
 * Categories: Prosopopeia, Metonímia, Pleonasmo, Metáfora, Ironia
 */

export const INITIAL_QUESTIONS = [
  // --- PROSOPOPEIA (PERSONIFICAÇÃO) ---
  {
    id: "q-pros-01",
    category: "Prosopopeia",
    type: "choice",
    prompt: "Na frase 'O sol sorriu para a cidade ao amanhecer', qual figura de linguagem é empregada?",
    options: ["Prosopopeia", "Metonímia", "Pleonasmo", "Metáfora"],
    correctAnswer: "Prosopopeia",
    explanation: "Atribuir a capacidade de 'sorrir' ao Sol (ser inanimado) é Prosopopeia ou Personificação."
  },
  {
    id: "q-pros-02",
    category: "Prosopopeia",
    type: "choice",
    prompt: "Assinale a opção que apresenta um exemplo claro de Prosopopeia:",
    options: [
      "O vento uivava segredos na noite escura.",
      "Lemos Machado de Assis na aula de literatura.",
      "Preciso subir para cima para pegar o casaco.",
      "Tenho mil coisas para fazer hoje."
    ],
    correctAnswer: "O vento uivava segredos na noite escura.",
    explanation: "O vento 'uivar segredos' é a atribuição de uma ação/sentimento humano a um fenômeno da natureza."
  },
  {
    id: "q-pros-03",
    category: "Prosopopeia",
    type: "direct",
    prompt: "No verso 'A lua abraçou a praia silenciosa', qual figura atribui o ato de 'abraçar' à Lua?",
    options: [],
    correctAnswer: "Prosopopeia",
    explanation: "O ato de abraçar é uma ação humana atribuída ao astro celeste (Lua), caracterizando Prosopopeia (Personificação)."
  },
  {
    id: "q-pros-04",
    category: "Prosopopeia",
    type: "choice",
    prompt: "Em 'Os rios choravam a seca do sertão', a figura de linguagem presente é:",
    options: ["Prosopopeia", "Pleonasmo", "Metonímia", "Catacrese"],
    correctAnswer: "Prosopopeia",
    explanation: "Rios não choram; essa ação emotiva dada ao elemento geográfico é Prosopopeia."
  },
  {
    id: "q-pros-05",
    category: "Prosopopeia",
    type: "direct",
    prompt: "Identifique a figura: 'As velhas árvores do parque cochichavam entre si quando a brisa passava.'",
    options: [],
    correctAnswer: "Prosopopeia",
    explanation: "'Cochichar' é a linguagem humana atribuída às árvores."
  },
  {
    id: "q-pros-06",
    category: "Prosopopeia",
    type: "choice",
    prompt: "Qual figura de linguagem também é amplamente conhecida pelo nome de 'Personificação'?",
    options: ["Prosopopeia", "Metonímia", "Pleonasmo", "Hipérbole"],
    correctAnswer: "Prosopopeia",
    explanation: "Prosopopeia e Personificação são termos sinônimos."
  },

  // --- METONÍMIA ---
  {
    id: "q-met-01",
    category: "Metonímia",
    type: "choice",
    prompt: "Na expressão 'Ela leu todo o Machado de Assis durante as férias', ocorre:",
    options: [
      "Metonímia (Autor pela obra)",
      "Prosopopeia (Personificação)",
      "Pleonasmo Vicioso",
      "Hipérbole"
    ],
    correctAnswer: "Metonímia (Autor pela obra)",
    explanation: "Ela leu a OBRA/LIVROS do autor, e não a pessoa do escritor Machado de Assis."
  },
  {
    id: "q-met-02",
    category: "Metonímia",
    type: "choice",
    prompt: "Qual figura ocorre em 'O jovem bebeu dois copos de suco de laranja'?",
    options: [
      "Metonímia (Continente pelo conteúdo)",
      "Prosopopeia",
      "Pleonasmo estilístico",
      "Antítese"
    ],
    correctAnswer: "Metonímia (Continente pelo conteúdo)",
    explanation: "Bebe-se o suco (conteúdo) que está DENTRO dos copos (continente), e não o vidro do copo."
  },
  {
    id: "q-met-03",
    category: "Metonímia",
    type: "direct",
    prompt: "Quando dizemos 'Ele tem mil cabeças de gado na fazenda', qual figura substitui o animal inteiro pela sua 'cabeça'?",
    options: [],
    correctAnswer: "Metonímia",
    explanation: "É uma Metonímia da parte pelo todo (a cabeça representa o boi inteiro)."
  },
  {
    id: "q-met-04",
    category: "Metonímia",
    type: "choice",
    prompt: "Assinale a frase que exemplifica a troca da marca pelo produto (Metonímia):",
    options: [
      "Comprei Bombril e Gillette no supermercado.",
      "As paredes ouviam a conversa em segredo.",
      "Vi com meus próprios olhos o que aconteceu.",
      "O mar estava calmo como uma lagoa."
    ],
    correctAnswer: "Comprei Bombril e Gillette no supermercado.",
    explanation: "Bombril (palha de aço) e Gillette (lâmina de barbear) são nomes de marcas comerciais usados no lugar dos produtos."
  },
  {
    id: "q-met-05",
    category: "Metonímia",
    type: "direct",
    prompt: "Em 'O estádio inteiro aplaudiu o gol da vitória', qual figura troca os torcedores pelo local?",
    options: [],
    correctAnswer: "Metonímia",
    explanation: "Quem aplaudiu foram as PESSOAS/TORCEDORES dentro do estádio (conteúdo pelo continente)."
  },
  {
    id: "q-met-06",
    category: "Metonímia",
    type: "choice",
    prompt: "Na frase 'O bronze soou ao meio-dia', que figura substitui a palavra 'sino' pelo seu material 'bronze'?",
    options: ["Metonímia", "Prosopopeia", "Pleonasmo", "Metáfora"],
    correctAnswer: "Metonímia",
    explanation: "Troca-se o objeto (sino) pela matéria-prima de que é feito (bronze)."
  },

  // --- PLEONASMO ---
  {
    id: "q-ple-01",
    category: "Pleonasmo",
    type: "choice",
    prompt: "Na expressão 'Subir para cima' ou 'Entrar para dentro', ocorre um:",
    options: [
      "Pleonasmo Vicioso (Redundância)",
      "Prosopopeia",
      "Metonímia da parte pelo todo",
      "Ironia"
    ],
    correctAnswer: "Pleonasmo Vicioso (Redundância)",
    explanation: "Subir só pode ser para cima. É um pleonasmo vicioso no uso cotidiano."
  },
  {
    id: "q-ple-02",
    category: "Pleonasmo",
    type: "choice",
    prompt: "No verso poético 'E rir meu riso e derramar meu pranto', o autor utiliza:",
    options: [
      "Pleonasmo Literário / Estilístico",
      "Prosopopeia",
      "Metonímia de autor pela obra",
      "Paradoxo"
    ],
    correctAnswer: "Pleonasmo Literário / Estilístico",
    explanation: "'Rir meu riso' é uma redundância intencional na poesia de Vinicius de Moraes para reforçar o sentimento."
  },
  {
    id: "q-ple-03",
    category: "Pleonasmo",
    type: "direct",
    prompt: "Qual figura de linguagem é caracterizada pela repetição de uma mesma ideia com palavras diferentes para ênfase?",
    options: [],
    correctAnswer: "Pleonasmo",
    explanation: "O Pleonasmo consiste na repetição expressiva ou redundante de um conceito."
  },
  {
    id: "q-ple-04",
    category: "Pleonasmo",
    type: "choice",
    prompt: "Qual das frases abaixo contém um Pleonasmo?",
    options: [
      "Eu vi o acidente com meus próprios olhos.",
      "A caneta escrevia palavras de amor.",
      "Comemos dois pratos de feijoada.",
      "Ele é forte como um touro."
    ],
    correctAnswer: "Eu vi o acidente com meus próprios olhos.",
    explanation: "'Ver com os próprios olhos' enfatiza a visão, caracterizando pleonasmo."
  },
  {
    id: "q-ple-05",
    category: "Pleonasmo",
    type: "choice",
    prompt: "Qual a diferença entre Pleonasmo Literário e Pleonasmo Vicioso?",
    options: [
      "O literário é recurso poético intencional; o vicioso é um vício de linguagem desnecessário.",
      "O literário é sempre um erro gramatical.",
      "Não há diferença, ambos são incorretos.",
      "O vicioso é usado apenas na poesia."
    ],
    correctAnswer: "O literário é recurso poético intencional; o vicioso é um vício de linguagem desnecessário.",
    explanation: "Na literatura o pleonasmo agrega valor estético; no dia a dia 'subir para cima' é redundância viciosa."
  },
  {
    id: "q-ple-06",
    category: "Pleonasmo",
    type: "direct",
    prompt: "Identifique a figura: 'Sorriu um sorriso radiante de felicidade.'",
    options: [],
    correctAnswer: "Pleonasmo",
    explanation: "Sorrir um sorriso é pleonasmo sintático/estilístico."
  },

  // --- QUESTIONS FOR TIE BREAKERS / EXTRA ---
  {
    id: "q-mix-01",
    category: "Prosopopeia",
    type: "choice",
    prompt: "[DESEMPATE] 'A dor dançava no meu peito.' Que figura atribui a ação de 'dançar' à dor?",
    options: ["Prosopopeia", "Metonímia", "Pleonasmo", "Hipérbole"],
    correctAnswer: "Prosopopeia",
    explanation: "Atribuição de uma dança à dor é prosopopeia."
  },
  {
    id: "q-mix-02",
    category: "Metonímia",
    type: "choice",
    prompt: "[DESEMPATE] 'O teto onde moro é humilde.' A palavra 'teto' representa a 'casa toda'. Trata-se de:",
    options: ["Metonímia", "Prosopopeia", "Pleonasmo", "Catacrese"],
    correctAnswer: "Metonímia",
    explanation: "Metonímia da parte pelo todo (teto representando a moradia)."
  },
  {
    id: "q-mix-03",
    category: "Pleonasmo",
    type: "choice",
    prompt: "[DESEMPATE] 'Grave acidente de trânsito teve uma vítima fatal que morreu no local.' Qual a redundância na frase?",
    options: ["Pleonasmo", "Prosopopeia", "Metonímia", "Ironia"],
    correctAnswer: "Pleonasmo",
    explanation: "'Vítima fatal que morreu' contém redundância Pleonástica."
  }
];
