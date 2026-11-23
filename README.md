# 🚀 Aether Strike: Hyper Survivor - Android APK & Arcade Game

[![Build Android APK](https://github.com/actions/workflows/build-apk.yml/badge.svg)](../../actions)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-brightgreen.svg)]()
[![Engine](https://img.shields.io/badge/Engine-HTML5%20Canvas%20%2B%20Capacitor-blue.svg)]()
[![Package](https://img.shields.io/badge/Package-com.aetherstrike.hypersurvivor-informational.svg)]()

Juego interactivo de combate aéreo táctico arcade optimizado para **Google Play Store** y dispositivos **Android**. Cuenta con cazas de combate realistas (F-22 Valkyrie, B-2 Ghost Stealth, A-10 Titan Thunderbolt), clima dinámico procedural con partículas (Lluvia de Iones, Tormenta Eléctrica con rayos fractales, Nebulosa Cósmica), audio procedural por sintetizador Web Audio, y controles táctiles avanzados con joystick flotante dinámico y vibración háptica.

---

## 📱 ¿Cómo Descargar y Compartir el APK en GitHub?

### 1. 📥 Descarga Directa desde GitHub Actions (Automático)
Este repositorio incluye un flujo de integración continua (**CI/CD**) preconfigurado en `.github/workflows/build-apk.yml`. Cada vez que subes cambios a GitHub:

1. Ve a la pestaña **Actions** en tu repositorio de GitHub.
2. Selecciona la ejecución más reciente del flujo **"Build & Package Android APK"**.
3. En la sección **Artifacts** al pie de página, haz clic en **`AetherStrike-HyperSurvivor-v1.0-APK`** para descargar el archivo `.apk` de inmediato.

### 2. 🏷️ Publicar en GitHub Releases para Compartir con Todos
Para generar un enlace público permanente de descarga del `.apk`:
```bash
git tag v1.0.0
git push origin v1.0.0
```
El flujo de GitHub Actions detectará la etiqueta y adjuntará automáticamente el archivo `AetherStrike-HyperSurvivor-v1.0.apk` directamente a la sección **Releases** de tu repositorio.

### 3. 📲 Instalación en tu Celular Android
1. Transfiere o descarga el archivo `AetherStrike-HyperSurvivor-v1.0.apk` en tu celular.
2. Pulsa sobre el archivo descargado.
3. Si el sistema te lo pide, selecciona **"Permitir desde esta fuente"** (Instalar apps desconocidas).
4. Pulsa **"Instalar"** y ¡a volar a 60 FPS con controles táctiles nativos!

---

## 🛠️ Compilación Local (Opcional)

Si cuentas con **Android Studio** o el SDK de Android instalado localmente en tu computadora:

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar bundle web
npm run build

# 3. Sincronizar proyecto nativo Capacitor
npx cap sync android

# 4. Compilar APK de depuración con Gradle
cd android
./gradlew assembleDebug

# El archivo APK se genera en:
# android/app/build/outputs/apk/debug/app-debug.apk
```

Para abrir el proyecto en Android Studio:
```bash
npx cap open android
```

---

## 🎮 Características del Juego

- **Modelos de Cazas Reales**:
  - **F-22 Valkyrie**: Caza de superioridad aérea de alta maniobrabilidad con disparo concentrado Vulcan y misiles Hellfire.
  - **B-2 Ghost**: Bombardero furtivo con invisibilidad táctica, minas de racimo y evasión de radar.
  - **A-10 Titan**: Fortaleza acorazada con cañón rotativo GAU-8 Avenger y escudo deflector frontal.
- **Sistema de Clima Dinámico con Partículas**:
  - **Lluvia de Iones**: Gotas de alta velocidad con deriva por viento estelar y salpicaduras luminiscentes.
  - **Tormenta Eléctrica**: Rayos procedurales ramificados con relámpagos ambientales e interferencia electroestática.
  - **Nebulosa Cósmica**: Nubes de gas volumétrico denso y motas estelares brillantes.
- **Controles Móviles Táctiles**:
  - Joystick virtual dinámico flotante en pantalla.
  - Botón de aceleración / Dash táctico con tiempo de recarga.
  - Botón de Habilidad Especial y disparo automático con asistencia de puntería.
- **Sonido Procedural 100% Web Audio**: Sin archivos MP3 pesados, sintetizado en tiempo real a baja latencia con respuesta háptica en vibración móvil.
- **Sistema de Progresión Roguelite**: Sube de nivel recogiendo orbes de experiencia, desbloquea mejoras permanentes en el Hangar y supera récords con tabla de puntuaciones persistente en `localStorage`.

---

## 📄 Especificaciones Técnicas

- **ID de la Aplicación**: `com.aetherstrike.hypersurvivor`
- **Versión**: `1.0.0`
- **SDK Mínimo**: Android 7.0 (API 24)+
- **SDK Objetivo**: Android 14 (API 34)
- **Licencia**: Apache-2.0
