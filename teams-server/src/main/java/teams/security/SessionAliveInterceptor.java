package teams.security;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class SessionAliveInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // add this header as an indication to the JS-client that this is a regular, non-session-expired response.
        response.addHeader("X-SESSION-ALIVE", "true");
        return true;
    }

}
