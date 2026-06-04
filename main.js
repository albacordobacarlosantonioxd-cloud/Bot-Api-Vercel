import './settings.js'
import { getCommand } from './core/loader.js'
import { xpRange } from './core/system/initdb.js'
import chalk from 'chalk'

export default async function main(sock, m) {
    global.charlyHandler = main

    try {
        if (!m || m.type === 'reactionMessage' || m.type === 'protocolMessage') return

        if (!global.db) global.db = { data: {} }
        if (!global.db.data) global.db.data = {}

        let db = global.db.data
        if (!db.users) db.users = {}
        if (!db.chats) db.chats = {}
        if (!db.stats) db.stats = { totalCommands: 0 }

        if (!db.users[m.sender]) {
            db.users[m.sender] = { exp: 0, level: 0, comandos: 0, afk: -1, afkReason: '', lastwork: 0, money: 0 }
        }
        let user = db.users[m.sender]

        if (m.isGroup && !db.chats[m.chat]) {
            db.chats[m.chat] = { isBanned: false, nsfw: false }
        }
        let chat = m.isGroup ? db.chats[m.chat] : {}

        const rawText = m.text || m.body || ''
        const dict = rawText.trim()

        // AFK
        if (user && user.afk > -1) {
            let tiempoAfk = Math.floor((Date.now() - user.afk) / 60000)
            await sock.sendMessage(m.chat, {
                text: `🎊 ¡Bienvenido de vuelta *@${m.sender.split('@')[0]}*!\n> Estuviste inactivo *${tiempoAfk} minutos*.`,
                mentions: [m.sender]
            }, { quoted: m })
            user.afk = -1
            user.afkReason = ''
        }

        const prefixes = global.prefix || ['.', '#', '/', ',']
        const usedPrefix = prefixes.find(p => dict.startsWith(p))
        if (!usedPrefix) return

        const noPrefixText = dict.slice(usedPrefix.length).trim()
        const commandName = noPrefixText.split(' ')[0].toLowerCase()
        const text = noPrefixText.slice(commandName.length).trim()
        const args = text.split(/ +/).filter(v => v)

        const commandFile = await getCommand(commandName)

        if (commandFile) {
            if (user?.banned) return
            if (m.isGroup && chat?.isBanned) return

            const numberBot = sock.user.id.split(':')[0] + '@s.whatsapp.net'
            const ownerList = Array.isArray(global.owner) ? global.owner : []
            const isOwner = [numberBot, ...ownerList.map(v => (Array.isArray(v) ? v[0] : v).replace(/[^0-9]/g, '') + '@s.whatsapp.net')].includes(m.sender)

            const groupMetadata = m.isGroup ? await sock.groupMetadata(m.chat).catch(() => ({})) : {}
            const participants = m.isGroup ? (groupMetadata.participants || []) : []
            const userAdmins = participants.filter(p => p.admin !== null).map(p => p.id)
            const isAdmins = m.isGroup ? userAdmins.includes(m.sender) : false
            const isBotAdmins = m.isGroup ? userAdmins.includes(numberBot) : false

            user.exp = (user.exp || 0) + 10
            user.comandos = (user.comandos || 0) + 1
            db.stats.totalCommands = (db.stats.totalCommands || 0) + 1

            let { max } = xpRange(user.level || 0)
            if (user.exp >= max) {
                user.level = (user.level || 0) + 1
                await sock.sendMessage(m.chat, {
                    text: `🎊 ¡Subiste de nivel! Ahora eres nivel *${user.level}*`,
                    mentions: [m.sender]
                }, { quoted: m })
            }

            console.log(chalk.green(`[EXE] ${commandName} | Por: ${m.sender.split('@')[0]}`))

            const runMethod = commandFile.handler || commandFile.run ||
                (typeof commandFile === 'function' ? commandFile : null) ||
                commandFile.default?.handler || commandFile.default?.run

            if (typeof runMethod === 'function') {
                await runMethod(m, {
                    sock, conn: sock, client: sock,
                    text, args, usedPrefix, command: commandName,
                    participants, isOwner, isAdmins, isBotAdmins,
                    db, user, chat
                })
            }
        }
    } catch (err) {
        console.error(chalk.red.bold('[!] ERROR:'), err)
    }
}
