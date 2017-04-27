package teams.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import teams.exception.ResourceNotFoundException;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.SecureRandom;
import java.util.*;

import static javax.persistence.CascadeType.ALL;
import static javax.persistence.FetchType.EAGER;

@Entity(name = "invitations")
@Getter
@NoArgsConstructor
public class Invitation {

    private static final long TWO_WEEKS = 14L * 24L * 60L * 60L * 1000L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    @NotNull
    @JsonIgnore
    private Team team;

    @Column(name = "mailaddress", nullable = false)
    @Pattern(regexp = "\\S+@\\S+")
    private String email;

    @Column(nullable = false)
    private long timestamp;

    @Column(name = "invitation_uiid", nullable = false)
    @JsonIgnore
    private String invitationHash;

    @Column(name = "denied")
    private boolean declined;

    @Column(name = "accepted")
    private boolean accepted;

    @OneToMany(cascade = ALL, fetch = EAGER, mappedBy = "invitation")
    @NotNull
    @Size(min = 1)
    private Set<InvitationMessage> invitationMessages = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "intended_role")
    @NotNull
    private Role intendedRole;

    @Enumerated(EnumType.STRING)
    private Language language;

    public Invitation(Team team, String email, Role intendedRole, Language language) throws UnsupportedEncodingException {
        this.team = team;
        this.email = email;
        this.invitationHash = generateInvitationHash();
        this.timestamp = new Date().getTime();
        this.language = language;
        this.intendedRole = intendedRole;
    }

    public boolean hasExpired() {
        return (timestamp + TWO_WEEKS) < System.currentTimeMillis();
    }

    public String getInvitationHash() {
        return invitationHash;
    }

    public Long getTeamIdentifier() {
        return team.getId();
    }

    private String generateInvitationHash() throws UnsupportedEncodingException {
        Random secureRandom = new SecureRandom();
        byte[] aesKey = new byte[128];
        secureRandom.nextBytes(aesKey);
        String base64 = Base64.getEncoder().encodeToString(aesKey);
        return URLEncoder.encode(base64, "UTF-8").replaceAll("%", "");
    }

    @JsonIgnore
    public InvitationMessage getLatestInvitationMessage() {
        return invitationMessages.stream().max(Comparator.comparingLong(InvitationMessage::getTimestamp))
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Invitation for team %s and person %s has no invitation message", team.getUrn(), email)));
    }

    public void accepted(boolean accepted) {
        this.accepted = accepted;
        this.declined = !accepted;
    }

    public InvitationMessage addInvitationMessage(Person person, String message) {
        InvitationMessage invitationMessage = new InvitationMessage(this, person, message);
        this.invitationMessages.add(invitationMessage);
        return invitationMessage;
    }

}
