# EcoGram — integração com dados reais

## Estado da implementação

O Supabase **EcoGram** foi criado separadamente e as tabelas `ecogram_profiles` e `ecogram_posts` estão ativas, com Row Level Security.

A branch `feat/ecogram-backend-foundation` agora implementa o cliente público do Supabase e os seguintes fluxos:
- Cadastro com e-mail e senha por Supabase Auth (confirmação por e-mail conforme configuração do projeto)
- Login por e-mail e senha com sessão persistente
- Criação do perfil depois de autenticação confirmada, respeitando `auth.uid()`
- Feed com consulta às publicações persistidas
- Nova publicação de **texto**, salva em `ecogram_posts`
- Saída pelo Perfil e Configurações com `supabase.auth.signOut()`
- Pedido de recuperação de senha por e-mail e atualização por link de recuperação

**A versão pública da Vercel não foi alterada nesta branch.**

## Configuração de URLs de autenticação necessária

No projeto EcoGram, em [Authentication → URL Configuration](https://supabase.com/dashboard/project/elowpjvepunkcksjcvwe/auth/url-configuration):

- Defina **Site URL** como `https://ecogram-pi.vercel.app` para a futura produção.
- Adicione na lista de **Redirect URLs** as URLs exatas necessárias, como `https://ecogram-pi.vercel.app/login.html` e `https://ecogram-pi.vercel.app/recuperar.html`.
- Para testar uma prévia hospedada no Vercel, inclua as URLs correspondentes à **prévia que será testada**, sem aceitar domínios arbitrários.
- Em Authentication → Providers → Email, verifique se a confirmação por e-mail está habilitada como pretendido.

Sem esses ajustes, a verificação de e-mail e a recuperação de senha podem redirecionar para `localhost` ou ser recusadas pelo Supabase.

## Credenciais

O front-end utiliza apenas a **publishable key** do EcoGram em `ecogram-client.js`. Esta chave foi projetada para uso público com RLS. **Nunca** inserir service-role/secret key no navegador, repositório ou deployment.

O banco e a organização do Coletivo Rise não foram usados.

## Limites desta entrega

- Não existe ainda upload remoto de imagens. O seletor de imagens permanece desativado na integração real até criação de bucket com políticas seguras.
- Curtidas, comentários, stories, chat, notificações e ranking ainda não estão sincronizados entre usuários; não apresentar exemplos como atividade real.
- Testes estáticos do código não substituem testes ponta a ponta com **duas contas autenticadas e confirmação de e-mail**.
- Não publicar a branch em produção antes de validar redirecionamentos de Auth, cadastro, saída, persistência e RLS usando contas distintas.

## Checklist antes de ativar a produção

1. Salvar URLs permitidas na configuração do Supabase Auth.
2. Confirmar um cadastro real com e-mail acessível.
3. Entrar, sair e voltar ao site; confirmar que a sessão é persistente e encerra corretamente.
4. Criar uma publicação, atualizar a página e verificar que ela ainda aparece para outra conta.
5. Confirmar que um usuário não consegue modificar os dados nem posts de outro.
6. Confirmar que publicação com imagem está desativada até Storage estar pronto.
7. Testar desktop e celular; só depois aprovar o Pull Request e publicar em produção.
