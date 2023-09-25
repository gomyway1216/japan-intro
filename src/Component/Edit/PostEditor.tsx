import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import { Button, FormGroup, FormControlLabel, TextField, Switch } from '@mui/material';
import DeleteItemDialog from '../Dialog/DeleteItemDialog';
import InstantMessage from '../PopUp/Alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './rich-text-editor.module.scss';
import { Post, PostEditorProps } from '../../types';
import { getPostCategories } from '../../api/post';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ImageUpload from '../Image/ImageUpload';
import { RichTextEditor } from '@mantine/rte';
import * as imageApi from '../../api/image';

const UPDATE_INTERVAL = 10000;

const PostEditor: React.FC<PostEditorProps> = (props) => {
  const [original, setOriginal] = useState<Post>();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState(props.category || '');
  const [isPublic, setPublic] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [autoSaveBody, setAutoSaveBody] = useState('');
  const [autoSaveTitle, setAutoSaveTitle] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | undefined>('');

  console.log('categoryList', categoryList);

  const titleRef = useRef<string>(title);
  const bodyRef = useRef<string>(body);
  const isPublicRef = useRef<boolean>(isPublic);
  const categoryRef = useRef<string>(category);

  const [status, setStatus] = useState<'idle' | 'updating' | 'deleting'>('idle');

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    bodyRef.current = body;
  }, [body]);

  useEffect(() => {
    isPublicRef.current = isPublic;
  }, [isPublic]);

  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  const fetchPost = async () => {
    // if id is defined, the rich text editor is expected to load the data from the server, if not, create a new post
    if (props.postId && props.category) {
      const doc = await props.getPost(props.postId, props.category);
      if (doc) {
        setTitle(doc.title);
        setBody(doc.body);
        setPublic(doc.isPublic);
        setOriginal(doc);
        setImageUrl(doc.image)
      } else {
        const msg = 'Post not found!';
        setErrorMessage(msg);
      }
    } else {
      const doc: Post = {
        id: '',
        title: '',
        body: '',
        isPublic: false,
        created: new Date(),
        lastUpdated: new Date(),
        category: '',
        image: imageUrl
      };
      setOriginal(doc);
    }
  };

  const fetchCategoryList = async () => {
    const categoryList = await getPostCategories();
    setCategoryList(categoryList);
  }

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    fetchCategoryList();
  }, []);


  const deepCompareBodyAndTitle = (body: string, title: string) => {
    if (autoSaveBody !== body || autoSaveTitle !== title) {
      setAutoSaveBody(body);
      setAutoSaveTitle(title);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (status === 'idle' && autoSave) {
      const interval = window.setInterval(() => {
        const item: Post = {
          id: props.postId!,
          title: titleRef.current,
          body: bodyRef.current,
          isPublic: isPublicRef.current,
          created: original?.created || new Date(), // update the timestamp
          lastUpdated: new Date(), // update the timestamp
          category: categoryRef.current,
          image: imageUrl
        };
        try {
          if (deepCompareBodyAndTitle(bodyRef.current, titleRef.current)) {
            setStatus('updating');
            props.updatePost(item);
            setStatus('idle');
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage('An error occurred');
          }
          setStatus('idle');
        }

      }, UPDATE_INTERVAL);
      setIntervalId(interval);

      return () => {
        if (intervalId !== null) {
          clearInterval(intervalId);
        }
      };
    } else {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    }
  }, [status, autoSave]);


  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onAutoSaveSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAutoSave(e.target.checked);
  };

  const onIsPublicSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPublic(e.target.checked);
  };


  const handleSave = async () => {
    setStatus('updating');
    const handleFunction = props.postId ? props.updatePost : props.createPost;

    const item: Post = {
      id: props.postId || '',
      title,
      body,
      isPublic,
      created: props.postId && original ? original.created : new Date(),
      lastUpdated: new Date(), // always update the timestamp
      category,
      image: imageUrl
    };

    try {
      await handleFunction(item);
      navigate(`/${category}/${props.postId || item.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An error occurred');
      }
    }
    setStatus('idle');
  };


  const handleClose = async () => {
    setStatus('updating');
    try {
      await props.updatePost(original!);
      if (props.postId) {
        navigate(`/${category}/${props.postId}`);
      } else {
        navigate(`/post`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An error occurred');
      }
    }
    setStatus('idle');
  };

  const handleDelete = async () => {
    setStatus('deleting');
    const updateStatus = await props.deletePost(props.postId!, props.category!);
    if (updateStatus) {
      navigate(`/${props.category}/${props.postId}`);
    } else {
      const msg = 'deletion of the post is failing!';
      setErrorMessage(msg);
    }
    setStatus('idle');
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleAlertClose = () => {
    setErrorMessage('');
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleImageUrl = (url: string) => {
    setImageUrl(url);
  }

  return (
    <div className={styles.root}>
      <div className={styles.subSection}>
        <div className={styles.titleWrapper}>
          <TextField id="outlined-basic" label="Title"
            variant="outlined" value={title}
            onChange={handleTitleChange}
            className={styles.title}
          />
        </div>
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            label="Age"
            onChange={handleCategoryChange}
          >
            {categoryList.map((category) => (
              <MenuItem value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={styles.switchWrapper}>
          {props.postId &&
            <FormGroup>
              <FormControlLabel
                className={styles.switch}
                control={
                  <Switch
                    checked={autoSave}
                    onChange={onAutoSaveSwitchChange}
                  />
                }
                label="Auto Save" />
            </FormGroup>
          }
          <FormGroup>
            <FormControlLabel
              className={styles.switch}
              control={
                <Switch
                  checked={isPublic}
                  onChange={onIsPublicSwitchChange}
                />
              }
              label="Publishing?" />
          </FormGroup>
        </div>
      </div>
      <ImageUpload handleImageUrl={handleImageUrl} originalImageUrl={imageUrl} />
      {/* <div className={styles.toolBar}>
        <EditorToolbar />
      </div>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder={'Write something awesome...'}
        value={body}
        onChange={setBody} /> */}
      <RichTextEditor value={body} onChange={setBody} onImageUpload={imageApi.getMenuImageRef} />
      <div className={styles.buttons}>
        <Button
          variant="outlined"
          onClick={handleSave}
          className={styles.button}>
          Save and Close
        </Button>
        <Button variant="outlined"
          color="error"
          onClick={handleClose}
          className={styles.button}>
          Close without Saving
        </Button>
        {props.postId && <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
          className={styles.button}
        >
          Delete
        </Button>
        }
      </div>
      <DeleteItemDialog open={deleteDialogOpen}
        onClose={handleDeleteDialogClose} callback={handleDelete}
        errorMessage={errorMessage} />
      {errorMessage && <InstantMessage message={errorMessage}
        onClose={handleAlertClose} />
      }
    </div>
  );
};

export default PostEditor;
