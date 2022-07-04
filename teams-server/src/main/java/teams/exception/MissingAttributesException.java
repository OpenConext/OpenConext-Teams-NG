package teams.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Map;

@ResponseStatus(value = HttpStatus.CONFLICT)
@Getter
public class MissingAttributesException extends RuntimeException {

    private final Map<String, Object> missingAttributes;

    public MissingAttributesException(Map<String, Object> missingAttributes) {
        this.missingAttributes = missingAttributes;
    }
}
