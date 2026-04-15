package com.iar.backend.Controller;

import com.iar.backend.Service.MigrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final MigrationService migrationService;

    @PostMapping("/migrate-diets")
    public ResponseEntity<Map<String, Object>> migrateDiets() {
        Map<String, Object> report = migrationService.migrateDietIdsToDbRef();
        return ResponseEntity.ok(report);
    }
}
