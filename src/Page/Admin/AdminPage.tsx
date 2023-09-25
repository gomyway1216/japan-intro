import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Tab, Tabs, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as postApi from '../../api/post';
import DataTable from '../../Component/Table/DataTable';
import styles from './admin-page.module.scss';
import { Post, TabPanelProps } from '../../types';


const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getPosts = async () => {
    // const ps = await postApi.getPosts(0);
    const ps = await postApi.getAllCategoryPosts();
    setPosts(ps);
  };

  useEffect(() => {
    getPosts();
    setLoading(false);
  }, []);

  // const handleCreatePost = async () => {
  //   // create the post and get id for the post so that post page can do auto saving with the id
  //   const docId = await postApi.createPost();
  //   navigate('/edit-post/' + docId);
  // };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>AdminPage</div>
      {/* <div className={styles.buttons}>
        <Button variant="outlined" onClick={handleCreatePost}
          className={styles.button}>Create Post</Button>
      </div> */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Post" {...a11yProps(0)} />
          <Tab label="Place Holder 1" {...a11yProps(1)} />
          <Tab label="Place Holder 2" {...a11yProps(2)} />
          <Tab label="Place Holder 3" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className={styles.post}>
          <div className={styles.subTitle}>Post Data</div>
          <DataTable
            data={posts}
            togglePublish={postApi.togglePostPublish}
            deleteData={postApi.deletePostByCategory}
            editLink="edit-post"
          />
        </div>
      </TabPanel>
    </div>
  );
};

export default AdminPage;