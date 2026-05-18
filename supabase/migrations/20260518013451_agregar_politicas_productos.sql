
  create policy "Eliminar productos"
  on "public"."productos"
  as permissive
  for delete
  to public
using (true);



  create policy "editar productos"
  on "public"."productos"
  as permissive
  for update
  to public
using (true);



  create policy "insertar productos"
  on "public"."productos"
  as permissive
  for insert
  to public
with check (true);



