# 🎤 Guia de Nomenclatura dos Áudios do Buddy

O sistema do **Buddy** (através do componente `BuddyView.tsx` e o utilitário `buddy-phrases.ts`) carrega dinamicamente arquivos de áudio toda vez que uma mensagem é exibida para o aluno.

Se você for gerar e adicionar as falas manualmente, basta arrastar os arquivos `.mp3` para as pastas que **já acabei de criar para você**!

## 📌 Regras Principais:
1. **Formato:** O arquivo **MUITO OBRIGATORIAMENTE** deve ter a extensão `.mp3`.
2. **Nomenclatura (Sanitização):** O sistema transforma a frase escrita no código num formato de "link" para achar o arquivo:
    * Fica tudo em letras minúsculas.
    * Espaços, vírgulas e pontos de exclamação viram ` hífens (-)` ou são removidos.
3. **Pasta Base:** `public/assets/buddy-voices/[ID-DO-AVATAR]/[TIPO-DA-FRASE]/`


---

## 📂 Organização das Pastas e Nomes

Como o sistema busca o áudio considerando sempre de **qual avatar** é a voz, você precisará duplicar as **Frases Genéricas** na pasta de cada um (caso use vozes diferentes, elas serão o mesmo texto na voz do personagem específico).

Aqui estão as frases exatas e como você deve nomear o arquivo `.mp3` para cada uma delas:

### 1. Frases GENÉRICAS 
> Copie esses áudios (com a voz do personagem) e coloque dentro das pastas `success/` e `error/` de **TODOS** os avatares.

**Pasta `success/` (Sucesso):**
* Frase: *"Yatta!"* ➔ **Nome do arquivo:** `yatta.mp3`
* Frase: *"Sugoi!"* ➔ **Nome do arquivo:** `sugoi.mp3`
* Frase: *"Seikou!"* ➔ **Nome do arquivo:** `seikou.mp3`
* Frase: *"Seikai!"* ➔ **Nome do arquivo:** `seikai.mp3`
* Frase: *"Yoku dekimashita!"* ➔ **Nome do arquivo:** `yoku-dekimashita.mp3`

**Pasta `error/` (Erro):**
* Frase: *"Zannen!"* ➔ **Nome do arquivo:** `zannen.mp3`
* Frase: *"Moi ichido!"* ➔ **Nome do arquivo:** `moi-ichido.mp3`
* Frase: *"Donmai!"* ➔ **Nome do arquivo:** `donmai.mp3`
* Frase: *"Kiai da!"* ➔ **Nome do arquivo:** `kiai-da.mp3`

---

### 2. Frases ESPECIAIS (Por Avatar)
> Estes áudios são exclusivos de cada personagem e vão apenas na respectiva subpasta.

#### `avatar-ashigaru` 
* Caminho Success: `public/assets/buddy-voices/avatar-ashigaru/success/kiseki-da-seikai.mp3`
* Caminho Error: `public/assets/buddy-voices/avatar-ashigaru/error/s-sumimasen.mp3`

#### `avatar-ninja-sapeca` 
* Caminho Success: `public/assets/buddy-voices/avatar-ninja-sapeca/success/hayai-de-gozaru.mp3`
* Caminho Error: `public/assets/buddy-voices/avatar-ninja-sapeca/error/kiesaritai-de-gozaru.mp3`

#### `avatar-samurai-zen` 
* Caminho Success: `public/assets/buddy-voices/avatar-samurai-zen/success/shizuka-ni-seikai.mp3`
* Caminho Error: `public/assets/buddy-voices/avatar-samurai-zen/error/mada-renshuu-ga-tarinai.mp3`

#### `avatar-onna-musha`
* Caminho Success: `public/assets/buddy-voices/avatar-onna-musha/success/utsukushii-seikai.mp3`
* Caminho Error: `public/assets/buddy-voices/avatar-onna-musha/error/tate-naoshimashou.mp3`

#### `avatar-ronin` 
* Caminho Success: `public/assets/buddy-voices/avatar-ronin/success/yoi-ude-da.mp3`
* Caminho Error: `public/assets/buddy-voices/avatar-ronin/error/michi-wa-mada-nagai.mp3`

#### `avatar-shinobi` 
* Caminho Success: `public/assets/buddy-voices/avatar-shinobi/success/kanpeki-da.mp3`
* Caminho Error: `public/assets/buddy-voices/avatar-shinobi/error/shikujitta-ka.mp3`

#### `avatar-shogun-supremo`
* Caminho Success: `public/assets/buddy-voices/avatar-shogun-supremo/success/tenka-ippin-da.mp3`
* Caminho Error: `public/assets/buddy-voices/avatar-shogun-supremo/error/tsugi-wa-katsu-zo.mp3`

---

### Observação importante sobre o Mascote Padrão:
O mascote principal e fallback é o `avatar-tanuki-novato`. Ele não possui frases exclusivas no código contidas na variável `AVATAR_SPECIAL_PHRASES`. Portanto, para ele emitir sons, basta popular a pasta:
`public/assets/buddy-voices/avatar-tanuki-novato/success/`
`public/assets/buddy-voices/avatar-tanuki-novato/error/`
com os `.mp3` das frases **genéricas** mencionadas acima!
