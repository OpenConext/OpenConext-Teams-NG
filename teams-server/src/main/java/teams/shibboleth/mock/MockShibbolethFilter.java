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

    private final boolean test;

    private final String userUrn = "urn:collab:person:surfnet.nl:jdoe";//"urn:collab:person:surfnet.nl:super_admin"

    public MockShibbolethFilter(boolean test) {
        this.test = test;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        SetHeader wrapper = new SetHeader(request);

        String nameId = test ? userUrn : request.getHeader("name-id");
        wrapper.setHeader("name-id", nameId == null ? userUrn : nameId);

        wrapper.setHeader("displayName", "John Doe");
        wrapper.setHeader("Shib-InetOrgPerson-mail", "john.doe@example.org ; test@example.com");

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
