package site.weixing.natty.api.demo

import jakarta.validation.constraints.NotBlank

interface IDemoInfo {
    @get:NotBlank
    val data: String
}
