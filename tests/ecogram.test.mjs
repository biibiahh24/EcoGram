import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const root = process.cwd();
const pages = readdirSync(root).filter(name => name.endsWith('.html'));
const required = ['index.html','feed.html','explorar.html','desafios.html','ranking.html','perfil.html','login.html','cadastro.html'];

test('Páginas essenciais existem', () => {
 for (const name of required) assert.ok(existsSync(join(root,name)), name);
});

test('Links locais e recursos referenciados existem', () => {
 for(const page of pages){
   const content=readFileSync(join(root,page),'utf8');
   const references=[...content.matchAll(/(?:href|src)\s*=\s*["']([^"'#]+)["']/gi)].map(m=>m[1]);
   for (const resource of references){
     if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(resource)) continue;
     const path=resource.split(/[?#]/,1)[0];
     if (!path || path.startsWith('#')) continue;
     // Absolute site links resolve against repository root, not local filesystem root.
     const absolute=resolve(root, path.replace(/^\//,''));
     assert.ok(absolute.startsWith(root + '/') || absolute===root, page + ': caminho inválido ' + resource);
     assert.ok(existsSync(absolute), page + ': referência inexistente ' + resource);
   }
 }
});

test('Páginas usam a identidade EcoGram e HTML básico', () => {
 for(const page of pages) {
   const content=readFileSync(join(root,page),'utf8');
   assert.match(content,/<!doctype html>/i,page);
   assert.match(content,/<html\b[^>]*lang=["']pt-BR["']/i,page);
   assert.match(content,/<meta\b[^>]*name=["']viewport["']/i,page);
   assert.match(content,/<title>[^<]+<\/title>/i,page);
   assert.doesNotMatch(content,/Susty|Sustagram/i,page);
 }
});

test('Scripts interativos essenciais estão ligados às páginas', () => {
 assert.match(readFileSync(join(root,'feed.html'),'utf8'),/src=["']js_script\.js["']/);
 for (const name of ['explorar.html','desafios.html']){
   assert.match(readFileSync(join(root,name),'utf8'),/src=["']ecogram-pages\.js["']/);
 }
});

test('Demonstração não promete autenticação ou publicação real', () => {
 for (const name of ['login.html','cadastro.html','postar.html','reels.html','stories.html']){
   assert.match(readFileSync(join(root,name),'utf8'),/demonstração|não possui|não envia|não existe|não tem|não armazena|não exibe/i,name);
 }
});
