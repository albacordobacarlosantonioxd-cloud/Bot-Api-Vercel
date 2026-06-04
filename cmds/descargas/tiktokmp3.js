import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text?.trim() || m.quoted?.text || null
    if (!url || !url.includes('tiktok')) {
        return m.reply(`*🏮 [ CharlyBot ]*\n\n🎶 *Extrae audio de TikTok en MP3*\n\n> *Ejemplo:* ${usedPrefix + command} https://vm.tiktok.com/xxx`)
    }

    await m.react('⏳')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/download/tiktokmp3`, {
            params, timeout: 600000: { url, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo extraer el audio.')
        }

        const audio = data.result
        let info = `┏━━━━━━━━━━━━━━━━━━┓\n`
        info += `┃  🎶 *TikTok MP3*  ┃\n`
        info += `┗━━━━━━━━━━━━━━━━━━┛\n\n`
        if (audio.title) info += `📌 *${audio.title}*\n`
        info += `━━━━━━━━━━━━━━━━━━━━\n`
        info += `⚡ *By Charly Developer*`

        await conn.sendMessage(m.chat, {
            audio: { url: audio.mp3 || audio.audio || audio.download },
            mimetype: 'audio/mpeg',
            fileName: `tiktok_audio.mp3`
        }, { quoted: m })

        await m.reply(info)
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al extraer audio de TikTok.')
    }
}

handler.help = ['tiktokmp3 <url>']
handler.tags = ['descargas']
handler.command = ['tiktokmp3', 'ttmp3', 'tkmp3']

export default handler
