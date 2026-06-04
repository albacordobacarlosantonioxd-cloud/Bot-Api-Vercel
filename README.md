# 🏮 CharlyBot-MD V2.0
> Bot de WhatsApp con **api-charly.vercel.app**

---

## ⚡ Instalación

```bash
npm install
```

## 🔑 Configuración

Edita `settings.js`:

```js
global.owner = [['521XXXXXXXXXX', 'TuNombre', true]] // Tu número sin +
global.apiCharlyKey = 'charly_TU_API_KEY'             // Tu API Key
```

## 🚀 Iniciar

```bash
node index.js
# o con nodemon:
npm run dev
```

Escanea el QR con WhatsApp y ¡listo!

---

## 📡 Endpoints usados (api-charly.vercel.app)

| Comando | Endpoint | Descripción |
|---------|----------|-------------|
| `.gpt` | `/api/chatgpt` | ChatGPT |
| `.gpt4` | `/api/ai/gpt4` | GPT-4 |
| `.claude` | `/api/ai/claude` | Claude 3 |
| `.gptprompt` | `/api/ai/gptprompt` | GPT con prompt |
| `.imagen` | `/api/ai/text2img` | Generar imágenes |
| `.animetoreal` | `/api/ai/animetoreal` | Anime → Realista |
| `.audio` | `/api/ytplay` | YouTube MP3 |
| `.video` | `/api/ytplayvid` | YouTube MP4 |
| `.flac` | `/api/download/flac` | FLAC premium |
| `.spotify` | `/api/download/spotify` + `/api/search/spotify` | Spotify |
| `.ig` | `/api/download/ig` | Instagram |
| `.tiktok` | `/api/download/tiktok` | TikTok sin WM |
| `.tiktokmp3` | `/api/download/tiktokmp3` | TikTok audio |
| `.fb` | `/api/download/fb` | Facebook |
| `.pinterest` | `/api/search/pinterest` | Pinterest |
| `.mediafire` | `/api/download/mediafire` | MediaFire |
| `.terabox` | `/api/download/terabox` | TeraBox |
| `.upscale` | `/api/tools/upscale` | Mejorar imagen |
| `.brat` | `/api/tools/bratv` | BRAT sticker |
| `.igstalk` | `/api/tools/igstalk` | Instagram stalk |
| `.wachannel` | `/api/tools/wachannel` | Info canal WA |

---

## 📁 Estructura

```
CharlyBot-MD/
├── index.js          # Entrada principal (Baileys)
├── main.js           # Procesador de comandos
├── settings.js       # Configuración global
├── core/
│   ├── message.js    # Parser de mensajes
│   ├── loader.js     # Cargador dinámico de cmds
│   └── system/
│       └── initdb.js # Base de datos en memoria
└── cmds/
    ├── main/         # ping, menu
    ├── ia/           # chatgpt, claude, gpt4, text2img, animetoreal
    ├── descargas/    # audio, video, flac, spotify, tiktok, ig, fb...
    ├── herramientas/ # upscale, brat, wachannel
    └── utilidades/   # igstalk
```

---

⚡ **By Charly Developer** | 📡 **api-charly.vercel.app**
