# Imágenes de banners (datos de maquetado)

Las imágenes de esta carpeta son **recursos ficticios generados con IA** para poblar la base de datos con ejemplos de banners reales y poder maquetar la interfaz.

No representan marcas, empresas ni personas reales.

## Banners de ejemplo incluidos

Cada banner tiene dos variantes de imagen:

| Nombre       | Horizontal                       | Vertical                       |
| ------------ | -------------------------------- | ------------------------------ |
| Tech Store   | banner-tech-store-horizontal.png | banner-tech-store-vertical.png |
| Kryos Gaming | banner-kryos-horizontal.png      | banner-kryos-vertical.png      |
| Nuvix Gear   | banner-nuvix-horizontal.png      | banner-nuvix-vertical.png      |

## Uso

1. Copiá los archivos de esta carpeta a `public/uploads/images/`.
2. Ejecutá `node database/init.js` para cargar el seeder en la base de datos.

El servidor expone `public/` en `/storage/`, por lo que las imágenes quedan disponibles en:

```
/storage/uploads/images/<nombre-de-archivo>
```
