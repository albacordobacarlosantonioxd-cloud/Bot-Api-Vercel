import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    const hasImage = m.msg?.mimetype?.includes('image') || m.quoted?.message?.imageMessage

    if (!hasImage) {
        return m.reply(`*🏮 [ CharlyBot ]*\n\n🔎 *Mejorar calidad de imagen*\n\nEnvía o cita una imagen con el comando.\n> *Ejemplo:* Cita una imagen + ${usedPrefix + command}`)
    }

    await m.react('⏳')

    try {
        const stream = await conn.downloadMediaMessage(m)
        const buffer = await streamToBuffer(stream)
        const base64 = buffer.toString('base64')

        const { data } = await axios.post(`${global.apiCharlyBase}/api/tools/upscale`, {
            image: base64,
            key: global.apiCharlyKey
        })

        if (!data.status || (!data.result && !data.url && !data.image)) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo mejorar la imagen.')
        }

        const imgUrl = data.result || data.url || data.image

        await conn.sendMessage(m.chat, {
            image: { url: imgUrl },
            caption: `🔎 *Imagen mejorada (Upscale)*\n⚡ *By Charly Developer*`
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al procesar la imagen.')
    }
}

async function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = []
        stream.on('data', chunk => chunks.push(chunk))
        stream.on('end', () => resolve(Buffer.concat(chunks)))
        stream.on('error', reject)
    })
}

handler.help = ['upscale (cita una imagen)']
handler.tags = ['herramientas']
handler.command = ['upscale', 'hd', 'mejorar']

export default handler
