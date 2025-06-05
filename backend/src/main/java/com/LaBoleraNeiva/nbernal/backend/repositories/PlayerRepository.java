package com.LaBoleraNeiva.nbernal.backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.LaBoleraNeiva.nbernal.backend.entities.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByGameId(String gameId);
}
