package com.kob.backend.service.pk;

import org.springframework.stereotype.Service;


public interface ReceiveBotMoveService {
    String receiveBotMove(Integer userId, Integer direction);
}
