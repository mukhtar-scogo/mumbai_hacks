import { AccessToken } from 'livekit-server-sdk'

const LIVEKIT_API_KEY = 'APInVzvsnY83SVG'
const LIVEKIT_API_SECRET = 'qAe4sW5qZoyyzpezZytRaKFYN7XRweNGn6ep3ahnPGwC'

export function generateRandomAlphanumeric(length: number): string {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }

    return result
}

export const createToken = async () => {
    // If this room doesn't exist, it'll be automatically created when the first
    // client joins
    const roomName = `room-${generateRandomAlphanumeric(4)}-${generateRandomAlphanumeric(4)}`
    // Identifier to be used for participant.
    // It's available as LocalParticipant.identity with livekit-client SDK
    const participantName = `identity-${generateRandomAlphanumeric(4)}`

    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: participantName,
        // Token to expire after 10 minutes
        ttl: '10m',
    })
    at.addGrant({ roomJoin: true, room: roomName })

    const token = await at.toJwt()
    return { token: token, roomName: roomName, participantName }
}
