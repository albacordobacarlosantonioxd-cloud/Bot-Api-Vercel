import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text?.trim() || m.quoted?.text || null
    if (!query) return m.reply(`✨ *Escribe tu consulta*\n\n> *Ejemplo:* ${usedPrefix + command} ¿Cómo hacer un bot de WhatsApp?`)

    await m.react('🧠')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/ai/claude`, {
            params: { q: query, key: global.apiCharlyKey }
        })

        if (!data.status || (!data.result && !data.data)) {
            await m.react('❌')
            return m.reply('⚠️ *Sin respuesta del servidor.*')
        }

        const respuesta = data.result || data.data

        let response = `┏━━━━━━━━━━━━━━━━┓\n`
        response += `┃    🤖 *CLAUDE AI* ┃\n`
        response += `┗━━━━━━━━━━━━━━━━┛\n\n`
        response += `💡 *RESPUESTA:*\n${respuesta}\n\n`
        response += `━━━━━━━━━━━━━━━━━━━━\n`
        response += `⚡ *By Charly Developer*\n`
        response += `📡 *Charly Developers*`

        await m.reply(response)
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ *Error de conexión con la Matrix.*')
    }
}

handler.help = ['claude <pregunta>']
handler.tags = ['ia']
handler.command = ['claude', 'clau']

export default handler
