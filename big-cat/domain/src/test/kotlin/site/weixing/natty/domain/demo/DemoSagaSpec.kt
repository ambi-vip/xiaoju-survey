package site.weixing.natty.domain.demo

import me.ahoo.test.asserts.assert
import site.weixing.natty.api.demo.DemoCreated
import site.weixing.natty.api.demo.UpdateDemo
import me.ahoo.wow.test.SagaSpec

class DemoSagaSpec : SagaSpec<DemoSaga>({
    on {
        val demoCreated = DemoCreated("data")
        whenEvent(demoCreated) {
            expectNoError()
            expectCommandType(UpdateDemo::class)
            expectCommandBody<UpdateDemo> {
                data.assert().isEqualTo("updated")
            }
        }
    }
})
