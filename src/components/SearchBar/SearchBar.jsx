import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';

const teams = ['111', '222', '333']
export default function SearchBar() {
  return (
    <Stack sx={{ width: 240 }}>
      <Autocomplete
        freeSolo
        className="gt-search"
        options={teams.map((option) => option)}
        renderInput={(params) => (
          <TextField
          className="search-input"
            {...params}
            placeholder="Search"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
              <SearchIcon />
          ),
            }}
          />
        )}
      />
    </Stack>
  );
}