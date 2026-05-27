# AGENTS.md — Uputstvo za Codex agenta

## Projekat

Naziv aplikacije: **Termin liga / Termin Bijeljina**

Ovo je moderna Next.js aplikacija za fudbalsku ligu / termin fudbal. Aplikacija mora biti mobile-first, brza, čista i spremna za produkciju na Vercelu.

Cilj je da Codex nastavi razvoj postojeće aplikacije bez lomljenja postojeće strukture.

## Tehnologije

Koristi se postojeći stack iz projekta:

- Next.js 16 sa App Router pristupom
- React 19
- TypeScript strict mode
- Tailwind CSS
- PostgreSQL baza
- Supabase za produkcijsku bazu i auth/session helper-e
- Prisma ORM
- Zod za validaciju
- Vercel za deployment
- shadcn/ui stil organizacije, ako se dodaju UI komponente

## Glavna pravila rada

1. Prvo pregledaj postojeće fajlove i strukturu prije izmjena.
2. Ne mijenjaj arhitekturu projekta bez jasnog razloga.
3. Ne briši postojeće funkcionalnosti.
4. Ne mijenjaj `.env`, `.env.local` i tajne vrijednosti.
5. Ne hardkoduj Supabase URL, ključeve, lozinke ili database string.
6. Sve što radi sa bazom mora ići preko Prisma klijenta.
7. Koristi TypeScript strogo i izbjegavaj `any`.
8. Poslije svakog feature-a uradi refactor ako ima dupliranja.
9. Nakon izmjena obavezno provjeri build i lint.
10. Kod mora biti jednostavan, čitljiv i spreman za održavanje.

## Trenutno bitni detalji projekta

U `package.json` postoje ove komande:

```bash
npm run dev
npm run build
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npx prisma studio
```

Prije lokalnog pokretanja `dev` skripta automatski radi `prisma generate`.

## Struktura koju treba poštovati

Poželjna struktura:

```txt
src/
  app/
    api/
    admin/
    matches/
    players/
    teams/
    layout.tsx
    page.tsx
  components/
    ui/
    layout/
    dashboard/
    matches/
    players/
    teams/
  lib/
    auth.ts
    db.ts
    errors.ts
    utils.ts
    validations/
  services/
    matches.service.ts
    players.service.ts
    teams.service.ts
  types/
    index.ts

prisma/
  schema.prisma
  seed.mjs
```

Ako neki folder ne postoji, napravi ga samo kada je stvarno potreban.

## Pravila za Next.js

- Prednost imaju Server Components.
- Client Components koristi samo kada treba:
  - `useState`
  - `useEffect`
  - forma sa interakcijom
  - modal
  - klik event
  - browser API
- Server akcije koristiti kada je prikladno.
- API rute koristiti za javni/spoljašnji pristup podacima ili kada je praktičnije.
- Ne koristiti nepotreban client-side fetch ako se podaci mogu dohvatiti na serveru.

## Pravila za bazu i Prisma

Osnovni modeli aplikacije su:

- User
- Season
- Team
- Player
- Match
- MatchEvent
- PlayerRating
- Standing

Svaki model treba imati:

```prisma
id        String   @id @default(cuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

Kod izmjene baze redoslijed je:

1. Izmijeni `prisma/schema.prisma`.
2. Pokreni migraciju:
   ```bash
   npx prisma migrate dev
   ```
3. Generiši Prisma klijent:
   ```bash
   npx prisma generate
   ```
4. Po potrebi ažuriraj seed:
   ```bash
   npm run db:seed
   ```

Ne koristi raw SQL osim ako nema jakog razloga.

## Pravila za Supabase

- Browser client ide samo u client-side kod.
- Server client ide samo u server-side kod.
- Middleware koristi Supabase session update logiku.
- Ne slati service role key na klijent.
- `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` smiju biti public.
- Sve privatne vrijednosti ostaju server-only.

## Pravila za validaciju

- Svaki unos korisnika validirati Zod šemama.
- Validacije držati u `src/lib/validations`.
- Ne vjerovati podacima iz forme, URL parametara ili body-ja.
- API greške vraćati jasno:

```ts
return NextResponse.json(
  { error: "Igrač nije pronađen" },
  { status: 404 }
);
```

## Pravila za UI

Dizajn mora biti:

- mobile-first
- moderan
- dark mode friendly
- jednostavan
- sportski/fudbalski
- čist i bez previše detalja

Koristi Tailwind CSS klase. Izbjegavaj inline style osim kada je vrijednost dinamička, na primjer boja tima.

Ponavljane dijelove izdvajaj u komponente:

- `Button`
- `Card`
- `Input`
- `Badge`
- `PlayerCard`
- `TeamCard`
- `MatchCard`
- `StatsCard`
- `LeagueTable`
- `MatchTimeline`

## Funkcionalnosti koje aplikacija treba podržati

Javni dio:

- početna stranica lige
- tabela lige
- stranica timova
- stranica igrača
- stranica utakmica
- pojedinačna utakmica
- izvještaj utakmice / timeline golova
- statistika igrača
- najava utakmice
- rezultati

Admin dio:

- admin dashboard
- CRUD timova
- CRUD igrača
- CRUD utakmica
- unos rezultata
- unos timeline događaja
- unos ocjena igrača
- upravljanje sezonama
- zaštita admin ruta

## Pravila za admin zaštitu

- Admin rute moraju biti zaštićene na serveru.
- Ne oslanjati se samo na frontend sakrivanje dugmadi.
- Provjeriti korisnika i rolu prije izmjene podataka.
- Ako korisnik nije admin, vratiti 403 ili redirect.

## Stil koda

- Komponente: PascalCase, npr. `PlayerCard.tsx`
- Servisi: kebab/lowercase, npr. `players.service.ts`
- Funkcije i varijable: camelCase
- Prisma modeli: PascalCase jednina
- Koristi `async/await`
- Izbjegavaj duboko ugniježđenu logiku
- Izbjegavaj magične brojeve
- Dodaj tipove gdje pomažu čitljivosti
- Ne dodavati nepotrebne biblioteke

## Tok rada za svaki feature

Za svaku novu funkcionalnost uradi ovim redom:

1. Pregledaj postojeći kod.
2. Identifikuj koje fajlove treba mijenjati.
3. Ako treba baza, prvo prilagodi Prisma model.
4. Dodaj servisnu logiku u `src/services`.
5. Dodaj validaciju u `src/lib/validations`.
6. Dodaj UI komponente.
7. Poveži stranicu ili API rutu.
8. Dodaj loading i empty state gdje treba.
9. Provjeri responsive prikaz.
10. Pokreni:
    ```bash
    npm run lint
    npm run build
    ```

## Posebna pravila za mobile-first dizajn

- Prvo dizajniraj za telefon.
- Koristi dovoljno veliki tap target.
- Ne praviti preširoke tabele na mobilnom bez horizontalnog scroll-a.
- Kartice treba da budu pregledne.
- Važne informacije idu iznad manje važnih.
- Desktop može imati širi layout, ali mobilni mora biti primarni.

## Greške i debugging

Kada naiđeš na grešku:

1. Pročitaj stack trace.
2. Nađi tačan fajl i liniju.
3. Popravi uzrok, ne simptom.
4. Ne gasiti TypeScript strict mode.
5. Ne sakrivati grešku praznim `catch` blokom osim ako postoji jasan razlog.
6. Ako je greška na produkciji, provjeriti env varijable na Vercelu.

## Deployment pravila

Za Vercel produkciju:

- `DATABASE_URL` mora biti Supabase pooled connection string.
- Supabase public env varijable moraju biti podešene u Vercel Environment Variables.
- Build mora proći lokalno prije commita.
- Ne commitovati `.env.local`.

## Zabranjeno

- Ne mijenjaj veliki broj fajlova bez potrebe.
- Ne uvodi novu arhitekturu bez razloga.
- Ne koristi `any` kao brzo rješenje.
- Ne stavljaj tajne vrijednosti u kod.
- Ne briši postojeći dizajn ako zadatak nije redizajn.
- Ne dodaj package bez provjere da li je stvarno potreban.
- Ne koristi raw SQL za obične CRUD operacije.
- Ne prebacuj server logiku u client komponente.

## Format završnog odgovora Codex agenta

Poslije svake implementacije napiši kratko:

```txt
Urađeno:
- ...

Izmijenjeni fajlovi:
- ...

Testiranje:
- npm run lint
- npm run build

Sljedeći koraci:
- ...
```

Ako nešto nije moglo biti završeno, jasno napiši šta nije završeno i zašto.
