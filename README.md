# EcoGram 🌱

EcoGram é um projeto acadêmico de rede social voltado à sustentabilidade. O aplicativo reúne publicações, perfis e interações para incentivar a troca de ideias e hábitos mais conscientes.

## Acessar

- [EcoGram em produção](https://ecogram-pi.vercel.app/)
- [Entrar](https://ecogram-pi.vercel.app/login.html)
- [Criar conta](https://ecogram-pi.vercel.app/cadastro.html)

## Linguagens e tecnologias

- **HTML5** para páginas e estrutura.
- **CSS** para identidade visual e responsividade.
- **JavaScript** em módulos ES para autenticação, sessão e recursos do aplicativo.
- **SQL** para o esquema do Supabase, políticas RLS e migrações.
- **YAML** apenas para os workflows de CI do GitHub Actions. Os testes `.mjs` também são JavaScript.

A aplicação é um site estático servido pela Vercel, sem framework de front-end, etapa de build ou servidor Node próprio. O cliente usa Supabase JS v2.95.0 como módulo externo. Node.js 22 é usado nos checks estáticos do CI; não é a linguagem de execução do site.

A análise dos arquivos da branch `main` confirma HTML, CSS, JavaScript e SQL como linguagens de código do projeto. SVG, AVIF, PNG e JPG são formatos de marca e imagem, não linguagens adicionais.

## Recursos conectados

O cliente do Supabase implementa cadastro com confirmação por e-mail, login, recuperação de senha, sessão e saída. Após a autenticação, o aplicativo cria ou carrega o perfil e usa o banco para publicações, curtidas, comentários, stories, progresso de desafios, conexões, mensagens e notificações. O ranking é calculado a partir de publicações e desafios concluídos.

As imagens de publicações e stories são enviadas ao bucket público `ecogram-media` (JPG, PNG ou WebP, até 5 MB). Como perfis, publicações e mídias são públicos por projeto, não inclua dados privados nesses campos.

Os módulos consultam os dados ao abrir as páginas. O repositório não configura atualizações em tempo real via Supabase Realtime; pode ser necessário recarregar a tela para ver alterações feitas por outra pessoa.

## Executar localmente

Sirva a raiz do repositório com qualquer servidor HTTP estático e acesse a origem local pelo navegador. Não abra os arquivos com `file://`: os módulos ES e a autenticação precisam de uma origem HTTP. Para testar cadastro e recuperação localmente, inclua as URLs exatas do servidor local na configuração de redirecionamentos do Supabase.

## Supabase

- O cliente e a chave publicável estão em `ecogram-client.js`. A chave publicável foi feita para uso no navegador, com RLS habilitada.
- `supabase/schema.sql` cria o esquema-base de perfis e publicações.
- `supabase/migrations/` contém a migração das interações sociais, políticas e armazenamento.
- Nunca coloque uma chave `service_role` ou outra chave secreta no front-end, no GitHub ou na Vercel.

Configure no Supabase os redirecionamentos de produção para `https://ecogram-pi.vercel.app/login.html` e `https://ecogram-pi.vercel.app/recuperar.html`. A confirmação de e-mail e a recuperação dependem de esses endereços estarem permitidos.

## Verificações

Com Node.js 22, os testes estáticos podem ser executados assim:

```sh
node --test tests/app-ui.test.mjs tests/ecogram-schema.test.mjs
```

Os workflows também verificam a sintaxe dos módulos JavaScript. Esses checks não substituem um teste ponta a ponta com contas reais, confirmação de e-mail, validação das políticas RLS e fluxos entre duas pessoas.

## Estrutura

- Páginas e estilos ativos: arquivos HTML e CSS na raiz.
- Cliente, autenticação e recursos sociais: `ecogram-client.js`, `auth.js`, `app-session.js` e `ecogram-features.js`.
- Banco: `supabase/`.
- Checks automatizados: `.github/workflows/` e `tests/`.
