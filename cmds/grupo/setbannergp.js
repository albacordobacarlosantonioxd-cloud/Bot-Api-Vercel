var handler = async (m, { conn, isAdmins, isOwner }) => {
    if (!(isOwner || isAdmins)) return m.reply('✨ *Solo administradores.*')

    // Imagen citada o enviada con el comando
    const hasImage = m.msg?.mimetype?.includes('image') || m.quoted?.mimetype?.includes('image') || m.quoted?.type === 'imageMessage'

    if (!hasImage) return m.reply('✨ Responde a una imagen o envíala con el comando para cambiar la foto del grupo.')

    try {
        const img = m.quoted?.mimetype?.includes('image')
            ? await m.quoted.download()
            : await m.download()

        await conn.updateProfilePicture(m.chat, img)
        m.reply('📸 Foto del grupo actualizada correctamente.')
    } catch (e) {
        console.error(e)
        m.reply('❌ No se pudo actualizar la foto. Asegúrate de que soy administrador.')
    }
}

handler.help = ['setppgp']
handler.tags = ['admin']
handler.command = ['setbannergp', 'setppgp', 'fotogp']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
