# Logos de sponsors (datos de maquetado)

Los archivos SVG de esta carpeta son **logos ficticios generados con IA** para poblar la base de datos con ejemplos de sponsors reales y poder maquetar la interfaz.

No representan marcas, empresas ni personas reales.

## Sponsors de ejemplo incluidos

| Archivo      | Nombre del sponsor |
| ------------ | ------------------ |
| drakko.svg   | Drakko             |
| fluxen.svg   | Fluxen             |
| kryos.svg    | Kryos              |
| lumex.svg    | Lumex              |
| nuvix.svg    | Nuvix              |
| orka.svg     | Orka               |
| praxis.svg   | Praxis             |
| syntherr.svg | Syntherr           |
| veloq.svg    | Veloq              |
| zeltro.svg   | Zeltro             |

## Uso

Estos archivos son referenciados por el seeder en `database/seeders/sponsors.sql`.
El servidor expone la carpeta `public/` en `/storage/`, por lo que los logos quedan disponibles en:

```
/storage/sponsors/<nombre>.svg
```
