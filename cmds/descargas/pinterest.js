import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text?.trim() || m.quoted?.text || null
    if (!query) return m.reply(`*🏮 [ CharlyBot ]*\n\n📌 *Busca imágenes en Pinterest*\n\n> *Ejemplo:* ${usedPrefix + command} anime wallpaper`)

    await m.react('🔍')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/search/pinterest`, {
            params: { q: query, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result?.length) {
            await m.react('❌')
            return m.reply('⚠️ No se encontraron imágenes.')
        }

        const results = data.result.slice(0, 5)
        await m.reply(`📌 *${results.length} imágenes encontradas para:* _${query}_`)

        for (const item of results) {
            const imgUrl = item.url || item.image || item.src
            if (!imgUrl) continue
            await conn.sendMessage(m.chat, {
                image: { url: imgUrl },
                caption: `📌 *Pinterest* | ⚡ By Charly Developer`
            }, { quoted: m })
            await new Promise(r => setTimeout(r, 1000))
        }

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al buscar en Pinterest.')
    }
}

handler.help = ['pinterest <búsqueda>']
handler.tags = ['descargas']
handler.command = ['pinterest', 'pin', 'pt']

export default handler
