package teams.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import teams.api.validations.HashGenerator;
import teams.exception.ResourceNotFoundException;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import static java.time.temporal.ChronoUnit.DAYS;
import static javax.persistence.CascadeType.ALL;
import static javax.persistence.FetchType.EAGER;

@Entity(name = "invitations")
@Getter
@NoArgsConstructor
public class Invitation implements HashGenerator, Serializable {

    public static final long EXPIRY_DAYS = 30L;
    public static final long EXPIRY_MILLIS = EXPIRY_DAYS * 24L * 60L * 60L * 1000L;

    @Transient
    public static final java.util.regex.Pattern emailPattern = java.util.regex.Pattern.compile("\\S+@\\S+");

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

    @OneToMany(cascade = ALL, orphanRemoval = true, mappedBy = "invitation", fetch = EAGER)
    @NotNull
    @Size(min = 1)
    private Set<InvitationMessage> invitationMessages = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "intended_role")
    @NotNull
    private Role intendedRole;

    @Enumerated(EnumType.STRING)
    private Language language;

    @Column
    private Instant expiryDate;

    @Column
    private Instant membershipExpiryDate;

    public Invitation(Team team, String email, Role intendedRole, Language language, Instant expiryDate,
                      Instant membershipExpiryDate) {
        this.team = team;
        this.email = email;
        this.invitationHash = generateHash();
        this.timestamp = new Date().getTime();
        this.language = language;
        this.intendedRole = intendedRole;
        this.expiryDate = expiryDate != null ? expiryDate : Instant.now().plus(30, DAYS);
        this.membershipExpiryDate = membershipExpiryDate;
    }

    @JsonProperty(value = "expired", access = JsonProperty.Access.READ_ONLY)
    public boolean expired() {
        return (timestamp + EXPIRY_MILLIS) < System.currentTimeMillis();
    }

    @JsonProperty(value = "daysValid", access = JsonProperty.Access.READ_ONLY)
    public int daysValid() {
        return (int) (EXPIRY_DAYS - (DAYS.between(Instant.ofEpochMilli(timestamp).atZone(ZoneId.systemDefault()).toLocalDate(),
                LocalDate.now())));
    }

    @JsonIgnore
    public InvitationMessage getLatestInvitationMessage() {
        return invitationMessages.stream().max(Comparator.comparingLong(InvitationMessage::getTimestamp))
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Invitation for team %s and person %s has no invitation message", team.getUrn(), email)));
    }

    @JsonIgnore
    public Optional<Person> getFirstInviter() {
        return invitationMessages.stream().min(Comparator.comparingLong(InvitationMessage::getTimestamp))
                .map(invitationMessage -> invitationMessage.getPerson());
    }

    public void accepted(boolean accepted) {
        this.accepted = accepted;
        this.declined = !accepted;
    }

    public Invitation addInvitationMessage(Person person, String message) {
        InvitationMessage invitationMessage = new InvitationMessage(this, person, message);
        this.invitationMessages.add(invitationMessage);
        this.declined = false;
        return this;
    }

}
