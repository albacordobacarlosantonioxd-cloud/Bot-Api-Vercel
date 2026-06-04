import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text?.trim() || m.quoted?.text || null
    if (!query) return m.reply(
        `*🏮 [ CharlyBot ]*\n\n` +
        `🎶 *Letras de Canciones*\n\n` +
        `> *Ejemplo:* ${usedPrefix + command} Pase y Pase Tito Double P`
    )

    await m.react('🎵')

    try {
        const { data } = await axios.get('https://sylphyy.xyz/search/lyrics', {
            params: { title: query, api_key: 'sylphy-ty5xtWm' },
            timeout: 15000
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se encontraron letras para esa canción.')
        }

        const { title, artist, album, duration, lyrics } = data.result

        const header =
            `┏━━━━━━━━━━━━━━━━━━┓\n` +
            `┃   🎶 *LETRAS* 🎶   ┃\n` +
            `┗━━━━━━━━━━━━━━━━━━┛\n\n` +
            `🎵 *Canción:* ${title}\n` +
            `👤 *Artista:* ${artist}\n` +
            (album ? `💿 *Álbum:* ${album}\n` : '') +
            (duration ? `⏱️ *Duración:* ${duration}\n` : '') +
            `\n━━━━━━━━━━━━━━━━━━━━\n\n`

        const footer = `\n\n━━━━━━━━━━━━━━━━━━━━\n⚡ *By Charly Developer*`

        const full = header + lyrics + footer

        if (full.length <= 3500) {
            await conn.sendMessage(m.chat, { text: full })
        } else {
            await conn.sendMessage(m.chat, { text: header + `📜 *Enviando letra completa...*` })
            const chunks = lyrics.match(/.{1,3500}/gs) || []
            for (let i = 0; i < chunks.length; i++) {
                const isLast = i === chunks.length - 1
                await conn.sendMessage(m.chat, { text: chunks[i] + (isLast ? footer : '') })
                if (!isLast) await new Promise(r => setTimeout(r, 800))
            }
        }

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al obtener la letra de la canción.')
    }
}

handler.help = ['lyrics <canción + artista>']
handler.tags = ['utilidades']
handler.command = ['lyrics', 'letra', 'letras', 'lyric']

export default handler
