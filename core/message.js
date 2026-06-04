import { downloadMediaMessage } from '@whiskeysockets/baileys'

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

    // Menciones
    m.mentionedJid = m.msg?.contextInfo?.mentionedJid || []

    // Mensaje citado
    if (m.msg?.contextInfo?.quotedMessage) {
        const qMsg = m.msg.contextInfo.quotedMessage
        const qType = Object.keys(qMsg)[0]
        const qContent = qMsg[qType]

        m.quoted = {
            key: {
                remoteJid: m.chat,
                id: m.msg.contextInfo.stanzaId,
                participant: m.msg.contextInfo.participant,
                fromMe: m.msg.contextInfo.participant === (conn.user.id.split(':')[0] + '@s.whatsapp.net')
            },
            message: qMsg,
            type: qType,
            text: qContent?.text || qContent?.caption || qMsg?.conversation || '',
            sender: m.msg.contextInfo.participant || m.msg.contextInfo.remoteJid,
            fromMe: m.msg.contextInfo.participant === (conn.user.id.split(':')[0] + '@s.whatsapp.net'),
            id: m.msg.contextInfo.stanzaId,
            msg: qContent,
            mimetype: qContent?.mimetype || '',
            // Descargar media del mensaje citado
            download: () => downloadMediaMessage(
                { key: { remoteJid: m.chat, id: m.msg.contextInfo.stanzaId, participant: m.msg.contextInfo.participant }, message: qMsg },
                'buffer',
                {},
                { reuploadRequest: conn.updateMediaMessage }
            )
        }
    }

    // Helpers
    m.reply = (text) => conn.sendMessage(m.chat, { text }, { quoted: m })
    m.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } })
    // Descargar media del mensaje principal
    m.download = () => downloadMediaMessage(M, 'buffer', {}, { reuploadRequest: conn.updateMediaMessage })

    return m
}
