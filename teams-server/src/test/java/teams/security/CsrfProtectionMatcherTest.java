package teams.security;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class CsrfProtectionMatcherTest {

    private CsrfProtectionMatcher subject = new CsrfProtectionMatcher();

    @Test
    public void noMatchGet() throws Exception {
        assertFalse(subject.matches(mockRequest("GET", "/api/teams/user")));
    }

    @Test
    public void noMatchPath() throws Exception {
        assertFalse(subject.matches(mockRequest("POST", "/path")));
    }

    @Test
    public void match() throws Exception {
        assertTrue(subject.matches(mockRequest("POST", "/api/teams/user")));
    }

    private MockHttpServletRequest mockRequest(String method, String path) {
        MockHttpServletRequest request = new MockHttpServletRequest(method, path);
        request.setServletPath(request.getRequestURI());
        return request;
    }

}