## Vue d’ensemble du projet actuel
- Next.js `15.2` (App Router) + React `19` + TypeScript + Tailwind CSS v4 opérationnels.
- Layout admin prêt: `src/app/(admin)/layout.tsx` avec `AppHeader` et `AppSidebar`.
- Nombreuses pages démo; aucune auth/RBAC ni `middleware.ts`.

## Choix techniques (mis à jour)
- Auth + Base de données: Supabase (Auth + Postgres) avec Drizzle ORM (`drizzle-orm/supabase-js`).
- UI: réutiliser Tailwind existant; ajouter composants ciblés Shadcn/UI si besoin.
- État: React Context pour session/utilisateur/rôles; Zustand pour filtres transversaux si nécessaire.
- Règles: Row Level Security sur Supabase pour garantir les permissions côté serveur.
- Vérification: `npx tsc -noEmit` après chaque changement.

## Modèle RBAC
- Rôles: `Bishop`, `AssistingOverseer`, `AreaPastor`, `DataClerk`.
- Tables clés:
  - `users`: profil, rôle courant.
  - `zones`: référentiel zones.
  - `user_zones`: assignations utilisateur ↔ zones (N:N), avec contrainte (1 zone max pour `AreaPastor`).
  - `members`, `attendance`, `followups`.
- Accès:
  - `Bishop`: global.
  - `AssistingOverseer`: limité aux `zones` assignées.
  - `AreaPastor`: limité à sa zone unique.
  - `DataClerk`: accès global aux données membres, mais pas aux routes admin.

## Architecture à ajouter
- Supabase & Drizzle
  - `src/lib/supabase/client.ts`: `createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`.
  - `src/lib/supabase/server.ts`: `createServerClient` via `@supabase/auth-helpers-nextjs`.
  - `src/db/schema.ts`: définition des tables Drizzle.
  - `src/db/index.ts`: `export const db = drizzle(supabaseClient)` pour client et serveur (deux instances).
  - `src/db/queries/*`: fonctions typées (listes, filtres, agrégations KPIs).
- Auth & Contexte
  - `src/context/AuthContext.tsx`: exposition `{session, user, role, zones, loading}` via `supabase.auth.onAuthStateChange()` et lecture `users` + `user_zones`.
- Protection de routes
  - `src/middleware.ts`: redirection vers `/login` si non authentifié pour `(admin)`; les restrictions par rôle se font côté pages via `RequireRole`.
- Types & Guards
  - `src/types/rbac.ts`: `Role` (enum), `RequireRole` HOC/wrapper.

## Routes et pages à créer/adapter
- Auth:
  - `src/app/login/page.tsx`: connexion email/mot de passe (`supabase.auth.signInWithPassword`), redirection vers `/dashboard`.
  - Supprimer/rediriger démos `/signin`/`/signup`.
- Layout post-login:
  - Conserver `src/app/(admin)/layout.tsx`; contenu des pages dépend du rôle.
- Modules:
  - `src/app/(admin)/dashboard/page.tsx`: widgets dynamiques par rôle (KPIs, comparatifs).
  - `src/app/(admin)/members/page.tsx`: CRUD membres (recherche, filtres) avec Drizzle (jointure par `zoneId`).
  - `src/app/(admin)/attendance/page.tsx`: calendrier/liste + graphiques; vue mensuelle pour `AreaPastor`.
  - `src/app/(admin)/follow-up/page.tsx`: journaux d’appels.
  - `src/app/(admin)/reports/page.tsx`: export CSV/Excel depuis requêtes Drizzle.
  - `src/app/(admin)/admin/users/page.tsx`: réservé `Bishop` (gestion comptes, rôles, assignations de zones, reset mot de passe).
  - `src/app/(admin)/admin/settings/page.tsx`: réservé `Bishop`/`DataClerk` (paramètres appli/synchro).
- Navigation:
  - Adapter `src/layout/AppSidebar.tsx` pour menu selon rôle et activer nouvelles routes.
  - Adapter `src/components/header/UserDropdown.tsx` pour afficher utilisateur réel et `logout()` (`supabase.auth.signOut`).

## Schéma Drizzle (proposé)
- `users`:
  - `id` (uuid, PK), `email` (unique), `display_name`, `role` (enum), `created_at`.
- `zones`:
  - `id` (uuid, PK), `name` (unique).
- `user_zones`:
  - `user_id` (FK users), `zone_id` (FK zones), PK composite.
- `members`:
  - `id` (uuid, PK), `name`, `contact`, `zone_id` (FK), `status`, `created_at`, `updated_at`.
- `attendance`:
  - `id` (uuid, PK), `zone_id` (FK), `date` (date), `present_count`, `absent_count`.
- `followups`:
  - `id` (uuid, PK), `zone_id` (FK), `member_id` (FK), `date`, `status`, `notes`, `clerk_user_id` (FK users).
- Indices pour filtres par `zone_id` et `date`.

## Row Level Security (RLS) – Supabase
- Activer RLS sur toutes les tables.
- Politiques:
  - `Bishop`: `auth.role() = 'Bishop'` → SELECT/INSERT/UPDATE/DELETE global.
  - `AssistingOverseer`: accès si `EXISTS (SELECT 1 FROM user_zones WHERE user_id = auth.uid() AND zone_id = members.zone_id)` (similaire pour `attendance`, `followups`).
  - `AreaPastor`: même logique mais RLS garantit une seule `zone_id` assignée.
  - `DataClerk`: accès CRUD sur `members`, lecture sur autres tables.
- Le rôle applicatif peut être stocké dans `users.role` et propagé dans `auth.users.app_metadata.role` pour usage en politiques.

## Dashboard – affichages par rôle
- Bishop: KPIs globaux, comparatif zones, accès rapide gestion utilisateurs.
- Assisting Overseer: KPIs agrégés sur ses zones; comparatif des zones assignées; filtre zone.
- Area Pastor: KPIs de sa zone; liste Bacenta Leaders; vue calendrier mensuelle; formulaire message optionnel.
- Data Clerk: KPIs qualité des données; import/export CSV; outils CRUD de masse.

## Points d’intégration précis (références fichiers)
- Root layout: `src/app/layout.tsx:19-21` – ajouter `AuthProvider`.
- Sidebar: `src/layout/AppSidebar.tsx:29-64` – remplacer `navItems/othersItems` et rendre dynamique par rôle.
- Header: `src/components/header/UserDropdown.tsx` – brancher session Supabase et `signOut`.
- Admin layout: `src/app/(admin)/layout.tsx:33-36` – inchangé; pages utilisent `RequireRole`.
- Login: `src/components/auth/SignInForm.tsx` – connecter au handler `signIn` Supabase.

## Variables d’environnement (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client).
- Service Role Key (seulement côté serveur pour maintenance/migrations, jamais côté client).

## Étapes de mise en œuvre
1. Supabase + Drizzle
   - Ajouter clients (`client.ts`, `server.ts`) et `db/schema.ts` (tables ci-dessus).
   - `db/index.ts` avec `drizzle(supabaseClient)`.
   - `npx tsc -noEmit`.
2. Auth & Contexte
   - `AuthContext` + écoute `supabase.auth.onAuthStateChange`, lecture `users` + `user_zones`.
   - `RootLayout` enveloppé d’`AuthProvider`.
   - `npx tsc -noEmit`.
3. Protection de routes
   - `middleware.ts` pour rediriger non-auth vers `/login`; vérification fine des rôles dans les pages via `RequireRole`.
   - `npx tsc -noEmit`.
4. Login
   - `app/login/page.tsx` branchée à Supabase, redirection post-login.
   - `npx tsc -noEmit`.
5. Navigation & Layout
   - Sidebar dynamique par rôle; `UserDropdown` connecté à la session.
   - `npx tsc -noEmit`.
6. Pages modules (squelettes)
   - Créer les pages demandées avec requêtes Drizzle typées + filtres par zones.
   - `npx tsc -noEmit`.
7. Dashboard role-based
   - Widgets KPI alimentés par agrégations Drizzle.
   - `npx tsc -noEmit`.
8. Import/Export CSV
   - Export via requêtes Drizzle; import → parsing CSV puis insert.
   - `npx tsc -noEmit`.
9. Admin – utilisateurs & paramètres
   - CRUD utilisateurs, assignation de zones; paramètres de l’appli.
   - `npx tsc -noEmit`.

## Validation
- À chaque étape: `npx tsc -noEmit`.
- Tests unitaires légers pour helpers RBAC et requêtes.
- Vérification des redirections et filtrages par rôle.

J’applique ce plan avec Drizzle + Supabase. Confirmez pour que je commence l’implémentation et les vérifications TypeScript à chaque étape.