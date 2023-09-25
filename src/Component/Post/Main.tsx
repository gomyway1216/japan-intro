import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
// import Markdown from './Markdown';
import DOMPurify from 'dompurify';
import RichTextDisplay from '../Text/RichTextDisplay';
import { RichTextEditingData, PartialPost } from '../../types';
import { Link } from 'react-router-dom';

interface MainProps {
  posts: Array<PartialPost>;
  title: string;
}

const Main = (props: MainProps) => {
  const { posts, title } = props;


  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        '& .markdown': {
          py: 3,
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider />
      {posts.map((post) => (
        <Link key={post.id} to={`/${post.category}/${post.id}`}>{post.title}</Link>
      ))}
    </Grid>
  );
}

export default Main;