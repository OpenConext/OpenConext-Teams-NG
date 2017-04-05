package teams.shibboleth.mock;

import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;
import java.util.HashMap;

public class MockShibbolethFilter extends GenericFilterBean {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        SetHeader wrapper = new SetHeader(request);

        String nameId = request.getHeader("name-id");
        wrapper.setHeader("name-id", nameId == null ? "urn:collab:person:example.com:john.doe" : nameId);

        wrapper.setHeader("uid", "John Doe");
        wrapper.setHeader("Shib-InetOrgPerson-mail", "john.doe@example.org");

        String isMemberOf = request.getHeader("is-member-of");
        wrapper.setHeader("is-member-of", isMemberOf == null ? "urn:collab:org:surf.nl" : isMemberOf);

        filterChain.doFilter(wrapper, servletResponse);
    }

    private static class SetHeader extends HttpServletRequestWrapper {

        private final HashMap<String, String> headers;

        public SetHeader(HttpServletRequest request) {
            super(request);
            this.headers = new HashMap<>();
        }

        public void setHeader(String name, String value) {
            this.headers.put(name, value);
        }

        @Override
        public String getHeader(String name) {
            if (headers.containsKey(name)) {
                return headers.get(name);
            }
            return super.getHeader(name);
        }
    }

}
