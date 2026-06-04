import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text?.trim() || m.quoted?.text || null
    if (!query) return m.reply(`*🏮 [ CharlyBot ]*\n\n🎬 *¿Qué video deseas descargar?*\n\n> *Ejemplo:* ${usedPrefix + command} Fuerza Regida\n> *Con URL:* ${usedPrefix + command} https://youtube.com/watch?v=xxx`)

    await m.react('⏳')

    try {
        const params = query.includes('youtu')
            ? { url: query, key: global.apiCharlyKey }
            : { q: query, key: global.apiCharlyKey }

        const { data } = await axios.get(`${global.apiCharlyBase}/api/ytplayvid`, { params })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo procesar la descarga del video.')
        }

        const video = data.result
        let info = `┏━━━━━━━━━━━━━━━━━━┓\n`
        info += `┃  🎬 *YouTube MP4*  ┃\n`
        info += `┗━━━━━━━━━━━━━━━━━━┛\n\n`
        info += `📌 *Título:* ${video.title}\n`
        if (video.author) info += `👤 *Canal:* ${video.author}\n`
        if (video.duration) info += `⏱️ *Duración:* ${video.duration}\n`
        if (video.quality) info += `🎞️ *Calidad:* ${video.quality}\n`
        info += `\n━━━━━━━━━━━━━━━━━━━━\n`
        info += `⚡ *By Charly Developer*\n`
        info += `📡 *Charly Developers*`

        await conn.sendMessage(m.chat, {
            video: { url: video.mp4 || video.download },
            caption: info,
            mimetype: 'video/mp4'
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al descargar el video.')
    }
}

handler.help = ['video <nombre o URL>']
handler.tags = ['descargas']
handler.command = ['video', 'ytmp4', 'mp4', 'ytv']

export default handler
