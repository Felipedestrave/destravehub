# 🎯 Proposta de Landing Page — Destrave Hub

Este documento consolida a estratégia, estrutura e regras de negócio para a criação da nova **Landing Page de Captação de Leads**, integrada diretamente ao sistema de gestão de alunos e leads do **Destrave Hub**.

---

## 📌 1. Conceito Comercial e Posicionamento

A Landing Page foi desenhada sob a filosofia de **"Relação de Confiança de Igual para Igual"** e de **"Honestidade Intelectual"**. 

*   **Objetivo Único:** Fazer o lead agendar um bate-papo individual gratuito de 40 minutos com o Felipe Sensei (Entrevista Inicial / Diagnóstico).
*   **Ausência de Depoimentos Tradicionais:** Em vez de prints de WhatsApp e promessas agressivas de marketing digital clássico, a página demonstra confiança no discernimento do aluno. As histórias reais de superação ficam reservadas para o Instagram, mantendo a LP limpa e de alta autoridade.
*   **Transparência Total (Filtro BOFU):** Os preços e a proposta oficial de mentoria individual são abertos diretamente no vídeo de vendas. Isso atua como um filtro natural, poupando a agenda do Sensei de curiosos que não têm o orçamento necessário.

---

## 📐 2. Estrutura de Seções da Landing Page (`/quero-destravar` ou `/lp`)

A Landing Page será construída como uma rota nativa no Astro, garantindo alta performance de carregamento (SEO) e reuso do design system (Tailwind CSS v4 + React).

### Seção 1: Hero (Abertura de Alto Impacto com Teste A/B)
*   **Estética:** Escura, moderna, premium e com toques de gamificação (Brand Purple e Action Orange sobre fundo escuro ou Slate Dark).
*   **Mecânica de Teste A/B:** O site selecionará aleatoriamente uma das 3 variações de Headline/Subheadline abaixo no carregamento inicial da página e a salvará no `localStorage` do usuário para manter a consistência em visitas recorrentes.
*   **Variação A (Foco em Praticidade e Leveza):**
    *   **Headline:** *"Fale o japonês da vida real com confiança e liberdade. O método prático e individual que transforma o estudo em jogo."*
    *   **Subheadline:** *"Esqueça as regras decoradas sem contexto. Aprenda a entender a estrutura do idioma através de analogias simples e divertidas, com um Roadmap sob medida adaptado aos seus objetivos e à sua rotina."*
*   **Variação B (Foco em Conversação e Didática Divertida):**
    *   **Headline:** *"Destrave o japonês falado nas ruas. Deixe as decorebas exaustivas de lado e aprenda a se comunicar com autonomia de verdade."*
    *   **Subheadline:** *"Aqui a gramática complexa se torna simples através de analogias e jogos. Um acompanhamento individual 100% versátil e gamificado, ideal tanto para quem vive no Japão quanto para quem é apaixonado pelo idioma."*
*   **Variação C (Foco em Conexão e Metodologia Sob Medida):**
    *   **Headline:** *"Conecte-se com o japonês real de forma leve, prática e personalizada."*
    *   **Subheadline:** *"Sem decorebas chatas: explicamos a gramática com analogias divertidas para você entender de verdade, não apenas memorizar. Um sistema dinâmico e flexível criado para se adaptar ao seu nível e aos seus objetivos individuais."*
*   **CTA Principal:** Botão chamativo de rolagem suave para a seção do formulário.

### Seção 2: Player do Vídeo de Vendas
Um player em destaque no meio da tela (YouTube ou Vimeo integrado) contendo um vídeo direto e sem enrolação estruturado em **5 passos**:

1.  **Conexão & Vulnerabilidade:** Felipe compartilha seu perrengue real (morou 30 anos no Japão falando só o básico para sobrevivência em fábrica) para gerar identificação imediata.
2.  **O Método das Ruas:** Explicação de por que cursos tradicionais passivos de gramática falham, e como o treino ativo com roleplays simula a vida real.
3.  **Demonstração Visual:** Felipe grava a tela do **Destrave Hub** por dentro, mostrando as missões práticas, o simulador MRP e a economia de moedas (Destrave Coins).
4.  **A Proposta e Preços:** Apresentação aberta dos planos oficiais do acompanhamento individual mensal.
5.  **A Chamada / Transição de Autoridade:** 
    > *"Agora que você já me conhece, viu o app por dentro e sabe a nossa proposta e valores, eu quero conhecer você de verdade para ver se o seu perfil bate com o tipo de aluno que eu consigo ajudar a destravar. Role a página, preencha o formulário e vamos marcar o nosso bate-papo de 40 minutos."*

### Seção 3: O Ecossistema (Demonstrativo de Benefícios)
Apresentação visual em grid/cards dos quatro pilares do método de estudos individual:

*   **Adventure Roadmap (Trilha de Missões):** Uma jornada visual clara. Você sempre sabe qual é o próximo passo no seu aprendizado, sem se perder em aulas soltas.
*   **Destrave MRP (Mission Role Play):** O simulador de diálogos cotidianos. O aluno treina conversações reais de fábrica, compras, prefeitura e viagens em um ambiente seguro com feedbacks inteligentes antes de falar com nativos.
*   **Destrave Coins (Joga Dopamina!):** Estudar vira um jogo. Cada atividade concluída rende moedas virtuais (Destrave Coins) que o aluno pode usar na loja do app para desbloquear avatares exclusivos, temas de cores e títulos especiais.
*   **Anki Inteligente (Sem Sofrimento):** Cartões de repetição espaçada projetados para revisar o vocabulário das aulas em apenas 5 minutos deitado no sofá após o turno de trabalho.

### Seção 4: Relação de Confiança (O Anti-Depoimento)
Bloco de texto no final da página reforçando o posicionamento e autoridade da escola:

> ### 🤝 Nós confiamos na sua inteligência
> 
> Você não vai encontrar nesta página prints de conversas editados, promessas mágicas de fluência sem esforço ou contadores de escassez piscando na tela para te pressionar a comprar. Nós respeitamos o seu tempo e o seu discernimento.
> 
> O **Destrave Hub** não é um curso gravado para você acumular poeira digital. É um acompanhamento individual, prático e focado na sua vida real no Japão. 
> 
> Como cada vaga é para atendimento personalizado direto com o Felipe Sensei, nós não vendemos esse acesso de forma automatizada por um carrinho de compras. O processo começa com um bate-papo rápido e gratuito de 40 minutos para entender sua rotina, mapear suas dificuldades e montar o seu Roadmap de estudos. 
> 
> Se fizer sentido para você e se tivermos sintonia, você decide se quer começar. Sem pressão.

### Seção 5: Mascotes & Animações com Scroll (React + Framer Motion)
Para dar um ar "vivo" e interativo ao site, sugerimos animar ilustrações transparentes dos personagens oficiais do elenco surgindo nas margens da tela de acordo com o scroll:
*   **Tanuki Novato (`/assets/avatars/tanuki-novato.png`):** Surge confuso com uma interrogação ao lado da seção que discute as dores/gafes do japonês de livro.
*   **Ashigaru (`/assets/avatars/ashigaru.png`):** Surge em posição de prontidão perto da seção que explica o treino de conversação das ruas.
*   **Felipe Sensei (`/avatars/sensei.png`):** Surge jogando moedas/dopamina na seção de gamificação (Destrave Coins).

---

## 📝 3. Formulário de Captura & Integração com WhatsApp

O formulário deve ser limpo e focado em qualificação rápida:
1.  **Nome completo** (Texto)
2.  **WhatsApp** (Com máscara inteligente e seletor internacional para DDI `+55` e `+81`)
3.  **Nível de Japonês** (Dropdown):
    *   *Iniciante do Zero*
    *   *Já estudei / Sei o básico*
    *   *Intermediário / Avançado*

### 🔄 Fluxo Pós-Cadastro:
1.  **Banco de Dados:** O lead é registrado no Supabase na tabela `students` com `is_lead: true`. A origem (`Landing Page`), o WhatsApp (com DDI correto), o status inicial (`Novo`) e a **variação de Headline exibida** (ex: `A`, `B` ou `C`) são salvos nos metadados (`metadata.ab_variant`). O nível de japonês é salvo no campo `level` correspondente.
2.  **Redirecionamento Dinâmico:** O navegador do usuário abre automaticamente uma janela de chat no WhatsApp do Felipe Sensei com a seguinte mensagem pré-preenchida dinâmica:
    > *"Olá, Felipe Sensei! Meu nome é **[Nome]**, tenho nível **[Nível]** de japonês e acabei de assistir ao vídeo da plataforma. Quero agendar o meu bate-papo de 40 minutos para destravar!"*

---

## 🛠️ 4. Evolução do Painel do Sensei (`/dashboard/leads`)

Para suportar essas melhorias, a tela de leads atual (`LeadsList.tsx`) será atualizada para incluir:
1.  **Filtro de Origem:** Identificar se o lead veio da "Landing Page" ou de um "Link de Exercício do YouTube".
2.  **Coluna de Nível:** Mostrar visualmente o nível de japonês selecionado pelo lead.
3.  **Marcador do Teste A/B:** Exibir qual variação de Headline gerou o lead (Tag visual `Var A`, `Var B` ou `Var C`) no card/tabela, facilitando a mensuração de qual copy converte melhor.
4.  **Mudança de Status:** Adicionar botões ou seletor rápido para alterar o status do lead (Novo, Contatado, Fechado, Arquivado) diretamente no painel.
5.  **Mensagem Dinâmica no WhatsApp Admin:** Correção do DDI (removendo o hardcoded `55`) e geração automática do link de contato com base no número internacional correto do lead.


---

## ⚡ 5. Regras de Otimização de Conversão (CRO)

Para maximizar a taxa de captação de leads na Landing Page, seguiremos três boas práticas recomendadas para funis de alta conversão:

1.  **Zero Pontos de Fuga (No Navigation Bar):** A página `/quero-destravar` não carregará o cabeçalho/menu de navegação geral do Destrave Hub (como links para o login ou páginas internas). A única saída possível para o usuário é preencher o formulário.
2.  **Redução de Ansiedade / Sinais de Confiança:** 
    *   Logo abaixo do formulário de cadastro, adicionaremos uma frase de confiança (ex: *"Seus dados estão protegidos. Contato 100% livre de spam e sem compromisso."*).
    *   Explicar visualmente o passo a passo pós-cadastro (1. Enviar Formulário → 2. Abrir WhatsApp → 3. Agendar bate-papo de 40 min).
3.  **Visual Tangível (Demos Visuais):** O corpo da página exibirá mockups visuais/screenshots reais da interface do aplicativo (como o painel do MRP e a carteira de moedas) para que o método pareça real e palpável antes mesmo do vídeo.

---

## 💬 6. Decisões Consolidadas

1.  **Interface de DDI do WhatsApp:** Caixa de seleção visual (com bandeiras de Brasil e Japão) para o usuário escolher o DDI (+55 ou +81) antes de preencher o número.
2.  **Mascotes Utilizados:** Serão usados os avatares já existentes no repositório (`tanuki-novato.png`, `ashigaru.png` em `/assets/avatars/` e `sensei.png` em `/avatars/`).
3.  **Hospedagem do Vídeo:** Hospedado diretamente no YouTube.
4.  **Fluxo de Captura:** O lead será apenas registrado no banco e redirecionado imediatamente para o WhatsApp de conversão de entrevista do Sensei (sem geração automática de missão experimental).

