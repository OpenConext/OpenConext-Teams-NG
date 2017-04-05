/*
 * Copyright 2012 SURFnet bv, The Netherlands
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package teams.domain;

import lombok.Setter;
import org.hibernate.annotations.Proxy;
import org.hibernate.annotations.SortNatural;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.util.Date;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

import static java.net.URLEncoder.encode;
import static java.util.Base64.getEncoder;
import static javax.persistence.CascadeType.ALL;
import static javax.persistence.FetchType.EAGER;

@Entity(name = "invitations")
public class Invitation {

    private static final long TWO_WEEKS = 14L * 24L * 60L * 60L * 1000L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "mailaddress", nullable = false)
    private String email;

    @Column(nullable = false)
    private long timestamp;

    @Column(name = "invitation_uiid", nullable = false)
    private String invitationHash;

    @Column(name = "denied")
    private boolean declined;

    @Column(name = "accepted")
    private boolean accepted;

    @OneToMany(cascade = ALL, fetch = EAGER, mappedBy = "invitation")
    private Set<InvitationMessage> invitationMessages = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "intended_role")
    private Role intendedRole;

    @Enumerated(EnumType.STRING)
    private Language language = Language.English;

    public Invitation(Team team, String email, Role intendedRole) throws UnsupportedEncodingException {
        this.team = team;
        this.email = email;
        this.invitationHash =  generateInvitationHash();
        this.timestamp = new Date().getTime();
        this.intendedRole = intendedRole;
    }

    public long getExpireTime() {
        return timestamp + TWO_WEEKS;
    }

    public String getInvitationHash() {
        return invitationHash;
    }

    private String generateInvitationHash() throws UnsupportedEncodingException {
        Random secureRandom = new SecureRandom();
        byte[] aesKey = new byte[256];
        secureRandom.nextBytes(aesKey);
        return encode(getEncoder().encodeToString(aesKey), "UTF-8");
    }


}
