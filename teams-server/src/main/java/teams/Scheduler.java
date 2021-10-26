package teams;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import teams.domain.Invitation;
import teams.domain.Membership;
import teams.domain.Person;
import teams.repository.InvitationRepository;
import teams.repository.MembershipRepository;
import teams.repository.PersonRepository;

import java.util.function.Function;

import static teams.domain.Invitation.EXPIRY_MILLIS;

@Configuration
@EnableScheduling
public class Scheduler {

    private static final Logger LOG = LoggerFactory.getLogger(Scheduler.class);

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private InvitationRepository invitationRepository;

    @Value("${cron.node-cron-job-responsible}")
    private boolean nodeCronJobResponsible;

    @Scheduled(cron = "${cron.expression}")
    public int removeExpiredMemberships() {
        return this.removeExpired(membershipRepository::deleteExpiredMemberships, 0L, Membership.class);
    }

    @Scheduled(cron = "${cron.expression}")
    public int removeExpiredInvitations() {
        return this.removeExpired(invitationRepository::deleteExpiredInvitations, System.currentTimeMillis() - EXPIRY_MILLIS, Invitation.class);
    }

    @Scheduled(cron = "${cron.expression}")
    public int removeOrphanPersons() {
        return this.removeExpired(personRepository::deleteOrphanPersons, 1L, Person.class);
    }

    private int removeExpired(Function<Long, Integer> removeFunction, Long argument, Class clazz) {
        if (nodeCronJobResponsible) {
            try {
                int count = removeFunction.apply(argument);
                LOG.info(String.format("Removed %s %s that were expired", count, clazz.getName()));
                return count;
            } catch (Throwable t) {//NOSONAR
                //deliberate swallowing because otherwise the scheduler stops
                LOG.error(String.format("Unexpected exception in removing expired %s", clazz.getName()), t);
                return -1;
            }
        }
        return 0;
    }

}
