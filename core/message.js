export async function smsg(conn, m) {
    if (!m) return m
    let M = m.messages ? m.messages[0] : m
    if (!M.message) return m

    if (M.key) {
        m.id = M.key.id
        m.chat = M.key.remoteJid
        m.fromMe = M.key.fromMe
        m.isGroup = m.chat?.endsWith('@g.us')
        m.sender = m.fromMe
            ? (conn.user.id.split(':')[0] + '@s.whatsapp.net')
            : (m.isGroup ? M.key.participant : m.chat)
    }

    m.type = Object.keys(M.message)[0]
    m.isReaction = m.type === 'reactionMessage'
    m.msg = M.message[m.type]

    m.text = m.isReaction ? '' : (
        M.message.conversation ||
        m.msg?.text ||
        m.msg?.caption ||
        ''
    )

    // Mensaje citado
    if (m.msg?.contextInfo?.quotedMessage) {
        const qMsg = m.msg.contextInfo.quotedMessage
        const qType = Object.keys(qMsg)[0]
        m.quoted = {
            key: {
                remoteJid: m.chat,
                id: m.msg.contextInfo.stanzaId,
                participant: m.msg.contextInfo.participant
            },
            message: qMsg,
            type: qType,
            text: qMsg[qType]?.text || qMsg[qType]?.caption || qMsg?.conversation || ''
        }
    }

    // Helpers
    m.reply = (text) => conn.sendMessage(m.chat, { text }, { quoted: m })
    m.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } })

    return m
}
