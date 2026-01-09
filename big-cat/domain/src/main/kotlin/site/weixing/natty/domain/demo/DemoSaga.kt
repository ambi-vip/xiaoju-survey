package site.weixing.natty.domain.demo

import io.github.oshai.kotlinlogging.KotlinLogging
import me.ahoo.wow.api.annotation.OnEvent
import me.ahoo.wow.api.annotation.StatelessSaga
import me.ahoo.wow.api.modeling.AggregateId
import me.ahoo.wow.command.factory.CommandBuilder
import me.ahoo.wow.command.factory.CommandBuilder.Companion.commandBuilder
import site.weixing.natty.api.demo.DemoCreated
import site.weixing.natty.api.demo.UpdateDemo

@StatelessSaga
class DemoSaga {
    companion object {
        private val log = KotlinLogging.logger { }
    }

    @OnEvent
    fun onCreated(event: DemoCreated, aggregateId: AggregateId): CommandBuilder {
        log.debug { "onCreated: $event" }
        return UpdateDemo(
            data = "updated"
        ).commandBuilder().aggregateId(aggregateId.id)
    }
}
