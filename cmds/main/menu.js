var handler = async (m, { conn, usedPrefix }) => {
    let imageMenu = 'https://i.postimg.cc/rsLZrVxy/mi-imagen-del-menu.png'

    let menu = `┏━━━━━━━━━━━━━━━━━━━━┓
┃  🏮 *CHARLY-BOT MAESTRO V2* 🏮
┗━━━━━━━━━━━━━━━━━━━━┛

👤 *Hᴏʟᴀ:* @${m.sender.split('@')[0]}
⚡ *Dᴇᴠ:* Charly Developer
📅 *Fᴇᴄʜᴀ:* ${new Date().toLocaleDateString('es-MX')}

━━━━┫ *I.A. COMMANDS* ┣━━━
*${usedPrefix}gpt*
> ChatGPT interactivo
*${usedPrefix}gpt4*
> GPT-4 avanzado
*${usedPrefix}claude*
> Claude 3 AI
*${usedPrefix}gptprompt*
> GPT con prompt personalizado
*${usedPrefix}imagen*
> Generar imágenes con IA
*${usedPrefix}animetoreal*
> Anime a realista (cita foto)

━━━━┫ *YOUTUBE* ┣━━━━━
*${usedPrefix}audio*
> Descargar MP3 de YouTube
*${usedPrefix}video*
> Descargar MP4 de YouTube
*${usedPrefix}flac*
> Descargar en calidad FLAC

━━━┫ *REDES SOCIALES* ┣━━━━
*${usedPrefix}spotify*
> Descargar de Spotify
*${usedPrefix}ig*
> Descargar de Instagram
*${usedPrefix}tiktok*
> TikTok sin marca de agua
*${usedPrefix}tiktokmp3*
> Audio de TikTok
*${usedPrefix}fb*
> Videos de Facebook
*${usedPrefix}pinterest*
> Buscar en Pinterest

━━━━┫ *ARCHIVOS* ┣━━━
*${usedPrefix}mediafire*
> Descargar de MediaFire
*${usedPrefix}terabox*
> Enlace directo TeraBox

━━┫ *HERRAMIENTAS* ┣━━
*${usedPrefix}upscale*
> Mejorar calidad imagen
*${usedPrefix}brat*
> Sticker estilo BRAT
*${usedPrefix}igstalk*
> Info de perfil Instagram
*${usedPrefix}wachannel*
> Info canal WhatsApp
*${usedPrefix}lyrics*
> Letras de canciones

━━━┫ *GRUPO / ADMIN* ┣━━━
*${usedPrefix}kick*
> Sacar a un miembro
*${usedPrefix}promote*
> Darle admin a alguien
*${usedPrefix}demote*
> Quitarle admin a alguien
*${usedPrefix}del*
> Borrar mensaje (cita)
*${usedPrefix}tag*
> Tagear a todos
*${usedPrefix}link*
> Obtener enlace del grupo
*${usedPrefix}revoke*
> Renovar enlace del grupo
*${usedPrefix}open / ${usedPrefix}close*
> Abrir o cerrar el grupo
*${usedPrefix}setppgp*
> Cambiar foto del grupo
*${usedPrefix}setdescgp*
> Cambiar descripción del grupo

━━━━━┫ *BOT* ┣━━━━
*${usedPrefix}ping*
> Velocidad del bot
*${usedPrefix}menu*
> Este menú
━━━━━━━━━━━━━━━━━━━━━
*𝘽𝙮: Charly Developer*
*Charly Developers*
━━━━━━━━━━━━━━━━━━━━━`

    await conn.sendMessage(m.chat, {
        image: { url: imageMenu },
        caption: menu,
        mentions: [m.sender]
    }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'comandos', 'h']

export default handler
