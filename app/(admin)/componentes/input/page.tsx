"use client";

import { useState } from "react";
import SearchableSelect from "@/components/ui/SearchableSelect";
import NormalInput from "@/components/ui/Input";
import TituloModulo from "@/components/ui/TituloModulo";
import { User, Mail, Lock, Hash, Calendar, Clock, Phone, Ban, EyeOff, Settings, ListFilter, Layers, Database, Send, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SelectShowcase() {
  // Estados para el catálogo (Showcase)
  const [valSimple, setValSimple] = useState("");
  const [valMultiple, setValMultiple] = useState<string[]>([]);

  // --- LÓGICA DE FORMULARIO CON VALIDACIÓN ---
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "",
    tecnologias: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.email.includes("@")) newErrors.email = "Email inválido";
    if (!formData.rol) newErrors.rol = "Debes seleccionar un rol";
    if (formData.tecnologias.length === 0) newErrors.tecnologias = "Elige al menos una tecnología";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(false);
    if (validate()) {
      console.log("Datos enviados:", formData);
      setIsSubmitted(true);
      // Limpiar errores si todo sale bien
      setErrors({});
    }
  };

  const options = [
    { value: "1", label: "Opción Activa A" },
    { value: "2", label: "Opción Activa B" },
    { value: "3", label: "Opción Activa C" },
    { value: "4", label: "Opción Activa D" },
  ];

  const roles = [
    { value: "dev", label: "Desarrollador Fullstack" },
    { value: "design", label: "Diseñador UI/UX" },
    { value: "pm", label: "Product Manager" },
    { value: "qa", label: "QA Engineer" },
  ];

  const techs = [
    { value: "react", label: "React" },
    { value: "next", label: "Next.js" },
    { value: "python", label: "Python" },
    { value: "node", label: "Node.js" },
    { value: "tailwind", label: "Tailwind CSS" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-12 max-w-6xl mx-auto pb-20">
      <TituloModulo titulo="Catálogo Completo de Componentes" variant="violet" icon={Settings} />

      {/* --- NUEVA SECCIÓN: EJEMPLO DE FORMULARIO --- */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-violet-500 uppercase tracking-widest ml-2 flex items-center gap-2">
          <Send className="w-4 h-4" /> Caso de Uso: Formulario con Validación
        </h2>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NormalInput label="Nombre Completo" icon={User} placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} error={errors.nombre} />
            <NormalInput label="Correo Electrónico" icon={Mail} placeholder="juan@empresa.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email} />

            <SearchableSelect label="Rol Profesional" placeholder="Selecciona tu cargo" options={roles} value={formData.rol} onSelect={(val) => setFormData({ ...formData, rol: val })} error={errors.rol} />

            <SearchableSelect multiple label="Stack Tecnológico" placeholder="Selecciona herramientas" options={techs} value={formData.tecnologias} onSelect={(val) => setFormData({ ...formData, tecnologias: val })} error={errors.tecnologias} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {Object.keys(errors).length > 0 && (
                <span className="flex items-center gap-1 text-rose-500 text-xs font-medium">
                  <AlertCircle className="w-4 h-4" /> Revisa los campos marcados
                </span>
              )}
              {isSubmitted && (
                <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Formulario enviado con éxito
                </span>
              )}
            </div>

            <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-violet-500/30 active:scale-95">
              Guardar Perfil
            </button>
          </div>
        </form>
      </section>

      {/* SECCIÓN: INPUTS POR TIPO (CATÁLOGO) */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
          <Layers className="w-4 h-4" /> Variaciones de Input (Types)
        </h2>
        <div className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <NormalInput label="Texto" type="text" icon={User} placeholder="Nombre estándar" />
            <NormalInput label="Email" type="email" icon={Mail} placeholder="usuario@dominio.com" />
            <NormalInput label="Password" type="password" icon={Lock} placeholder="••••••••" />
            <NormalInput label="Número" type="number" icon={Hash} placeholder="0" />
            <NormalInput label="Fecha" type="date" icon={Calendar} className="dark:[color-scheme:dark]" />
            <NormalInput label="Hora" type="time" icon={Clock} className="dark:[color-scheme:dark]" />
            <NormalInput label="Teléfono" type="tel" icon={Phone} placeholder="+56 9 ..." />
            <NormalInput label="Búsqueda" type="search" icon={ListFilter} placeholder="Buscar algo..." />
          </div>
        </div>
      </section>

      {/* SECCIÓN: SELECTS POR TIPO */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
          <Database className="w-4 h-4" /> Variaciones de Select
        </h2>
        <div className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SearchableSelect label="Select Simple (Single)" placeholder="Elige una opción" options={options} value={valSimple} onSelect={setValSimple} />
            <SearchableSelect label="Select Múltiple (Multiple)" multiple placeholder="Elige varias..." options={options} value={valMultiple} onSelect={setValMultiple} />
          </div>
        </div>
      </section>

      {/* SECCIÓN: ESTADOS DESHABILITADOS */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-rose-400 dark:text-rose-400/80 uppercase tracking-widest ml-2 flex items-center gap-2">
          <Ban className="w-4 h-4" /> Estados Deshabilitados (Disabled)
        </h2>
        <div className="bg-slate-500/5 dark:bg-slate-400/5 backdrop-blur-sm p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase ml-1">Input bloqueado</p>
              <NormalInput disabled label="Usuario Protegido" icon={EyeOff} value="admin_root" />
              <p className="text-[11px] text-slate-400 italic px-1">Aplica opacidad reducida y cursor-not-allowed.</p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase ml-1">Select bloqueado</p>
              <SearchableSelect disabled label="País (Solo Lectura)" placeholder="No disponible" options={[{ value: "cl", label: "Chile" }]} value="cl" onSelect={() => {}} />
              <p className="text-[11px] text-slate-400 italic px-1">El botón no dispara el menú.</p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tags bloqueados</p>
              <SearchableSelect
                disabled
                multiple
                label="Roles Asignados"
                options={[
                  { value: "1", label: "Editor" },
                  { value: "2", label: "Admin" },
                ]}
                value={["1", "2"]}
                onSelect={() => {}}
              />
              <p className="text-[11px] text-slate-400 italic px-1">Tags visibles pero inactivos.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
