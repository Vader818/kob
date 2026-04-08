package com.kob.backend.service.user.bot;

import org.springframework.stereotype.Service;

import java.util.Map;

public interface UpdateService {

    Map<String,String> update(Map<String,String> data);

}
