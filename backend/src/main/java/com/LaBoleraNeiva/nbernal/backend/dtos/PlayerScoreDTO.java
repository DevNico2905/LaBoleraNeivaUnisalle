package com.LaBoleraNeiva.nbernal.backend.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerScoreDTO {
    private String playerName;
    private List<Integer> attempts; // Ejemplo: [5, 4, 10, 2, 8, 7, 1, ...] (intentos por frame)
}
