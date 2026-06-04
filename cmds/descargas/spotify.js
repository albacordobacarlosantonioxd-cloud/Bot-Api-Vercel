import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text?.trim() || m.quoted?.text || null
    if (!query) return m.reply(`*🏮 [ CharlyBot ]*\n\n🎵 *Busca o descarga de Spotify*\n\n> *Ejemplo:* ${usedPrefix + command} Mask Off\n> *Con URL:* ${usedPrefix + command} https://open.spotify.com/track/...`)

    await m.react('⚡')

    try {
        const isUrl = /open\.spotify\.com|spotify\.link/.test(query)
        let trackUrl = query

        // Si no es URL, buscar primero
        if (!isUrl) {
            const { data: sData } = await axios.get(`${global.apiCharlyBase}/api/search/spotify`, {
                params: { q: query, key: global.apiCharlyKey }
            })
            if (!sData.status || !sData.result?.length) {
                await m.react('❌')
                return m.reply('*🏮 [ ERROR ]* No se encontraron resultados en Spotify.')
            }
            trackUrl = sData.result[0].link || sData.result[0].url
        }

        // Descargar
        const { data } = await axios.get(`${global.apiCharlyBase}/api/download/spotify`, {
            params: { url: trackUrl, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('*🏮 [ FALLO ]* No se pudo descargar la canción.')
        }

        const info = data.result
        let txt = `┏━━━━━━━━━━━━━━━━━━┓\n`
        txt += `┃   🏮 *Charly SPOTIFY* 🏮\n`
        txt += `┣━━━━━━━━━━━━━━━━━━┛\n`
        txt += `┃\n`
        txt += `┃ 🎵 *Título:* ${info.name || info.title}\n`
        txt += `┃ 👤 *Artista:* ${info.artist || info.artists}\n`
        txt += `┃ 💿 *Álbum:* ${info.album}\n`
        if (info.duration) txt += `┃ ⏱️ *Duración:* ${info.duration}\n`
        txt += `┃\n`
        txt += `┃ ⚙️ *Estado:* 🟢 Listo\n`
        txt += `┃\n`
        txt += `┣━━━━━━━━━━━━━━━━━━┓\n`
        txt += `┃ ⚡ *By Charly Developer*\n`
        txt += `┗━━━━━━━━━━━━━━━━━━┛`

        const imgUrl = info.imageHD || info.image || info.cover
        if (imgUrl) {
            await conn.sendMessage(m.chat, { image: { url: imgUrl }, caption: txt }, { quoted: m })
        } else {
            await m.reply(txt)
        }

        await conn.sendMessage(m.chat, {
            audio: { url: info.url || info.download || info.mp3 },
            mimetype: 'audio/mpeg',
            fileName: `${info.name || info.title}.mp3`
        }, { quoted: m })

        await m.react('🔥')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al conectar con Spotify API.')
    }
}

handler.help = ['spotify <nombre o link>']
handler.tags = ['descargas']
handler.command = ['spotify', 'sp', 'spt']

export default handler
