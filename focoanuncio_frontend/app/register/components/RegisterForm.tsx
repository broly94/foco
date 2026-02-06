'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/use-auth';
import { showToast } from 'nextjs-toast-notify';
import { motion } from 'framer-motion';

const registerSchema = z
    .object({
        name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
        lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
        phone: z
            .string()
            .min(9, 'El número de celular debe tener al menos 9 caracteres')
            .max(15, 'El número de celular no puede tener más de 15 caracteres'),
        email: z.string().email('Ingresa un email válido'),
        password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        agreeTerms: z.boolean().refine((val) => val === true, { message: 'Debes aceptar los términos y condiciones' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const registerMutation = useRegister();

    const {
        register: registerField,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            lastName: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false,
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await registerMutation.mutateAsync({
                name: data.name,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
                password: data.password,
            });

            router.push('/login?registered=true&activationrequired=true');
        } catch (error: any) {
            showToast.error(`${error.message}`, {
                duration: 4000,
                progress: false,
                position: 'top-center',
                transition: 'bounceIn',
                icon: '',
                sound: true,
            });
        }
    };

    const handleLoginGoogle = async () => {
        router.push(`http://localhost:3002/api/auth/google`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='w-full'
        >
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='name' className='text-zinc-700 dark:text-zinc-300 font-medium'>Nombre</Label>
                        <Input
                            id='name'
                            placeholder='Tu nombre'
                            className='h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                            {...registerField('name')}
                        />
                        {errors.name && <p className='text-xs text-red-500'>{errors.name.message}</p>}
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='lastName' className='text-zinc-700 dark:text-zinc-300 font-medium'>Apellido</Label>
                        <Input
                            id='lastName'
                            placeholder='Tu apellido'
                            className='h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                            {...registerField('lastName')}
                        />
                        {errors.lastName && <p className='text-xs text-red-500'>{errors.lastName.message}</p>}
                    </div>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='phone' className='text-zinc-700 dark:text-zinc-300 font-medium'>Celular</Label>
                    <Input
                        id='phone'
                        placeholder='Ej: 1122334455'
                        className='h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                        {...registerField('phone')}
                    />
                    {errors.phone && <p className='text-xs text-red-500'>{errors.phone.message}</p>}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='email' className='text-zinc-700 dark:text-zinc-300 font-medium'>Email</Label>
                    <Input
                        id='email'
                        type='email'
                        placeholder='tu@email.com'
                        className='h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                        {...registerField('email')}
                    />
                    {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='password' title='Contraseña' className='text-zinc-700 dark:text-zinc-300 font-medium'>Contraseña</Label>
                        <div className='relative'>
                            <Input
                                id='password'
                                type={showPassword ? 'text' : 'password'}
                                placeholder='••••••••'
                                className='h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 pr-10'
                                {...registerField('password')}
                            />
                            <button
                                type='button'
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                            </button>
                        </div>
                        {errors.password && <p className='text-xs text-red-500'>{errors.password.message}</p>}
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='confirmPassword' title='Confirmar contraseña' className='text-zinc-700 dark:text-zinc-300 font-medium'>Confirmar</Label>
                        <Input
                            id='confirmPassword'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='••••••••'
                            className='h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                            {...registerField('confirmPassword')}
                        />
                        {errors.confirmPassword && <p className='text-xs text-red-500'>{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <div className='flex items-start space-x-2 py-2'>
                    <Controller
                        name='agreeTerms'
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id='agreeTerms'
                                className='mt-1 data-[state=checked]:bg-emerald-500 border-zinc-300 shadow-none'
                            />
                        )}
                    />
                    <Label htmlFor='agreeTerms' className='text-xs text-zinc-600 dark:text-zinc-400 leading-normal cursor-pointer text-pretty'>
                        Acepto los <Link href='/terms' className='text-emerald-600 font-semibold'>términos y condiciones</Link> y la política de privacidad.
                    </Label>
                </div>
                {errors.agreeTerms && <p className='text-xs text-red-500'>{errors.agreeTerms.message}</p>}

                <Button
                    type='submit'
                    className='w-full h-11 bg-zinc-900 dark:bg-emerald-600 hover:bg-zinc-800 dark:hover:bg-emerald-700 text-white font-bold transition-all disabled:opacity-70'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className='flex items-center gap-2'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Registrando...
                        </div>
                    ) : (
                        'Registrarse'
                    )}
                </Button>
            </form>

            <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t border-zinc-200 dark:border-zinc-800' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400'>O registrarte con</span>
                </div>
            </div>

            <div className='flex justify-center'>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLoginGoogle}
                    className='p-3 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center'
                >
                    <svg className='h-6 w-6' viewBox='0 0 24 24'>
                        <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
                        <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853' />
                        <path d='M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z' fill='#FBBC05' />
                        <path d='M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
                        <path d='M1 1h22v22H1z' fill='none' />
                    </svg>
                </motion.button>
            </div>
        </motion.div>
    );
}
