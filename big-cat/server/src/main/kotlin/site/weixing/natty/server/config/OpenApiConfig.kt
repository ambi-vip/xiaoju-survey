package site.weixing.natty.server.config

import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Contact
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.info.License
import io.swagger.v3.oas.models.security.SecurityRequirement
import io.swagger.v3.oas.models.security.SecurityScheme
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * OpenAPI/Swagger 配置
 */
@Configuration
class OpenApiConfig {

    @Bean
    fun customOpenAPI(): OpenAPI {
        return OpenAPI()
            .info(
                Info()
                    .title("小聚调研 API")
                    .version("2.0.0")
                    .description("""
                        ## 小聚调研服务端 API 文档

                        基于 Kotlin + Wow DDD 框架构建的调研系统后端。

                        ### 主要功能
                        - 用户认证与授权
                        - 工作空间管理
                        - 问卷创建与管理
                        - 问卷响应收集
                        - 数据统计与导出
                        - 文件存储
                        - AI 问卷生成

                        ### 认证方式
                        大部分 API 需要使用 JWT Token 进行认证，请在请求头中添加：
                        ```
                        Authorization: Bearer <your-jwt-token>
                        ```

                        ### 错误码说明
                        - 200: 成功
                        - 1xxx: 问卷相关错误
                        - 2xxx: 用户相关错误
                        - 3xxx: 工作空间相关错误
                        - 4xxx: 响应相关错误
                        - 5xxx: 文件相关错误
                    """.trimIndent())
                    .contact(
                        Contact()
                            .name("小聚团队")
                            .email("support@example.com")
                            .url("https://github.com/didi/xiaoju-survey")
                    )
                    .license(
                        License()
                            .name("Apache 2.0")
                            .url("https://www.apache.org/licenses/LICENSE-2.0.html")
                    )
            )
            .components(
                Components()
                    .addSecuritySchemes(
                        "bearer-jwt",
                        SecurityScheme()
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")
                            .description("请输入 JWT Token（无需 'Bearer ' 前缀）")
                    )
            )
            .addSecurityItem(
                SecurityRequirement().addList("bearer-jwt")
            )
    }
}
