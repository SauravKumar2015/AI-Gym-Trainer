package com.iar.backend.Service;

import com.iar.backend.Entity.DietPlanEntity;
import com.iar.backend.Entity.UserEntity;
import com.iar.backend.Repository.DietPlanRepository;
import com.iar.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MigrationService {

    private final MongoTemplate mongoTemplate;
    private final UserRepository userRepository;
    private final DietPlanRepository dietPlanRepository;

    // Migrate legacy string-ID lists pointing to diets into proper DBRef list on
    // UserEntity.dietPlans
    public Map<String, Object> migrateDietIdsToDbRef() {
        List<Document> users = mongoTemplate.findAll(Document.class, "users");

        int usersChecked = 0;
        int usersUpdated = 0;
        int totalMappingsAdded = 0;

        // common legacy field names to check first
        List<String> legacyFields = List.of(
                "dietPlanIds",
                "dietPlansIds",
                "createdDietIds",
                "createdResourceIds",
                "createdDietPlanIds",
                "createdDiets",
                "createdResources");

        for (Document doc : users) {
            usersChecked++;
            String id = Objects.toString(doc.get("_id"), null);
            if (id == null)
                continue;
            UserEntity user = userRepository.findById(id).orElse(null);
            if (user == null)
                continue;

            List<DietPlanEntity> toAdd = new ArrayList<>();

            // check configured legacy fields first
            for (String field : legacyFields) {
                Object val = doc.get(field);
                if (val instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<Object> list = (List<Object>) val;
                    for (Object o : list) {
                        if (o instanceof String candidateId) {
                            if (!candidateId.isEmpty() && dietPlanRepository.existsById(candidateId)) {
                                dietPlanRepository.findById(candidateId).ifPresent(d -> {
                                    if (user.getDietPlans().stream().map(DietPlanEntity::getId)
                                            .noneMatch(d.getId()::equals)) {
                                        toAdd.add(d);
                                    }
                                });
                            }
                        }
                    }
                }
            }

            // fallback: scan document fields for any List<String> that appear to reference
            // diet ids
            if (toAdd.isEmpty()) {
                for (String key : doc.keySet()) {
                    Object val = doc.get(key);
                    if (val instanceof List) {
                        @SuppressWarnings("unchecked")
                        List<Object> list = (List<Object>) val;
                        boolean allStrings = !list.isEmpty() && list.stream().allMatch(x -> x instanceof String);
                        if (!allStrings)
                            continue;
                        List<String> candidates = list.stream().map(Object::toString).collect(Collectors.toList());
                        for (String candidateId : candidates) {
                            if (candidateId != null && dietPlanRepository.existsById(candidateId)) {
                                dietPlanRepository.findById(candidateId).ifPresent(d -> {
                                    if (user.getDietPlans().stream().map(DietPlanEntity::getId)
                                            .noneMatch(d.getId()::equals)) {
                                        toAdd.add(d);
                                    }
                                });
                            }
                        }
                        if (!toAdd.isEmpty())
                            break; // we found a plausible field
                    }
                }
            }

            if (!toAdd.isEmpty()) {
                user.getDietPlans().addAll(toAdd);
                userRepository.save(user);
                usersUpdated++;
                totalMappingsAdded += toAdd.size();
            }
        }

        Map<String, Object> report = new HashMap<>();
        report.put("usersChecked", usersChecked);
        report.put("usersUpdated", usersUpdated);
        report.put("totalMappingsAdded", totalMappingsAdded);
        return report;
    }
}
