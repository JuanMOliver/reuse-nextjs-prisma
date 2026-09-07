# Modelo de dados — ReUse! Web

## Diagrama entidade-relacionamento (Mermaid)

```mermaid
erDiagram
    USUARIO ||--o{ ITEM : publica
    USUARIO ||--o{ TROCA : solicita
    USUARIO ||--o{ AVALIACAO : avalia
    USUARIO ||--o{ AVALIACAO : "e_avaliado"
    USUARIO ||--o{ MENSAGEM : envia
    CATEGORIA ||--o{ ITEM : classifica
    ITEM ||--o{ TROCA : "oferecido_em"
    ITEM ||--o{ TROCA : "desejado_em"
    TROCA ||--o{ MENSAGEM : contem
    TROCA ||--o{ AVALIACAO : origina

    USUARIO {
        string id PK
        string nome
        string email UK
        string cidade
        string bairro
    }
    CATEGORIA {
        string id PK
        string nome UK
        string icone
    }
    ITEM {
        string id PK
        string titulo
        string condicao
        string status
        string usuarioId FK
        string categoriaId FK
    }
    TROCA {
        string id PK
        string status
        string solicitanteId FK
        string itemOferecidoId FK
        string itemDesejadoId FK
    }
    MENSAGEM {
        string id PK
        string texto
        string trocaId FK
        string autorId FK
    }
    AVALIACAO {
        string id PK
        int nota
        string avaliadorId FK
        string avaliadoId FK
        string trocaId FK
    }
```

## Descrição das tabelas

| Tabela       | Objetivo                                                                 |
|--------------|-----------------------------------------------------------------------------|
| `usuarios`   | Armazena as pessoas cadastradas na plataforma (nome, contato, localização). |
| `categorias` | Organiza os itens por tipo (Eletrônicos, Livros, Móveis, etc.).            |
| `itens`      | Objetos disponíveis para troca ou doação, vinculados a usuário e categoria. |
| `trocas`     | Propostas de troca entre dois usuários, envolvendo dois itens.             |
| `mensagens`  | Histórico de conversas trocadas dentro de uma proposta de troca.           |
| `avaliacoes` | Notas e comentários que um usuário dá a outro após uma troca concluída.    |
