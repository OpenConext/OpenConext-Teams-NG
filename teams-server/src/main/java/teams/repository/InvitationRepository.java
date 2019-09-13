package teams.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import teams.domain.Invitation;
import teams.domain.Team;

import javax.persistence.OptimisticLockException;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends CrudRepository<Invitation, Long> {

    @EntityGraph(value = "findFirstByInvitationHash", type = EntityGraph.EntityGraphType.LOAD,
            attributePaths = {"invitationMessages", "team", "team.memberships"})
    Optional<Invitation> findFirstByInvitationHash(String invitationHash);

    @Query(value = "select i.team.id, count(i.id) from teams.domain.Invitation i where i.team.id in :teamIds and i.accepted = false group by i.team")
    List<Object[]> countInvitationsByTeamId(@Param("teamIds") List<Long> teamIds);

    @Transactional(noRollbackFor = OptimisticLockException.class)
    @Modifying
    @Query(value = "DELETE FROM invitations WHERE timestamp < :epochMilliseconds", nativeQuery = true)
    int deleteExpiredInvitations(@Param("epochMilliseconds") long epochMilliseconds);

    @EntityGraph(value = "findFirstById", type = EntityGraph.EntityGraphType.LOAD,
            attributePaths = {"invitationMessages", "team", "team.memberships"})
    Invitation findById(Long id);

    List<Invitation> findByTeamAndEmail(Team team, String email);
}
