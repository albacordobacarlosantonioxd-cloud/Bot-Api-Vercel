export async function initDB() {
    return {
        data: {
            users: {},
            chats: {},
            stats: { totalCommands: 0 }
        }
    }
}

export function xpRange(level) {
    const base = 500
    const inc = 250
    const min = base + (level * inc)
    const max = min + base + (level * inc)
    return { min, max }
}
