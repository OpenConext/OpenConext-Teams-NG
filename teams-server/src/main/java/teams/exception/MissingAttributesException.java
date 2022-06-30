package teams.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Map;

@ResponseStatus(value = HttpStatus.CONFLICT)
@Getter
public class MissingAttributesException extends RuntimeException {

    private List<String> missingAttributes;

    public MissingAttributesException(List<String> missingAttributes) {
        this.missingAttributes = missingAttributes;
    }
}
