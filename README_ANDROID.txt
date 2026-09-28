CONTADOR DE CALORÍAS — PAQUETE ANDROID V1

Estos archivos agregan la configuración para convertir el código web de la app en un APK Android usando GitHub Actions y Capacitor.

IMPORTANTE:
- Estos archivos se deben agregar al mismo repositorio donde ya están index.html, app.js, styles.css y manifest.json.
- No es necesario borrar los archivos que ya tienes.

ARCHIVOS:
- package.json: dependencias de Capacitor.
- capacitor.config.json: nombre e identificador Android de la app.
- .github/workflows/build-apk.yml: automatiza la creación del APK.
- .gitignore: evita subir carpetas generadas.

DESPUÉS DEL COMMIT:
1. Abre la pestaña Actions de GitHub.
2. Entra en "Construir APK Android".
3. Espera a que termine el proceso.
4. Abre la ejecución terminada.
5. En Artifacts aparecerá "contador-calorias-debug-apk".
6. Descarga ese archivo y extrae el APK.

NOTA:
La primera compilación puede tardar varios minutos porque GitHub descargará Capacitor y las herramientas de Android.
