package site.weixing.natty.api.demo

import site.weixing.natty.DemoService
import org.springframework.web.service.annotation.HttpExchange

@HttpExchange(DemoService.DEMO_AGGREGATE_NAME)
interface DemoApi
