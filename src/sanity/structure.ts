import type { StructureBuilder, StructureResolver } from "sanity/structure";

/**
 * Custom Studio desk structure.
 *
 * Razón principal: forzar `syncConfig` como singleton — un único documento
 * editable, sin lista, sin botón de "crear nuevo". Lo demás se reconstruye
 * con `S.documentTypeListItems()` filtrando los tipos que ya tienen entrada
 * dedicada para evitar duplicados en el menú lateral.
 */
const SINGLETON_TYPES = new Set(["syncConfig"]);

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title("Contenido")
    .items([
      // Singleton: Configuración de Sync (Wasi)
      S.listItem()
        .title("Configuración de Sync")
        .id("syncConfig")
        .child(
          S.editor()
            .id("syncConfig")
            .schemaType("syncConfig")
            .documentId("syncConfig")
        ),
      S.divider(),
      // Resto de los tipos, sin los que ya están como singleton arriba.
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.has(listItem.getId() ?? "")
      ),
    ]);
