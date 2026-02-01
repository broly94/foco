export enum PostgresErrorCode {
  UNIQUE_VIOLATION = '23505', // Violación de restricción única
  NOT_NULL_VIOLATION = '23502', // Insertar valor nulo en columna con NOT NULL
  FOREIGN_KEY_VIOLATION = '23503', // Violación de clave foránea
  CHECK_VIOLATION = '23514', // Violación de restricción CHECK
  EXCLUSION_VIOLATION = '23P01', // Violación de restricción EXCLUDE
}
