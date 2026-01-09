package site.weixing.natty.server.storage

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.multipart.MultipartFile
import java.io.InputStream
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption

/**
 * 本地文件存储实现
 * 对应原 NestJS 的 SERVER_LOCAL_CONFIG
 */
@Component
class LocalFileStorageProvider(
    @Value("\${app.file.upload-dir:./uploads}")
    private val uploadDir: String
) : FileStorageProvider {

    private val logger = LoggerFactory.getLogger(LocalFileStorageProvider::class.java)
    private val basePath: Path = Paths.get(uploadDir).toAbsolutePath().normalize()

    init {
        // 确保上传目录存在
        try {
            Files.createDirectories(basePath)
            logger.info("Local file storage initialized at: $basePath")
        } catch (e: Exception) {
            logger.error("Failed to create upload directory: $uploadDir", e)
        }
    }

    override fun upload(file: MultipartFile, key: String): String {
        return upload(file.inputStream, key, file.contentType ?: "application/octet-stream")
    }

    override fun upload(inputStream: InputStream, key: String, contentType: String): String {
        try {
            // 构建文件路径
            val filePath = basePath.resolve(key).normalize()

            // 确保父目录存在
            Files.createDirectories(filePath.parent)

            // 保存文件
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING)

            logger.info("File uploaded successfully: $key")

            // 返回访问 URL（本地存储返回相对路径）
            return "/uploads/$key"
        } catch (e: Exception) {
            logger.error("Failed to upload file: $key", e)
            throw FileStorageException("文件上传失败: ${e.message}", e)
        }
    }

    override fun delete(key: String) {
        try {
            val filePath = basePath.resolve(key).normalize()

            if (Files.exists(filePath)) {
                Files.delete(filePath)
                logger.info("File deleted successfully: $key")
            } else {
                logger.warn("File not found for deletion: $key")
            }
        } catch (e: Exception) {
            logger.error("Failed to delete file: $key", e)
            throw FileStorageException("文件删除失败: ${e.message}", e)
        }
    }

    override fun getUrl(key: String, expirySeconds: Int?): String {
        // 本地存储不支持过期时间，直接返回 URL
        return "/uploads/$key"
    }

    override fun exists(key: String): Boolean {
        return try {
            val filePath = basePath.resolve(key).normalize()
            Files.exists(filePath)
        } catch (e: Exception) {
            logger.error("Failed to check file existence: $key", e)
            false
        }
    }
}

/**
 * 文件存储异常
 */
class FileStorageException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
