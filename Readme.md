# Portfólio de Vídeo com JSON

Este é um site de portfólio estático, simples e moderno, projetado para editores de vídeo e criativos. Todo o conteúdo do site, desde os títulos até os vídeos e links de contato, é controlado dinamicamente por um único arquivo: `config.json`.

Isso permite que você atualize seu portfólio inteiro sem tocar em uma linha de código HTML ou JavaScript.

## Estrutura de Arquivos

O projeto é composto por 4 arquivos principais:

  * `index.html`: A estrutura HTML base do site.
  * `style.css`: O arquivo de estilo que define todo o visual.
  * `config.json`: O "painel de controle" de todo o site. **É o único arquivo que você precisará editar.**
  * `app.js`: O script que lê o `config.json` e constrói a página dinamicamente.

## Como Usar: O Painel de Controle (`config.json`)

Para adicionar, remover ou editar qualquer coisa no seu site, basta abrir e editar o arquivo `config.json`.

### 1\. Configurações Gerais

Para mudar o título da aba do navegador ou seu nome principal:

```json
{
  "siteTitle": "Seu Nome | Editor de Vídeo",
  "hero": {
    "enabled": true,
    "title": "Seu Nome Aqui",
    "subtitle": "Editor de Vídeo & Filmmaker"
  },
  ...
}
```

### 2\. Ativando ou Desativando Seções

Você pode esconder qualquer seção do site (como "Mídias Sociais" ou "Contato") simplesmente mudando seu valor `enabled` de `true` para `false`.

```json
  "socialMedia": {
    "enabled": false,  // <-- Esta seção agora está oculta
    "title": "Mídias Sociais",
    ...
  },
```

### 3\. Adicionando e Removendo Vídeos

Esta é a parte principal. Tanto a seção `projects` quanto a `socialMedia` possuem um array (lista) chamado `videos`. Para adicionar um novo vídeo, basta copiar e colar o bloco de um vídeo existente e alterar os valores.

```json
  "projects": {
    "enabled": true,
    "title": "Projetos Principais",
    "featuredCount": 2, // Quantos vídeos aparecem na home
    "videos": [
      {
        "title": "Meu Novo Vídeo",
        "description": "Descrição do que eu fiz neste projeto.",
        "type": "youtube",
        "id_or_url": "COLE_O_LINK_OU_ID_AQUI"
      },
      {
        "title": "Meu Vídeo Antigo",
        "description": "Edição e color grading.",
        "type": "vimeo",
        "id_or_url": "https://vimeo.com/123456789"
      }
    ]
  },
```

#### Tipos de Vídeo Suportados

O campo `type` é muito importante e informa ao site como processar seu link. Você pode usar os seguintes tipos:

  * `"type": "youtube"`
  * `"type": "gdrive"` (ou `"drive"`)
  * `"type": "vimeo"`
  * `"type": "dailymotion"`

O campo `id_or_url` é inteligente: você pode colar **tanto o ID do vídeo quanto o link completo** de compartilhamento. O site extrairá o ID correto automaticamente.

**Exemplos Válidos:**

  * **YouTube:** `"dQw4w9WgXcQ"`
  * **YouTube:** `"https://www.youtube.com/watch?v=dQw4w9WgXcQ"`
  * **YouTube:** `"https://www.youtube.com/shorts/1YxwzdR5A64"`
  * **Google Drive:** `"https://drive.google.com/file/d/1SLP.../view?usp=sharing"`
  * **Vimeo:** `"123456789"`
  * **Vimeo:** `"https://vimeo.com/123456789"`
  * **Dailymotion:** `"https://www.dailymotion.com/video/x12345"`

#### Controlando as Galerias

O campo `"featuredCount"` controla quantos vídeos aparecem na página inicial. Se você tiver 10 vídeos na lista, mas o `"featuredCount"` for `2`, apenas os 2 primeiros aparecerão, e o botão "Ver Galeria Completa" será exibido.

### 4\. Adicionando ou Removendo Contatos

Para editar seus links de contato, vá até a seção `contact` e edite a lista `links`. Para remover um link, simplesmente apague seu bloco de código.

```json
  "contact": {
    "enabled": true,
    "title": "Vamos Conversar?",
    "links": [
      {
        "name": "WhatsApp",
        "url": "https://wa.me/5598988827057",
        "icon": "fab fa-whatsapp"
      },
      {
        "name": "Email",
        "url": "mailto:mscarvalho0523@gmail.com",
        "icon": "fas fa-envelope"
      }
      // Para remover o Instagram, apague o bloco dele
    ]
  }
```

*Nota sobre Ícones:* Os ícones vêm da biblioteca [Font Awesome](https://fontawesome.com/icons). Você pode trocar `fab fa-whatsapp` por qualquer outro ícone gratuito, como `fab fa-behance` ou `fab fa-tiktok`.

## Como Publicar (Deploy no GitHub Pages)

Este site é 100% compatível com o GitHub Pages.

1.  Crie um novo repositório no GitHub.
2.  Envie (faça `push`) os 4 arquivos (`index.html`, `style.css`, `config.json`, `app.js`) para este repositório.
3.  No seu repositório GitHub, vá em **Settings** \> **Pages**.
4.  Em "Build and deployment", selecione a Fonte como **Deploy from a branch**.
5.  Selecione o branch (ex: `main`) e a pasta (`/ (root)`).
6.  Clique em **Save**.

Após alguns minutos, seu site estará no ar no endereço `https.SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/`.

## Customização Avançada

Se você quiser mudar as cores, fontes ou animações, todas as regras de estilo estão no arquivo `style.css`. As cores principais estão definidas no topo, dentro do bloco `:root`.

```css
:root {
    --bg-color: #111827;       /* Fundo: Azul-ardósia escuro */
    --card-color: #1F2937;     /* Cor dos Cards: Azul-ardósia mais claro */
    ...
}
```