import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text?.trim() || m.quoted?.text || null
    if (!url || !url.includes('terabox')) {
        return m.reply(`*🏮 [ CharlyBot ]*\n\n📦 *Descargador de TeraBox*\n\n> *Ejemplo:* ${usedPrefix + command} https://terabox.com/s/xxx`)
    }

    await m.react('⏳')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/download/terabox`, {
            params, timeout: 600000: { url, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo extraer el link de TeraBox.')
        }

        const file = data.result
        let info = `┏━━━━━━━━━━━━━━━━━━┓\n`
        info += `┃  📦 *TeraBox DL*  ┃\n`
        info += `┗━━━━━━━━━━━━━━━━━━┛\n\n`
        if (file.name || file.filename) info += `📌 *Nombre:* ${file.name || file.filename}\n`
        if (file.size) info += `📦 *Tamaño:* ${file.size}\n`
        info += `🔗 *Link directo:* ${file.download_url || file.url || file.download}\n`
        info += `━━━━━━━━━━━━━━━━━━━━\n`
        info += `⚡ *By Charly Developer*`

        await m.reply(info)
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al obtener archivo de TeraBox.')
    }
}

handler.help = ['terabox <url>']
handler.tags = ['descargas']
handler.command = ['terabox', 'tera', 'tb']

export default handler
