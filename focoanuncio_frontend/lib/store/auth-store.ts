import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type AuthState = {
	user: { id: number; name: string; email: string; avatar: string } | null;
	token: string | null;
	setUser: (user: any) => void;
	setToken: (token: string) => void;
	logout: () => void;
};

export const useAuthStore = create<AuthState>()(
	devtools(
		persist(
			(set) => ({
				user: null,
				token: null,
				setUser: (user) => set({ user }),
				setToken: (token) => set({ token }),
				logout: () => {
					set({ user: null, token: null });
				},
			}),
			{
				name: 'auth-storage', //
			}
		),
		{
			name: 'auth-store', // unique name
		}
	)
);
