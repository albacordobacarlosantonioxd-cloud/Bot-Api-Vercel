import axios from 'axios'

var handler = async (m, { conn, text, args, usedPrefix, command }) => {
    // Uso: .gptprompt <prompt del sistema> | <mensaje>
    if (!text || !text.includes('|')) {
        return m.reply(`*🏮 [ CharlyBot ]*\n\n🧠 *ChatGPT con prompt personalizado*\n\n> *Formato:* ${usedPrefix + command} <sistema> | <mensaje>\n> *Ejemplo:* ${usedPrefix + command} Eres un chef profesional | ¿Cómo hacer pasta carbonara?`)
    }

    const [sistema, ...msgParts] = text.split('|')
    const mensaje = msgParts.join('|').trim()

    if (!sistema.trim() || !mensaje) {
        return m.reply('⚠️ Formato incorrecto. Usa: `.gptprompt <sistema> | <mensaje>`')
    }

    await m.react('🧠')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/ai/gptprompt`, {
            params, timeout: 600000: {
                system: sistema.trim(),
                q: mensaje,
                key: global.apiCharlyKey
            }
        })

        if (!data.status || (!data.result && !data.data)) {
            await m.react('❌')
            return m.reply('⚠️ Sin respuesta del servidor.')
        }

        const respuesta = data.result || data.data

        let response = `┏━━━━━━━━━━━━━━━━┓\n`
        response += `┃  🧠 *GPT PROMPT* ┃\n`
        response += `┗━━━━━━━━━━━━━━━━┛\n\n`
        response += `📋 *Sistema:* _${sistema.trim()}_\n\n`
        response += `${respuesta}\n\n`
        response += `━━━━━━━━━━━━━━━━━━━━\n`
        response += `⚡ *By Charly Developer*`

        await m.reply(response)
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error con GPT Prompt.')
    }
}

handler.help = ['gptprompt <sistema> | <mensaje>']
handler.tags = ['ia']
handler.command = ['gptprompt', 'prompt', 'gptp']

export default handler
