import { readFile } from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { AppDataSource } from '../src/data-source';
import { Debt, DebtStatus } from '../src/debt/debt.entity';

type DebtRow = {
  name: string;
  email: string;
  debtSubject: string;
  debtAmount: string;
};

async function seed() {
  const csvPath = process.env.DEBTORS_CSV_PATH || path.resolve(process.cwd(), 'debiteurs.csv');
  const csvContent = await readFile(csvPath, 'utf-8');
  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as DebtRow[];

  if (!rows.length) {
    console.warn(`No rows found in ${csvPath}`);
    return;
  }

  const dataSource = await AppDataSource.initialize();
  const repo = dataSource.getRepository(Debt);

  await repo.upsert(
    rows.map((row) => ({
      name: row.name,
      email: row.email,
      debtSubject: row.debtSubject,
      debtAmount: Number(row.debtAmount),
      status: DebtStatus.PENDING,
      stripePaymentIntentId: null,
      paidAt: null
    })),
    ['email', 'debtSubject']
  );

  console.log(`Imported ${rows.length} debts from ${csvPath}`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error seeding debts from CSV:', err);
  process.exitCode = 1;
});
