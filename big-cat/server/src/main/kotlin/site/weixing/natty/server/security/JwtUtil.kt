package site.weixing.natty.server.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import java.util.*

/**
 * JWT 工具类
 * 对应原 NestJS 的 auth.service.ts 中的 JWT 逻辑
 */
@Component
class JwtUtil(
    @Value("\${app.jwt.secret:xiaoju-survey-secret-key-2024}")
    private val secret: String,
    @Value("\${app.jwt.expiration:604800000}") // 7 days
    private val expiration: Long
) {
    private val key = Keys.hmacShaKeyFor(secret.toByteArray(StandardCharsets.UTF_8))

    /**
     * 生成 JWT Token
     */
    fun generateToken(
        userId: String,
        username: String,
        additionalInfo: Map<String, Any> = emptyMap()
    ): String {
        val claims = Jwts.claims().apply {
            subject(userId)
            add(mapOf(
                "username" to username,
                "userId" to userId
            ))
            putAll(additionalInfo)
        }

        val now = Date()
        val expiryDate = Date(now.time + expiration)

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key)
            .compact()
    }

    /**
     * 从 Token 中获取用户 ID
     */
    fun getUserIdFromToken(token: String): String? {
        return getClaimsFromToken(token)?.subject
    }

    /**
     * 从 Token 中获取用户名
     */
    fun getUsernameFromToken(token: String): String? {
        return getClaimsFromToken(token)?.get("username", String::class.java)
    }

    /**
     * 从 Token 中获取 Claims
     */
    fun getClaimsFromToken(token: String): Claims? {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .body
        } catch (e: Exception) {
            null
        }
    }

    /**
     * 验证 Token 是否有效
     */
    fun validateToken(token: String): Boolean {
        return try {
            val claims = getClaimsFromToken(token)
            claims != null && !isTokenExpired(claims)
        } catch (e: Exception) {
            false
        }
    }

    /**
     * 判断 Token 是否过期
     */
    private fun isTokenExpired(claims: Claims): Boolean {
        return claims.expiration?.before(Date()) ?: true
    }

    /**
     * 刷新 Token
     */
    fun refreshToken(token: String): String? {
        val claims = getClaimsFromToken(token) ?: return null
        val userId = claims.subject
        val username = claims["username"] as? String ?: return null

        return generateToken(userId, username)
    }

    /**
     * 获取 Token 过期时间
     */
    fun getExpirationDate(token: String): Date? {
        return getClaimsFromToken(token)?.expiration
    }
}

/**
 * JWT 用户信息
 */
data class JwtUser(
    val userId: String,
    val username: String,
    val additionalInfo: Map<String, Any> = emptyMap()
) {
    companion object {
        fun fromClaims(claims: Claims): JwtUser {
            return JwtUser(
                userId = claims.subject,
                username = claims["username"] as? String ?: "",
                additionalInfo = claims.mapValues { it.value }
                    .filterKeys { it != "username" && it != "userId" && it != "sub" }
            )
        }
    }
}
