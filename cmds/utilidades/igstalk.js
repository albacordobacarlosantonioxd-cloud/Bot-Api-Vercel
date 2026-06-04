import axios from 'axios'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    let user = text?.trim().replace('@', '') || null
    if (!user) return m.reply(`*🏮 [ CharlyBot ]*\n\n👤 *Instagram Stalk*\n\n> *Ejemplo:* ${usedPrefix + command} username`)

    await m.react('🔍')

    try {
        const { data } = await axios.get(`${global.apiCharlyBase}/api/tools/igstalk`, {
            params, timeout: 600000: { username: user, key: global.apiCharlyKey }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply('⚠️ No se pudo obtener información del perfil.')
        }

        const p = data.result
        let info = `┏━━━━━━━━━━━━━━━━━━┓\n`
        info += `┃  👤 *Instagram Stalk*  ┃\n`
        info += `┗━━━━━━━━━━━━━━━━━━┛\n\n`
        info += `📌 *Usuario:* @${p.username || user}\n`
        if (p.full_name) info += `👤 *Nombre:* ${p.full_name}\n`
        if (p.biography) info += `📝 *Bio:* ${p.biography}\n`
        if (p.follower_count !== undefined) info += `👥 *Seguidores:* ${p.follower_count?.toLocaleString()}\n`
        if (p.following_count !== undefined) info += `➡️ *Siguiendo:* ${p.following_count?.toLocaleString()}\n`
        if (p.media_count !== undefined) info += `📸 *Posts:* ${p.media_count?.toLocaleString()}\n`
        if (p.is_verified !== undefined) info += `✅ *Verificado:* ${p.is_verified ? 'Sí' : 'No'}\n`
        if (p.is_private !== undefined) info += `🔒 *Privado:* ${p.is_private ? 'Sí' : 'No'}\n`
        info += `\n━━━━━━━━━━━━━━━━━━━━\n`
        info += `⚡ *By Charly Developer*`

        const avatar = p.profile_pic_url || p.hd_profile_pic_url
        if (avatar) {
            await conn.sendMessage(m.chat, { image: { url: avatar }, caption: info }, { quoted: m })
        } else {
            await m.reply(info)
        }

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Error al obtener el perfil de Instagram.')
    }
}

handler.help = ['igstalk <usuario>']
handler.tags = ['utilidades']
handler.command = ['igstalk', 'instastalk']

export default handler
