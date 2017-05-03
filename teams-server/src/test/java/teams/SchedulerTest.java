package teams;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.util.ReflectionTestUtils;
import teams.domain.*;
import teams.repository.MembershipRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
import static teams.Scheduler.TWO_WEEKS;

public class SchedulerTest extends AbstractApplicationTest {

    @Autowired
    private Scheduler scheduler;

    @Test
    public void removeExpiredMemberships() throws Exception {
        Membership membership = new Membership(
                Role.ADMIN,
                teamRepository.findOne(1L),
                personRepository.findOne(6L),
                Instant.now().minus(15, ChronoUnit.DAYS));
        membershipRepository.save(membership);

        int deleted = scheduler.removeExpiredMemberships();
        assertEquals(1, deleted);

    }

    @Test
    public void removeExpiredInvitations() throws Exception {
        Invitation invitation = new Invitation(
                teamRepository.findOne(1L),
                "test@test.org",
                Role.ADMIN,
                Language.Dutch,
                null).addInvitationMessage(personRepository.findOne(1L), "Please join");
        ReflectionTestUtils.setField(invitation, "timestamp", System.currentTimeMillis() - TWO_WEEKS - (1000L * 3600));//1000L);
        invitationRepository.save(invitation);

        int count = scheduler.removeExpiredInvitations();
        assertEquals(1, count);
    }

    @Test
    public void testExceptionTheHardWay() throws Exception {
        removeExpiredMembershipsWithException(-1);
    }

    @Test
    public void testNotResponsibleForScheduling() throws Exception {
        ReflectionTestUtils.setField(scheduler, "nodeCronJobResponsible", false);
        removeExpiredMembershipsWithException(0);
        ReflectionTestUtils.setField(scheduler, "nodeCronJobResponsible", true);    }

    private void removeExpiredMembershipsWithException(int expected) {
        Object membershipRepositoryRef = ReflectionTestUtils.getField(scheduler, "membershipRepository");
        MembershipRepository membershipRepositoryMock = mock(MembershipRepository.class);
        when(membershipRepositoryMock.deleteExpiredMemberships(anyLong())).thenThrow(new IllegalArgumentException());
        ReflectionTestUtils.setField(scheduler, "membershipRepository", membershipRepositoryMock);
        int count = scheduler.removeExpiredMemberships();
        assertEquals(expected, count);
        ReflectionTestUtils.setField(scheduler, "membershipRepository", membershipRepositoryRef);
    }

}