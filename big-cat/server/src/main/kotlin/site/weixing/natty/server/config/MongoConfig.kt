package site.weixing.natty.server.config

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import org.springframework.boot.autoconfigure.mongo.MongoProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration
import org.springframework.data.mongodb.core.ReactiveMongoTemplate
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories

/**
 * MongoDB 配置
 * 配置响应式 MongoDB 连接
 */
@Configuration
@EnableReactiveMongoRepositories(basePackages = ["site.weixing.natty.server"])
class MongoConfig(
    private val mongoProperties: MongoProperties
) : AbstractReactiveMongoConfiguration() {

    override fun reactiveMongoClientSettings(): MongoClientSettings {
        val connectionString = ConnectionString(
            "mongodb://${mongoProperties.username}:${mongoProperties.password}" +
                "@${mongoProperties.host}:${mongoProperties.port}" +
                "/${mongoProperties.database}?authSource=${mongoProperties.authenticationDatabase}"
        )

        return MongoClientSettings.builder()
            .applyConnectionString(connectionString)
            .build()
    }

    override fun getDatabaseName(): String {
        return mongoProperties.database
    }

    @Bean
    override fun reactiveMongoTemplate(): ReactiveMongoTemplate {
        return ReactiveMongoTemplate(reactiveMongoClient(), databaseName)
    }
}
