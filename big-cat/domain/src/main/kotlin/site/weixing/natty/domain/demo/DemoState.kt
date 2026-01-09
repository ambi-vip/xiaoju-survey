package site.weixing.natty.domain.demo

import me.ahoo.wow.api.annotation.OnSourcing
import site.weixing.natty.api.demo.DemoCreated
import site.weixing.natty.api.demo.DemoUpdated
import site.weixing.natty.api.demo.IDemoState

class DemoState(override val id: String) : IDemoState {
    override var data: String = ""
        private set

    @OnSourcing
    fun onCreated(event: DemoCreated) {
        data = event.data
    }

    @OnSourcing
    fun onUpdated(event: DemoUpdated) {
        data = event.data
    }
}
