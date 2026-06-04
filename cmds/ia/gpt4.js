import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text?.trim() || m.quoted?.text || null
    if (!query) return m.reply(`✨ *Consulta a GPT-4*\n\n> *Ejemplo:* ${usedPrefix + command} Explica la relatividad general`)

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/ai/gpt4`, {
            params, timeout: 600000: { q: query, key: global.apiCharlyKey }
        })

        if (!data.status || (!data.result && !data.data)) {
            await m.react('❌')
            return m.reply('⚠️ *Sin respuesta del servidor.*')
        }

        const respuesta = data.result || data.data

        let response = `┏━━━━━━━━━━━━━━━━┓\n`
        response += `┃    💡 *GPT-4 AI* ┃\n`
        response += `┗━━━━━━━━━━━━━━━━┛\n\n`
        response += `${respuesta}\n\n`
        response += `━━━━━━━━━━━━━━━━━━━━\n`
        response += `⚡ *By Charly Developer*`

        await m.reply(response)
        await m.react('✅')
    } catch (e) {
        console.error(e)
        m.reply('⚠️ Error con GPT-4.')
    }
}

handler.help = ['gpt4 <pregunta>']
handler.tags = ['ia']
handler.command = ['gpt4', 'g4']

export default handler
