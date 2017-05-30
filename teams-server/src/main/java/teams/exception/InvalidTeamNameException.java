package teams.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class InvalidTeamNameException extends RuntimeException {

    public InvalidTeamNameException(String message) {
        super(message);
    }
}
