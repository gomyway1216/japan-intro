// import React, { useEffect, useState, FC } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Backdrop, Button, CircularProgress } from '@mui/material';
// import DOMPurify from 'dompurify';
// import * as util from '../../util/util';
// import styles from './rich-text-display.module.scss';
// import { RichTextDisplayProps, RichTextEditingData } from '../../types'

// const RichTextDisplay: FC<RichTextDisplayProps> = (props) => {
//   const [loading, setLoading] = useState(true);
//   const [formattedDate, setFormattedDate] = useState<string | undefined>();
//   const { id } = useParams<{ id: string }>();
//   const [data, setData] = useState<RichTextEditingData | undefined>();
//   const navigate = useNavigate();

//   const getData = async () => {
//     if (id) {
//       const result = await props.getApi(id);
//       setData(result);

//       // Create a Date object from the result.created string
//       const createdDate = new Date(result.created);

//       const formattedCreatedDate = util.formatJapaneseDate(createdDate);
//       setFormattedDate(formattedCreatedDate);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, [id]); // Add id to the dependency array

//   if (loading) {
//     return (
//       <Backdrop open={true} style={{
//         display: loading
//           ? 'flex' : 'none'
//       }}>
//         <CircularProgress style={{ 'color': 'white' }} />
//       </Backdrop>
//     );
//   }

//   if (!data || !formattedDate) {
//     return null;
//   }

//   return (
//     <div className={styles.root}>
//       <div className={styles.title}>{data.title}</div>
//       <div className={styles.date}>{formattedDate}</div>
//       <div className={styles.body}
//         dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }} />
//       <div className={styles.homeButton}>
//         <Button variant="outlined" onClick={() => navigate('/')}>Go back</Button>
//       </div>
//     </div>
//   );
// };

// export default RichTextDisplay;
