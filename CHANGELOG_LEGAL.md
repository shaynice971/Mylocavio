# Changelog juridique — modèles de documents MyLocavio

Ce fichier trace les vérifications et mises à jour du contenu juridique des documents générés par l'application (bail, quittance, état des lieux). La date affichée en pied de page de chaque document correspond à `LEGAL_TEMPLATES_LAST_VERIFIED` dans `src/lib/legal-templates-version.ts`.

## Textes de référence

- **Décret n°2015-587 du 29 mai 2015** relatif aux contrats types de location — Annexe 1 (logement nu, résidence principale).
- **Loi n°89-462 du 6 juillet 1989** tendant à améliorer les rapports locatifs (notamment articles 3, 3-1 à 3-3, 4, 5, 8-1, 10, 15, 17, 17-1, 22, 22-1, 22-1-1, 23, 24).
- **Service-Public.fr**, fiches F35109 (contrat de location d'un logement vide) et F920.
- Décret n°87-713 du 26 août 1987 (liste des charges récupérables).
- Décret n°2014-890 du 1er août 2014 (plafonds d'honoraires de location).

## Historique des vérifications

### 2 juillet 2026 — Refonte complète du contrat de bail (BailPDF)

- Refonte du composant `BailPDF.tsx` pour couvrir les 10 rubriques obligatoires du contrat-type (décret n°2015-587, annexe 1) : désignation des parties (avec mandataire éventuel), objet du contrat (logement, DPE, chauffage, équipements), durée, conditions financières (loyer, IRL, charges, dépôt de garantie), travaux, garanties, clause de solidarité, clause résolutoire, honoraires de location, conditions particulières.
- Ajout de la liste des annexes obligatoires en fin de document.
- Ajout d'un pied de page de traçabilité juridique sur les 3 documents générés (bail, quittance, état des lieux), reprenant automatiquement la date ci-dessus.
- Ajout d'une clause de non-responsabilité dans les CGU et d'un avertissement dans l'interface au-dessus du bouton de génération du bail.
- Recherche menée exclusivement sur Légifrance, service-public.fr (fiches F35109/F920) — pas de source commerciale tierce.
- **Points de vigilance identifiés pendant la recherche, à faire relire par un juriste avant usage en production** :
  - Le texte exact et intégral de l'Annexe 1 du décret n°2015-587 n'a pas pu être récupéré mot à mot (protections anti-robot de Légifrance) ; les formulations utilisées dans le PDF sont des paraphrases fidèles, pas une reproduction certifiée du texte réglementaire.
  - L'obligation d'annexer l'attestation d'assurance habitation au moment de la signature n'a pas été confirmée par les sources consultées comme une pièce obligatoire du dossier annexé (c'est une obligation du locataire pendant la durée du bail et un motif de clause résolutoire, mais pas nécessairement une annexe à la signature) — elle est néanmoins listée dans les annexes du document par précaution et sur demande explicite, à vérifier.
  - Le régime de "charges forfaitaires" n'est légalement pas autorisé pour un bail **vide** (réservé au meublé et au bail mobilité) : ce point a été intégré dans le formulaire (voir section 5 du rapport d'audit).
  - Le bail mobilité n'admet légalement aucun dépôt de garantie : un contrôle a été ajouté en conséquence.

### (Prochaines entrées à ajouter ici lors de futures mises à jour)

<!-- Modèle pour les prochaines entrées :
### JJ mois AAAA — Titre de la mise à jour
- Description du changement, article/texte concerné, fichiers modifiés.
-->
