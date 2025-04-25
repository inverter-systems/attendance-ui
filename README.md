# AttendanceUi

Arquitetura de Segurança do Sistema
A segurança do sistema está baseada em vários componentes que trabalham juntos para garantir autenticação, autorização e proteção dos recursos:
1. Autenticação JWT
O sistema utiliza JSON Web Tokens (JWT) para autenticação, com os seguintes componentes principais:

auth.service.ts: Gerencia o processo de autenticação, incluindo login, logout e verificação do estado de autenticação do usuário. Este serviço provavelmente se comunica com a API Spring Boot para validar credenciais e obter o token JWT.
token.service.ts: Responsável pelo armazenamento, recuperação e gerenciamento do ciclo de vida dos tokens JWT. Isso inclui o armazenamento seguro no localStorage ou sessionStorage, verificação da validade do token e manipulação da renovação de tokens.
auth.interceptor.ts: Um interceptor HTTP que automaticamente adiciona o token JWT a todas as requisições HTTP feitas para a API, adicionando um cabeçalho Authorization do tipo "Bearer Token".

2. Controle de Acesso
O sistema implementa um controle de acesso robusto com:

auth.guard.ts: Um guard que protege rotas que requerem autenticação. Verifica se o usuário está autenticado antes de permitir o acesso a certas partes da aplicação.
role.guard.ts: Um guard mais específico que verifica não apenas se o usuário está autenticado, mas também se possui o papel (role) específico necessário para acessar determinada rota ou funcionalidade.
has-permission.directive.ts: Uma diretiva que permite controlar a visibilidade de elementos da UI com base nas permissões do usuário. Isso permite mostrar ou ocultar botões, menus e outras partes da interface de acordo com as permissões do usuário.

3. Modelos de Dados de Segurança
Os modelos de dados refletem a estrutura de segurança:

user.model.ts: Define a estrutura de dados para usuários, provavelmente incluindo informações como ID, nome de usuário, email e referências aos papéis atribuídos.
role.model.ts: Define a estrutura para papéis no sistema, como "Administrador", "Gerente", "Usuário", cada um com um conjunto de permissões.
permission.model.ts: Define as permissões individuais (como "criar-usuário", "editar-papel", etc.) que são agrupadas em papéis.

4. Tratamento de Erros

error.interceptor.ts: Intercepta erros HTTP, em particular os relacionados à autenticação/autorização (como 401 Unauthorized e 403 Forbidden). Quando um token expira ou é invalidado, este interceptor pode redirecionar para a página de login ou tentar renovar o token automaticamente.

5. Fluxo de Segurança

O usuário inicia na tela de login (login.component.ts)
Após autenticação bem-sucedida, o auth.service.ts armazena o token JWT via token.service.ts
O auth.interceptor.ts adiciona automaticamente o token em todas as requisições
Os guards (auth.guard.ts e role.guard.ts) protegem as rotas com base na autenticação e autorização
A diretiva has-permission.directive.ts controla o que é visível na interface com base nas permissões
Caso ocorram erros de autenticação, o error.interceptor.ts gerencia o fluxo adequadamente

Esta estrutura garante uma implementação segura de autenticação e autorização baseada em JWT, com separação clara de responsabilidades e uma abordagem modular que facilita a manutenção e expansão do sistema no futuro.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
