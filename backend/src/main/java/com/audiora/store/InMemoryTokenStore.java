package com.audiora.store;

import com.audiora.model.Provider;
import com.audiora.model.TokenInfo;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class InMemoryTokenStore {

    private final Map<String, Map<Provider, TokenInfo>> sessions =
        new ConcurrentHashMap<>();

    public String createOrUpdate(
        String sessionId,
        Provider provider,
        TokenInfo tokenInfo
    ) {
        String sid = sessionId != null
            ? sessionId
            : UUID.randomUUID().toString();
        sessions
            .computeIfAbsent(sid, k -> new ConcurrentHashMap<>())
            .put(provider, tokenInfo);
        return sid;
    }

    public TokenInfo get(String sessionId, Provider provider) {
        Map<Provider, TokenInfo> map = sessions.get(sessionId);
        return map == null ? null : map.get(provider);
    }

    public void update(String sessionId, Provider provider, TokenInfo newInfo) {
        if (sessionId == null) return;
        Map<Provider, TokenInfo> map = sessions.get(sessionId);
        if (map != null && newInfo != null) {
            map.put(provider, newInfo);
        }
    }

    /**
     * Remove a provider's token from a session
     * @param sessionId The session ID
     * @param provider The provider to disconnect
     * @return true if the token was removed, false if it didn't exist
     */
    public boolean remove(String sessionId, Provider provider) {
        if (sessionId == null) return false;
        Map<Provider, TokenInfo> map = sessions.get(sessionId);
        if (map != null) {
            return map.remove(provider) != null;
        }
        return false;
    }

    /**
     * Check if a session has a token for a provider
     */
    public boolean hasToken(String sessionId, Provider provider) {
        return get(sessionId, provider) != null;
    }
}
