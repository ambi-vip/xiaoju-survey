package site.weixing.natty.server.demo

import io.github.oshai.kotlinlogging.KotlinLogging
import me.ahoo.wow.api.annotation.ProjectionProcessor
import site.weixing.natty.api.demo.DemoCreated

@ProjectionProcessor
class DemoProjector {
    companion object {
        private val log = KotlinLogging.logger { }
    }

    fun onEvent(event: DemoCreated) {
        log.debug { "onEvent: $event" }
    }
}
