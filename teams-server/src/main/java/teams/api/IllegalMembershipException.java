package teams.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class IllegalMembershipException extends RuntimeException {

    public IllegalMembershipException(String message) {
        super(message);
    }

}
