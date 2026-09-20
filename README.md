# Ateliê Encantado

Aplicativo mobile desenvolvido com React Native, Expo e Expo Router para apresentar produtos artesanais, organizar favoritos e carrinho, além de oferecer um fluxo de cadastro para clientes e acesso administrativo.

## Objetivo

O Ateliê Encantado permite que clientes conheçam o catálogo, criem um perfil, favoritem produtos e preparem um carrinho de encomendas. O projeto também prevê uma área administrativa para acompanhar pedidos e gerenciar produtos.

## Tecnologias

- React Native
- Expo SDK 57
- Expo Router
- TypeScript
- React Context API

## Fluxo principal

```text
Cliente sem conta
  └─ Perfil
      ├─ Cadastrar
      │   ├─ Dados pessoais
      │   ├─ Endereço
      │   └─ Conferência → Home
      └─ Logar → Home

Home
  ├─ Favoritos
  ├─ Carrinho
  └─ Perfil
      ├─ Dados da conta
      ├─ Endereço de entrega
      ├─ Meus pedidos
      └─ Conversar com o vendedor

Administrador
  └─ Login administrativo → Dashboard
```

## Funcionalidades já implementadas

### Cliente

- Cadastro dividido em três etapas: dados pessoais, endereço e confirmação.
- Validação de campos obrigatórios e confirmação de senha.
- Criação de perfil em memória após concluir o cadastro.
- Redirecionamento para a Home após cadastrar.
- Exibição do primeiro nome da cliente na Home.
- Navegação por abas: Home, Favoritos, Carrinho e Perfil.
- Inclusão e remoção de produtos dos favoritos e do carrinho.
- Exibição dos dados básicos do perfil criado.
- Navegação para Dados da conta, Endereço de entrega, Meus pedidos e Conversar com o vendedor.
- Mensagem “Ainda em desenvolvimento” nas telas que ainda não receberam conteúdo.

### Administração

- Tela de login administrativo.
- Validação de demonstração com as credenciais abaixo:

```text
E-mail: adm@gmail.com
Senha: Adm
```

- Redirecionamento para o Dashboard administrativo.

## Funcionalidades previstas

Estas funcionalidades fazem parte do diagrama de casos de uso, mas ainda precisam ser implementadas:

- Detalhes de produto e filtro por categoria.
- Finalização de compra e escolha de pagamento.
- Histórico e acompanhamento de pedidos.
- Edição dos dados da conta e endereço de entrega.
- Conversa com o vendedor ou integração com WhatsApp.
- Logout.
- Gerenciamento de pedidos e produtos no Dashboard.
- Persistência de dados em banco de dados ou armazenamento local.
- Login e autenticação reais.

## Estrutura de telas

```text
src/app/
├── context/
│   └── StoreContext.tsx
├── loguin/
│   ├── cadastro.tsx
│   ├── logar-adm.tsx
│   └── logar-cliente.tsx
├── telas-adm/
│   └── Dashboard.tsx
└── telas-cliente/
    ├── index.tsx
    ├── favoritos.tsx
    ├── carrinho.tsx
    ├── perfil.tsx
    ├── dados-conta.tsx
    ├── endereco-entrega.tsx
    ├── meus-pedidos.tsx
    └── conversar-vendedor.tsx
```

## Estado compartilhado

O arquivo `src/app/context/StoreContext.tsx` centraliza os dados usados entre as telas:

- perfil da cliente;
- produtos favoritados;
- produtos adicionados ao carrinho.

No momento, esses dados existem apenas enquanto o aplicativo está aberto.

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o projeto:

```bash
npm start
```

3. Use o Expo Go, um emulador ou a versão web para abrir o aplicativo.

## Diagrama de Casos de Uso (UML)

```plantuml
@startuml Diagrama de Casos de Uso - AE Atelier de Borboletas

left to right direction
skinparam packageStyle rectangle

actor "Cliente" as C
actor "Administrador" as A

rectangle "AE - Atelier de Borboletas" {
  package "Autenticação" {
    usecase "Fazer Login" as UC1
    usecase "Cadastrar-se" as UC2
    usecase "Informar Dados Pessoais" as UC2a
    usecase "Informar Endereço" as UC2b
    usecase "Confirmar Cadastro" as UC2c
    usecase "Fazer Logout" as UC3
  }

  package "Catálogo" {
    usecase "Navegar pelo Catálogo" as UC4
    usecase "Filtrar por Categoria" as UC5
    usecase "Visualizar Detalhes\ndo Produto" as UC6
    usecase "Adicionar aos Favoritos" as UC7
  }

  package "Compras" {
    usecase "Adicionar ao Carrinho" as UC8
    usecase "Visualizar Carrinho" as UC9
    usecase "Finalizar Compra" as UC10
    usecase "Escolher Forma\nde Pagamento" as UC11
    usecase "Acompanhar Pedidos" as UC12
  }

  package "Perfil" {
    usecase "Visualizar Perfil" as UC13
    usecase "Editar Dados da Conta" as UC14
    usecase "Editar Endereço\nde Entrega" as UC15
  }

  package "Comunicação" {
    usecase "Solicitar Presente\nPersonalizado" as UC16
    usecase "Conversar com\no Vendedor" as UC17
    usecase "Visualizar Mensagens\nde Clientes" as UC18
    usecase "Responder Cliente" as UC19
  }

  package "Administração" {
    usecase "Acessar Dashboard" as UC20
    usecase "Gerenciar Pedidos" as UC21
    usecase "Atualizar Status\ndo Pedido" as UC22
    usecase "Criar Produto" as UC23
    usecase "Cadastrar Foto\ndo Produto" as UC23a
    usecase "Definir Tipos\nDisponíveis" as UC23b
  }
}

C --> UC1
C --> UC2
C --> UC3
C --> UC4
C --> UC5
C --> UC6
C --> UC7
C --> UC8
C --> UC9
C --> UC10
C --> UC12
C --> UC13
C --> UC14
C --> UC15
C --> UC16

A --> UC1
A --> UC20
A --> UC21
A --> UC23
A --> UC18
A --> UC19

UC2 ..> UC2a : <<include>>
UC2 ..> UC2b : <<include>>
UC2 ..> UC2c : <<include>>
UC10 ..> UC11 : <<include>>
UC23 ..> UC23a : <<include>>
UC23 ..> UC23b : <<include>>

UC5 ..> UC4 : <<extend>>
UC7 ..> UC6 : <<extend>>
UC8 ..> UC6 : <<extend>>
UC16 ..> UC17 : <<include>>
UC21 ..> UC22 : <<include>>
@enduml
```
