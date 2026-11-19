import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const schema=readFileSync('supabase/schema.sql','utf8');
test('Banco EcoGram separado com perfis e publicações',()=>{
 assert.match(schema,/create table if not exists public\.ecogram_profiles/i);
 assert.match(schema,/create table if not exists public\.ecogram_posts/i);
 assert.match(schema,/references auth\.users\(id\)/i);
 assert.match(schema,/references public\.ecogram_profiles\(id\)/i);
});

test('RLS habilitada nas duas tabelas expostas',()=>{
 for(const table of ['ecogram_profiles','ecogram_posts'])
  assert.match(schema,new RegExp('alter table public\\.'+table+' enable row level security','i'));
});

test('Escrita limitada ao usuário logado',()=>{
 assert.match(schema,/with check \(\(select auth\.uid\(\)\) = id\)/i);
 assert.match(schema,/with check \(\(select auth\.uid\(\)\) = author_id\)/i);
 assert.match(schema,/using \(\(select auth\.uid\(\)\) = id\)/i);
 assert.match(schema,/using \(\(select auth\.uid\(\)\) = author_id\)/i);
 assert.doesNotMatch(schema,/to anon\s+with check\s*\(true\)/i);
});

test('Integridade e limite dos campos importantes',()=>{
 assert.match(schema,/ecogram_profiles_username_unique/i);
 assert.match(schema,/lower\(username\)/i);
 assert.match(schema,/ecogram_post_body_length/i);
 assert.match(schema,/char_length\(trim\(body\)\) between 1 and 1500/i);
});
