interface SimpleInputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> ) => void;
}
