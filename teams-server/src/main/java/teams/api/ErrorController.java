package teams.api;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;
import teams.exception.MissingAttributesException;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;

@RestController
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    private final ErrorAttributes errorAttributes;

    public ErrorController() {
        this.errorAttributes = new DefaultErrorAttributes();
    }

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
        ServletWebRequest webRequest = new ServletWebRequest(request);

        Map<String, Object> result = errorAttributes.getErrorAttributes(webRequest,
                ErrorAttributeOptions.of(ErrorAttributeOptions.Include.EXCEPTION));

        Throwable error = errorAttributes.getError(webRequest);

        HttpStatus statusCode;

        if (error == null) {
            statusCode = result.containsKey("status") ? HttpStatus.valueOf((Integer) result.get("status")) : INTERNAL_SERVER_ERROR;
        } else {
            //https://github.com/spring-projects/spring-boot/issues/3057
            ResponseStatus annotation = AnnotationUtils.getAnnotation(error.getClass(), ResponseStatus.class);
            statusCode = annotation != null ? annotation.value() : status(error);
        }
        if (error instanceof MissingAttributesException) {
            result.put("missing_attributes", ((MissingAttributesException) error).getMissingAttributes());
        }
        result.remove("message");
        return new ResponseEntity<>(result, statusCode);
    }

    private HttpStatus status(Throwable throwable) {
        if (throwable instanceof AccessDeniedException) {
            return FORBIDDEN;
        }
        if (throwable instanceof MethodArgumentNotValidException) {
            return BAD_REQUEST;
        }
        return INTERNAL_SERVER_ERROR;
    }
}
