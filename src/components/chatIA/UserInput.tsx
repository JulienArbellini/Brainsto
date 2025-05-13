interface Props {
    onSubmit: (value: string) => void;
    disabled: boolean;
  }
  
  export default function UserInput({ onSubmit, disabled }: Props) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const input = e.currentTarget.elements.namedItem("reply") as HTMLInputElement;
      const value = input.value.trim();
      if (!value) return;
      onSubmit(value);
      input.value = "";
    };
  
    return (
      <form
        onSubmit={handleSubmit}
        className="px-4 py-2 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex space-x-2 shrink-0"
      >
        <input
          name="reply"
          className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Votre réponse..."
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </form>
    );
  }
  