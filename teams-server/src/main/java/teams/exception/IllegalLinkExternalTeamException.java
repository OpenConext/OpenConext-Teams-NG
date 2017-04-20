package teams.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class IllegalLinkExternalTeamException extends RuntimeException {

    public IllegalLinkExternalTeamException(String message) {
        super(message);
    }

}
