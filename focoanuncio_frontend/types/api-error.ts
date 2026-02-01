export interface ApiError {
	message: string;
	status: number;
	raw?: any; // opcional, para guardar toda la info del backend
}
