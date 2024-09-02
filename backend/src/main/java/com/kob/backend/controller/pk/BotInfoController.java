package com.kob.backend.controller.pk;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * ClassName: BotInfoController
 * Description:
 * Date: 2024/9/2 15:52
 *
 * @author Crescent
 * @version 1.0
 * @since JDK 1.8
 */

@RestController
@RequestMapping("/pk/")
public class BotInfoController {

    @RequestMapping("getbotinfo/")
    public String getBotInfo() {
        return "BotInfo";
    }
}
