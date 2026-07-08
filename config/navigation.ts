import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  Home,
  Library,
  Pill,
  Settings,
  Sparkles
} from "lucide-react";

export const appNavigation = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Démarches", href: "/soins", icon: Sparkles },
  { label: "Transmissions", href: "/transmissions", icon: ClipboardList },
  { label: "Calculs", href: "/doses", icon: Pill },
  { label: "Fiches", href: "/fiches", icon: FileText },
  { label: "Quiz", href: "/quiz", icon: BarChart3 },
  { label: "Stages", href: "/stages", icon: GraduationCap },
  { label: "Agenda", href: "/agenda", icon: CalendarDays },
  { label: "Bibliothèque", href: "/bibliotheque", icon: Library },
  { label: "Paramètres", href: "/parametres", icon: Settings }
] as const;

export const priorityActions = [
  { label: "Nouvelle démarche", href: "/soins" },
  { label: "Calcul de dose", href: "/doses" },
  { label: "Importer un cours", href: "/fiches" }
] as const;

export const ifsiSemesters = [
  "S1",
  "S2",
  "S3",
  "S4",
  "S5",
  "S6"
] as const;

export const coreCarePlanSections = [
  "Recueil de données",
  "Présentation patient",
  "Antécédents et traitements",
  "Constantes et surveillances",
  "14 besoins fondamentaux",
  "Diagnostics infirmiers",
  "Problèmes réels et risques",
  "Objectifs",
  "Actions IDE",
  "Actions prescrites",
  "Évaluation",
  "Projet de soins"
] as const;
