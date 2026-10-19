-- Permite ao cliente criar e consultar somente os próprios pedidos.
alter table public.itens_pedido
  add column if not exists customizacao text;

drop policy if exists "pedidos_criar_proprio" on public.pedidos;
create policy "pedidos_criar_proprio"
on public.pedidos
for insert
to authenticated
with check (cliente_id = (select auth.uid()));

drop policy if exists "itens_pedido_criar_proprios" on public.itens_pedido;
create policy "itens_pedido_criar_proprios"
on public.itens_pedido
for insert
to authenticated
with check (
  exists (
    select 1
    from public.pedidos
    where pedidos.id = itens_pedido.pedido_id
      and pedidos.cliente_id = (select auth.uid())
  )
);

-- Cria o pedido e seus itens numa única transação, usando preços do catálogo.
create or replace function public.criar_pedido_cliente(
  p_forma_entrega text,
  p_endereco_entrega text,
  p_forma_pagamento text,
  p_observacoes text,
  p_itens jsonb
)
returns bigint
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_cliente_id uuid := auth.uid();
  v_pedido_id bigint;
  v_subtotal numeric := 0;
  v_frete numeric := 0;
  v_produto public.produtos%rowtype;
  v_item jsonb;
  v_opcao text;
  v_quantidade integer;
  v_preco numeric;
begin
  if v_cliente_id is null then
    raise exception 'É necessário entrar na conta para criar um pedido.';
  end if;

  if p_forma_entrega not in ('Entrega', 'Retirada no ateliê') then
    raise exception 'Forma de entrega inválida.';
  end if;

  if p_forma_pagamento not in ('Pix', 'Cartão', 'Dinheiro') then
    raise exception 'Forma de pagamento inválida.';
  end if;

  if jsonb_typeof(p_itens) <> 'array' or jsonb_array_length(p_itens) = 0 then
    raise exception 'O pedido precisa ter ao menos um item.';
  end if;

  if p_forma_entrega = 'Entrega' then
    v_frete := 10;
    if coalesce(trim(p_endereco_entrega), '') = '' then
      raise exception 'Informe o endereço de entrega.';
    end if;
  end if;

  for v_item in select value from jsonb_array_elements(p_itens)
  loop
    v_quantidade := (v_item->>'quantidade')::integer;
    v_opcao := v_item->>'opcao';
    if v_quantidade < 1 or v_quantidade > 99 or coalesce(v_opcao, '') = '' then
      raise exception 'Item do pedido inválido.';
    end if;

    select * into v_produto
    from public.produtos
    where id = (v_item->>'produto_id')::uuid and publicado = true;
    if not found then
      raise exception 'Um produto não está disponível.';
    end if;

    v_preco := coalesce((v_produto.opcoes->'precosPorTipo'->>v_opcao)::numeric, v_produto.preco);
    if v_preco <= 0 then
      raise exception 'Preço de produto inválido.';
    end if;
    v_subtotal := v_subtotal + v_preco * v_quantidade;
  end loop;

  insert into public.pedidos (
    cliente_id, status, subtotal, frete, total, forma_entrega,
    endereco_entrega, forma_pagamento, observacoes
  ) values (
    v_cliente_id, 'Pendente', v_subtotal, v_frete, v_subtotal + v_frete,
    p_forma_entrega, nullif(trim(p_endereco_entrega), ''),
    p_forma_pagamento, nullif(trim(p_observacoes), '')
  ) returning id into v_pedido_id;

  for v_item in select value from jsonb_array_elements(p_itens)
  loop
    v_quantidade := (v_item->>'quantidade')::integer;
    v_opcao := v_item->>'opcao';

    select * into v_produto
    from public.produtos
    where id = (v_item->>'produto_id')::uuid and publicado = true;
    v_preco := coalesce((v_produto.opcoes->'precosPorTipo'->>v_opcao)::numeric, v_produto.preco);

    insert into public.itens_pedido (
      pedido_id, produto_id, nome_produto, opcao, quantidade, preco_unitario, customizacao
    ) values (
      v_pedido_id, v_produto.id, v_produto.nome, v_opcao, v_quantidade, v_preco,
      nullif(trim(v_item->>'customizacao'), '')
    );
  end loop;

  return v_pedido_id;
end;
$$;

grant execute on function public.criar_pedido_cliente(text, text, text, text, jsonb) to authenticated;
