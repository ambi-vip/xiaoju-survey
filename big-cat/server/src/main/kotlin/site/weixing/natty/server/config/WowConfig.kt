package site.weixing.natty.server.config

import me.ahoo.wow.elasticsearch.WowElasticsearchConfiguration
import me.ahoo.wow.mongo.WowMongoConfiguration
import me.ahoo.wow.spring.boot.starter.WowAutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

/**
 * Wow 框架配置
 * 配置 Event Sourcing 和 CQRS 基础设施
 */
@Configuration
@Import(
    WowAutoConfiguration::class,
    WowMongoConfiguration::class
)
@ConditionalOnProperty(
    prefix = "wow.events",
    name = ["enabled"],
    havingValue = "true",
    matchIfMissing = true
)
class WowConfig {
    // Wow 框架会自动配置以下组件:
    // - Event Store (基于 MongoDB)
    // - Aggregate Repository
    // - Event Sourcing Bus
    // - Snapshot Provider
    // - Command Bus
    // - Query Bus
}

/**
 * 可选的 Elasticsearch 配置（用于高级查询）
 * 如果需要启用 Elasticsearch，在配置文件中设置 wow.elasticsearch.enabled=true
 */
@Configuration
@ConditionalOnProperty(
    prefix = "wow.elasticsearch",
    name = ["enabled"],
    havingValue = "true"
)
@Import(WowElasticsearchConfiguration::class)
class WowElasticsearchConfig
