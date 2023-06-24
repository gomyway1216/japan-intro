// import React, { FC, useState } from 'react';
// import { Autocomplete, Box, TextField, InputAdornment, IconButton, Typography, Avatar } from '@mui/material';
// import { Link } from 'react-router-dom';
// import { useTasks } from '../../Provider/TaskContext';
// import { TaskMin } from '../../Constants/types';
// import { SearchOutlined } from '@mui/icons-material';

// interface SearchBarProps {
//   color: string;
//   characterColor: string;
//   searchIconRequired?: true;
//   callback: () => void;
// }

// const SearchBar: FC<SearchBarProps> = (props) => {
//   const { tasks } = useTasks();
//   const [value, setValue] = useState<string | TaskMin>('');

//   const handleItemClick = () => {
//     props.callback();
//   }

//   return (
//     <Autocomplete
//       sx={{
//         // maxWidth: 550,
//       }}
//       id="search-autocomplete"
//       options={tasks}
//       filterOptions={(options, { inputValue }) =>
//         options.filter((option) =>
//           option.title.toLowerCase().includes(inputValue.toLowerCase())
//         )
//       }
//       getOptionLabel={(option?: string | TaskMin) => {
//         if (option && typeof option !== 'string') {
//           return option.title;
//         }
//         return '';
//       }}
//       disableClearable
//       freeSolo
//       fullWidth
//       size="small"
//       // value={value}
//       onInputChange={(event, value: string | TaskMin) => {
//         if (event?.type === "change") {
//           setValue(value);
//         }
//       }}
//       // groupBy={(option) => option.category}
//       renderOption={(props, option: TaskMin) => {
//         return (
//           <Link to={`task/${option.id}`} onClick={handleItemClick} key={option.id} style={{ textDecoration: 'none' }}>
//             <Box
//               {...props}
//               component="li"
//               sx={{
//                 display: "flex",
//                 padding: "10px",
//                 alignItems: "center",
//                 gap: "10px",
//               }}
//             >
//               <Avatar
//                 sx={{
//                   width: {
//                     sm: "48px",
//                     md: "54px",
//                     lg: "64px",
//                   },
//                   height: {
//                     sm: "48px",
//                     md: "54px",
//                     lg: "64px",
//                   },
//                 }}
//                 src="#"
//               />
//               <Typography
//                 sx={{
//                   fontSize: {
//                     md: "14px",
//                     lg: "16px",
//                   },
//                 }}
//               >
//                 {option.title}
//               </Typography>
//             </Box>
//           </Link>
//         );
//       }}
//       renderInput={(params) => {
//         return (
//           <Box
//             position="relative"
//           >
//             <TextField
//               {...params}
//               placeholder="Search Task"
//               InputProps={{
//                 ...params.InputProps,
//                 startAdornment: <InputAdornment position="start">
//                   {props.searchIconRequired &&
//                     <IconButton
//                       sx={{
//                         marginRight: 0,
//                         color: "white",
//                         "&:hover": {
//                           backgroundColor:
//                             "transparent",
//                         },
//                       }}
//                     >
//                       <SearchOutlined />
//                     </IconButton>
//                   }
//                 </InputAdornment>
//               }}
//               sx={{
//                 marginLeft: 0,
//                 '.MuiFormLabel-root': {
//                   color: props.characterColor,
//                 },
//                 // color: 'white',
//                 '.MuiInputBase-input': {
//                   color: props.characterColor,
//                   // background: 'rgba(255, 255, 255, 0.15)'
//                 },
//                 '.MuiInputLabel-root': {
//                   color: props.characterColor,
//                   // background: 'rgba(255, 255, 255, 0.15)'
//                 },
//                 '.MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: props.color,
//                     background: 'rgba(255, 255, 255, 0.15)'
//                   },
//                   '&:hover fieldset': {
//                     borderColor: props.color,
//                     background: 'rgba(255, 255, 255, 0.25)'
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: props.color,
//                     // background: 'rgba(255, 255, 255, 0.15)'
//                   },
//                 },
//                 '.css-1jy569b-MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
//                   color: props.color,
//                 },
//                 '& label': {
//                   color: props.color,
//                   // background: 'rgba(255, 255, 255, 0.15)'
//                 },
//               }}
//             />

//           </Box>
//         );
//       }}
//     />
//   );
// }

// export default SearchBar