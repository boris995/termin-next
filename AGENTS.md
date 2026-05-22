# Uputstvo za rad na projektu

## Pregled projekta

Ovaj projekat je moderna veb aplikacija za fudbalsku ligu. Aplikacija je prvo prilagodjena telefonu, ali mora dobro raditi i na tabletima i na velikim ekranima. Glavni cilj je cista struktura, lako odrzavanje i jednostavno prosirivanje funkcija.

Naziv aplikacije: **Termin liga**

## Tehnologije

- Okvir aplikacije: Next.js sa App Router pristupom.
- Jezik: TypeScript u strogom rezimu.
- Baza podataka: PostgreSQL.
- Rad sa bazom: Prisma.
- Stilovi: Tailwind CSS.
- Validacija podataka: Zod.
- Ciljano objavljivanje: Vercel.

## Glavne funkcije

- Javna pocetna stranica sa pregledom lige.
- Tabela lige sa bodovima, gol razlikom i osnovnom statistikom.
- Pregled odigranih i zakazanih utakmica.
- Pregled igraca sa golovima, asistencijama i ocjenama.
- Pregled timova sa osnovnim informacijama.
- Administratorski pregled za timove, igrace i utakmice.
- API rute za timove, igrace i utakmice, uz obaveznu validaciju ulaza.

## Pravila za arhitekturu

### Server i podaci

- Prednost imaju server komponente i server akcije za rad sa podacima.
- API rute koristiti samo kada zaista treba spoljasnji pristup podacima.
- Svaki ulaz korisnika mora biti validiran preko Zod sema.
- Tajne vrijednosti, lozinke i kljucevi nikada ne smiju biti dostupni klijentskom kodu.
- Greske moraju imati jasan odgovor i odgovarajuci HTTP status.

Primjer odgovora za gresku:

```typescript
return NextResponse.json({ error: "Igrac nije pronadjen" }, { status: 404 });
```

### Korisnicki interfejs

- Komponente su prvenstveno server komponente.
- Klijentske komponente koristiti samo za interakciju, obrasce, klikove i stanje u pregledaču.
- Dizajn mora biti cist, responzivan i pogodan za tamni rezim.
- Stilovi se pisu Tailwind klasama.
- Ponavljani prikazi se izdvajaju u komponente kao sto su dugme, kartica, polje unosa, oznaka, tabela, kartica igraca, kartica tima i kartica utakmice.
- Ne koristiti nepotrebne inline stilove, osim kada je vrijednost zaista dinamicka, na primjer boja tima.

## Struktura direktorijuma

```plaintext
src/
├── app/
│   ├── api/
│   ├── admin/
│   ├── matches/
│   ├── players/
│   ├── teams/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── matches/
│   ├── players/
│   └── teams/
├── lib/
│   ├── auth.ts
│   ├── data.ts
│   ├── db.ts
│   ├── utils.ts
│   └── validations/
├── services/
│   ├── matches.service.ts
│   ├── players.service.ts
│   └── teams.service.ts
└── types/
    └── index.ts

prisma/
└── schema.prisma
```

## Pravila za bazu podataka

- Svaki model mora imati polja `id`, `createdAt` i `updatedAt`.
- Odnosi izmedju modela moraju biti definisani u Prisma semi.
- Ne pisati sirove SQL upite osim ako ne postoji opravdan razlog.
- Osnovni modeli su `User`, `Season`, `Team`, `Player`, `Match`, `MatchEvent`, `PlayerRating` i `Standing`.

## Promjene u bazi

Redoslijed rada kod izmjene baze:

1. Izmijeniti `prisma/schema.prisma`.
2. Pokrenuti migraciju komandom `npx prisma migrate dev`.
3. Osvjeziti Prisma klijent komandom `npx prisma generate`.

## Uloge i zastita

### Administrator

- Ima pristup administratorskom pregledu.
- Moze upravljati timovima, igracima, utakmicama, rezultatima i tabelom.

### Javni korisnik

- Ima samo citanje javnih stranica.
- Moze pregledati tabelu, utakmice, timove i igrace.

Administratorske stranice i osjetljive API rute moraju biti zasticene na serveru. Lozinke, servisni kljucevi i tajni tokeni ne smiju se nikada slati klijentu.

## Stil koda

- Koristiti `async` i `await`.
- Funkcije treba da imaju jasna imena i eksplicitne povratne tipove kada je to korisno.
- Izbjegavati `any`, duboko ugnijezdenu logiku i neobjasnjene magicne brojeve.
- React komponente pisati u PascalCase obliku, na primjer `PlayerCard.tsx`.
- Servisne fajlove pisati malim slovima sa crticom, na primjer `players.service.ts`.
- Modele baze pisati u jednini i PascalCase obliku, na primjer `Player`.
- Promjenljive i funkcije pisati u camelCase obliku.

## Razvojni tok

Za svaku novu funkciju:

1. Procitati postojeci kod i razumjeti strukturu.
2. Po potrebi izmijeniti Prisma semu.
3. Poslovnu logiku staviti u odgovarajuci servis.
4. UI izdvojiti u ciljane i ponovo upotrebljive komponente.
5. Povezati rute, stanja ucitavanja i stanja greske.
6. Ukloniti dupliranje, provjeriti TypeScript, lint i responzivnost.

## Komande

```bash
npm install
npm run dev
npm run build
npm run lint
npx prisma studio
npx prisma generate
npx prisma migrate dev
```

## Promjenljive okruzenja

Primjer fajla `.env.local`:

```env
DATABASE_URL="postgresql://korisnik:lozinka@localhost:5432/termin_next"
NEXTAUTH_SECRET="promijeni-ovu-vrijednost"
NEXTAUTH_URL="http://localhost:3000"
```

## Pravilo za zavrsni odgovor agenta

Poslije svake implementacije zavrsni odgovor mora kratko navesti:

- sta je promijenjeno;
- koji fajlovi su dodati ili izmijenjeni;
- kako se testira;
- preporuceni sljedeci koraci.
