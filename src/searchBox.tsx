import { IconButton, InputBase, Paper } from '@mui/material';
import React, { useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBoxProps {
  searchHandler: (e: React.MouseEvent<SVGSVGElement, MouseEvent>, searchQuery: string) => void
}


const SearchBox: React.FC<SearchBoxProps> = ({ searchHandler }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase inputRef={inputRef}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search for fact" inputProps={{ 'aria-label': 'search fact' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon onClick={(e) => { e.preventDefault(); searchHandler(e, inputRef.current?.value) }} />
      </IconButton>
    </Paper>
  );
}

export default SearchBox