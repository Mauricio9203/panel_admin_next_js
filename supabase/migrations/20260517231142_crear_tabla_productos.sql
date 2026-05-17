create extension if not exists "pg_net" with schema "extensions";


  create table "public"."productos" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "nombre" text not null,
    "precio" numeric not null,
    "sku" text,
    "stock" integer not null default 0
      );


alter table "public"."productos" enable row level security;

CREATE UNIQUE INDEX productos_pkey ON public.productos USING btree (id);

CREATE UNIQUE INDEX productos_sku_key ON public.productos USING btree (sku);

alter table "public"."productos" add constraint "productos_pkey" PRIMARY KEY using index "productos_pkey";

alter table "public"."productos" add constraint "productos_sku_key" UNIQUE using index "productos_sku_key";

grant delete on table "public"."productos" to "anon";

grant insert on table "public"."productos" to "anon";

grant references on table "public"."productos" to "anon";

grant select on table "public"."productos" to "anon";

grant trigger on table "public"."productos" to "anon";

grant truncate on table "public"."productos" to "anon";

grant update on table "public"."productos" to "anon";

grant delete on table "public"."productos" to "authenticated";

grant insert on table "public"."productos" to "authenticated";

grant references on table "public"."productos" to "authenticated";

grant select on table "public"."productos" to "authenticated";

grant trigger on table "public"."productos" to "authenticated";

grant truncate on table "public"."productos" to "authenticated";

grant update on table "public"."productos" to "authenticated";

grant delete on table "public"."productos" to "service_role";

grant insert on table "public"."productos" to "service_role";

grant references on table "public"."productos" to "service_role";

grant select on table "public"."productos" to "service_role";

grant trigger on table "public"."productos" to "service_role";

grant truncate on table "public"."productos" to "service_role";

grant update on table "public"."productos" to "service_role";


  create policy "Permitir lectura pública de productos"
  on "public"."productos"
  as permissive
  for select
  to public
using (true);



