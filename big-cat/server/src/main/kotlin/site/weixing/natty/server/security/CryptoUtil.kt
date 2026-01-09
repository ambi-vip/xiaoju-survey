package site.weixing.natty.server.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec
import java.util.*

/**
 * 加密解密工具类
 * 对应原 NestJS 的 ResponseSecurityPlugin
 * 用于问卷响应数据的 AES 加密/解密
 */
@Component
class CryptoUtil(
    @Value("\${app.crypto.aes-secret:xiaoju-survey-aes-secret-key-32}")
    private val aesSecretKey: String
) {
    private val ALGORITHM = "AES"
    private val TRANSFORMATION = "AES/ECB/PKCS5Padding"
    private val CHARSET = Charsets.UTF_8

    /**
     * 生成 AES 密钥（确保是 16/24/32 字节）
     */
    private fun generateKey(): SecretKeySpec {
        // 确保 key 长度为 16, 24 或 32 字节
        val keyBytes = aesSecretKey.toByteArray(CHARSET)
        val keyLength = when {
            keyBytes.size >= 32 -> 32
            keyBytes.size >= 24 -> 24
            keyBytes.size >= 16 -> 16
            else -> 16
        }
        val paddedKey = keyBytes.take(keyLength).plus ByteArray(keyLength - keyBytes.size) { 0 }
        return SecretKeySpec(paddedKey, ALGORITHM)
    }

    /**
     * AES 加密
     * @param plainText 明文
     * @return Base64 编码的密文
     */
    fun encrypt(plainText: String): String {
        try {
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.ENCRYPT_MODE, generateKey())
            val encryptedBytes = cipher.doFinal(plainText.toByteArray(CHARSET))
            return Base64.getEncoder().encodeToString(encryptedBytes)
        } catch (e: Exception) {
            throw CryptoException("AES 加密失败", e)
        }
    }

    /**
     * AES 解密
     * @param cipherText Base64 编码的密文
     * @return 明文
     */
    fun decrypt(cipherText: String): String {
        try {
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.DECRYPT_MODE, generateKey())
            val decodedBytes = Base64.getDecoder().decode(cipherText)
            val decryptedBytes = cipher.doFinal(decodedBytes)
            return String(decryptedBytes, CHARSET)
        } catch (e: Exception) {
            throw CryptoException("AES 解密失败", e)
        }
    }

    /**
     * 批量加密
     */
    fun encryptBatch(data: List<String>): List<String> {
        return data.map { encrypt(it) }
    }

    /**
     * 批量解密
     */
    fun decryptBatch(data: List<String>): List<String> {
        return data.map { decrypt(it) }
    }

    /**
     * 加密 Map 结构的数据（用于问卷响应数据）
     */
    fun encryptResponseData(responseData: Map<String, Any>): Map<String, Any> {
        return responseData.mapValues { (_, value) ->
            when (value) {
                is String -> encrypt(value)
                is Number -> value // 数字不加密
                is Boolean -> value // 布尔值不加密
                is List<*> -> value.map { item ->
                    if (item is String) encrypt(item) else item
                }
                else -> value
            }
        }
    }

    /**
     * 解密 Map 结构的数据（用于问卷响应数据）
     */
    fun decryptResponseData(encryptedData: Map<String, Any>): Map<String, Any> {
        return encryptedData.mapValues { (_, value) ->
            when (value) {
                is String -> try {
                    decrypt(value)
                } catch (e: Exception) {
                    value // 如果解密失败，返回原值
                }
                is Number -> value
                is Boolean -> value
                is List<*> -> value.map { item ->
                    if (item is String) try {
                        decrypt(item)
                    } catch (e: Exception) {
                        item
                    } else item
                }
                else -> value
            }
        }
    }
}

/**
 * 加密异常
 */
class CryptoException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
