package site.weixing.natty.domain.demo

import me.ahoo.test.asserts.assert
import site.weixing.natty.api.demo.CreateDemo
import site.weixing.natty.api.demo.DemoCreated
import site.weixing.natty.api.demo.DemoUpdated
import site.weixing.natty.api.demo.UpdateDemo
import me.ahoo.wow.test.AggregateSpec

class DemoSpec : AggregateSpec<Demo, DemoState>({
    on {
        val create = CreateDemo(
            data = "data"
        )
        whenCommand(create) {
            expectNoError()
            expectEventType(DemoCreated::class)
            expectState {
                data.assert().isEqualTo(create.data)
            }
            fork {
                val update = UpdateDemo(
                    data = "newData"
                )
                whenCommand(update) {
                    expectNoError()
                    expectEventType(DemoUpdated::class)
                    expectState {
                        data.assert().isEqualTo(update.data)
                    }
                }
            }
        }
    }
})
