package teams.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class IllegalJoinRequestException extends RuntimeException {

    public IllegalJoinRequestException(String message) {
        super(message);
    }

}
