package teams.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class IllegalInviteException extends RuntimeException {

    public IllegalInviteException(String message) {
        super(message);
    }

}
