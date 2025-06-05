package com.LaBoleraNeiva.nbernal.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.LaBoleraNeiva.nbernal.backend.dtos.PlayerScoreDTO;
import com.LaBoleraNeiva.nbernal.backend.entities.Player;
import com.LaBoleraNeiva.nbernal.backend.repositories.PlayerRepository;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "http://localhost:4200")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;
    
    @PostMapping
    public ResponseEntity<List<Player>> savePlayers(@RequestBody List<Player> players) {
        List<Player> savedPlayers = playerRepository.saveAll(players);
        return ResponseEntity.ok(savedPlayers);
    }
    
    @GetMapping("/by-game/{gameId}")
    public List<Player> getPlayersByGame(@PathVariable String gameId) {
        return playerRepository.findByGameId(gameId);
    }
    
    @PostMapping("/calculate-score")
    public ResponseEntity<Map<String, Integer>> calculateScore(@RequestBody List<PlayerScoreDTO> scores) {
        Map<String, Integer> results = new HashMap<>();

        for (PlayerScoreDTO playerScore : scores) {
            int total = calculateTotalScore(playerScore.getAttempts());
            results.put(playerScore.getPlayerName(), total);
        }

        return ResponseEntity.ok(results);
    }
    
    private int calculateTotalScore(List<Integer> attempts) {
        int total = 0;
        int frameIndex = 0;
        int i = 0;

        while (frameIndex < 5 && i < attempts.size()) { // 5 frames
            int first = attempts.get(i);

            if (first == 10) { // Strike
                total += 10 + strikeBonus(attempts, i);
                i += 1;
            } else if (i + 1 < attempts.size()) {
                int second = attempts.get(i + 1);
                if (first + second == 10) { // Spare
                    total += 10 + spareBonus(attempts, i);
                } else {
                    total += first + second;
                }
                i += 2;
            } else {
                // Intento incompleto, ignora
                break;
            }
            frameIndex++;
        }
        return total;
    }

    private int strikeBonus(List<Integer> attempts, int index) {
        int bonus = 0;
        if (index + 1 < attempts.size()) bonus += attempts.get(index + 1);
        if (index + 2 < attempts.size()) bonus += attempts.get(index + 2);
        return bonus;
    }

    private int spareBonus(List<Integer> attempts, int index) {
        return (index + 2 < attempts.size()) ? attempts.get(index + 2) : 0;
    }
}
