import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text?.trim() || m.quoted?.text || null
    if (!query) return m.reply(`✨ *¿Qué canción deseas en FLAC?*\n\n> *Ejemplo:* ${usedPrefix + command} Ivan Cornejo`)

    await m.react('⏳')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/download/flac`, {
            params, timeout: 600000: { q: query, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo descargar en FLAC.')
        }

        const audio = data.result
        let info = `┏━━━━━━━━━━━━━━━━┓\n`
        info += `┃       🎼 *FLAC*       ┃\n`
        info += `┗━━━━━━━━━━━━━━━━┛\n\n`
        info += `📌 *Título:* ${audio.title}\n`
        if (audio.quality) info += `⚙️ *Calidad:* ${audio.quality}\n`
        if (audio.artist) info += `👤 *Artista:* ${audio.artist}\n`
        info += `\n━━━━━━━━━━━━━━━━━━━━\n`
        info += `⚡ *By Charly Developer*\n`
        info += `📡 *Charly Developers*`

        await conn.sendMessage(m.chat, {
            document: { url: audio.download_url || audio.download || audio.url },
            caption: info,
            mimetype: 'audio/flac',
            fileName: `${audio.title}.flac`
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al procesar tu audio FLAC.')
    }
}

handler.help = ['flac <búsqueda>']
handler.tags = ['descargas']
handler.command = ['flac', 'ytflac']

export default handler
