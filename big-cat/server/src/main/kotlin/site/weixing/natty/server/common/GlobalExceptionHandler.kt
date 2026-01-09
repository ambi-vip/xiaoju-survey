package site.weixing.natty.server.common

import me.ahoo.wow.web.exception.HandlerException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest

/**
 * 全局异常处理器
 * 对应原 NestJS 的 HttpExceptionsFilter
 */
@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    /**
     * 处理 Wow 框架的 HandlerException
     */
    @ExceptionHandler(HandlerException::class)
    fun handleWowException(
        ex: HandlerException,
        request: WebRequest
    ): ResponseEntity<ApiResponse<Nothing>> {
        logger.error("Wow HandlerException: ${ex.message}", ex)

        val errorCode = when (ex::class.simpleName) {
            "NotFoundException" -> ErrorCode.NOT_FOUND
            "ValidationException" -> ErrorCode.PARAMETER_ERROR
            else -> ErrorCode.INTERNAL_SERVER_ERROR
        }

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.error(
                code = errorCode.code,
                message = ex.message ?: errorCode.message
            ))
    }

    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException::class)
    fun handleBusinessException(
        ex: BusinessException,
        request: WebRequest
    ): ResponseEntity<ApiResponse<Nothing>> {
        logger.warn("BusinessException: ${ex.message}")

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.error(
                code = ex.errorCode.code,
                message = ex.message ?: ex.errorCode.message
            ))
    }

    /**
     * 处理通用异常
     */
    @ExceptionHandler(Exception::class)
    fun handleGenericException(
        ex: Exception,
        request: WebRequest
    ): ResponseEntity<ApiResponse<Nothing>> {
        logger.error("Unhandled exception: ${ex.message}", ex)

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.error(
                code = ErrorCode.INTERNAL_SERVER_ERROR.code,
                message = "服务器内部错误"
            ))
    }
}

/**
 * 业务异常类
 */
class BusinessException(
    val errorCode: ErrorCode,
    message: String? = null
) : RuntimeException(message ?: errorCode.message) {
    constructor(errorCode: ErrorCode) : this(errorCode, errorCode.message)
}
