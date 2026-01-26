import css from "./SearchBox.module.css";

interface SearchBoxProps {
  search: string;
  onChangeSearch: (search: string) => void;
}

export default function SearchBox({ search, onChangeSearch }: SearchBoxProps) {
  return (
    <input
      value={search}
      onChange={(event) => onChangeSearch(event.target.value)}
      className={css.input}
      name="search"
      type="text"
      placeholder="Search notes"
    />
  );
}
