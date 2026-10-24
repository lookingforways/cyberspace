'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  FileCode2,
  FileUp,
  FlaskConical,
  Globe2,
  KeyRound,
  LockKeyhole,
  Menu,
  Network,
  Play,
  Radar,
  Search,
  ShieldCheck,
  Terminal,
  Wifi,
  X,
} from 'lucide-react'

const modules = [
  { id: 'overview', label: 'Ruta de aprendizaje', icon: BookOpen, tag: 'Inicio' },
  { id: 'medusa', label: 'Medusa', icon: KeyRound, tag: '01' },
  { id: 'nmap', label: 'Nmap y Zenmap', icon: Radar, tag: '02' },
  { id: 'nse', label: 'Nmap Scripting Engine', icon: FileCode2, tag: '03' },
  { id: 'wifi', label: 'Wi‑Fi y Aircrack-ng', icon: Wifi, tag: '04' },
  { id: 'sqli', label: 'SQL Injection', icon: LockKeyhole, tag: '05' },
  { id: 'traffic', label: 'Wireshark / TShark', icon: Activity, tag: '06' },
  { id: 'directory', label: 'BloodHound y AD', icon: Network, tag: '07' },
  { id: 'shodan', label: 'Shodan', icon: Globe2, tag: '08' },
  { id: 'metasploit', label: 'Metasploit', icon: ShieldCheck, tag: '09' },
  { id: 'john', label: 'John the Ripper', icon: KeyRound, tag: '10' },
  { id: 'redteam', label: 'Red team controlado', icon: AlertTriangle, tag: '11' },
  { id: 'flow', label: 'Flujo de pentest', icon: CheckCircle2, tag: '12' },
  { id: 'cases', label: 'Casos de uso', icon: Play, tag: '13' },
]

const toolCards = [
  { title: 'Nmap + Zenmap', text: 'Descubre hosts, puertos y servicios dentro de un alcance autorizado.', icon: Radar, color: 'cyan', module: 'nmap' },
  { title: 'Aircrack-ng', text: 'Comprende la seguridad Wi‑Fi y el handshake en un entorno propio.', icon: Wifi, color: 'amber', module: 'wifi' },
  { title: 'SQL Injection', text: 'Analiza una vulnerabilidad de autenticación y cómo corregirla.', icon: LockKeyhole, color: 'violet', module: 'sqli' },
  { title: 'Wireshark', text: 'Filtra tráfico y encuentra señales que requieren investigación.', icon: Activity, color: 'green', module: 'traffic' },
]

const commands = {
  nmap: ['nmap -sn {objetivo}', 'nmap -Pn {objetivo}', 'nmap -PR {objetivo}', 'sudo nmap -sS {objetivo}', 'nmap -sT {objetivo}', 'sudo nmap -sU {objetivo}', 'nmap -sN {objetivo}', 'nmap -sF {objetivo}', 'nmap -sX {objetivo}', 'nmap -p {puertos} {objetivo}', 'nmap -p- {objetivo}', 'nmap --top-ports 100 {objetivo}', 'nmap -sV {objetivo}', 'sudo nmap -O {objetivo}', 'sudo nmap -A {objetivo}', 'nmap -sC {objetivo}', 'nmap --script vuln {objetivo}', 'nmap --script smb-vuln-ms17-010 -p445 {objetivo}', 'nmap --script ftp-anon -p21 {objetivo}', 'nmap -oA informe {objetivo}', 'nmap -T4 {objetivo}', 'zenmap', 'zenmap --target {objetivo}'],
  wifi: ['airmon-ng check kill', 'airmon-ng start {interfaz}', 'iw dev', 'iwconfig', 'airodump-ng {interfaz_monitor}', 'airodump-ng --bssid {BSSID} --channel {canal} --write {captura} {interfaz_monitor}', 'aireplay-ng --deauth 0 -a {BSSID} {interfaz_monitor}', 'aircrack-ng {captura}-01.cap', 'aircrack-ng -w wordlist.txt {captura}-01.cap', 'airmon-ng stop {interfaz_monitor}', 'systemctl restart NetworkManager', 'wireshark {captura}.cap'],
  traffic: ['tshark -D', 'tshark -r {captura}.pcapng -Y "{filtro}"', 'tshark -i3 -w captura.pcapng', 'tshark -i3 -f "tcp port 80" -w web.pcapng', 'tshark -i3 -a duration:60 -w sesion.pcapng', 'tshark -i3 -a files:6 -b duration:30 -w cap.pcapng', 'tshark -qz io,phs', 'tshark -qz hosts', 'tshark -qz conv,tcp', 'tshark -qz expert,warns', 'tshark -r {captura}.pcapng -Y "dns" -T fields -e dns.qry.name', 'tshark -r {captura}.pcapng -Y "http.request" -T fields -e ip.src -e http.host -e http.request.uri', 'tshark -r {captura}.pcapng -Y "tcp.flags.syn==1 && tcp.flags.ack==0"', 'tshark -r {captura}.pcapng -z endpoints,ip', 'tshark -r {captura}.pcapng -z statistics,ip_hosts', 'dumpcap -D', 'dumpcap -i3 -c {paquetes} -w captura.pcapng'],
}

const commandPurpose = (command: string) => {
  const normalized = command.trim()
  const name = normalized.split(/\s+/)[0]
  const specificPurposes: Array<[string, string]> = [
    ['nmap -sn', 'Descubrimiento de hosts: identifica qué equipos responden sin hacer detección de servicios.'],
    ['nmap -Pn', 'Omite el ping previo y trata el objetivo como activo; útil cuando el firewall bloquea ICMP.'],
    ['nmap -PR', 'Descubre hosts mediante solicitudes ARP en una red Ethernet local.'],
    ['nmap -sS', 'Realiza un SYN scan para revisar puertos TCP con menor interacción que una conexión completa.'],
    ['nmap -sT', 'Realiza un TCP connect scan usando la conexión completa del sistema operativo.'],
    ['nmap -sU', 'Revisa puertos UDP, que suelen requerir más tiempo y pueden producir respuestas ambiguas.'],
    ['nmap -sN', 'Envía paquetes TCP NULL para estudiar respuestas de filtrado; úsalo solo en laboratorio.'],
    ['nmap -sF', 'Envía paquetes FIN para observar el comportamiento del filtrado TCP.'],
    ['nmap -sX', 'Envía paquetes Xmas con varias banderas TCP activas para analizar respuestas del objetivo.'],
    ['nmap -p-', 'Examina todos los puertos TCP en lugar de limitarse a los puertos comunes.'],
    ['nmap -p ', 'Examina únicamente los puertos indicados, reduciendo ruido y tiempo de la prueba.'],
    ['--top-ports', 'Revisa los puertos más frecuentes para obtener una primera visión rápida del servicio expuesto.'],
    ['nmap -sV', 'Detecta versiones de los servicios que escuchan en los puertos encontrados.'],
    ['nmap -O', 'Intenta identificar el sistema operativo mediante huellas de red; puede requerir privilegios.'],
    ['nmap -A', 'Activa varias detecciones avanzadas; genera más tráfico y debe reservarse para un alcance aprobado.'],
    ['nmap -sC', 'Ejecuta los scripts NSE predeterminados para recopilar información común del servicio.'],
    ['--script vuln', 'Ejecuta comprobaciones NSE relacionadas con vulnerabilidades conocidas; valida el impacto antes de usarlo.'],
    ['--script smb-vuln', 'Comprueba una condición SMB específica en el puerto 445 sin explotar el sistema.'],
    ['--script ftp-anon', 'Verifica si un servidor FTP permite acceso anónimo en el laboratorio.'],
    ['nmap -oA', 'Guarda resultados en formatos normal, XML y grepable para documentar y correlacionar evidencia.'],
    ['nmap -T4', 'Aumenta la velocidad del escaneo; úsalo solo cuando el alcance soporte más tráfico.'],
    ['zenmap --target', 'Abre Zenmap con un objetivo precargado para ejecutar un perfil gráfico autorizado.'],
    ['zenmap', 'Abre la interfaz gráfica de Nmap para seleccionar perfiles, revisar resultados y guardar la sesión.'],
    ['tshark -D', 'Lista interfaces disponibles para elegir la captura correcta.'],
    ['tshark -r', 'Lee un PCAP existente sin generar tráfico adicional sobre la red.'],
    ['tshark -i', 'Captura tráfico desde una interfaz indicada; limita la duración y usa una red propia.'],
    ['tshark -qz io,phs', 'Resume jerarquía de protocolos y volumen para orientar el análisis.'],
    ['tshark -qz conv,tcp', 'Muestra conversaciones TCP y ayuda a priorizar conexiones relevantes.'],
    ['tshark -qz endpoints', 'Resume endpoints observados para construir un inventario de comunicaciones.'],
    ['dumpcap', 'Captura paquetes con menor sobrecarga para conservar evidencia defensiva.'],
  ]
  const specific = specificPurposes.find(([prefix]) => normalized.startsWith(prefix))
  if (specific) return specific[1]
  const purposes: Record<string, string> = {
    nmap: 'Escanea hosts, puertos o servicios dentro del alcance autorizado.',
    zenmap: 'Abre la interfaz gráfica de Nmap para crear perfiles, visualizar resultados y guardar sesiones del laboratorio.',
    sudo: 'Ejecuta una revisión que requiere privilegios; úsala solo en tu laboratorio.',
    'airmon-ng': 'Gestiona el modo monitor de una interfaz Wi-Fi propia.',
    'airodump-ng': 'Observa redes y captura evidencia del AP autorizado.',
    'aircrack-ng': 'Analiza una captura Wi-Fi de laboratorio con una lista de prueba.',
    tshark: 'Captura o filtra tráfico desde un archivo o interfaz autorizada.',
    dumpcap: 'Realiza capturas de paquetes para análisis defensivo.',
    medusa: 'Audita autenticación con cuentas sintéticas y límites controlados.',
    'bloodhound-python': 'Recolecta relaciones de Active Directory para detectar rutas de privilegio.',
    shodan: 'Consulta información pública únicamente de activos propios.',
    msfconsole: 'Abre Metasploit para estudiar módulos en una VM intencionalmente vulnerable.',
    search: 'Busca módulos documentados antes de seleccionar una prueba.',
    info: 'Muestra la documentación y el comportamiento esperado del módulo.',
    use: 'Selecciona un módulo para configurarlo sin ejecutarlo todavía.',
    set: 'Define un parámetro del laboratorio; verifica siempre el alcance.',
    check: 'Comprueba disponibilidad sin lanzar una explotación.',
    john: 'Audita hashes sintéticos para medir la resistencia de contraseñas.',
    sha256sum: 'Calcula un hash para preservar la integridad de la evidencia.',
    curl: 'Realiza una solicitud HTTP controlada para observar respuestas.',
    sqlmap: 'Valida una lección de SQLi en una aplicación intencionalmente vulnerable.',
    openssl: 'Inspecciona certificados y configuración TLS del servicio autorizado.',
    dig: 'Consulta registros DNS dentro del dominio permitido.',
    grep: 'Filtra texto para localizar indicadores en evidencia o logs.',
  }
  return purposes[name] ?? 'Ejecuta este paso únicamente en el entorno autorizado indicado por el laboratorio.'
}

const commandSections: Record<string, [string, string][]> = {
  medusa: [['medusa -d', 'Lista módulos disponibles'], ['medusa -h {IP_LAB}', 'Consulta ayuda del objetivo autorizado'], ['medusa -U usuarios-lab.txt -P claves-lab.txt -h {IP_LAB} -M ssh', 'Auditoría controlada en una VM propia'], ['medusa -u {USUARIO_LAB} -p {CLAVE_LAB} -h {IP_LAB} -M ftp', 'Prueba sintética contra servicio de laboratorio']],
  nse: [['nmap --script-help "*"', 'Consulta scripts NSE instalados'], ['nmap --script-help http-title', 'Revisa documentación de un script'], ['nmap --script-help --script-args', 'Consulta argumentos admitidos por los scripts instalados'], ['nmap -Pn -sV --script http-title,http-headers {IP_LAB}', 'Recolecta metadatos de una app propia'], ['nmap -Pn --script http-methods --script-args http-methods.url-path=/ {IP_LAB}', 'Observa métodos HTTP publicados en una ruta de laboratorio'], ['nmap -Pn --script ssl-cert -p443 {IP_LAB}', 'Inspecciona certificado TLS sin autenticarse'], ['nmap -Pn --script vuln --script-args=unsafe=0 {IP_LAB}', 'Revisión no intrusiva en laboratorio'], ['nmap --script-updatedb', 'Actualiza el índice local de scripts']],
  bloodhound: [['bloodhound-python --help', 'Consulta opciones sin conectarte'], ['nmap -Pn -p53,88,389,445,636 {IP_DC} -oA dc-inventory', 'Identifica servicios del DC autorizado'], ['bloodhound-python -u {USUARIO_LAB} -p {CLAVE_LAB} -ns {IP_DC} -d {DOMINIO_LAB} -c Group,Session,ACL', 'Recolecta relaciones del dominio de práctica'], ['sha256sum *.json > bloodhound-evidence.sha256', 'Preserva integridad de la evidencia']],
  shodan: [['shodan version', 'Confirma la versión del cliente'], ['shodan info', 'Comprueba el estado de autenticación local'], ['shodan search --fields ip_str,port,org "hostname:{DOMINIO_PROPIO}"', 'Consulta solo activos propios publicados'], ['shodan host {IP_PROPIA}', 'Revisa el banner de un activo autorizado']],
  metasploit: [['msfconsole -q', 'Abre el framework en una VM de práctica'], ['search type:auxiliary name:scanner', 'Busca módulos de reconocimiento'], ['info auxiliary/scanner/http/http_version', 'Lee documentación antes de ejecutar'], ['use auxiliary/scanner/http/http_version', 'Selecciona un módulo no destructivo'], ['set RHOSTS {IP_LAB}', 'Define únicamente el objetivo autorizado'], ['check', 'Valida disponibilidad sin explotación']],
  john: [['john --list=formats', 'Consulta formatos disponibles'], ['john --status', 'Revisa una sesión activa'], ['john --show hashes-lab.txt', 'Muestra resultados de hashes propios'], ['john --wordlist=lab-wordlist.txt hashes-lab.txt', 'Audita contraseñas sintéticas'], ['sha256sum hashes-lab.txt > integridad.txt', 'Preserva la evidencia']],
}



function CommandTable({ id }: { id: string }) {
  const rows = commandSections[id]
  if (!rows) return null
  return <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-5"><div className="mb-4 flex items-center gap-3"><Terminal className="size-5 text-cyan-300" /><div><h3 className="font-semibold text-white">Catálogo completo de comandos</h3><p className="text-xs text-slate-500">Referencia educativa para entornos autorizados</p></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><th className="px-3 py-3">Comando</th><th className="px-3 py-3">Uso</th></tr></thead><tbody>{rows.map(([command, use]) => <tr key={command} className="border-b border-white/5"><td className="px-3 py-3"><div className="flex items-start gap-2"><code className="min-w-0 flex-1 break-all text-cyan-100">{command}</code><button type="button" className="copy-button shrink-0" aria-label={`Copiar ${command}`} onClick={() => navigator.clipboard?.writeText(command)}><Clipboard className="size-3" /> Copiar</button></div></td><td className="px-3 py-3 text-slate-400"><span>{use}</span><span className="mt-1 block text-xs text-cyan-200/70">¿Para qué sirve? {commandPurpose(command)}</span></td></tr>)}</tbody></table></div></div>
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-slate-400">{description}</p>
    </div>
  )
}

function Lab({ type }: { type: 'nmap' | 'wifi' | 'traffic' }) {
  const [target, setTarget] = useState('192.168.1.0/24')
  const [ports, setPorts] = useState('22,80,443')
  const [interfaceName, setInterfaceName] = useState('wlan0')
  const [filter, setFilter] = useState('dns')
  const [ran, setRan] = useState(false)
  const field = type === 'nmap' ? target : type === 'wifi' ? interfaceName : filter
  const setField = type === 'nmap' ? setTarget : type === 'wifi' ? setInterfaceName : setFilter
  const generated = commands[type].map((command) => command
    .replace('{objetivo}', target)
    .replace('{puertos}', ports)
    .replace('{interfaz}', interfaceName)
    .replace('{interfaz_monitor}', `${interfaceName}mon`)
    .replace('{captura}', 'laboratorio')
    .replace('{filtro}', filter)
    .replace('{paquetes}', '2000'))

  return (
    <div className="lab-panel mt-8 overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300"><FlaskConical /></span><div><p className="font-medium text-white">Laboratorio guiado</p><p className="text-xs text-slate-500">Simulador local · no ejecuta comandos reales</p></div></div>
        <span className="status-dot"><span /> Entorno seguro</span>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field-label">{type === 'nmap' ? 'Objetivo autorizado' : type === 'wifi' ? 'Interfaz Wi���Fi' : 'Filtro de visualización'}
              <input className="lab-input" value={field} onChange={(e) => setField(e.target.value)} placeholder="Escribe aquí…" />
            </label>
            {type === 'nmap' && <label className="field-label">Puertos a observar<input className="lab-input" value={ports} onChange={(e) => setPorts(e.target.value)} /></label>}
          </div>
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-100"><AlertTriangle className="mr-2 inline size-4 text-amber-300" /> Usa únicamente equipos, redes y capturas propias o con autorización explícita.</div>
          <button className="primary-button" onClick={() => setRan(true)}><Play data-icon="inline-start" /> Generar práctica segura</button>
          {ran && <div className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 className="size-4" /> Parámetros validados para el laboratorio local.</div>}
        </div>
        <div className="rounded-xl border border-white/10 bg-[#07101e] p-4">
          <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><BookOpen className="size-4 text-cyan-300" /><h3 className="text-sm font-semibold text-white">Biblioteca de comandos</h3></div><span className="text-xs text-slate-500">Copia individual</span></div>
          <p className="mt-2 text-xs leading-5 text-slate-500">Cada tarjeta explica el propósito y copia únicamente el comando seleccionado. No se ejecuta nada.</p>
          <div className="mt-4 grid gap-2">{generated.map((command) => <div key={command} className="rounded-lg border border-white/5 bg-white/[0.025] p-3"><div className="flex items-start gap-2"><code className="min-w-0 flex-1 break-all text-xs leading-5 text-cyan-100">{command}</code><button type="button" className="copy-button shrink-0" aria-label={`Copiar ${command}`} onClick={() => navigator.clipboard?.writeText(command)}><Clipboard className="size-3" /> Copiar</button></div><p className="mt-2 text-xs leading-5 text-slate-400">{commandPurpose(command)}</p></div>)}</div>
        </div>
      </div>
    </div>
  )
}

function Overview({ onOpen }: { onOpen: (id: string) => void }) {
  return <>
    <SectionTitle eyebrow="CYBERLAB · AULA VIRTUAL" title="Aprende a investigar. Practica con criterio." description="Un espacio de aprendizaje segmentado para comprender reconocimiento, redes, vulnerabilidades y defensa. Personaliza cada laboratorio con tus propios datos, sin salir del entorno seguro." />
    <div className="grid gap-4 md:grid-cols-3"><div className="metric-card"><span>10</span><p>Módulos prácticos</p></div><div className="metric-card"><span>100+</span><p>Comandos documentados</p></div><div className="metric-card"><span>100%</span><p>Enfoque defensivo</p></div></div>
    <div className="mt-10 flex items-center justify-between"><div><p className="eyebrow">Explorar contenido</p><h2 className="mt-2 text-2xl font-semibold text-white">Herramientas esenciales</h2></div><span className="hidden text-sm text-slate-500 md:block">Selecciona un módulo para comenzar</span></div>
    <div className="mt-5 grid gap-4 md:grid-cols-2">{toolCards.map((card) => { const Icon = card.icon; return <button key={card.title} className="tool-card text-left" onClick={() => onOpen(card.module)}><div className={`tool-icon ${card.color}`}><Icon /></div><div className="flex-1"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-white">{card.title}</h3><ArrowRight className="size-4 text-slate-600" /></div><p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p></div></button> })}</div>
    <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-transparent p-6"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 size-6 text-cyan-300" /><div><h3 className="font-semibold text-white">Regla de oro del aula</h3><p className="mt-1 text-sm leading-6 text-slate-400">Toda práctica debe tener alcance definido, autorización y un objetivo documentado. La ciberseguridad profesional empieza antes del primer comando.</p></div></div></div>
  </>
}

function TryHackMeFlow() {
  const steps = [
    ['01', 'Define la sala y el alcance', 'Selecciona una sala oficial y trabaja solo con la IP privada entregada por la VPN.'],
    ['02', 'Conecta y verifica', 'Conecta la VPN, confirma tu interfaz y valida conectividad sin tocar objetivos externos.'],
    ['03', 'Enumera con cuidado', 'Empieza con ping, puertos comunes y detección de versiones; documenta cada comando.'],
    ['04', 'Valida la lección', 'Usa únicamente las técnicas indicadas por la sala y detente cuando obtengas la evidencia solicitada.'],
    ['05', 'Reporta y restablece', 'Guarda capturas, hallazgos y mitigaciones; desconecta la VPN y elimina credenciales temporales.'],
  ]
  return <div className="mt-8 space-y-5"><div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5"><div className="flex items-start gap-4"><BookOpen className="mt-1 size-5 text-cyan-300" /><div><h3 className="font-semibold text-white">Flujo seguro para TryHackMe</h3><p className="mt-2 text-sm leading-6 text-slate-400">Este recorrido conecta cada comando con una práctica de aprendizaje. La plataforma proporciona el objetivo y la autorización; no reutilices estas técnicas fuera de la sala.</p></div></div></div><div className="grid gap-3 md:grid-cols-5">{steps.map(([number, title, text]) => <div key={number} className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><span className="font-mono text-xs text-cyan-300">{number}</span><h4 className="mt-3 text-sm font-semibold text-white">{title}</h4><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></div>)}</div><div className="grid gap-4 md:grid-cols-2"><div className="info-block"><Terminal className="size-5 text-cyan-300" /><h3>Kit de verificación inicial</h3><pre className="mt-4 overflow-x-auto text-xs leading-6 text-cyan-100"><code>{`ip addr show\nip route\nping -c 3 {IP_TARGET}\nnmap -Pn -p 22,80,443 {IP_TARGET}\nnmap -sV --version-light {IP_TARGET}`}</code></pre></div><div className="info-block"><ShieldCheck className="size-5 text-cyan-300" /><h3>Casos de uso por sala</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400"><li>Reconocimiento: identifica servicios y registra versiones.</li><li>Web: revisa rutas y respuestas sin automatización agresiva.</li><li>Blue team: captura tráfico, crea filtros y explica la evidencia.</li><li>Windows/AD: relaciona usuarios, grupos y privilegios en el dominio de práctica.</li></ul></div></div></div>
}

function UseCases() {
  const cases = [
    { title: 'Reconocimiento inicial en TryHackMe', level: 'Fundamental', goal: 'Identificar superficie expuesta sin lanzar acciones intrusivas.', commands: ['export TARGET={IP_TARGET}', 'ip addr show && ip route', 'ping -c 3 $TARGET', 'nmap -Pn --top-ports 100 -sV --version-light $TARGET', 'nmap -Pn -p- --min-rate 500 $TARGET -oA recon-full'], evidence: 'IP, latencia, puertos abiertos, versiones y archivo recon-full.nmap.' },
    { title: 'Enumeración web controlada', level: 'Intermedio', goal: 'Relacionar puertos web con tecnologías, rutas y controles observables.', commands: ['export WEB=http://{IP_TARGET}', 'curl -I $WEB', 'whatweb $WEB', 'nmap -p80,443 --script http-title,http-headers,http-methods $TARGET', 'ffuf -u $WEB/FUZZ -w /usr/share/wordlists/dirb/common.txt -t 10 -fc 404'], evidence: 'Cabeceras, título, métodos permitidos y rutas encontradas; no fuerces autenticación.' },
    { title: 'Clasificación de hallazgos', level: 'Defensivo', goal: 'Convertir observaciones técnicas en hallazgos reproducibles, priorizados y accionables.', commands: ['date -u | tee assessment-start.txt', 'nmap -Pn -sV --version-light {IP_TARGET} -oA evidence/initial-scan', 'sha256sum evidence/initial-scan.* > evidence/hashes.txt', 'grep -Ei "(critical|high|medium|low|cve|exposed|warning)" findings.txt', 'printf "Hallazgo | Evidencia | Impacto | Corrección | Retest\\n" > report-template.csv'], evidence: 'Activo afectado, evidencia mínima, impacto para el negocio, severidad justificada, recomendación y prueba de retest.' },
    { title: 'Reconocimiento y superficie de ataque', level: 'Fundamental', goal: 'Crear un inventario de activos autorizados y separar lo observado de lo confirmado.', commands: ['export SCOPE={CIDR_AUTORIZADO}', 'nmap -sn $SCOPE -oA evidence/host-discovery', 'nmap -Pn --top-ports 20 -sV --version-light $SCOPE -oA evidence/service-inventory', 'awk \'/Up$/{print $2}\' evidence/host-discovery.gnmap > evidence/live-hosts.txt', 'sha256sum evidence/* > evidence/inventory-hashes.txt'], evidence: 'Alcance firmado, hosts activos, servicios, timestamp, origen de cada dato y activos excluidos del ejercicio.' },
    { title: 'Análisis de una captura', level: 'Defensivo', goal: 'Detectar DNS, sesiones TCP y señales anómalas desde un PCAP entregado por la sala.', commands: ['tshark -r captura.pcapng -qz io,phs', 'tshark -r captura.pcapng -Y "dns" -T fields -e frame.time -e ip.src -e dns.qry.name', 'tshark -r captura.pcapng -qz conv,tcp', 'tshark -r captura.pcapng -Y "http.request" -T fields -e ip.src -e http.host -e http.request.uri'], evidence: 'Dominios consultados, conversaciones relevantes, timestamps y filtro usado.' },
    { title: 'Revisión de Active Directory', level: 'Avanzado', goal: 'Visualizar rutas de privilegio y proponer hardening, sin modificar el dominio.', commands: ['export DC={IP_DC}', 'ip route get $DC', 'nmap -Pn -p53,88,135,139,389,445,464,636,3268 $DC', 'bloodhound-python -u {USUARIO} -p {PASSWORD} -ns $DC -d {DOMINIO} -c Group,Session,ACL'], evidence: 'Relaciones de grupos, sesiones y ACL; redacta una mitigación por cada ruta crítica.' },
    { title: 'Validación de una vulnerabilidad web', level: 'Avanzado', goal: 'Reproducir una lección de SQLi en una aplicación intencionalmente vulnerable y explicar la corrección.', commands: ['curl -sS -D headers.txt $WEB/login', 'sqlmap -u "$WEB/login?id=1" --batch --risk=1 --level=1 --technique=B --current-db', 'grep -Ei "server|content-security|x-frame" headers.txt', 'docker compose logs --tail=100 web'], evidence: 'Solicitud autorizada, evidencia mínima, impacto y consulta parametrizada propuesta. Nunca uses --dump en cuentas reales.' },
    { title: 'Enumeración de servicios SMB', level: 'Intermedio', goal: 'Documentar recursos compartidos y configuración visible en una máquina Windows de la sala.', commands: ['export TARGET={IP_TARGET}', 'nmap -Pn -p139,445 --script smb-protocols,smb-security-mode $TARGET', 'smbclient -L //$TARGET -N', 'enum4linux-ng -A $TARGET', 'smbmap -H $TARGET -u {USUARIO} -p {PASSWORD}'], evidence: 'Versión SMB, recursos publicados, permisos observables y recomendación de segmentación.' },
    { title: 'Análisis de DNS y subdominios', level: 'Intermedio', goal: 'Construir un inventario pasivo de resolución DNS dentro del alcance definido por la sala.', commands: ['export DOMAIN={DOMINIO}', 'dig $DOMAIN A +short', 'dig $DOMAIN MX +short', 'dig @{DNS_SERVER} $DOMAIN ANY', 'dnsrecon -d $DOMAIN -t std', 'host -a $DOMAIN'], evidence: 'Registros consultados, servidor DNS, dominios encontrados y límites del alcance.' },
    { title: 'Checklist de hardening Linux', level: 'Defensivo', goal: 'Revisar una VM propia y convertir hallazgos técnicos en acciones de reducción de riesgo.', commands: ['uname -a && hostnamectl', 'ss -tulpn', 'sudo systemctl --type=service --state=running', 'sudo find / -xdev -perm -4000 -type f 2>/dev/null', 'sudo journalctl -p warning -n 50', 'sudo lynis audit system --quick'], evidence: 'Servicios expuestos, binarios SUID, advertencias y tres mitigaciones priorizadas.' },
    { title: 'Auditoría segura de SSH', level: 'Defensivo', goal: 'Revisar la postura de un servidor SSH propio sin probar credenciales ni alterar la configuración.', commands: ['export TARGET={IP_TARGET}', 'nmap -Pn -p22 --script ssh2-enum-algos,ssh-hostkey $TARGET', 'ssh-keyscan -T 5 $TARGET > ssh-hostkey.txt', 'sudo sshd -T | tee ssh-effective-config.txt', 'grep -Ei "permitrootlogin|passwordauthentication|pubkeyauthentication" ssh-effective-config.txt'], evidence: 'Algoritmos anunciados, huella de clave, configuración efectiva y controles recomendados.' },
    { title: 'Inventario de certificados TLS', level: 'Intermedio', goal: 'Identificar problemas de vigencia y configuración TLS en un servicio web del laboratorio.', commands: ['export WEB={URL_AUTORIZADA}', 'curl -sS -I $WEB', 'openssl s_client -connect {HOST}:443 -servername {HOST} </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates', 'nmap -Pn -p443 --script ssl-cert,ssl-enum-ciphers {HOST}', 'curl -sS -o /dev/null -w "%{http_code} %{remote_ip} %{time_total}\\n" $WEB'], evidence: 'Emisor, fechas, protocolos, suites observadas y acciones de renovación o endurecimiento.' },
    { title: 'Triaging de logs web', level: 'Defensivo', goal: 'Priorizar eventos anómalos en registros de una aplicación de práctica antes de redactar el informe.', commands: ['export LOG=access.log', 'wc -l $LOG && tail -n 20 $LOG', 'awk \'{print $1}\' $LOG | sort | uniq -c | sort -nr | head', 'grep -Ei "(401|403|404|500)" $LOG | tail -n 50', 'grep -Ei "(union|select|script|../|/etc/passwd)" $LOG | tee indicadores.txt', 'sha256sum $LOG > $LOG.sha256'], evidence: 'IPs o sesiones priorizadas, códigos de respuesta, indicadores y hash de integridad del archivo.' },
    { title: 'Revisión de reglas de firewall', level: 'Defensivo', goal: 'Comparar los puertos permitidos de una VM con su política esperada y detectar exposición innecesaria.', commands: ['sudo ufw status verbose', 'sudo nft list ruleset > firewall-rules.txt', 'sudo iptables -S > iptables-rules.txt', 'ss -lntup', 'nmap -Pn -p {PUERTOS_ESPERADOS} {IP_TARGET}', 'diff -u expected-services.txt firewall-rules.txt'], evidence: 'Reglas activas, servicios escuchando, diferencias con la política y propuesta de mínimo privilegio.' },
    { title: 'Forense básica de archivos', level: 'Avanzado', goal: 'Preservar y revisar artefactos de una VM entregada por el docente sin modificar la evidencia original.', commands: ['sha256sum evidencia.img > evidencia.img.sha256', 'file evidencia.img', 'sudo mmls evidencia.img', 'fls -r -m / evidencia.img > filesystem.body', 'grep -Ei "(ssh|bash_history|cron|tmp|suspicious)" filesystem.body | head -n 100', 'date -u && sha256sum evidencia.img'], evidence: 'Hash original, sistema de archivos identificado, artefactos relevantes y línea temporal preliminar.' },
    { title: 'Validación de controles de backup', level: 'Defensivo', goal: 'Comprobar que una copia de laboratorio puede verificarse y restaurarse sin exponer datos reales.', commands: ['sha256sum backup.tar.gz > backup.sha256', 'sha256sum -c backup.sha256', 'tar -tzf backup.tar.gz | head -n 50', 'tar -tzf backup.tar.gz | grep -Ei "(secret|password|\.env|key)"', 'tar -xzf backup.tar.gz -C restore-test --no-same-owner', 'find restore-test -type f -maxdepth 3 -print'], evidence: 'Integridad, contenido inesperado, resultado de restauración y recomendaciones de protección.' },
  ]
  const [selectedCase, setSelectedCase] = useState(0)
  const [step, setStep] = useState(0)
  const [customCommands, setCustomCommands] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const current = cases[selectedCase]
  const commandKey = `${selectedCase}-${step}`
  const activeCommand = customCommands[commandKey] ?? current.commands[step]
  const isLast = step === current.commands.length - 1
  const next = () => { setSaved(false); setStep((value) => isLast ? 0 : value + 1) }
  const updateCommand = (value: string) => { setSaved(false); setCustomCommands((previous) => ({ ...previous, [commandKey]: value })) }
  const resetCommand = () => { setSaved(false); setCustomCommands((previous) => { const next = { ...previous }; delete next[commandKey]; return next }) }
  return <><SectionTitle eyebrow="MÓDULO 11 · PLAYBOOKS" title="Casos de uso paso a paso" description="Trabaja un escenario a la vez. Selecciona un caso, completa cada paso y registra la evidencia antes de continuar. Sustituye únicamente los valores entre llaves por los datos de tu sala TryHackMe o laboratorio local." /><div className="case-selector" role="tablist" aria-label="Seleccionar caso de uso">{cases.map((item, index) => <button key={item.title} role="tab" aria-selected={selectedCase === index} className={`case-tab ${selectedCase === index ? 'active' : ''}`} onClick={() => { setSelectedCase(index); setStep(0) }}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><small>{item.level}</small></button>)}</div><article className="case-workbench"><div className="mb-6 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Command workspace</p><p className="mt-1 text-sm text-slate-400">Personaliza variables, límites y rutas para tu sala. El laboratorio no ejecuta comandos.</p></div><div className="flex items-center gap-2"><button className="copy-button" onClick={resetCommand}>Restaurar paso</button><button className="copy-button" onClick={() => setSaved(true)}><CheckCircle2 /> Guardar borrador</button></div></div><p className="mt-3 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.04] px-3 py-2 text-sm leading-6 text-cyan-100/80"><strong className="text-cyan-200">¿Para qué sirve?</strong> {commandPurpose(activeCommand)}</p><div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500"><span className="variable-chip">{`{IP_TARGET}`}</span><span className="variable-chip">{`{DOMINIO}`}</span><span className="variable-chip">{`{USUARIO}`}</span><span className="variable-chip">{`{ARCHIVO}`}</span>{saved && <span className="text-emerald-300">Borrador guardado en esta sesión.</span>}</div></div><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Caso {String(selectedCase + 1).padStart(2, '0')} · Paso {String(step + 1).padStart(2, '0')} de {current.commands.length}</p><h2 className="mt-2 text-2xl font-semibold text-white">{current.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{current.goal}</p></div><span className="case-level">{current.level}</span></div><div className="mt-7 flex items-center gap-2" aria-label="Progreso del caso">{current.commands.map((_, index) => <span key={index} className={`step-progress ${index <= step ? 'done' : ''}`} />)}</div><div className="mt-7 grid gap-6 lg:grid-cols-[1fr_280px]"><div><div className="step-panel"><div className="flex items-center justify-between gap-3"><span className="step-kicker">Paso {String(step + 1).padStart(2, '0')}</span><button className="copy-button" onClick={() => navigator.clipboard?.writeText(current.commands[step])}><Clipboard /> Copiar comando</button></div><p className="mt-4 text-sm text-slate-400">Ejecuta este comando únicamente dentro de la sala autorizada y observa la salida antes de avanzar.</p><code className="command-focus mt-5 block">{current.commands[step]}</code><div className="mt-5 flex flex-wrap gap-3"><button className="primary-button" onClick={next}>{isLast ? 'Reiniciar caso' : 'Marcar paso y continuar'} <ArrowRight data-icon="inline-end" /></button>{step > 0 && <button className="secondary-button" onClick={() => setStep((value) => value - 1)}>Paso anterior</button>}</div></div><div className="case-evidence mt-4"><strong>Evidencia esperada al finalizar</strong><p>{current.evidence}</p></div></div><aside className="step-sidebar"><p className="eyebrow">Checklist</p><ol>{current.commands.map((command, index) => <li key={command} className={index === step ? 'current' : index < step ? 'complete' : ''}><span>{index < step ? '✓' : String(index + 1).padStart(2, '0')}</span><p> Paso {index + 1}<small>{index === step ? 'En curso' : index < step ? 'Completado' : 'Pendiente'}</small></p></li>)}</ol></aside></div></article><div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-6 text-amber-100"><AlertTriangle className="mr-2 inline size-4 text-amber-300" /> Antes de ejecutar: confirma que la IP pertenece a la sala, limita la velocidad, registra hora y comando, y detente si la instrucción de TryHackMe no solicita el siguiente paso.</div></>
}

function WifiGuide() {
  const [ap, setAp] = useState('AA:BB:CC:DD:EE:FF')
  const [channel, setChannel] = useState('6')
  const [capture, setCapture] = useState('wifi-lab')
  const [command, setCommand] = useState('airodump-ng --bssid {BSSID} --channel {CANAL} --write {CAPTURA} {INTERFAZ_MONITOR}')
  const rendered = command.replaceAll('{BSSID}', ap).replaceAll('{CANAL}', channel).replaceAll('{CAPTURA}', capture).replaceAll('{INTERFAZ_MONITOR}', 'wlan0mon')
  return <div className="mt-8 space-y-5">
    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-1 size-5 shrink-0 text-amber-300" /><div><h3 className="font-semibold text-amber-100">Antes de comenzar: alcance y autorización</h3><p className="mt-2 text-sm leading-6 text-amber-100/70">Este módulo es para un punto de acceso propio, una tarjeta Wi‑Fi compatible y una sala autorizada. No captures tráfico de terceros, no interrumpas redes y no uses listas de contraseñas fuera de una práctica diseñada para ello. En TryHackMe, utiliza exclusivamente la interfaz y el objetivo proporcionados por la sala.</p></div></div></div>
    <div className="grid gap-4 md:grid-cols-3"><div className="info-block"><span className="step-kicker">01 · Preparar</span><h3>Verifica el adaptador</h3><p>Confirma que la interfaz existe, identifica su nombre y detén temporalmente los procesos que puedan interferir con el modo monitor.</p><code className="command-note">iw dev<br />airmon-ng check</code></div><div className="info-block"><span className="step-kicker">02 · Observar</span><h3>Encuentra tu AP</h3><p>Observa el canal y BSSID de tu laboratorio. No envíes paquetes todavía: primero valida que el objetivo sea el correcto.</p><code className="command-note">airmon-ng start wlan0<br />airodump-ng wlan0mon</code></div><div className="info-block"><span className="step-kicker">03 · Analizar</span><h3>Preserva evidencia</h3><p>Guarda la captura con un nombre identificable, registra fecha, canal, BSSID y objetivo. El análisis debe ser reproducible.</p><code className="command-note">aircrack-ng -w lab-wordlist.txt {capture}-01.cap</code></div></div>
    <div className="lab-panel overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-950/70"><div className="border-b border-white/10 px-5 py-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Constructor de comando</p><p className="mt-1 text-sm text-slate-400">Completa únicamente los datos de tu AP autorizado. El resultado es una referencia editable; Cyberlab no ejecuta comandos.</p></div><div className="grid gap-5 p-5 lg:grid-cols-[0.9fr_1.1fr]"><div className="grid gap-4 sm:grid-cols-3"><label className="field-label">BSSID<input className="lab-input" value={ap} onChange={(e) => setAp(e.target.value)} /></label><label className="field-label">Canal<input className="lab-input" value={channel} onChange={(e) => setChannel(e.target.value)} /></label><label className="field-label">Prefijo captura<input className="lab-input" value={capture} onChange={(e) => setCapture(e.target.value)} /></label><label className="field-label sm:col-span-3">Plantilla editable<textarea className="command-editor min-h-24" value={command} onChange={(e) => setCommand(e.target.value)} spellCheck={false} /></label></div><div className="rounded-xl border border-white/10 bg-[#07101e] p-4"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-slate-500"><Terminal className="size-4" /> Vista previa</span><button className="copy-button" onClick={() => navigator.clipboard?.writeText(rendered)}><Clipboard className="size-3" /> Copiar</button></div><pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-cyan-100"><code>{rendered}</code></pre><p className="mt-4 text-xs leading-5 text-slate-500">Variables disponibles: {'{BSSID}'}, {'{CANAL}'}, {'{CAPTURA}'}, {'{INTERFAZ_MONITOR}'}.</p></div></div></div>
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"><h3 className="font-semibold text-white">Qué debes entregar</h3><div className="mt-4 grid gap-3 text-sm text-slate-400 md:grid-cols-4"><p><strong className="text-cyan-200">Contexto</strong><br />AP, laboratorio, fecha y autorización.</p><p><strong className="text-cyan-200">Observación</strong><br />Canal, BSSID y modo de interfaz.</p><p><strong className="text-cyan-200">Evidencia</strong><br />Archivo .cap y hash de integridad.</p><p><strong className="text-cyan-200">Mitigación</strong><br />WPA3, contraseña robusta y segmentación.</p></div></div>
  </div>
}

function RedTeamGuide() {
  const cases = [
    ['Reconocimiento', 'Comparar qué detecta el SOC ante un inventario controlado.', 'nmap -Pn -sV --version-light {IP_LAB} -oA evidencia'],
    ['Web defensiva', 'Validar cabeceras, métodos y errores de una aplicación propia.', 'curl -sS -D headers.txt {URL_LAB} -o respuesta.html'],
    ['Identidad', 'Encontrar rutas de privilegio en un dominio de práctica y proponer mínimo privilegio.', 'bloodhound-python -u {USUARIO_LAB} -p {CLAVE_LAB} -ns {IP_DC} -d {DOMINIO_LAB} -c Group,Session,ACL'],
    ['Detección', 'Medir si EDR registra procesos, conexiones y cambios durante la prueba.', 'ss -tulpn && ps auxww > procesos.txt'],
  ]
  return <div className="mt-8 space-y-5"><div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.05] p-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-1 size-5 shrink-0 text-rose-300" /><div><h3 className="font-semibold text-rose-100">Red team controlado y documentable</h3><p className="mt-2 text-sm leading-6 text-rose-100/70">Cada ejercicio requiere autorización escrita, alcance, ventana de prueba, criterio de parada y contacto de emergencia. El objetivo es producir evidencia útil para Blue Team, no extraer datos ni mantener acceso.</p></div></div></div><div className="grid gap-4 md:grid-cols-2">{cases.map(([title, goal, command]) => <article key={title} className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Caso de uso</p><h3 className="mt-2 font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{goal}</p><code className="mt-4 block overflow-x-auto rounded-lg bg-black/30 p-3 text-xs leading-5 text-cyan-100">{command}</code><p className="mt-3 text-xs leading-5 text-emerald-200/70"><strong>Blue Team:</strong> correlaciona timestamp, usuario, IP, proceso, alerta y acción de contención.</p></article>)}</div><div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-4"><h3 className="font-semibold text-amber-100">Cierre obligatorio</h3><p className="mt-2 text-sm leading-6 text-amber-100/70">Preserva hashes de evidencia, elimina cuentas temporales, revierte cambios, registra el retest y documenta las consecuencias legales de actuar fuera del alcance.</p></div></div>
}
/* function RedTeamGuide() {
  const phases = [
    ['01', 'Autorización y reglas', 'Define propietario, fechas, IPs, técnicas permitidas, contactos de emergencia y criterios de parada. Firma el alcance antes de tocar un activo.'],
    ['02', 'Reconocimiento', 'Construye inventario con fuentes autorizadas, valida que cada IP pertenece al alcance y evita escanear terceros. Guarda timestamps y origen de cada dato.'],
    ['03', 'Validación mínima', 'Reproduce una sola evidencia en una VM o sala vulnerable. Usa el menor nivel de intrusión, no extraigas datos reales y detente al demostrar el control.'],
    ['04', 'Detección blue team', 'Correlaciona logs, alertas, tráfico y cambios de configuración. Mide qué vio el SOC, cuánto tardó en responder y qué señal faltó.'],
    ['05', 'Remediación y retest', 'Entrega impacto, evidencia y corrección. El retest confirma que la vulnerabilidad desapareció sin convertir el informe en una guía de abuso.'],
  ]
  const scenarios = [
    { title: 'Exposición web y SQLi', objective: 'Demostrar una validación de entrada en una app intencionalmente vulnerable y traducirla a una regla de detección.', commands: ['export WEB=http://{IP_LAB}', 'curl -sS -D headers.txt "$WEB/login" -o login.html', 'nmap -Pn -p80,443 --script http-title,http-headers $IP_LAB', 'grep -Ei "server|content-security|x-frame" headers.txt', 'sha256sum headers.txt login.html > evidencia.sha256'], blue: 'WAF: entradas anómalas, 4xx/5xx, correlación de usuario/IP y alerta por repetición.' },
    { title: 'Reconocimiento de red', objective: 'Medir si el SOC identifica un escaneo de baja intensidad en una subred de laboratorio.', commands: ['export TARGET={IP_LAB}', 'date -u | tee inicio-recon.txt', 'nmap -Pn --top-ports 20 -T2 --max-retries 1 $TARGET -oA recon-controlado', 'nmap -Pn -sV --version-light -p22,80,443 $TARGET -oA servicios', 'sha256sum recon-controlado.* servicios.* > hashes.txt'], blue: 'IDS: patrón de puertos, origen, volumen, timestamp y tiempo hasta la alerta.' },
    { title: 'Credenciales débiles en VM', objective: 'Verificar una política de contraseñas usando cuentas sintéticas y un archivo de hashes creado por el docente.', commands: ['john --test --format=raw-sha256', 'john --wordlist=lab-wordlist.txt hashes-lab.txt --format=raw-sha256', 'john --show hashes-lab.txt', 'sha256sum hashes-lab.txt lab-wordlist.txt > integridad.txt'], blue: 'IAM: bloqueo, rate limit, MFA, eventos de autenticación y exposición del archivo de hashes.' },
    { title: 'Ruta de privilegios en AD', objective: 'Mapear relaciones autorizadas en el dominio de práctica y proponer mínimo privilegio sin modificar objetos.', commands: ['export DC={IP_DC}', 'nmap -Pn -p53,88,389,445,636 $DC -oA dc-inventory', 'bloodhound-python -u {USUARIO} -p {PASSWORD} -ns $DC -d {DOMINIO} -c Group,Session,ACL', 'sha256sum *.json > bloodhound-evidence.sha256'], blue: 'AD/SIEM: consultas LDAP, sesiones privilegiadas, cambios de grupo y cuentas de servicio.' },
    { title: 'Respuesta a incidente', objective: 'Simular un hallazgo en una VM propia, preservar evidencia y medir el tiempo de contención.', commands: ['date -u | tee incident-start.txt', 'ss -tulpn > sockets.txt', 'ps auxww > processes.txt', 'sudo journalctl --since "15 minutes ago" > journal.txt', 'sha256sum sockets.txt processes.txt journal.txt > evidence.sha256'], blue: 'EDR: proceso padre, conexión, usuario, hash, aislamiento y ticket con cadena de custodia.' },
  ]
  const [scenario, setScenario] = useState(0)
  const [step, setStep] = useState(0)
  const [command, setCommand] = useState(scenarios[0].commands[0])
  const current = scenarios[scenario]
  const selectScenario = (index: number) => { setScenario(index); setStep(0); setCommand(scenarios[index].commands[0]) }
  const nextStep = () => { const next = step + 1; if (next < current.commands.length) { setStep(next); setCommand(current.commands[next]) } }
  return <div className="mt-8 space-y-5"><div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-1 size-5 shrink-0 text-rose-300" /><div><h3 className="font-semibold text-rose-100">Red team con límites verificables</h3><p className="mt-2 text-sm leading-6 text-rose-100/70">El objetivo es mejorar la detección y la resiliencia, no obtener acceso por obtenerlo. Practica únicamente en TryHackMe, Metasploitable, una VM propia o una autorización escrita. No uses credenciales, payloads, evasión, persistencia ni extracción de datos reales sin aprobación específica.</p></div></div></div><div className="grid gap-3 md:grid-cols-5">{phases.map(([number, title, text]) => <div key={number} className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><span className="font-mono text-xs text-cyan-300">{number}</span><h4 className="mt-3 text-sm font-semibold text-white">{title}</h4><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></div>)}</div><div className="rounded-2xl border border-cyan-400/20 bg-slate-950/60 p-5"><div className="flex items-center justify-between gap-3"><div><p className="eyebrow">PLAYBOOK INTERACTIVO</p><h3 className="mt-1 text-xl font-semibold text-white">Escenarios red team para defender mejor</h3><p className="mt-2 text-sm text-slate-400">Selecciona un escenario y avanza un comando a la vez. Cada paso es editable y está diseñado para activos de laboratorio.</p></div><Terminal className="hidden size-7 text-cyan-300 md:block" /></div><div className="mt-5 flex flex-wrap gap-2">{scenarios.map((item, index) => <button key={item.title} onClick={() => selectScenario(index)} className={`rounded-lg border px-3 py-2 text-left text-xs transition ${scenario === index ? 'border-cyan-300/60 bg-cyan-300/10 text-cyan-100' : 'border-white/10 text-slate-400 hover:border-white/30'}`}><span className="mr-2 font-mono text-cyan-300">{String(index + 1).padStart(2, '0')}</span>{item.title}</button>)}</div><div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><div><h4 className="font-semibold text-white">{current.title}</h4><p className="mt-2 text-sm leading-6 text-slate-400">{current.objective}</p><div className="mt-4 flex flex-wrap gap-2">{current.commands.map((_, index) => <button key={index} onClick={() => { setStep(index); setCommand(current.commands[index]) }} className={`step-pill ${step === index ? 'active' : ''}`}>Paso {index + 1}</button>)}</div><div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4"><p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Señales para blue team</p><p className="mt-2 text-sm leading-6 text-slate-400">{current.blue}</p></div></div><div className="rounded-xl border border-white/10 bg-[#07101e] p-4"><div className="flex items-center justify-between"><span className="text-xs text-slate-500">Paso {step + 1} de {current.commands.length} · editable</span><button className="copy-button" onClick={() => navigator.clipboard?.writeText(command)}><Clipboard className="size-3" /> Copiar</button></div><textarea className="command-editor mt-4 min-h-28" value={command} onChange={(event) => setCommand(event.target.value)} spellCheck={false} aria-label="Editar comando red team" /><p className="mt-3 text-xs leading-5 text-amber-200/70">Sustituye solo variables de tu alcance: {"{IP_LAB}"}, {"{IP_DC}"}, {"{DOMINIO}"}, {"{USUARIO}"}. No ejecutes fuera del laboratorio.</p><button className="primary-button mt-4" onClick={nextStep} disabled={step === current.commands.length - 1}><ArrowRight data-icon="inline-end" /> Siguiente paso</button></div></div></div><div className="grid gap-4 md:grid-cols-2"><div className="info-block"><Terminal className="size-5 text-cyan-300" /><h3>Kit de control y evidencia</h3><pre className="mt-4 overflow-x-auto text-xs leading-6 text-cyan-100"><code>{current.commands[step]}
{current.commands[step]}</code></pre><p className="mt-3 text-xs leading-5 text-slate-500">Cada ejecución debe ser trazable. Sustituye las variables solo por datos de tu sala.</p></div><div className="info-block"><ShieldCheck className="size-5 text-cyan-300" /><h3>Qué debe observar blue team</h3><ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-slate-400"><li>Alertas por barrido de puertos y autenticaciones anómalas.</li><li>Eventos de WAF ante entradas de prueba en una app vulnerable.</li><li>Creación de procesos, conexiones salientes y cambios en archivos.</li><li>Tiempo de detección, contención, erradicación y recuperación.</li></ul></div></div><div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5"><h3 className="font-semibold text-amber-100">Consecuencias de usarlo mal</h3><p className="mt-2 text-sm leading-6 text-amber-100/70">Escanear, acceder, interceptar, degradar servicios o extraer información sin autorización puede constituir acceso ilícito, daño informático, interceptación de comunicaciones, tratamiento indebido de datos o incumplimiento contractual. Las consecuencias dependen del país y pueden incluir sanciones laborales, civiles y penales. Consulta la normativa local, las políticas de la escuela y al responsable legal antes de practicar.</p></div></div></div></div>
}
*/
function ModulePage({ id }: { id: string }) {
  const data: Record<string, { eyebrow: string; title: string; description: string }> = {
    medusa: { eyebrow: 'MÓDULO 01 · AUDITORÍA DE CREDENCIALES', title: 'Medusa', description: 'Estudia auditorías de autenticación contra servicios remotos en máquinas de práctica. Usa listas pequeñas, límites claros y evidencia documentada.' },
    nmap: { eyebrow: 'MÓDULO 02 · RECONOCIMIENTO', title: 'Nmap y Zenmap', description: 'Aprende a identificar hosts, puertos y servicios en una red de laboratorio. Comienza por descubrimiento, continúa con versiones y termina documentando hallazgos.' },
    nse: { eyebrow: 'MÓDULO 03 · AUTOMATIZACIÓN', title: 'Nmap Scripting Engine', description: 'Explora scripts NSE, categorías, argumentos y depuración para ampliar el reconocimiento sin perder control sobre el alcance.' },
    wifi: { eyebrow: 'MÓDULO 04 · SEGURIDAD INALÁMBRICA', title: 'Wi‑Fi y Aircrack-ng', description: 'Comprende el modelo de seguridad 802.11, el handshake de cuatro vías y las diferencias entre WEP, WPA2 y WPA3. Trabaja únicamente con tu propio AP.' },
    sqli: { eyebrow: 'MÓDULO 05 · SEGURIDAD WEB', title: 'SQL Injection y autenticación', description: 'Analiza cómo una consulta construida con concatenación puede alterar la lógica de autenticación y cómo prevenirlo con consultas parametrizadas y controles de servidor.' },
    traffic: { eyebrow: 'MÓDULO 06 · ANÁLISIS FORENSE', title: 'Wireshark y TShark', description: 'Convierte una captura en evidencia: aprende filtros de visualización, jerarquía de protocolos y señales que merecen investigación.' },
    directory: { eyebrow: 'MÓDULO 07 · IDENTIDAD', title: 'BloodHound y Active Directory', description: 'Mapea relaciones de privilegio en un dominio de práctica para detectar rutas de escalada y oportunidades de hardening.' },
    shodan: { eyebrow: 'MÓDULO 08 · OSINT', title: 'Shodan', description: 'Practica reconocimiento pasivo sobre información indexada y aprende a interpretar banners sin escanear infraestructura ajena.' },
    metasploit: { eyebrow: 'MÓDULO 09 · VALIDACIÓN', title: 'Metasploit con responsabilidad', description: 'Conoce la estructura del framework, sus módulos y la documentación de evidencias. Las pruebas de explotación se reservan para máquinas intencionalmente vulnerables.' },
    john: { eyebrow: 'MÓDULO 10 · AUDITORÍA DE HASHES', title: 'John the Ripper', description: 'Aprende a identificar formatos, preparar hashes de archivos propios y medir la resistencia de contraseñas sin tocar cuentas ni credenciales de terceros.' },
    redteam: { eyebrow: 'MÓDULO 11 · PURPLE TEAM', title: 'Red team controlado', description: 'Planifica ejercicios autorizados para que blue team pueda detectar, responder y mejorar. Cada fase tiene alcance, evidencia, criterio de parada y retest.' },
    flow: { eyebrow: 'MÓDULO 12 · METODOLOGÍA', title: 'Flujo general de un pentest', description: 'Conecta reconocimiento, análisis, validación y reporte en una metodología repetible para laboratorios escolares.' },
    cases: { eyebrow: 'MÓDULO 13 · CASOS', title: 'Casos de uso defensivos', description: 'Analiza escenarios autorizados, documenta evidencia y convierte cada hallazgo en una mejora concreta para Blue Team.' },
  }
  const item = data[id] ?? data.nmap
  return <><SectionTitle eyebrow={item.eyebrow} title={item.title} description={item.description} />
    {id === 'nmap' && <Lab type="nmap" />}{id === 'wifi' && <><Lab type="wifi" /><WifiGuide /></>}{id === 'traffic' && <Lab type="traffic" />}
    {id === 'sqli' && <SqlLab />}
    {id === 'directory' && <CommandTable id="bloodhound" />}
    {['medusa', 'nse', 'shodan', 'metasploit', 'john'].includes(id) && <CommandTable id={id} />}
    {id === 'redteam' && <RedTeamGuide />}
    {id === 'flow' && <TryHackMeFlow />}{id === 'cases' && <UseCases />}
    {['directory', 'metasploit', 'john', 'redteam', 'flow'].includes(id) && <div className="grid gap-4 md:grid-cols-2"><div className="info-block"><Globe2 className="size-5 text-cyan-300" /><h3>Objetivo de la lección</h3><p>Relaciona conceptos, evidencia y controles defensivos en un entorno preparado para clases.</p></div><div className="info-block"><FileCode2 className="size-5 text-cyan-300" /><h3>Entrega sugerida</h3><p>Un informe breve con alcance, método, hallazgos, impacto y recomendación de mitigación.</p></div></div>}
    <div className="mt-8 grid gap-4 md:grid-cols-3"><div className="lesson-step"><span>01</span><p>Fundamentos</p><small>Conceptos y vocabulario</small></div><div className="lesson-step"><span>02</span><p>Práctica</p><small>Datos propios del estudiante</small></div><div className="lesson-step"><span>03</span><p>Informe</p><small>Conclusiones y defensa</small></div></div>
  </>
}

function SqlLab() {
  const [user, setUser] = useState('student01')
  const [endpoint, setEndpoint] = useState('http://sql-lab.local/login')
  const [scenario, setScenario] = useState('auth')
  const [query, setQuery] = useState('SELECT id FROM users WHERE username = ? AND password_hash = ?;')
  const [result, setResult] = useState(false)
  const scenarios = {
    auth: { title: 'Bypass de autenticación', description: 'Compara concatenación insegura contra una consulta parametrizada en una aplicación deliberadamente vulnerable.', evidence: 'Respuesta HTTP, registro del servidor y consulta corregida.' },
    search: { title: 'Manipulación de filtros', description: 'Revisa un buscador de productos y valida que los filtros se traten como datos, no como fragmentos de SQL.', evidence: 'Casos de entrada, resultados esperados y prueba automatizada de regresión.' },
    error: { title: 'Errores verbosos', description: 'Identifica información sensible en mensajes de error y redacta una respuesta segura para producción.', evidence: 'Mensaje observado, impacto, versión expuesta y mensaje genérico propuesto.' },
  }
  const current = scenarios[scenario as keyof typeof scenarios]
  const steps = ['Define la sala y el endpoint autorizado.', 'Reproduce con datos ficticios y evidencia mínima.', 'Corrige con parámetros, validación y mínimo privilegio.', 'Verifica que la prueba negativa ya no altere la consulta.', 'Documenta impacto, control y recomendación.']
  return <div className="mt-8 space-y-5">
    <div className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] p-5"><div className="flex items-start gap-3"><LockKeyhole className="mt-1 size-5 shrink-0 text-violet-300" /><div><h3 className="font-semibold text-violet-100">SQL Injection: laboratorio de validación</h3><p className="mt-2 text-sm leading-6 text-violet-100/70">Estudia una aplicación intencionalmente vulnerable, como las salas de TryHackMe, sin atacar sistemas reales. La meta no es obtener datos: es demostrar el riesgo, corregirlo y verificar la defensa.</p></div></div></div>
    <div className="grid gap-3 md:grid-cols-5">{steps.map((text, index) => <div key={text} className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><span className="font-mono text-xs text-violet-300">0{index + 1}</span><p className="mt-3 text-sm font-semibold text-white">{text}</p><small className="mt-2 block text-xs leading-5 text-slate-500">{index === 0 ? 'Alcance y autorización' : index === 1 ? 'Reproducción controlada' : index === 2 ? 'Remediación' : index === 3 ? 'Regresión' : 'Informe'}</small></div>)}</div>
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><div className="lab-panel rounded-2xl border border-violet-400/20 bg-slate-950/70 p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">Escenario guiado</p><p className="mt-1 text-sm text-slate-400">Selecciona una práctica defensiva</p></div><span className="status-dot"><span /> Seguro</span></div><div className="mt-5 grid gap-3">{Object.entries(scenarios).map(([id, item]) => <button key={id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-violet-300/30" onClick={() => { setScenario(id); setResult(false) }}><p className="text-sm font-semibold text-white">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p></button>)}</div><div className="mt-5 space-y-4"><label className="field-label">Endpoint de la sala<input className="lab-input" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} /></label><label className="field-label">Usuario ficticio<input className="lab-input" value={user} onChange={(e) => setUser(e.target.value)} /></label><button className="primary-button" onClick={() => setResult(true)}><Play data-icon="inline-start" /> Validar simulación</button></div></div><div className="rounded-2xl border border-white/10 bg-[#07101e] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Consulta segura · {current.title}</p><p className="mt-1 text-xs text-slate-600">Objetivo: {endpoint}</p></div><button className="copy-button" onClick={() => navigator.clipboard?.writeText(query)}><Clipboard className="size-3" /> Copiar</button></div><textarea aria-label="Editar consulta parametrizada" className="command-editor mt-4 min-h-32" value={query} onChange={(e) => setQuery(e.target.value)} spellCheck={false} /><p className="mt-3 text-xs leading-5 text-slate-500">Puedes adaptar tabla y campos a la sala. Conserva los marcadores <code className="text-violet-200">?</code> o usa parámetros nombrados; nunca concatentes la entrada del usuario.</p>{result && <div className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-3 text-sm text-emerald-300">Validación completada: la entrada de <strong>{user}</strong> se trata como dato, no como código. Evidencia sugerida: {current.evidence}</div>}</div></div>
    <div className="grid gap-4 md:grid-cols-3"><div className="info-block"><h3>Señales a observar</h3><p>Errores SQL expuestos, diferencias de respuesta, tiempos anómalos y controles de autenticación inconsistentes.</p></div><div className="info-block"><h3>Correcciones mínimas</h3><p>Queries parametrizadas, ORM seguro, validación de entrada, hash fuerte, rate limiting y cuenta de base de datos sin privilegios.</p></div><div className="info-block"><h3>Regla de reporte</h3><p>Incluye alcance, pasos reproducibles, impacto, evidencia sin datos sensibles y una recomendación verificable.</p></div></div>
  </div>
}

export default function Page() {
  const [active, setActive] = useState('overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => modules.filter((m) => m.label.toLowerCase().includes(query.toLowerCase())), [query])
  return <main className="cyber-shell"><aside className={`sidebar ${mobileNav ? 'open' : ''}`}><div className="brand"><div className="brand-mark"><ShieldCheck /></div><div><p className="brand-name">CYBER<span>LAB</span></p><p className="brand-sub">Aula de ciberseguridad</p></div><button className="mobile-close" onClick={() => setMobileNav(false)}><X /></button></div><div className="sidebar-label">Contenido</div><nav className="module-nav">{filtered.map((module) => { const Icon = module.icon; return <button key={module.id} className={`module-link ${active === module.id ? 'active' : ''}`} onClick={() => { setActive(module.id); setMobileNav(false) }}><Icon /><span>{module.label}</span><b>{module.tag}</b></button> })}</nav><div className="sidebar-footer"><div className="avatar">ES</div><div><p className="text-sm font-medium text-white">Modo estudiante</p><p className="text-xs text-slate-500">Progreso local</p></div></div></aside><div className="content-area"><header className="topbar"><button className="menu-button" onClick={() => setMobileNav(true)}><Menu /></button><div className="breadcrumb"><span>Cyberlab</span><ChevronRight /><strong>{modules.find((m) => m.id === active)?.label}</strong></div><nav className="top-module-nav" aria-label="Navegación principal">{modules.map((module) => { const Icon = module.icon; return <button key={module.id} className={`top-module-link ${active === module.id ? 'active' : ''}`} onClick={() => setActive(module.id)} title={module.label}><Icon /><span>{module.label}</span></button> })}</nav><div className="top-actions"><div className="search-box"><Search /><input aria-label="Buscar módulo" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar módulo…" /></div><span className="secure-badge"><span /> Seguro</span></div></header><section className="main-content"><div className="content-width">{active === 'overview' ? <Overview onOpen={setActive} /> : <ModulePage id={active} />}<footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-slate-600"><span>CYBERLAB · Material educativo para entornos autorizados</span><span className="w-full text-center text-cyan-200/80 sm:w-auto">Dev by Jesús Sanabria, Estudiante de Ciberseguridad en FUSALMO</span><span className="flex items-center gap-2"><ShieldCheck className="size-3" /> Práctica responsable</span></footer></div></section></div></main>
}

