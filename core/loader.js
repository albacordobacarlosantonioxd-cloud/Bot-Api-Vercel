import fs from 'fs'
import path from 'path'

const getFiles = (dir) => {
    let results = []
    const list = fs.readdirSync(dir)
    list.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(filePath))
        } else if (filePath.endsWith('.js')) {
            results.push(filePath)
        }
    })
    return results
}

export async function getCommand(commandName) {
    const cmdsDir = path.join(process.cwd(), 'cmds')
    if (!fs.existsSync(cmdsDir)) return null

    const files = getFiles(cmdsDir)

    for (const filePath of files) {
        try {
            const { default: cmd } = await import(`file://${filePath}?update=${Date.now()}`)
            const fileName = path.basename(filePath, '.js')
            const isMatch = fileName === commandName || (
                cmd.command && (Array.isArray(cmd.command)
                    ? cmd.command.includes(commandName)
                    : cmd.command === commandName)
            )
            if (isMatch) return cmd
        } catch {
            continue
        }
    }
    return null
}
