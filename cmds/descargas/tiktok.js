import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text?.trim() || m.quoted?.text || null
    if (!url) return m.reply(`*🏮 [ CharlyBot ]*\n\n🎵 *Descargador de TikTok*\n\n> *Ejemplo:* ${usedPrefix + command} https://vm.tiktok.com/xxx`)

    if (!url.includes('tiktok.com') && !url.includes('vm.tiktok')) {
        return m.reply('⚠️ Por favor envía un enlace válido de TikTok.')
    }

    await m.react('⏳')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/download/tiktok`, {
            params: { url, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo descargar el video de TikTok.')
        }

        const video = data.result
        let caption = `┏━━━━━━━━━━━━━━━━━━┓\n`
        caption += `┃  🎵 *TikTok DL*  ┃\n`
        caption += `┗━━━━━━━━━━━━━━━━━━┛\n\n`
        if (video.title || video.desc) caption += `📌 *${video.title || video.desc}*\n`
        if (video.author) caption += `👤 *Autor:* ${video.author}\n`
        caption += `🚫 *Sin marca de agua*\n`
        caption += `\n━━━━━━━━━━━━━━━━━━━━\n`
        caption += `⚡ *By Charly Developer*`

        await conn.sendMessage(m.chat, {
            video: { url: video.video || video.nowm || video.download },
            caption,
            mimetype: 'video/mp4'
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al descargar de TikTok.')
    }
}

handler.help = ['tiktok <url>']
handler.tags = ['descargas']
handler.command = ['tiktok', 'tt', 'tk']

export default handler
