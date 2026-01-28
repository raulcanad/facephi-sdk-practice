// ============================================
// FACE PHI SDK SIMULATOR - Práctica Técnica
// ============================================

console.log('🔧 Facephi SDK Simulator iniciado');

class FacephiSDKSimulator {
    constructor() {
        this.stream = null;
        this.isCameraActive = false;
        this.apiLog = document.getElementById('apiLog');
        this.consoleContent = document.getElementById('consoleContent');
        this.debug('SDK inicializado correctamente');
    }

    // ========== MÉTODOS DE LOGGING ==========
    debug(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('es-ES', { 
            hour12: false,
            fractionalSecondDigits: 3 
        });
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-${type}`;
        logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
        
        this.consoleContent.appendChild(logEntry);
        this.consoleContent.scrollTop = this.consoleContent.scrollHeight;
        
        // También a consola real
        const consoleMethod = type === 'error' ? console.error : 
                             type === 'warning' ? console.warn : console.log;
        consoleMethod(`[Facephi SDK] ${message}`);
    }

    // ========== SECCIÓN CÁMARA ==========
    async startCamera() {
        try {
            this.debug('🔍 Solicitando permisos de cámara...', 'info');
            
            if (this.isCameraActive) {
                this.debug('⚠️ La cámara ya está activa', 'warning');
                this.updateStatus('cameraStatus', 'Cámara ya activa', 'warning');
                return;
            }

            // Simulación de diferentes escenarios
            const scenarios = {
                success: { probability: 0.7, message: 'Permisos concedidos' },
                permissionDenied: { probability: 0.2, message: 'Usuario denegó permisos' },
                noCamera: { probability: 0.1, message: 'No se detectó cámara' }
            };

            const random = Math.random();
            let scenario;

            if (random < scenarios.success.probability) {
                scenario = 'success';
            } else if (random < scenarios.success.probability + scenarios.permissionDenied.probability) {
                scenario = 'permissionDenied';
            } else {
                scenario = 'noCamera';
            }

            if (scenario === 'success') {
                this.debug('✅ Permisos de cámara concedidos', 'info');
                
                // En un caso real, aquí iría navigator.mediaDevices.getUserMedia()
                this.isCameraActive = true;
                document.getElementById('camera').style.borderColor = '#27ae60';
                
                this.updateStatus('cameraStatus', 
                    '✅ Cámara activada - Lista para captura', 
                    'success'
                );
                
                this.debug('📹 Stream de cámara iniciado', 'info');
                
            } else {
                const errorMsg = `❌ Error de cámara: ${scenarios[scenario].message}`;
                this.debug(errorMsg, 'error');
                this.updateStatus('cameraStatus', errorMsg, 'error');
                throw new Error(scenarios[scenario].message);
            }

        } catch (error) {
            this.debug(`❌ Error en startCamera: ${error.message}`, 'error');
            this.updateStatus('cameraStatus', 
                `❌ Error: ${error.message}`, 
                'error'
            );
        }
    }

    async captureSelfie() {
        if (!this.isCameraActive) {
            this.debug('⚠️ Primero activa la cámara', 'warning');
            this.updateStatus('cameraStatus', 'Activa la cámara primero', 'warning');
            return;
        }

        this.debug('🔄 Iniciando captura de selfie...', 'info');
        this.updateStatus('cameraStatus', '🔄 Procesando selfie...', 'info');

        // Simulación de procesamiento Facephi
        await this.delay(1500);

        const results = [
            {
                success: true,
                score: 0.95,
                liveness: true,
                message: '✅ Selfie válido - Alta confianza',
                details: 'Liveness detectado, calidad excelente'
            },
            {
                success: true,
                score: 0.82,
                liveness: true,
                message: '✅ Selfie válido - Calidad media',
                details: 'Liveness detectado, iluminación mejorable'
            },
            {
                success: false,
                score: 0.45,
                liveness: false,
                message: '❌ Selfie rechazado - Posible ataque',
                details: 'No se detectó liveness, posible foto de foto'
            },
            {
                success: false,
                score: 0.30,
                liveness: false,
                message: '❌ Selfie rechazado - Múltiples rostros',
                details: 'Se detectaron múltiples rostros en la imagen'
            }
        ];

        const result = results[Math.floor(Math.random() * results.length)];
        
        this.debug(`📊 Resultado selfie: Score ${result.score}, Liveness: ${result.liveness}`, 
                   result.success ? 'info' : 'warning');
        
        const statusMessage = `
            ${result.message}<br>
            <small>Score: ${result.score} | Liveness: ${result.liveness ? '✅' : '❌'}</small><br>
            <small>${result.details}</small>
        `;
        
        this.updateStatus('cameraStatus', statusMessage, 
                         result.success ? 'success' : 'error');
    }

    stopCamera() {
        if (this.isCameraActive) {
            this.isCameraActive = false;
            document.getElementById('camera').style.borderColor = '#ddd';
            this.debug('📹 Cámara detenida', 'info');
            this.updateStatus('cameraStatus', 'Cámara detenida', 'info');
        }
    }

    // ========== SECCIÓN DOCUMENTOS ==========
    async scanDocument() {
        const fileInput = document.getElementById('documentInput');
        
        if (!fileInput.files.length) {
            this.debug('⚠️ No se seleccionó ningún documento', 'warning');
            this.updateStatus('documentStatus', 'Selecciona un documento primero', 'warning');
            return;
        }

        const file = fileInput.files[0];
        this.debug(`📄 Procesando documento: ${file.name} (${(file.size/1024).toFixed(2)} KB)`, 'info');
        this.updateStatus('documentStatus', '🔄 Analizando documento...', 'info');

        await this.delay(2000);

        const documentTypes = [
            { type: 'DNI Español', country: 'ES', valid: true },
            { type: 'Pasaporte UE', country: 'EU', valid: true },
            { type: 'Carnet Conducir', country: 'ES', valid: true },
            { type: 'Documento ilegible', country: 'UNKNOWN', valid: false },
            { type: 'Documento caducado', country: 'ES', valid: false }
        ];

        const result = documentTypes[Math.floor(Math.random() * documentTypes.length)];
        
        if (result.valid) {
            this.debug(`✅ Documento válido detectado: ${result.type} (${result.country})`, 'info');
            
            const statusMessage = `
                ✅ Documento válido<br>
                <small>Tipo: ${result.type} | País: ${result.country}</small><br>
                <small>Fecha verificación: ${new Date().toLocaleDateString('es-ES')}</small>
            `;
            
            this.updateStatus('documentStatus', statusMessage, 'success');
        } else {
            this.debug(`❌ Documento inválido: ${result.type}`, 'warning');
            this.updateStatus('documentStatus', 
                `❌ ${result.type}<br><small>Revisa que el documento sea válido y esté en buen estado</small>`, 
                'error'
            );
        }
    }

    // ========== SECCIÓN API ==========
    async simulateVerificationAPI() {
        this.logAPICall('POST', '/api/v1/verify', { document: 'present', selfie: 'present' });
        
        await this.delay(800);
        
        const response = {
            verification_id: `ver_${Date.now()}`,
            status: 'completed',
            score: (0.7 + Math.random() * 0.25).toFixed(2),
            timestamp: new Date().toISOString(),
            details: {
                liveness_detected: true,
                document_valid: true,
                face_match: true
            }
        };
        
        this.logAPIResponse(200, response);
        this.debug(`✅ Verificación completada: ID ${response.verification_id}`, 'info');
    }

    async simulateStatusAPI() {
        this.logAPICall('GET', `/api/v1/status/ver_${Date.now()}`);
        
        await this.delay(500);
        
        const statuses = ['pending', 'processing', 'completed', 'failed'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const response = {
            status: status,
            progress: status === 'completed' ? 100 : Math.floor(Math.random() * 100),
            estimated_completion: status === 'pending' ? '30s' : null
        };
        
        this.logAPIResponse(200, response);
        this.debug(`📊 Estado consultado: ${status} (${response.progress}%)`, 'info');
    }

    async simulateErrorAPI() {
        this.logAPICall('POST', '/api/v1/verify', { test: 'error_scenario' });
        
        await this.delay(600);
        
        const errors = [
            { code: 400, message: 'Bad Request - Parámetros inválidos' },
            { code: 401, message: 'Unauthorized - Token expirado' },
            { code: 429, message: 'Too Many Requests - Rate limit excedido' },
            { code: 500, message: 'Internal Server Error' }
        ];
        
        const error = errors[Math.floor(Math.random() * errors.length)];
        this.logAPIResponse(error.code, { error: error.message }, true);
        this.debug(`❌ Error API ${error.code}: ${error.message}`, 'error');
    }

    // ========== HERRAMIENTAS DEBUG ==========
    async simulateCommonError() {
        const errors = [
            {
                name: 'PERMISSION_DENIED',
                message: 'Usuario denegó permisos de cámara',
                solution: 'Guíe al usuario a habilitar permisos en configuración del navegador'
            },
            {
                name: 'NETWORK_TIMEOUT',
                message: 'Timeout en llamada API (30s)',
                solution: 'Verifique conectividad y reintente con exponential backoff'
            },
            {
                name: 'INVALID_LICENSE',
                message: 'Licencia de SDK inválida o expirada',
                solution: 'Renueve la licencia en el portal Facephi'
            },
            {
                name: 'BROWSER_INCOMPATIBLE',
                message: 'Navegador no soportado (Ej: Safari < 14)',
                solution: 'Actualice navegador o use Chrome/Firefox'
            }
        ];
        
        const error = errors[Math.floor(Math.random() * errors.length)];
        
        this.debug(`🐛 Error simulado: ${error.name}`, 'error');
        this.debug(`💡 Mensaje: ${error.message}`, 'warning');
        this.debug(`🔧 Solución sugerida: ${error.solution}`, 'info');
        
        this.updateStatus('cameraStatus', 
            `🐛 Error ${error.name}: ${error.message}`, 
            'error'
        );
    }

    async testPermissions() {
        this.debug('🔍 Testeando permisos del navegador...', 'info');
        
        const permissions = [
            { name: 'camera', status: 'granted' },
            { name: 'microphone', status: 'prompt' },
            { name: 'geolocation', status: 'denied' }
        ];
        
        permissions.forEach(perm => {
            this.debug(`   ${perm.name}: ${perm.status}`, 
                       perm.status === 'granted' ? 'info' : 
                       perm.status === 'denied' ? 'error' : 'warning');
        });
        
        this.updateStatus('cameraStatus', 
            '🔍 Test permisos completado - Ver consola', 
            'info'
        );
    }

    // ========== UTILIDADES ==========
    updateStatus(elementId, message, type = 'info') {
        const element = document.getElementById(elementId);
        element.innerHTML = message;
        element.className = `status-message status-${type}`;
    }

    logAPICall(method, endpoint, body = null) {
        const logEntry = `
            <div class="api-call">
                <span class="method ${method.toLowerCase()}">${method}</span>
                <span class="endpoint">${endpoint}</span>
                ${body ? `<span class="body">${JSON.stringify(body)}</span>` : ''}
                <span class="time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        
        this.apiLog.innerHTML = logEntry + this.apiLog.innerHTML;
    }

    logAPIResponse(statusCode, data, isError = false) {
        const statusClass = statusCode >= 200 && statusCode < 300 ? 'success' : 'error';
        const icon = isError ? '❌' : '✅';
        
        const logEntry = `
            <div class="api-response ${statusClass}">
                ${icon} <span class="status">${statusCode}</span>
                <span class="data">${JSON.stringify(data, null, 2)}</span>
            </div>
        `;
        
        this.apiLog.innerHTML = logEntry + this.apiLog.innerHTML;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ========== INICIALIZACIÓN ==========
const facephiSDK = new FacephiSDKSimulator();

// Funciones globales para los botones HTML
function startCamera() { facephiSDK.startCamera(); }
function captureSelfie() { facephiSDK.captureSelfie(); }
function stopCamera() { facephiSDK.stopCamera(); }
function scanDocument() { facephiSDK.scanDocument(); }
function simulateVerificationAPI() { facephiSDK.simulateVerificationAPI(); }
function simulateStatusAPI() { facephiSDK.simulateStatusAPI(); }
function simulateErrorAPI() { facephiSDK.simulateErrorAPI(); }
function simulateCommonError() { facephiSDK.simulateCommonError(); }
function testPermissions() { facephiSDK.testPermissions(); }
function clearConsole() { 
    document.getElementById('consoleContent').innerHTML = '';
    facephiSDK.debug('🧹 Consola limpiada', 'info');
}