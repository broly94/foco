'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    ChevronRight,
    ChevronLeft,
    Phone,
    Tag,
    Layers,
    CheckCircle2,
    Loader2,
    Info,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/hooks/use-categories';
import { useKeywords } from '@/hooks/use-keywords';
import { useCurrentUser } from '@/hooks/use-auth';
import { useSearchStrategies } from '@/hooks/use-marketing-strategy';
import { ApiMarketingStrategy } from '@/lib/api/marketing-strategy.api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const STEPS = [
    { id: 'basic', title: 'Identidad', icon: Building2 },
    { id: 'category', title: 'Categoría', icon: Layers },
    { id: 'contact', title: 'Contacto', icon: Phone },
    { id: 'address', title: 'Ubicación', icon: MapPin },
    { id: 'keywords', title: 'Palabras Clave', icon: Tag },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const { data: user } = useCurrentUser();
    const { data: categories, isLoading: loadingCats } = useCategories();
    const { data: keywords, isLoading: loadingKeys } = useKeywords();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        phone: '',
        use_user_phone: true,
        keyword_ids: [] as number[],
        category_id: 0,
        sub_category_01_id: 0,
        address_marketing: {
            address_of_user: true,
            address: '',
            state: '',
            country: 'Argentina',
            post_code: '',
            lat: 0,
            lon: 0
        }
    });

    const mutation = useMutation({
        mutationFn: (data: any) => ApiMarketingStrategy.create(data),
        onSuccess: () => {
            toast.success('¡Perfil comercial creado con éxito!');
            router.push('/dashboard');
        },
        onError: (error: any) => {
            if (error.message?.includes('ya tiene un perfil comercial')) {
                toast.success('¡Ya tienes un perfil comercial habilitado!');
                router.push('/dashboard');
            } else {
                toast.error(error.message || 'Error al crear el perfil');
            }
        }
    });

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        mutation.mutate({
            ...formData,
            user_phone: formData.use_user_phone,
            phone: formData.use_user_phone ? undefined : formData.phone
        });
    };

    const isDigitalService = () => {
        const selectedCat = categories?.find((c: any) => c.id === formData.category_id);
        const selectedSub1 = selectedCat?.sub_categories_01?.find((s: any) => s.id === formData.sub_category_01_id);

        const digitalKeywords = ['digital', 'freelance', 'software', 'programación', 'web', 'diseño', 'consultoría', 'informática', 'tecnología'];

        if (selectedCat && digitalKeywords.some(k => selectedCat.name.toLowerCase().includes(k))) return true;
        if (selectedSub1 && digitalKeywords.some(k => selectedSub1.name.toLowerCase().includes(k))) return true;

        return false;
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0: return formData.title.length > 3 && formData.description.length > 10;
            case 1: return formData.category_id !== 0 && formData.sub_category_01_id !== 0;
            case 2: return formData.use_user_phone || formData.phone.length > 7;
            case 3:
                // El país es siempre obligatorio
                if (!formData.address_marketing.country) return false;

                // Si es un servicio digital/freelance, la dirección física es opcional
                if (isDigitalService()) return true;

                // De lo contrario, si usa la dirección del usuario, debe existir el usuario (o confiamos en que tiene dirección si lo deja marcado)
                // Si es una dirección nueva, validamos campos mínimos
                if (!formData.address_marketing.address_of_user) {
                    return formData.address_marketing.address.length > 3 &&
                        formData.address_marketing.state.length > 2 &&
                        formData.address_marketing.town.length > 2;
                }
                return true;
            case 4: return formData.keyword_ids.length >= 1;
            default: return false;
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Habilita tu Perfil Comercial</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Completa estos pasos para empezar a mostrar tu negocio.</p>
                </div>

                {/* Stepper */}
                <div className="flex justify-between mb-12 relative">
                    <div className="absolute top-5 left-0 w-full h-[2px] bg-zinc-200 dark:bg-zinc-800 -z-10" />
                    <div
                        className="absolute top-5 left-0 h-[2px] bg-zinc-900 dark:bg-zinc-50 transition-all duration-500 -z-10"
                        style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    />
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                        ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                                        : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800'
                                        } ${isCurrent ? 'ring-4 ring-zinc-900/10 dark:ring-zinc-50/10' : ''}`}
                                >
                                    {index < currentStep ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                </div>
                                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400'}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Card Form */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 min-h-[400px] flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1"
                        >
                            {currentStep === 0 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nombre de tu tienda / negocio</label>
                                        <Input
                                            placeholder="Ej: Foco Marketing Digital"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Descripción corta</label>
                                        <Textarea
                                            placeholder="Cuéntanos a qué te dedicas..."
                                            className="min-h-[120px] rounded-xl resize-none"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                        <p className="text-[10px] text-zinc-400">Mínimo 10 caracteres.</p>
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Categoría Principal</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {loadingCats ? (
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            ) : (
                                                <select
                                                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm appearance-none outline-none focus:ring-2 focus:ring-zinc-900/5"
                                                    value={formData.category_id}
                                                    onChange={e => {
                                                        setFormData({
                                                            ...formData,
                                                            category_id: Number(e.target.value),
                                                            sub_category_01_id: 0
                                                        });
                                                    }}
                                                >
                                                    <option value={0}>Selecciona una categoría</option>
                                                    {categories?.map((cat: any) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </div>

                                    {formData.category_id !== 0 && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                            <label className="text-sm font-medium">Subcategoría Específica</label>
                                            <select
                                                className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm appearance-none outline-none focus:ring-2 focus:ring-zinc-900/5"
                                                value={formData.sub_category_01_id}
                                                onChange={e => setFormData({ ...formData, sub_category_01_id: Number(e.target.value) })}
                                            >
                                                <option value={0}>Selecciona una subcategoría</option>
                                                {categories?.find((c: any) => c.id === formData.category_id)?.sub_categories_01?.map((sub: any) => (
                                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-start gap-3">
                                        <Info className="h-5 w-5 text-zinc-400 mt-0.5" />
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            El número de teléfono será el principal medio de contacto para tus clientes.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setFormData({ ...formData, use_user_phone: true })}
                                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${formData.use_user_phone
                                                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 shadow-lg'
                                                : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                                                }`}
                                        >
                                            <div className="font-bold">Usar mi teléfono de perfil</div>
                                            <div className={`text-sm ${formData.use_user_phone ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500'}`}>
                                                {user?.phone || 'Sin teléfono registrado'}
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setFormData({ ...formData, use_user_phone: false })}
                                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${!formData.use_user_phone
                                                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 shadow-lg'
                                                : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                                                }`}
                                        >
                                            <div className="font-bold">Usar un teléfono comercial distinto</div>
                                            {!formData.use_user_phone && (
                                                <div className="mt-3">
                                                    <Input
                                                        placeholder="+54 9 11 ..."
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        onClick={e => e.stopPropagation()}
                                                        className="bg-white/10 border-white/20 text-white dark:bg-black/10 dark:border-black/20 dark:text-black rounded-xl"
                                                    />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            {isDigitalService()
                                                ? "Como seleccionaste un servicio digital/freelance, la dirección exacta es opcional. Solo necesitamos tu país."
                                                : "La ubicación es obligatoria para que tus clientes puedan encontrarte en el mapa."}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">País (Obligatorio)</label>
                                                <select
                                                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-zinc-900/5"
                                                    value={formData.address_marketing.country}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        address_marketing: { ...formData.address_marketing, country: e.target.value }
                                                    })}
                                                >
                                                    <option value="Argentina">Argentina</option>
                                                    <option value="Uruguay">Uruguay</option>
                                                    <option value="Chile">Chile</option>
                                                    <option value="Paraguay">Paraguay</option>
                                                    <option value="Brasil">Brasil</option>
                                                    <option value="Bolivia">Bolivia</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Código Postal</label>
                                                <Input
                                                    placeholder="Ej: 1425"
                                                    value={formData.address_marketing.post_code}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        address_marketing: { ...formData.address_marketing, post_code: e.target.value }
                                                    })}
                                                    className="rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                            <button
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    address_marketing: { ...formData.address_marketing, address_of_user: true }
                                                })}
                                                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${formData.address_marketing.address_of_user
                                                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 shadow-lg'
                                                    : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                                                    }`}
                                            >
                                                <div className="font-bold">Usar mi dirección de perfil</div>
                                                <div className={`text-sm ${formData.address_marketing.address_of_user ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500'}`}>
                                                    {user?.address_user?.address || 'Sin dirección registrada'}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    address_marketing: { ...formData.address_marketing, address_of_user: false }
                                                })}
                                                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${!formData.address_marketing.address_of_user
                                                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 shadow-lg'
                                                    : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                                                    }`}
                                            >
                                                <div className="font-bold">Ingresar una dirección comercial distinta</div>
                                                {!formData.address_marketing.address_of_user && (
                                                    <div className="mt-4 space-y-4">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-medium text-white/70 dark:text-black/70">Provincia / Estado</label>
                                                            <Input
                                                                placeholder="Ej: Buenos Aires"
                                                                value={formData.address_marketing.state}
                                                                onChange={e => setFormData({
                                                                    ...formData,
                                                                    address_marketing: { ...formData.address_marketing, state: e.target.value }
                                                                })}
                                                                onClick={e => e.stopPropagation()}
                                                                className="bg-white/10 border-white/20 text-white dark:bg-black/10 dark:border-black/20 dark:text-black rounded-xl"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-medium text-white/70 dark:text-black/70">Ciudad / Localidad</label>
                                                            <Input
                                                                placeholder="Ej: Palermo"
                                                                value={formData.address_marketing.town}
                                                                onChange={e => setFormData({
                                                                    ...formData,
                                                                    address_marketing: { ...formData.address_marketing, town: e.target.value }
                                                                })}
                                                                onClick={e => e.stopPropagation()}
                                                                className="bg-white/10 border-white/20 text-white dark:bg-black/10 dark:border-black/20 dark:text-black rounded-xl"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-medium text-white/70 dark:text-black/70">Calle y Altura</label>
                                                            <Input
                                                                placeholder="Ej: Av. Santa Fe 1234"
                                                                value={formData.address_marketing.address}
                                                                onChange={e => setFormData({
                                                                    ...formData,
                                                                    address_marketing: { ...formData.address_marketing, address: e.target.value }
                                                                })}
                                                                onClick={e => e.stopPropagation()}
                                                                className="bg-white/10 border-white/20 text-white dark:bg-black/10 dark:border-black/20 dark:text-black rounded-xl"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <label className="text-sm font-medium block">Selecciona las palabras clave que mejor describan tu negocio</label>
                                    {loadingKeys ? (
                                        <div className="flex items-center justify-center p-12">
                                            <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                            {keywords?.map((key: any) => (
                                                <button
                                                    key={key.id}
                                                    onClick={() => {
                                                        const isSelected = formData.keyword_ids.includes(key.id);
                                                        if (isSelected) {
                                                            setFormData({ ...formData, keyword_ids: formData.keyword_ids.filter(id => id !== key.id) });
                                                        } else {
                                                            setFormData({ ...formData, keyword_ids: [...formData.keyword_ids, key.id] });
                                                        }
                                                    }}
                                                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-center ${formData.keyword_ids.includes(key.id)
                                                        ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-900'
                                                        : 'bg-zinc-50 border-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:border-zinc-800 dark:text-zinc-400'
                                                        }`}
                                                >
                                                    {key.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="rounded-xl px-6"
                        >
                            <ChevronLeft className="h-5 w-5 mr-1" /> Atrás
                        </Button>

                        <Button
                            onClick={handleNext}
                            disabled={!isStepValid() || mutation.isPending}
                            className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl px-10 h-12 shadow-lg"
                        >
                            {mutation.isPending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : currentStep === STEPS.length - 1 ? (
                                'Finalizar Perfil'
                            ) : (
                                <>Siguiente <ChevronRight className="h-5 w-5 ml-1" /></>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Info */}
                <p className="text-center text-xs text-zinc-400 mt-8">
                    Paso {currentStep + 1} de {STEPS.length} • Puedes editar esta información más tarde en tu Dashboard.
                </p>
            </div>
        </div>
    );
}
