import './settings.js'
import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import { smsg } from './core/message.js'
import main from './main.js'
import chalk from 'chalk'
import pino from 'pino'
import qrcode from 'qrcode-terminal'
import { initDB } from './core/system/initdb.js'

const logger = pino({ level: 'silent' })

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./Sessions/Owner')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false, // lo manejamos manualmente
        auth: state,
        browser: ['CharlyBot MD', 'Chrome', '120.0.0'],
        getMessage: async () => undefined
    })

    // Guardar credenciales
    sock.ev.on('creds.update', saveCreds)

    // Iniciar base de datos
    global.db = await initDB()

    // Eventos de conexión
    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log(chalk.yellow('\n╔══════════════════════════════╗'))
            console.log(chalk.yellow('║   📱 Escanea el QR en WhatsApp  ║'))
            console.log(chalk.yellow('╚══════════════════════════════╝\n'))
            qrcode.generate(qr, { small: true })
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            console.log(chalk.red('[!] Conexión cerrada.'), shouldReconnect ? chalk.yellow('Reconectando...') : chalk.red('Sesión cerrada.'))
            if (shouldReconnect) setTimeout(startBot, 3000)
        } else if (connection === 'open') {
            console.log(chalk.green('\n[✓] Bot conectado exitosamente!'))
            console.log(chalk.cyan(`[✓] Usuario: ${sock.user?.name}`))
            console.log(chalk.cyan(`[✓] ID: ${sock.user?.id}`))
        }
    })

    // Procesar mensajes
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return
        const m = await smsg(sock, messages[0])
        if (!m) return
        await main(sock, m)
    })
}

console.log(chalk.cyan('\n╔══════════════════════════════╗'))
console.log(chalk.cyan('║     🏮 CharlyBot-MD V2.0     ║'))
console.log(chalk.cyan('║   API: api-charly.vercel.app  ║'))
console.log(chalk.cyan('╚══════════════════════════════╝\n'))

startBot().catch(err => console.error(chalk.red('[ERROR]'), err))
