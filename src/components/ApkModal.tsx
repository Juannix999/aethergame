import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Github, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  PackageCheck
} from 'lucide-react';
import { sound } from '../game/audio';

interface ApkModalProps {
  onClose: () => void;
}

export const ApkModal: React.FC<ApkModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'github' | 'install' | 'cli'>('github');
  const [copied, setCopied] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  // Listen for PWA install prompt on mobile Chrome/Edge
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    sound.click();
    setTimeout(() => setCopied(null), 2500);
  };

  const handleInstallPWA = async () => {
    sound.click();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleShare = async () => {
    sound.click();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aether Strike: Hyper Survivor - APK Android',
          text: 'Descarga y juega Aether Strike para Android: combate táctico arcade a 60 FPS con aviones de combate reales y clima dinámico.',
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      handleCopy(window.location.href, 'share');
    }
  };

  const gitCommands = `git add .
git commit -m "feat: Aether Strike Android APK build ready"
git push origin main`;

  const localBuildCommands = `npm install
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-bold text-slate-100 tracking-wide flex items-center gap-2">
                DESCARGAR APK & COMPARTIR
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-semibold border border-emerald-500/30">
                  LISTO V1.0
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Paquete nativo Android (Capacitor) + CI/CD GitHub Actions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('github');
            }}
            className={`py-3 text-center font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'github'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub APK</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('install');
            }}
            className={`py-3 text-center font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'install'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Instalar en Móvil</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('cli');
            }}
            className={`py-3 text-center font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'cli'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Compilar CLI</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm">
          
          {/* TAB 1: GITHUB APK */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              {/* Highlight Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/50 via-slate-900 to-slate-900 border border-cyan-500/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-cyan-200 mb-1">
                      Flujo Automatizado de GitHub Actions Incluido
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      El proyecto ya cuenta con el archivo de flujo continuo <span className="text-cyan-400 font-mono">.github/workflows/build-apk.yml</span> configurado con Java 17 y Android SDK.
                    </p>
                  </div>
                </div>
              </div>

              {/* How it works card */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 font-mono">
                  ¿Cómo obtener el archivo APK en GitHub?
                </h4>
                
                <ol className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">1</span>
                    <span>Sube este código a tu repositorio de GitHub mediante <span className="font-mono text-cyan-300">git push</span>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">2</span>
                    <span>Entra a la pestaña <strong className="text-white">Actions</strong> de tu repositorio: verás la tarea <span className="font-mono text-cyan-300">Build & Package Android APK</span> ejecutándose automáticamente.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">3</span>
                    <span>Al terminar (aprox. 1-2 min), haz clic en el artefacto generado llamado <strong className="text-emerald-300 font-mono">AetherStrike-HyperSurvivor-v1.0-APK</strong> para descargarlo con 1 solo clic.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">4</span>
                    <span>También puedes crear un <strong>Release</strong> o etiquetar con <span className="font-mono text-amber-300">git tag v1.0</span> y el APK se publicará en la sección de Releases para compartir el link directo con quien quieras.</span>
                  </li>
                </ol>
              </div>

              {/* Quick Git Commands to Push */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Comandos para publicar en GitHub:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(gitCommands, 'git')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {copied === 'git' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 overflow-x-auto border border-slate-800">
                  {gitCommands}
                </pre>
              </div>

              {/* Package Specs Badge */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">APPLICATION ID</span>
                  <span className="text-cyan-400 font-bold truncate block">com.aetherstrike.hypersurvivor</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">VERSIÓN & COMPATIBILIDAD</span>
                  <span className="text-emerald-400 font-bold block">v1.0 (Android 7.0+)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTALL ON MOBILE (PWA / DIRECT) */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-emerald-200 mb-1">
                      Instalación Instantánea en Celular
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      El juego cuenta con Web App Manifest y modo pantalla completa inmersivo. Puedes instalarlo directamente en tu teléfono Android sin descargas pesadas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct PWA Install Button if available */}
              {deferredPrompt && !isInstalled && (
                <button
                  type="button"
                  onClick={handleInstallPWA}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-heading font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>INSTALAR APP EN ESTE DISPOSITIVO</span>
                </button>
              )}

              {isInstalled && (
                <div className="p-3 rounded-lg bg-emerald-900/30 border border-emerald-500/50 text-emerald-300 flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>¡Aplicación instalada con éxito en tu dispositivo!</span>
                </div>
              )}

              {/* Manual Mobile Chrome Instructions */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Pasos para instalar en Chrome Android:</span>
                </h4>
                
                <ol className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold">1.</span>
                    <span>Abre este enlace en Google Chrome o el navegador de tu celular.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold">2.</span>
                    <span>Toca el menú de tres puntos <strong className="text-white">(⋮)</strong> en la esquina superior derecha.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold">3.</span>
                    <span>Selecciona <strong className="text-cyan-300">"Instalar aplicación"</strong> o <strong className="text-cyan-300">"Añadir a la pantalla de inicio"</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold">4.</span>
                    <span>¡El icono del caza aparecerá en tus aplicaciones y se abrirá en pantalla completa a 60 FPS!</span>
                  </li>
                </ol>
              </div>

              {/* Share link button */}
              <button
                type="button"
                onClick={handleShare}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>{copied === 'share' ? '¡Enlace Copiado al Portapapeles!' : 'Compartir enlace para instalar en celular'}</span>
              </button>
            </div>
          )}

          {/* TAB 3: LOCAL CLI COMPILATION */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 font-mono">
                  Compilación local con Android Studio o Gradle
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Si prefieres compilar el APK en tu propia computadora con Android Studio o el SDK de Android:
                </p>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Comandos en terminal:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(localBuildCommands, 'cli')}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {copied === 'cli' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-slate-800">
                    {localBuildCommands}
                  </pre>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <span className="text-cyan-300 font-bold block">Ubicación del archivo compilado:</span>
                  <code className="text-slate-300 block bg-slate-950 p-1.5 rounded font-mono break-all">
                    android/app/build/outputs/apk/debug/app-debug.apk
                  </code>
                </div>
              </div>

              {/* Open in Android Studio note */}
              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Para firmar con tu llave de Play Store para producción, ejecuta <code className="font-mono text-cyan-300">npx cap open android</code> y usa el menú <em>Build &gt; Generate Signed Bundle / APK</em>.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400">
            Aether Strike · Android Ready
          </div>
          <button
            type="button"
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
