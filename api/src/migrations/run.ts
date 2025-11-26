import { AppDataSource } from '../data-source';

async function runMigrations() {
  const dataSource = await AppDataSource.initialize();
  try {
    await dataSource.runMigrations();
    console.log('Migrations executed');
  } finally {
    await dataSource.destroy();
  }
}

runMigrations().catch((err) => {
  console.error('Error running migrations', err);
  process.exitCode = 1;
});
