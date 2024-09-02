package com.kob.backend.controller.pk;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

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
    public Map<String, String> getBotInfo() {
        Map<String, String> bot = new HashMap<>();
        bot.put("name", "tiger");
        bot.put("rating", "1500");

        return bot;
    }
}
