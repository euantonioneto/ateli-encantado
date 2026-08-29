#  Ateliê Encantado — Aplicativo Mobile

> **Mostruário e Gestão de Encomendas Artesanais**

O **Ateliê Encantado** é uma aplicação mobile projetada para conectar clientes a um catálogo exclusivo de produtos artesanais, facilitando a escolha e a encomenda de itens personalizados (unitários ou em lote via carrinho), além de fornecer ao administrador um painel completo para gerenciamento de catálogo e acompanhamento de pedidos.

---

##  Sobre o Projeto

O objetivo principal do aplicativo é servir como um **mostruário interativo** e simplificar o fluxo de encomendas. O sistema permite a navegação pública pelo catálogo, exigindo autenticação apenas no momento de gerenciar o carrinho, realizar encomendas ou acessar as funcionalidades administrativas.

###  Recursos Nativos Integrados

O projeto utiliza controles e APIs nativas do dispositivo para aprimorar a experiência do usuário:
*  **Notificações Push:** Avisos em tempo real sobre atualizações no status dos pedidos.
*  **Feedback Háptico (Vibração):** Resposta tátil ao adicionar itens ao carrinho ou confirmar ações.
*  **Status da Bateria:** Monitoramento de energia para otimização de rotinas em segundo plano.
*  **Gerenciamento de Permissões:** Solicitado de forma transparente conforme o uso de recursos do SO.

---

##  Ciclos de Uso e Perfis de Usuário

###  Ciclo do Cliente
1. **Navegação Livre:** Acesso à tela *Home* para visualizar o catálogo e os preços sem necessidade de login.
2. **Autenticação Direcionada:** Tentativas de acessar o perfil, adicionar itens ao carrinho ou realizar encomendas redirecionam o usuário para a tela de *Login / Cadastro*.
3. **Fluxo Pós-Login:** Retorno à *Home* com permissões para:
   * Visualizar detalhes e especificações do produto.
   * Adicionar múltiplos itens ao carrinho de encomendas.
   * Gerenciar dados do perfil e acompanhar o histórico de pedidos.

###  Ciclo do Administrador
1. **Acesso Administrativo:** Autenticação via credenciais master/admin na tela de login.
2. **Painel de Gestão:** Acesso ao *Dashboard* com controle total do sistema:
   * **CRUD de Produtos:** Liberdade para cadastrar, editar, ocultar ou alterar preços de itens no catálogo.
   * **Monitoramento de Encomendas:** Interface dedicada para visualizar e atualizar o status dos pedidos dos clientes (*Pendente*, *Em Produção*, *Pronto*).

---

## 🛠️ Diagrama de Casos de Uso (UML)

