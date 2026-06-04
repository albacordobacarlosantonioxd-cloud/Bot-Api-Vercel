import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let texto = text?.trim() || m.quoted?.text || null
    if (!texto) return m.reply(`*🏮 [ CharlyBot ]*\n\n🎭 *Sticker estilo BRAT*\n\n> *Ejemplo:* ${usedPrefix + command} i'm so brat`)

    await m.react('⏳')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/tools/bratv`, {
            params: { text: texto, key: global.apiCharlyKey }
        })

        if (!data.status || (!data.result && !data.url && !data.image && !data.gif)) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo generar el BRAT.')
        }

        const mediaUrl = data.result || data.url || data.gif || data.image
        const isGif = mediaUrl?.includes('.gif') || data.gif

        await conn.sendMessage(m.chat, {
            [isGif ? 'video' : 'image']: { url: mediaUrl },
            ...(isGif ? { gifPlayback: true, mimetype: 'video/mp4' } : {}),
            caption: `🎭 *BRAT Style*\n📝 _${texto}_\n\n⚡ *By Charly Developer*`
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al generar el BRAT.')
    }
}

handler.help = ['brat <texto>']
handler.tags = ['herramientas']
handler.command = ['brat', 'bratv']

export default handler
