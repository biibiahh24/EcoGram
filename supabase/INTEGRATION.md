# EcoGram — integração com dados reais

## Estado atual

O EcoGram é um **projeto acadêmico real** de rede social sustentável. O front-end publicado usa sessão no navegador e publicações temporárias. Esta branch prepara a próxima etapa: autenticação real e publicações persistidas em **um projeto Supabase exclusivo do EcoGram**.

**Não utilize o projeto Supabase do Coletivo Rise.** Não há integração ativa no site de produção até que o ambiente do EcoGram seja criado, validado e configurado.

## Etapa 1: Supabase independente

1. Criar um novo projeto Supabase, **EcoGram**, na organização e região que a proprietária escolher. Confirmar eventuais custos.
2. Configurar Auth com e-mail/senha e verificar a configuração de confirmação por e-mail e URLs de redirecionamento.
3. Aplicar `supabase/schema.sql` no banco **EcoGram**, nunca no banco Rise.
4. Inspecionar as políticas RLS e testar com dois usuários distintos, com e sem login.
5. Configurar variáveis públicas de conexão: `SUPABASE_URL` e **publishable key** (ou legacy anon key caso necessário). Nunca expor `service_role`, secret key ou credenciais de banco no front-end.
6. Escolher e implementar um SDK Supabase JS de versão fixa; usar controles de dependência e commit de lockfile em um projeto com bundler antes de ativar em produção.

## Fluxos que o novo front-end precisará implementar

- **Cadastro**: email + senha + nome/usuário, confirmação de email quando aplicável, e criação de linha `ecogram_profiles` com `id = auth.uid()`. Tratar erro de nome já existente e confirmação pendente.
- **Login**: usar o Auth real e redirecionar somente após obter sessão válida.
- **Perfil**: carregar `ecogram_profiles` pela sessão do usuário.
- **Feed**: carregar publicações `ecogram_posts` com autores, em ordem decrescente de criação.
- **Publicar**: gravar `body` e `author_id` associado ao usuário autenticado. Upload de imagem exige bucket e policies de Storage próprias em uma segunda migração; **não ativar uploads remotos sem essas policies**.
- **Sair**: `supabase.auth.signOut()`, limpar somente caches locais do EcoGram e redirecionar ao login.
- **Erros/estados**: loading, offline, autenticação expirada, erro no cadastro e feed vazio.

## Verificações de segurança necessárias

| Cenário | Resultado esperado |
|---|---|
| Visitante lê perfis públicos e publicações | Permitido |
| Visitante cria, edita ou apaga perfis e posts | Negado |
| Usuário A cria perfil com ID do usuário B | Negado |
| Usuário A edita perfil do usuário B | Negado |
| Usuário A edita ou apaga post de B | Negado |
| Usuário A cria post com `author_id` de B | Negado |
| Usuário A cria/edita sua própria publicação | Permitido |
| Tentar duplicar usuário variando maiúsculas | Negado |
| Tentar publicar post vazio ou muito longo | Negado |

**Limitação:** a migração foi apenas preparada e versionada no GitHub. Não existe projeto Supabase EcoGram conectado nesta etapa e a migração **não foi executada**.

## Protocolo de lançamento

Validar a migração no projeto EcoGram, adicionar testes de integração, conectar autenticação e feed em outra branch/PR, disponibilizar uma prévia protegida na Vercel, testar com duas contas e só então atualizar a produção. A versão publicada permanece intacta até essa validação.
