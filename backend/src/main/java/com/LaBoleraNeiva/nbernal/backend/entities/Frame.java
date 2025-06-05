package com.LaBoleraNeiva.nbernal.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "frames")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Frame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int frameNumber;

    @Column
    private Integer attempt1;

    @Column
    private Integer attempt2;

    @Column(nullable = false)
    private Long playerId; // Referencia al id del player (numérico)
}