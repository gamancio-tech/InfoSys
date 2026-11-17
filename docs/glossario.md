# Glossário

Um termo, um significado. Em código, use o termo em inglês entre parênteses.

| Termo | Definição | Não confundir com |
|---|---|---|
| **Organização** (`organization`) | A empresa cliente do SaaS. Unidade de isolamento de dados (tenant). | Cliente |
| **Usuário** (`user`) | Pessoa com login. Pertence a uma ou mais organizações. | Cliente |
| **Membro** (`member`) | Vínculo usuário ↔ organização, com papel. | — |
| **Papel** (`role`) | Permissões do membro: proprietário, administrador, técnico. | — |
| **Cliente** (`customer`) | Pessoa/empresa atendida pela organização. | Usuário, Organização |
| **Endereço do cliente** (`customer_address`) | Local de atendimento; um cliente pode ter vários, com título opcional. | — |
| **Anotação** (`note`) | Texto livre anexado a um cliente (ex.: senha de equipamento). | Observação do orçamento |
| **Equipamento** (`equipment`) | Item instalado no cliente (ex.: DVR, ar-condicionado), com modelo, série, data de instalação. | Produto do catálogo |
| **Produto** (`product`) | Item do catálogo vendido/usado em serviços. | Equipamento |
| **Serviço do catálogo** (`service_item`) | Serviço com preço de referência. <!-- TODO: unificar com produto? --> | Atendimento |
| **Tipo de atendimento** (`service_type`) | Categoria configurável por organização (instalação, manutenção, visita). | — |
| **Atendimento / Agendamento** (`appointment`) | Compromisso na agenda com cliente, data/hora e técnico. | — |
| **Orçamento** (`quote`) | Proposta com itens e total, enviada ao cliente. | Fatura |
| **Modelo de orçamento** (`quote_template`) | Layout (logo, cores, textos) usado ao gerar o PDF. | — |
| **Plano de manutenção** (`maintenance_plan`) | Regra de recorrência: de quanto em quanto tempo um cliente/equipamento precisa de revisão. | Agendamento |
| **Aviso de manutenção** (`maintenance_reminder`) | Notificação gerada quando uma manutenção está próxima do vencimento. | — |
| **Fatura** (`invoice`) | Cobrança emitida ao cliente. Não é nota fiscal. | Nota fiscal |
| **Lançamento** (`transaction`) | Entrada ou saída financeira. | — |

<!-- TODO: revisar termos do seu jargão (ex.: "OS", "nota de serviço", "visita técnica") e decidir o nome oficial de cada um -->
