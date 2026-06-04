import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text?.trim() || null
    if (!url || !url.includes('whatsapp.com/channel')) {
        return m.reply(`*🏮 [ CharlyBot ]*\n\n💬 *Info de Canal de WhatsApp*\n\n> *Ejemplo:* ${usedPrefix + command} https://whatsapp.com/channel/xxx`)
    }

    await m.react('🔍')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/tools/wachannel`, {
            params: { url, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo obtener info del canal.')
        }

        const ch = data.result
        let info = `┏━━━━━━━━━━━━━━━━━━┓\n`
        info += `┃  💬 *WhatsApp Channel*  ┃\n`
        info += `┗━━━━━━━━━━━━━━━━━━┛\n\n`
        if (ch.name) info += `📌 *Nombre:* ${ch.name}\n`
        if (ch.description) info += `📝 *Descripción:* ${ch.description}\n`
        if (ch.subscribers !== undefined) info += `👥 *Suscriptores:* ${ch.subscribers?.toLocaleString()}\n`
        if (ch.verified !== undefined) info += `✅ *Verificado:* ${ch.verified ? 'Sí' : 'No'}\n`
        info += `\n━━━━━━━━━━━━━━━━━━━━\n`
        info += `⚡ *By Charly Developer*`

        const img = ch.picture || ch.image
        if (img) {
            await conn.sendMessage(m.chat, { image: { url: img }, caption: info }, { quoted: m })
        } else {
            await m.reply(info)
        }

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al obtener info del canal.')
    }
}

handler.help = ['wachannel <url>']
handler.tags = ['herramientas']
handler.command = ['wachannel', 'channel', 'canal']

export default handler
