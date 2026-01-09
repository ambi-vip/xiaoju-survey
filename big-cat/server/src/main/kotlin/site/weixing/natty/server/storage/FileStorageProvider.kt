package site.weixing.natty.server.storage

import org.springframework.web.multipart.MultipartFile
import java.io.InputStream

/**
 * 文件存储提供者接口
 * 支持多种存储后端：本地、七牛云、阿里 OSS、MinIO
 */
interface FileStorageProvider {
    /**
     * 上传文件
     * @param file 文件
     * @param key 存储路径（文件唯一标识）
     * @return 文件访问 URL
     */
    fun upload(file: MultipartFile, key: String): String

    /**
     * 上传文件流
     * @param inputStream 文件流
     * @param key 存储路径
     * @param contentType 文件类型
     * @return 文件访问 URL
     */
    fun upload(inputStream: InputStream, key: String, contentType: String): String

    /**
     * 删除文件
     * @param key 文件存储路径
     */
    fun delete(key: String)

    /**
     * 获取文件访问 URL
     * @param key 文件存储路径
     * @param expirySeconds 过期时间（秒），仅对私有读有效
     * @return 文件访问 URL
     */
    fun getUrl(key: String, expirySeconds: Int? = null): String

    /**
     * 检查文件是否存在
     * @param key 文件存储路径
     * @return 是否存在
     */
    fun exists(key: String): Boolean
}

/**
 * 文件存储配置
 */
data class FileStorageConfig(
    /**
     * 存储类型
     */
    val provider: FileStorageProviderType,

    /**
     * 是否私有读
     */
    val isPrivateRead: Boolean = false,

    /**
     * 文件路径前缀
     * 例如: "userUpload/{surveyPath}"
     */
    val fileKeyPrefix: String = "userUpload",

    /**
     * 是否需要认证
     */
    val needAuth: Boolean = true,

    /**
     * 访问链接过期时间
     * 格式: "2h", "1d" 等
     */
    val linkExpiryTime: String = "2h",

    /**
     * 七牛云配置
     */
    val qiniuConfig: QiniuConfig? = null,

    /**
     * 阿里 OSS 配置
     */
    val aliOssConfig: AliOssConfig? = null,

    /**
     * MinIO 配置
     */
    val minioConfig: MinioConfig? = null
)

/**
 * 存储类型枚举
 */
enum class FileStorageProviderType {
    /**
     * 本地存储
     */
    LOCAL,

    /**
     * 七牛云
     */
    QINIU,

    /**
     * 阿里 OSS
     */
    ALI_OSS,

    /**
     * MinIO
     */
    MINIO
}

/**
 * 七牛云配置
 */
data class QiniuConfig(
    val accessKey: String,
    val secretKey: String,
    val bucket: String,
    val endpoint: String? = null, // 可选，默认使用七牛默认域名
    val useSSL: Boolean = false
)

/**
 * 阿里 OSS 配置
 */
data class AliOssConfig(
    val accessKey: String,
    val secretKey: String,
    val bucket: String,
    val region: String,
    val endpoint: String? = null,
    val useSSL: Boolean = false
)

/**
 * MinIO 配置
 */
data class MinioConfig(
    val accessKey: String,
    val secretKey: String,
    val bucket: String,
    val region: String? = null,
    val endpoint: String,
    val useSSL: Boolean = true
)

/**
 * 文件上传结果
 */
data class FileUploadResult(
    /**
     * 文件访问 URL
     */
    val url: String,

    /**
     * 文件存储 Key
     */
    val key: String,

    /**
     * 文件大小
     */
    val size: Long,

    /**
     * 文件类型
     */
    val contentType: String
)
