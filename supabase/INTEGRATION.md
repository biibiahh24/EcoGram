# EcoGram — integração com Supabase

## Estado no repositório

A aplicação ativa está na raiz do repositório e a branch principal é `main`. O deploy de produção é servido por [ecogram-pi.vercel.app](https://ecogram-pi.vercel.app/).

O front-end usa o cliente Supabase em `ecogram-client.js`, com o SDK `@supabase/supabase-js@2.95.0`. A chave publicada no código é uma publishable key, adequada para uso no navegador quando as políticas RLS estão aplicadas. Nunca use uma chave `service_role` no cliente ou no repositório.

## Fluxos implementados no cliente

- Cadastro com e-mail e senha, metadados de perfil e redirecionamento para confirmação de e-mail.
- Login com senha, sessão persistente, criação do perfil e saída.
- Recuperação de senha por e-mail e definição da nova senha.
- Feed com publicações persistidas, curtidas e comentários.
- Upload de imagens para publicações e stories.
- Explorar perfis e conexões, progresso de desafios, conversas, mensagens, notificações e ranking calculado.

O fato de um fluxo estar ligado ao cliente e ao esquema não substitui a validação ponta a ponta no projeto Supabase ativo.

## Banco, políticas e Storage

- `schema.sql` é o esquema-base para `ecogram_profiles` e `ecogram_posts`.
- `migrations/20261118231500_ecogram_social_features.sql` acrescenta curtidas, comentários, stories, progresso de desafios, conexões, conversas, mensagens, notificações e o bucket `ecogram-media`.
- Os arquivos definem Row Level Security (RLS), privilégios e políticas de armazenamento. Aplique-os no projeto Supabase do EcoGram, na ordem acima, e confira o resultado no próprio painel.
- O bucket de mídia é público para leitura, apropriado para conteúdo social público. O upload exige sessão autenticada e grava dentro da pasta identificada pelo ID do usuário.
- E-mail e senha ficam no Supabase Auth; não armazene credenciais nas tabelas de perfil. Trate biografias, publicações e mídias como conteúdo público.

## URLs de autenticação

O código usa a origem atual do site e os seguintes caminhos:

- Cadastro/confirmação: `/login.html`.
- Recuperação e atualização de senha: `/recuperar.html`.

No Supabase Auth, mantenha a URL do site em `https://ecogram-pi.vercel.app` e permita os dois endereços de produção acima. Para prévias Vercel e desenvolvimento local, adicione somente as origens e caminhos exatos necessários para os testes; não habilite curingas para domínios arbitrários. A confirmação por e-mail deve seguir a configuração de Email Providers desejada.

## Execução e validação

Sirva os arquivos pela raiz do repositório usando HTTP; módulos ES não funcionam corretamente ao abrir páginas por `file://`.

O GitHub Actions valida sintaxe JavaScript e executa testes estáticos de páginas, recursos e estrutura-base do SQL. Esses checks não executam as migrações em um banco remoto, não comprovam a configuração do painel Supabase e não são testes ponta a ponta.

Antes de considerar os fluxos validados em produção, teste cadastro e confirmação, login, saída, recuperação, persistência e políticas RLS com duas contas. Confirme também que uma conta não consegue editar registros de outra.
