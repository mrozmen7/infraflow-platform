package com.infraflow.platform.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import java.util.List;

@AnalyzeClasses(
  packages = "com.infraflow.platform",
  importOptions = ImportOption.DoNotIncludeTests.class
)
class ModuleBoundaryTests {

  private static final List<String> FEATURE_MODULES = List.of(
    "incidents",
    "workorders",
    "assets",
    "agentic"
  );

  @ArchTest
  static final ArchRule domain_is_free_of_spring_and_jpa = noClasses()
    .that().resideInAPackage("..domain..")
    .should().dependOnClassesThat()
    .resideInAnyPackage("org.springframework..", "jakarta.persistence..")
    .because("the domain model must stay free of framework and persistence concerns");

  @ArchTest
  static final ArchRule application_uses_only_domain_ports_and_shared = noClasses()
    .that().resideInAPackage("..application..")
    .should().dependOnClassesThat()
    .resideInAnyPackage("..web..", "..infrastructure..")
    .because("the application layer may only use domain types, ports and shared services");

  @ArchTest
  static final ArchRule infrastructure_is_only_reached_through_ports = noClasses()
    .that().resideOutsideOfPackage("..infrastructure..")
    .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
    .because("infrastructure adapters are wired through application ports only");

  @ArchTest
  static void feature_modules_are_only_used_through_their_application_ports(
    JavaClasses classes
  ) {
    for (String module : FEATURE_MODULES) {
      noClasses()
        .that().resideOutsideOfPackage(".." + module + "..")
        .should().dependOnClassesThat()
        .resideInAnyPackage(
          ".." + module + ".domain..",
          ".." + module + ".infrastructure..",
          ".." + module + ".web.."
        )
        .because("cross-module access goes through application ports only")
        .check(classes);
    }
  }
}
