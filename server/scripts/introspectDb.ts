import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

async function main(): Promise<void> {
  const databaseUrl =
    process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || '';

  if (!databaseUrl) {
    console.error(
      'Missing SUPABASE_DB_URL (or DATABASE_URL). Please paste your Supabase Postgres connection string into .env.local as SUPABASE_DB_URL.'
    );
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  // List all non-system schemas and tables
  const tables = (
    await client.query(
      `
      select table_schema, table_name
      from information_schema.tables
      where table_schema not in ('pg_catalog','information_schema')
      order by table_schema, table_name
    `
    )
  ).rows as { table_schema: string; table_name: string }[];

  const schemaReport: Record<string, any> = { tables: [] };

  for (const { table_schema, table_name } of tables) {
    const columns = (
      await client.query(
        `
        select column_name, data_type, is_nullable, column_default
        from information_schema.columns
        where table_schema = $1 and table_name = $2
        order by ordinal_position
      `,
        [table_schema, table_name]
      )
    ).rows;

    const indexes = (
      await client.query(
        `
        select indexname, indexdef
        from pg_indexes
        where schemaname = $1 and tablename = $2
      `,
        [table_schema, table_name]
      )
    ).rows;

    const fkeys = (
      await client.query(
        `
        select
          tc.constraint_name,
          kcu.column_name,
          ccu.table_schema as foreign_table_schema,
          ccu.table_name as foreign_table_name,
          ccu.column_name as foreign_column_name
        from information_schema.table_constraints as tc
        join information_schema.key_column_usage as kcu
          on tc.constraint_name = kcu.constraint_name
          and tc.table_schema = kcu.table_schema
        join information_schema.constraint_column_usage as ccu
          on ccu.constraint_name = tc.constraint_name
          and ccu.table_schema = tc.table_schema
        where tc.constraint_type = 'FOREIGN KEY'
          and tc.table_schema = $1 and tc.table_name = $2
      `,
        [table_schema, table_name]
      )
    ).rows;

    schemaReport.tables.push({
      schema: table_schema,
      name: table_name,
      columns,
      indexes,
      foreignKeys: fkeys,
    });
  }

  await client.end();

  const outDir = path.join(process.cwd(), 'supabase');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const jsonPath = path.join(outDir, 'schema.introspected.json');
  fs.writeFileSync(jsonPath, JSON.stringify(schemaReport, null, 2));

  // Produce a readable markdown summary
  const md: string[] = [];
  md.push('# Supabase Schema (Live Introspection)');
  for (const t of schemaReport.tables) {
    md.push(`\n## ${t.schema}.${t.name}`);
    md.push('\n### Columns');
    md.push('| name | type | nullable | default |');
    md.push('|------|------|----------|---------|');
    for (const c of t.columns) {
      md.push(
        `| ${c.column_name} | ${c.data_type} | ${c.is_nullable} | ${c.column_default ?? ''} |`
      );
    }
    if (t.foreignKeys?.length) {
      md.push('\n### Foreign Keys');
      for (const fk of t.foreignKeys) {
        md.push(
          `- ${fk.column_name} → ${fk.foreign_table_schema}.${fk.foreign_table_name}.${fk.foreign_column_name}`
        );
      }
    }
    if (t.indexes?.length) {
      md.push('\n### Indexes');
      for (const ix of t.indexes) {
        md.push(`- ${ix.indexname}: ${ix.indexdef}`);
      }
    }
  }
  const mdPath = path.join(outDir, 'schema.introspected.md');
  fs.writeFileSync(mdPath, md.join('\n'));

  console.log('Wrote:', jsonPath);
  console.log('Wrote:', mdPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


