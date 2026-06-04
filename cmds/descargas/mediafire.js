import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text?.trim() || m.quoted?.text || null
    if (!url || !url.includes('mediafire.com')) {
        return m.reply(`*🏮 [ CharlyBot ]*\n\n📦 *Descargador de MediaFire*\n\n> *Ejemplo:* ${usedPrefix + command} https://www.mediafire.com/file/xxx`)
    }

    await m.react('⏳')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/download/mediafire`, {
            params, timeout: 600000: { url, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo obtener el archivo de MediaFire.')
        }

        const file = data.result
        let info = `┏━━━━━━━━━━━━━━━━━━┓\n`
        info += `┃  📦 *MediaFire DL*  ┃\n`
        info += `┗━━━━━━━━━━━━━━━━━━┛\n\n`
        info += `📌 *Nombre:* ${file.filename || file.name}\n`
        if (file.size) info += `📦 *Tamaño:* ${file.size}\n`
        info += `🔗 *Link:* ${file.download_url || file.url}\n`
        info += `━━━━━━━━━━━━━━━━━━━━\n`
        info += `⚡ *By Charly Developer*`

        await m.reply(info)
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al obtener archivo de MediaFire.')
    }
}

handler.help = ['mf <url>']
handler.tags = ['descargas']
handler.command = ['mf', 'mediafire']

export default handler
