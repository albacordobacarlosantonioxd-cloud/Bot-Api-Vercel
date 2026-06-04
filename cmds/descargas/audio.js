import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text?.trim() || m.quoted?.text || null
    if (!query) return m.reply(`*🏮 [ CharlyBot ]*\n\n🎵 *¿Qué audio deseas descargar?*\n\n> *Ejemplo:* ${usedPrefix + command} Fuerza Regida\n> *Con URL:* ${usedPrefix + command} https://youtube.com/watch?v=xxx`)

    await m.react('⏳')

    try {
        const params = query.includes('youtu')
            ? { url: query, key: global.apiCharlyKey }
            : { q: query, key: global.apiCharlyKey }

        const { data } = await axios.get(`${global.apiCharlyBase}/api/ytplay`, { params })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo procesar la descarga. Intenta con otro término.')
        }

        const track = data.result
        let info = `┏━━━━━━━━━━━━━━━━━━┓\n`
        info += `┃  🎵 *YouTube MP3*  ┃\n`
        info += `┗━━━━━━━━━━━━━━━━━━┛\n\n`
        info += `📌 *Título:* ${track.title}\n`
        if (track.author) info += `👤 *Canal:* ${track.author}\n`
        if (track.duration) info += `⏱️ *Duración:* ${track.duration}\n`
        info += `\n━━━━━━━━━━━━━━━━━━━━\n`
        info += `⚡ *By Charly Developer*\n`
        info += `📡 *Charly Developers*`

        if (track.thumbnail || track.image) {
            await conn.sendMessage(m.chat, { image: { url: track.thumbnail || track.image }, caption: info }, { quoted: m })
        }

        await conn.sendMessage(m.chat, {
            audio: { url: track.mp3 || track.download },
            mimetype: 'audio/mpeg',
            fileName: `${track.title}.mp3`
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al conectar con la API.')
    }
}

handler.help = ['audio <nombre o URL>']
handler.tags = ['descargas']
handler.command = ['audio', 'ytmp3', 'mp3', 'yta']

export default handler
