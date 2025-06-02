import { TextInput, TextInputProps } from "react-native";
import styles from "./styleSearchInput";

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
} & TextInputProps;

const SearchInput = ({
  value,
  onChangeText,
  placeholder = "Pesquisar...",
  ...props
}: SearchInputProps) => {
  return (
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

export default SearchInput;
