export const validateName = (name: string) => {
  if (!name.trim()) return "El nombre es obligatorio";
  return "";
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "El email es obligatorio";
  if (!regex.test(email)) return "Formato de email inválido";
  return "";
};

export const validatePassword = (password: string) => {
  if (!password) return "La contraseña es obligatoria";
  if (password.length < 8) return "Mínimo 8 caracteres";
  return "";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
) => {
  if (!confirmPassword) return "Confirma tu contraseña";
  if (password !== confirmPassword) return "Las contraseñas no coinciden";
  return "";
};