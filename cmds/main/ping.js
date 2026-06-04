var handler = async (m, { conn, usedPrefix }) => {
    const start = Date.now()
    await m.react('⚡')
    const end = Date.now()
    const ping = end - start

    await m.reply(`┏━━━━━━━━━━━━━━━━┓\n┃    🏮 *CharlyBot*    ┃\n┗━━━━━━━━━━━━━━━━┛\n\n⚡ *Ping:* ${ping}ms\n🟢 *Estado:* Online\n📡 *API:* api-charly.vercel.app\n\n━━━━━━━━━━━━━━━━━━━━\n⚡ *By Charly Developer*`)
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping', 'speed']

export default handler
