package site.weixing.natty.server.common

/**
 * 统一 API 响应格式
 * 兼容原 NestJS 的响应结构
 */
data class ApiResponse<T>(
    val code: Int = 200,
    val message: String? = null,
    val data: T? = null,
    val timestamp: Long = System.currentTimeMillis()
) {
    companion object {
        /**
         * 成功响应
         */
        fun <T> ok(data: T? = null, message: String? = null): ApiResponse<T> {
            return ApiResponse(
                code = 200,
                message = message,
                data = data
            )
        }

        /**
         * 失败响应
         */
        fun <T> error(
            code: Int = 500,
            message: String,
            data: T? = null
        ): ApiResponse<T> {
            return ApiResponse(
                code = code,
                message = message,
                data = data
            )
        }

        /**
         * 业务错误响应
         */
        fun <T> businessError(
            errorCode: ErrorCode,
            data: T? = null
        ): ApiResponse<T> {
            return ApiResponse(
                code = errorCode.code,
                message = errorCode.message,
                data = data
            )
        }
    }
}

/**
 * 错误码枚举
 * 对应原 NestJS 的 EXCEPTION_CODE
 */
enum class ErrorCode(
    val code: Int,
    val message: String
) {
    // 成功
    SUCCESS(200, "成功"),

    // 客户端错误 4xx
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "资源不存在"),
    PARAMETER_ERROR(400, "参数错误"),

    // 问卷相关错误 1xxx
    SURVEY_NOT_FOUND(1001, "问卷不存在"),
    SURVEY_ALREADY_DELETED(1002, "问卷已删除"),
    SURVEY_STATUS_ERROR(1003, "问卷状态错误"),
    SURVEY_PERMISSION_DENIED(1004, "无权限操作该问卷"),
    SURVEY_CONFIG_ERROR(1005, "问卷配置错误"),

    // 用户相关错误 2xxx
    USER_NOT_FOUND(2001, "用户不存在"),
    USER_ALREADY_EXISTS(2002, "用户已存在"),
    USER_PASSWORD_ERROR(2003, "密码错误"),
    CAPTCHA_ERROR(2004, "验证码错误"),

    // 工作空间相关错误 3xxx
    WORKSPACE_NOT_FOUND(3001, "工作空间不存在"),
    WORKSPACE_PERMISSION_DENIED(3002, "无权限访问该工作空间"),
    MEMBER_NOT_FOUND(3003, "成员不存在"),

    // 响应相关错误 4xxx
    RESPONSE_NOT_FOUND(4001, "响应数据不存在"),
    RESPONSE_ALREADY_EXISTS(4002, "响应已存在"),
    RESPONSE_SUBMIT_CLOSED(4003, "问卷已关闭提交"),

    // 文件相关错误 5xxx
    FILE_UPLOAD_ERROR(5001, "文件上传失败"),
    FILE_NOT_FOUND(5002, "文件不存在"),
    FILE_TYPE_ERROR(5003, "文件类型错误"),
    FILE_SIZE_EXCEEDED(5004, "文件大小超限"),

    // 服务器错误 5xxx
    INTERNAL_SERVER_ERROR(5000, "服务器内部错误"),
    DATABASE_ERROR(5001, "数据库错误"),
    EXTERNAL_API_ERROR(5002, "外部接口调用失败"),
}
