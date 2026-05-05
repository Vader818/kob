package com.kob.backend.service.impl.ranklist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RanklistCacheService {
    private static final String VERSION_KEY = "kob:ranklist:version";
    private static final String PAGE_KEY_PREFIX = "kob:ranklist:page:";
    private static final long PAGE_CACHE_TTL_SECONDS = 60L;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    public String currentVersion() {
        try {
            String version = stringRedisTemplate.opsForValue().get(VERSION_KEY);
            return version == null ? "0" : version;
        } catch (RuntimeException e) {
            return null;
        }
    }

    public String getPage(String version, Integer page) {
        if (version == null) return null;
        try {
            return stringRedisTemplate.opsForValue().get(buildPageKey(version, page));
        } catch (RuntimeException e) {
            return null;
        }
    }

    public void setPage(String version, Integer page, String value) {
        if (version == null) return;
        try {
            stringRedisTemplate.opsForValue().set(
                    buildPageKey(version, page),
                    value,
                    PAGE_CACHE_TTL_SECONDS,
                    TimeUnit.SECONDS
            );
        } catch (RuntimeException ignored) {
        }
    }

    public void invalidate() {
        try {
            stringRedisTemplate.opsForValue().increment(VERSION_KEY);
        } catch (RuntimeException ignored) {
        }
    }

    private String buildPageKey(String version, Integer page) {
        return PAGE_KEY_PREFIX + version + ":" + page;
    }
}
