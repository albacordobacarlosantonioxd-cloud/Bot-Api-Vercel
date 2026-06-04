import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text?.trim() || m.quoted?.text || null
    if (!query) return m.reply(`*🏮 [ CharlyBot ]*\n\n🤖 *Consulta a ChatGPT*\n\n> *Ejemplo:* ${usedPrefix + command} ¿Cómo optimizar código Node.js?`)

    await m.react('💬')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/chatgpt`, {
            params, timeout: 600000: { q: query, key: global.apiCharlyKey }
        })

        if (!data.status || (!data.result && !data.data)) {
            await m.react('❌')
            return m.reply('⚠️ *Error en el servidor de la IA.*')
        }

        const respuesta = data.result || data.data

        let response = `┏━━━━━━━━━━━━━━━━┓\n`
        response += `┃    🤖 *CHATGPT AI* ┃\n`
        response += `┗━━━━━━━━━━━━━━━━┛\n\n`
        response += `${respuesta}\n\n`
        response += `━━━━━━━━━━━━━━━━━━━━\n`
        response += `⚡ *By Charly Developer*\n`
        response += `📡 *Charly Developers*`

        await m.reply(response)
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('🛑 *Error en la Matrix:* No se pudo obtener respuesta.')
    }
}

handler.help = ['gpt <pregunta>']
handler.tags = ['ia']
handler.command = ['chatgpt', 'gpt', 'ia']

export default handler
