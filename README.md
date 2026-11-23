# 🚀 Aether Strike: Hyper Survivor

> **Videojuego arcade de combate aéreo táctico desarrollado con TypeScript, Vite y Capacitor para Android, con generación automatizada de APK vía CI/CD.**

![TypeScript](https://shields.io)
![Vite](https://shields.io)
![Capacitor](https://shields.io)
![Android](https://shields.io)
![GitHub Actions](https://shields.io)

## 🎯 Sobre el proyecto
**Aether Strike** es un videojuego arcade de supervivencia aérea diseñado para demostrar el rendimiento de tecnologías web modernas empaquetadas como aplicación móvil nativa mediante **Capacitor**. El proyecto integra físicas en tiempo real, generación procedural de efectos visuales y síntesis de audio sin dependencias externas.

## ✨ Arquitectura y Características Técnicas
* **Motor y Físicas en TypeScript:** Gestión de entidades, colisiones, oleadas de enemigos y sistema de progresión con persistencia local (`localStorage`).
* **Clima Procedural con Partículas:** Renderizado dinámico de efectos atmosféricos (tormentas eléctricas fractales, lluvia de iones y nebulosas) optimizado a 60 FPS.
* **Audio Procedural (Web Audio API):** Síntesis de efectos de sonido en tiempo real a baja latencia, eliminando la carga de archivos `.mp3` pesados.
* **Empaquetado Móvil y CI/CD:** Integración nativa con **Capacitor** (controles táctiles y vibración háptica) y compilación automática de paquetes `.apk` mediante **GitHub Actions**.

## 🛠️ Stack Tecnológico
* **Lenguaje:** TypeScript / HTML5 Canvas
* **Build Tool:** Vite
* **Runtime Móvil:** Capacitor (Android SDK 24 - 34)
* **DevOps:** GitHub Actions (CI/CD para Android APK)
