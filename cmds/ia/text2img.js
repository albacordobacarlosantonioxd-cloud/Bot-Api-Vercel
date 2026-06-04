import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let prompt = text?.trim() || m.quoted?.text || null
    if (!prompt) return m.reply(`*🏮 [ CharlyBot ]*\n\n🎨 *Generador de Imágenes IA*\n\n> *Ejemplo:* ${usedPrefix + command} a beautiful sunset over the ocean, anime style`)

    await m.react('🎨')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/ai/text2img`, {
            params: { prompt, key: global.apiCharlyKey }
        })

        if (!data.status || (!data.result && !data.url && !data.image)) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo generar la imagen.')
        }

        const imgUrl = data.result || data.url || data.image

        await conn.sendMessage(m.chat, {
            image: { url: imgUrl },
            caption: `🎨 *Imagen generada por IA*\n📝 *Prompt:* _${prompt}_\n\n⚡ *By Charly Developer*`
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al generar la imagen.')
    }
}

handler.help = ['text2img <descripción>']
handler.tags = ['ia']
handler.command = ['text2img', 'img', 'imagen', 'dalle', 'gen']

export default handler
