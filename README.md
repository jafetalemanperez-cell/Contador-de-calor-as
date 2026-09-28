# Contador de Calorías

Aplicación web instalable para calcular una meta diaria de calorías y registrar alimentos.

## Funciones V1
- Cálculo de BMR con Mifflin-St Jeor.
- Mantenimiento/TDEE según actividad.
- Objetivo de pérdida, mantenimiento o ganancia.
- Déficit configurable de 10%, 15% o 20% para pérdida.
- Registro diario de alimentos.
- Alimentos iniciales y alimentos personalizados.
- Recetas y calorías por porción.
- Datos guardados localmente en el dispositivo.
- PWA con caché para uso posterior sin conexión.
- Publicación automática mediante GitHub Pages.

## Publicación
Sube todo el contenido al repositorio, incluyendo `.github/workflows/deploy-pages.yml`.
En GitHub: Settings > Pages > Build and deployment > Source: GitHub Actions.
Después de hacer commit a `main`, el workflow publicará el sitio.
