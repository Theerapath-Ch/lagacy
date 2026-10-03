import {
    createCipheriv,
    createDecipheriv,
    randomBytes
} from "node:crypto"


const ALGORITHM = "aes-256-gcm"
const IV_LENGHTH = 12
const KEY_LENGTH = 32

const getEncryption = (): Buffer => {
    const value = process.env.ACCOUNT_ENCRYPTION_KEY

    if (!value) {
        throw new Error("ACCOUNT_ENCRYPTION_KEY is not set")
    }

    const key = Buffer.from(value, "base64")

    if (key.length !== KEY_LENGTH) {
        throw new Error(`ACCOUNT_ENCRYPTION_KEY must decode to ${KEY_LENGTH} bytes`)

    }
    return key
}

export const encrypt = (plaintext: string): string => {
    const key = getEncryption()
    const iv = randomBytes(IV_LENGHTH)

    const cipher = createCipheriv(ALGORITHM, key, iv)

    const cipherText = Buffer.concat([
        cipher.update(plaintext, "utf-8"),
        cipher.final()
    ])

    const authTag = cipher.getAuthTag()

    return [
        "v1",
        iv.toString("base64"),
        authTag.toString("base64url"),
        cipherText.toString("base64url"),
    ].join(":")
}

export const decrypt = (payload: string): string => {

    const [version, ivEncode, authTagEncode, ciphertextEncode] = payload.split(":")

    if (version !== "v1") {
        throw new Error("Unsupported encryption version")
    }

    if (!ivEncode || !authTagEncode || !ciphertextEncode) {
        throw new Error("Invalid encrypt payload")
    }

    const key = getEncryption()

    const iv = Buffer.from(ivEncode, "base64")
    const authTag = Buffer.from(authTagEncode, "base64")
    const cipherText = Buffer.from(ciphertextEncode, "base64")

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    const plaintext = Buffer.concat([
        decipher.update(cipherText),
        decipher.final()
    ])

    return plaintext.toString("utf-8")
}

