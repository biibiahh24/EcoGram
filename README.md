# EcoGram 🌱

**EcoGram é um projeto acadêmico de desenvolvimento web**, criado durante a graduação, com a proposta de uma rede social voltada à sustentabilidade. O aplicativo reúne experiências de feed, publicações, stories, busca de conteúdos, perfil, mensagens, desafios e ranking, incentivando a troca de ideias e hábitos conscientes.

## Tecnologias

- HTML, CSS e JavaScript
- Interface responsiva para computador e celular
- Deploy estático na Vercel

## Como explorar o projeto

Acesse a aplicação, use o login para avaliação (usuário `demo`, senha `demo123`) ou entre como visitante. Também é possível criar um perfil para a sessão atual.

## Implementação atual

Esta é uma aplicação web desenvolvida como **trabalho de faculdade**, não um mockup ou imagem conceitual.

- As páginas, navegação e componentes são código funcional.
- Busca e filtros de Explorar funcionam sobre conteúdos locais do projeto.
- Curtidas, comentários, stories e desafios têm interações implementadas no navegador.
- Publicações podem ser criadas durante a sessão, incluindo imagem de até 1 MB.
- O login atual é um mecanismo de acesso local para avaliação; não autentica contas em um servidor.
- Dados de sessão e publicações **não são sincronizados entre usuários**.
- Mensagens, notificações e ranking têm conteúdos de exemplo e ainda não possuem um serviço de dados em tempo real.
- A recuperação de senha por e-mail depende de uma futura integração de autenticação.

Essas limitações são características do **estágio de implementação das funcionalidades**, não uma classificação do projeto inteiro como protótipo.

## Desenvolvimento

As melhorias de experiência visual e navegação estão na branch `fix/ecogram-original-app`. A branch `main` mantém a versão original do projeto.

Para executar localmente, sirva a pasta com um servidor HTTP estático e abra `index.html`. Os testes estáticos podem ser executados com Node.js:

```sh
node --test tests/app-ui.test.mjs
```

## Objetivo

Promover conscientização ambiental e criar um ambiente digital que incentive boas práticas de sustentabilidade, ao mesmo tempo aplicando conceitos de desenvolvimento web, experiência do usuário e interfaces interativas.
