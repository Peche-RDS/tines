type Props = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error: string;
};

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  error,
}: Props) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "8px",
          border: error ? "2px solid red" : "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      {error && (
        <span style={{ color: "red", fontSize: "12px" }}>
          {error}
        </span>
      )}
    </div>
  );
}