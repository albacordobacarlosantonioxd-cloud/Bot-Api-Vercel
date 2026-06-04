import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text?.trim() || m.quoted?.text || null
    if (!url || !url.includes('instagram.com')) {
        return m.reply(`*🏮 [ CharlyBot ]*\n\n📸 *Descargador de Instagram*\n\n> *Ejemplo:* ${usedPrefix + command} https://www.instagram.com/reel/xxx`)
    }

    await m.react('⏳')

    try {
        // Intentar con el endpoint principal
        const endpoint = command === 'igscraper' ? '/api/download/igscraper' : '/api/download/ig'
        const { data } = await axios.get(`${global.apiCharlyBase}${endpoint}`, {
            params: { url, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo descargar el contenido de Instagram.')
        }

        const result = data.result
        const caption = `┏━━━━━━━━━━━━━━━━━━┓\n` +
            `┃  📸 *Instagram DL*  ┃\n` +
            `┗━━━━━━━━━━━━━━━━━━┛\n\n` +
            (result.caption ? `📌 *${result.caption.slice(0, 100)}...*\n` : '') +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `⚡ *By Charly Developer*`

        // Puede ser video o imagen
        const mediaUrl = result.video || result.url || result.download
        const isVideo = result.video || (result.type === 'video')

        if (isVideo) {
            await conn.sendMessage(m.chat, { video: { url: mediaUrl }, caption, mimetype: 'video/mp4' }, { quoted: m })
        } else {
            // Carrusel o imagen
            const items = Array.isArray(result.items) ? result.items : [result]
            for (const item of items.slice(0, 5)) {
                const itemUrl = item.url || item.video || item.image
                if (!itemUrl) continue
                const isVid = item.type === 'video' || item.video
                await conn.sendMessage(m.chat, isVid
                    ? { video: { url: itemUrl }, caption, mimetype: 'video/mp4' }
                    : { image: { url: itemUrl }, caption }
                , { quoted: m })
            }
        }

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al descargar de Instagram.')
    }
}

handler.help = ['ig <url>']
handler.tags = ['descargas']
handler.command = ['ig', 'igdl', 'insta', 'instagram', 'igscraper']

export default handler
