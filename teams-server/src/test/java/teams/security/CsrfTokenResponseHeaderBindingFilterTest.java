package teams.security;

import org.junit.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.web.csrf.DefaultCsrfToken;

import static org.junit.Assert.*;

public class CsrfTokenResponseHeaderBindingFilterTest {

    private CsrfTokenResponseHeaderBindingFilter subject = new CsrfTokenResponseHeaderBindingFilter();

    @Test
    public void doFilterInternalToken() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setAttribute("_csrf", new DefaultCsrfToken("headerName", "parameterName", "token"));
        MockHttpServletResponse response = new MockHttpServletResponse();
        subject.doFilterInternal(request, response, new MockFilterChain());

        assertEquals("token", response.getHeader("X-CSRF-TOKEN"));
    }

    @Test
    public void doFilterInternalNoToken() throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();
        subject.doFilterInternal(new MockHttpServletRequest(), response, new MockFilterChain());

        assertNull(response.getHeader("X-CSRF-TOKEN"));
    }
}