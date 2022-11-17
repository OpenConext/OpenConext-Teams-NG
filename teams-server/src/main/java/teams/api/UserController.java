package teams.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import teams.domain.FederatedUser;
import teams.domain.Person;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toSet;

@RestController
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("api/teams/users/me")
    public FederatedUser person(FederatedUser federatedUser) {
        return federatedUser;
    }

    @GetMapping("api/teams/users/logout")
    public Map<String, String> logout(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().invalidate();
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            Stream.of(cookies).filter(cookie -> !"lang".equals(cookie.getName())).forEach(cookie -> {
                Cookie dup = new Cookie(cookie.getName(), null);
                dup.setMaxAge(0);
                response.addCookie(dup);
            });
        }
        SecurityContextHolder.clearContext();
        SecurityContextHolder.getContext().setAuthentication(null);
        return Collections.singletonMap("url", "/Shibboleth.sso/Logout");
    }

    @PostMapping("/api/teams/error")
    public Map<String, String> error(@RequestBody Map<String, Object> payload, FederatedUser federatedUser) throws JsonProcessingException, UnknownHostException {
        payload.put("dateTime", new SimpleDateFormat("yyyyy-mm-dd hh:mm:ss").format(new Date()));
        payload.put("machine", InetAddress.getLocalHost().getHostName());
        payload.put("user", federatedUser);
        String msg = objectMapper.writeValueAsString(payload);
        log.error(msg, new IllegalArgumentException(msg));
        return Collections.singletonMap("status", "ok");
    }

}
