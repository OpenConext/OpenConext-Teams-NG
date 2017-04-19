package teams.security;

import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.http.HttpServletRequest;
import java.util.regex.Pattern;

public class CsrfProtectionMatcher implements RequestMatcher {

    private final Pattern allowedMethods = Pattern.compile("^(GET|HEAD|TRACE|OPTIONS)$");

    @Override
    public boolean matches(HttpServletRequest request) {
        String servletPath = request.getServletPath();
        return servletPath.startsWith("/api/teams")
                && !allowedMethods.matcher(request.getMethod().toUpperCase()).matches();
    }

}
