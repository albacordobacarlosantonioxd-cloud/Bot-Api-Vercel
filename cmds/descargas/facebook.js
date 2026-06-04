import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text?.trim() || m.quoted?.text || null
    if (!url || !url.includes('facebook.com')) {
        return m.reply(`*🏮 [ CharlyBot ]*\n\n📘 *Descargador de Facebook*\n\n> *Ejemplo:* ${usedPrefix + command} https://www.facebook.com/watch?v=xxx`)
    }

    await m.react('⏳')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/download/fb`, {
            params: { url, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo descargar el video de Facebook.')
        }

        const video = data.result
        const caption = `┏━━━━━━━━━━━━━━━━━━┓\n` +
            `┃  📘 *Facebook DL*  ┃\n` +
            `┗━━━━━━━━━━━━━━━━━━┛\n\n` +
            (video.title ? `📌 *${video.title}*\n` : '') +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `⚡ *By Charly Developer*`

        await conn.sendMessage(m.chat, {
            video: { url: video.hd || video.sd || video.download },
            caption,
            mimetype: 'video/mp4'
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al descargar de Facebook.')
    }
}

handler.help = ['fb <url>']
handler.tags = ['descargas']
handler.command = ['fb', 'fbdl', 'facebook']

export default handler
