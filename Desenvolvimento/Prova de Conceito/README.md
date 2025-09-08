1. # **Introdução**

Este documento apresenta a proposta de arquitetura para o desenvolvimento de um jogo educativo com o objetivo de ensinar a montagem de computadores e a função de seus componentes. O jogo será baseado em uma mecânica de "arrastar e soltar" (drag-and-drop), permitindo que o usuário personalize as peças utilizadas. Ao final da experiência, o jogador será submetido a um questionário para testar os conhecimentos adquiridos.  
Com base na definição de que a aplicação será desenvolvida em Java com banco de dados MySQL, foram selecionadas ferramentas e bibliotecas que otimizam o processo de desenvolvimento. A arquitetura proposta contempla o uso de Spring Boot no backend e React com Vite no frontend.  
A escolha por essas tecnologias visa proporcionar uma estrutura de desenvolvimento ágil, escalável e adequada para uma equipe com desenvolvedores iniciantes, promovendo a colaboração entre as áreas de frontend, backend e banco de dados.

# **2\. Escolhas Técnicas**

# **2.1 Backend**

* Framework: Spring Boot  
* Banco de dados: MySQL  
* Biblioteca de Acesso a Dados: JDBC API

O Spring Boot foi escolhido por sua robustez, facilidade de configuração e forte integração com o ecossistema Spring, especialmente na criação de APIs RESTful. A partir dessa tecnologia, será desenvolvida a API que atenderá às requisições do frontend. Já a JDBC API foi adotada para permitir a execução direta de comandos SQL, aproveitando ao máximo os scripts criados pela equipe de banco de dados, em especial pelos desenvolvedores júnior.

# **2.2 Frontend**

* Framework: React  
* Empacotador: Vite  
* Linguagens: TypeScript, HTML, CSS  
* Biblioteca adicional: React DnD e Axios

O React foi selecionado por sua modularidade, ampla comunidade, documentação acessível e excelente suporte para interações ricas, como a funcionalidade de drag-and-drop, essencial para a mecânica do jogo. O Vite foi escolhido por oferecer um ambiente de desenvolvimento moderno, com carregamento rápido e melhor desempenho.  
A biblioteca React DnD será usada para implementar o sistema de movimentação e encaixe das peças, proporcionando uma experiência de usuário interativa e intuitiva.
Já a biblioteca Axios será empregada para a realização das requisições HTTP ao backend.

# **3\. Estrutura da Aplicação**

A aplicação será dividida em dois principais módulos:

**Frontend:** Interface com o usuário, onde o professor poderá realizar o cadastro, logar e visualizar a sala criada com suas informações, e o aluno poderá registrar-se ao sistema e interagir com o jogo, arrastando as peças para montagem e respondendo ao questionário.

**Backend:** Responsável por fornecer as informações dos componentes e dos usuários, armazenar os resultados dos questionários e manter a persistência e integridade dos dados via integração com o banco de dados.

# **4\. Ferramentas e Instalação**

# **4.1 Backend \- Spring Boot \+ JDBC API**

Requisitos:

* Java JDK 17 ou superior  
* Maven  
* MySQL instalado e configurado

Criação do projeto:  
1\. Acesse o [Spring Initializr](https://start.spring.io/)  
2\. Configure:

* Build Tool: Maven  
* Linguagem: Java  
* Versão: 17

3\. Adicione as dependências:

* Spring Web  
* MySQL Driver  
* JDBC API  
* Spring Boot DevTools  
* Spring Security 

  # **4.2 Frontend \- React \+ Vite \+ React DnD**

Requisitos:

* Node.js 20.19 ou superior

Passos para criação do projeto:

```shell
npm create vite@latest
```

* Escolha um nome para o projeto.  
* Selecione o framework React com a variante TypeScript.

```shell
cd nome-do-projeto
npm install
```

Instalação do React DnD:

```shell
npm install react-dnd react-dnd-html5-backend
```

Instalação do Axios:

```shell
npm install axios
```

# **5\. Considerações Finais**

A arquitetura e o conjunto de tecnologias selecionadas visam equilibrar desempenho, facilidade de aprendizado e aderência aos requisitos do projeto (uso de Java e MySQL). A estrutura modular proposta permite:

* Evolução da aplicação com novos módulos de ensino  
* Adaptação para diferentes níveis educacionais  
* Integração simples entre as equipes de frontend, backend e banco de dados.

Essa prova de conceito estabelece uma base sólida para o desenvolvimento do jogo educativo, permitindo validação de ideias, testes de usabilidade e melhorias contínuas antes da implementação final.