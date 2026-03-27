package com.kob.backend.controller.pk;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pk/")
public class BotInfoController {


    @RequestMapping("getbotinfo/")
    public Map<String,String> getBotInfo(){
        Map<String,String> map=new HashMap<>();
        map.put("name","bitch");
        map.put("rating","8888888888888");
        return map;
    }


}
