import React, { useState } from 'react';
import { User, UserRole, AuditLog } from '../../types';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Key,
  History,
  FileCheck,
  AlertCircle,
  Check,
  Shield,
  Smartphone,
  Eye,
  Settings,
  Users,
  Download,
} from 'lucide-react';
import { AcademicCardWrapper } from '../common/AcademicCardWrapper';

interface AuthAuditStudioProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  auditLogs: AuditLog[];
  onToggle2FA: () => void;
}

export const AuthAuditStudio: React.FC<AuthAuditStudioProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  auditLogs,
  onToggle2FA,
}) => {
  const [activeTab, setActiveTab] = useState<'users_rbac' | 'audit_trail' | 'security_settings'>('users_rbac');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(
    (log) => filterCategory === 'ALL' || log.category === filterCategory
  );

  const handleExportAuditLogs = () => {
    const csvHeader = 'id,timestamp,userId,userName,userRole,action,category,details,ipAddress,status\n';
    const csvRows = filteredLogs.map((l) => 
      `"${l.id}","${l.timestamp}","${l.userId}","${l.userName}","${l.userRole}","${l.action}","${l.category}","${(l.details || '').replace(/"/g, '""')}","${l.ipAddress}","${l.status}"`
    ).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-tech">
              Seguridad, Control de Acceso (RBAC) & Auditoría
            </h2>
            <p className="text-xs text-slate-400">
              Autenticación JWT OAuth2, control de roles (RBAC/ABAC), autenticación 2FA y registro inmutable de auditoría.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('users_rbac')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-tech uppercase tracking-wider transition-all ${
              activeTab === 'users_rbac'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Usuarios & Roles (RBAC)
          </button>
          <button
            onClick={() => setActiveTab('audit_trail')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-tech uppercase tracking-wider transition-all ${
              activeTab === 'audit_trail'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Trazabilidad & Logs
          </button>
          <button
            onClick={() => setActiveTab('security_settings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-tech uppercase tracking-wider transition-all ${
              activeTab === 'security_settings'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Perfil & 2FA
          </button>
        </div>
      </div>

      {/* Tab 1: Users & RBAC Matrix */}
      {activeTab === 'users_rbac' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Switcher Cards */}
          <div className="lg:col-span-6 bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-slate-200 font-tech flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Simulador de Cambio Rápido de Usuario / Rol</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">4 Perfiles Definidos</span>
            </div>

            <div className="space-y-3">
              {allUsers.map((u) => {
                const isActive = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => onSwitchUser(u)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                          {u.name}
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[9px] uppercase">
                              Sesión Activa
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{u.department}</div>
                        <div className="text-[10px] font-mono text-slate-500">{u.email}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                            : u.role === 'supervisor'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                            : u.role === 'process_engineer'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RBAC Permissions Matrix */}
          <div className="lg:col-span-6">
            <AcademicCardWrapper
              id="academic-table-rbac"
              figureNumber="Tabla S-1"
              title="Matriz de Permisos de Control de Acceso Basado en Roles (RBAC)"
              subtitle="Especificación de privilegios de usuario para operaciones críticas de mina"
              type="table"
              tableData={[
                { ModuloAccion: 'Visualización Gemelo 3D', Admin: 'SI', Supervisor: 'SI', IngProcesos: 'SI', Observador: 'SI' },
                { ModuloAccion: 'Ajuste Parámetros What-If', Admin: 'SI', Supervisor: 'SI', IngProcesos: 'SI', Observador: 'NO' },
                { ModuloAccion: 'Detonación Voladuras / Blast', Admin: 'SI', Supervisor: 'SI', IngProcesos: 'SI', Observador: 'NO' },
                { ModuloAccion: 'Entrenamiento Gym & Despliegue DRL', Admin: 'SI', Supervisor: 'NO', IngProcesos: 'SI', Observador: 'NO' },
                { ModuloAccion: 'Gestión de Usuarios & Auditoría', Admin: 'SI', Supervisor: 'NO', IngProcesos: 'NO', Observador: 'NO' },
              ]}
              interpretation="La matriz define el principio de mínimo privilegio (PoLP). Los roles técnicos (Ingeniero de Procesos y Administrador) ostentan control exclusivo sobre los modelos estocásticos y disparadores físicos, protegiendo la integridad del gemelo digital ante modificaciones no autorizadas."
              physicalExplainability="El control de acceso por atributos (ABAC) intercepta llamadas a la API de detonación y entrenamiento, verificando la firma JWT y garantizando que las decisiones de despacho autónomo cumplan con las normativas de seguridad industrial minera (OSHA / D.S. 024-2016-EM)."
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      <th className="pb-2">Módulo / Acción</th>
                      <th className="pb-2 text-center text-rose-400">Admin</th>
                      <th className="pb-2 text-center text-amber-400">Supervisor</th>
                      <th className="pb-2 text-center text-purple-400">Ing. Proc.</th>
                      <th className="pb-2 text-center text-slate-400">Observador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 font-medium">Visualización Gemelo 3D</td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Ajuste Parámetros What-If</td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-rose-500 font-mono">✕</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Detonación Voladuras / Blast</td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-rose-500 font-mono">✕</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Entrenamiento Gym & Despliegue DRL</td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-rose-500 font-mono">✕</td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-rose-500 font-mono">✕</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Gestión de Usuarios & Auditoría</td>
                      <td className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center text-rose-500 font-mono">✕</td>
                      <td className="text-center text-rose-500 font-mono">✕</td>
                      <td className="text-center text-rose-500 font-mono">✕</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AcademicCardWrapper>
          </div>
        </div>
      )}

      {/* Tab 2: Audit Trail & Action Logs */}
      {activeTab === 'audit_trail' && (
        <AcademicCardWrapper
          id="academic-table-audit-trail"
          figureNumber="Tabla S-2"
          title="Registro Inmutable de Auditoría & Trazabilidad de Eventos"
          subtitle={`Historial cronológico de cambios de estado, voladuras y despachos (Categoría: ${filterCategory})`}
          type="table"
          tableData={filteredLogs.map((l) => ({
            ID_Evento: l.id,
            Timestamp: l.timestamp,
            UsuarioID: l.userId,
            UsuarioNombre: l.userName,
            Rol: l.userRole,
            Accion: l.action,
            Categoria: l.category,
            Detalles: l.details,
            DireccionIP: l.ipAddress,
            Estado: l.status,
          }))}
          interpretation="El log de auditoría garantiza la no repudiación de eventos operacionales críticos. Registra cada ejecución de voladura, cambio en la función de recompensa y despliegue de políticas DRL, asociando el hash de usuario y la dirección IP de origen."
          physicalExplainability="Conforme a los estándares de auditoría minera digital y ciberseguridad industrial (ISA/IEC 62443), este registro permite reproducir retrospectivamente cualquier desbalance en la alimentación del molino SAG o evento de sobretamaño en frentes de carguío."
          extraHeaderActions={
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filtrar:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="ALL">Todas las Categorías</option>
                <option value="SIMULATION">SIMULATION</option>
                <option value="DRL_MODEL">DRL_MODEL</option>
                <option value="SECURITY">SECURITY</option>
                <option value="REPORT">REPORT</option>
              </select>
            </div>
          }
        >
          <div className="space-y-2.5">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold">{log.action}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {log.category}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{log.details}</p>
                </div>

                <div className="text-right sm:min-w-[170px] text-[11px] text-slate-400 font-mono">
                  <div className="text-slate-200">{log.userName}</div>
                  <div>IP: {log.ipAddress}</div>
                  <div className="text-[10px] text-slate-500">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </AcademicCardWrapper>
      )}

      {/* Tab 3: Security & 2FA Settings */}
      {activeTab === 'security_settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase font-tech pb-2 border-b border-slate-800 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Autenticación de Doble Factor (2FA - TOTP)</span>
            </h3>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-lg border border-slate-800">
              <div>
                <div className="text-xs font-bold text-slate-100">Estado de Protección 2FA</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {currentUser.twoFactorEnabled
                    ? 'Protección activa con Authenticator App (RFC 6238 TOTP)'
                    : '2FA desactivado. Se recomienda activar para operaciones críticas.'}
                </div>
              </div>
              <button
                onClick={onToggle2FA}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentUser.twoFactorEnabled
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60 hover:bg-rose-900'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/30'
                }`}
              >
                {currentUser.twoFactorEnabled ? 'Desactivar 2FA' : 'Activar 2FA'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase font-tech pb-2 border-b border-slate-800 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Gestión de Tokens JWT & Sesión</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Algoritmo de Firma:</span>
                <span className="font-mono text-amber-400">HMAC-SHA256 (RS256 compatible)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Access Token Expiration:</span>
                <span className="font-mono text-emerald-400">15 minutos</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Refresh Token Expiration:</span>
                <span className="font-mono text-slate-200">7 días (Rotativo)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
